import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Logline, Comment } from "@/types/database";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  deleteLogline,
  deleteComment,
  updateLoglineCategory,
} from "@/lib/actions";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

export const dynamic = "force-dynamic";

async function getAdminData() {
  const adminClient = createAdminClient();

  const { data: loglines, error: loglinesError } = await adminClient
    .from("loglines")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: comments, error: commentsError } = await adminClient
    .from("comments")
    .select("*")
    .order("created_at", { ascending: false });

  if (loglinesError) console.error("Error fetching loglines:", loglinesError);
  if (commentsError) console.error("Error fetching comments:", commentsError);

  return {
    loglines: (loglines || []) as Logline[],
    comments: (comments || []) as Comment[],
  };
}

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { loglines, comments } = await getAdminData();

  return (
    <div className="flex flex-col gap-8">
      {/* Loglines */}
      <section>
        <h2 className="text-lg font-semibold mb-4">
          ログライン一覧 ({loglines.length})
        </h2>
        <div className="rounded-md border bg-white overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">本文</TableHead>
                <TableHead>カテゴリ</TableHead>
                <TableHead>シェア数</TableHead>
                <TableHead>コメント数</TableHead>
                <TableHead>投稿日時</TableHead>
                <TableHead className="w-[200px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loglines.map((logline) => (
                <TableRow key={logline.id}>
                  <TableCell className="font-medium">
                    <a
                      href={`/p/${logline.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {logline.content}
                    </a>
                  </TableCell>
                  <TableCell>
                    {logline.category ? (
                      <Badge variant="secondary">{logline.category}</Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>{logline.share_count}</TableCell>
                  <TableCell>{logline.comment_count}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(logline.created_at), {
                      addSuffix: true,
                      locale: ja,
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <form
                        action={async (formData: FormData) => {
                          "use server";
                          const category = formData.get("category") as string;
                          await updateLoglineCategory(logline.id, category);
                        }}
                        className="flex gap-2"
                      >
                        <Input
                          name="category"
                          defaultValue={logline.category || ""}
                          placeholder="カテゴリ"
                          className="h-8 text-sm"
                        />
                        <Button type="submit" size="sm" variant="outline">
                          更新
                        </Button>
                      </form>
                      <form
                        action={async () => {
                          "use server";
                          await deleteLogline(logline.id);
                        }}
                      >
                        <Button
                          type="submit"
                          size="sm"
                          variant="destructive"
                        >
                          削除
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Comments */}
      <section>
        <h2 className="text-lg font-semibold mb-4">
          コメント一覧 ({comments.length})
        </h2>
        <div className="rounded-md border bg-white overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">内容</TableHead>
                <TableHead>投稿者</TableHead>
                <TableHead>ログライン</TableHead>
                <TableHead>投稿日時</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell className="font-medium max-w-xs truncate">
                    {comment.content}
                  </TableCell>
                  <TableCell>{comment.author_name || "名無しさん"}</TableCell>
                  <TableCell>
                    <a
                      href={`/p/${comment.logline_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      リンク
                    </a>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(comment.created_at), {
                      addSuffix: true,
                      locale: ja,
                    })}
                  </TableCell>
                  <TableCell>
                    <form
                      action={async () => {
                        "use server";
                        await deleteComment(comment.id, comment.logline_id);
                      }}
                    >
                      <Button type="submit" size="sm" variant="destructive">
                        削除
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}

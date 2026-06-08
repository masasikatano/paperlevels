import { notFound } from "next/navigation";
import { getLoglineById, getComments } from "@/lib/data";
import { ShareButton } from "@/components/loglines/ShareButton";
import { CommentForm } from "@/components/comments/CommentForm";
import { CommentList } from "@/components/comments/CommentList";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

export const dynamic = "force-dynamic";

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { id } = await params;
  const logline = await getLoglineById(id);

  if (!logline) {
    notFound();
  }

  const comments = await getComments(id);

  const timeAgo = formatDistanceToNow(new Date(logline.created_at), {
    addSuffix: true,
    locale: ja,
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Logline Content */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold leading-relaxed text-foreground mb-4">
          {logline.content}
        </h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {logline.category && (
              <Badge variant="secondary">{logline.category}</Badge>
            )}
            <span className="text-sm text-muted-foreground">{timeAgo}</span>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              <span>{logline.comment_count}</span>
            </div>
          </div>
          <ShareButton
            id={logline.id}
            content={logline.content}
            initialCount={logline.share_count}
          />
        </div>
      </div>

      {/* Comments Section */}
      <div className="border-t pt-6">
        <h2 className="text-lg font-semibold mb-4">
          コメント ({comments.length})
        </h2>
        <div className="mb-6">
          <CommentForm loglineId={logline.id} />
        </div>
        <CommentList comments={comments} />
      </div>
    </div>
  );
}

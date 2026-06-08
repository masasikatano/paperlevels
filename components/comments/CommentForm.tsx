"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createComment } from "@/lib/actions";
import { toast } from "sonner";

interface CommentFormProps {
  loglineId: string;
}

export function CommentForm({ loglineId }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setPending(true);
    const result = await createComment(loglineId, content);
    setPending(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("コメントを投稿しました");
    setContent("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3"
    >
      <Textarea
        name="content"
        placeholder="コメントを入力（Markdown対応）"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        maxLength={5000}
        required
        className="resize-none bg-white"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {content.length} / 5000文字
        </span>
        <Button type="submit" disabled={pending} size="sm">
          {pending ? "投稿中..." : "コメントする"}
        </Button>
      </div>
    </form>
  );
}

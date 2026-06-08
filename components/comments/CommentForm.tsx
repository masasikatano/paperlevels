"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createComment } from "@/lib/actions";
import { toast } from "sonner";

interface CommentFormProps {
  loglineId: string;
}

export function CommentForm({ loglineId }: CommentFormProps) {
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    const result = await createComment(formData);
    setPending(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("コメントを投稿しました");
    setAuthorName("");
    setContent("");
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="flex flex-col gap-3"
    >
      <input type="hidden" name="logline_id" value={loglineId} />
      <Input
        name="author_name"
        placeholder="名前（任意、未入力時は名無しさん）"
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
        maxLength={30}
        className="bg-white"
      />
      <Textarea
        name="content"
        placeholder="コメントを入力（1〜1000文字、Markdown対応）"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        maxLength={1000}
        required
        className="resize-none bg-white"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {content.length} / 1000文字
        </span>
        <Button type="submit" disabled={pending} size="sm">
          {pending ? "投稿中..." : "コメントする"}
        </Button>
      </div>
    </form>
  );
}

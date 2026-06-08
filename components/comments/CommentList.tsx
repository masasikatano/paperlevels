"use client";

import { Comment } from "@/types/database";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { OgpPreview } from "./OgpPreview";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

interface CommentListProps {
  comments: Comment[];
}

function extractUrls(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s\)\]\>]+/g;
  const matches = text.match(urlRegex) || [];
  return Array.from(new Set(matches));
}

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-4">
        まだコメントがありません
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment) => {
        const urls = extractUrls(comment.content);
        return (
          <div
            key={comment.id}
            className="rounded-lg border bg-white p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">
                {comment.author_name || "名無しさん"}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.created_at), {
                  addSuffix: true,
                  locale: ja,
                })}
              </span>
            </div>
            <MarkdownRenderer content={comment.content} />
            {urls.length > 0 && (
              <div className="mt-2 flex flex-col gap-2">
                {urls.map((url) => (
                  <OgpPreview key={url} url={url} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

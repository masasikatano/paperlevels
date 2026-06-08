"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createLogline } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function LoglineForm() {
  const [content, setContent] = useState("");
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setPending(true);
    const result = await createLogline(formData);
    setPending(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("投稿しました！");
    setContent("");
    if (result.id) {
      router.push(`/p/${result.id}`);
    }
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="flex flex-col gap-3"
    >
      <Textarea
        name="content"
        placeholder="サイト・プロダクトの目的を一文で表現（1〜140文字）"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        maxLength={140}
        required
        className="resize-none bg-white"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {content.length} / 140文字
        </span>
        <Button type="submit" disabled={pending} size="sm">
          {pending ? "投稿中..." : "投稿する"}
        </Button>
      </div>
    </form>
  );
}

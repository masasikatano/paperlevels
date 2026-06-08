"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function createLogline(formData: FormData) {
  const content = formData.get("content") as string;

  if (!content || content.trim().length === 0 || content.trim().length > 140) {
    return { error: "ログラインは1〜140文字で入力してください" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("loglines")
    .insert({ content: content.trim() })
    .select()
    .single();

  if (error) {
    console.error("Error creating logline:", error);
    return { error: "投稿に失敗しました" };
  }

  revalidatePath("/");
  return { success: true, id: data.id };
}

export async function createComment(formData: FormData) {
  const loglineId = formData.get("logline_id") as string;
  const authorName = formData.get("author_name") as string;
  const content = formData.get("content") as string;

  if (!loglineId) {
    return { error: "ログラインIDが必要です" };
  }

  if (!content || content.trim().length === 0 || content.trim().length > 1000) {
    return { error: "コメントは1〜1000文字で入力してください" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("comments").insert({
    logline_id: loglineId,
    author_name: authorName?.trim() || null,
    content: content.trim(),
  });

  if (error) {
    console.error("Error creating comment:", error);
    return { error: "コメント投稿に失敗しました" };
  }

  const { data: current } = await supabase
    .from("loglines")
    .select("comment_count")
    .eq("id", loglineId)
    .single();

  if (current) {
    await supabase
      .from("loglines")
      .update({ comment_count: current.comment_count + 1 })
      .eq("id", loglineId);
  }

  revalidatePath(`/p/${loglineId}`);
  revalidatePath("/");
  return { success: true };
}

export async function deleteLogline(id: string) {
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return { error: "認証が必要です" };

  const supabase = createAdminClient();
  const { error } = await supabase.from("loglines").delete().eq("id", id);

  if (error) {
    console.error("Error deleting logline:", error);
    return { error: "削除に失敗しました" };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteComment(id: string, loglineId: string) {
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return { error: "認証が必要です" };

  const supabase = createAdminClient();
  const { error } = await supabase.from("comments").delete().eq("id", id);

  if (error) {
    console.error("Error deleting comment:", error);
    return { error: "削除に失敗しました" };
  }

  const { data: current } = await supabase
    .from("loglines")
    .select("comment_count")
    .eq("id", loglineId)
    .single();

  if (current && current.comment_count > 0) {
    await supabase
      .from("loglines")
      .update({ comment_count: current.comment_count - 1 })
      .eq("id", loglineId);
  }

  revalidatePath(`/p/${loglineId}`);
  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function updateLoglineCategory(id: string, category: string) {
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return { error: "認証が必要です" };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("loglines")
    .update({ category: category.trim() || null })
    .eq("id", id);

  if (error) {
    console.error("Error updating category:", error);
    return { error: "更新に失敗しました" };
  }

  revalidatePath("/");
  revalidatePath(`/p/${id}`);
  revalidatePath("/admin");
  return { success: true };
}

export async function incrementShareCount(id: string) {
  const supabase = await createClient();
  const { data: current, error: fetchError } = await supabase
    .from("loglines")
    .select("share_count")
    .eq("id", id)
    .single();

  if (fetchError || !current) {
    console.error("Error fetching share count:", fetchError);
    return { error: "カウントに失敗しました" };
  }

  const { error } = await supabase
    .from("loglines")
    .update({ share_count: current.share_count + 1 })
    .eq("id", id);

  if (error) {
    console.error("Error incrementing share count:", error);
    return { error: "カウントに失敗しました" };
  }

  revalidatePath("/");
  revalidatePath(`/p/${id}`);
  return { success: true };
}

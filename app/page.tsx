import { Suspense } from "react";
import { LoglineForm } from "@/components/loglines/LoglineForm";
import { LoglineCard } from "@/components/loglines/LoglineCard";
import { getLoglines } from "@/lib/data";
// import { Input } from "@/components/ui/input";
// import { Search } from "lucide-react";

export const dynamic = "force-dynamic";

interface HomePageProps {
  searchParams: Promise<{
    sort?: string;
    q?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const sort = params.sort === "newest" ? "newest" : "popular";
  const search = params.q || "";

  const loglines = await getLoglines(sort, search);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Hero */}
      <section className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
          あなたが欲しいサイトを1行で投稿
        </h1>
        {/* <p className="text-muted-foreground">
          1行でアイデアの需要を早期検証
        </p> */}
      </section>

      {/* Post Form */}
      <section className="mb-8">
        <LoglineForm />
      </section>

      {/* Search - コメントアウト中
      <section className="mb-4">
        <form className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            placeholder="検索..."
            defaultValue={search}
            className="pl-9 bg-white"
          />
          {sort !== "popular" && (
            <input type="hidden" name="sort" value={sort} />
          )}
        </form>
      </section>
      */}

      {/* Sort Tabs */}
      <div className="flex items-center gap-2 mb-4">
        <a
          href={`?${search ? `q=${encodeURIComponent(search)}&` : ""}sort=popular`}
          className={`inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium transition-colors ${
            sort === "popular"
              ? "bg-primary text-primary-foreground shadow"
              : "bg-white text-foreground hover:bg-muted border"
          }`}
        >
          人気順
        </a>
        <a
          href={`?${search ? `q=${encodeURIComponent(search)}&` : ""}sort=newest`}
          className={`inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium transition-colors ${
            sort === "newest"
              ? "bg-primary text-primary-foreground shadow"
              : "bg-white text-foreground hover:bg-muted border"
          }`}
        >
          新着順
        </a>
      </div>

      {/* List */}
      <Suspense fallback={<p className="text-center text-muted-foreground">読み込み中...</p>}>
        <div className="flex flex-col gap-4">
          {loglines.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              まだ投稿がありません
            </p>
          ) : (
            loglines.map((logline) => (
              <LoglineCard key={logline.id} logline={logline} />
            ))
          )}
        </div>
      </Suspense>
    </div>
  );
}

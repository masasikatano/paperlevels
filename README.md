# Paperlevels

ログラインで需要を測るPoCサイト。

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase (PostgreSQL + Auth)

## Getting Started

1. Supabase プロジェクトを作成し、`supabase/schema.sql` を実行してテーブルを作成
2. `.env.local` を作成し、以下の環境変数を設定

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

3. 依存関係をインストール

```bash
npm install
```

4. 開発サーバーを起動

```bash
npm run dev
```

5. ブラウザで [http://localhost:3000](http://localhost:3000) を開く

## Admin Setup

管理画面へのアクセスには Supabase Auth のユーザーが必要です。
Supabase Dashboard からメール＋パスワードでユーザーを作成してください。

## Features

- ログイン不要でログラインを投稿
- シェア数に基づく人気順 / 新着順のソート
- キーワード検索
- SNSシェア機能（Web Share API / X Intent）
- コメント機能（Markdown対応）
- 管理画面（認証・削除・カテゴリ編集）

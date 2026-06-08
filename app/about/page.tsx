export const metadata = {
  title: "About - Paperlevels",
  description: "Paperlevelsについて",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">About Paperlevels</h1>
      <div className="prose prose-sm max-w-none text-foreground">
        <p>
          Paperlevels（ペーパーレベルズ）は、AIエージェント時代にアイデアが先行しがちな状況で、
          ログライン（サイト・プロダクトの目的を一言で表すフック文）を通じてその需要を早期に検証するPoCサイトです。
        </p>
        <h2 className="text-lg font-semibold mt-6 mb-2">コンセプト</h2>
        <p>
          最小限の入力（ログライン一文）で、最大限のフィードバック（シェア数＋コメント）を得られる場所を目指しています。
        </p>
        <h2 className="text-lg font-semibold mt-6 mb-2">シェア数について</h2>
        <p>
          表示されているシェア数は、シェアボタンのクリック数をカウントしたものです。
          正確なSNS投稿数ではないことを予めご了承ください。
        </p>
        <h2 className="text-lg font-semibold mt-6 mb-2">コメントについて</h2>
        <p>
          コメントは追記専用です。元のログラインに対する補足・背景・関連情報を書き込むことができます。
          ユーザー側からの編集・削除はできません。
        </p>
        <h2 className="text-lg font-semibold mt-6 mb-2">お問い合わせ</h2>
        <p>
          不適切な投稿の通報や、その他のお問い合わせは管理者までお願いいたします。
        </p>
      </div>
    </div>
  );
}

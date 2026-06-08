import Link from "next/link";
import { FileText, Shield } from "lucide-react";

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">Paperlevels</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/about"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
          <Link
            href="/admin"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Shield className="h-4 w-4" />
            管理画面
          </Link>
        </nav>
      </div>
    </header>
  );
}

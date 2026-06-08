export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Paperlevels. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

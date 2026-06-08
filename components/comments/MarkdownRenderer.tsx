import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-sm max-w-none text-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node, ...props }) => (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline break-all"
            />
          ),
          code: ({ node, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <pre className="bg-muted p-3 rounded-md overflow-auto text-xs">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code
                className="bg-muted px-1 py-0.5 rounded text-xs"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

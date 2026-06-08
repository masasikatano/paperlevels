import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Share2 } from "lucide-react";
import { Logline } from "@/types/database";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

interface LoglineCardProps {
  logline: Logline;
}

export function LoglineCard({ logline }: LoglineCardProps) {
  const timeAgo = formatDistanceToNow(new Date(logline.created_at), {
    addSuffix: true,
    locale: ja,
  });

  return (
    <Link href={`/p/${logline.id}`} className="block">
      <Card className="hover:shadow-md transition-shadow bg-card">
        <CardContent className="p-5">
          <p className="text-base font-medium leading-relaxed text-foreground mb-3">
            {logline.content}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {logline.category && (
                <Badge variant="secondary">{logline.category}</Badge>
              )}
              <span className="text-xs text-muted-foreground">{timeAgo}</span>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1 text-sm">
                <Share2 className="h-4 w-4" />
                <span>{logline.share_count}</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <MessageSquare className="h-4 w-4" />
                <span>{logline.comment_count}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

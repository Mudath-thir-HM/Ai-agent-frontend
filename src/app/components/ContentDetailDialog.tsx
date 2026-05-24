import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { GeneratedContent } from "../types";
import { Copy, Download, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface ContentDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: GeneratedContent | null;
}

export function ContentDetailDialog({
  open,
  onOpenChange,
  content,
}: ContentDetailDialogProps) {
  if (!content) return null;

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(content.post_text);
    toast.success("Caption copied to clipboard!");
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([content.post_text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `content-${content.id.substring(0, 8)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Content downloaded!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Content Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status & Platform Badges */}
          <div className="flex items-center gap-3 flex-wrap">
            <Badge
              className={
                content.status === "draft"
                  ? "bg-muted-foreground text-background"
                  : content.status === "scheduled"
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent text-accent-foreground"
              }
            >
              {content.status.charAt(0).toUpperCase() + content.status.slice(1)}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {content.target_platform}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {content.content_type}
            </Badge>
          </div>

          {/* Media Preview */}
          {content.media_urls && content.media_urls.length > 0 && (
            <div className="rounded-lg overflow-hidden border border-border bg-muted h-64">
              <img
                src={content.media_urls[0]}
                alt="Content preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Caption */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Caption</label>
            <div className="bg-muted/50 border border-border rounded-lg p-4 text-foreground whitespace-pre-wrap break-words">
              {content.post_text}
            </div>
          </div>

          {/* Hashtags */}
          {content.hashtags && content.hashtags.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Hashtags</label>
              <div className="flex flex-wrap gap-2">
                {content.hashtags.map((tag, idx) => (
                  <Badge key={idx} variant="outline" className="text-primary">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Call to Action */}
          {content.call_to_action && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Call to Action</label>
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 text-foreground">
                {content.call_to_action}
              </div>
            </div>
          )}

          {/* Meta Information */}
          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Created {format(new Date(content.created_at), "PPp")}</span>
            </div>
            {content.prompt && (
              <div>
                <span className="font-medium text-foreground block mb-1">AI Prompt:</span>
                <span className="line-clamp-2">{content.prompt}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              onClick={handleCopyCaption}
              variant="outline"
              className="flex-1 border-border text-foreground hover:bg-muted"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Caption
            </Button>
            <Button
              onClick={handleDownload}
              variant="outline"
              className="flex-1 border-border text-foreground hover:bg-muted"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import {
  Image as ImageIcon,
  Calendar,
  Clock,
  Download,
  Edit2,
  Trash2,
  Instagram,
  Facebook,
  Twitter,
  MoreVertical,
  Sparkles,
  Copy,
  Send,
  Eye,
  Loader2,
  MessageCircle
} from "lucide-react";
import { motion } from "motion/react";
import { useGetGeneratedContentQuery, useSchedulePostMutation } from "../../store/apiSlice";
import { useAppDispatch } from "../../store/hooks";
import { setCanvasOpen } from "../../store/uiSlice";
import { format, addDays } from "date-fns";
import { GeneratedContent } from "../../types";
import { toast } from "sonner";
import { ContentDetailDialog } from "../../components/ContentDetailDialog";
import { EditContentDialog } from "../../components/EditContentDialog";

const platformIcons = {
  instagram: Instagram,
  facebook: Facebook,
  x: Twitter,
  linkedin: MessageCircle,
  tiktok: MessageCircle,
  all: Sparkles,
};

export function GeneratedContentView() {
  const dispatch = useAppDispatch();
  const [selectedContent, setSelectedContent] = useState<GeneratedContent | null>(null);
  const [detailContent, setDetailContent] = useState<GeneratedContent | null>(null);
  const [editContent, setEditContent] = useState<GeneratedContent | null>(null);
  const [filter, setFilter] = useState<"all" | "draft" | "scheduled" | "posted">("all");
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduleCaption, setScheduleCaption] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("instagram");

  const { data: contentList = [], isLoading } = useGetGeneratedContentQuery();
  const [schedulePost, { isLoading: isScheduling }] = useSchedulePostMutation();

  const filteredContent = contentList.filter((content) => {
    if (filter === "all") return true;
    return content.status === filter;
  });

  const handleSchedulePost = async () => {
    if (!selectedContent || !scheduleDate || !scheduleTime) {
      toast.error("Please fill in all fields");
      return;
    }

    const scheduled_for = new Date(`${scheduleDate}T${scheduleTime}:00`).toISOString();

    try {
      await schedulePost({
        platform: selectedPlatform as any,
        post_text: scheduleCaption || selectedContent.post_text,
        scheduled_for,
      }).unwrap();

      toast.success("Post scheduled successfully! 🎉");
      setIsScheduleDialogOpen(false);
      // Reset form
      setScheduleDate("");
      setScheduleTime("");
      setScheduleCaption("");
      setSelectedContent(null);
    } catch (err: any) {
      toast.error(err?.data?.detail ?? "Failed to schedule post. Please try again.");
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Generated Content</h1>
          <p className="text-muted-foreground">Manage your AI-generated posts and media</p>
        </div>
        <Button 
          onClick={() => dispatch(setCanvasOpen(true))}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Generate New
        </Button>
      </div>

      {/* Filter Tabs */}
      <Tabs defaultValue="all" value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
        <TabsList className="bg-muted border border-border">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            All Content ({contentList.length})
          </TabsTrigger>
          <TabsTrigger value="draft" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            Drafts ({contentList.filter(c => c.status === "draft").length})
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            Scheduled ({contentList.filter(c => c.status === "scheduled").length})
          </TabsTrigger>
          <TabsTrigger value="posted" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            Posted ({contentList.filter(c => c.status === "posted").length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Content Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((content, index) => {
            const PlatformIcon = platformIcons[content.target_platform as keyof typeof platformIcons] || Sparkles;

            return (
              <motion.div
                key={content.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-border bg-card/50 backdrop-blur overflow-hidden group hover:border-primary/50 transition-colors shadow-sm">
                  {/* Image Preview */}
                  <div className={`relative aspect-square bg-muted flex items-center justify-center overflow-hidden`}>
                    {content.media_urls && content.media_urls.length > 0 ? (
                      <img src={content.media_urls[0]} alt="Content preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-6 text-center h-full w-full bg-gradient-to-br from-primary/10 to-accent/10">
                         <p className="text-sm text-foreground line-clamp-6">{content.post_text}</p>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className={
                        content.status === "draft"
                          ? "bg-muted-foreground text-background"
                          : content.status === "scheduled"
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent text-accent-foreground"
                      }>
                        {content.status}
                      </Badge>
                    </div>

                    {/* Platform Badge */}
                    <div className="absolute top-3 right-3">
                      <div className="w-8 h-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center shadow-sm">
                        <PlatformIcon className="w-4 h-4 text-foreground" />
                      </div>
                    </div>

                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-white hover:bg-white/20"
                        onClick={() => {
                          setDetailContent(content);
                          setIsDetailDialogOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-white hover:bg-white/20"
                        onClick={() => {
                          setEditContent(content);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      {content.media_urls && content.media_urls.length > 0 && (
                        <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-4 space-y-3">
                    {/* Caption */}
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {content.post_text}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        <span>{format(new Date(content.created_at), "MMM d, h:mm a")}</span>
                      </div>
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {content.content_type}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t border-border mt-2">
                      {content.status === "draft" && (
                        <>
                          <Dialog open={isScheduleDialogOpen && selectedContent?.id === content.id} onOpenChange={(open) => {
                            setIsScheduleDialogOpen(open);
                            if (open) {
                              setSelectedContent(content);
                              setScheduleCaption(content.post_text);
                              setSelectedPlatform(content.target_platform || "instagram");
                              setScheduleDate(format(addDays(new Date(), 1), "yyyy-MM-dd"));
                              setScheduleTime("09:00");
                            }
                          }}>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                              >
                                <Calendar className="w-3 h-3 mr-1" />
                                Schedule
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-card border-border">
                              <DialogHeader>
                                <DialogTitle className="text-foreground">Schedule Post</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label className="text-foreground">Platform</Label>
                                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                                    <SelectTrigger className="bg-input border-border text-foreground">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="instagram">Instagram</SelectItem>
                                      <SelectItem value="facebook">Facebook</SelectItem>
                                      <SelectItem value="twitter">X (Twitter)</SelectItem>
                                      <SelectItem value="all">All Platforms</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-foreground">Date</Label>
                                  <Input
                                    type="date"
                                    value={scheduleDate}
                                    onChange={(e) => setScheduleDate(e.target.value)}
                                    className="bg-input border-border text-foreground [color-scheme:dark]"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-foreground">Time</Label>
                                  <Input
                                    type="time"
                                    value={scheduleTime}
                                    onChange={(e) => setScheduleTime(e.target.value)}
                                    className="bg-input border-border text-foreground [color-scheme:dark]"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-foreground">Caption</Label>
                                  <Textarea
                                    value={scheduleCaption}
                                    onChange={(e) => setScheduleCaption(e.target.value)}
                                    placeholder="Edit caption or leave empty to use original"
                                    className="min-h-[100px] bg-input border-border text-foreground resize-none"
                                  />
                                </div>

                                <Button
                                  onClick={handleSchedulePost}
                                  disabled={isScheduling}
                                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
                                >
                                  {isScheduling ? (
                                    <>
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                      Scheduling...
                                    </>
                                  ) : (
                                    <>
                                      <Send className="w-4 h-4 mr-2" />
                                      Schedule Post
                                    </>
                                  )}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button size="sm" variant="outline" className="border-border text-foreground hover:bg-muted">
                            <Edit2 className="w-3 h-3" />
                          </Button>
                        </>
                      )}

                      {content.status === "scheduled" && (
                        <>
                          <Button size="sm" className="flex-1 bg-accent hover:bg-accent/80 text-accent-foreground">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="border-border text-foreground hover:bg-muted">
                            <Edit2 className="w-3 h-3" />
                          </Button>
                        </>
                      )}

                      {content.status === "posted" && (
                        <>
                          <Button size="sm" className="flex-1 bg-muted hover:bg-muted/80 text-foreground border border-border">
                            <Copy className="w-3 h-3 mr-1" />
                            Duplicate
                          </Button>
                          <Button size="sm" variant="outline" className="border-border text-foreground hover:bg-muted">
                            <MoreVertical className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {!isLoading && filteredContent.length === 0 && (
        <div className="text-center py-20">
          <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No content found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Generate your first AI-powered post to get started
          </p>
          <Button 
            onClick={() => dispatch(setCanvasOpen(true))}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Content
          </Button>
        </div>
      )}

      {/* Dialog Components */}
      <ContentDetailDialog 
        open={isDetailDialogOpen} 
        onOpenChange={setIsDetailDialogOpen} 
        content={detailContent} 
      />
      <EditContentDialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
        content={editContent} 
      />
    </div>
  );
}

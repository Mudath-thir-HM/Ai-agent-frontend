import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
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
  Eye
} from "lucide-react";
import { motion } from "motion/react";

interface GeneratedContent {
  id: number;
  type: "image" | "carousel" | "video";
  caption: string;
  imageUrl?: string;
  platform: "instagram" | "facebook" | "twitter" | "all";
  status: "draft" | "scheduled" | "posted";
  scheduledDate?: string;
  generatedAt: string;
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
  };
}

const mockContent: GeneratedContent[] = [
  {
    id: 1,
    type: "image",
    caption: "Transform your social media presence with AI-powered content creation. 🚀✨ #SocialMedia #AI #Marketing",
    imageUrl: "gradient-1",
    platform: "all",
    status: "draft",
    generatedAt: "2 hours ago",
  },
  {
    id: 2,
    type: "carousel",
    caption: "5 tips to boost your engagement this week! Swipe to learn more 👉 #MarketingTips #SocialMediaStrategy",
    imageUrl: "gradient-2",
    platform: "instagram",
    status: "scheduled",
    scheduledDate: "2026-05-24 10:00 AM",
    generatedAt: "5 hours ago",
  },
  {
    id: 3,
    type: "image",
    caption: "Behind the scenes: How we create content that converts 💡 #ContentCreation #BehindTheScenes",
    imageUrl: "gradient-3",
    platform: "facebook",
    status: "posted",
    scheduledDate: "2026-05-22 2:00 PM",
    generatedAt: "1 day ago",
    engagement: {
      likes: 342,
      comments: 28,
      shares: 15,
    },
  },
  {
    id: 4,
    type: "image",
    caption: "New feature alert! 🎉 Check out what we've been working on. Link in bio! #ProductLaunch #Innovation",
    imageUrl: "gradient-4",
    platform: "twitter",
    status: "draft",
    generatedAt: "3 hours ago",
  },
  {
    id: 5,
    type: "image",
    caption: "Monday motivation: Your only limit is you 💪✨ #MondayMotivation #Inspiration",
    imageUrl: "gradient-5",
    platform: "all",
    status: "scheduled",
    scheduledDate: "2026-05-26 9:00 AM",
    generatedAt: "1 day ago",
  },
];

const platformIcons = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  all: Sparkles,
};

const gradients = [
  "from-[#13005A] to-[#00337C]",
  "from-[#00337C] to-[#1C82AD]",
  "from-[#1C82AD] to-[#03C988]",
  "from-[#13005A] to-[#03C988]",
  "from-[#00337C] to-[#03C988]",
];

export function GeneratedContentView() {
  const [selectedContent, setSelectedContent] = useState<GeneratedContent | null>(null);
  const [filter, setFilter] = useState<"all" | "draft" | "scheduled" | "posted">("all");
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("instagram");

  const filteredContent = mockContent.filter((content) => {
    if (filter === "all") return true;
    return content.status === filter;
  });

  const handleSchedulePost = () => {
    console.log("Scheduling post:", selectedContent?.id, scheduleDate, scheduleTime, selectedPlatform);
    setIsScheduleDialogOpen(false);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Generated Content</h1>
          <p className="text-zinc-400">Manage your AI-generated posts and media</p>
        </div>
        <Button className="bg-gradient-to-r from-[#13005A] to-[#00337C] hover:opacity-90">
          <Sparkles className="w-4 h-4 mr-2" />
          Generate New
        </Button>
      </div>

      {/* Filter Tabs */}
      <Tabs defaultValue="all" value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
        <TabsList className="bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="all" className="data-[state=active]:bg-[#13005A]/20 data-[state=active]:text-[#03C988]">
            All Content ({mockContent.length})
          </TabsTrigger>
          <TabsTrigger value="draft" className="data-[state=active]:bg-[#13005A]/20 data-[state=active]:text-[#03C988]">
            Drafts ({mockContent.filter(c => c.status === "draft").length})
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="data-[state=active]:bg-[#13005A]/20 data-[state=active]:text-[#03C988]">
            Scheduled ({mockContent.filter(c => c.status === "scheduled").length})
          </TabsTrigger>
          <TabsTrigger value="posted" className="data-[state=active]:bg-[#13005A]/20 data-[state=active]:text-[#03C988]">
            Posted ({mockContent.filter(c => c.status === "posted").length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map((content, index) => {
          const PlatformIcon = platformIcons[content.platform];
          const gradient = gradients[index % gradients.length];

          return (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur overflow-hidden group hover:border-[#1C82AD] transition-colors">
                {/* Image Preview */}
                <div className={`relative aspect-square bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                  <ImageIcon className="w-16 h-16 text-white/30" />

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className={
                      content.status === "draft"
                        ? "bg-zinc-700 text-white"
                        : content.status === "scheduled"
                        ? "bg-[#00337C] text-white"
                        : "bg-[#03C988] text-white"
                    }>
                      {content.status}
                    </Badge>
                  </div>

                  {/* Platform Badge */}
                  <div className="absolute top-3 right-3">
                    <div className="w-8 h-8 rounded-full bg-black/30 backdrop-blur flex items-center justify-center">
                      <PlatformIcon className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-4 space-y-3">
                  {/* Caption */}
                  <p className="text-sm text-zinc-300 line-clamp-2">
                    {content.caption}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Clock className="w-3 h-3" />
                    <span>{content.generatedAt}</span>
                  </div>

                  {/* Scheduled Date */}
                  {content.scheduledDate && (
                    <div className="flex items-center gap-2 text-xs text-[#1C82AD]">
                      <Calendar className="w-3 h-3" />
                      <span>{content.scheduledDate}</span>
                    </div>
                  )}

                  {/* Engagement Stats */}
                  {content.engagement && (
                    <div className="flex items-center gap-4 text-xs text-zinc-500 pt-2 border-t border-zinc-800">
                      <span>❤️ {content.engagement.likes}</span>
                      <span>💬 {content.engagement.comments}</span>
                      <span>🔄 {content.engagement.shares}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    {content.status === "draft" && (
                      <>
                        <Dialog open={isScheduleDialogOpen && selectedContent?.id === content.id} onOpenChange={setIsScheduleDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              className="flex-1 bg-[#00337C] hover:bg-[#00337C]/80"
                              onClick={() => setSelectedContent(content)}
                            >
                              <Calendar className="w-3 h-3 mr-1" />
                              Schedule
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-zinc-900 border-zinc-800">
                            <DialogHeader>
                              <DialogTitle className="text-white">Schedule Post</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label className="text-white">Platform</Label>
                                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
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
                                <Label className="text-white">Date</Label>
                                <Input
                                  type="date"
                                  value={scheduleDate}
                                  onChange={(e) => setScheduleDate(e.target.value)}
                                  className="bg-zinc-800 border-zinc-700 text-white"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label className="text-white">Time</Label>
                                <Input
                                  type="time"
                                  value={scheduleTime}
                                  onChange={(e) => setScheduleTime(e.target.value)}
                                  className="bg-zinc-800 border-zinc-700 text-white"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label className="text-white">Caption</Label>
                                <Textarea
                                  defaultValue={content.caption}
                                  className="min-h-[100px] bg-zinc-800 border-zinc-700 text-white resize-none"
                                />
                              </div>

                              <Button
                                onClick={handleSchedulePost}
                                className="w-full bg-gradient-to-r from-[#13005A] to-[#00337C] hover:opacity-90"
                              >
                                <Send className="w-4 h-4 mr-2" />
                                Schedule Post
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button size="sm" variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
                          <Edit2 className="w-3 h-3" />
                        </Button>
                      </>
                    )}

                    {content.status === "scheduled" && (
                      <>
                        <Button size="sm" className="flex-1 bg-[#03C988] hover:bg-[#03C988]/80">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
                          <Edit2 className="w-3 h-3" />
                        </Button>
                      </>
                    )}

                    {content.status === "posted" && (
                      <>
                        <Button size="sm" className="flex-1 bg-zinc-800 hover:bg-zinc-700">
                          <Copy className="w-3 h-3 mr-1" />
                          Duplicate
                        </Button>
                        <Button size="sm" variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
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

      {filteredContent.length === 0 && (
        <div className="text-center py-20">
          <ImageIcon className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No content found</h3>
          <p className="text-sm text-zinc-500 mb-4">
            Generate your first AI-powered post to get started
          </p>
          <Button className="bg-gradient-to-r from-[#13005A] to-[#00337C] hover:opacity-90">
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Content
          </Button>
        </div>
      )}
    </div>
  );
}

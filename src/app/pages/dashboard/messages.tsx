import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Textarea } from "../../components/ui/textarea";
import { Facebook, Instagram, Twitter, Send, Heart, MessageCircle, MoreVertical, CheckCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: number;
  platform: "instagram" | "facebook" | "twitter";
  type: "comment" | "dm";
  author: string;
  avatar: string;
  content: string;
  postContext?: string;
  timestamp: string;
  isRead: boolean;
  hasReplied?: boolean;
}

const mockMessages: Message[] = [
  {
    id: 1,
    platform: "instagram",
    type: "comment",
    author: "sarah_designs",
    avatar: "SD",
    content: "This is absolutely amazing! Where can I learn more about this?",
    postContext: "Product Launch Announcement",
    timestamp: "2 hours ago",
    isRead: false,
  },
  {
    id: 2,
    platform: "facebook",
    type: "dm",
    author: "Mike Johnson",
    avatar: "MJ",
    content: "Hey! I'm interested in collaborating on a project. Do you have time for a quick call?",
    timestamp: "3 hours ago",
    isRead: false,
  },
  {
    id: 3,
    platform: "twitter",
    type: "comment",
    author: "@techguru_alex",
    avatar: "TA",
    content: "Game changer! How long did it take you to build this?",
    postContext: "Behind the Scenes Update",
    timestamp: "5 hours ago",
    isRead: true,
    hasReplied: true,
  },
  {
    id: 4,
    platform: "instagram",
    type: "dm",
    author: "emma_creates",
    avatar: "EC",
    content: "Love your content! Would you be interested in a partnership?",
    timestamp: "1 day ago",
    isRead: true,
  },
  {
    id: 5,
    platform: "facebook",
    type: "comment",
    author: "David Chen",
    avatar: "DC",
    content: "This is exactly what I was looking for! Thank you for sharing!",
    postContext: "Tutorial Video",
    timestamp: "1 day ago",
    isRead: true,
  },
  {
    id: 6,
    platform: "twitter",
    type: "dm",
    author: "@marketingpro",
    avatar: "MP",
    content: "Impressive work! Are you available for freelance projects?",
    timestamp: "2 days ago",
    isRead: true,
    hasReplied: true,
  },
];

const platformIcons = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
};

const platformColors = {
  instagram: "from-[#13005A] to-[#1C82AD]",
  facebook: "from-[#00337C] to-[#1C82AD]",
  twitter: "from-zinc-800 to-zinc-700",
};

export function MessagesView() {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "comments" | "dms">("all");

  const filteredMessages = mockMessages.filter((msg) => {
    if (filter === "unread") return !msg.isRead;
    if (filter === "comments") return msg.type === "comment";
    if (filter === "dms") return msg.type === "dm";
    return true;
  });

  const unreadCount = mockMessages.filter((m) => !m.isRead).length;

  const handleSendReply = () => {
    if (replyText.trim() && selectedMessage) {
      console.log("Sending reply:", replyText, "to", selectedMessage.author);
      setReplyText("");
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Messages & Comments</h1>
          <p className="text-zinc-400">Manage all your social interactions in one place</p>
        </div>
        {unreadCount > 0 && (
          <Badge className="bg-[#00337C] text-white px-3 py-1">
            {unreadCount} unread
          </Badge>
        )}
      </div>

      {/* Filter Tabs */}
      <Tabs defaultValue="all" value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
        <TabsList className="bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="all" className="data-[state=active]:bg-[#13005A]/20 data-[state=active]:text-[#03C988]">
            All Messages
          </TabsTrigger>
          <TabsTrigger value="unread" className="data-[state=active]:bg-[#13005A]/20 data-[state=active]:text-[#03C988]">
            Unread ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="comments" className="data-[state=active]:bg-[#13005A]/20 data-[state=active]:text-[#03C988]">
            Comments
          </TabsTrigger>
          <TabsTrigger value="dms" className="data-[state=active]:bg-[#13005A]/20 data-[state=active]:text-[#03C988]">
            Direct Messages
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages List */}
        <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Inbox</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="max-h-[600px] overflow-y-auto space-y-2 pr-2">
              <AnimatePresence mode="popLayout">
                {filteredMessages.map((message) => {
                  const Icon = platformIcons[message.platform];
                  const isSelected = selectedMessage?.id === message.id;

                  return (
                    <motion.button
                      key={message.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={() => setSelectedMessage(message)}
                      className={`w-full p-4 rounded-lg border transition-all text-left ${
                        isSelected
                          ? "border-[#1C82AD] bg-[#1C82AD]/10"
                          : message.isRead
                          ? "border-zinc-800 bg-zinc-800/30 hover:bg-zinc-800/50"
                          : "border-[#1C82AD]/30 bg-[#1C82AD]/5 hover:bg-[#1C82AD]/10"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10 flex-shrink-0">
                          <AvatarFallback className={`bg-gradient-to-br ${platformColors[message.platform]} text-white text-sm`}>
                            {message.avatar}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white truncate">{message.author}</span>
                            <Icon className="w-3 h-3 text-zinc-500 flex-shrink-0" />
                            {message.type === "dm" ? (
                              <MessageCircle className="w-3 h-3 text-zinc-500 flex-shrink-0" />
                            ) : (
                              <MessageCircle className="w-3 h-3 text-zinc-500 flex-shrink-0" />
                            )}
                          </div>

                          {message.postContext && (
                            <p className="text-xs text-[#1C82AD] mb-1">on "{message.postContext}"</p>
                          )}

                          <p className="text-sm text-zinc-400 line-clamp-2 mb-2">{message.content}</p>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-600">{message.timestamp}</span>
                            {message.hasReplied && (
                              <div className="flex items-center gap-1 text-green-500">
                                <CheckCheck className="w-3 h-3" />
                                <span className="text-xs">Replied</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {!message.isRead && (
                          <div className="w-2 h-2 rounded-full bg-[#03C988] flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>

              {filteredMessages.length === 0 && (
                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                  <p className="text-zinc-500">No messages to display</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Message Detail & Reply */}
        <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
          <CardHeader className="border-b border-zinc-800">
            <CardTitle className="text-white">
              {selectedMessage ? "Reply" : "Select a message"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {selectedMessage ? (
              <div className="space-y-6">
                {/* Message Detail */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className={`bg-gradient-to-br ${platformColors[selectedMessage.platform]} text-white`}>
                        {selectedMessage.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white">{selectedMessage.author}</h3>
                        {(() => {
                          const Icon = platformIcons[selectedMessage.platform];
                          return <Icon className="w-4 h-4 text-zinc-500" />;
                        })()}
                      </div>
                      {selectedMessage.postContext && (
                        <p className="text-sm text-[#1C82AD] mb-2">
                          {selectedMessage.type === "comment" ? "Commented" : "Messaged you"} • {selectedMessage.timestamp}
                        </p>
                      )}
                      {!selectedMessage.postContext && (
                        <p className="text-sm text-zinc-500 mb-2">{selectedMessage.timestamp}</p>
                      )}
                    </div>
                    <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>

                  {selectedMessage.postContext && (
                    <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3">
                      <p className="text-xs text-zinc-500 mb-1">Context</p>
                      <p className="text-sm text-white">{selectedMessage.postContext}</p>
                    </div>
                  )}

                  <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-800">
                    <p className="text-white">{selectedMessage.content}</p>
                  </div>

                  {selectedMessage.hasReplied && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCheck className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-green-500">You replied</span>
                      </div>
                      <p className="text-sm text-zinc-400">
                        "Thanks so much! It took about 3 months of focused work. Really appreciate your support!"
                      </p>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Like
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    Archive
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    Mark as Read
                  </Button>
                </div>

                {/* Reply Box */}
                <div className="space-y-3">
                  <div className="relative">
                    <Textarea
                      placeholder="Write your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="min-h-[120px] bg-zinc-800 border-zinc-700 text-white resize-none pr-12"
                    />
                    <Button
                      size="icon"
                      onClick={handleSendReply}
                      disabled={!replyText.trim()}
                      className="absolute bottom-3 right-3 w-9 h-9 bg-gradient-to-r from-[#13005A] to-[#00337C] hover:opacity-90 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge variant="outline" className="border-zinc-700 text-zinc-400 text-xs">
                        AI Suggest Reply
                      </Badge>
                    </div>
                    <span className="text-xs text-zinc-600">{replyText.length} / 500</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <MessageCircle className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No message selected</h3>
                <p className="text-sm text-zinc-500">
                  Choose a message from the list to view and reply
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

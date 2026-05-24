import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Textarea } from "../../components/ui/textarea";
import {
  Facebook,
  Instagram,
  Twitter,
  Send,
  Heart,
  MessageCircle,
  MoreVertical,
  CheckCheck,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  useGetMessagesQuery,
  useReplyToMessageMutation,
} from "../../store/apiSlice";
import { Message } from "../../types";
import { toast } from "sonner";
import { format } from "date-fns";

const platformIcons = {
  instagram: Instagram,
  facebook: Facebook,
  x: Twitter,
  linkedin: MessageCircle,
  tiktok: MessageCircle,
};

const platformColors = {
  instagram: "text-pink-600 bg-pink-100",
  facebook: "text-blue-600 bg-blue-100",
  x: "text-zinc-900 bg-zinc-200 dark:text-zinc-100 dark:bg-zinc-800",
  linkedin: "text-blue-700 bg-blue-100",
  tiktok: "text-black bg-gray-200 dark:text-white dark:bg-zinc-800",
};

export function MessagesView() {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "comments" | "dms">(
    "all",
  );

  const { data: messages = [], isLoading } = useGetMessagesQuery();
  const [replyToMessage, { isLoading: isReplying }] =
    useReplyToMessageMutation();

  const filteredMessages = messages.filter((msg) => {
    if (filter === "unread") return !msg.is_replied;
    if (filter === "comments") return msg.type === "comment";
    if (filter === "dms") return msg.type === "dm";
    return true;
  });

  const unreadCount = messages.filter((m) => !m.is_replied).length;

  const handleSendReply = async () => {
    if (replyText.trim() && selectedMessage) {
      try {
        await replyToMessage({
          messageId: selectedMessage.id.toString(),
          reply_text: replyText,
        }).unwrap();
        toast.success("Reply sent successfully");
        setReplyText("");
        // Deselect or keep selected, it's up to UX. We'll keep it selected to show the reply if the backend returns it
      } catch (err: any) {
        toast.error(err.data?.detail || "Failed to send reply");
      }
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Messages & Comments
          </h1>
          <p className="text-muted-foreground">
            Manage all your social interactions in one place
          </p>
        </div>
        {unreadCount > 0 && (
          <Badge className="bg-primary text-primary-foreground px-3 py-1">
            {unreadCount} unread
          </Badge>
        )}
      </div>

      {/* Filter Tabs */}
      <Tabs
        defaultValue="all"
        value={filter}
        onValueChange={(v) => setFilter(v as typeof filter)}
      >
        <TabsList className="bg-muted border border-border">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            All Messages
          </TabsTrigger>
          <TabsTrigger
            value="unread"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            Unread ({unreadCount})
          </TabsTrigger>
          <TabsTrigger
            value="comments"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            Comments
          </TabsTrigger>
          <TabsTrigger
            value="dms"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            Direct Messages
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages List */}
        <Card className="border-border bg-card/50 backdrop-blur shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Inbox</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="max-h-[600px] overflow-y-auto space-y-2 pr-2">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredMessages.map((message) => {
                    const Icon =
                      platformIcons[
                        message.platform as keyof typeof platformIcons
                      ] || MessageCircle;
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
                            ? "border-primary bg-primary/10"
                            : message.is_replied
                              ? "border-border bg-muted/30 hover:bg-muted/50"
                              : "border-primary/30 bg-primary/5 hover:bg-primary/10"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="w-10 h-10 flex-shrink-0">
                            <AvatarFallback
                              className={`${platformColors[message.platform as keyof typeof platformColors] || "bg-muted"} text-sm`}
                            >
                              {message.author_name
                                .substring(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-foreground truncate">
                                {message.author_name}
                              </span>
                              <Icon className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                              {message.type === "dm" ? (
                                <MessageCircle className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                              ) : (
                                <MessageCircle className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                              )}
                            </div>

                            {message.post_id && (
                              <p className="text-xs text-primary mb-1">
                                on Post {message.post_id}
                              </p>
                            )}

                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {message.content}
                            </p>

                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(message.created_at), "PPp")}
                              </span>
                              {message.is_replied && (
                                <div className="flex items-center gap-1 text-accent">
                                  <CheckCheck className="w-3 h-3" />
                                  <span className="text-xs">Replied</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {!message.is_replied && (
                            <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-1" />
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              )}

              {!isLoading && filteredMessages.length === 0 && (
                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    No messages to display
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Message Detail & Reply */}
        <Card className="border-border bg-card/50 backdrop-blur shadow-sm">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-foreground">
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
                      <AvatarFallback
                        className={`${platformColors[selectedMessage.platform as keyof typeof platformColors] || "bg-muted"}`}
                      >
                        {selectedMessage.author_name
                          .substring(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">
                          {selectedMessage.author_name}
                        </h3>
                        {(() => {
                          const Icon =
                            platformIcons[
                              selectedMessage.platform as keyof typeof platformIcons
                            ] || MessageCircle;
                          return (
                            <Icon className="w-4 h-4 text-muted-foreground" />
                          );
                        })()}
                      </div>
                      {selectedMessage.post_id && (
                        <p className="text-sm text-primary mb-2">
                          {selectedMessage.type === "comment"
                            ? "Commented"
                            : "Messaged you"}{" "}
                          •{" "}
                          {format(new Date(selectedMessage.created_at), "PPp")}
                        </p>
                      )}
                      {!selectedMessage.post_id && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {format(new Date(selectedMessage.created_at), "PPp")}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>

                  {selectedMessage.post_id && (
                    <div className="bg-muted/50 border border-border rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">
                        Context
                      </p>
                      <p className="text-sm text-foreground">
                        Post ID: {selectedMessage.post_id}
                      </p>
                    </div>
                  )}

                  <div className="bg-muted/30 rounded-lg p-4 border border-border">
                    <p className="text-foreground">{selectedMessage.content}</p>
                  </div>

                  {selectedMessage.is_replied && (
                    <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCheck className="w-4 h-4 text-accent" />
                        <span className="text-sm font-medium text-accent">
                          You replied
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Like
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    Archive
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    Mark as Read
                  </Button>
                </div>

                {/* Reply Box */}
                {!selectedMessage.is_replied && (
                  <div className="space-y-3">
                    <div className="relative">
                      <Textarea
                        placeholder="Write your reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="min-h-[120px] bg-input border-border text-foreground resize-none pr-12"
                      />
                      <Button
                        size="icon"
                        onClick={handleSendReply}
                        disabled={!replyText.trim() || isReplying}
                        className="absolute bottom-3 right-3 w-9 h-9 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
                      >
                        {isReplying ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Badge
                          variant="outline"
                          className="border-border text-muted-foreground text-xs"
                        >
                          AI Suggest Reply
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {replyText.length} / 500
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-20">
                <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No message selected
                </h3>
                <p className="text-sm text-muted-foreground">
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

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Calendar, Plus } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

const mockPosts = [
  { id: 1, date: "2026-05-23", time: "10:00 AM", platform: "Instagram", content: "Check out our new product launch!" },
  { id: 2, date: "2026-05-24", time: "2:00 PM", platform: "Facebook", content: "Behind the scenes at our studio" },
];

export function ContentCalendarView() {
  const [hovering, setHovering] = useState(false);
  const [hasShownToast, setHasShownToast] = useState(false);
  const hoverTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (hovering && !hasShownToast && mockPosts.length < 3) {
      hoverTimeoutRef.current = window.setTimeout(() => {
        toast("Looks empty today. Should I draft a quick post for you?", {
          duration: 5000,
          action: {
            label: "Let's do it",
            onClick: () => console.log("AI drafting post..."),
          },
        });
        setHasShownToast(true);
      }, 2000);
    }

    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [hovering, hasShownToast]);

  return (
    <div
      className="p-8 space-y-6"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Content Calendar</h1>
          <p className="text-zinc-400">Plan and schedule your posts</p>
        </div>
        <Button className="bg-gradient-to-r from-[#13005A] to-[#00337C] hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Post
        </Button>
      </div>

      {/* Calendar Grid */}
      <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            May 2026
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-zinc-500 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }, (_, i) => {
              const day = i - 3;
              const isCurrentMonth = day > 0 && day <= 31;
              const hasPost = mockPosts.some((post) => {
                const postDay = new Date(post.date).getDate();
                return postDay === day;
              });

              return (
                <div
                  key={i}
                  className={`aspect-square rounded-lg border transition-colors ${
                    isCurrentMonth
                      ? hasPost
                        ? "border-[#1C82AD] bg-[#1C82AD]/10 hover:bg-[#1C82AD]/20"
                        : "border-zinc-800 bg-zinc-800/30 hover:bg-zinc-800/50"
                      : "border-zinc-900 bg-zinc-900/20"
                  }`}
                >
                  {isCurrentMonth && (
                    <div className="p-2">
                      <span className="text-sm text-white">{day}</span>
                      {hasPost && (
                        <div className="mt-1">
                          <div className="w-2 h-2 rounded-full bg-[#03C988]" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Posts */}
      <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-white">Upcoming Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence>
            {mockPosts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <Calendar className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                <p className="text-zinc-500">No scheduled posts yet</p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {mockPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-4 p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#13005A]/20 to-[#1C82AD]/20 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-[#1C82AD]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium mb-1">{post.content}</p>
                      <p className="text-sm text-zinc-500">
                        {post.platform} • {post.date} at {post.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}

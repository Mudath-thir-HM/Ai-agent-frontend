import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Calendar as CalendarIcon, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { useGetScheduledPostsQuery } from "../../store/apiSlice";
import { SchedulePostDialog } from "../../components/SchedulePostDialog";
import { format, isSameDay } from "date-fns";

export function ContentCalendarView() {
  const [hovering, setHovering] = useState(false);
  const [hasShownToast, setHasShownToast] = useState(false);
  const hoverTimeoutRef = useRef<number | null>(null);
  
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { data: posts = [], isLoading } = useGetScheduledPostsQuery();

  useEffect(() => {
    if (hovering && !hasShownToast && posts.length < 3) {
      hoverTimeoutRef.current = window.setTimeout(() => {
        toast("Looks empty today. Should I draft a quick post for you?", {
          duration: 5000,
          action: {
            label: "Let's do it",
            onClick: () => setIsScheduleOpen(true),
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
  }, [hovering, hasShownToast, posts.length]);

  const handleDayClick = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(date);
    setIsScheduleOpen(true);
  };

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Adjust so Monday is 0
  };

  const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  const firstDay = getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  
  const totalCells = Math.ceil((daysInMonth + firstDay) / 7) * 7;

  return (
    <div
      className="p-8 space-y-6"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Content Calendar</h1>
          <p className="text-muted-foreground">Plan and schedule your posts</p>
        </div>
        <Button 
          onClick={() => { setSelectedDate(null); setIsScheduleOpen(true); }}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Schedule Post
        </Button>
      </div>

      {/* Calendar Grid */}
      <Card className="border-border bg-card/50 backdrop-blur shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-foreground flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            {format(currentMonth, "MMMM yyyy")}
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
            >
              Prev
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
            >
              Next
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: totalCells }, (_, i) => {
              const day = i - firstDay + 1;
              const isCurrentMonth = day > 0 && day <= daysInMonth;
              const cellDate = isCurrentMonth ? new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day) : null;
              
              const dayPosts = cellDate ? posts.filter((post) => isSameDay(new Date(post.scheduled_for), cellDate)) : [];

              return (
                <div
                  key={i}
                  onClick={() => isCurrentMonth && handleDayClick(day)}
                  className={`aspect-square rounded-lg border transition-colors ${
                    isCurrentMonth ? 'cursor-pointer' : ''
                  } ${
                    isCurrentMonth
                      ? dayPosts.length > 0
                        ? "border-primary bg-primary/10 hover:bg-primary/20"
                        : "border-border bg-muted/30 hover:bg-muted/50"
                      : "border-border/50 bg-background/20"
                  }`}
                >
                  {isCurrentMonth && (
                    <div className="p-2 h-full flex flex-col">
                      <span className="text-sm text-foreground font-medium">{day}</span>
                      {dayPosts.length > 0 && (
                        <div className="mt-auto flex flex-wrap gap-1">
                          {dayPosts.slice(0, 3).map((_, idx) => (
                            <div key={idx} className="w-2 h-2 rounded-full bg-accent" />
                          ))}
                          {dayPosts.length > 3 && (
                            <span className="text-[10px] text-muted-foreground leading-none">+{dayPosts.length - 3}</span>
                          )}
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
      <Card className="border-border bg-card/50 backdrop-blur shadow-sm">
        <CardHeader>
          <CardTitle className="text-foreground">Upcoming Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <AnimatePresence>
              {posts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No scheduled posts yet</p>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {posts.filter(p => new Date(p.scheduled_for) >= new Date()).slice(0, 5).map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <CalendarIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-foreground font-medium mb-1 truncate">{post.post_text}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {post.platform} • {format(new Date(post.scheduled_for), "PPp")}
                        </p>
                      </div>
                      <div className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent font-medium capitalize">
                        {post.status}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          )}
        </CardContent>
      </Card>

      <SchedulePostDialog 
        open={isScheduleOpen} 
        onOpenChange={setIsScheduleOpen}
        defaultDate={selectedDate}
      />
    </div>
  );
}

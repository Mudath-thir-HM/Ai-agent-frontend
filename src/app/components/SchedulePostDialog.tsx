import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "./ui/select";
import { Calendar, Loader2 } from "lucide-react";
import { useSchedulePostMutation } from "../store/apiSlice";
import { toast } from "sonner";
import { format, addDays } from "date-fns";

const schema = z.object({
  platform: z.enum(["instagram", "facebook", "x", "linkedin", "tiktok"]),
  post_text: z.string().min(1, "Post text is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
});

type FormValues = z.infer<typeof schema>;

interface SchedulePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: Date | null;
  prefillText?: string;
  prefillPlatform?: string;
}

export function SchedulePostDialog({
  open,
  onOpenChange,
  defaultDate,
  prefillText = "",
  prefillPlatform,
}: SchedulePostDialogProps) {
  const [schedulePost, { isLoading }] = useSchedulePostMutation();

  const tomorrow = addDays(new Date(), 1);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      platform: (prefillPlatform as FormValues["platform"]) ?? "instagram",
      post_text: prefillText,
      date: defaultDate
        ? format(defaultDate, "yyyy-MM-dd")
        : format(tomorrow, "yyyy-MM-dd"),
      time: "09:00",
    },
  });

  // Sync defaultDate when it changes
  useEffect(() => {
    if (defaultDate) {
      setValue("date", format(defaultDate, "yyyy-MM-dd"));
    }
  }, [defaultDate, setValue]);

  // Sync prefill text
  useEffect(() => {
    if (prefillText) {
      setValue("post_text", prefillText);
    }
  }, [prefillText, setValue]);

  const platform = watch("platform");

  const onSubmit = async (data: FormValues) => {
    const scheduled_for = new Date(`${data.date}T${data.time}:00`).toISOString();

    try {
      await schedulePost({
        platform: data.platform,
        post_text: data.post_text,
        scheduled_for,
      }).unwrap();

      toast.success("Post scheduled successfully! 🎉");
      onOpenChange(false);
      reset();
    } catch (err: any) {
      toast.error(err?.data?.detail ?? "Failed to schedule post. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Schedule Post
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Platform */}
          <div className="space-y-2">
            <Label className="text-foreground">Platform</Label>
            <Select
              value={platform}
              onValueChange={(v) => setValue("platform", v as FormValues["platform"])}
            >
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">📸 Instagram</SelectItem>
                <SelectItem value="facebook">👥 Facebook</SelectItem>
                <SelectItem value="x">🐦 X (Twitter)</SelectItem>
                <SelectItem value="linkedin">💼 LinkedIn</SelectItem>
                <SelectItem value="tiktok">🎵 TikTok</SelectItem>
              </SelectContent>
            </Select>
            {errors.platform && (
              <p className="text-destructive text-xs">{errors.platform.message}</p>
            )}
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-foreground">Date</Label>
              <Input
                type="date"
                {...register("date")}
                className="bg-input border-border text-foreground [color-scheme:dark]"
              />
              {errors.date && (
                <p className="text-destructive text-xs">{errors.date.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Time</Label>
              <Input
                type="time"
                {...register("time")}
                className="bg-input border-border text-foreground [color-scheme:dark]"
              />
              {errors.time && (
                <p className="text-destructive text-xs">{errors.time.message}</p>
              )}
            </div>
          </div>

          {/* Post Text */}
          <div className="space-y-2">
            <Label className="text-foreground">Post Text</Label>
            <Textarea
              {...register("post_text")}
              placeholder="What would you like to post?"
              className="min-h-[120px] bg-input border-border text-foreground resize-none"
            />
            {errors.post_text && (
              <p className="text-destructive text-xs">{errors.post_text.message}</p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border text-foreground hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Scheduling…
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Post
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

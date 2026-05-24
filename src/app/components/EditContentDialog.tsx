import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { GeneratedContent } from "../types";
import { useUpdateContentMutation } from "../store/apiSlice";
import { toast } from "sonner";
import { Loader2, Edit2 } from "lucide-react";

const schema = z.object({
  generated_text: z.string().min(1, "Caption is required"),
  hashtags: z.string(),
  call_to_action: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface EditContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: GeneratedContent | null;
}

export function EditContentDialog({
  open,
  onOpenChange,
  content,
}: EditContentDialogProps) {
  const [updateContent, { isLoading }] = useUpdateContentMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      generated_text: "",
      hashtags: "",
      call_to_action: "",
    },
  });

  // Populate form when content changes
  useEffect(() => {
    if (content && open) {
      setValue("generated_text", content.post_text);
      setValue("hashtags", content.hashtags?.join(" ") || "");
      setValue("call_to_action", content.call_to_action || "");
    }
  }, [content, open, setValue]);

  const onSubmit = async (data: FormValues) => {
    if (!content) return;

    try {
      await updateContent({
        contentId: content.id,
        updates: {
          generated_text: data.generated_text,
          hashtags: data.hashtags
            .split(/\s+/)
            .filter(Boolean)
            .map((tag) => tag.replace(/^#/, "")),
          call_to_action: data.call_to_action,
        },
      }).unwrap();

      toast.success("Content updated successfully!");
      onOpenChange(false);
      reset();
    } catch (err: any) {
      toast.error(err?.data?.detail ?? "Failed to update content. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Edit2 className="w-5 h-5 text-primary" />
            Edit Content
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* Caption */}
          <div className="space-y-2">
            <Label className="text-foreground">Caption</Label>
            <Textarea
              {...register("generated_text")}
              placeholder="Enter your caption"
              className="min-h-[120px] bg-input border-border text-foreground resize-none"
            />
            {errors.generated_text && (
              <p className="text-destructive text-xs">{errors.generated_text.message}</p>
            )}
          </div>

          {/* Hashtags */}
          <div className="space-y-2">
            <Label className="text-foreground">Hashtags</Label>
            <Input
              {...register("hashtags")}
              placeholder="hashtag1 hashtag2 hashtag3 (space-separated, without #)"
              className="bg-input border-border text-foreground"
            />
            <p className="text-xs text-muted-foreground">
              Enter hashtags separated by spaces. The # symbol will be added automatically.
            </p>
          </div>

          {/* Call to Action */}
          <div className="space-y-2">
            <Label className="text-foreground">Call to Action (Optional)</Label>
            <Input
              {...register("call_to_action")}
              placeholder="e.g., Learn more at..."
              className="bg-input border-border text-foreground"
            />
          </div>

          <DialogFooter className="flex gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border text-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

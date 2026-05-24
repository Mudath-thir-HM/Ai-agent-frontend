import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { UserProfile } from "../types";
import { useUpdateProfileMutation } from "../store/apiSlice";
import { toast } from "sonner";
import { Loader2, User } from "lucide-react";

const schema = z.object({
  company_name: z.string().min(2, "Company name must be at least 2 characters"),
  avatar_url: z.string().url().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: UserProfile | null;
}

export function EditProfileDialog({
  open,
  onOpenChange,
  profile,
}: EditProfileDialogProps) {
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      company_name: "",
      avatar_url: "",
    },
  });

  // Populate form when profile changes
  useEffect(() => {
    if (profile && open) {
      setValue("company_name", profile.company_name || "");
      // Note: avatar_url might not be in the UserProfile type, adjust if needed
    }
  }, [profile, open, setValue]);

  const onSubmit = async (data: FormValues) => {
    try {
      await updateProfile({
        company_name: data.company_name,
        ...(data.avatar_url && { avatar_url: data.avatar_url }),
      }).unwrap();

      toast.success("Profile updated successfully!");
      onOpenChange(false);
      reset();
    } catch (err: any) {
      toast.error(err?.data?.detail ?? "Failed to update profile. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* Company Name */}
          <div className="space-y-2">
            <Label className="text-foreground">Company Name</Label>
            <Input
              {...register("company_name")}
              placeholder="Your company name"
              className="bg-input border-border text-foreground"
            />
            {errors.company_name && (
              <p className="text-destructive text-xs">{errors.company_name.message}</p>
            )}
          </div>

          {/* Avatar URL */}
          <div className="space-y-2">
            <Label className="text-foreground">Avatar URL (Optional)</Label>
            <Input
              {...register("avatar_url")}
              placeholder="https://example.com/avatar.jpg"
              type="url"
              className="bg-input border-border text-foreground"
            />
            {errors.avatar_url && (
              <p className="text-destructive text-xs">{errors.avatar_url.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Enter a valid image URL or leave empty to use default
            </p>
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
                  <User className="w-4 h-4 mr-2" />
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

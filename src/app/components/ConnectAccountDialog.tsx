import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ConnectSocialRequest } from "../types";
import { useConnectSocialAccountMutation } from "../store/apiSlice";
import { toast } from "sonner";
import { Loader2, Link2 } from "lucide-react";

const schema = z.object({
  platform: z.enum(["instagram", "facebook", "x", "linkedin", "tiktok"]),
  account_name: z.string().min(1, "Account name/handle is required"),
  account_id: z.string().min(1, "Account ID is required"),
});

type FormValues = z.infer<typeof schema>;

interface ConnectAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ConnectAccountDialog({
  open,
  onOpenChange,
  onSuccess,
}: ConnectAccountDialogProps) {
  const [connectAccount, { isLoading }] = useConnectSocialAccountMutation();

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
      platform: "instagram",
      account_name: "",
      account_id: "",
    },
  });

  const platform = watch("platform");

  const onSubmit = async (data: FormValues) => {
    try {
      await connectAccount({
        platform: data.platform,
        account_name: data.account_name,
        account_id: data.account_id,
      }).unwrap();

      toast.success(`${data.platform} account connected successfully!`);
      onOpenChange(false);
      reset();
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.data?.detail ?? "Failed to connect account. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Link2 className="w-5 h-5 text-primary" />
            Connect Social Account
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* Platform */}
          <div className="space-y-2">
            <Label className="text-foreground">Platform</Label>
            <Select
              defaultValue="instagram"
              onValueChange={(value) =>
                setValue("platform", value as FormValues["platform"])
              }
            >
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">📸 Instagram</SelectItem>
                <SelectItem value="facebook">👥 Facebook</SelectItem>
                <SelectItem value="x">𝕏 X (Twitter)</SelectItem>
                <SelectItem value="linkedin">💼 LinkedIn</SelectItem>
                <SelectItem value="tiktok">🎵 TikTok</SelectItem>
              </SelectContent>
            </Select>
            {errors.platform && (
              <p className="text-destructive text-xs">{errors.platform.message}</p>
            )}
          </div>

          {/* Account Name/Handle */}
          <div className="space-y-2">
            <Label className="text-foreground">Account Name / Handle</Label>
            <Input
              {...register("account_name")}
              placeholder={`e.g., @myaccount (without @ for ${platform})`}
              className="bg-input border-border text-foreground"
            />
            {errors.account_name && (
              <p className="text-destructive text-xs">{errors.account_name.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              The public username or handle for your {platform} account
            </p>
          </div>

          {/* Account ID */}
          <div className="space-y-2">
            <Label className="text-foreground">Account ID</Label>
            <Input
              {...register("account_id")}
              placeholder="Platform account ID or username"
              className="bg-input border-border text-foreground"
            />
            {errors.account_id && (
              <p className="text-destructive text-xs">{errors.account_id.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              The unique identifier for your account (often available in account settings)
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
                  Connecting...
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4 mr-2" />
                  Connect Account
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

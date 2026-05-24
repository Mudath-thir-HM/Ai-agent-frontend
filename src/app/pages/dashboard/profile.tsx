import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Facebook, Instagram, Twitter, CheckCircle2, MessageCircle, Loader2, Edit2 } from "lucide-react";
import { useGetProfileQuery, useGetConnectedPlatformsQuery } from "../../store/apiSlice";
import { Button } from "../../components/ui/button";
import { EditProfileDialog } from "../../components/EditProfileDialog";
import { ConnectAccountDialog } from "../../components/ConnectAccountDialog";

const platformIcons = {
  facebook: Facebook,
  instagram: Instagram,
  x: Twitter,
  linkedin: MessageCircle,
  tiktok: MessageCircle,
};

const platformNames = {
  facebook: "Facebook",
  instagram: "Instagram",
  x: "X (Twitter)",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
};

export function ProfileView() {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isConnectAccountOpen, setIsConnectAccountOpen] = useState(false);
  
  const { data: profile, isLoading: isProfileLoading } = useGetProfileQuery();
  const { data: platforms = [], isLoading: isPlatformsLoading, refetch: refetchPlatforms } = useGetConnectedPlatformsQuery();

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
        <p className="text-muted-foreground">Manage your account and connected platforms</p>
      </div>

      {/* User Info */}
      <Card className="border-border bg-card/50 backdrop-blur shadow-sm">
        <CardContent className="p-6">
          {isProfileLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="w-24 h-24 shadow-md shadow-primary/10">
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {profile?.company_name?.substring(0, 2).toUpperCase() || profile?.email?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold text-foreground mb-1">{profile?.company_name || "Your Company"}</h2>
                  <p className="text-muted-foreground mb-3">{profile?.email}</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium text-accent">Active Plan</span>
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => setIsEditProfileOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Connected Accounts */}
      <Card className="border-border bg-card/50 backdrop-blur shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-foreground">Connected Accounts</CardTitle>
          <Button 
            onClick={() => setIsConnectAccountOpen(true)}
            variant="outline" 
            size="sm" 
            className="border-border hover:bg-muted text-foreground"
          >
            Connect New
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 pt-4">
            {isPlatformsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : platforms.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No accounts connected yet.</p>
            ) : (
              platforms.map((platformId, index) => {
                const Icon = platformIcons[platformId as keyof typeof platformIcons] || MessageCircle;
                const name = platformNames[platformId as keyof typeof platformNames] || platformId;

                return (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-foreground font-medium mb-1 capitalize">{name}</h3>
                        <p className="text-sm text-muted-foreground">Connected via Astra AI</p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent/10 text-accent text-xs font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        Active
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <EditProfileDialog 
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        profile={profile || null}
      />
      <ConnectAccountDialog 
        open={isConnectAccountOpen}
        onOpenChange={setIsConnectAccountOpen}
        onSuccess={() => refetchPlatforms()}
      />
    </div>
  );
}

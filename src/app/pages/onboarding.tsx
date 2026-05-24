import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Check, Facebook, Instagram, Twitter, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useConnectSocialAccountMutation, useGetConnectedPlatformsQuery } from "../store/apiSlice";
import { toast } from "sonner";

const socialPlatforms = [
  { id: "facebook", name: "Facebook", icon: Facebook, color: "text-blue-600 bg-blue-100" },
  { id: "instagram", name: "Instagram", icon: Instagram, color: "text-pink-600 bg-pink-100" },
  { id: "x", name: "X (Twitter)", icon: Twitter, color: "text-zinc-900 bg-zinc-200 dark:text-zinc-100 dark:bg-zinc-800" },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const [connectSocialAccount] = useConnectSocialAccountMutation();
  const { data: connectedPlatforms = [], refetch } = useGetConnectedPlatformsQuery();

  const totalSteps = 2;
  const progress = (step / totalSteps) * 100;

  const togglePlatform = async (platformId: string) => {
    if (connectedPlatforms.includes(platformId)) return; // Already connected
    
    setIsConnecting(true);
    try {
      // Simulate OAuth popup delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockAccountId = `${platformId}_${Math.random().toString(36).substring(7)}`;
      
      await connectSocialAccount({
        platform: platformId,
        account_name: `${platformId}_test_account`,
        account_id: mockAccountId,
      }).unwrap();
      toast.success(`${platformId} connected!`);
      refetch();
    } catch (err: any) {
      toast.error(err.data?.detail || "Failed to connect platform.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <Progress value={progress} className="h-2 bg-muted [&>div]:bg-primary" />
          <p className="text-sm text-muted-foreground mt-2">
            Step {step} of {totalSteps}
          </p>
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {step === 1 && (
            <Card className="border-border bg-card/50 backdrop-blur shadow-xl">
              <CardHeader>
                <CardTitle className="text-foreground text-2xl">Welcome to Astra AI</CardTitle>
                <CardDescription className="text-muted-foreground text-base">
                  Let's get you set up. Connect your social media accounts to get started.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {socialPlatforms.map((platform) => {
                  const Icon = platform.icon;
                  const isConnected = connectedPlatforms.includes(platform.id);

                  return (
                    <button
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      disabled={isConnecting || isConnected}
                      className={`w-full p-4 rounded-lg border transition-all ${
                        isConnected
                          ? "border-accent bg-accent/10"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${platform.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-foreground font-medium">{platform.name}</span>
                        </div>
                        {isConnected && (
                          <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                            <Check className="w-4 h-4 text-accent-foreground" />
                          </div>
                        )}
                        {!isConnected && isConnecting && (
                          <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                        )}
                      </div>
                    </button>
                  );
                })}

                <Button
                  onClick={handleContinue}
                  className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Continue
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className="border-border bg-card/50 backdrop-blur shadow-xl">
              <CardHeader>
                <CardTitle className="text-foreground text-2xl">You're all set!</CardTitle>
                <CardDescription className="text-muted-foreground text-base">
                  Your AI assistant is ready to help you create and schedule content.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg p-6 mb-6">
                  <h3 className="text-foreground font-semibold mb-3">Connected Accounts</h3>
                  {connectedPlatforms.length > 0 ? (
                    <div className="space-y-2">
                      {connectedPlatforms.map((platformId) => {
                        const platform = socialPlatforms.find((p) => p.id === platformId);
                        if (!platform) return null;
                        const Icon = platform.icon;
                        return (
                          <div key={platformId} className="flex items-center gap-2 text-foreground">
                            <Check className="w-4 h-4 text-accent" />
                            <Icon className="w-4 h-4 text-muted-foreground" />
                            <span>{platform.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No accounts connected yet. You can connect them later in Settings.</p>
                  )}
                </div>

                <Button
                  onClick={handleContinue}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}

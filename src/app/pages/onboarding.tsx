import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Check, Facebook, Instagram, Twitter, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

const socialPlatforms = [
  { id: "facebook", name: "Facebook", icon: Facebook, color: "from-[#00337C] to-[#1C82AD]" },
  { id: "instagram", name: "Instagram", icon: Instagram, color: "from-[#13005A] to-[#1C82AD]" },
  { id: "twitter", name: "X (Twitter)", icon: Twitter, color: "from-zinc-800 to-zinc-700" },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);

  const totalSteps = 2;
  const progress = (step / totalSteps) * 100;

  const togglePlatform = (platformId: string) => {
    setConnectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#1a1a1a] p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <Progress value={progress} className="h-1" />
          <p className="text-sm text-zinc-500 mt-2">
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
            <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Welcome to Astra AI</CardTitle>
                <CardDescription className="text-base">
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
                      className={`w-full p-4 rounded-lg border transition-all ${
                        isConnected
                          ? "border-[#1C82AD] bg-[#1C82AD]/10"
                          : "border-zinc-800 bg-zinc-800/50 hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-white font-medium">{platform.name}</span>
                        </div>
                        {isConnected && (
                          <div className="w-6 h-6 rounded-full bg-[#03C988] flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}

                <Button
                  onClick={handleContinue}
                  disabled={connectedPlatforms.length === 0}
                  className="w-full mt-6 bg-gradient-to-r from-[#13005A] to-[#00337C] hover:opacity-90"
                >
                  Continue
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white text-2xl">You're all set!</CardTitle>
                <CardDescription className="text-base">
                  Your AI assistant is ready to help you create and schedule content.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-zinc-800/50 rounded-lg p-6 mb-6">
                  <h3 className="text-white font-semibold mb-3">Connected Accounts</h3>
                  <div className="space-y-2">
                    {connectedPlatforms.map((platformId) => {
                      const platform = socialPlatforms.find((p) => p.id === platformId);
                      if (!platform) return null;
                      const Icon = platform.icon;
                      return (
                        <div key={platformId} className="flex items-center gap-2 text-zinc-300">
                          <Check className="w-4 h-4 text-green-500" />
                          <Icon className="w-4 h-4" />
                          <span>{platform.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Button
                  onClick={handleContinue}
                  className="w-full bg-gradient-to-r from-[#13005A] to-[#00337C] hover:opacity-90"
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

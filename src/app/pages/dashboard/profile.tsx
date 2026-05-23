import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Facebook, Instagram, Twitter, CheckCircle2 } from "lucide-react";

const connectedAccounts = [
  { id: 1, platform: "Instagram", username: "@johndoe", followers: "12.5K", icon: Instagram, connected: true },
  { id: 2, platform: "Facebook", username: "John Doe", followers: "8.2K", icon: Facebook, connected: true },
  { id: 3, platform: "X (Twitter)", username: "@john_doe", followers: "5.8K", icon: Twitter, connected: true },
];

export function ProfileView() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
        <p className="text-zinc-400">Manage your account and connected platforms</p>
      </div>

      {/* User Info */}
      <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="text-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
                JD
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">John Doe</h2>
              <p className="text-zinc-400 mb-3">john.doe@example.com</p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">
                <CheckCircle2 className="w-4 h-4 text-violet-400" />
                <span className="text-sm text-violet-400">Pro Plan</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connected Accounts */}
      <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-white">Connected Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {connectedAccounts.map((account) => {
              const Icon = account.icon;
              return (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-violet-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">{account.platform}</h3>
                      <p className="text-sm text-zinc-500">{account.username}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium mb-1">{account.followers}</p>
                    <p className="text-sm text-zinc-500">Followers</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

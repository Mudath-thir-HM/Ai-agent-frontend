import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export function SettingsView() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-zinc-400">Manage your preferences and account settings</p>
      </div>

      {/* AI Preferences */}
      <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-white">AI Preferences</CardTitle>
          <CardDescription>Customize how the AI assists you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-white">Proactive Suggestions</Label>
              <p className="text-sm text-zinc-500">Let AI suggest content ideas automatically</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-white">Auto-Schedule</Label>
              <p className="text-sm text-zinc-500">Allow AI to schedule posts at optimal times</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-white">Smart Captions</Label>
              <p className="text-sm text-zinc-500">Generate captions with AI</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-white">Notifications</CardTitle>
          <CardDescription>Choose what updates you receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-white">Email Notifications</Label>
              <p className="text-sm text-zinc-500">Receive updates via email</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-white">Post Reminders</Label>
              <p className="text-sm text-zinc-500">Get notified before scheduled posts</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-white">Weekly Reports</Label>
              <p className="text-sm text-zinc-500">Receive weekly analytics summaries</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Account */}
      <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-white">Account</CardTitle>
          <CardDescription>Manage your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-zinc-300">Email</Label>
            <Input
              type="email"
              defaultValue="john.doe@example.com"
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">Password</Label>
            <Button variant="outline" className="w-full border-zinc-700 text-white hover:bg-zinc-800">
              Change Password
            </Button>
          </div>
          <div className="pt-4 border-t border-zinc-800">
            <Button variant="destructive" className="w-full">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

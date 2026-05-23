import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { TrendingUp, Users, Heart, MessageCircle } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const engagementData = [
  { date: "Mon", engagement: 1240 },
  { date: "Tue", engagement: 1580 },
  { date: "Wed", engagement: 2100 },
  { date: "Thu", engagement: 1890 },
  { date: "Fri", engagement: 2400 },
  { date: "Sat", engagement: 2890 },
  { date: "Sun", engagement: 2650 },
];

const platformData = [
  { platform: "Instagram", posts: 24 },
  { platform: "Facebook", posts: 18 },
  { platform: "Twitter", posts: 32 },
];

const stats = [
  { label: "Total Reach", value: "127.5K", change: "+12.5%", icon: Users, color: "text-[#1C82AD]" },
  { label: "Engagement Rate", value: "8.4%", change: "+2.1%", icon: Heart, color: "text-[#13005A]" },
  { label: "Total Posts", value: "74", change: "+18", icon: MessageCircle, color: "text-[#00337C]" },
  { label: "Growth", value: "+3.2K", change: "+15.3%", icon: TrendingUp, color: "text-[#03C988]" },
];

export function AnalyticsView() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-zinc-400">Track your social media performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                  <span className="text-xs text-green-500 font-medium">{stat.change}</span>
                </div>
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-zinc-500">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Weekly Engagement</CardTitle>
            <CardDescription>Your engagement over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" stroke="#71717a" />
                <YAxis stroke="#71717a" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="engagement" stroke="#1C82AD" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Posts by Platform</CardTitle>
            <CardDescription>Distribution of your content</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={platformData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="platform" stroke="#71717a" />
                <YAxis stroke="#71717a" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="posts" fill="#00337C" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Posts */}
      <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-white">Top Performing Posts</CardTitle>
          <CardDescription>Your best content this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#13005A]/20 to-[#1C82AD]/20 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-[#1C82AD]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium mb-1">Post Title {i}</h4>
                  <p className="text-sm text-zinc-500">Posted 2 days ago</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-white">{(i * 1234).toLocaleString()}</p>
                  <p className="text-sm text-zinc-500">Engagements</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

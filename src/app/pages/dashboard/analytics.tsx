import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { TrendingUp, Users, Heart, MessageCircle, Loader2 } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useGetAnalyticsOverviewQuery, useGetWeeklyEngagementQuery, useGetPlatformsBreakdownQuery, useGetTopPostsQuery } from "../../store/apiSlice";

export function AnalyticsView() {
  const { data: overview, isLoading: isOverviewLoading } = useGetAnalyticsOverviewQuery();
  const { data: engagementData = [], isLoading: isEngagementLoading } = useGetWeeklyEngagementQuery();
  const { data: platformData = [], isLoading: isPlatformLoading } = useGetPlatformsBreakdownQuery();
  const { data: topPosts = [], isLoading: isTopPostsLoading } = useGetTopPostsQuery();

  const stats = [
    { label: "Total Reach", value: overview?.total_reach.toLocaleString() || "0", change: "+12.5%", icon: Users, color: "text-primary" },
    { label: "Engagement Rate", value: `${overview?.avg_engagement_rate.toFixed(1) || 0}%`, change: "+2.1%", icon: Heart, color: "text-destructive" },
    { label: "Total Posts", value: overview?.posts_this_week.toString() || "0", change: "+18", icon: MessageCircle, color: "text-blue-500" },
    { label: "Growth", value: `+${overview?.growth_percentage.toFixed(1) || 0}%`, change: "+15.3%", icon: TrendingUp, color: "text-accent" },
  ];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Analytics</h1>
        <p className="text-muted-foreground">Track your social media performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-border bg-card/50 backdrop-blur shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                  <span className="text-xs text-accent font-medium">{stat.change}</span>
                </div>
                {isOverviewLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mb-1" />
                ) : (
                  <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                )}
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border bg-card/50 backdrop-blur shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Weekly Engagement</CardTitle>
            <CardDescription className="text-muted-foreground">Your engagement over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            {isEngagementLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "var(--foreground)"
                    }}
                  />
                  <Line type="monotone" dataKey="engagement" stroke="var(--primary)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card/50 backdrop-blur shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Posts by Platform</CardTitle>
            <CardDescription className="text-muted-foreground">Distribution of your content</CardDescription>
          </CardHeader>
          <CardContent>
            {isPlatformLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={platformData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="platform" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "var(--foreground)"
                    }}
                  />
                  <Bar dataKey="posts" fill="var(--primary)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Posts */}
      <Card className="border-border bg-card/50 backdrop-blur shadow-sm">
        <CardHeader>
          <CardTitle className="text-foreground">Top Performing Posts</CardTitle>
          <CardDescription className="text-muted-foreground">Your best content this week</CardDescription>
        </CardHeader>
        <CardContent>
          {isTopPostsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : topPosts.length > 0 ? (
            <div className="space-y-4">
              {topPosts.map((post) => (
                <div key={post.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-foreground font-medium mb-1 truncate">
                      {post.post_text ? post.post_text : `${post.platform} Post`}
                    </h4>
                    <p className="text-sm text-muted-foreground capitalize">Platform: {post.platform}</p>
                  </div>
                  <div className="text-right whitespace-nowrap pl-4">
                    <p className="text-xl font-bold text-foreground">{(post.likes + post.comments + post.shares).toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Engagements</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No top posts available yet.</p>
              <p className="text-sm mt-1">Connect your accounts to start tracking your best content.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

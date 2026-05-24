import { Outlet, useNavigate, useLocation } from "react-router";
import {
  BarChart3,
  Calendar,
  Image,
  MessageSquare,
  User,
  Settings,
  Sparkles,
  LogOut,
  Loader2,
} from "lucide-react";
import { GlobalToolbar } from "../../components/global-toolbar";
import { CanvasOverlay } from "../../components/canvas-overlay";
import { useGetProfileQuery, useGetMessagesQuery } from "../../store/apiSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/authSlice";
import { setCanvasOpen } from "../../store/uiSlice";

const navItems = [
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    path: "/dashboard/analytics",
  },
  {
    id: "calendar",
    label: "Content Calendar",
    icon: Calendar,
    path: "/dashboard/calendar",
  },
  {
    id: "content",
    label: "Generated Content",
    icon: Image,
    path: "/dashboard/content",
  },
  {
    id: "messages",
    label: "Messages",
    icon: MessageSquare,
    path: "/dashboard/messages",
  },
  { id: "profile", label: "Profile", icon: User, path: "/dashboard/profile" },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    path: "/dashboard/settings",
  },
];

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isCanvasOpen = useAppSelector((state) => state.ui.isCanvasOpen);

  const { data: profile, isLoading: isProfileLoading } = useGetProfileQuery();
  const { data: messages = [] } = useGetMessagesQuery();

  const unreadMessagesCount = messages.filter((m) => !m.is_replied).length;

  const currentPath =
    location.pathname === "/dashboard"
      ? "/dashboard/analytics"
      : location.pathname;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 backdrop-blur flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">AgentCee</h1>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            const badgeCount = item.id === "messages" ? unreadMessagesCount : 0;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors relative ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
                {badgeCount > 0 && (
                  <span className="ml-auto w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border flex flex-col gap-4">
          <div className="bg-muted/50 border border-border rounded-lg p-3">
            <p className="text-sm text-muted-foreground mb-2">User Profile</p>
            {isProfileLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            ) : (
              <div className="flex flex-col">
                <span className="font-medium text-foreground truncate">
                  {profile?.company_name || profile?.email}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {profile?.email}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-background">
        <Outlet />
      </main>

      {/* Global Toolbar */}
      <GlobalToolbar onOpenCanvas={() => dispatch(setCanvasOpen(true))} />

      {/* Canvas Overlay */}
      <CanvasOverlay
        isOpen={isCanvasOpen}
        onClose={() => dispatch(setCanvasOpen(false))}
      />
    </div>
  );
}

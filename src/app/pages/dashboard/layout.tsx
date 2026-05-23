import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { BarChart3, Calendar, Image, MessageSquare, User, Settings, Sparkles } from "lucide-react";
import { GlobalToolbar } from "../../components/global-toolbar";
import { CanvasOverlay } from "../../components/canvas-overlay";

const navItems = [
  { id: "analytics", label: "Analytics", icon: BarChart3, path: "/dashboard/analytics" },
  { id: "calendar", label: "Content Calendar", icon: Calendar, path: "/dashboard/calendar" },
  { id: "content", label: "Generated Content", icon: Image, path: "/dashboard/content" },
  { id: "messages", label: "Messages", icon: MessageSquare, path: "/dashboard/messages", badge: 2 },
  { id: "profile", label: "Profile", icon: User, path: "/dashboard/profile" },
  { id: "settings", label: "Settings", icon: Settings, path: "/dashboard/settings" },
];

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);

  const currentPath = location.pathname === "/dashboard" ? "/dashboard/analytics" : location.pathname;

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-900/50 backdrop-blur flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#13005A] to-[#00337C] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Astra AI</h1>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors relative ${
                  isActive
                    ? "bg-[#13005A]/20 text-[#03C988]"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="ml-auto w-5 h-5 rounded-full bg-[#00337C] text-white text-xs flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <div className="bg-gradient-to-br from-[#13005A]/10 to-[#00337C]/10 border border-[#1C82AD]/20 rounded-lg p-3">
            <p className="text-sm text-zinc-300 mb-2">AI Credits</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">450</span>
              <span className="text-sm text-zinc-500">/ 500</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>

      {/* Global Toolbar */}
      <GlobalToolbar onOpenCanvas={() => setIsCanvasOpen(true)} />

      {/* Canvas Overlay */}
      <CanvasOverlay isOpen={isCanvasOpen} onClose={() => setIsCanvasOpen(false)} />
    </div>
  );
}

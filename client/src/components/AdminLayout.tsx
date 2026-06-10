import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import {
  Scale,
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  MessageSquare,
  Receipt,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { icon: LayoutDashboard, label: "แดชบอร์ด", path: "/admin" },
  { icon: Users, label: "ลูกค้า", path: "/admin/clients" },
  { icon: Briefcase, label: "คดีความ", path: "/admin/cases" },
  { icon: Calendar, label: "นัดหมาย", path: "/admin/appointments" },
  { icon: MessageSquare, label: "ข้อความ", path: "/admin/messages", badge: true },
  { icon: Receipt, label: "ใบแจ้งหนี้", path: "/admin/invoices" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const [location, navigate] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: pendingMessages } = trpc.messages.list.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
    select: (data) => data.filter((m) => m.status === "new").length,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      window.location.href = "/";
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen navy-gradient flex items-center justify-center p-4">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-10 text-center max-w-sm w-full">
          <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-serif text-xl font-bold text-white mb-2">เข้าสู่ระบบ</h2>
          <p className="text-white/60 text-sm mb-6">กรุณาเข้าสู่ระบบเพื่อเข้าถึงระบบจัดการ</p>
          <a href={getLoginUrl()}>
            <Button className="w-full gold-gradient text-white border-0 font-semibold">
              เข้าสู่ระบบ
            </Button>
          </a>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <Scale className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="font-serif text-xl font-bold text-foreground mb-2">ไม่มีสิทธิ์เข้าถึง</h2>
          <p className="text-muted-foreground text-sm mb-6">
            คุณไม่มีสิทธิ์เข้าถึงระบบนี้ กรุณาติดต่อผู้ดูแลระบบ
          </p>
          <Button variant="outline" onClick={() => navigate("/")}>
            กลับหน้าหลัก
          </Button>
        </div>
      </div>
    );
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center shadow-md flex-shrink-0">
            <Scale className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-serif font-bold text-sm text-sidebar-foreground truncate">
              นิตินิยม
            </p>
            <p className="text-xs text-sidebar-foreground/50 truncate">ระบบจัดการ</p>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          return (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "" : "group-hover:scale-110 transition-transform"}`} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && pendingMessages && pendingMessages > 0 && (
                <Badge className="bg-red-500 text-white text-xs px-1.5 py-0 h-5 min-w-5 flex items-center justify-center">
                  {pendingMessages}
                </Badge>
              )}
              {isActive && <ChevronRight className="w-3 h-3 opacity-60" />}
            </button>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-sidebar-accent/50">
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs font-bold">
              {user.name?.charAt(0)?.toUpperCase() ?? "A"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-sidebar-foreground truncate">
              {user.name ?? "Admin"}
            </p>
            <p className="text-xs text-sidebar-foreground/50 truncate">{user.email ?? ""}</p>
          </div>
          <button
            onClick={() => logoutMutation.mutate()}
            className="p-1.5 rounded-lg hover:bg-sidebar-border transition-colors text-sidebar-foreground/50 hover:text-sidebar-foreground"
            title="ออกจากระบบ"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-sidebar flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-64 bg-sidebar flex flex-col h-full shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 bg-white border-b border-border flex items-center px-4 gap-4 flex-shrink-0">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-sm font-semibold text-foreground">
              {navItems.find((n) => n.path === location)?.label ?? "แดชบอร์ด"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {pendingMessages && pendingMessages > 0 ? (
              <button
                onClick={() => navigate("/admin/messages")}
                className="relative p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Bell className="w-4 h-4 text-muted-foreground" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            ) : null}
            <button
              onClick={() => navigate("/")}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-muted"
            >
              ดูหน้าเว็บ
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  MessageSquare,
  FileText,
  Wrench,
  LogOut,
  Menu,
  X,
  Scale,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const navItems = [
  { href: "/admin", label: "ภาพรวม", icon: LayoutDashboard },
  { href: "/admin/clients", label: "ลูกความ", icon: Users },
  { href: "/admin/cases", label: "คดีความ", icon: Briefcase },
  { href: "/admin/appointments", label: "นัดหมาย", icon: Calendar },
  { href: "/admin/messages", label: "ข้อความ", icon: MessageSquare },
  { href: "/admin/invoices", label: "ใบแจ้งหนี้", icon: FileText },
  { href: "/admin/tools", label: "โปรแกรมทนาย", icon: Wrench },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: user, isLoading } = trpc.auth.me.useQuery();
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      window.location.href = "/admin/login";
    },
    onError: () => {
      toast.error("ออกจากระบบไม่สำเร็จ");
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-amber-700 text-sm">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    window.location.href = "/admin/login";
    return null;
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-sm">
          <Scale className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">ไม่มีสิทธิ์เข้าถึง</h2>
          <p className="text-gray-500 text-sm mb-4">บัญชีนี้ไม่ได้รับอนุญาตให้เข้าใช้งานระบบหลังบ้าน</p>
          <Link href="/">
            <Button variant="outline" size="sm">กลับหน้าหลัก</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isActive = (href: string) => {
    if (href === "/admin") return location === "/admin";
    return location.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-white border-r border-amber-100 z-30 flex flex-col transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:z-auto`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-amber-100">
          <div className="w-9 h-9 rounded-lg bg-amber-400 flex items-center justify-center flex-shrink-0">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-800 truncate">นิตินิยม</p>
            <p className="text-xs text-amber-600 truncate">ระบบจัดการ</p>
          </div>
          <button
            className="ml-auto md:hidden text-gray-400 hover:text-gray-600"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">เมนูหลัก</p>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link href={item.href}>
                    <span
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all
                        ${active
                          ? "bg-amber-100 text-amber-800"
                          : "text-gray-600 hover:bg-amber-50 hover:text-amber-700"
                        }`}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-amber-600" : "text-gray-400"}`} />
                      <span className="flex-1">{item.label}</span>
                      {active && <ChevronRight className="w-3 h-3 text-amber-500" />}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User info + Logout */}
        <div className="border-t border-amber-100 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0">
              <span className="text-amber-800 text-xs font-bold">
                {user.name?.charAt(0)?.toUpperCase() ?? "A"}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-700 truncate">{user.name ?? "Admin"}</p>
              <p className="text-xs text-gray-400 truncate">{user.email ?? ""}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs text-gray-500 border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="w-3 h-3 mr-1.5" />
            ออกจากระบบ
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="md:hidden bg-white border-b border-amber-100 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-amber-50"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-bold text-gray-800">นิตินิยม</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

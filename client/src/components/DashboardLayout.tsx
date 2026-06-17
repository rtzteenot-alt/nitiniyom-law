import React, { useState, ReactNode } from "react";
import { useLocation } from "wouter";
import { ChevronDown, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "./ui/button";

interface MenuItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
  submenu?: MenuItem[];
}

const menuStructure: MenuItem[] = [
  {
    label: "นิตินิยม",
    path: "/admin",
    submenu: [
      { label: "ระบบวิการคดี", path: "/admin/system" },
    ],
  },
  {
    label: "จัดการ",
    path: "#",
    submenu: [
      { label: "แดชบอร์ด", path: "/admin" },
      { label: "ลูกค้า", path: "/admin/clients" },
      { label: "คดีความ", path: "/admin/cases" },
      { label: "นัดหมาย", path: "/admin/appointments" },
    ],
  },
  {
    label: "การเงิน",
    path: "#",
    submenu: [
      { label: "ข้อความ", path: "/admin/messages" },
      { label: "ใบแจ้งหนี้", path: "/admin/invoices" },
      {
        label: "ระบบโปรแกรมสำหรับทนาย",
        path: "#",
        submenu: [
          { label: "ระบบคำนวณดอกเบี้ย", path: "/admin/interest-calculator" },
        ],
      },
    ],
  },
  {
    label: "ตั้งค่า",
    path: "#",
    submenu: [
      { label: "การตั้งค่า", path: "/admin/settings" },
    ],
  },
];

interface SidebarMenuItemProps {
  item: MenuItem;
  level: number;
  isActive: boolean;
  onNavigate: (path: string) => void;
  expandedItems: Set<string>;
  onToggleExpand: (label: string) => void;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  item,
  level,
  isActive,
  onNavigate,
  expandedItems,
  onToggleExpand,
}) => {
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  const isExpanded = expandedItems.has(item.label);

  return (
    <div>
      <div
        className={`flex items-center justify-between px-4 py-2 cursor-pointer transition-colors ${
          level === 0 ? "mt-2 mb-1" : ""
        } ${
          isActive && !hasSubmenu
            ? "bg-yellow-200 text-yellow-900 font-semibold"
            : "hover:bg-amber-100 text-gray-700"
        }`}
        style={{ paddingLeft: `${level * 16 + 16}px` }}
      >
        <span
          className="flex-1"
          onClick={() => {
            if (hasSubmenu) {
              onToggleExpand(item.label);
            } else if (item.path !== "#") {
              onNavigate(item.path);
            }
          }}
        >
          {item.label}
        </span>
        {hasSubmenu && (
          <ChevronDown
            size={16}
            className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
            onClick={() => onToggleExpand(item.label)}
          />
        )}
      </div>

      {hasSubmenu && isExpanded && (
        <div>
          {item.submenu!.map((subitem, index) => (
            <SidebarMenuItem
              key={index}
              item={subitem}
              level={level + 1}
              isActive={isActive}
              onNavigate={onNavigate}
              expandedItems={expandedItems}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleToggleExpand = (label: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(label)) {
      newExpanded.delete(label);
    } else {
      newExpanded.add(label);
    }
    setExpandedItems(newExpanded);
  };

  const handleNavigate = (path: string) => {
    setLocation(path);
  };

  const handleLogout = async () => {
    await logout();
  };

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } bg-amber-50 border-r border-amber-100 transition-all duration-300 overflow-hidden flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-amber-100 bg-white">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-900">นิตินิยม</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-xs text-gray-600">ระบบวิการคดี</p>
        </div>

        {/* Sidebar Menu */}
        <div className="flex-1 overflow-y-auto py-4 bg-amber-50">
          {menuStructure.map((item, index) => (
            <SidebarMenuItem
              key={index}
              item={item}
              level={0}
              isActive={location === item.path}
              onNavigate={handleNavigate}
              expandedItems={expandedItems}
              onToggleExpand={handleToggleExpand}
            />
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-amber-100 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <LogOut size={16} className="mr-2" />
            ออกจากระบบ
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-amber-100 p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden"
          >
            <Menu size={24} />
          </button>
          <div className="flex-1" />
          <div className="text-sm text-gray-600">
            {new Date().toLocaleDateString("th-TH")}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            {children}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;

import { trpc } from "@/lib/trpc";
import { Users, Briefcase, FileText, Calendar, MessageSquare, TrendingUp, Activity, Zap } from "lucide-react";
import { Link } from "wouter";

const caseTypeLabel: Record<string, string> = {
  criminal: "คดีอาญา",
  civil: "คดีแพ่ง",
  contract: "สัญญา",
  debt_collection: "ทวงหนี้",
  consultation: "ปรึกษา",
  other: "อื่นๆ",
};

export default function AdminDashboard() {
  const { data: stats, isLoading } = trpc.dashboard.stats.useQuery();
  const { data: recentCases } = trpc.dashboard.recentCases.useQuery();
  const { data: todayAppts } = trpc.dashboard.todayAppointments.useQuery();
  const { data: apiStats } = trpc.apiUsage.getStats.useQuery();

  const statCards = [
    { label: "ลูกความทั้งหมด", value: stats?.totalClients ?? 0, icon: Users, color: "bg-blue-50 text-blue-600", href: "/admin/clients" },
    { label: "คดีที่ดำเนินการ", value: stats?.activeCases ?? 0, icon: Briefcase, color: "bg-amber-50 text-amber-600", href: "/admin/cases" },
    { label: "นัดหมายวันนี้", value: stats?.todayAppointments ?? 0, icon: Calendar, color: "bg-green-50 text-green-600", href: "/admin/appointments" },
    { label: "ข้อความใหม่", value: stats?.newMessages ?? 0, icon: MessageSquare, color: "bg-red-50 text-red-600", href: "/admin/messages" },
    { label: "รายได้รวม (บาท)", value: stats?.totalRevenue?.toLocaleString("th-TH") ?? "0", icon: TrendingUp, color: "bg-purple-50 text-purple-600", href: "/admin/invoices" },
    { label: "API Requests", value: apiStats?.totalRequests ?? 0, icon: Activity, color: "bg-indigo-50 text-indigo-600", href: "/api-usage" },
    { label: "Tokens Used", value: apiStats?.totalTokensUsed ?? 0, icon: Zap, color: "bg-pink-50 text-pink-600", href: "/api-usage" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">ภาพรวมระบบ</h1>
        <p className="text-sm text-gray-500 mt-0.5">สำนักงานกฎหมายนิตินิยม</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.href}>
              <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className={`w-9 h-9 rounded-lg ${card.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {isLoading ? (
                    <span className="inline-block w-12 h-6 bg-gray-100 rounded animate-pulse" />
                  ) : (
                    card.value
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* API Usage Section */}
      {apiStats && (
        <div className="bg-gradient-to-br from-indigo-50 to-pink-50 rounded-xl border border-indigo-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              API Usage Summary
            </h2>
            <Link href="/api-usage">
              <span className="text-xs text-indigo-600 hover:underline cursor-pointer">ดูรายละเอียด</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-600">Avg Response Time</p>
              <p className="text-lg font-bold text-gray-800 mt-1">{apiStats.averageResponseTime}ms</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Models Used</p>
              <p className="text-lg font-bold text-gray-800 mt-1">{Object.keys(apiStats.requestsByModel).length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Endpoints</p>
              <p className="text-lg font-bold text-gray-800 mt-1">{Object.keys(apiStats.requestsByEndpoint).length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Recent Requests</p>
              <p className="text-lg font-bold text-gray-800 mt-1">{apiStats.recentRequests.length}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Cases */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">คดีล่าสุด</h2>
            <Link href="/admin/cases">
              <span className="text-xs text-amber-600 hover:underline cursor-pointer">ดูทั้งหมด</span>
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {!recentCases || recentCases.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">ยังไม่มีคดี</p>
            ) : (
              recentCases.slice(0, 5).map((c) => (
                <div key={c.id} className="px-5 py-3 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{c.title}</p>
                    <p className="text-xs text-gray-400">{caseTypeLabel[c.type] ?? c.type}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ml-3 ${
                    c.status === "new" ? "bg-blue-100 text-blue-700" :
                    c.status === "in_progress" ? "bg-amber-100 text-amber-700" :
                    c.status === "closed" ? "bg-green-100 text-green-700" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {c.status === "new" ? "ใหม่" :
                     c.status === "in_progress" ? "ดำเนินการ" :
                     c.status === "closed" ? "ปิดแล้ว" :
                     c.status === "pending" ? "รอดำเนินการ" : "ยกเลิก"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Today Appointments */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">นัดหมายวันนี้</h2>
            <Link href="/admin/appointments">
              <span className="text-xs text-amber-600 hover:underline cursor-pointer">ดูทั้งหมด</span>
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {!todayAppts || todayAppts.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">ไม่มีนัดหมายวันนี้</p>
            ) : (
              todayAppts.map((a) => (
                <div key={a.id} className="px-5 py-3">
                  <p className="text-sm font-medium text-gray-700">{a.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {a.clientName ?? "-"} · {new Date(a.appointmentDate).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })} น.
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

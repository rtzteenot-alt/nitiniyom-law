import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import {
  Users,
  Briefcase,
  Calendar,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";
import { useLocation } from "wouter";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const caseTypeLabels: Record<string, string> = {
  criminal: "อาญา",
  civil: "แพ่ง",
  contract: "สัญญา",
  debt_collection: "ทวงหนี้",
  consultation: "ปรึกษา",
  other: "อื่นๆ",
};

const caseStatusLabels: Record<string, string> = {
  new: "ใหม่",
  in_progress: "ดำเนินการ",
  pending: "รอดำเนินการ",
  closed: "ปิดแล้ว",
  cancelled: "ยกเลิก",
};

const PIE_COLORS = ["#c9a84c", "#1e3a5f", "#55a0c8", "#4caf7d", "#e07b54", "#9c6dd4"];

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={`bg-white rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-all duration-200 ${onClick ? "cursor-pointer hover:-translate-y-0.5" : ""}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        {onClick && <ArrowUpRight className="w-4 h-4 text-muted-foreground" />}
      </div>
      <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
      <p className="text-sm font-medium text-foreground/80">{label}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const { data: stats, isLoading: statsLoading } = trpc.dashboard.stats.useQuery();
  const { data: monthlyRevenue } = trpc.dashboard.monthlyRevenue.useQuery();
  const { data: caseTypeStats } = trpc.dashboard.caseTypeStats.useQuery();
  const { data: recentCases } = trpc.dashboard.recentCases.useQuery();
  const { data: todayAppointments } = trpc.dashboard.todayAppointments.useQuery();

  const chartData = monthlyRevenue
    ?.slice()
    .reverse()
    .map((r) => ({
      month: r.month?.slice(5) ?? "",
      รายได้: Number(r.revenue ?? 0),
    })) ?? [];

  const pieData = caseTypeStats?.map((c) => ({
    name: caseTypeLabels[c.type] ?? c.type,
    value: Number(c.count),
  })) ?? [];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="font-serif text-2xl font-bold text-foreground">ภาพรวมระบบ</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date().toLocaleDateString("th-TH", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Stats Grid */}
        {statsLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 h-32 animate-pulse border border-border" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              icon={Users}
              label="ลูกค้าทั้งหมด"
              value={stats?.totalClients ?? 0}
              sub="ลูกค้าที่ลงทะเบียน"
              color="bg-blue-50 text-blue-600"
              onClick={() => navigate("/admin/clients")}
            />
            <StatCard
              icon={Briefcase}
              label="คดีทั้งหมด"
              value={stats?.totalCases ?? 0}
              sub={`ใหม่ ${stats?.newCases ?? 0} คดี`}
              color="bg-amber-50 text-amber-600"
              onClick={() => navigate("/admin/cases")}
            />
            <StatCard
              icon={DollarSign}
              label="รายได้รวม"
              value={`฿${(stats?.totalRevenue ?? 0).toLocaleString()}`}
              sub="ที่ชำระแล้ว"
              color="bg-green-50 text-green-600"
              onClick={() => navigate("/admin/invoices")}
            />
            <StatCard
              icon={Calendar}
              label="นัดหมายวันนี้"
              value={stats?.todayAppointments ?? 0}
              sub="รายการ"
              color="bg-purple-50 text-purple-600"
              onClick={() => navigate("/admin/appointments")}
            />
            <StatCard
              icon={MessageSquare}
              label="ข้อความใหม่"
              value={stats?.pendingMessages ?? 0}
              sub="รอตอบกลับ"
              color="bg-red-50 text-red-600"
              onClick={() => navigate("/admin/messages")}
            />
            <StatCard
              icon={TrendingUp}
              label="คดีดำเนินการ"
              value={stats?.newCases ?? 0}
              sub="คดีใหม่รอดำเนินการ"
              color="bg-teal-50 text-teal-600"
            />
          </div>
        )}

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-border">
            <h3 className="font-semibold text-foreground mb-1">รายได้รายเดือน</h3>
            <p className="text-xs text-muted-foreground mb-5">12 เดือนล่าสุด</p>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v: number) => [`฿${v.toLocaleString()}`, "รายได้"]}
                    contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
                  />
                  <Bar dataKey="รายได้" fill="#c9a84c" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
                ยังไม่มีข้อมูลรายได้
              </div>
            )}
          </div>

          {/* Case Type Pie */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
            <h3 className="font-semibold text-foreground mb-1">ประเภทคดี</h3>
            <p className="text-xs text-muted-foreground mb-5">สัดส่วนทั้งหมด</p>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(v) => <span style={{ fontSize: 11 }}>{v}</span>}
                  />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
                ยังไม่มีข้อมูลคดี
              </div>
            )}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Cases */}
          <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">คดีล่าสุด</h3>
              <button
                onClick={() => navigate("/admin/cases")}
                className="text-xs text-gold hover:underline font-medium"
              >
                ดูทั้งหมด →
              </button>
            </div>
            <div className="divide-y divide-border">
              {recentCases && recentCases.length > 0 ? (
                recentCases.slice(0, 5).map((c) => (
                  <div key={c.id} className="px-5 py-3.5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{c.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {caseTypeLabels[c.type] ?? c.type}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        c.status === "new"
                          ? "bg-blue-50 text-blue-600"
                          : c.status === "in_progress"
                          ? "bg-amber-50 text-amber-600"
                          : c.status === "closed"
                          ? "bg-green-50 text-green-600"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {caseStatusLabels[c.status]}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  ยังไม่มีคดี
                </div>
              )}
            </div>
          </div>

          {/* Today Appointments */}
          <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">นัดหมายวันนี้</h3>
              <button
                onClick={() => navigate("/admin/appointments")}
                className="text-xs text-gold hover:underline font-medium"
              >
                ดูทั้งหมด →
              </button>
            </div>
            <div className="divide-y divide-border">
              {todayAppointments && todayAppointments.length > 0 ? (
                todayAppointments.map((a) => (
                  <div key={a.id} className="px-5 py-3.5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{a.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(a.appointmentDate).toLocaleTimeString("th-TH", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        น.
                        {a.clientName && ` • ${a.clientName}`}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        a.status === "scheduled"
                          ? "bg-blue-50 text-blue-600"
                          : a.status === "completed"
                          ? "bg-green-50 text-green-600"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {a.status === "scheduled"
                        ? "นัดแล้ว"
                        : a.status === "completed"
                        ? "เสร็จสิ้น"
                        : "ยกเลิก"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
                  ไม่มีนัดหมายวันนี้
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

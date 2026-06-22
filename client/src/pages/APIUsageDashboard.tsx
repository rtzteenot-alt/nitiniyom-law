import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Activity, Zap, Clock, BarChart3 } from "lucide-react";
import { useLocation } from "wouter";

interface ApiStats {
  totalRequests: number;
  totalTokensUsed: number;
  averageResponseTime: number;
  requestsByEndpoint: Record<string, number>;
  requestsByModel: Record<string, number>;
  recentRequests: Array<{
    id: number;
    endpoint: string;
    method: string;
    status: number | null;
    responseTime: number | null;
    tokensUsed: number | null;
    model: string | null;
    createdAt: Date;
  }>;
}

export default function APIUsageDashboard() {
  const [, setLocation] = useLocation();
  const [stats, setStats] = useState<ApiStats | null>(null);
  const [loading, setLoading] = useState(true);

  const statsQuery = trpc.apiUsage.getStats.useQuery();

  useEffect(() => {
    if (statsQuery.data) {
      setStats(statsQuery.data as ApiStats);
      setLoading(false);
    }
  }, [statsQuery.data]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-amber-500/20 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Activity className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">API Usage Dashboard</h1>
                <p className="text-amber-400 text-sm mt-1">ติดตามการใช้ API ของคุณ</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation("/")}
              className="gap-2 text-white border-amber-500/30 hover:bg-amber-500/10"
            >
              <ArrowLeft className="w-4 h-4" />
              กลับหน้าแรก
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {loading || !stats ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin">
                <Activity className="w-12 h-12 text-amber-400" />
              </div>
              <p className="text-white mt-4">กำลังโหลดข้อมูล...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Requests */}
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl border border-blue-500/30 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-300 text-sm font-medium">จำนวนคำขอทั้งหมด</p>
                    <p className="text-3xl font-bold text-white mt-2">{stats.totalRequests}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-400 opacity-50" />
                </div>
              </div>

              {/* Total Tokens */}
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-xl border border-purple-500/30 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-300 text-sm font-medium">โทเค็นที่ใช้ทั้งหมด</p>
                    <p className="text-3xl font-bold text-white mt-2">{stats.totalTokensUsed.toLocaleString()}</p>
                  </div>
                  <Zap className="w-8 h-8 text-purple-400 opacity-50" />
                </div>
              </div>

              {/* Avg Response Time */}
              <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl border border-green-500/30 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-300 text-sm font-medium">เวลาตอบสนองเฉลี่ย</p>
                    <p className="text-3xl font-bold text-white mt-2">{stats.averageResponseTime}ms</p>
                  </div>
                  <Clock className="w-8 h-8 text-green-400 opacity-50" />
                </div>
              </div>

              {/* Models Used */}
              <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 rounded-xl border border-amber-500/30 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-300 text-sm font-medium">Model ที่ใช้</p>
                    <p className="text-3xl font-bold text-white mt-2">{Object.keys(stats.requestsByModel).length}</p>
                  </div>
                  <Activity className="w-8 h-8 text-amber-400 opacity-50" />
                </div>
              </div>
            </div>

            {/* Requests by Model */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-amber-500/20 p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                การใช้ Model
              </h2>
              <div className="space-y-3">
                {Object.entries(stats.requestsByModel).map(([model, count]) => (
                  <div key={model} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <span className="text-slate-300">{model}</span>
                    <span className="text-amber-400 font-semibold">{count} คำขอ</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Requests */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-amber-500/20 p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-400" />
                คำขอล่าสุด
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-slate-300">Endpoint</th>
                      <th className="text-left py-3 px-4 text-slate-300">Method</th>
                      <th className="text-left py-3 px-4 text-slate-300">Status</th>
                      <th className="text-left py-3 px-4 text-slate-300">Response Time</th>
                      <th className="text-left py-3 px-4 text-slate-300">Tokens</th>
                      <th className="text-left py-3 px-4 text-slate-300">เวลา</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentRequests.map((req) => (
                      <tr key={req.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                        <td className="py-3 px-4 text-slate-300 font-mono text-xs">{req.endpoint}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs font-semibold">
                            {req.method}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              req.status && req.status >= 200 && req.status < 300
                                ? "bg-green-500/20 text-green-300"
                                : "bg-red-500/20 text-red-300"
                            }`}
                          >
                            {req.status || "N/A"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-300">{req.responseTime}ms</td>
                        <td className="py-3 px-4 text-amber-300 font-semibold">{req.tokensUsed || 0}</td>
                        <td className="py-3 px-4 text-slate-400 text-xs">
                          {new Date(req.createdAt).toLocaleTimeString("th-TH")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

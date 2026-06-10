import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { Scale, Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLogin() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen navy-gradient flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen navy-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-10 shadow-2xl text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center shadow-2xl">
              <Scale className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="font-serif text-2xl font-bold text-white mb-2">
            สำนักงานกฎหมายนิตินิยม
          </h1>
          <p className="text-white/50 text-sm mb-8">ระบบจัดการภายใน</p>

          {/* Security badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/20 mb-8">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-300 text-xs font-medium">เข้าถึงได้เฉพาะเจ้าหน้าที่</span>
          </div>

          <p className="text-white/60 text-sm mb-8 leading-relaxed">
            กรุณาเข้าสู่ระบบด้วยบัญชี Manus ของเจ้าหน้าที่
            เพื่อเข้าถึง CRM และแดชบอร์ดการจัดการ
          </p>

          <a href={getLoginUrl()}>
            <Button
              size="lg"
              className="w-full gold-gradient text-white border-0 font-semibold h-12 shadow-lg"
            >
              <Lock className="w-4 h-4 mr-2" />
              เข้าสู่ระบบ
            </Button>
          </a>

          <div className="mt-6 pt-6 border-t border-white/10">
            <a href="/" className="text-white/40 text-xs hover:text-white/70 transition-colors">
              ← กลับหน้าหลัก
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

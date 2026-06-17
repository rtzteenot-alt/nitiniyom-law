import { useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { Scale, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLogin() {
  const { data: user, isLoading } = trpc.auth.me.useQuery();

  useEffect(() => {
    if (user && user.role === "admin") {
      window.location.href = "/admin";
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Scale className="w-8 h-8 text-amber-500" />
        </div>
        <h1 className="text-xl font-bold text-gray-800 mb-1">ระบบจัดการ</h1>
        <p className="text-sm text-gray-500 mb-6">สำนักงานกฎหมายนิตินิยม</p>

        <a href={getLoginUrl()}>
          <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium">
            <LogIn className="w-4 h-4 mr-2" />
            เข้าสู่ระบบด้วย Manus
          </Button>
        </a>

        <p className="text-xs text-gray-400 mt-4">เฉพาะเจ้าหน้าที่ที่ได้รับอนุญาตเท่านั้น</p>
      </div>
    </div>
  );
}

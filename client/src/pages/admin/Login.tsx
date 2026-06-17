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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-md text-center border border-amber-200">
        <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Scale className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">ระบบจัดการ</h1>
        <p className="text-base text-gray-600 mb-8">สำนักงานกฎหมายนิตินิยม</p>

        <a href={getLoginUrl()} className="block">
          <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-base py-3 rounded-xl shadow-lg hover:shadow-xl transition-all">
            <LogIn className="w-5 h-5 mr-3" />
            เข้าสู่ระบบด้วย Manus
          </Button>
        </a>

        <p className="text-sm text-gray-500 mt-6 leading-relaxed">เฉพาะเจ้าหน้าที่ที่ได้รับอนุญาตเท่านั้น</p>
      </div>
    </div>
  );
}

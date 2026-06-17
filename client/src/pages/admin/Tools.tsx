import { Wrench, Construction } from "lucide-react";

export default function AdminTools() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">โปรแกรมสำหรับทนาย</h1>
        <p className="text-sm text-gray-500 mt-0.5">เครื่องมือช่วยงานสำหรับทนายความ</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-4">
          <Construction className="w-8 h-8 text-amber-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">กำลังพัฒนา</h2>
        <p className="text-sm text-gray-400 max-w-sm">
          โปรแกรมสำหรับทนายความกำลังอยู่ในระหว่างการพัฒนา จะเพิ่มเครื่องมือต่างๆ เช่น เครื่องคำนวณดอกเบี้ย, คำนวณอายุความ และอื่นๆ ในเร็วๆ นี้
        </p>
        <div className="mt-6 flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-4 py-2 rounded-full">
          <Wrench className="w-3.5 h-3.5" />
          <span>Coming Soon</span>
        </div>
      </div>
    </div>
  );
}

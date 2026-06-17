import { useState } from "react";
import { Wrench, Scale, Calculator, Copy, RotateCcw } from "lucide-react";

type Mode = "normal" | "default";

interface CalcResult {
  days: number;
  interest: number;
  total: number;
  summaryText: string;
}

function InterestCalculator() {
  const [mode, setMode] = useState<Mode>("normal");
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("15");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [result, setResult] = useState<CalcResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleModeChange = (m: Mode) => {
    setMode(m);
    if (m === "normal") {
      setRate("15");
    } else {
      setRate("5");
    }
    setResult(null);
    setError("");
  };

  const calculate = () => {
    setError("");
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    if (isNaN(p) || p <= 0) {
      setError("กรุณากรอกยอดเงินต้นให้ถูกต้อง");
      return;
    }
    if (isNaN(r) || r <= 0) {
      setError("กรุณากรอกอัตราดอกเบี้ยให้ถูกต้อง");
      return;
    }
    if (!startDate || !endDate) {
      setError("กรุณาเลือกวันที่เริ่มต้นและวันที่สิ้นสุด");
      return;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (days < 0) {
      setError("วันที่สิ้นสุดต้องอยู่หลังวันที่เริ่มต้น");
      return;
    }
    const interest = p * (r / 100) * (days / 365);
    const total = p + interest;

    const opts: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    const startFmt = start.toLocaleDateString("th-TH", opts);
    const endFmt = end.toLocaleDateString("th-TH", opts);

    const summaryText = `เงินต้นจำนวน ${p.toLocaleString("th-TH")} บาท อัตราดอกเบี้ยร้อยละ ${r} ต่อปี นับตั้งแต่วันที่ ${startFmt} ถึงวันที่ ${endFmt} รวมเป็นเวลา ${days} วัน คิดเป็นดอกเบี้ย ${interest.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท รวมเป็นเงินต้นพร้อมดอกเบี้ยทั้งสิ้น ${total.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท`;

    setResult({ days, interest, total, summaryText });
  };

  const clearForm = () => {
    setPrincipal("");
    setStartDate("");
    setEndDate("");
    setResult(null);
    setError("");
    setMode("normal");
    setRate("15");
  };

  const copyText = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.summaryText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
        <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center">
          <Scale className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">ระบบคำนวณดอกเบี้ย</h3>
          <p className="text-xs text-gray-400">คำนวณดอกเบี้ยตามกฎหมายไทย</p>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-3 mb-5">
        <button
          onClick={() => handleModeChange("normal")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-all ${
            mode === "normal"
              ? "border-amber-400 bg-amber-50 text-amber-700"
              : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
          }`}
        >
          สัญญากู้ยืมปกติ
        </button>
        <button
          onClick={() => handleModeChange("default")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-all ${
            mode === "default"
              ? "border-amber-400 bg-amber-50 text-amber-700"
              : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
          }`}
        >
          ผิดนัดชำระหนี้ (ฟ้องคดี)
        </button>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1.5">ยอดเงินต้น (บาท)</label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            placeholder="เช่น 100000"
            min="0"
            step="0.01"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1.5">อัตราดอกเบี้ยต่อปี (%)</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="เช่น 15"
            min="0"
            step="0.01"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 transition-colors"
          />
          <p className="text-xs text-gray-400 mt-1">
            {mode === "normal"
              ? "* ปรับได้สูงสุด 15% ตามกฎหมายสำหรับการกู้ยืมทั่วไป"
              : "* อัตราดอกเบี้ยผิดนัดตามกฎหมายใหม่ (5% ต่อปี)"}
          </p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1.5">วันที่เริ่มต้นคิดดอกเบี้ย</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1.5">วันที่สิ้นสุด / วันที่ชำระ</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={calculate}
          className="flex-1 flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
        >
          <Calculator className="w-4 h-4" />
          คำนวณผลลัพธ์
        </button>
        <button
          onClick={clearForm}
          className="flex items-center justify-center gap-2 border border-gray-200 text-gray-500 hover:bg-gray-50 font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          ล้างข้อมูล
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="mt-5 bg-gray-50 border border-gray-200 rounded-xl p-5">
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white rounded-lg p-3 text-center shadow-sm">
              <p className="text-xs text-gray-400 mb-1">จำนวนวันรวม</p>
              <p className="text-xl font-bold text-gray-800">{result.days} วัน</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center shadow-sm">
              <p className="text-xs text-gray-400 mb-1">ดอกเบี้ยสะสม</p>
              <p className="text-xl font-bold text-amber-500">
                {result.interest.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ฿
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center shadow-sm">
              <p className="text-xs text-gray-400 mb-1">ยอดรวมทั้งสิ้น</p>
              <p className="text-xl font-bold text-gray-800">
                {result.total.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ฿
              </p>
            </div>
          </div>

          <div className="bg-white border border-dashed border-gray-300 rounded-lg p-4 text-sm text-gray-700 leading-relaxed mb-3">
            {result.summaryText}
          </div>

          <button
            onClick={copyText}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              copied
                ? "bg-green-500 text-white"
                : "bg-gray-800 hover:bg-gray-900 text-white"
            }`}
          >
            <Copy className="w-4 h-4" />
            {copied ? "คัดลอกสำเร็จ!" : "คัดลอกข้อความสำหรับใช้ในสัญญา/คำฟ้อง"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminTools() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">โปรแกรมสำหรับทนาย</h1>
        <p className="text-sm text-gray-500 mt-0.5">เครื่องมือช่วยงานสำหรับทนายความ</p>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {/* Interest Calculator */}
        <InterestCalculator />

        {/* Placeholder for future tools */}
        <div className="bg-white rounded-xl border border-dashed border-gray-200 p-8 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-3">
            <Wrench className="w-6 h-6 text-gray-300" />
          </div>
          <p className="text-sm text-gray-400">กำลังพัฒนาเครื่องมืออื่นๆ เพิ่มเติม</p>
          <p className="text-xs text-gray-300 mt-1">เช่น คำนวณอายุความ, คำนวณค่าเสียหาย</p>
        </div>
      </div>
    </div>
  );
}

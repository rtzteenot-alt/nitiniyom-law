import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Copy, RotateCcw } from 'lucide-react';

type CalculationMode = 'normal' | 'overdue';

interface CalculationResult {
  days: number;
  interest: number;
  total: number;
}

export default function InterestCalculator() {
  const [mode, setMode] = useState<CalculationMode>('normal');
  const [principal, setPrincipal] = useState<string>('');
  const [rate, setRate] = useState<string>('15');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [overdueRate, setOverdueRate] = useState<string>('5');
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculateInterest = () => {
    // Validation
    if (!principal || !rate || !startDate || !endDate) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    const principalNum = parseFloat(principal);
    const rateNum = parseFloat(rate);
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (principalNum <= 0 || rateNum < 0) {
      toast.error('กรุณากรอกตัวเลขที่ถูกต้อง');
      return;
    }

    if (start > end) {
      toast.error('วันที่เริ่มต้นต้องน้อยกว่าวันที่สิ้นสุด');
      return;
    }

    // Calculate days
    const timeDiff = end.getTime() - start.getTime();
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;

    // Calculate interest
    const finalRate = mode === 'overdue' ? parseFloat(overdueRate) : rateNum;
    const interest = (principalNum * finalRate * days) / (100 * 365);
    const total = principalNum + interest;

    setResult({
      days,
      interest: Math.round(interest * 100) / 100,
      total: Math.round(total * 100) / 100,
    });
  };

  const clearForm = () => {
    setPrincipal('');
    setRate('15');
    setStartDate('');
    setEndDate('');
    setOverdueRate('5');
    setResult(null);
  };

  const copyToClipboard = () => {
    if (!result) return;

    const startDateFormatted = new Date(startDate).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const endDateFormatted = new Date(endDate).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const finalRate = mode === 'overdue' ? overdueRate : rate;

    const summary = `เงินต้น ${principalNum.toLocaleString('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} บาท ดอกเบี้ยร้อยละ ${finalRate}% ต่อปี นับตั้งแต่วันที่ ${startDateFormatted} ถึง ${endDateFormatted} รวมเป็นเวลา ${result.days} วัน คิดเป็นดอกเบี้ย ${result.interest.toLocaleString('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} บาท รวมเป็นเงินทั้งสิ้น ${result.total.toLocaleString('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} บาท`;

    navigator.clipboard.writeText(summary);
    toast.success('คัดลอกสรุปผลแล้ว');
  };

  const principalNum = parseFloat(principal) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            ระบบคำนวณดอกเบี้ย
          </h1>
          <p className="text-slate-600">
            เครื่องมือช่วยคำนวณดอกเบี้ยเงินกู้สำหรับทนายความ
          </p>
        </div>

        {/* Mode Selection */}
        <Card className="mb-6 p-6 border-2 border-slate-200 shadow-sm">
          <Label className="text-lg font-semibold mb-4 block">
            เลือกประเภทการคำนวณ
          </Label>
          <RadioGroup value={mode} onValueChange={(v) => setMode(v as CalculationMode)}>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="normal" id="normal" />
              <Label htmlFor="normal" className="cursor-pointer font-medium">
                คำนวณดอกเบี้ยเงินกู้ปกติ (สำหรับทำสัญญากู้ยืม)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="overdue" id="overdue" />
              <Label htmlFor="overdue" className="cursor-pointer font-medium">
                คำนวณดอกเบี้ยผิดนัดชำระ (สำหรับฟ้องคดีหรือทวงถามหนี้)
              </Label>
            </div>
          </RadioGroup>
        </Card>

        {/* Input Form */}
        <Card className="mb-6 p-6 border-2 border-slate-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 text-slate-900">
            กรอกรายละเอียดข้อมูล
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Principal Amount */}
            <div>
              <Label htmlFor="principal" className="font-medium mb-2 block">
                เงินต้น (บาท) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="principal"
                type="number"
                placeholder="เช่น 100000"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                step="0.01"
                className="border-slate-300"
              />
            </div>

            {/* Interest Rate */}
            <div>
              <Label htmlFor="rate" className="font-medium mb-2 block">
                อัตราดอกเบี้ยต่อปี (%) <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="rate"
                  type="number"
                  placeholder="เช่น 15"
                  value={mode === 'overdue' ? overdueRate : rate}
                  onChange={(e) =>
                    mode === 'overdue'
                      ? setOverdueRate(e.target.value)
                      : setRate(e.target.value)
                  }
                  step="0.01"
                  className="border-slate-300"
                />
                {mode === 'overdue' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOverdueRate('5')}
                    className="whitespace-nowrap"
                  >
                    ตามกฎหมาย (5%)
                  </Button>
                )}
              </div>
            </div>

            {/* Start Date */}
            <div>
              <Label htmlFor="startDate" className="font-medium mb-2 block">
                วันที่เริ่มต้นคิดดอกเบี้ย <span className="text-red-500">*</span>
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border-slate-300"
              />
            </div>

            {/* End Date */}
            <div>
              <Label htmlFor="endDate" className="font-medium mb-2 block">
                วันที่สิ้นสุดการคิดดอกเบี้ย <span className="text-red-500">*</span>
              </Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border-slate-300"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={clearForm}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              ล้างข้อมูล
            </Button>
            <Button
              onClick={calculateInterest}
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold"
            >
              คำนวณผล
            </Button>
          </div>
        </Card>

        {/* Results */}
        {result && (
          <Card className="p-6 border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-slate-900">
              ผลการคำนวณ
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Days */}
              <div className="bg-white rounded-lg p-4 border-2 border-slate-200">
                <p className="text-sm text-slate-600 mb-1">จำนวนวันรวม</p>
                <p className="text-3xl font-bold text-slate-900">
                  {result.days}
                </p>
                <p className="text-xs text-slate-500 mt-1">วัน</p>
              </div>

              {/* Interest */}
              <div className="bg-white rounded-lg p-4 border-2 border-slate-200">
                <p className="text-sm text-slate-600 mb-1">ดอกเบี้ยที่สะสม</p>
                <p className="text-3xl font-bold text-amber-600">
                  {result.interest.toLocaleString('th-TH', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-xs text-slate-500 mt-1">บาท</p>
              </div>

              {/* Total */}
              <div className="bg-white rounded-lg p-4 border-2 border-slate-200">
                <p className="text-sm text-slate-600 mb-1">ยอดรวมทั้งสิ้น</p>
                <p className="text-3xl font-bold text-slate-900">
                  {result.total.toLocaleString('th-TH', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-xs text-slate-500 mt-1">บาท</p>
              </div>
            </div>

            {/* Copy Summary */}
            <div className="bg-white rounded-lg p-4 border-2 border-slate-200 mb-4">
              <p className="text-sm text-slate-600 mb-3 font-medium">
                สรุปผลการคำนวณ (สำหรับคัดลอก):
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                เงินต้น {principalNum.toLocaleString('th-TH', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} บาท ดอกเบี้ยร้อยละ{' '}
                {mode === 'overdue' ? overdueRate : rate}% ต่อปี นับตั้งแต่วันที่{' '}
                {new Date(startDate).toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}{' '}
                ถึง{' '}
                {new Date(endDate).toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}{' '}
                รวมเป็นเวลา {result.days} วัน คิดเป็นดอกเบี้ย{' '}
                {result.interest.toLocaleString('th-TH', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                บาท รวมเป็นเงินทั้งสิ้น{' '}
                {result.total.toLocaleString('th-TH', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                บาท
              </p>
            </div>

            <Button
              onClick={copyToClipboard}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold gap-2"
            >
              <Copy className="w-4 h-4" />
              คัดลอกสรุปผล
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calculator } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

interface InterestResult {
  principal: number;
  rate: number;
  days: number;
  interestType: string;
  simpleInterest: number;
  compoundInterest: number;
  totalSimple: number;
  totalCompound: number;
}

export default function InterestCalculator() {
  const [, setLocation] = useLocation();
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [days, setDays] = useState("");
  const [interestType, setInterestType] = useState("simple");
  const [result, setResult] = useState<InterestResult | null>(null);

  const handleCalculate = () => {
    if (!principal || !rate || !days) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const d = parseFloat(days);

    // ดอกเบี้ยธรรมชาติ (Simple Interest)
    const simpleInterest = (p * r * d) / (100 * 365);
    const totalSimple = p + simpleInterest;

    // ดอกเบี้ยทบต้น (Compound Interest)
    const compoundInterest = p * (Math.pow(1 + r / (100 * 365), d) - 1);
    const totalCompound = p + compoundInterest;

    setResult({
      principal: p,
      rate: r,
      days: d,
      interestType,
      simpleInterest,
      compoundInterest,
      totalSimple,
      totalCompound,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/admin/tools")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">คำนวณดอกเบี้ย</h1>
          <p className="text-muted-foreground mt-2">
            คำนวณดอกเบี้ยธรรมชาติและดอกเบี้ยทบต้น
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>ข้อมูลการคำนวณ</CardTitle>
            <CardDescription>
              กรอกจำนวนเงิน อัตราดอกเบี้ย และระยะเวลา
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="principal">จำนวนเงินต้น (บาท)</Label>
              <Input
                id="principal"
                type="number"
                min="0"
                step="0.01"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                placeholder="เช่น 100000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate">อัตราดอกเบี้ย (% ต่อปี)</Label>
              <Input
                id="rate"
                type="number"
                min="0"
                step="0.01"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="เช่น 5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="days">ระยะเวลา (วัน)</Label>
              <Input
                id="days"
                type="number"
                min="0"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                placeholder="เช่น 365"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">ประเภทดอกเบี้ย</Label>
              <Select value={interestType} onValueChange={setInterestType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">ดอกเบี้ยธรรมชาติ</SelectItem>
                  <SelectItem value="compound">ดอกเบี้ยทบต้น</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleCalculate} className="w-full">
              <Calculator className="h-4 w-4 mr-2" />
              คำนวณ
            </Button>
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-4">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-900">ดอกเบี้ยธรรมชาติ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-blue-600">ดอกเบี้ย</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {result.simpleInterest.toLocaleString("th-TH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    บาท
                  </p>
                </div>
                <div className="pt-3 border-t border-blue-200">
                  <p className="text-sm text-blue-600">รวมทั้งสิ้น</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {result.totalSimple.toLocaleString("th-TH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    บาท
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-900">ดอกเบี้ยทบต้น</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-green-600">ดอกเบี้ย</p>
                  <p className="text-2xl font-bold text-green-900">
                    {result.compoundInterest.toLocaleString("th-TH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    บาท
                  </p>
                </div>
                <div className="pt-3 border-t border-green-200">
                  <p className="text-sm text-green-600">รวมทั้งสิ้น</p>
                  <p className="text-2xl font-bold text-green-900">
                    {result.totalCompound.toLocaleString("th-TH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    บาท
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

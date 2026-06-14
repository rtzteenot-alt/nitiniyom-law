import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calendar } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

export default function TimeCalculator() {
  const [, setLocation] = useLocation();
  const [startDate, setStartDate] = useState("");
  const [days, setDays] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleCalculate = () => {
    if (!startDate || !days) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const start = new Date(startDate);
    const daysToAdd = parseInt(days, 10);
    const endDate = new Date(start);
    endDate.setDate(endDate.getDate() + daysToAdd);

    const formatter = new Intl.DateTimeFormat("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    setResult(formatter.format(endDate));
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
          <h1 className="text-3xl font-bold tracking-tight">นับระยะเวลายื่นคำให้การ</h1>
          <p className="text-muted-foreground mt-2">
            คำนวณกำหนดเวลาการยื่นคำให้การตามกฎหมาย
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>ข้อมูลการคำนวณ</CardTitle>
            <CardDescription>
              กรอกวันที่เริ่มต้นและจำนวนวันที่ต้องการคำนวณ
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">วันที่เริ่มต้น</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="days">จำนวนวัน</Label>
              <Input
                id="days"
                type="number"
                min="0"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                placeholder="เช่น 30"
              />
            </div>
            <Button onClick={handleCalculate} className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              คำนวณ
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-900">ผลลัพธ์</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold text-green-700">
                  {result}
                </div>
                <p className="text-sm text-green-600">
                  วันที่ต้องยื่นคำให้การล่าสุด
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

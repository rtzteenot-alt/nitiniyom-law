import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

const templates = [
  {
    id: 1,
    name: "แม่แบบสัญญาขายสินค้า",
    description: "สัญญาขายสินค้าทั่วไป พร้อมเงื่อนไขและข้อตกลง",
    category: "สัญญาขาย",
  },
  {
    id: 2,
    name: "แม่แบบสัญญาเช่าอสังหาริมทรัพย์",
    description: "สัญญาเช่าที่ดิน บ้าน หรือสำนักงาน",
    category: "สัญญาเช่า",
  },
  {
    id: 3,
    name: "แม่แบบสัญญากู้ยืมเงิน",
    description: "สัญญากู้ยืมเงินระหว่างบุคคล พร้อมเงื่อนไขการชำระ",
    category: "สัญญาการเงิน",
  },
  {
    id: 4,
    name: "แม่แบบสัญญาจ้างแรงงาน",
    description: "สัญญาจ้างพนักงานพิเศษหรือเหมาจ้าง",
    category: "สัญญาจ้าง",
  },
  {
    id: 5,
    name: "แม่แบบสัญญาบริการ",
    description: "สัญญาบริการทั่วไป พร้อมเงื่อนไขการให้บริการ",
    category: "สัญญาบริการ",
  },
  {
    id: 6,
    name: "แม่แบบสัญญาหุ้นส่วน",
    description: "สัญญาสร้างหุ้นส่วนธุรกิจ พร้อมสิทธิและหน้าที่",
    category: "สัญญาธุรกิจ",
  },
];

export default function ContractTemplates() {
  const [, setLocation] = useLocation();

  const handleDownload = (templateName: string) => {
    toast.success(`กำลังดาวน์โหลด: ${templateName}`);
    // ในอนาคต จะเพิ่มฟังก์ชันดาวน์โหลดจริง
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
          <h1 className="text-3xl font-bold tracking-tight">แม่แบบสัญญา</h1>
          <p className="text-muted-foreground mt-2">
            ดาวน์โหลดแม่แบบสัญญาต่างๆ สำหรับใช้ในการทำงาน
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-amber-600" />
                    {template.name}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {template.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                  {template.category}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(template.name)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  ดาวน์โหลด
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">หมายเหตุ</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800 space-y-2">
          <p>
            • แม่แบบเหล่านี้เป็นเพียงตัวอย่างเท่านั้น
            ควรปรึกษากับทนายความก่อนใช้งานจริง
          </p>
          <p>
            • แต่ละสัญญาอาจต้องปรับแต่งตามสถานการณ์และความต้องการเฉพาะ
          </p>
          <p>
            • ตรวจสอบให้แน่ใจว่าสัญญาสอดคล้องกับกฎหมายและข้อบังคับที่เกี่ยวข้อง
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

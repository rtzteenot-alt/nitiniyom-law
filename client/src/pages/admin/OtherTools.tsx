import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calculator, DollarSign, Percent, Clock } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

const tools = [
  {
    id: 1,
    name: "คำนวณค่าธรรมเนียมกฎหมาย",
    description: "คำนวณค่าธรรมเนียมตามอัตราที่กฎหมายกำหนด",
    icon: DollarSign,
    status: "coming_soon",
  },
  {
    id: 2,
    name: "คำนวณเบี้ยประกันภัย",
    description: "คำนวณเบี้ยประกันภัยตามประเภทและมูลค่า",
    icon: Percent,
    status: "coming_soon",
  },
  {
    id: 3,
    name: "คำนวณค่าเสียหาย",
    description: "คำนวณค่าเสียหายตามกรณีที่เกิดขึ้น",
    icon: Calculator,
    status: "coming_soon",
  },
  {
    id: 4,
    name: "คำนวณระยะเวลาอายุความ",
    description: "คำนวณระยะเวลาอายุความตามกฎหมายแต่ละประเภท",
    icon: Clock,
    status: "coming_soon",
  },
];

export default function OtherTools() {
  const [, setLocation] = useLocation();

  const handleToolClick = (toolName: string) => {
    toast.info(`${toolName} - เครื่องมือนี้จะเปิดใช้งานในเร็วๆ นี้`);
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
          <h1 className="text-3xl font-bold tracking-tight">เครื่องมือคำนวณอื่นๆ</h1>
          <p className="text-muted-foreground mt-2">
            เครื่องมือช่วยคำนวณเพิ่มเติมสำหรับการทำงานด้านกฎหมาย
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Card
              key={tool.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleToolClick(tool.name)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-amber-600" />
                      {tool.name}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {tool.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                    {tool.status === "coming_soon" ? "เร็วๆ นี้" : "พร้อมใช้"}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={tool.status === "coming_soon"}
                  >
                    เปิดใช้งาน
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="text-amber-900">ข้อมูลเพิ่มเติม</CardTitle>
        </CardHeader>
        <CardContent className="text-amber-800 space-y-2">
          <p>
            • เครื่องมือเหล่านี้อยู่ระหว่างการพัฒนา
            และจะเปิดใช้งานอย่างเป็นทางการในเร็วๆ นี้
          </p>
          <p>
            • หากคุณต้องการเครื่องมือเพิ่มเติม
            โปรดติดต่อทีมพัฒนา
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

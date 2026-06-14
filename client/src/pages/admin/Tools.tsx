import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Calculator, Clock, FileText, BarChart3 } from "lucide-react";
import { toast } from "sonner";

const tools = [
  {
    id: "time_calculator",
    icon: Clock,
    title: "นับระยะเวลายื่นคำให้การ",
    description: "คำนวณกำหนดเวลาการยื่นคำให้การตามกฎหมาย พร้อมแสดงวันที่สำคัญ",
    color: "from-blue-500 to-blue-600",
    status: "coming_soon",
  },
  {
    id: "interest_calculator",
    icon: Calculator,
    title: "คำนวณดอกเบี้ย",
    description: "คำนวณดอกเบี้ยธรรมชาติและดอกเบี้ยทบต้น พร้อมแสดงผลเป็นตารางรายละเอียด",
    color: "from-green-500 to-green-600",
    status: "coming_soon",
  },
  {
    id: "contract_template",
    icon: FileText,
    title: "แม่แบบสัญญา",
    description: "แม่แบบสัญญาต่างๆ พร้อมคำอธิบาย เพื่อให้ผู้ใช้สามารถปรับแต่งได้ตามต้องการ",
    color: "from-amber-500 to-amber-600",
    status: "coming_soon",
  },
  {
    id: "legal_calculator",
    icon: BarChart3,
    title: "เครื่องมือคำนวณอื่นๆ",
    description: "เครื่องมือคำนวณทางกฎหมายอื่นๆ เช่น การคำนวณค่าเสียหายทดแทน ค่าปรึกษา",
    color: "from-purple-500 to-purple-600",
    status: "coming_soon",
  },
];

export default function AdminTools() {
  const handleToolClick = (toolId: string) => {
    toast.info("เครื่องมือนี้กำลังพัฒนา กรุณารอติดตามข้อมูลเพิ่มเติม");
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">โปรแกรมช่วยทนาย</h1>
          <p className="text-muted-foreground">
            เครื่องมือช่วยคำนวณและจัดการงานทางกฎหมายเพื่อให้การทำงานเป็นไปอย่างมีประสิทธิภาพ
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card
                key={tool.id}
                className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group border-border hover:border-amber-200"
                onClick={() => handleToolClick(tool.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    กำลังพัฒนา
                  </span>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2">{tool.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {tool.description}
                </p>

                <div className="flex items-center gap-2 text-amber-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>เปิดใช้งานเร็วๆ นี้</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-foreground mb-2">💡 เคล็ดลับ</h3>
          <p className="text-sm text-foreground/80">
            เครื่องมือเหล่านี้จะช่วยให้คุณคำนวณและจัดการงานทางกฎหมายได้อย่างรวดเร็วและแม่นยำ
            ผลลัพธ์ทั้งหมดจะถูกบันทึกไว้เพื่อให้คุณสามารถอ้างอิงได้ในภายหลัง
          </p>
        </div>
      </div>
    </div>
  );
}

import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator, Clock, FileText, BarChart3 } from "lucide-react";
import { toast } from "sonner";

export default function Tools() {
  const tools = [
    {
      id: "time-calculator",
      title: "นับระยะเวลายื่นคำให้การ",
      description: "คำนวณกำหนดเวลาการยื่นคำให้การตามกฎหมายวิธีพิจารณาคดี",
      icon: Clock,
      color: "from-blue-600 to-blue-400",
      href: "/tools/time-calculator",
    },
    {
      id: "interest-calculator",
      title: "คำนวณดอกเบี้ย",
      description: "คำนวณดอกเบี้ยตามอัตราและระยะเวลา รองรับดอกเบี้ยธรรมชาติและดอกเบี้ยทบต้น",
      icon: Calculator,
      color: "from-amber-600 to-amber-400",
      href: "/tools/interest-calculator",
    },
    {
      id: "contract-template",
      title: "แม่แบบสัญญา",
      description: "แม่แบบสัญญาต่างๆ ที่สามารถปรับแต่งตามความต้องการ",
      icon: FileText,
      color: "from-emerald-600 to-emerald-400",
      href: "/tools/contract-template",
    },
    {
      id: "legal-calculator",
      title: "เครื่องมือคำนวณกฎหมายอื่นๆ",
      description: "เครื่องมือช่วยคำนวณและวิเคราะห์ทางกฎหมายอื่นๆ",
      icon: BarChart3,
      color: "from-purple-600 to-purple-400",
      href: "/tools/legal-calculator",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* ===== HEADER ===== */}
      <section className="py-16 md:py-24 navy-gradient relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23c9a84c' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="container relative z-10">
          <div className="text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
              โปรแกรมช่วยทนาย
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              เครื่องมือช่วยคำนวณและจัดการงานทางกฎหมายที่ออกแบบมาเพื่อให้ทนายความและลูกค้าสามารถทำงานได้อย่างมีประสิทธิภาพ
            </p>
          </div>
        </div>
      </section>

      {/* ===== TOOLS GRID ===== */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div key={tool.id} className="group cursor-pointer" onClick={() => {
                  toast.info("เครื่องมือนี้กำลังพัฒนาคนหน้า กรุณารอดเดียว");
                }}>
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-border hover:shadow-xl transition-all duration-300 hover:border-amber-200 hover:-translate-y-1 h-full">
                    <div
                      className={`w-16 h-16 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                      {tool.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {tool.description}
                    </p>
                    <div className="flex items-center gap-2 text-gold text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>กำลังพัฒนาคนหน้า</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== COMING SOON ===== */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
            เครื่องมืออื่นๆ ที่กำลังจะมาถึง
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            เรากำลังพัฒนาเครื่องมือเพิ่มเติมเพื่อให้ช่วยเหลือในงานทางกฎหมายของคุณได้มากขึ้น
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {["ตัวอักษรนับเวลา", "เครื่องคำนวณค่าเสียหาย", "เครื่องมือวิเคราะห์สัญญา"].map(
              (item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-6 border border-border text-muted-foreground"
                >
                  {item}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-16 md:py-24 bg-background border-t border-border">
        <div className="container text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6">
            ต้องการปรึกษาเพิ่มเติม?
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8">
            หากคุณมีคำถามหรือต้องการความช่วยเหลือจากทนายความของเรา โปรดติดต่อเราได้ตลอดเวลา
          </p>
          <Link href="/#contact">
            <Button size="lg" className="gold-gradient text-white border-0 font-semibold px-8">
              ติดต่อเรา
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

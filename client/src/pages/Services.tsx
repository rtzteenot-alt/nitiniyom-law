import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

const contractServices = [
  "ร่างและตรวจสอบสัญญาซื้อขาย",
  "ร่างและตรวจสอบสัญญาเช่า",
  "ร่างและตรวจสอบสัญญาจ้างงาน",
  "ร่างและตรวจสอบสัญญารับจ้างทำของ",
  "ร่างและตรวจสอบสัญญากู้ยืมเงิน",
  "ร่างและตรวจสอบสัญญาค้ำประกัน",
  "ร่างและตรวจสอบสัญญาร่วมลงทุน (Joint Venture Agreement)",
  "ร่างและตรวจสอบสัญญาหุ้นส่วนทางธุรกิจ",
  "ร่างและตรวจสอบสัญญาแฟรนไชส์",
  "ร่างและตรวจสอบสัญญาแต่งตั้งตัวแทนจำหน่าย",
  "ร่างและตรวจสอบสัญญาให้บริการ (Service Agreement)",
  "ร่างและตรวจสอบสัญญารักษาความลับ (NDA)",
  "ร่างและตรวจสอบข้อตกลงทางธุรกิจ (MOU)",
];

const legalDocuments = [
  "หนังสือทวงถามหนี้",
  "หนังสือบอกกล่าว",
  "หนังสือมอบอำนาจ",
  "หนังสือรับสภาพหนี้",
  "พินัยกรรม",
  "คำร้อง คำขอ และหนังสือชี้แจงต่อหน่วยงานราชการ",
  "หนังสือคัดค้านหรือโต้แย้งสิทธิ",
  "เอกสารสำหรับการจัดตั้งและดำเนินธุรกิจ",
];

const benefits = [
  { title: "ความถูกต้องทางกฎหมาย", desc: "เอกสารของคุณจะถูกตรวจสอบให้ถูกต้องตามกฎหมายปัจจุบัน" },
  { title: "คุ้มครองสิทธิประโยชน์", desc: "ทีมของเราจะช่วยให้เอกสารคุ้มครองสิทธิประโยชน์ของคุณอย่างสูงสุด" },
  { title: "ชัดเจนและเข้าใจได้", desc: "เอกสารจะถูกเขียนให้ชัดเจนและเข้าใจได้ง่าย" },
  { title: "ประสบการณ์มืออาชีพ", desc: "ทนายความมีประสบการณ์ในการจัดการเอกสารกฎหมายหลากหลายประเภท" },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden pt-24">
        {/* Layered background */}
        <div className="absolute inset-0 hero-gradient" />

        {/* Animated grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `linear-gradient(oklch(0.72 0.12 75 / 0.5) 1px, transparent 1px),
                              linear-gradient(90deg, oklch(0.72 0.12 75 / 0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Radial glow */}
        <div
          className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, oklch(0.72 0.12 75 / 0.4) 0%, transparent 70%)",
          }}
        />

        {/* Gold top line */}
        <div className="absolute top-0 left-0 right-0 h-1 gold-gradient-animated" />

        <div className="container relative z-10">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-400/30 bg-amber-400/10 mb-8 animate-fade-in-up">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-300 text-xs font-medium tracking-wider uppercase">
                บริการกฎหมายมืออาชีพ
              </span>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-fade-in-up delay-100">
              บริการ
              <br />
              <span className="gold-text-shimmer">กฎหมายครบวงจร</span>
            </h1>

            <p className="text-lg text-white/75 leading-relaxed mb-8 max-w-2xl animate-fade-in-up delay-200">
              สำนักงานนิตินิยมกฎหมายให้บริการร่าง ตรวจสอบ และแก้ไขเอกสารทางกฎหมายทุกประเภท
              เพื่อให้เอกสารมีความถูกต้อง ชัดเจน และคุ้มครองสิทธิประโยชน์ของลูกค้าอย่างรอบด้าน
            </p>

            <div className="animate-fade-in-up delay-300">
              <Link href="/#contact">
                <Button className="gold-gradient-animated text-white hover:opacity-90 font-semibold px-8 shadow-lg shadow-amber-900/30 border-0 glow-gold">
                  ติดต่อเรา
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTENT ===== */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container">
          {/* Introduction Section */}
          <div className="mb-20 rounded-2xl p-8 md:p-12 glass-card border border-white/10 animate-fade-in-up">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
              ความเชี่ยวชาญของเรา
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              ด้วยประสบการณ์หลายปีในสาขากฎหมาย ทีมของเรามีความเชี่ยวชาญในการร่างและตรวจสอบเอกสารทางกฎหมายทั้งหมดประเภท
              เพื่อให้เอกสารของคุณมีความถูกต้องตามกฎหมาย ชัดเจน และคุ้มครองสิทธิประโยชน์ของคุณอย่างสูงสุด
            </p>
          </div>

          {/* Contract Services Section */}
          <div className="mb-20">
            <div className="inline-flex items-center gap-2 mb-8">
              <div className="h-px w-8 bg-gold" />
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">บริการสัญญา</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {contractServices.map((service, index) => (
                <div
                  key={index}
                  className={`glass-card rounded-xl p-5 border border-white/10 card-hover animate-fade-in-up`}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <p className="text-foreground/80 leading-relaxed">{service}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legal Documents Section */}
          <div className="mb-20">
            <div className="inline-flex items-center gap-2 mb-8">
              <div className="h-px w-8 bg-gold" />
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                เอกสารทางกฎหมายอื่น ๆ
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {legalDocuments.map((document, index) => (
                <div
                  key={index}
                  className={`glass-card rounded-xl p-5 border border-white/10 card-hover animate-fade-in-up`}
                  style={{ animationDelay: `${(index + contractServices.length) * 30}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <p className="text-foreground/80 leading-relaxed">{document}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="rounded-2xl p-8 md:p-12 glass-card border border-white/10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-10">
              ประโยชน์ของการใช้บริการเรา
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {benefits.map((benefit, i) => (
                <div
                  key={i}
                  className={`flex gap-4 p-6 rounded-xl bg-white/5 border border-white/5 hover:border-gold/20 transition-all duration-300 animate-fade-in-up`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center flex-shrink-0 shadow-md">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative overflow-hidden py-16 md:py-20">
        {/* Background */}
        <div className="absolute inset-0 hero-gradient" />

        {/* Decorative elements */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `linear-gradient(oklch(0.72 0.12 75 / 0.5) 1px, transparent 1px),
                              linear-gradient(90deg, oklch(0.72 0.12 75 / 0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Gold accent lines */}
        <div className="absolute top-0 left-0 right-0 h-1 gold-gradient-animated" />
        <div className="absolute bottom-0 left-0 right-0 h-1 gold-gradient-animated" />

        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-amber-400/30" />
        <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-amber-400/30" />

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 text-white animate-fade-in-up">
              พร้อมที่จะใช้บริการของเรา?
            </h2>
            <p className="text-lg text-white/75 mb-8 animate-fade-in-up delay-100">
              ติดต่อเราเพื่อรับคำปรึกษาและบริการจากทนายความมืออาชีพของสำนักงานกฎหมายนิตินิยม
            </p>
            <div className="animate-fade-in-up delay-200">
              <Link href="/#contact">
                <Button className="gold-gradient-animated text-white hover:opacity-90 font-semibold px-8 py-6 text-lg shadow-lg shadow-amber-900/30 border-0 glow-gold">
                  ติดต่อเรา
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

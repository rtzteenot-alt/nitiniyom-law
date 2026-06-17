import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Scale, Menu, X, ArrowRight, Heart, Award, Sparkles, CheckCircle2 } from "lucide-react";

export default function Team() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll animation effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = cardRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1 && !visibleCards.includes(index)) {
              setVisibleCards((prev) => [...prev, index]);
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      cardRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [visibleCards]);

  const values = [
    { icon: Heart, title: "ความเอาใจใส่", desc: "ตั้งใจฟังและเข้าใจปัญหาของลูกค้าอย่างแท้จริง เพื่อหาทางแก้ไขที่ดีที่สุด" },
    { icon: Award, title: "ความเชี่ยวชาญ", desc: "ทีมที่มีความรู้และประสบการณ์สูงในด้านกฎหมายต่างๆ พร้อมอัปเดตความรู้อยู่เสมอ" },
    { icon: Scale, title: "ยุติธรรม", desc: "ยึดมั่นในหลักการยุติธรรมและจริยธรรมวิชาชีพในการให้บริการทางกฎหมาย" },
  ];

  const organizationStructure = [
    {
      id: 1,
      position: "ผู้อำนวยการ",
      name: "นาย นิยม ดีจันทึก",
      education: "มหาวิทยาลัยรามคำแหง",
    },
    {
      id: 2,
      position: "หัวหน้าสำนักงาน",
      name: "นางสาว ภัคจิรา นาคพลกรัง",
      education: "มหาวิทยาลัยขอนแก่น เกียรตินิยมอันดับ 1",
    },
    {
      id: 3,
      position: "เลขานุการสำนักงาน",
      name: "นางสาว ภัคจิรา นาคพลกรัง",
      education: "มหาวิทยาลัยขอนแก่น เกียรตินิยมอันดับ 1",
    },
    {
      id: 4,
      position: "ทนายความ",
      name: "นางสาว ภัคจิรา นาคพลกรัง",
      education: "มหาวิทยาลัยขอนแก่น เกียรตินิยมอันดับ 1",
    },
  ];

  const partners = [
    {
      id: 1,
      position: "ผู้ช่วยทนายความ",
      name: "นาย ธนกร คูณตุ้ม",
      education: "มหาวิทยาลัยรามคำแหง",
    },
    {
      id: 2,
      position: "ทนายความและที่ปรึกษาสำนักงาน",
      name: "นาย ยศกร กันภัย",
      education: "มหาวิทยาลัยรามคำแหง",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ===== NAVBAR ===== */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-amber-100"
            : "bg-transparent"
        }`}
      >
        <div className="container">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center shadow-md animate-glow-pulse">
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-serif font-bold text-base leading-tight text-foreground">นิตินิยม</p>
                  <p className="text-xs text-muted-foreground leading-tight">สำนักงานกฎหมาย</p>
                </div>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/">
                <span className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors cursor-pointer">
                  หน้าหลัก
                </span>
              </Link>
              <Link href="/team">
                <span className="text-sm font-medium text-gold cursor-pointer">ทีมงาน</span>
              </Link>
              <Link href="/#contact">
                <Button size="sm" className="gold-gradient text-white border-0 font-medium px-5 shadow-md hover:opacity-90">
                  ติดต่อเรา
                </Button>
              </Link>
            </div>

            <button className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white/98 backdrop-blur-md border-t border-border shadow-lg animate-fade-in-up">
            <div className="container py-4 flex flex-col gap-3">
              <Link href="/">
                <div className="text-left py-2 text-sm font-medium text-foreground/80 hover:text-foreground border-b border-border/50 cursor-pointer">
                  หน้าหลัก
                </div>
              </Link>
              <Link href="/team">
                <div className="text-left py-2 text-sm font-medium text-gold border-b border-border/50 cursor-pointer">ทีมงาน</div>
              </Link>
              <Link href="/#contact">
                <Button size="sm" className="w-full mt-2 gold-gradient text-white border-0">
                  ติดต่อเรา
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

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
                ทีมทนายความมืออาชีพ
              </span>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-fade-in-up delay-100">
              ทีมงาน
              <br />
              <span className="gold-text-shimmer">ของเรา</span>
            </h1>

            <p className="text-lg text-white/75 leading-relaxed mb-8 max-w-2xl animate-fade-in-up delay-200">
              ทีมทนายความและเจ้าหน้าที่มืออาชีพ พร้อมให้บริการและคำปรึกษาทางกฎหมายด้วยความจริงจัง
            </p>
          </div>
        </div>
      </section>

      {/* ===== ORGANIZATIONAL STRUCTURE SECTION ===== */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
        
        {/* Animated grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(oklch(0.72 0.12 75 / 0.5) 1px, transparent 1px),
                              linear-gradient(90deg, oklch(0.72 0.12 75 / 0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Radial glows */}
        <div
          className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, oklch(0.72 0.12 75 / 0.3) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, oklch(0.72 0.12 75 / 0.3) 0%, transparent 70%)",
          }}
        />

        <div className="container relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-gold" />
              <span className="text-xs font-semibold tracking-widest uppercase text-gold">โครงสร้าง</span>
              <div className="h-px w-8 bg-gold" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4 animate-fade-in-up">
              โครงสร้างองค์กร
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-in-up delay-100">
              ทีมมืออาชีพที่พร้อมให้บริการและคำปรึกษาทางกฎหมายด้วยความจริงจัง
            </p>
          </div>

          {/* Organization List */}
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {organizationStructure.map((member, i) => (
                <div
                  key={member.id}
                  ref={(el) => {
                    if (el) cardRefs.current[i] = el;
                  }}
                  className={`group relative rounded-2xl overflow-hidden transition-all duration-700 ${
                    visibleCards.includes(i)
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${visibleCards.includes(i) ? i * 100 : 0}ms` }}
                >
                  {/* Card background with gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Glass card */}
                  <div className="relative p-8 glass-card border border-white/10 group-hover:border-gold/30 transition-all duration-300 h-full">
                    {/* Decorative top accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Position badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 mb-4">
                      <div className="w-2 h-2 rounded-full bg-gold" />
                      <span className="text-xs font-semibold text-gold tracking-wider uppercase">
                        ตำแหน่ง {i + 1}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-serif font-bold text-foreground mb-2 group-hover:text-gold transition-colors duration-300">
                      {member.position}
                    </h3>
                    <p className="text-lg text-gold font-semibold mb-3">{member.name}</p>
                    <div className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground mt-1.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{member.education}</p>
                    </div>

                    {/* Hover effect line */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-amber-300 to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              ))}
            </div>

            {/* Partners Section */}
            <div className="mt-16 pt-12 border-t border-gold/20">
              <div className="text-center mb-8">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2 animate-fade-in-up">
                  Partners
                </h2>
                <p className="text-gold font-medium animate-fade-in-up delay-100">ทนายความ</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {partners.map((partner, i) => {
                  const partnerIndex = organizationStructure.length + i;
                  return (
                  <div
                    key={partner.id}
                    ref={(el) => {
                      if (el) cardRefs.current[partnerIndex] = el;
                    }}
                    className={`group relative rounded-2xl overflow-hidden transition-all duration-700 ${
                      visibleCards.includes(partnerIndex)
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10"
                    }`}
                    style={{ transitionDelay: `${visibleCards.includes(partnerIndex) ? i * 100 : 0}ms` }}
                  >
                    {/* Card background with gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-transparent to-amber-300/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Glass card */}
                    <div className="relative p-8 glass-card border border-white/10 group-hover:border-amber-400/30 transition-all duration-300 h-full">
                      {/* Decorative top accent */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Partner badge */}
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 mb-4">
                        <Award className="w-3 h-3 text-amber-400" />
                        <span className="text-xs font-semibold text-amber-400 tracking-wider uppercase">
                          Partner
                        </span>
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-serif font-bold text-foreground mb-2 group-hover:text-amber-400 transition-colors duration-300">
                        {partner.position}
                      </h3>
                      <p className="text-lg text-amber-400 font-semibold mb-3">{partner.name}</p>
                      <div className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-muted-foreground mt-1.5 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">{partner.education}</p>
                      </div>

                      {/* Hover effect line */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== VALUES SECTION ===== */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-gold" />
              <span className="text-xs font-semibold tracking-widest uppercase text-gold">ค่านิยม</span>
              <div className="h-px w-8 bg-gold" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              ค่านิยมของทีมงาน
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              เรามุ่งมั่นให้บริการด้วยความเป็นมืออาชีพและจริยธรรมสูงสุด
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <div
                  key={i}
                  className={`rounded-2xl p-8 glass-card border border-white/10 card-hover animate-fade-in-up`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="w-14 h-14 rounded-xl gold-gradient flex items-center justify-center mb-6 shadow-md">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-3">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.desc}</p>
                </div>
              );
            })}
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

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 text-white animate-fade-in-up">
              ต้องการคำปรึกษาทางกฎหมาย?
            </h2>
            <p className="text-lg text-white/75 mb-8 animate-fade-in-up delay-100">
              ติดต่อทีมงานของเราวันนี้เพื่อรับคำแนะนำและบริการที่เหมาะสมกับความต้องการของคุณ
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

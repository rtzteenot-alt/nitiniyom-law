import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Link } from "wouter";
import {
  Scale,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  Shield,
  FileText,
  Users,
  Gavel,
  BookOpen,
  MessageSquare,
  Menu,
  X,
  ArrowRight,
  CheckCircle2,
  Star,
} from "lucide-react";

const services = [
  {
    icon: Gavel,
    title: "กฎหมายอาญา",
    desc: "ให้คำปรึกษาและว่าความคดีอาญา ทั้งในฐานะโจทก์และจำเลย ด้วยประสบการณ์และความเชี่ยวชาญ",
    color: "from-red-900/20 to-red-800/10",
  },
  {
    icon: Scale,
    title: "กฎหมายแพ่ง",
    desc: "ดูแลคดีแพ่งทุกประเภท ครอบครัว มรดก ทรัพย์สิน และสัญญา อย่างครบถ้วนและรอบด้าน",
    color: "from-blue-900/20 to-blue-800/10",
  },
  {
    icon: FileText,
    title: "การทำสัญญา",
    desc: "ร่างและตรวจสอบสัญญาทุกประเภท ให้มีความสมบูรณ์ ถูกต้องตามกฎหมาย และปกป้องสิทธิ์ของคุณ",
    color: "from-amber-900/20 to-amber-800/10",
  },
  {
    icon: MessageSquare,
    title: "หนังสือทวงถามหนี้",
    desc: "จัดทำหนังสือทวงถามหนี้อย่างเป็นทางการ มีผลทางกฎหมาย เพื่อเรียกคืนสิทธิ์ที่พึงได้รับ",
    color: "from-green-900/20 to-green-800/10",
  },
  {
    icon: BookOpen,
    title: "ปรึกษาเบื้องต้น",
    desc: "รับฟังปัญหาและให้คำแนะนำทางกฎหมายเบื้องต้น เพื่อให้คุณเข้าใจสิทธิ์และทางเลือกของตนเอง",
    color: "from-purple-900/20 to-purple-800/10",
  },
  {
    icon: Shield,
    title: "คุ้มครองสิทธิ์",
    desc: "ปกป้องและรักษาสิทธิ์ตามกฎหมายของคุณในทุกสถานการณ์ ด้วยความมุ่งมั่นและจริงจัง",
    color: "from-teal-900/20 to-teal-800/10",
  },
];

const values = [
  { title: "ความซื่อสัตย์", desc: "ยึดมั่นในความซื่อสัตย์และจริยธรรมวิชาชีพ" },
  { title: "ความเชี่ยวชาญ", desc: "ทีมทนายความที่มีความรู้และประสบการณ์สูง" },
  { title: "การเข้าถึง", desc: "ทำให้กฎหมายเป็นเรื่องที่ทุกคนเข้าใจได้" },
  { title: "ผลลัพธ์", desc: "มุ่งเน้นผลลัพธ์ที่ดีที่สุดสำหรับลูกค้า" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
    serviceType: "",
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const submitContact = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success("ส่งข้อความสำเร็จ! เราจะติดต่อกลับโดยเร็ว");
      setFormData({ name: "", phone: "", email: "", subject: "", message: "", serviceType: "" });
    },
    onError: () => toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) {
      toast.error("กรุณากรอกชื่อและข้อความ");
      return;
    }
    submitContact.mutate(formData);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ===== NAVBAR ===== */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-amber-100"
            : "bg-transparent"
        }`}
      >
        <div className="container">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center shadow-md">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-serif font-bold text-base leading-tight text-foreground">
                  นิตินิยม
                </p>
                <p className="text-xs text-muted-foreground leading-tight">สำนักงานกฎหมาย</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/team">
                <span className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors cursor-pointer">
                  ทีมงาน
                </span>
              </Link>
              <Link href="/blog">
                <span className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors cursor-pointer">
                  บทความ
                </span>
              </Link>
              {[
                { label: "เกี่ยวกับเรา", id: "about" },
                { label: "บริการ", id: "services" },
                { label: "ติดต่อ", id: "contact" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300" />
                </button>
              ))}
              <Link href="/admin">
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-5"
                >
                  เข้าสู่ระบบ
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
            <div className="md:hidden bg-white/98 backdrop-blur-md border-t border-border shadow-lg">
            <div className="container py-4 flex flex-col gap-3">
              <Link href="/team">
                <div className="text-left py-2 text-sm font-medium text-foreground/80 hover:text-foreground border-b border-border/50 cursor-pointer">
                  ทีมงาน
                </div>
              </Link>
              <Link href="/blog">
                <div className="text-left py-2 text-sm font-medium text-foreground/80 hover:text-foreground border-b border-border/50 cursor-pointer">
                  บทความ
                </div>
              </Link>
              {[
                { label: "เกี่ยวกับเรา", id: "about" },
                { label: "บริการ", id: "services" },
                { label: "ติดต่อ", id: "contact" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="text-left py-2 text-sm font-medium text-foreground/80 hover:text-foreground border-b border-border/50 last:border-0"
                >
                  {item.label}
                </button>
              ))}
              <Link href="/admin">
                <Button size="sm" className="w-full mt-2">
                  เข้าสู่ระบบเจ้าหน้าที่
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 navy-gradient" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a84c' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        {/* Gold decorative line */}
        <div className="absolute top-0 left-0 right-0 h-1 gold-gradient" />

        <div className="container relative z-10 pt-24 pb-16">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-400/30 bg-amber-400/10 mb-8">
              <Star className="w-3.5 h-3.5 text-amber-400" fill="currentColor" />
              <span className="text-amber-300 text-xs font-medium tracking-wider uppercase">
                สำนักงานกฎหมายที่เชื่อถือได้
              </span>
            </div>

            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              สำนักงาน
              <br />
              <span className="text-gold">กฎหมายนิตินิยม</span>
            </h1>

            <p className="text-lg md:text-xl text-white/75 leading-relaxed mb-4 max-w-2xl">
              เราเชื่อว่า <span className="text-amber-300 font-medium">กฎหมายควรเป็นเรื่องที่ทุกคนเข้าถึงได้</span>{" "}
              ด้วยคำแนะนำที่ชัดเจน เข้าใจง่าย และตรงประเด็น
            </p>
            <p className="text-base text-white/60 leading-relaxed mb-10 max-w-xl">
              ให้คำปรึกษาด้านกฎหมายอาญา กฎหมายแพ่ง การทำสัญญา ทวงถามหนี้ และปรึกษาเบื้องต้น
              โดยทีมผู้เชี่ยวชาญที่พร้อมดูแลคุณทุกขั้นตอน
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="gold-gradient text-white hover:opacity-90 font-semibold px-8 shadow-lg shadow-amber-900/30 border-0"
                onClick={() => scrollTo("contact")}
              >
                ปรึกษาฟรี
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 font-medium px-8 bg-transparent"
                onClick={() => scrollTo("services")}
              >
                ดูบริการทั้งหมด
              </Button>
            </div>

            {/* Quick contact */}
            <div className="mt-12 flex items-center gap-3 text-white/60">
              <Phone className="w-4 h-4 text-amber-400" />
              <a
                href="tel:0615909678"
                className="text-sm hover:text-white transition-colors font-medium tracking-wide"
              >
                061-590-9678
              </a>
              <span className="text-white/30">|</span>
              <span className="text-xs">โทรได้ทุกวัน 08:00 – 20:00 น.</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs tracking-widest uppercase">เลื่อนดูเพิ่มเติม</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="bg-white border-y border-amber-100 py-8">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "3+", label: "ปีประสบการณ์" },
              { value: "84+", label: "คดีที่ดูแล" },
              { value: "98%", label: "ความพึงพอใจ" },
              { value: "24/7", label: "พร้อมให้คำปรึกษา" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="font-serif text-3xl font-bold text-gold">{stat.value}</span>
                <span className="text-sm text-muted-foreground mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section id="about" className="py-20 md:py-28 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="h-px w-8 bg-gold" />
                <span className="text-xs font-semibold tracking-widest uppercase text-gold">
                  เกี่ยวกับเรา
                </span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                พันธกิจของเรา
                <br />
                <span className="text-gold">คือการทำให้กฎหมาย</span>
                <br />
                เข้าถึงได้สำหรับทุกคน
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                สำนักงานกฎหมายนิตินิยมก่อตั้งขึ้นด้วยความเชื่อมั่นว่า{" "}
                <strong className="text-foreground">กฎหมายไม่ควรเป็นเรื่องที่น่ากลัวหรือเข้าใจยาก</strong>{" "}
                ผู้ใช้บริการทุกคนจะได้รับคำแนะนำที่ชัดเจน เข้าใจง่าย และตรงประเด็น
                โดยไม่รู้สึกยุ่งยากหรือลำบากใจ
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                เรากำลังพัฒนาแชทบอท AI เพื่อช่วยตอบคำถามทางกฎหมายอย่างมีประสิทธิภาพ
                เพราะเราเชื่อว่าเทคโนโลยีสามารถช่วยให้ทุกคนเข้าถึงความยุติธรรมได้ง่ายขึ้น
              </p>

              <div className="grid grid-cols-2 gap-4">
                {values.map((v) => (
                  <div key={v.title} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-foreground">{v.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Visual */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="navy-gradient p-10 md:p-14">
                  <div className="flex justify-center mb-8">
                    <div className="w-24 h-24 rounded-full gold-gradient flex items-center justify-center shadow-2xl">
                      <Scale className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <blockquote className="text-center">
                    <p className="font-serif text-xl md:text-2xl text-white/90 italic leading-relaxed mb-4">
                      "ทุกคนควรเข้าถึงกฎหมายได้
                      <br />
                      โดยไม่รู้สึกยุ่งยากหรือลำบากใจ"
                    </p>
                    <footer className="text-amber-400 text-sm font-medium">
                      — สำนักงานกฎหมายนิตินิยม
                    </footer>
                  </blockquote>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full border-2 border-amber-200/30 -z-10" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full border-2 border-amber-200/20 -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section id="services" className="py-20 md:py-28 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-gold" />
              <span className="text-xs font-semibold tracking-widest uppercase text-gold">
                บริการของเรา
              </span>
              <div className="h-px w-8 bg-gold" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              บริการกฎหมายครบวงจร
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              เราให้บริการด้านกฎหมายอย่างครอบคลุม ด้วยทีมผู้เชี่ยวชาญที่พร้อมดูแลคุณในทุกสถานการณ์
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <div
                  key={i}
                  className="group bg-white rounded-2xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 border border-border hover:border-amber-200 hover:-translate-y-1"
                >
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-7 h-7 text-gold" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-foreground mb-3">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
                  <div className="mt-5 flex items-center gap-2 text-gold text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>ติดต่อสอบถาม</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-16 navy-gradient relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23c9a84c' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="container relative z-10 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-4">
            มีปัญหาด้านกฎหมาย? ปรึกษาเราได้เลย
          </h2>
          <p className="text-white/70 mb-8 max-w-lg mx-auto">
            โทรหาเราได้ทันที หรือส่งข้อความเพื่อนัดหมายปรึกษา ฟรี ไม่มีค่าใช้จ่ายเบื้องต้น
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:0615909678">
              <Button
                size="lg"
                className="gold-gradient text-white border-0 font-semibold px-8 shadow-lg"
              >
                <Phone className="w-4 h-4 mr-2" />
                โทร 061-590-9678
              </Button>
            </a>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 bg-transparent font-medium px-8"
              onClick={() => scrollTo("contact")}
            >
              ส่งข้อความ
            </Button>
          </div>
        </div>
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <section id="contact" className="py-20 md:py-28 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-gold" />
              <span className="text-xs font-semibold tracking-widest uppercase text-gold">
                ติดต่อเรา
              </span>
              <div className="h-px w-8 bg-gold" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              พูดคุยกับเราได้เลย
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              ส่งข้อความหรือโทรหาเรา ทีมงานพร้อมตอบทุกคำถามและให้คำปรึกษาอย่างรวดเร็ว
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-border">
                <h3 className="font-serif text-lg font-bold text-foreground mb-6">
                  ส่งข้อความถึงเรา
                </h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        ชื่อ – นามสกุล <span className="text-destructive">*</span>
                      </label>
                      <Input
                        placeholder="กรอกชื่อของคุณ"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="h-11"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        เบอร์โทรศัพท์
                      </label>
                      <Input
                        placeholder="0XX-XXX-XXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="h-11"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      อีเมล
                    </label>
                    <Input
                      type="email"
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-11"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      บริการที่สนใจ
                    </label>
                    <Select
                      value={formData.serviceType}
                      onValueChange={(v) => setFormData({ ...formData, serviceType: v })}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="เลือกบริการ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="criminal">กฎหมายอาญา</SelectItem>
                        <SelectItem value="civil">กฎหมายแพ่ง</SelectItem>
                        <SelectItem value="contract">การทำสัญญา</SelectItem>
                        <SelectItem value="debt_collection">หนังสือทวงถามหนี้</SelectItem>
                        <SelectItem value="consultation">ปรึกษาเบื้องต้น</SelectItem>
                        <SelectItem value="other">อื่นๆ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      ข้อความ <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                      placeholder="อธิบายปัญหาหรือคำถามของคุณ..."
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full gold-gradient text-white border-0 font-semibold h-12 shadow-md"
                    disabled={submitContact.isPending}
                  >
                    {submitContact.isPending ? "กำลังส่ง..." : "ส่งข้อความ"}
                    {!submitContact.isPending && <ArrowRight className="w-4 h-4 ml-2" />}
                  </Button>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-7 shadow-sm border border-border">
                <h3 className="font-serif text-lg font-bold text-foreground mb-6">
                  ข้อมูลติดต่อ
                </h3>
                <div className="space-y-5">
                  <a
                    href="tel:0615909678"
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">โทรศัพท์</p>
                      <p className="font-semibold text-foreground group-hover:text-gold transition-colors">
                        061-590-9678
                      </p>
                    </div>
                  </a>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">อีเมล</p>
                      <p className="font-medium text-foreground">info@nitiniyom.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">สำนักงานหลัก</p>
                      <p className="font-medium text-foreground text-sm leading-relaxed">
                        บ้านเลขที่ 11 บ้านโนนสมบูรณ์ หมู่ 5 ตำบล บ้านแมด อำเภอบุณฑริก อุบลราชธานี 34230
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">ศูนย์ประสานงาน</p>
                      <p className="font-medium text-foreground text-sm leading-relaxed">
                        398 บ้านเรียงแถวใต้ ต.นิคมสร้างตนเองลำโดมน้อย อ.สิรินธร จ.อุบลราชธานี
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">พื้นที่บริการเพิ่มเติม</p>
                      <p className="font-medium text-foreground text-sm">
                        กรุงเทพฯ, ปริมณฑล
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary rounded-2xl p-7 text-primary-foreground">
                <Users className="w-8 h-8 text-gold mb-4" />
                <h4 className="font-serif text-lg font-bold mb-2">เวลาทำการ</h4>
                <div className="space-y-2 text-sm text-primary-foreground/80">
                  <div className="flex justify-between">
                    <span>จันทร์ – ศุกร์</span>
                    <span className="font-medium text-primary-foreground">08:00 – 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>เสาร์ – อาทิตย์</span>
                    <span className="font-medium text-primary-foreground">09:00 – 16:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>นอกเวลา (ฉุกเฉิน)</span>
                    <span className="font-medium text-amber-400">โทรได้ตลอด 24 ชม.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="navy-gradient text-white py-12">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center">
                  <Scale className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-serif font-bold text-sm">สำนักงานกฎหมายนิตินิยม</p>
                </div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                ทำให้กฎหมายเป็นเรื่องที่เข้าใจง่ายและเข้าถึงได้สำหรับทุกคน
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 text-amber-400">บริการ</h4>
              <ul className="space-y-2 text-sm text-white/60">
                {["กฎหมายอาญา", "กฎหมายแพ่ง", "การทำสัญญา", "หนังสือทวงถามหนี้", "ปรึกษาเบื้องต้น"].map(
                  (s) => (
                    <li key={s} className="hover:text-white transition-colors cursor-pointer">
                      {s}
                    </li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 text-amber-400">ติดต่อ</h4>
              <div className="space-y-3 text-sm text-white/60">
                <a href="tel:0615909678" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 text-amber-400" />
                  061-590-9678
                </a>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-400" />
                  info@nitiniyom.com
                </div>
              </div>
            </div>
          </div>
          <div className="section-divider mb-6" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
            <p>© 2024 สำนักงานกฎหมายนิตินิยม. สงวนลิขสิทธิ์ทุกประการ</p>
            <Link href="/admin">
              <span className="hover:text-white/70 transition-colors cursor-pointer">
                เข้าสู่ระบบเจ้าหน้าที่
              </span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

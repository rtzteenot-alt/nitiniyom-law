import { useState, useEffect, useRef } from "react";
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
  Quote,
  Clock,
  Award,
  TrendingUp,
  Sparkles,
} from "lucide-react";

const services = [
  {
    icon: Gavel,
    title: "กฎหมายอาญา",
    desc: "ให้คำปรึกษาและว่าความคดีอาญา เช่นคดี หมิ่นประมาท คดีทำร้ายร่างกาย คดีลักทรัพย์ คดีพรากผู้เยาว์ เป็นต้น ",
    color: "from-red-900/30 to-red-800/10",
    accent: "text-red-400",
  },
  {
    icon: Scale,
    title: "กฎหมายแพ่ง",
    desc: "ดูแลคดีแพ่งทุกประเภท ครอบครัว มรดก ทรัพย์สิน และสัญญา อย่างครบถ้วนและรอบด้าน",
    color: "from-blue-900/30 to-blue-800/10",
    accent: "text-blue-400",
  },
  {
    icon: FileText,
    title: "การทำสัญญา",
    desc: "ร่างและตรวจสอบสัญญาทุกประเภท ให้มีความสมบูรณ์ ถูกต้องตามกฎหมาย และป้องกันไม่ให้คุณเสียผลประโยชน์",
    color: "from-amber-900/30 to-amber-800/10",
    accent: "text-amber-400",
  },
  {
    icon: MessageSquare,
    title: "หนังสือทวงถามหนี้",
    desc: "จัดทำหนังสือทวงถามหนี้อย่างเป็นทางการ ให้มีผลทางกฎหมาย เพื่อเพิ่มโอกาสข้อต่อสู้ทางกฎหมาย",
    color: "from-green-900/30 to-green-800/10",
    accent: "text-green-400",
  },
  {
    icon: BookOpen,
    title: "ปรึกษาเบื้องต้น",
    desc: "รับฟังปัญหาและให้คำแนะนำทางกฎหมายเบื้องต้น เพื่อให้คุณเข้าใจสิทธิ์และทางเลือกของตนเอง",
    color: "from-purple-900/30 to-purple-800/10",
    accent: "text-purple-400",
  },
  {
    icon: Shield,
    title: "รับจดทะเบียนบริษัทและห้างหุ้นส่วน",
    desc: "การทำธุรกิจโดยการจดเป็นนิติบุคคลจะช่วยสร้างความหน้าเชื่อถือให้กับธุรกิจของคุณอย่่างมาก",
    color: "from-teal-900/30 to-teal-800/10",
    accent: "text-teal-400",
  },
];

const values = [
  { title: "ความซื่อสัตย์", desc: "ยึดมั่นในความซื่อสัตย์และจริยธรรมวิชาชีพ" },
  { title: "ความเชี่ยวชาญ", desc: "ทีมทนายความที่มีความรู้และประสบการณ์สูง" },
  { title: "การเข้าถึง", desc: "ทำให้กฎหมายเป็นเรื่องที่ทุกคนเข้าใจได้" },
  { title: "ผลลัพธ์", desc: "มุ่งเน้นผลลัพธ์ที่ดีที่สุดสำหรับลูกค้า" },
];

const testimonials = [
  {
    name: "คุณสมชาย ใจดี",
    role: "ลูกค้าคดีแพ่ง",
    text: "ทีมทนายความนิตินิยมช่วยแก้ปัญหาคดีที่ยุ่งยากได้อย่างรวดเร็ว อธิบายทุกขั้นตอนชัดเจน ไม่รู้สึกสับสนเลย",
    rating: 5,
  },
  {
    name: "คุณมาลี รักดี",
    role: "ลูกค้าคดีสัญญา",
    text: "ประทับใจมากที่ทนายอธิบายภาษากฎหมายให้เข้าใจง่าย ราคาสมเหตุสมผล และดูแลเอาใจใส่ตลอดกระบวนการ",
    rating: 5,
  },
  {
    name: "คุณวิชัย มั่นคง",
    role: "ลูกค้าทวงถามหนี้",
    text: "ส่งหนังสือทวงถามหนี้ได้ผลเร็วมาก ลูกหนี้ยอมชำระภายใน 2 สัปดาห์ ขอบคุณทีมงานมากครับ",
    rating: 5,
  },
];

const stats = [
  { value: "3+", label: "ปีประสบการณ์", icon: Award, suffix: "" },
  { value: "84+", label: "คดีที่ดูแล", icon: TrendingUp, suffix: "" },
  { value: "98", label: "ความพึงพอใจ", icon: Star, suffix: "%" },
  { value: "24", label: "พร้อมให้คำปรึกษา", icon: Clock, suffix: "/7" },
];

// Animated counter hook
function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// Intersection observer hook
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function StatCard({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const { ref, inView } = useInView(0.3);
  const numericValue = parseInt(stat.value.replace(/\D/g, ""));
  const count = useCountUp(numericValue, 1800, inView);
  const Icon = stat.icon;

  return (
    <div
      ref={ref}
      className={`flex flex-col items-center p-6 rounded-2xl glass-card card-hover animate-fade-in-up delay-${(index + 1) * 100}`}
    >
      <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center mb-3 animate-glow-pulse">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="font-serif text-3xl md:text-4xl font-bold text-gold">
        {inView ? count : 0}{stat.suffix}
      </div>
      <div className="text-sm text-white/70 mt-1 text-center">{stat.label}</div>
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
    serviceType: "",
  });

  const { ref: servicesRef, inView: servicesInView } = useInView(0.1);
  const { ref: aboutRef, inView: aboutInView } = useInView(0.1);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ===== NAVBAR ===== */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-white/95 backdrop-blur-md shadow-lg border-b border-amber-100"
      >
        <div className="container">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center shadow-md animate-glow-pulse">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-serif font-bold text-base leading-tight text-foreground">นิตินิยม</p>
                <p className="text-xs text-muted-foreground leading-tight">สำนักงานกฎหมาย</p>
              </div>
            </div>

            <div className="flex items-center gap-6 md:gap-8">
              {[
                { label: "โครงสร้างองค์กร", href: "/team" },
                { label: "บริการ", href: "/services" },
                { label: "บทความ", href: "/blog" },
              ].map((item) => (
                <Link key={item.href} href={item.href}>
                  <span className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors cursor-pointer relative group">
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 gold-gradient group-hover:w-full transition-all duration-300 rounded-full" />
                  </span>
                </Link>
              ))}
              {[
                { label: "เกี่ยวกับเรา", id: "about" },
                { label: "ติดต่อ", id: "contact" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 gold-gradient group-hover:w-full transition-all duration-300 rounded-full" />
                </button>
              ))}
              <Link href="/admin">
                <Button size="sm" className="gold-gradient text-white border-0 font-medium px-5 shadow-md hover:opacity-90 hover:shadow-lg transition-all">
                  เข้าสู่ระบบ
                </Button>
              </Link>
            </div>
          </div>
        </div>


      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
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
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, oklch(0.55 0.1 200 / 0.5) 0%, transparent 70%)",
          }}
        />

        {/* Floating decorative orbs */}
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full border border-amber-400/10 animate-[spin_20s_linear_infinite]" />
        <div className="absolute top-32 right-32 w-40 h-40 rounded-full border border-amber-400/15 animate-[spin_15s_linear_infinite_reverse]" />

        {/* Gold top line */}
        <div className="absolute top-0 left-0 right-0 h-1 gold-gradient-animated" />

        <div className="container relative z-10 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-400/30 bg-amber-400/10 mb-8 animate-fade-in-up">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-300 text-xs font-medium tracking-wider uppercase">
                  สำนักงานกฎหมายที่เชื่อถือได้
                </span>
              </div>

              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-fade-in-up delay-100">
                สำนักงาน
                <br />
                <span className="gold-text-shimmer">กฎหมายนิตินิยม</span>
              </h1>

              <p className="text-lg text-white/75 leading-relaxed mb-4 max-w-xl animate-fade-in-up delay-200">
                เราเชื่อว่า{" "}
                <span className="text-amber-300 font-medium">กฎหมายควรเป็นเรื่องที่ทุกคนเข้าถึงได้</span>{" "}
                ด้วยคำแนะนำที่ชัดเจน เข้าใจง่าย และตรงประเด็น
              </p>
              <p className="text-sm text-white/55 leading-relaxed mb-10 max-w-lg animate-fade-in-up delay-300">
                ให้คำปรึกษาด้านกฎหมายอาญา กฎหมายแพ่ง การทำสัญญา ทวงถามหนี้ และปรึกษาเบื้องต้น
                โดยทีมผู้เชี่ยวชาญที่พร้อมดูแลคุณทุกขั้นตอน
              </p>

              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-400">
                <Button
                  size="lg"
                  className="gold-gradient-animated text-white hover:opacity-90 font-semibold px-8 shadow-lg shadow-amber-900/30 border-0 glow-gold"
                  onClick={() => scrollTo("contact")}
                >
                  ปรึกษาฟรี
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 font-medium px-8 bg-transparent backdrop-blur-sm"
                  onClick={() => scrollTo("services")}
                >
                  ดูบริการทั้งหมด
                </Button>
              </div>

              <div className="mt-10 flex items-center gap-3 text-white/60 animate-fade-in-up delay-500">
                <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center">
                  <Phone className="w-3.5 h-3.5 text-white" />
                </div>
                <a href="tel:0615909678" className="text-sm hover:text-white transition-colors font-medium tracking-wide">
                  061-590-9678
                </a>
                <span className="text-white/30">|</span>
                <span className="text-xs">โทรได้ทุกวัน 08:00 – 20:00 น.</span>
              </div>
            </div>

            {/* Right: Visual Card */}
            <div className="hidden lg:flex justify-center items-center animate-scale-in delay-300">
              <div className="relative w-full max-w-sm">
                {/* Main card */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl glass-card border border-white/10 p-8">
                  <div className="absolute inset-0 hero-gradient opacity-80" />
                  <div className="relative z-10">
                    <div className="flex justify-center mb-6">
                      <div className="w-20 h-20 rounded-2xl gold-gradient flex items-center justify-center shadow-2xl animate-glow-pulse">
                        <Scale className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    <blockquote className="text-center">
                      <p className="font-serif text-lg text-white/90 italic leading-relaxed mb-4">
                        "ทุกคนควรเข้าถึงกฎหมายได้
                        <br />
                        โดยไม่รู้สึกยุ่งยากหรือลำบากใจ"
                      </p>
                      <footer className="text-amber-400 text-sm font-medium">
                        — สำนักงานกฎหมายนิตินิยม
                      </footer>
                    </blockquote>

                    {/* Mini stats */}
                    <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/10">
                      {[
                        { n: "84+", l: "คดี" },
                        { n: "98%", l: "พอใจ" },
                        { n: "3+", l: "ปี" },
                      ].map((s) => (
                        <div key={s.l} className="text-center">
                          <div className="font-serif text-xl font-bold text-gold">{s.n}</div>
                          <div className="text-xs text-white/50 mt-0.5">{s.l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 glass-card rounded-2xl px-4 py-3 shadow-xl border border-amber-400/20 animate-fade-in-up delay-500">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-white/80 text-xs font-medium">5.0</span>
                  </div>
                  <p className="text-white/60 text-xs mt-1">ความพึงพอใจสูงสุด</p>
                </div>

                {/* Floating contact badge */}
                <div className="absolute -bottom-4 -left-4 glass-card rounded-2xl px-4 py-3 shadow-xl border border-white/10 animate-fade-in-up delay-600">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full gold-gradient flex items-center justify-center">
                      <Phone className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="text-white/80 text-xs font-semibold">โทรได้เลย</p>
                      <p className="text-amber-400 text-xs">24/7 ฉุกเฉิน</p>
                    </div>
                  </div>
                </div>
              </div>
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
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 navy-gradient" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a84c' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="container relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section id="about" className="py-20 md:py-28 bg-background" ref={aboutRef}>
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className={`transition-all duration-700 ${aboutInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="h-px w-8 bg-gold" />
                <span className="text-xs font-semibold tracking-widest uppercase text-gold">เกี่ยวกับเรา</span>
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
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                เรากำลังพัฒนาแชทบอท AI เพื่อช่วยตอบคำถามทางกฎหมายอย่างมีประสิทธิภาพ
                เพราะเราเชื่อว่าเทคโนโลยีสามารถช่วยให้ทุกคนเข้าถึงความยุติธรรมได้ง่ายขึ้น
              </p>
              <div className="grid grid-cols-2 gap-4">
                {values.map((v) => (
                  <div key={v.title} className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-foreground">{v.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`relative transition-all duration-700 delay-200 ${aboutInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
              {/* Main visual */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <div className="navy-gradient p-10 md:p-14 relative">
                  <div className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `linear-gradient(oklch(0.72 0.12 75 / 0.5) 1px, transparent 1px),
                                        linear-gradient(90deg, oklch(0.72 0.12 75 / 0.5) 1px, transparent 1px)`,
                      backgroundSize: "40px 40px",
                    }}
                  />
                  <div className="relative z-10">
                    <div className="flex justify-center mb-8">
                      <div className="w-24 h-24 rounded-2xl gold-gradient flex items-center justify-center shadow-2xl animate-glow-pulse">
                        <Scale className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    <blockquote className="text-center">
                      <Quote className="w-8 h-8 text-amber-400/40 mx-auto mb-3" />
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
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full border-2 border-amber-200/20 -z-10" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full border-2 border-amber-200/15 -z-10" />
              {/* Gold accent line */}
              <div className="absolute left-0 top-8 bottom-8 w-1 gold-gradient rounded-full -translate-x-4" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section id="services" className="py-20 md:py-28 relative overflow-hidden" ref={servicesRef}>
        <div className="absolute inset-0 bg-muted/30" />
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, oklch(0.72 0.12 75) 0%, transparent 70%)" }}
        />

        <div className="container relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-gold" />
              <span className="text-xs font-semibold tracking-widest uppercase text-gold">บริการของเรา</span>
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
                  className={`group bg-white rounded-2xl p-7 shadow-sm card-hover border border-border cursor-pointer
                    ${servicesInView ? "animate-fade-in-up" : "opacity-0"}
                  `}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-7 h-7 ${service.accent}`} />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-foreground mb-3">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
                  <div className="mt-5 flex items-center gap-2 text-gold text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>ติดต่อสอบถาม</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS SECTION ===== */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 navy-gradient" />
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a84c' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="container relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-gold" />
              <span className="text-xs font-semibold tracking-widest uppercase text-amber-400">เสียงจากลูกค้า</span>
              <div className="h-px w-8 bg-gold" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
              ลูกค้าพูดถึงเราอย่างไร
            </h2>
            <p className="text-white/60 max-w-lg mx-auto text-sm">
              ความไว้วางใจจากลูกค้าคือสิ่งที่เราภาคภูมิใจที่สุด
            </p>
          </div>

          {/* Testimonial cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`glass-card rounded-2xl p-7 border border-white/10 transition-all duration-500 cursor-pointer
                  ${activeTestimonial === i ? "border-amber-400/40 shadow-lg shadow-amber-900/20 scale-[1.02]" : "hover:border-white/20"}
                `}
                onClick={() => setActiveTestimonial(i)}
              >
                <Quote className="w-8 h-8 text-amber-400/50 mb-4" />
                <p className="text-white/80 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">{t.name.charAt(2)}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-amber-400/70 text-xs">{t.role}</p>
                  </div>
                  <div className="ml-auto flex">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`rounded-full transition-all duration-300 ${
                  activeTestimonial === i ? "w-6 h-2 gold-gradient" : "w-2 h-2 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <section id="contact" className="py-20 md:py-28 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-gold" />
              <span className="text-xs font-semibold tracking-widest uppercase text-gold">ติดต่อเรา</span>
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
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-border hover:shadow-lg transition-shadow">
                <h3 className="font-serif text-lg font-bold text-foreground mb-6">ส่งข้อความถึงเรา</h3>
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
                        className="h-11 focus:border-gold focus:ring-gold/20"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">เบอร์โทรศัพท์</label>
                      <Input
                        placeholder="0XX-XXX-XXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="h-11"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">อีเมล</label>
                    <Input
                      type="email"
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-11"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">บริการที่สนใจ</label>
                    <Select value={formData.serviceType} onValueChange={(v) => setFormData({ ...formData, serviceType: v })}>
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
                    className="w-full gold-gradient-animated text-white border-0 font-semibold h-12 shadow-md hover:shadow-lg hover:opacity-90 transition-all"
                    disabled={submitContact.isPending}
                  >
                    {submitContact.isPending ? "กำลังส่ง..." : "ส่งข้อความ"}
                    {!submitContact.isPending && <ArrowRight className="w-4 h-4 ml-2" />}
                  </Button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-7 shadow-sm border border-border hover:shadow-lg transition-shadow">
                <h3 className="font-serif text-lg font-bold text-foreground mb-6">ข้อมูลติดต่อ</h3>
                <div className="space-y-5">
                  <a href="tel:0615909678" className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">โทรศัพท์</p>
                      <p className="font-semibold text-foreground group-hover:text-gold transition-colors">061-590-9678</p>
                    </div>
                  </a>
                  <a href="mailto:niyomphakjira@gmail.com" className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">อีเมล</p>
                      <p className="font-semibold text-foreground group-hover:text-gold transition-colors">niyomphakjira@gmail.com</p>
                    </div>
                  </a>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">สำนักงานหลัก</p>
                      <p className="font-serif font-bold text-sm text-foreground mb-2">พื้นที่จังหวัดอุบลราชธานี</p>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">สำนักงานหลัก</p>
                          <p className="font-medium text-foreground text-sm leading-relaxed">
                            บ้านเลขที่ 11 บ้านโนนสมบูรณ์ หมู่ 5 ตำบล บ้านแมด อำเภอบุณฑริก อุบลราชธานี 34230
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">ศูนย์ประสานงาน</p>
                          <p className="font-medium text-foreground text-sm leading-relaxed">
                            398 บ้านเรียงแถวใต้ ต.นิคมสร้างตนเองลำโดมน้อย อ.สิรินธร จ.อุบลราชธานี 34350
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">พื้นที่บริการเพิ่มเติม</p>
                      <p className="font-medium text-foreground text-sm">กรุงเทพฯ, ปริมณฑล , นครราชสีมา</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0 navy-gradient" />
                <div className="relative z-10 p-7">
                  <Users className="w-8 h-8 text-gold mb-4" />
                  <h4 className="font-serif text-lg font-bold mb-2 text-white">เวลาทำการ</h4>
                  <div className="space-y-2 text-sm text-white/80">
                    {[
                      { day: "จันทร์ – ศุกร์", time: "08:00 – 18:00", highlight: false },
                      { day: "เสาร์ – อาทิตย์", time: "09:00 – 16:00", highlight: false },
                      { day: "นอกเวลา (ฉุกเฉิน)", time: "โทรได้ตลอด 24 ชม.", highlight: true },
                    ].map((item) => (
                      <div key={item.day} className="flex justify-between items-center py-1.5 border-b border-white/10 last:border-0">
                        <span className="text-white/70">{item.day}</span>
                        <span className={`font-medium ${item.highlight ? "text-amber-400" : "text-white"}`}>{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative overflow-hidden text-white py-12">
        <div className="absolute inset-0 navy-gradient" />
        <div className="absolute top-0 left-0 right-0 h-px gold-gradient" />
        <div className="container relative z-10">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center animate-glow-pulse">
                  <Scale className="w-4 h-4 text-white" />
                </div>
                <p className="font-serif font-bold text-sm">สำนักงานกฎหมายนิตินิยม</p>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                ทำให้กฎหมายเป็นเรื่องที่เข้าใจง่ายและเข้าถึงได้สำหรับทุกคน
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 text-amber-400">บริการ</h4>
              <ul className="space-y-2 text-sm text-white/60">
                {["กฎหมายอาญา", "กฎหมายแพ่ง", "การทำสัญญา", "หนังสือทวงถามหนี้", "ปรึกษาเบื้องต้น"].map((s) => (
                  <li key={s} className="hover:text-white transition-colors cursor-pointer flex items-center gap-2 group">
                    <ArrowRight className="w-3 h-3 text-amber-400/50 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 text-amber-400">ติดต่อ</h4>
              <div className="space-y-3 text-sm text-white/60">
                <a href="tel:0615909678" className="flex items-center gap-2 hover:text-white transition-colors group">
                  <Phone className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  061-590-9678
                </a>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-400" />
                  niyomphakjira@gmail.com
                </div>
              </div>
            </div>
          </div>
          <div className="section-divider mb-6" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
            <p>© 2024 สำนักงานกฎหมายนิตินิยม. สงวนลิขสิทธิ์ทุกประการ</p>
            <Link href="/admin">
              <span className="hover:text-white/70 transition-colors cursor-pointer">เข้าสู่ระบบเจ้าหน้าที่</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

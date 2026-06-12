import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Scale, Menu, X, ArrowRight, Mail, Phone, MapPin, Users, Award, Heart } from "lucide-react";

export default function Team() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const teamMembers = [
    {
      id: 1,
      name: "นิยม ดีจันทึก",
      title: "นาย",
      position: "ผู้อำนวยการฝ่ายกฎหมาย",
      description: "กำกับการทำงานและดูแลคดีในสำนักงาน บริหารภาพรวมของทีมกฎหมาย ตรวจสอบการทำงาน และควบคุมทิศทางการดำเนินคดีทั้งองค์กร",
      education: "มหาวิทยาลัยรามคำแหง",
      specialties: ["กฎหมายอาญา", "กฎหมายธุรกิจ", "การทำสัญญา"],
      facebookUrl: "https://web.facebook.com/niyom.nottee?locale=th_TH",
    },
    {
      id: 2,
      name: "ภัคจิรา นาคพลกรัง",
      title: "นางสาว",
      position: "ทนายความและเลขานุการสำนักงาน",
      description: "ทนายความที่มีความเชี่ยวชาญในด้านกฎหมายแพ่งและการจัดการสำนักงานเพื่อดำเนินการงานทั้งปวงในสำนักงาน",
      education: "มหาวิทยาลัยขอนแก่น เกรียรตินิยมอันดับ 1",
      specialties: ["กฎหมายแพ่ง", "หนังสือทวงถามหนี้", "ปรึกษาเบื้องต้น"],
      facebookUrl: "https://web.facebook.com/som.phakji?locale=th_TH",
    },
  ];

  const partners = [
    {
      id: 1,
      name: "ธนกร คูณตุ้ม",
      title: "นาย",
      position: "ผู้ช่วยทนายความ",
      education: "มหาวิทยาลัยรามคำแหง",
    },
    {
      id: 2,
      name: "ยศกร กันภัย",
      title: "นาย",
      position: "ทนายความและที่ปรึกษาสำนักงาน",
      education: "มหาวิทยาลัยรามคำแหง",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center shadow-md">
                <Scale className="w-4 h-4 text-white" />
              </div>
              <span className="font-serif font-bold text-lg text-foreground group-hover:text-gold transition-colors">
                นิตินิยม
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/">
              <span className="text-sm font-medium text-foreground/70 hover:text-gold transition-colors cursor-pointer">
                หน้าหลัก
              </span>
            </Link>
            <Link href="/team">
              <span className="text-sm font-medium text-gold cursor-pointer">ทีมงาน</span>
            </Link>
            <Link href="/">
              <Button className="gold-gradient text-white border-0 font-semibold">
                ติดต่อเรา
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-border">
            <div className="px-4 py-4 space-y-3">
              <Link href="/">
                <div className="text-sm font-medium text-foreground/70 hover:text-gold transition-colors cursor-pointer py-2">
                  หน้าหลัก
                </div>
              </Link>
              <Link href="/team">
                <div className="text-sm font-medium text-gold py-2 cursor-pointer">ทีมงาน</div>
              </Link>
              <Link href="/">
                <Button className="w-full gold-gradient text-white border-0 font-semibold">
                  ติดต่อเรา
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 navy-gradient text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">ทีมงานของเรา</h1>
          <p className="text-lg text-white/80 mb-8">
            ทีมทนายความและเจ้าหน้าที่มืออาชีพ พร้อมให้บริการและคำปรึกษาทางกฎหมายด้วยความจริงจัง
          </p>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-12">
            {teamMembers.map((member, index) => (
              <div
                key={member.id}
                className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-12 items-center`}
              >
                {/* Info Section */}
                <div className="flex-1">
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-1">
                    {member.title} {member.name}
                  </h3>
                  <p className="text-base font-semibold text-gold mb-4">
                    {member.position}
                  </p>
                  <div className="mb-4 pb-4 border-b border-border">
                    <p className="text-sm text-foreground/60">
                      <span className="font-medium">ประวัติการศึกษา:</span> {member.education}
                    </p>
                  </div>
                  <p className="text-base text-foreground/70 leading-relaxed mb-8">
                    {member.description}
                  </p>

                  {/* Specialties */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-gold" />
                      ความเชี่ยวชาญ
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {member.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="px-4 py-2 bg-gold/10 text-gold rounded-full text-sm font-medium border border-gold/20"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <a href={member.facebookUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="gold-gradient text-white border-0 font-semibold">
                      ติดต่อ {member.name.split(" ")[1]}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                </div>


              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-12 text-center">
            PARTNER
          </h2>
          <div className="grid md:grid-cols-1 gap-8">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="bg-white rounded-2xl p-8 shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <h3 className="font-serif text-2xl font-bold text-foreground mb-1">
                  {partner.title} {partner.name}
                </h3>
                <p className="text-base font-semibold text-gold mb-3">
                  {partner.position}
                </p>
                {partner.education && (
                  <p className="text-sm text-foreground/60">
                    <span className="font-medium">ประวัติการศึกษา:</span> {partner.education}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
              ค่านิยมของทีมงาน
            </h2>
            <p className="text-lg text-foreground/70">
              เรามุ่งมั่นให้บริการด้วยความเป็นมืออาชีพและจริยธรรมสูงสุด
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">
                ความเอาใจใส่
              </h3>
              <p className="text-foreground/70">
                ตั้งใจฟังและเข้าใจปัญหาของลูกค้าอย่างแท้จริง เพื่อหาทางแก้ไขที่ดีที่สุด
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">
                ความเชี่ยวชาญ
              </h3>
              <p className="text-foreground/70">
                ทีมที่มีความรู้และประสบการณ์สูงในด้านกฎหมายต่างๆ พร้อมอัปเดตความรู้อยู่เสมอ
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-4">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">
                ยุติธรรม
              </h3>
              <p className="text-foreground/70">
                ยึดมั่นในหลักการยุติธรรมและจริยธรรมวิชาชีพในการให้บริการทางกฎหมาย
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 navy-gradient text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">
            ต้องการคำปรึกษาทางกฎหมาย?
          </h2>
          <p className="text-lg text-white/80 mb-8">
            ติดต่อทีมงานของเราวันนี้เพื่อรับคำแนะนำและบริการที่เหมาะสมกับความต้องการของคุณ
          </p>
          <Link href="/">
            <Button className="gold-gradient text-white border-0 font-semibold text-base px-8 py-3 hover:shadow-lg transition-all">
              ติดต่อเรา
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Logo */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center">
                  <Scale className="w-4 h-4 text-white" />
                </div>
                <span className="font-serif font-bold text-lg">นิตินิยม</span>
              </div>
              <p className="text-sm text-white/60">
                สำนักงานกฎหมายนิตินิยม ให้บริการคำปรึกษาและว่าความทางกฎหมายอย่างมืออาชีพ
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">ลิงก์ด่วน</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li>
                  <Link href="/">
                    <span className="hover:text-gold transition-colors cursor-pointer">
                      หน้าหลัก
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/team">
                    <span className="hover:text-gold transition-colors cursor-pointer">
                      ทีมงาน
                    </span>
                  </Link>
                </li>
                <li>
                  <a href="#services" className="hover:text-gold transition-colors">
                    บริการ
                  </a>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold mb-4">บริการ</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li>
                  <a href="#" className="hover:text-gold transition-colors">
                    กฎหมายอาญา
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gold transition-colors">
                    กฎหมายแพ่ง
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gold transition-colors">
                    การทำสัญญา
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">ติดต่อเรา</h4>
              <div className="space-y-3 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                  <a href="tel:0615909678" className="hover:text-gold transition-colors">
                    061-590-9678
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                  <a href="mailto:info@nitiniyom.com" className="hover:text-gold transition-colors">
                    info@nitiniyom.com
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span>สำนักงานกฎหมายนิตินิยม</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-white/60">
              <p>&copy; 2026 สำนักงานกฎหมายนิตินิยม สงวนลิขสิทธิ์</p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-gold transition-colors">
                  นโยบายความเป็นส่วนตัว
                </a>
                <a href="#" className="hover:text-gold transition-colors">
                  เงื่อนไขการใช้งาน
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

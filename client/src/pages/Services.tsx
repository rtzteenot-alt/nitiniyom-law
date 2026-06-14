import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function Services() {
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header - Luxury Design */}
      <div className="relative overflow-hidden py-20 px-4">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900" />
        {/* Gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400" />
        {/* Decorative pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4af37'%3E%3Ccircle cx='50' cy='50' r='3'/%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3Ccircle cx='80' cy='80' r='2'/%3E%3Ccircle cx='80' cy='20' r='2'/%3E%3Ccircle cx='20' cy='80' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-block mb-4 px-4 py-2 rounded-full border border-amber-400/30 bg-amber-400/10">
            <span className="text-amber-300 text-sm font-medium tracking-wider">
              ⚖️ บริการกฎหมายมืออาชีพ
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 text-white">
            บริการของเรา
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-amber-300 mx-auto mb-6" />
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            สำนักงานนิตินิยมกฎหมายให้บริการร่าง ตรวจสอบ และแก้ไขเอกสารทางกฎหมายทุกประเภท
            เพื่อให้เอกสารมีความถูกต้อง ชัดเจน และคุ้มครองสิทธิประโยชน์ของลูกค้าอย่างรอบด้าน
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Introduction Section */}
        <div className="mb-16 bg-white rounded-lg shadow-md p-8 md:p-12 border-l-4 border-amber-400">
          <h2 className="text-3xl font-serif font-bold text-blue-900 mb-4">
            ความเชี่ยวชาญของเรา
          </h2>
          <p className="text-lg text-slate-700 leading-relaxed">
            ด้วยประสบการณ์หลายปีในสาขากฎหมาย ทีมของเรามีความเชี่ยวชาญในการร่างและตรวจสอบเอกสารทางกฎหมายทั้งหมดประเภท
            เพื่อให้เอกสารของคุณมีความถูกต้องตามกฎหมาย ชัดเจน และคุ้มครองสิทธิประโยชน์ของคุณอย่างสูงสุด
          </p>
        </div>

        {/* Contract Services Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-gradient-to-b from-amber-400 to-amber-300 rounded-full" />
            <h2 className="text-3xl font-serif font-bold text-blue-900">บริการสัญญา</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {contractServices.map((service, index) => (
              <Card
                key={index}
                className="border-amber-200/50 hover:border-amber-400 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 group"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0 group-hover:text-amber-600 transition-colors" />
                    <p className="text-slate-700 group-hover:text-blue-900 transition-colors">
                      {service}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Legal Documents Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-gradient-to-b from-amber-400 to-amber-300 rounded-full" />
            <h2 className="text-3xl font-serif font-bold text-blue-900">
              เอกสารทางกฎหมายอื่น ๆ
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {legalDocuments.map((document, index) => (
              <Card
                key={index}
                className="border-amber-200/50 hover:border-amber-400 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 group"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0 group-hover:text-amber-600 transition-colors" />
                    <p className="text-slate-700 group-hover:text-blue-900 transition-colors">
                      {document}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16 bg-background rounded-lg p-8 md:p-12 border border-amber-200/30">
          <h2 className="text-3xl font-serif font-bold text-blue-900 mb-8">
            ประโยชน์ของการใช้บริการเรา
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-amber-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">ความถูกต้องทางกฎหมาย</h3>
                <p className="text-slate-600">
                  เอกสารของคุณจะถูกตรวจสอบให้ถูกต้องตามกฎหมายปัจจุบัน
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-amber-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">คุ้มครองสิทธิประโยชน์</h3>
                <p className="text-slate-600">
                  ทีมของเราจะช่วยให้เอกสารคุ้มครองสิทธิประโยชน์ของคุณอย่างสูงสุด
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-amber-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">ชัดเจนและเข้าใจได้</h3>
                <p className="text-slate-600">
                  เอกสารจะถูกเขียนให้ชัดเจนและเข้าใจได้ง่าย
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-amber-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">ประสบการณ์มืออาชีพ</h3>
                <p className="text-slate-600">
                  ทนายความมีประสบการณ์ในการจัดการเอกสารกฎหมายหลากหลายประเภท
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section - Luxury */}
      <div className="relative overflow-hidden py-16 px-4 mt-12">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900" />
        {/* Gold accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400" />
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-amber-400/30" />
        <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-amber-400/30" />
        {/* Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4af37'%3E%3Ccircle cx='50' cy='50' r='3'/%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3Ccircle cx='80' cy='80' r='2'/%3E%3Ccircle cx='80' cy='20' r='2'/%3E%3Ccircle cx='20' cy='80' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-amber-300">
            พร้อมที่จะใช้บริการของเรา?
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-300 mx-auto mb-6" />
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            ติดต่อเราเพื่อรับคำปรึกษาและบริการจากทนายความมืออาชีพของสำนักงานกฎหมายนิตินิยม
          </p>
          <Link href="/#contact">
            <Button className="bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-500 hover:to-amber-400 text-blue-900 font-semibold px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300">
              ติดต่อเรา →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

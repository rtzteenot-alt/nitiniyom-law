import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import {
  BookOpen,
  Search,
  ArrowRight,
  Calendar,
  User,
  Clock,
  ChevronRight,
} from "lucide-react";

const articles = [
  {
    id: 1,
    title: "10 ข้อควรรู้ก่อนจรดปากกา \"ทำสัญญาจำนอง\"",
    subtitle: "รู้ไว้...ไม่เสียเปรียบเจ้าหนี้",
    category: "การทำสัญญา",
    date: "2026-06-17",
    author: "สำนักงานกฎหมายนิตินิยม",
    readTime: "8 นาที",
    excerpt: "การนำบ้านหรือที่ดินไปจำนองเพื่อแปรเปลี่ยนเป็นเงินทุน ถือเป็นเรื่องปกติในทางธุรกิจและชีวิตประจำวัน แต่เพราะทรัพย์ที่นำมาจำนองมักเป็นสินทรัพย์ชิ้นใหญ่ หากเราทำสัญญาโดยขาดความเข้าใจข้อกฎหมายอย่างถ่องแท้ จาก \"โอกาสทางธุรกิจ\" อาจกลายเป็น \"มหากาพย์การสูญเสียบ้านและที่ดิน\" ได้ทันที",
    content: `🏠 10 ข้อควรรู้ก่อนจรดปากกา "ทำสัญญาจำนอง" (รู้ไว้...ไม่เสียเปรียบเจ้าหนี้)

การนำบ้านหรือที่ดินไปจำนองเพื่อแปรเปลี่ยนเป็นเงินทุน ถือเป็นเรื่องปกติในทางธุรกิจและชีวิตประจำวันครับ แต่เพราะทรัพย์ที่นำมาจำนองมักเป็นสินทรัพย์ชิ้นใหญ่ หากเราทำสัญญาโดยขาดความเข้าใจข้อกฎหมายอย่างถ่องแท้ จาก "โอกาสทางธุรกิจ" อาจกลายเป็น "มหากาพย์การสูญเสียบ้านและที่ดิน" ได้ทันที

นี่คือ 10 เรื่องสำคัญที่ผู้จำนองและลูกหนี้ทุกคนต้องรู้และตรวจเช็คให้ดีก่อนทำสัญญาจำนองครับ

## 1. จำนอง... ทรัพย์ยังอยู่กับเรา (ไม่ต้องส่งมอบ)

หัวใจสำคัญของจำนองคือ "การเอาทะเบียนทรัพย์ไปเป็นประกัน แต่ตัวทรัพย์ยังอยู่กับเรา" เรายังคงมีสิทธิครอบครอง อาศัย หรือนำที่ดินผืนนั้นไปทำประโยชน์ เก็บกินดอกผล หรือปล่อยเช่าได้ตามปกติ เจ้าหนี้ไม่มีสิทธิมาครอบครองหรือยึดถือตัวทรัพย์ไว้ตั้งแต่วันทำสัญญา (ต่างจาก "จำนำ" ที่ต้องส่งมอบของให้เจ้าหนี้เก็บไว้)

## 2. "ทะเบียนเป็นใหญ่" สัญญาจำนองต้องจดทะเบียน ณ สำนักงานที่ดินเท่านั้น

สัญญาจำนองจะสมบูรณ์และบังคับใช้ได้ตามกฎหมาย ต้องทำเป็นหนังสือและจดทะเบียนต่อพนักงานเจ้าหน้าที่ ณ สำนักงานที่ดินเท่านั้น การทำสัญญากันเองที่บ้าน หรือการเซ็นชื่อกู้เงินแล้วเอาโฉนดตัวจริงไปให้เจ้าหนี้ถือไว้เฉยๆ ในทางกฎหมาย ไม่ถือเป็นการจำนอง และเจ้าหนี้จะใช้สิทธิบังคับจำนองแบบพิเศษไม่ได้

## 3. จำนองแตกแขนง... สิทธิไม่แบ่งแยก (มาตรา 717)

หากเราเอาที่ดินแปลงใหญ่ไปจำนอง ต่อมาเราไปขอรังวัด "แบ่งแยกโฉนด" ออกเป็นแปลงย่อยๆ หลายแปลง ผลทางกฎหมายคือ โฉนดแปลงย่อยทุกแปลงจะยังคงติดจำนองเป็นประกันหนี้ก้อนเดิมทั้งหมด เจ้าหนี้มีสิทธิบังคับจำนองเอากับแปลงไหนก็ได้ ตราบใดที่เจ้าหนี้ยังไม่ได้ไปจดทะเบียน "ปลอดจำนอง" หรือ "ปลดจำนองเฉพาะส่วน" ที่สำนักงานที่ดิน ทรัพย์ทุกส่วนที่แยกออกไปก็ยังไม่หลุดพ้นจากภาระ

## 4. ระวังส่วนควบ! สัญญาจำนองครอบคลุมถึงอะไรบ้าง? (มาตรา 718, 719)

โดยทั่วไป การจำนองที่ดินย่อมครอบคลุมถึง "ส่วนควบ" ของที่ดินนั้นด้วย เช่น บ้านหรือสิ่งปลูกสร้างที่มีอยู่แล้วบนที่ดิน รวมถึงไม้ยืนต้นต่างๆ แต่ถ้าเราเอาที่ดินเปล่าไปจำนอง แล้ว "สร้างบ้านขึ้นมาใหม่ในภายหลัง" สิทธิจำนองจะไม่ครอบคลุมถึงบ้านหลังใหม่นั้น (เว้นแต่ในสัญญาจำนองจะเขียนระบุข้อความดักไว้ชัดเจนว่า ให้ครอบคลุมถึงสิ่งปลูกสร้างในอนาคตด้วย)

## 5. ดอกผลและค่าเช่า... เจ้าหนี้จะมายึดสุ่มสี่สุ่มห้าไม่ได้ (มาตรา 721)

ตราบใดที่เรายังผ่อนชำระหนี้ตามปกติ ดอกผลของทรัพย์จำนอง (เช่น ค่าเช่าบ้าน ค่าเช่าอพาร์ตเมนต์ ผลผลิตจากสวน) ยังคงเป็นของเรา 100% เจ้าหนี้ไม่มีสิทธิมาแสดงความเป็นเจ้าของหรืออายัดเงินส่วนนี้ จนกว่าเจ้าหนี้จะเริ่มกระบวนการ "บอกกล่าวบังคับจำนอง" อย่างเป็นทางการเท่านั้น สิทธิจำนองถึงจะแผ่ขยายไปถึงดอกผลเหล่านั้น

## 6. รับเคราะห์คนเดียว... ถ้าจำนองร่วมโดยไม่ระบุลำดับ (มาตรา 725)

ในกรณีที่มีบุคคลภายนอกหลายคน ยอมเอาทรัพย์สินส่วนตัวของแต่ละคนมาจำนองร่วมกันเพื่อประกันหนี้ให้ลูกหนี้คนเดียวกัน (เช่น นาย A กู้เงิน โดยมี นาย B และ นาย C ต่างคนต่างเอาที่ดินมาจำนองประกันให้) หากไม่ได้เขียนระบุลำดับไว้ในสัญญา แล้ววันดีคืนดีเจ้าหนี้เลือกฟ้องยึดทรัพย์ของ นาย B ไปขายทอดตลาดจนหมดหนี้ นาย B จะไปฟ้องไล่เบี้ยเรียกเงินคืนหรือให้ นาย C ช่วยหารเฉลี่ยไม่ได้เลย (ต้องไปไล่เบี้ยเอากับลูกหนี้ชั้นต้นคนเดียว) ใครโดนยึดก่อนคนนั้นรับเคราะห์ไป

## 7. ก่อนฟ้องยึดทรัพย์... เจ้าหนี้ต้องเตือนล่วงหน้าไม่น้อยกว่า 60 วัน (มาตรา 728 วรรคหนึ่ง)

เมื่อลูกหนี้เริ่มเบี้ยวหนี้ อยู่ๆ เจ้าหนี้จะเดินไปฟ้องศาลขอให้ออกหมายยึดทรัพย์เลยไม่ได้ กฎหมายบังคับให้เจ้าหนี้ต้องส่ง "หนังสือบอกกล่าวบังคับจำนอง" มาให้ลูกหนี้และผู้จำนองรู้ตัวล่วงหน้า โดยต้องให้เวลาเคลียร์หนี้ ไม่น้อยกว่า 60 วัน นับแต่วันที่ได้รับหนังสือ หากให้เวลาน้อยกว่านี้หรือไม่มีหนังสือเตือนมาเลย เจ้าหนี้จะไม่มีอำนาจฟ้อง (ศาลยกฟ้อง)

## 8. สิทธิพิเศษของ "ผู้จำนองที่เป็นบุคคลภายนอก" เรื่องกรอบเวลา 15 วัน (มาตรา 728 วรรคสอง)

หากเจ้าของทรัพย์ที่จำนองไม่ใช่คนเดียวกับลูกหนี้ (เช่น พ่อเอาที่ดินไปจำนองค้ำประกันเงินกู้ให้ลูก) เมื่อลูกเบี้ยวหนี้และเจ้าหนี้ส่งหนังสือเตือนลูกแล้ว เจ้าหนี้ต้องส่งสำเนาหนังสือเตือนนั้นมาให้พ่อ (ผู้จำนอง) ทราบภายใน 15 วันด้วย หากเจ้าหนี้ส่งช้าเกิน 15 วัน กฎหมายจะลงโทษเจ้าหนี้โดยการให้ผู้จำนอง หลุดพ้นจากดอกเบี้ยผิดนัดและค่าปรับทั้งหมด ที่เกิดขึ้นนับตั้งแต่วันที่พ้นกำหนด 15 วันนั้นทันที

## 9. การเอา "ทรัพย์จำนองหลุด" ทำได้ยากกว่าที่คิด (มาตรา 729)

เจ้าหนี้หลายคนชอบคิดว่า ถ้าลูกหนี้เบี้ยวหนี้จะยึดโฉนดมาเป็นของตัวเองเลย แต่ในทางกฎหมาย การฟ้องขอเอาทรัพย์จำนองหลุดเป็นของเจ้าหนี้โดยไม่ต้องขายทอดตลาด มีเงื่อนไขที่โหดมาก คือ (1) ห้ามมีเจ้าหนี้จำนองรายอื่น (2) ลูกหนี้ต้องค้างส่งดอกเบี้ยนานถึง 5 ปีเต็ม และ (3) ราคาทรัพย์สินต้องไม่ท่วมยอดหนี้ที่ค้างชำระ ถ้าไม่เข้าเงื่อนไขนี้ครบทุกข้อ ศาลจะสั่งให้เอาทรัพย์ไปขายทอดตลาดท่าเดียว

## 10. "หนี้ขาด...ไม่ต้องรับผิด" เกราะคุ้มครองสูงสุด (มาตรา 733)

ตามกฎหมายจำนอง หากเจ้าหนี้บังคับจำนองนำทรัพย์ไปขายทอดตลาดแล้วได้เงินมา "น้อยกว่ายอดหนี้ที่ค้างอยู่" เงินส่วนที่ยังขาดอยู่นั้น ลูกหนี้และผู้จำนองไม่ต้องรับผิดชอบ และเจ้าหนี้ไม่มีสิทธิตามไปยึดทรัพย์สินอย่างอื่นอีก

⚠️ แต่มีข้อยกเว้นที่ต้องระวังที่สุดในชีวิตจริง:
- ถ้าลูกหนี้กู้เองจำนองเอง: ธนาคารมักจะเขียนข้อความ "ยกเว้นมาตรา 733" ไว้ท้ายสัญญา ซึ่งศาลฎีกาอนุญาตให้ทำได้ ทำให้เรายังต้องจ่ายส่วนต่าง
- ถ้าบุคคลภายนอกเป็นคนจำนอง: กฎหมายใหม่ล็อคไว้เลยว่า ห้ามเขียนยกเว้นมาตรา 733 (ตกเป็นโมฆะ) บุคคลภายนอกจะรับผิดสูงสุดไม่เกินมูลค่าของทรัพย์ที่นำมาจำนองเท่านั้น สบายใจได้ 100% ครับ

## ⚖️ บทสรุปจาก นิตินิยม กฎหมาย

ก่อนจะเซ็นชื่อจำนองทรัพย์สินของตนเอง โปรดอ่านสัญญาให้ละเอียดทุกบรรทัด โดยเฉพาะข้อความท้ายสัญญาที่เขียนว่า "หากบังคับจำนองแล้วได้เงินไม่พอชำระหนี้..." ว่ามีการมัดมือชกให้เราต้องรับผิดชอบทรัพย์สินส่วนอื่นด้วยหรือไม่ เพื่อไม่ให้เกิดความเสียหายที่แก้ไขไม่ได้ในภายหลังครับ`,
    color: "from-amber-900/30 to-amber-800/10",
    accent: "text-amber-400",
  },
];

export default function Articles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredArticles, setFilteredArticles] = useState(articles);
  const articlesRef = useRef<HTMLDivElement>(null);
  const [articlesInView, setArticlesInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArticlesInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (articlesRef.current) {
      observer.observe(articlesRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const filtered = articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredArticles(filtered);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="absolute inset-0 navy-gradient" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, oklch(0.72 0.12 75) 0%, transparent 70%)" }}
        />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, oklch(0.72 0.12 75) 0%, transparent 70%)" }}
        />

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="h-px w-8 bg-gold" />
              <span className="text-xs font-semibold tracking-widest uppercase text-gold">บทความ</span>
              <div className="h-px w-8 bg-gold" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in-up">
              บทความกฎหมาย
            </h1>
            <p className="text-lg text-white/75 mb-8 animate-fade-in-up delay-100">
              ความรู้ทางกฎหมายที่มีประโยชน์เพื่อให้คุณเข้าใจและป้องกันตัวเองได้อย่างมีประสิทธิภาพ
            </p>
          </div>
        </div>
      </section>

      {/* ===== SEARCH SECTION ===== */}
      <section className="py-8 md:py-12 bg-muted/30 sticky top-0 z-20">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="ค้นหาบทความ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-white border-border"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== ARTICLES SECTION ===== */}
      <section className="py-16 md:py-24 bg-background" ref={articlesRef}>
        <div className="container">
          {filteredArticles.length > 0 ? (
            <div className="grid gap-8">
              {filteredArticles.map((article, index) => (
                <div
                  key={article.id}
                  className={`group rounded-2xl overflow-hidden glass-card border border-white/10 hover:border-gold/30 transition-all duration-500 animate-fade-in-up`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="grid md:grid-cols-3 gap-6 p-8 md:p-10">
                    {/* Content */}
                    <div className="md:col-span-2 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${article.color} text-gold`}>
                            {article.category}
                          </span>
                        </div>
                        <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2 group-hover:text-gold transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-sm text-gold mb-4 font-medium">{article.subtitle}</p>
                        <p className="text-muted-foreground leading-relaxed mb-6">
                          {article.excerpt}
                        </p>
                      </div>

                      {/* Meta info */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(article.date).toLocaleDateString("th-TH", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{article.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{article.readTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="flex items-center justify-center md:justify-end">
                      <div className="w-20 h-20 rounded-2xl gold-gradient flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <BookOpen className="w-10 h-10 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="px-8 md:px-10 pb-8 md:pb-10">
                    <Link href={`/articles/${article.id}`}>
                      <Button className="gold-gradient-animated text-white border-0 font-semibold group/btn hover:opacity-90">
                        อ่านบทความเต็ม
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-lg text-muted-foreground">ไม่พบบทความที่ตรงกับการค้นหา</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="absolute inset-0 hero-gradient" />
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

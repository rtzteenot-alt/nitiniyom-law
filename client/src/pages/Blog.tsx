import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { ArrowRight, Sparkles, BookOpen, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const categoryColors: Record<string, { bg: string; text: string; badge: string }> = {
  "กฎหมายอาญา": { bg: "from-red-900/30 to-red-800/10", text: "text-red-400", badge: "bg-red-500/20 text-red-300 border-red-500/30" },
  "กฎหมายแพ่ง": { bg: "from-blue-900/30 to-blue-800/10", text: "text-blue-400", badge: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  "การทำสัญญา": { bg: "from-amber-900/30 to-amber-800/10", text: "text-amber-400", badge: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  "ทวงถามหนี้": { bg: "from-green-900/30 to-green-800/10", text: "text-green-400", badge: "bg-green-500/20 text-green-300 border-green-500/30" },
  "ปรึกษาเบื้องต้น": { bg: "from-purple-900/30 to-purple-800/10", text: "text-purple-400", badge: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  "business_law": { bg: "from-teal-900/30 to-teal-800/10", text: "text-teal-400", badge: "bg-teal-500/20 text-teal-300 border-teal-500/30" },
  "อื่น ๆ": { bg: "from-slate-900/30 to-slate-800/10", text: "text-slate-400", badge: "bg-slate-500/20 text-slate-300 border-slate-500/30" },
};

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string;
  author: string | null;
  status: string;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function Blog() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { data: articlesData, isLoading: queryLoading } = trpc.articles.list.useQuery();

  useEffect(() => {
    if (articlesData) {
      // Sort articles by publishedAt (newest first), fallback to createdAt
      const sorted = [...(articlesData as Article[])].sort((a, b) => {
        const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : new Date(a.createdAt).getTime();
        const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : new Date(b.createdAt).getTime();
        return dateB - dateA; // Newest first
      });
      setArticles(sorted);
      setIsLoading(false);
    }
  }, [articlesData]);

  useEffect(() => {
    setIsLoading(queryLoading);
  }, [queryLoading]);

  // Calculate pagination
  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentArticles = articles.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
                บทความกฎหมายเชิงลึก
              </span>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-fade-in-up delay-100">
              บทความ
              <br />
              <span className="gold-text-shimmer">กฎหมาย</span>
            </h1>

            <p className="text-lg text-white/75 leading-relaxed mb-8 max-w-2xl animate-fade-in-up delay-200">
              ความรู้และข้อมูลกฎหมายที่เป็นประโยชน์ เพื่อให้คุณเข้าใจสิทธิและหน้าที่ของตนเองได้อย่างชัดเจน
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
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Spinner />
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">ยังไม่มีบทความในขณะนี้</p>
            </div>
          ) : (
            <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {currentArticles.map((article, index) => {
                const colors = categoryColors[article.category] || categoryColors["อื่น ๆ"];
                return (
                  <Link key={article.id} href={`/blog/${article.slug}`}>
                    <div
                      className={`group h-full rounded-2xl overflow-hidden glass-card border border-white/10 card-hover animate-fade-in-up cursor-pointer`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Category accent bar */}
                      <div className={`h-1 w-full bg-gradient-to-r ${colors.bg}`} />

                      <div className="p-6 md:p-7">
                        {/* Category badge */}
                        <div className="mb-4">
                          <Badge className={`${colors.badge} border`}>
                            {article.category}
                          </Badge>
                        </div>

                        {/* Title */}
                        <h3 className="font-serif text-lg md:text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-gold transition-colors">
                          {article.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-5">
                          {article.excerpt || article.content.substring(0, 150)}...
                        </p>

                        {/* Meta info */}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {article.publishedAt
                              ? format(new Date(article.publishedAt), "d MMMM yyyy", { locale: th })
                              : format(new Date(article.createdAt), "d MMMM yyyy", { locale: th })}
                          </span>
                        </div>

                        {/* Read more link */}
                        <div className="mt-5 flex items-center gap-2 text-gold text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span>อ่านต่อ</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <Button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  ก่อนหน้า
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      onClick={() => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className="w-10 h-10 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  ถัดไป
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
            </>
          )}
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
              มีคำถามเกี่ยวกับกฎหมายหรือไม่?
            </h2>
            <p className="text-lg text-white/75 mb-8 animate-fade-in-up delay-100">
              ติดต่อเราเพื่อรับคำปรึกษาจากทนายความมืออาชีพของสำนักงานกฎหมายนิตินิยม
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

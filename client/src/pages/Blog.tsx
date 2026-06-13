import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { th } from "date-fns/locale";

const categoryColors: Record<string, string> = {
  "กฎหมายอาญา": "bg-blue-100 text-blue-800 border border-blue-300",
  "กฎหมายแพ่ง": "bg-amber-100 text-amber-800 border border-amber-300",
  "การทำสัญญา": "bg-blue-50 text-blue-700 border border-blue-200",
  "ทวงถามหนี้": "bg-amber-50 text-amber-700 border border-amber-200",
  "ปรึกษาเบื้องต้น": "bg-blue-50 text-blue-700 border border-blue-200",
  "business_law": "bg-amber-50 text-amber-700 border border-amber-200",
  "อื่น ๆ": "bg-slate-100 text-slate-700 border border-slate-300",
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

  const { data: articlesData, isLoading: queryLoading } = trpc.articles.list.useQuery();

  useEffect(() => {
    if (articlesData) {
      setArticles(articlesData as Article[]);
      setIsLoading(false);
    }
  }, [articlesData]);

  useEffect(() => {
    setIsLoading(queryLoading);
  }, [queryLoading]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-50">
      {/* Header - Luxury Design */}
      <div className="relative overflow-hidden py-20 px-4">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900" />
        {/* Gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400" />
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4af37'%3E%3Ccircle cx='50' cy='50' r='3'/%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3Ccircle cx='80' cy='80' r='2'/%3E%3Ccircle cx='80' cy='20' r='2'/%3E%3Ccircle cx='20' cy='80' r='2'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-block mb-4 px-4 py-2 rounded-full border border-amber-400/30 bg-amber-400/10">
            <span className="text-amber-300 text-sm font-medium tracking-wider">📚 บทความกฎหมายเชิงลึก</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 text-white">บทความกฎหมาย</h1>
          <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-amber-300 mx-auto mb-6" />
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            ความรู้และข้อมูลกฎหมายที่เป็นประโยชน์ เพื่อให้คุณเข้าใจสิทธิและหน้าที่ของตนเองได้อย่างชัดเจน
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">ยังไม่มีบทความในขณะนี้</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link key={article.id} href={`/blog/${article.slug}`}>
                <Card className="h-full hover:shadow-2xl transition-all duration-300 cursor-pointer border-amber-200/50 hover:border-amber-400 bg-white/80 backdrop-blur-sm hover:bg-white group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <Badge className={categoryColors[article.category] || categoryColors["อื่น ๆ"]}>
                        {article.category}
                      </Badge>
                    </div>
                    <div className="h-1 w-12 bg-gradient-to-r from-amber-400 to-amber-300 rounded-full mb-2 group-hover:w-full transition-all duration-300" />
                    <CardTitle className="line-clamp-2 text-lg text-blue-900 font-serif font-bold group-hover:text-amber-700 transition-colors">{article.title}</CardTitle>
                    <CardDescription className="text-xs text-blue-600/70 mt-2">
                      📅 {article.publishedAt
                        ? format(new Date(article.publishedAt), "d MMMM yyyy", { locale: th })
                        : format(new Date(article.createdAt), "d MMMM yyyy", { locale: th })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {article.excerpt || article.content.substring(0, 150)}...
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
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
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4af37'%3E%3Ccircle cx='50' cy='50' r='3'/%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3Ccircle cx='80' cy='80' r='2'/%3E%3Ccircle cx='80' cy='20' r='2'/%3E%3Ccircle cx='20' cy='80' r='2'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-amber-300">มีคำถามเกี่ยวกับกฎหมายหรือไม่?</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-300 mx-auto mb-6" />
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            ติดต่อเราเพื่อรับคำปรึกษาจากทนายความมืออาชีพของสำนักงานกฎหมายนิตินิยม
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

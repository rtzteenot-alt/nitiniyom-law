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
  "กฎหมายอาญา": "bg-red-600/20 text-red-700 border border-red-300",
  "กฎหมายแพ่ง": "bg-blue-600/20 text-blue-700 border border-blue-300",
  "การทำสัญญา": "bg-amber-600/20 text-amber-700 border border-amber-300",
  "ทวงถามหนี้": "bg-red-500/20 text-red-700 border border-red-300",
  "ปรึกษาเบื้องต้น": "bg-blue-500/20 text-blue-700 border border-blue-300",
  "business_law": "bg-amber-600/20 text-amber-700 border border-amber-300",
  "อื่น ๆ": "bg-slate-200 text-slate-800 border border-slate-300",
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
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-red-800 to-blue-900 text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif text-amber-300">บทความกฎหมาย</h1>
          <p className="text-lg text-blue-100">
            ข้อมูลและความรู้เกี่ยวกับกฎหมายที่เป็นประโยชน์ต่อคุณ
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-12 bg-white/50">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">ยังไม่มีบทความในขณะนี้</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link key={article.id} href={`/blog/${article.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-border/50 hover:border-border">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge className={categoryColors[article.category] || categoryColors["อื่น ๆ"]}>
                        {article.category}
                      </Badge>
                    </div>
                    <CardTitle className="line-clamp-2 text-lg text-amber-700 font-semibold">{article.title}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      {article.publishedAt
                        ? format(new Date(article.publishedAt), "d MMMM yyyy", { locale: th })
                        : format(new Date(article.createdAt), "d MMMM yyyy", { locale: th })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {article.excerpt || article.content.substring(0, 150)}...
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-900 via-red-800 to-blue-900 text-white py-12 px-4 mt-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-amber-300">มีคำถามเกี่ยวกับกฎหมายหรือไม่?</h2>
          <p className="text-blue-100 mb-6">
            ติดต่อเราเพื่อรับคำปรึกษาจากทนายความมืออาชีพ
          </p>
          <Link href="/#contact">
            <Button className="bg-amber-400 hover:bg-amber-500 text-blue-900 font-semibold shadow-lg">
              ติดต่อเรา
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

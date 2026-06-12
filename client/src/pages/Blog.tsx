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
  "กฎหมายอาญา": "bg-red-100 text-red-800",
  "กฎหมายแพ่ง": "bg-blue-100 text-blue-800",
  "การทำสัญญา": "bg-green-100 text-green-800",
  "ทวงถามหนี้": "bg-yellow-100 text-yellow-800",
  "ปรึกษาเบื้องต้น": "bg-purple-100 text-purple-800",
  "อื่น ๆ": "bg-gray-100 text-gray-800",
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
      <div className="bg-gradient-to-r from-[#1a3a52] to-[#2d5a7b] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">บทความกฎหมาย</h1>
          <p className="text-lg text-gray-200">
            ข้อมูลและความรู้เกี่ยวกับกฎหมายที่เป็นประโยชน์ต่อคุณ
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
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
                    <CardTitle className="line-clamp-2 text-lg">{article.title}</CardTitle>
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
      <div className="bg-[#1a3a52] text-white py-12 px-4 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">มีคำถามเกี่ยวกับกฎหมายหรือไม่?</h2>
          <p className="text-gray-300 mb-6">
            ติดต่อเราเพื่อรับคำปรึกษาจากทนายความมืออาชีพ
          </p>
          <Link href="/#contact">
            <Button className="bg-[#d4af37] hover:bg-[#c9a227] text-[#1a3a52] font-semibold">
              ติดต่อเรา
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Streamdown } from "streamdown";
import { ChevronLeft } from "lucide-react";

const categoryColors: Record<string, string> = {
  "กฎหมายอาญา": "bg-red-100 text-red-800",
  "กฎหมายแพ่ง": "bg-blue-100 text-blue-800",
  "การทำสัญญา": "bg-green-100 text-green-800",
  "ทวงถามหนี้": "bg-yellow-100 text-yellow-800",
  "ปรึกษาเบื้องต้น": "bg-purple-100 text-purple-800",
  "อื่น ๆ": "bg-gray-100 text-gray-800",
};

export default function BlogDetail() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: article, isLoading, error } = trpc.articles.bySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-background">
        <Spinner />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Link href="/blog">
            <Button variant="ghost" className="mb-6">
              <ChevronLeft className="w-4 h-4 mr-2" />
              กลับไปยังบทความ
            </Button>
          </Link>
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">ไม่พบบทความที่ต้องการ</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a3a52] to-[#2d5a7b] text-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/blog">
            <Button variant="ghost" className="text-white hover:bg-white/10 mb-4">
              <ChevronLeft className="w-4 h-4 mr-2" />
              กลับไปยังบทความ
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <article className="bg-white rounded-lg shadow-md p-8 md:p-12">
          {/* Meta */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Badge className={categoryColors[article.category] || categoryColors["อื่น ๆ"]}>
                {article.category}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              โดย {article.author || "สำนักงานกฎหมายนิตินิยม"} •{" "}
              {article.publishedAt
                ? format(new Date(article.publishedAt), "d MMMM yyyy", { locale: th })
                : format(new Date(article.createdAt), "d MMMM yyyy", { locale: th })}
            </p>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-[#1a3a52]">
            {article.title}
          </h1>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-lg text-muted-foreground italic mb-8 border-l-4 border-[#d4af37] pl-4">
              {article.excerpt}
            </p>
          )}

          {/* Divider */}
          <div className="h-px bg-border my-8" />

          {/* Content */}
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <Streamdown>{article.content}</Streamdown>
          </div>

          {/* Divider */}
          <div className="h-px bg-border my-8" />

          {/* CTA */}
          <div className="bg-secondary/50 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">ต้องการคำปรึกษาเพิ่มเติม?</h3>
            <p className="text-muted-foreground mb-4">
              ติดต่อเราเพื่อรับคำปรึกษาจากทนายความมืออาชีพ
            </p>
            <Link href="/#contact">
              <Button className="bg-[#d4af37] hover:bg-[#c9a227] text-[#1a3a52] font-semibold">
                ติดต่อเรา
              </Button>
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}

import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Link } from "wouter";

export default function CustomerReviews() {
  const { data, isLoading } = trpc.reviews.getApproved.useQuery({
    limit: 6,
    offset: 0,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-slate-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const reviews = data?.reviews ?? [];

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">ยังไม่มีรีวิวในขณะนี้</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <Card
            key={review.id}
            className="bg-white/10 backdrop-blur-md border border-white/20 p-6 hover:border-amber-400/50 transition-all"
          >
            {/* Rating Stars */}
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={
                    star <= review.rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-400"
                  }
                />
              ))}
            </div>

            {/* Message */}
            <p className="text-white text-sm mb-4 line-clamp-3">
              "{review.message}"
            </p>

            {/* Author */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div>
                <p className="text-white font-medium text-sm">{review.name}</p>
                <p className="text-slate-400 text-xs">
                  {new Date(review.createdAt).toLocaleDateString("th-TH")}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* CTA Button */}
      <div className="text-center mt-8">
        <Link href="/review-form">
          <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold px-8 py-3 rounded-lg transition-all">
            ส่งรีวิวของคุณ
          </Button>
        </Link>
      </div>
    </div>
  );
}

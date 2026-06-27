import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Star, Check, X, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminReviews() {
  const [page, setPage] = useState(0);
  const limit = 20;

  const { data, isLoading, refetch } = trpc.reviews.getAll.useQuery({
    limit,
    offset: page * limit,
  });

  const approveMutation = trpc.reviews.approve.useMutation({
    onSuccess: () => {
      toast.success("อนุมัติรีวิวแล้ว");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "เกิดข้อผิดพลาด");
    },
  });

  const rejectMutation = trpc.reviews.reject.useMutation({
    onSuccess: () => {
      toast.success("ปฏิเสธรีวิวแล้ว");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "เกิดข้อผิดพลาด");
    },
  });

  const deleteMutation = trpc.reviews.delete.useMutation({
    onSuccess: () => {
      toast.success("ลบรีวิวแล้ว");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "เกิดข้อผิดพลาด");
    },
  });

  const reviews = data?.reviews ?? [];
  const totalCount = data?.count ?? 0;
  const totalPages = Math.ceil(totalCount / limit);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">จัดการรีวิว</h1>
        <p className="text-muted-foreground">
          ทั้งหมด {totalCount} รีวิว
        </p>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">ไม่มีรีวิว</p>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Rating */}
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={
                          star <= review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }
                      />
                    ))}
                  </div>

                  {/* Author */}
                  <div className="mb-3">
                    <p className="font-semibold text-foreground">{review.name}</p>
                    <p className="text-sm text-muted-foreground">{review.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(review.createdAt).toLocaleString("th-TH")}
                    </p>
                  </div>

                  {/* Message */}
                  <p className="text-foreground mb-3 whitespace-pre-wrap">
                    {review.message}
                  </p>

                  {/* Status Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-muted">
                    {review.status === "approved" && (
                      <>
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-green-600">อนุมัติแล้ว</span>
                      </>
                    )}
                    {review.status === "pending" && (
                      <>
                        <div className="w-2 h-2 rounded-full bg-yellow-600" />
                        <span className="text-yellow-600">รอการอนุมัติ</span>
                      </>
                    )}
                    {review.status === "rejected" && (
                      <>
                        <X className="w-4 h-4 text-red-600" />
                        <span className="text-red-600">ปฏิเสธแล้ว</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {review.status !== "approved" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => approveMutation.mutate({ id: review.id })}
                      disabled={approveMutation.isPending}
                      className="gap-2"
                    >
                      <Check className="w-4 h-4" />
                      อนุมัติ
                    </Button>
                  )}
                  {review.status !== "rejected" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => rejectMutation.mutate({ id: review.id })}
                      disabled={rejectMutation.isPending}
                      className="gap-2"
                    >
                      <X className="w-4 h-4" />
                      ปฏิเสธ
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate({ id: review.id })}
                    disabled={deleteMutation.isPending}
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    ลบ
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
          >
            ก่อนหน้า
          </Button>
          <span className="text-sm text-muted-foreground">
            หน้า {page + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
          >
            ถัดไป
          </Button>
        </div>
      )}
    </div>
  );
}

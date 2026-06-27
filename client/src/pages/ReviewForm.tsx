import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Star } from "lucide-react";
import { toast } from "sonner";

export default function ReviewForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);

  const submitMutation = trpc.reviews.submit.useMutation({
    onSuccess: () => {
      toast.success("ขอบคุณสำหรับรีวิว! รีวิวของคุณอยู่ระหว่างการตรวจสอบ");
      setName("");
      setEmail("");
      setRating(5);
      setMessage("");
    },
    onError: (error) => {
      toast.error(error.message || "เกิดข้อผิดพลาด");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("กรุณากรอกชื่อ");
      return;
    }
    
    if (!email.trim()) {
      toast.error("กรุณากรอกอีเมล");
      return;
    }
    
    if (message.trim().length < 10) {
      toast.error("ข้อความต้องมีอย่างน้อย 10 ตัวอักษร");
      return;
    }

    submitMutation.mutate({
      name: name.trim(),
      email: email.trim(),
      rating,
      message: message.trim(),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">เสียงจากลูกค้า</h1>
          <p className="text-lg text-slate-300">
            แบ่งปันประสบการณ์ของคุณกับเรา
          </p>
        </div>

        {/* Form Card */}
        <Card className="bg-white/10 backdrop-blur-md border border-white/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                ชื่อของคุณ *
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="กรุณากรอกชื่อ"
                className="bg-white/10 border border-white/20 text-white placeholder:text-slate-400"
                disabled={submitMutation.isPending}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                อีเมล *
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="bg-white/10 border border-white/20 text-white placeholder:text-slate-400"
                disabled={submitMutation.isPending}
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-white mb-3">
                ให้คะแนน *
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                    disabled={submitMutation.isPending}
                  >
                    <Star
                      size={32}
                      className={`transition-colors ${
                        star <= (hoveredRating || rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-400"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-slate-300 mt-2">
                {rating} ดาว
              </p>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                ข้อความ * (อย่างน้อย 10 ตัวอักษร)
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="แบ่งปันประสบการณ์ของคุณ..."
                rows={5}
                className="bg-white/10 border border-white/20 text-white placeholder:text-slate-400"
                disabled={submitMutation.isPending}
              />
              <p className="text-sm text-slate-400 mt-2">
                {message.length} / 10+ ตัวอักษร
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={submitMutation.isPending}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-3 rounded-lg transition-all"
            >
              {submitMutation.isPending ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  กำลังส่ง...
                </>
              ) : (
                "ส่งรีวิว"
              )}
            </Button>

            {/* Disclaimer */}
            <p className="text-xs text-slate-400 text-center">
              รีวิวของคุณจะอยู่ระหว่างการตรวจสอบก่อนแสดงบนเว็บไซต์
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}

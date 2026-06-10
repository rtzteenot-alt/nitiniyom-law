import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MessageSquare, Search, Phone, Mail, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const statusOptions = [
  { value: "new", label: "ใหม่", color: "bg-blue-50 text-blue-700" },
  { value: "read", label: "อ่านแล้ว", color: "bg-amber-50 text-amber-700" },
  { value: "replied", label: "ตอบแล้ว", color: "bg-green-50 text-green-700" },
  { value: "closed", label: "ปิดแล้ว", color: "bg-muted text-muted-foreground" },
];

const serviceTypeLabels: Record<string, string> = {
  criminal: "กฎหมายอาญา",
  civil: "กฎหมายแพ่ง",
  contract: "การทำสัญญา",
  debt_collection: "ทวงถามหนี้",
  consultation: "ปรึกษาเบื้องต้น",
  other: "อื่นๆ",
};

export default function AdminMessages() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedMsg, setSelectedMsg] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const { data: messages, isLoading } = trpc.messages.list.useQuery();

  const updateStatus = trpc.messages.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("อัพเดตสถานะสำเร็จ");
      utils.messages.list.invalidate();
    },
    onError: () => toast.error("เกิดข้อผิดพลาด"),
  });

  const filtered = messages?.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.phone?.includes(search) ||
      m.message.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || m.status === filterStatus;
    return matchSearch && matchStatus;
  }) ?? [];

  const selectedMessage = messages?.find((m) => m.id === selectedMsg);

  const handleView = (id: number, status: string) => {
    setSelectedMsg(id);
    if (status === "new") {
      updateStatus.mutate({ id, status: "read" });
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground">ข้อความจากลูกค้า</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              ทั้งหมด {messages?.length ?? 0} ข้อความ
              {messages?.filter((m) => m.status === "new").length
                ? ` • ใหม่ ${messages.filter((m) => m.status === "new").length} ข้อความ`
                : ""}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ค้นหาชื่อ, เบอร์โทร, ข้อความ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40 bg-white">
              <SelectValue placeholder="ทุกสถานะ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกสถานะ</SelectItem>
              {statusOptions.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
          {isLoading ? (
            <div className="p-8 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
              <p className="text-muted-foreground text-sm">
                {search || filterStatus !== "all" ? "ไม่พบข้อความที่ค้นหา" : "ยังไม่มีข้อความ"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((msg) => {
                const statusInfo = statusOptions.find((s) => s.value === msg.status);
                return (
                  <div
                    key={msg.id}
                    className={`px-5 py-4 hover:bg-muted/20 transition-colors cursor-pointer ${msg.status === "new" ? "bg-blue-50/30" : ""}`}
                    onClick={() => handleView(msg.id, msg.status)}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${msg.status === "new" ? "bg-blue-100" : "bg-muted"}`}
                      >
                        <span
                          className={`text-sm font-bold ${msg.status === "new" ? "text-blue-600" : "text-muted-foreground"}`}
                        >
                          {msg.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-semibold text-sm ${msg.status === "new" ? "text-foreground" : "text-foreground/80"}`}>
                            {msg.name}
                          </span>
                          {msg.serviceType && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                              {serviceTypeLabels[msg.serviceType] ?? msg.serviceType}
                            </span>
                          )}
                          <span className={`text-xs px-2 py-0.5 rounded-full ml-auto ${statusInfo?.color}`}>
                            {statusInfo?.label}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{msg.message}</p>
                        <div className="flex items-center gap-4 mt-1.5 text-xs text-muted-foreground">
                          {msg.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {msg.phone}
                            </span>
                          )}
                          {msg.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {msg.email}
                            </span>
                          )}
                          <span className="ml-auto">
                            {new Date(msg.createdAt).toLocaleDateString("th-TH", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Message Detail Dialog */}
      <Dialog open={selectedMsg !== null} onOpenChange={() => setSelectedMsg(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">รายละเอียดข้อความ</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">ชื่อ</p>
                  <p className="font-semibold text-foreground">{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">บริการที่สนใจ</p>
                  <p className="font-medium text-foreground">
                    {selectedMessage.serviceType
                      ? serviceTypeLabels[selectedMessage.serviceType] ?? selectedMessage.serviceType
                      : "—"}
                  </p>
                </div>
                {selectedMessage.phone && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">เบอร์โทร</p>
                    <a
                      href={`tel:${selectedMessage.phone}`}
                      className="font-medium text-gold hover:underline"
                    >
                      {selectedMessage.phone}
                    </a>
                  </div>
                )}
                {selectedMessage.email && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">อีเมล</p>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="font-medium text-gold hover:underline"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">ข้อความ</p>
                <div className="bg-muted/30 rounded-xl p-4 text-sm text-foreground leading-relaxed">
                  {selectedMessage.message}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">อัพเดตสถานะ</p>
                <div className="flex gap-2 flex-wrap">
                  {statusOptions.map((s) => (
                    <Button
                      key={s.value}
                      size="sm"
                      variant={selectedMessage.status === s.value ? "default" : "outline"}
                      className={selectedMessage.status === s.value ? "gold-gradient text-white border-0" : ""}
                      onClick={() =>
                        updateStatus.mutate({
                          id: selectedMessage.id,
                          status: s.value as "new" | "read" | "replied" | "closed",
                        })
                      }
                    >
                      {s.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

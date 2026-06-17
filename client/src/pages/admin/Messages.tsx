import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { MessageSquare, Phone, Mail, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const statusOptions = [
  { value: "new", label: "ใหม่", color: "bg-red-100 text-red-600" },
  { value: "read", label: "อ่านแล้ว", color: "bg-blue-100 text-blue-600" },
  { value: "replied", label: "ตอบแล้ว", color: "bg-green-100 text-green-700" },
  { value: "closed", label: "ปิด", color: "bg-gray-100 text-gray-500" },
];

export default function AdminMessages() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const { data: messages, isLoading } = trpc.messages.list.useQuery();
  const updateStatus = trpc.messages.updateStatus.useMutation({
    onSuccess: () => { utils.messages.list.invalidate(); toast.success("อัปเดตสถานะสำเร็จ"); },
  });

  const filtered = (messages ?? []).filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      (m.phone ?? "").includes(search) ||
      (m.email ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const selectedMsg = messages?.find((m) => m.id === selected);

  const getStatusStyle = (status: string) => statusOptions.find((s) => s.value === status)?.color ?? "bg-gray-100 text-gray-500";
  const getStatusLabel = (status: string) => statusOptions.find((s) => s.value === status)?.label ?? status;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">ข้อความจากลูกค้า</h1>
        <p className="text-sm text-gray-500 mt-0.5">ข้อความที่ส่งมาจากหน้าเว็บไซต์</p>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input placeholder="ค้นหาชื่อ เบอร์โทร หรืออีเมล..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-white border-gray-200" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="py-12 text-center text-gray-400 text-sm">กำลังโหลด...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">{search ? "ไม่พบข้อความที่ค้นหา" : "ยังไม่มีข้อความ"}</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((m) => (
              <div
                key={m.id}
                className={`px-5 py-4 hover:bg-amber-50/30 cursor-pointer transition-colors ${m.status === "new" ? "border-l-4 border-red-400" : ""}`}
                onClick={() => {
                  setSelected(m.id);
                  if (m.status === "new") updateStatus.mutate({ id: m.id, status: "read" });
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MessageSquare className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-gray-800">{m.name}</p>
                        {m.serviceType && (
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{m.serviceType}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        {m.phone && (
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Phone className="w-3 h-3" /> {m.phone}
                          </span>
                        )}
                        {m.email && (
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Mail className="w-3 h-3" /> {m.email}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1.5 line-clamp-2">{m.message}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusStyle(m.status)}`}>
                      {getStatusLabel(m.status)}
                    </span>
                    <p className="text-xs text-gray-400">{new Date(m.createdAt).toLocaleDateString("th-TH")}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>รายละเอียดข้อความ</DialogTitle>
          </DialogHeader>
          {selectedMsg && (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">ชื่อ</p>
                  <p className="font-medium text-gray-800">{selectedMsg.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">บริการที่สนใจ</p>
                  <p className="text-gray-700">{selectedMsg.serviceType ?? "-"}</p>
                </div>
                {selectedMsg.phone && (
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">เบอร์โทร</p>
                    <a href={`tel:${selectedMsg.phone}`} className="text-amber-600 hover:underline">{selectedMsg.phone}</a>
                  </div>
                )}
                {selectedMsg.email && (
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">อีเมล</p>
                    <a href={`mailto:${selectedMsg.email}`} className="text-amber-600 hover:underline text-sm">{selectedMsg.email}</a>
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">ข้อความ</p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap">{selectedMsg.message}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-2">สถานะ</p>
                <div className="flex gap-2 flex-wrap">
                  {statusOptions.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => updateStatus.mutate({ id: selectedMsg.id, status: s.value as "new" | "read" | "replied" | "closed" })}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${selectedMsg.status === s.value ? s.color + " ring-2 ring-offset-1 ring-amber-300" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-400">รับเมื่อ {new Date(selectedMsg.createdAt).toLocaleString("th-TH")}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

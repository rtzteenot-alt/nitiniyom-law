import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Plus, Search, Pencil, Trash2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const caseTypeOptions = [
  { value: "criminal", label: "คดีอาญา" },
  { value: "civil", label: "คดีแพ่ง" },
  { value: "contract", label: "สัญญา" },
  { value: "debt_collection", label: "ทวงหนี้" },
  { value: "consultation", label: "ปรึกษา" },
  { value: "other", label: "อื่นๆ" },
];

const caseStatusOptions = [
  { value: "new", label: "ใหม่", color: "bg-blue-100 text-blue-700" },
  { value: "in_progress", label: "ดำเนินการ", color: "bg-amber-100 text-amber-700" },
  { value: "pending", label: "รอดำเนินการ", color: "bg-yellow-100 text-yellow-700" },
  { value: "closed", label: "ปิดแล้ว", color: "bg-green-100 text-green-700" },
  { value: "cancelled", label: "ยกเลิก", color: "bg-gray-100 text-gray-500" },
];

type CaseForm = {
  clientId: string;
  caseNumber: string;
  title: string;
  type: string;
  description: string;
  fee: string;
  startDate: string;
  assignedTo: string;
};

const emptyForm: CaseForm = { clientId: "", caseNumber: "", title: "", type: "civil", description: "", fee: "", startDate: "", assignedTo: "" };

export default function AdminCases() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState<{ id: number; status: string } | null>(null);
  const [form, setForm] = useState<CaseForm>(emptyForm);

  const utils = trpc.useUtils();
  const { data: cases, isLoading } = trpc.cases.list.useQuery();
  const { data: clients } = trpc.clients.list.useQuery();

  const createMutation = trpc.cases.create.useMutation({
    onSuccess: () => { utils.cases.list.invalidate(); setOpen(false); toast.success("เพิ่มคดีสำเร็จ"); },
    onError: () => toast.error("เกิดข้อผิดพลาด"),
  });
  const updateMutation = trpc.cases.update.useMutation({
    onSuccess: () => { utils.cases.list.invalidate(); setOpen(false); setEditStatus(null); toast.success("บันทึกสำเร็จ"); },
    onError: () => toast.error("เกิดข้อผิดพลาด"),
  });
  const deleteMutation = trpc.cases.delete.useMutation({
    onSuccess: () => { utils.cases.list.invalidate(); toast.success("ลบสำเร็จ"); },
    onError: () => toast.error("เกิดข้อผิดพลาด"),
  });

  const filtered = (cases ?? []).filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.caseNumber ?? "").includes(search)
  );

  const openCreate = () => { setEditId(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (c: typeof filtered[0]) => {
    setEditId(c.id);
    setForm({
      clientId: String(c.clientId),
      caseNumber: c.caseNumber ?? "",
      title: c.title,
      type: c.type,
      description: c.description ?? "",
      fee: c.fee ?? "",
      startDate: c.startDate ? String(c.startDate).slice(0, 10) : "",
      assignedTo: c.assignedTo ?? "",
    });
    setOpen(true);
  };

  const handleSubmit = () => {
    if (!form.title.trim()) return toast.error("กรุณากรอกชื่อคดี");
    if (!form.clientId) return toast.error("กรุณาเลือกลูกความ");
    if (editId) {
      updateMutation.mutate({ id: editId, title: form.title, type: form.type as "criminal" | "civil" | "contract" | "debt_collection" | "consultation" | "other", description: form.description, fee: form.fee, assignedTo: form.assignedTo });
    } else {
      createMutation.mutate({ ...form, clientId: Number(form.clientId), type: form.type as "criminal" | "civil" | "contract" | "debt_collection" | "consultation" | "other" });
    }
  };

  const getStatusStyle = (status: string) => caseStatusOptions.find((s) => s.value === status)?.color ?? "bg-gray-100 text-gray-500";
  const getStatusLabel = (status: string) => caseStatusOptions.find((s) => s.value === status)?.label ?? status;
  const getTypeLabel = (type: string) => caseTypeOptions.find((t) => t.value === type)?.label ?? type;
  const getClientName = (clientId: number) => clients?.find((c) => c.id === clientId)?.name ?? "-";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">คดีความ</h1>
          <p className="text-sm text-gray-500 mt-0.5">จัดการคดีความทั้งหมด</p>
        </div>
        <Button onClick={openCreate} className="bg-amber-500 hover:bg-amber-600 text-white">
          <Plus className="w-4 h-4 mr-1.5" /> เพิ่มคดี
        </Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input placeholder="ค้นหาชื่อคดีหรือเลขคดี..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-white border-gray-200" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="py-12 text-center text-gray-400 text-sm">กำลังโหลด...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">{search ? "ไม่พบคดีที่ค้นหา" : "ยังไม่มีคดี"}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">คดี</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ลูกความ</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ประเภท</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">สถานะ</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ค่าธรรมเนียม</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                          <Briefcase className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{c.title}</p>
                          {c.caseNumber && <p className="text-xs text-gray-400">เลขคดี: {c.caseNumber}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{getClientName(c.clientId)}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{getTypeLabel(c.type)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setEditStatus({ id: c.id, status: c.status })}
                        className={`text-xs px-2 py-0.5 rounded-full cursor-pointer hover:opacity-80 ${getStatusStyle(c.status)}`}
                      >
                        {getStatusLabel(c.status)}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {c.fee ? `${Number(c.fee).toLocaleString("th-TH")} บาท` : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => { if (confirm("ยืนยันการลบ?")) deleteMutation.mutate({ id: c.id }); }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editId ? "แก้ไขคดี" : "เพิ่มคดีใหม่"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">ลูกความ *</label>
              <Select value={form.clientId} onValueChange={(v) => setForm({ ...form, clientId: v })}>
                <SelectTrigger><SelectValue placeholder="เลือกลูกความ" /></SelectTrigger>
                <SelectContent>
                  {(clients ?? []).map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">ชื่อคดี *</label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="ชื่อคดี" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">ประเภทคดี</label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {caseTypeOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">เลขคดี</label>
                <Input value={form.caseNumber} onChange={(e) => setForm({ ...form, caseNumber: e.target.value })} placeholder="เลขคดี" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">ค่าธรรมเนียม (บาท)</label>
                <Input value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} placeholder="0.00" type="number" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">วันที่รับคดี</label>
                <Input value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} type="date" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">ผู้รับผิดชอบ</label>
              <Input value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} placeholder="ชื่อทนาย" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">รายละเอียด</label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="รายละเอียดเพิ่มเติม" />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>ยกเลิก</Button>
              <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white" onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
                {editId ? "บันทึก" : "เพิ่ม"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Status Dialog */}
      <Dialog open={!!editStatus} onOpenChange={() => setEditStatus(null)}>
        <DialogContent className="max-w-xs">
          <DialogHeader><DialogTitle>เปลี่ยนสถานะคดี</DialogTitle></DialogHeader>
          <div className="space-y-2 mt-2">
            {caseStatusOptions.map((s) => (
              <button
                key={s.value}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${editStatus?.status === s.value ? s.color : "hover:bg-gray-50 text-gray-600"}`}
                onClick={() => {
                  if (editStatus) updateMutation.mutate({ id: editStatus.id, status: s.value as "new" | "in_progress" | "pending" | "closed" | "cancelled" });
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

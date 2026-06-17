import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Plus, Search, Pencil, Trash2, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const statusOptions = [
  { value: "scheduled", label: "นัดหมาย", color: "bg-blue-100 text-blue-700" },
  { value: "completed", label: "เสร็จสิ้น", color: "bg-green-100 text-green-700" },
  { value: "cancelled", label: "ยกเลิก", color: "bg-red-100 text-red-600" },
  { value: "no_show", label: "ไม่มา", color: "bg-gray-100 text-gray-500" },
];

type ApptForm = {
  clientName: string;
  phone: string;
  title: string;
  description: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: string;
};

const emptyForm: ApptForm = { clientName: "", phone: "", title: "", description: "", appointmentDate: "", appointmentTime: "09:00", duration: "60" };

export default function AdminAppointments() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<ApptForm>(emptyForm);

  const utils = trpc.useUtils();
  const { data: appointments, isLoading } = trpc.appointments.list.useQuery();
  const createMutation = trpc.appointments.create.useMutation({
    onSuccess: () => { utils.appointments.list.invalidate(); setOpen(false); toast.success("เพิ่มนัดหมายสำเร็จ"); },
    onError: () => toast.error("เกิดข้อผิดพลาด"),
  });
  const updateMutation = trpc.appointments.update.useMutation({
    onSuccess: () => { utils.appointments.list.invalidate(); setOpen(false); toast.success("บันทึกสำเร็จ"); },
    onError: () => toast.error("เกิดข้อผิดพลาด"),
  });
  const deleteMutation = trpc.appointments.delete.useMutation({
    onSuccess: () => { utils.appointments.list.invalidate(); toast.success("ลบสำเร็จ"); },
    onError: () => toast.error("เกิดข้อผิดพลาด"),
  });

  const filtered = (appointments ?? []).filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      (a.clientName ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setEditId(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (a: typeof filtered[0]) => {
    const dt = new Date(a.appointmentDate);
    setEditId(a.id);
    setForm({
      clientName: a.clientName ?? "",
      phone: a.phone ?? "",
      title: a.title,
      description: a.description ?? "",
      appointmentDate: dt.toISOString().slice(0, 10),
      appointmentTime: dt.toTimeString().slice(0, 5),
      duration: String(a.duration ?? 60),
    });
    setOpen(true);
  };

  const handleSubmit = () => {
    if (!form.title.trim()) return toast.error("กรุณากรอกหัวข้อนัดหมาย");
    if (!form.appointmentDate) return toast.error("กรุณาเลือกวันที่");
    const dateTime = `${form.appointmentDate}T${form.appointmentTime}:00`;
    if (editId) {
      updateMutation.mutate({ id: editId, title: form.title, description: form.description, appointmentDate: dateTime, duration: Number(form.duration) });
    } else {
      createMutation.mutate({ clientName: form.clientName, phone: form.phone, title: form.title, description: form.description, appointmentDate: dateTime, duration: Number(form.duration) });
    }
  };

  const getStatusStyle = (status: string) => statusOptions.find((s) => s.value === status)?.color ?? "bg-gray-100 text-gray-500";
  const getStatusLabel = (status: string) => statusOptions.find((s) => s.value === status)?.label ?? status;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">นัดหมาย</h1>
          <p className="text-sm text-gray-500 mt-0.5">จัดการตารางนัดหมาย</p>
        </div>
        <Button onClick={openCreate} className="bg-amber-500 hover:bg-amber-600 text-white">
          <Plus className="w-4 h-4 mr-1.5" /> เพิ่มนัดหมาย
        </Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input placeholder="ค้นหาชื่อหรือลูกความ..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-white border-gray-200" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="py-12 text-center text-gray-400 text-sm">กำลังโหลด...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">{search ? "ไม่พบนัดหมายที่ค้นหา" : "ยังไม่มีนัดหมาย"}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">หัวข้อ</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ลูกความ</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">วันเวลา</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">สถานะ</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-4 h-4 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{a.title}</p>
                          {a.description && <p className="text-xs text-gray-400 truncate max-w-[200px]">{a.description}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-700">{a.clientName ?? "-"}</p>
                      {a.phone && <p className="text-xs text-gray-400">{a.phone}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-700">{new Date(a.appointmentDate).toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" })}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {new Date(a.appointmentDate).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })} น. ({a.duration ?? 60} นาที)
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => updateMutation.mutate({ id: a.id, status: a.status === "scheduled" ? "completed" : "scheduled" })}
                        className={`text-xs px-2 py-0.5 rounded-full cursor-pointer hover:opacity-80 ${getStatusStyle(a.status)}`}
                      >
                        {getStatusLabel(a.status)}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => { if (confirm("ยืนยันการลบ?")) deleteMutation.mutate({ id: a.id }); }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editId ? "แก้ไขนัดหมาย" : "เพิ่มนัดหมายใหม่"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">หัวข้อนัดหมาย *</label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="เช่น ปรึกษาคดีแพ่ง" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">ชื่อลูกความ</label>
                <Input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} placeholder="ชื่อ-นามสกุล" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">เบอร์โทร</label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0xx-xxx-xxxx" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">วันที่ *</label>
                <Input value={form.appointmentDate} onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })} type="date" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">เวลา</label>
                <Input value={form.appointmentTime} onChange={(e) => setForm({ ...form, appointmentTime: e.target.value })} type="time" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">ระยะเวลา (นาที)</label>
              <Select value={form.duration} onValueChange={(v) => setForm({ ...form, duration: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 นาที</SelectItem>
                  <SelectItem value="60">1 ชั่วโมง</SelectItem>
                  <SelectItem value="90">1.5 ชั่วโมง</SelectItem>
                  <SelectItem value="120">2 ชั่วโมง</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">หมายเหตุ</label>
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
    </div>
  );
}

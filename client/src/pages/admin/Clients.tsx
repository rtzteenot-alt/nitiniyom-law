import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Plus, Search, Pencil, Trash2, Phone, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

type ClientForm = {
  name: string;
  phone: string;
  email: string;
  address: string;
  idCard: string;
  notes: string;
};

const emptyForm: ClientForm = { name: "", phone: "", email: "", address: "", idCard: "", notes: "" };

export default function AdminClients() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<ClientForm>(emptyForm);

  const utils = trpc.useUtils();
  const { data: clients, isLoading } = trpc.clients.list.useQuery();
  const createMutation = trpc.clients.create.useMutation({
    onSuccess: () => { utils.clients.list.invalidate(); setOpen(false); toast.success("เพิ่มลูกความสำเร็จ"); },
    onError: () => toast.error("เกิดข้อผิดพลาด"),
  });
  const updateMutation = trpc.clients.update.useMutation({
    onSuccess: () => { utils.clients.list.invalidate(); setOpen(false); toast.success("บันทึกสำเร็จ"); },
    onError: () => toast.error("เกิดข้อผิดพลาด"),
  });
  const deleteMutation = trpc.clients.delete.useMutation({
    onSuccess: () => { utils.clients.list.invalidate(); toast.success("ลบสำเร็จ"); },
    onError: () => toast.error("เกิดข้อผิดพลาด"),
  });

  const filtered = (clients ?? []).filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone ?? "").includes(search) ||
      (c.email ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setEditId(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (c: typeof filtered[0]) => {
    setEditId(c.id);
    setForm({ name: c.name, phone: c.phone ?? "", email: c.email ?? "", address: c.address ?? "", idCard: c.idCard ?? "", notes: c.notes ?? "" });
    setOpen(true);
  };
  const handleSubmit = () => {
    if (!form.name.trim()) return toast.error("กรุณากรอกชื่อ");
    if (editId) updateMutation.mutate({ id: editId, ...form });
    else createMutation.mutate(form);
  };
  const handleDelete = (id: number) => {
    if (confirm("ยืนยันการลบลูกความนี้?")) deleteMutation.mutate({ id });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">ลูกความ</h1>
          <p className="text-sm text-gray-500 mt-0.5">จัดการรายชื่อลูกความทั้งหมด</p>
        </div>
        <Button onClick={openCreate} className="bg-amber-500 hover:bg-amber-600 text-white">
          <Plus className="w-4 h-4 mr-1.5" /> เพิ่มลูกความ
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="ค้นหาชื่อ เบอร์โทร หรืออีเมล..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-white border-gray-200"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="py-12 text-center text-gray-400 text-sm">กำลังโหลด...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">
            {search ? "ไม่พบลูกความที่ค้นหา" : "ยังไม่มีลูกความ"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ชื่อ</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ติดต่อ</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">สถานะ</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">วันที่เพิ่ม</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{c.name}</p>
                          {c.idCard && <p className="text-xs text-gray-400">บัตร: {c.idCard}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {c.phone && (
                        <div className="flex items-center gap-1 text-gray-600 text-xs mb-0.5">
                          <Phone className="w-3 h-3" /> {c.phone}
                        </div>
                      )}
                      {c.email && (
                        <div className="flex items-center gap-1 text-gray-600 text-xs">
                          <Mail className="w-3 h-3" /> {c.email}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${c.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {c.status === "active" ? "ใช้งาน" : "ไม่ใช้งาน"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {new Date(c.createdAt).toLocaleDateString("th-TH")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
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

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editId ? "แก้ไขลูกความ" : "เพิ่มลูกความใหม่"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">ชื่อ-นามสกุล *</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="ชื่อ-นามสกุล" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">เบอร์โทรศัพท์</label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0xx-xxx-xxxx" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">อีเมล</label>
                <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">เลขบัตรประชาชน</label>
              <Input value={form.idCard} onChange={(e) => setForm({ ...form, idCard: e.target.value })} placeholder="x-xxxx-xxxxx-xx-x" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">ที่อยู่</label>
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="ที่อยู่" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">หมายเหตุ</label>
              <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="หมายเหตุเพิ่มเติม" />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>ยกเลิก</Button>
              <Button
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editId ? "บันทึก" : "เพิ่ม"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

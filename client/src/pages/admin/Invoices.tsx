import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Plus, Search, Pencil, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const statusOptions = [
  { value: "pending", label: "รอชำระ", color: "bg-yellow-100 text-yellow-700" },
  { value: "partial", label: "ชำระบางส่วน", color: "bg-blue-100 text-blue-700" },
  { value: "paid", label: "ชำระแล้ว", color: "bg-green-100 text-green-700" },
  { value: "overdue", label: "เกินกำหนด", color: "bg-red-100 text-red-600" },
  { value: "cancelled", label: "ยกเลิก", color: "bg-gray-100 text-gray-500" },
];

type InvoiceForm = {
  clientId: string;
  invoiceNumber: string;
  amount: string;
  paidAmount: string;
  status: string;
  dueDate: string;
  description: string;
};

const emptyForm: InvoiceForm = { clientId: "", invoiceNumber: "", amount: "", paidAmount: "0", status: "pending", dueDate: "", description: "" };

export default function AdminInvoices() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<InvoiceForm>(emptyForm);

  const utils = trpc.useUtils();
  const { data: invoices, isLoading } = trpc.invoices.list.useQuery();
  const { data: clients } = trpc.clients.list.useQuery();

  const createMutation = trpc.invoices.create.useMutation({
    onSuccess: () => { utils.invoices.list.invalidate(); setOpen(false); toast.success("สร้างใบแจ้งหนี้สำเร็จ"); },
    onError: () => toast.error("เกิดข้อผิดพลาด"),
  });
  const updateMutation = trpc.invoices.update.useMutation({
    onSuccess: () => { utils.invoices.list.invalidate(); setOpen(false); toast.success("บันทึกสำเร็จ"); },
    onError: () => toast.error("เกิดข้อผิดพลาด"),
  });

  const filtered = (invoices ?? []).filter(
    (inv) =>
      (inv.invoiceNumber ?? "").includes(search) ||
      (inv.description ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setEditId(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (inv: typeof filtered[0]) => {
    setEditId(inv.id);
    setForm({
      clientId: String(inv.clientId),
      invoiceNumber: inv.invoiceNumber ?? "",
      amount: inv.amount,
      paidAmount: inv.paidAmount ?? "0",
      status: inv.status,
      dueDate: inv.dueDate ? String(inv.dueDate).slice(0, 10) : "",
      description: inv.description ?? "",
    });
    setOpen(true);
  };

  const handleSubmit = () => {
    if (!form.amount || Number(form.amount) <= 0) return toast.error("กรุณากรอกจำนวนเงิน");
    if (!form.clientId) return toast.error("กรุณาเลือกลูกความ");
    if (editId) {
      updateMutation.mutate({ id: editId, paidAmount: form.paidAmount, status: form.status as "pending" | "partial" | "paid" | "overdue" | "cancelled", description: form.description });
    } else {
      createMutation.mutate({ ...form, clientId: Number(form.clientId), status: form.status as "pending" | "partial" | "paid" | "overdue" | "cancelled" });
    }
  };

  const getStatusStyle = (status: string) => statusOptions.find((s) => s.value === status)?.color ?? "bg-gray-100 text-gray-500";
  const getStatusLabel = (status: string) => statusOptions.find((s) => s.value === status)?.label ?? status;
  const getClientName = (clientId: number) => clients?.find((c) => c.id === clientId)?.name ?? "-";

  const totalRevenue = (invoices ?? []).filter((i) => i.status === "paid").reduce((sum, i) => sum + Number(i.paidAmount ?? 0), 0);
  const pendingRevenue = (invoices ?? []).filter((i) => i.status === "pending" || i.status === "partial").reduce((sum, i) => sum + Number(i.amount) - Number(i.paidAmount ?? 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">ใบแจ้งหนี้</h1>
          <p className="text-sm text-gray-500 mt-0.5">จัดการใบแจ้งหนี้และการชำระเงิน</p>
        </div>
        <Button onClick={openCreate} className="bg-amber-500 hover:bg-amber-600 text-white">
          <Plus className="w-4 h-4 mr-1.5" /> สร้างใบแจ้งหนี้
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400 mb-1">รายได้รวม (ชำระแล้ว)</p>
          <p className="text-2xl font-bold text-green-600">{totalRevenue.toLocaleString("th-TH")} ฿</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400 mb-1">รอชำระ</p>
          <p className="text-2xl font-bold text-amber-600">{pendingRevenue.toLocaleString("th-TH")} ฿</p>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input placeholder="ค้นหาเลขใบแจ้งหนี้หรือรายละเอียด..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-white border-gray-200" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="py-12 text-center text-gray-400 text-sm">กำลังโหลด...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">{search ? "ไม่พบใบแจ้งหนี้" : "ยังไม่มีใบแจ้งหนี้"}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ใบแจ้งหนี้</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ลูกความ</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">จำนวนเงิน</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ชำระแล้ว</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">สถานะ</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ครบกำหนด</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((inv) => (
                  <tr key={inv.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-purple-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{inv.invoiceNumber ?? `#${inv.id}`}</p>
                          {inv.description && <p className="text-xs text-gray-400 truncate max-w-[150px]">{inv.description}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{getClientName(inv.clientId)}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{Number(inv.amount).toLocaleString("th-TH")} ฿</td>
                    <td className="px-4 py-3 text-green-600">{Number(inv.paidAmount ?? 0).toLocaleString("th-TH")} ฿</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusStyle(inv.status)}`}>
                        {getStatusLabel(inv.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString("th-TH") : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => openEdit(inv)} className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
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
            <DialogTitle>{editId ? "แก้ไขใบแจ้งหนี้" : "สร้างใบแจ้งหนี้ใหม่"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            {!editId && (
              <>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">ลูกความ *</label>
                  <Select value={form.clientId} onValueChange={(v) => setForm({ ...form, clientId: v })}>
                    <SelectTrigger><SelectValue placeholder="เลือกลูกความ" /></SelectTrigger>
                    <SelectContent>
                      {(clients ?? []).map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">เลขใบแจ้งหนี้</label>
                    <Input value={form.invoiceNumber} onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })} placeholder="INV-001" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">จำนวนเงิน (บาท) *</label>
                    <Input value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" type="number" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">วันครบกำหนด</label>
                  <Input value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} type="date" />
                </div>
              </>
            )}
            {editId && (
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">ยอดชำระแล้ว (บาท)</label>
                <Input value={form.paidAmount} onChange={(e) => setForm({ ...form, paidAmount: e.target.value })} placeholder="0.00" type="number" />
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">สถานะ</label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">รายละเอียด</label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="รายละเอียดเพิ่มเติม" />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>ยกเลิก</Button>
              <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white" onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
                {editId ? "บันทึก" : "สร้าง"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

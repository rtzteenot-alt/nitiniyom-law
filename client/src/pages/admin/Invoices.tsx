import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Search, Edit2, Receipt, DollarSign } from "lucide-react";

const statusOptions = [
  { value: "pending", label: "รอชำระ", color: "bg-amber-50 text-amber-700" },
  { value: "partial", label: "ชำระบางส่วน", color: "bg-blue-50 text-blue-700" },
  { value: "paid", label: "ชำระแล้ว", color: "bg-green-50 text-green-700" },
  { value: "overdue", label: "เกินกำหนด", color: "bg-red-50 text-red-700" },
  { value: "cancelled", label: "ยกเลิก", color: "bg-muted text-muted-foreground" },
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

const emptyForm: InvoiceForm = {
  clientId: "",
  invoiceNumber: "",
  amount: "",
  paidAmount: "0",
  status: "pending",
  dueDate: "",
  description: "",
};

export default function AdminInvoices() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<InvoiceForm>(emptyForm);

  const utils = trpc.useUtils();
  const { data: invoices, isLoading } = trpc.invoices.list.useQuery();
  const { data: clients } = trpc.clients.list.useQuery();

  const createMutation = trpc.invoices.create.useMutation({
    onSuccess: () => {
      toast.success("สร้างใบแจ้งหนี้สำเร็จ");
      utils.invoices.list.invalidate();
      setDialogOpen(false);
      setForm(emptyForm);
    },
    onError: () => toast.error("เกิดข้อผิดพลาด"),
  });

  const updateMutation = trpc.invoices.update.useMutation({
    onSuccess: () => {
      toast.success("อัพเดตสำเร็จ");
      utils.invoices.list.invalidate();
      setDialogOpen(false);
      setEditId(null);
      setForm(emptyForm);
    },
    onError: () => toast.error("เกิดข้อผิดพลาด"),
  });

  const filtered = invoices?.filter((inv) => {
    const client = clients?.find((c) => c.id === inv.clientId);
    return (
      client?.name.toLowerCase().includes(search.toLowerCase()) ||
      inv.invoiceNumber?.includes(search) ||
      inv.description?.toLowerCase().includes(search.toLowerCase())
    );
  }) ?? [];

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (inv: (typeof filtered)[0]) => {
    setEditId(inv.id);
    setForm({
      clientId: String(inv.clientId),
      invoiceNumber: inv.invoiceNumber ?? "",
      amount: inv.amount,
      paidAmount: inv.paidAmount ?? "0",
      status: inv.status,
      dueDate: inv.dueDate ? new Date(inv.dueDate).toISOString().split("T")[0] : "",
      description: inv.description ?? "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.amount || Number(form.amount) <= 0) {
      toast.error("กรุณากรอกจำนวนเงิน");
      return;
    }
    if (editId) {
      updateMutation.mutate({
        id: editId,
        paidAmount: form.paidAmount,
        status: form.status as "pending" | "partial" | "paid" | "overdue" | "cancelled",
        description: form.description,
      });
    } else {
      if (!form.clientId) {
        toast.error("กรุณาเลือกลูกค้า");
        return;
      }
      createMutation.mutate({
        clientId: Number(form.clientId),
        invoiceNumber: form.invoiceNumber,
        amount: form.amount,
        paidAmount: form.paidAmount,
        status: form.status as "pending" | "partial" | "paid" | "overdue" | "cancelled",
        dueDate: form.dueDate || undefined,
        description: form.description,
      });
    }
  };

  const totalRevenue = invoices
    ?.filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + Number(i.paidAmount ?? 0), 0) ?? 0;

  const totalPending = invoices
    ?.filter((i) => i.status === "pending" || i.status === "partial")
    .reduce((sum, i) => sum + (Number(i.amount) - Number(i.paidAmount ?? 0)), 0) ?? 0;

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <AdminLayout>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground">ใบแจ้งหนี้</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              ทั้งหมด {invoices?.length ?? 0} รายการ
            </p>
          </div>
          <Button onClick={openCreate} className="gold-gradient text-white border-0 shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            สร้างใบแจ้งหนี้
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-border">
            <p className="text-xs text-muted-foreground mb-1">รายได้รวม (ชำระแล้ว)</p>
            <p className="text-xl font-bold text-green-600">฿{totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-border">
            <p className="text-xs text-muted-foreground mb-1">ค้างชำระ</p>
            <p className="text-xl font-bold text-amber-600">฿{totalPending.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-border">
            <p className="text-xs text-muted-foreground mb-1">รอชำระ</p>
            <p className="text-xl font-bold text-foreground">
              {invoices?.filter((i) => i.status === "pending").length ?? 0} รายการ
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-border">
            <p className="text-xs text-muted-foreground mb-1">เกินกำหนด</p>
            <p className="text-xl font-bold text-red-600">
              {invoices?.filter((i) => i.status === "overdue").length ?? 0} รายการ
            </p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ค้นหาลูกค้า, เลขใบแจ้งหนี้..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
          {isLoading ? (
            <div className="p-8 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <Receipt className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
              <p className="text-muted-foreground text-sm">
                {search ? "ไม่พบใบแจ้งหนี้ที่ค้นหา" : "ยังไม่มีใบแจ้งหนี้"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-5 py-3.5 font-semibold text-foreground/70 text-xs uppercase tracking-wide">
                      เลขที่
                    </th>
                    <th className="text-left px-5 py-3.5 font-semibold text-foreground/70 text-xs uppercase tracking-wide">
                      ลูกค้า
                    </th>
                    <th className="text-left px-5 py-3.5 font-semibold text-foreground/70 text-xs uppercase tracking-wide">
                      จำนวนเงิน
                    </th>
                    <th className="text-left px-5 py-3.5 font-semibold text-foreground/70 text-xs uppercase tracking-wide hidden md:table-cell">
                      ชำระแล้ว
                    </th>
                    <th className="text-left px-5 py-3.5 font-semibold text-foreground/70 text-xs uppercase tracking-wide">
                      สถานะ
                    </th>
                    <th className="text-left px-5 py-3.5 font-semibold text-foreground/70 text-xs uppercase tracking-wide hidden lg:table-cell">
                      ครบกำหนด
                    </th>
                    <th className="px-5 py-3.5 w-16" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((inv) => {
                    const statusInfo = statusOptions.find((s) => s.value === inv.status);
                    const client = clients?.find((c) => c.id === inv.clientId);
                    return (
                      <tr key={inv.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-amber-500" />
                            <span className="font-mono text-xs text-muted-foreground">
                              {inv.invoiceNumber ?? `INV-${String(inv.id).padStart(4, "0")}`}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-medium text-foreground">
                          {client?.name ?? `ลูกค้า #${inv.clientId}`}
                        </td>
                        <td className="px-5 py-4 font-semibold text-foreground">
                          ฿{Number(inv.amount).toLocaleString()}
                        </td>
                        <td className="px-5 py-4 text-green-600 font-medium hidden md:table-cell">
                          ฿{Number(inv.paidAmount ?? 0).toLocaleString()}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusInfo?.color ?? "bg-muted text-muted-foreground"}`}
                          >
                            {statusInfo?.label ?? inv.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-muted-foreground text-xs hidden lg:table-cell">
                          {inv.dueDate
                            ? new Date(inv.dueDate).toLocaleDateString("th-TH")
                            : "—"}
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => openEdit(inv)}
                            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {editId ? "แก้ไขใบแจ้งหนี้" : "สร้างใบแจ้งหนี้ใหม่"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {!editId && (
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  ลูกค้า <span className="text-destructive">*</span>
                </label>
                <Select
                  value={form.clientId}
                  onValueChange={(v) => setForm({ ...form, clientId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกลูกค้า" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients?.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              {!editId && (
                <div>
                  <label className="text-sm font-medium mb-1.5 block">เลขที่ใบแจ้งหนี้</label>
                  <Input
                    value={form.invoiceNumber}
                    onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
                    placeholder="INV-0001"
                  />
                </div>
              )}
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  จำนวนเงิน (บาท) <span className="text-destructive">*</span>
                </label>
                <Input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="0.00"
                  disabled={!!editId}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1.5 block">ชำระแล้ว (บาท)</label>
                <Input
                  type="number"
                  value={form.paidAmount}
                  onChange={(e) => setForm({ ...form, paidAmount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">สถานะ</label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm({ ...form, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {!editId && (
              <div>
                <label className="text-sm font-medium mb-1.5 block">วันครบกำหนด</label>
                <Input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                />
              </div>
            )}
            <div>
              <label className="text-sm font-medium mb-1.5 block">รายละเอียด</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="รายละเอียดค่าบริการ"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              ยกเลิก
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className="gold-gradient text-white border-0"
            >
              {isPending ? "กำลังบันทึก..." : editId ? "บันทึก" : "สร้างใบแจ้งหนี้"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

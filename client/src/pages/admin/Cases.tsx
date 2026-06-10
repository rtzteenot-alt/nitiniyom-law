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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Search, Edit2, Trash2, Briefcase } from "lucide-react";

const caseTypes = [
  { value: "criminal", label: "กฎหมายอาญา" },
  { value: "civil", label: "กฎหมายแพ่ง" },
  { value: "contract", label: "การทำสัญญา" },
  { value: "debt_collection", label: "ทวงถามหนี้" },
  { value: "consultation", label: "ปรึกษาเบื้องต้น" },
  { value: "other", label: "อื่นๆ" },
];

const caseStatuses = [
  { value: "new", label: "ใหม่", color: "bg-blue-50 text-blue-700" },
  { value: "in_progress", label: "ดำเนินการ", color: "bg-amber-50 text-amber-700" },
  { value: "pending", label: "รอดำเนินการ", color: "bg-orange-50 text-orange-700" },
  { value: "closed", label: "ปิดแล้ว", color: "bg-green-50 text-green-700" },
  { value: "cancelled", label: "ยกเลิก", color: "bg-muted text-muted-foreground" },
];

type CaseForm = {
  clientId: string;
  caseNumber: string;
  title: string;
  type: string;
  status: string;
  description: string;
  fee: string;
  assignedTo: string;
};

const emptyForm: CaseForm = {
  clientId: "",
  caseNumber: "",
  title: "",
  type: "",
  status: "new",
  description: "",
  fee: "",
  assignedTo: "",
};

export default function AdminCases() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<CaseForm>(emptyForm);

  const utils = trpc.useUtils();
  const { data: cases, isLoading } = trpc.cases.list.useQuery();
  const { data: clients } = trpc.clients.list.useQuery();

  const createMutation = trpc.cases.create.useMutation({
    onSuccess: () => {
      toast.success("เพิ่มคดีสำเร็จ");
      utils.cases.list.invalidate();
      setDialogOpen(false);
      setForm(emptyForm);
    },
    onError: () => toast.error("เกิดข้อผิดพลาด"),
  });

  const updateMutation = trpc.cases.update.useMutation({
    onSuccess: () => {
      toast.success("แก้ไขคดีสำเร็จ");
      utils.cases.list.invalidate();
      setDialogOpen(false);
      setEditId(null);
      setForm(emptyForm);
    },
    onError: () => toast.error("เกิดข้อผิดพลาด"),
  });

  const deleteMutation = trpc.cases.delete.useMutation({
    onSuccess: () => {
      toast.success("ลบคดีสำเร็จ");
      utils.cases.list.invalidate();
      setDeleteId(null);
    },
    onError: () => toast.error("เกิดข้อผิดพลาด"),
  });

  const filtered = cases?.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.caseNumber?.includes(search);
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    return matchSearch && matchStatus;
  }) ?? [];

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (c: (typeof filtered)[0]) => {
    setEditId(c.id);
    setForm({
      clientId: String(c.clientId),
      caseNumber: c.caseNumber ?? "",
      title: c.title,
      type: c.type,
      status: c.status,
      description: c.description ?? "",
      fee: c.fee ?? "",
      assignedTo: c.assignedTo ?? "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.title.trim() || !form.type || !form.clientId) {
      toast.error("กรุณากรอกข้อมูลที่จำเป็น");
      return;
    }
    if (editId) {
      updateMutation.mutate({
        id: editId,
        title: form.title,
        type: form.type as "criminal" | "civil" | "contract" | "debt_collection" | "consultation" | "other",
        status: form.status as "new" | "in_progress" | "pending" | "closed" | "cancelled",
        description: form.description,
        fee: form.fee,
        assignedTo: form.assignedTo,
      });
    } else {
      createMutation.mutate({
        clientId: Number(form.clientId),
        caseNumber: form.caseNumber,
        title: form.title,
        type: form.type as "criminal" | "civil" | "contract" | "debt_collection" | "consultation" | "other",
        description: form.description,
        fee: form.fee,
        assignedTo: form.assignedTo,
      });
    }
  };

  const getClientName = (id: number) =>
    clients?.find((c) => c.id === id)?.name ?? `ลูกค้า #${id}`;

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <AdminLayout>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground">คดีความ</h2>
            <p className="text-sm text-muted-foreground mt-0.5">ทั้งหมด {cases?.length ?? 0} คดี</p>
          </div>
          <Button onClick={openCreate} className="gold-gradient text-white border-0 shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มคดี
          </Button>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ค้นหาชื่อคดี, เลขคดี..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40 bg-white">
              <SelectValue placeholder="สถานะทั้งหมด" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกสถานะ</SelectItem>
              {caseStatuses.map((s) => (
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
                <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <Briefcase className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
              <p className="text-muted-foreground text-sm">
                {search || filterStatus !== "all" ? "ไม่พบคดีที่ค้นหา" : "ยังไม่มีคดี"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-5 py-3.5 font-semibold text-foreground/70 text-xs uppercase tracking-wide">
                      คดี
                    </th>
                    <th className="text-left px-5 py-3.5 font-semibold text-foreground/70 text-xs uppercase tracking-wide hidden md:table-cell">
                      ลูกค้า
                    </th>
                    <th className="text-left px-5 py-3.5 font-semibold text-foreground/70 text-xs uppercase tracking-wide">
                      ประเภท
                    </th>
                    <th className="text-left px-5 py-3.5 font-semibold text-foreground/70 text-xs uppercase tracking-wide">
                      สถานะ
                    </th>
                    <th className="text-left px-5 py-3.5 font-semibold text-foreground/70 text-xs uppercase tracking-wide hidden lg:table-cell">
                      ค่าบริการ
                    </th>
                    <th className="px-5 py-3.5 w-20" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((c) => {
                    const statusInfo = caseStatuses.find((s) => s.value === c.status);
                    const typeInfo = caseTypes.find((t) => t.value === c.type);
                    return (
                      <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-5 py-4">
                          <p className="font-medium text-foreground">{c.title}</p>
                          {c.caseNumber && (
                            <p className="text-xs text-muted-foreground">#{c.caseNumber}</p>
                          )}
                        </td>
                        <td className="px-5 py-4 text-muted-foreground hidden md:table-cell">
                          {getClientName(c.clientId)}
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-medium">
                            {typeInfo?.label ?? c.type}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusInfo?.color ?? "bg-muted text-muted-foreground"}`}
                          >
                            {statusInfo?.label ?? c.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-muted-foreground hidden lg:table-cell">
                          {c.fee ? `฿${Number(c.fee).toLocaleString()}` : "—"}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEdit(c)}
                              className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteId(c.id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
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
              {editId ? "แก้ไขคดี" : "เพิ่มคดีใหม่"}
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
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  ชื่อคดี <span className="text-destructive">*</span>
                </label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="ระบุชื่อคดี"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">เลขคดี</label>
                <Input
                  value={form.caseNumber}
                  onChange={(e) => setForm({ ...form, caseNumber: e.target.value })}
                  placeholder="เลขคดีศาล"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  ประเภทคดี <span className="text-destructive">*</span>
                </label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกประเภท" />
                  </SelectTrigger>
                  <SelectContent>
                    {caseTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">สถานะ</label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {caseStatuses.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1.5 block">ค่าบริการ (บาท)</label>
                <Input
                  type="number"
                  value={form.fee}
                  onChange={(e) => setForm({ ...form, fee: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">ผู้รับผิดชอบ</label>
                <Input
                  value={form.assignedTo}
                  onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                  placeholder="ชื่อทนายความ"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">รายละเอียด</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="รายละเอียดคดี"
                rows={3}
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
              {isPending ? "กำลังบันทึก..." : editId ? "บันทึก" : "เพิ่มคดี"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
            <AlertDialogDescription>
              คุณต้องการลบคดีนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate({ id: deleteId })}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              ลบ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}

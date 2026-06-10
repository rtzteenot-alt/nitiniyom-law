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
import { Plus, Search, Edit2, Trash2, Calendar, Clock } from "lucide-react";

const statusOptions = [
  { value: "scheduled", label: "นัดแล้ว", color: "bg-blue-50 text-blue-700" },
  { value: "completed", label: "เสร็จสิ้น", color: "bg-green-50 text-green-700" },
  { value: "cancelled", label: "ยกเลิก", color: "bg-muted text-muted-foreground" },
  { value: "no_show", label: "ไม่มา", color: "bg-red-50 text-red-700" },
];

type AppointmentForm = {
  clientId: string;
  clientName: string;
  phone: string;
  title: string;
  description: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: string;
};

const emptyForm: AppointmentForm = {
  clientId: "",
  clientName: "",
  phone: "",
  title: "",
  description: "",
  appointmentDate: "",
  appointmentTime: "09:00",
  duration: "60",
};

export default function AdminAppointments() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<AppointmentForm>(emptyForm);

  const utils = trpc.useUtils();
  const { data: appointments, isLoading } = trpc.appointments.list.useQuery();
  const { data: clients } = trpc.clients.list.useQuery();

  const createMutation = trpc.appointments.create.useMutation({
    onSuccess: () => {
      toast.success("เพิ่มนัดหมายสำเร็จ");
      utils.appointments.list.invalidate();
      utils.appointments.today.invalidate();
      setDialogOpen(false);
      setForm(emptyForm);
    },
    onError: () => toast.error("เกิดข้อผิดพลาด"),
  });

  const updateMutation = trpc.appointments.update.useMutation({
    onSuccess: () => {
      toast.success("แก้ไขนัดหมายสำเร็จ");
      utils.appointments.list.invalidate();
      utils.appointments.today.invalidate();
      setDialogOpen(false);
      setEditId(null);
      setForm(emptyForm);
    },
    onError: () => toast.error("เกิดข้อผิดพลาด"),
  });

  const deleteMutation = trpc.appointments.delete.useMutation({
    onSuccess: () => {
      toast.success("ลบนัดหมายสำเร็จ");
      utils.appointments.list.invalidate();
      setDeleteId(null);
    },
    onError: () => toast.error("เกิดข้อผิดพลาด"),
  });

  const filtered = appointments?.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      a.phone?.includes(search)
  ) ?? [];

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (a: (typeof filtered)[0]) => {
    const d = new Date(a.appointmentDate);
    setEditId(a.id);
    setForm({
      clientId: String(a.clientId ?? ""),
      clientName: a.clientName ?? "",
      phone: a.phone ?? "",
      title: a.title,
      description: a.description ?? "",
      appointmentDate: d.toISOString().split("T")[0],
      appointmentTime: d.toTimeString().slice(0, 5),
      duration: String(a.duration ?? 60),
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.title.trim() || !form.appointmentDate) {
      toast.error("กรุณากรอกชื่อนัดหมายและวันที่");
      return;
    }
    const dateTime = new Date(`${form.appointmentDate}T${form.appointmentTime}:00`).toISOString();
    const selectedClient = clients?.find((c) => String(c.id) === form.clientId);

    if (editId) {
      updateMutation.mutate({
        id: editId,
        title: form.title,
        description: form.description,
        appointmentDate: dateTime,
        duration: Number(form.duration),
      });
    } else {
      createMutation.mutate({
        clientId: form.clientId ? Number(form.clientId) : undefined,
        clientName: selectedClient?.name ?? form.clientName,
        phone: selectedClient?.phone ?? form.phone,
        title: form.title,
        description: form.description,
        appointmentDate: dateTime,
        duration: Number(form.duration),
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <AdminLayout>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground">นัดหมาย</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              ทั้งหมด {appointments?.length ?? 0} รายการ
            </p>
          </div>
          <Button onClick={openCreate} className="gold-gradient text-white border-0 shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มนัดหมาย
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ค้นหาชื่อนัดหมาย, ลูกค้า..."
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
              <Calendar className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
              <p className="text-muted-foreground text-sm">
                {search ? "ไม่พบนัดหมายที่ค้นหา" : "ยังไม่มีนัดหมาย"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-5 py-3.5 font-semibold text-foreground/70 text-xs uppercase tracking-wide">
                      นัดหมาย
                    </th>
                    <th className="text-left px-5 py-3.5 font-semibold text-foreground/70 text-xs uppercase tracking-wide hidden md:table-cell">
                      ลูกค้า
                    </th>
                    <th className="text-left px-5 py-3.5 font-semibold text-foreground/70 text-xs uppercase tracking-wide">
                      วันเวลา
                    </th>
                    <th className="text-left px-5 py-3.5 font-semibold text-foreground/70 text-xs uppercase tracking-wide">
                      สถานะ
                    </th>
                    <th className="px-5 py-3.5 w-20" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((a) => {
                    const statusInfo = statusOptions.find((s) => s.value === a.status);
                    const d = new Date(a.appointmentDate);
                    const isToday =
                      d.toDateString() === new Date().toDateString();
                    return (
                      <tr key={a.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isToday ? "bg-amber-50" : "bg-muted"}`}>
                              <Clock className={`w-4 h-4 ${isToday ? "text-amber-600" : "text-muted-foreground"}`} />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{a.title}</p>
                              {isToday && (
                                <span className="text-xs text-amber-600 font-medium">วันนี้</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-muted-foreground hidden md:table-cell">
                          <div>
                            <p>{a.clientName ?? "—"}</p>
                            {a.phone && <p className="text-xs">{a.phone}</p>}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium text-foreground text-sm">
                            {d.toLocaleDateString("th-TH", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {d.toLocaleTimeString("th-TH", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            น. ({a.duration} นาที)
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusInfo?.color ?? "bg-muted text-muted-foreground"}`}
                          >
                            {statusInfo?.label ?? a.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEdit(a)}
                              className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteId(a.id)}
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
              {editId ? "แก้ไขนัดหมาย" : "เพิ่มนัดหมายใหม่"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {!editId && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">เลือกลูกค้า</label>
                  <Select
                    value={form.clientId}
                    onValueChange={(v) => setForm({ ...form, clientId: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="เลือก (ไม่บังคับ)" />
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
                <div>
                  <label className="text-sm font-medium mb-1.5 block">หรือกรอกชื่อ</label>
                  <Input
                    value={form.clientName}
                    onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                    placeholder="ชื่อผู้นัด"
                    disabled={!!form.clientId}
                  />
                </div>
              </div>
            )}
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                ชื่อนัดหมาย <span className="text-destructive">*</span>
              </label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="เช่น ปรึกษาคดีอาญา, ลงนามสัญญา"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="text-sm font-medium mb-1.5 block">
                  วันที่ <span className="text-destructive">*</span>
                </label>
                <Input
                  type="date"
                  value={form.appointmentDate}
                  onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">เวลา</label>
                <Input
                  type="time"
                  value={form.appointmentTime}
                  onChange={(e) => setForm({ ...form, appointmentTime: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">ระยะเวลา (นาที)</label>
              <Select
                value={form.duration}
                onValueChange={(v) => setForm({ ...form, duration: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 นาที</SelectItem>
                  <SelectItem value="60">1 ชั่วโมง</SelectItem>
                  <SelectItem value="90">1.5 ชั่วโมง</SelectItem>
                  <SelectItem value="120">2 ชั่วโมง</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">หมายเหตุ</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="รายละเอียดเพิ่มเติม"
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
              {isPending ? "กำลังบันทึก..." : editId ? "บันทึก" : "เพิ่มนัดหมาย"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
            <AlertDialogDescription>
              คุณต้องการลบนัดหมายนี้ใช่หรือไม่?
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

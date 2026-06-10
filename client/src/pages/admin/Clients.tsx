import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Search, Edit2, Trash2, Phone, Mail, User } from "lucide-react";

type ClientForm = {
  name: string;
  phone: string;
  email: string;
  address: string;
  idCard: string;
  notes: string;
};

const emptyForm: ClientForm = {
  name: "",
  phone: "",
  email: "",
  address: "",
  idCard: "",
  notes: "",
};

export default function AdminClients() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<ClientForm>(emptyForm);

  const utils = trpc.useUtils();
  const { data: clients, isLoading } = trpc.clients.list.useQuery();

  const createMutation = trpc.clients.create.useMutation({
    onSuccess: () => {
      toast.success("เพิ่มลูกค้าสำเร็จ");
      utils.clients.list.invalidate();
      setDialogOpen(false);
      setForm(emptyForm);
    },
    onError: () => toast.error("เกิดข้อผิดพลาด"),
  });

  const updateMutation = trpc.clients.update.useMutation({
    onSuccess: () => {
      toast.success("แก้ไขข้อมูลสำเร็จ");
      utils.clients.list.invalidate();
      setDialogOpen(false);
      setEditId(null);
      setForm(emptyForm);
    },
    onError: () => toast.error("เกิดข้อผิดพลาด"),
  });

  const deleteMutation = trpc.clients.delete.useMutation({
    onSuccess: () => {
      toast.success("ลบลูกค้าสำเร็จ");
      utils.clients.list.invalidate();
      setDeleteId(null);
    },
    onError: () => toast.error("เกิดข้อผิดพลาด"),
  });

  const filtered = clients?.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (client: (typeof filtered)[0]) => {
    setEditId(client.id);
    setForm({
      name: client.name,
      phone: client.phone ?? "",
      email: client.email ?? "",
      address: client.address ?? "",
      idCard: client.idCard ?? "",
      notes: client.notes ?? "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error("กรุณากรอกชื่อลูกค้า");
      return;
    }
    if (editId) {
      updateMutation.mutate({ id: editId, ...form });
    } else {
      createMutation.mutate(form);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <AdminLayout>
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground">ลูกค้า</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              ทั้งหมด {clients?.length ?? 0} ราย
            </p>
          </div>
          <Button onClick={openCreate} className="gold-gradient text-white border-0 shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มลูกค้า
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ค้นหาชื่อ, เบอร์โทร, อีเมล..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
          {isLoading ? (
            <div className="p-8 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <User className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
              <p className="text-muted-foreground text-sm">
                {search ? "ไม่พบลูกค้าที่ค้นหา" : "ยังไม่มีลูกค้า"}
              </p>
              {!search && (
                <Button onClick={openCreate} variant="outline" size="sm" className="mt-4">
                  เพิ่มลูกค้าคนแรก
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-5 py-3.5 font-semibold text-foreground/70 text-xs uppercase tracking-wide">
                      ชื่อ
                    </th>
                    <th className="text-left px-5 py-3.5 font-semibold text-foreground/70 text-xs uppercase tracking-wide">
                      ติดต่อ
                    </th>
                    <th className="text-left px-5 py-3.5 font-semibold text-foreground/70 text-xs uppercase tracking-wide hidden md:table-cell">
                      เลขบัตร
                    </th>
                    <th className="text-left px-5 py-3.5 font-semibold text-foreground/70 text-xs uppercase tracking-wide hidden lg:table-cell">
                      สถานะ
                    </th>
                    <th className="text-left px-5 py-3.5 font-semibold text-foreground/70 text-xs uppercase tracking-wide">
                      วันที่เพิ่ม
                    </th>
                    <th className="px-5 py-3.5 w-20" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((client) => (
                    <tr key={client.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-primary">
                              {client.name.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium text-foreground">{client.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="space-y-0.5">
                          {client.phone && (
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              <span className="text-xs">{client.phone}</span>
                            </div>
                          )}
                          {client.email && (
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Mail className="w-3 h-3" />
                              <span className="text-xs">{client.email}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground hidden md:table-cell">
                        {client.idCard ?? "—"}
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            client.status === "active"
                              ? "bg-green-50 text-green-700"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {client.status === "active" ? "ใช้งาน" : "ไม่ใช้งาน"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground text-xs">
                        {new Date(client.createdAt).toLocaleDateString("th-TH")}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEdit(client)}
                            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteId(client.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-600"
                          >
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
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {editId ? "แก้ไขข้อมูลลูกค้า" : "เพิ่มลูกค้าใหม่"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                ชื่อ – นามสกุล <span className="text-destructive">*</span>
              </label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="กรอกชื่อลูกค้า"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1.5 block">เบอร์โทร</label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="0XX-XXX-XXXX"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">เลขบัตรประชาชน</label>
                <Input
                  value={form.idCard}
                  onChange={(e) => setForm({ ...form, idCard: e.target.value })}
                  placeholder="X-XXXX-XXXXX-XX-X"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">อีเมล</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="example@email.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">ที่อยู่</label>
              <Textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="กรอกที่อยู่"
                rows={2}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">หมายเหตุ</label>
              <Textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="บันทึกเพิ่มเติม"
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
              {isPending ? "กำลังบันทึก..." : editId ? "บันทึกการแก้ไข" : "เพิ่มลูกค้า"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
            <AlertDialogDescription>
              คุณต้องการลบลูกค้ารายนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
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

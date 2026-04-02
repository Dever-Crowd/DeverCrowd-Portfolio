"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Edit, Trash2, Search, Mail, Shield, User } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { cn } from "@/lib/utils";

const roleBadge = (role) => {
  const r = role.toLowerCase();
  if (r === "super admin")
    return "border-destructive/30 bg-destructive/10 text-destructive dark:text-red-400";
  if (r === "admin") return "border-primary/30 bg-primary/10 text-primary";
  if (r === "editor") return "border-secondary/40 bg-secondary/15 text-secondary-foreground";
  return "border-border bg-muted text-muted-foreground";
};

export default function AdminAdminsPage() {
  const [admins, setAdmins] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@devercrowd.com",
      role: "Super Admin",
      status: "active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@devercrowd.com",
      role: "Admin",
      status: "active",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@devercrowd.com",
      role: "Editor",
      status: "inactive",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [editingAdmin, setEditingAdmin] = useState(null);

  const handleDelete = (id) => {
    setAdmins((prev) => prev.filter((admin) => admin.id !== id));
    toast.success("Admin removed (demo data)");
  };

  const handleSave = () => {
    if (!editingAdmin?.name?.trim() || !editingAdmin?.email?.trim()) {
      toast.error("Name and email are required");
      return;
    }
    const isNew = editingAdmin.id === 0;
    if (isNew) {
      setAdmins((prev) => [{ ...editingAdmin, id: Date.now(), status: editingAdmin.status || "active" }, ...prev]);
      toast.success("Admin added (local demo)");
    } else {
      setAdmins((prev) => prev.map((a) => (a.id === editingAdmin.id ? { ...editingAdmin } : a)));
      toast.success("Admin updated (local demo)");
    }
    setEditingAdmin(null);
  };

  const toggleStatus = (id) => {
    setAdmins((prev) =>
      prev.map((admin) =>
        admin.id === id
          ? { ...admin, status: admin.status === "active" ? "inactive" : "active" }
          : admin
      )
    );
    toast.message("Status toggled (demo)");
  };

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openNew = () =>
    setEditingAdmin({
      id: 0,
      name: "",
      email: "",
      role: "Editor",
      status: "active",
    });

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <AdminPageHeader
        title="Admins"
        description="Manage administrator accounts. Connect this screen to your auth API when ready."
      >
        <Button type="button" className="gap-2" onClick={openNew}>
          <Plus className="h-4 w-4" />
          New admin
        </Button>
      </AdminPageHeader>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or role…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editingAdmin} onOpenChange={(o) => !o && setEditingAdmin(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingAdmin?.id === 0 ? "New admin" : "Edit admin"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="admin-name">Full name</Label>
              <Input
                id="admin-name"
                value={editingAdmin?.name || ""}
                onChange={(e) => setEditingAdmin((p) => ({ ...p, name: e.target.value }))}
                placeholder="Jane Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                value={editingAdmin?.email || ""}
                onChange={(e) => setEditingAdmin((p) => ({ ...p, email: e.target.value }))}
                placeholder="jane@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={editingAdmin?.role || "Editor"}
                onValueChange={(v) => setEditingAdmin((p) => ({ ...p, role: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Editor">Editor</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Super Admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" type="button" onClick={() => setEditingAdmin(null)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSave}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredAdmins.map((admin) => (
          <Card key={admin.id} className="border-border shadow-sm transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border border-border">
                  <AvatarImage src={admin.avatar} alt="" />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {admin.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <CardTitle className="truncate text-lg">{admin.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 truncate text-sm">
                    <Mail className="h-3 w-3 shrink-0" />
                    {admin.email}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={cn("font-normal", roleBadge(admin.role))}>
                  <Shield className="mr-1 h-3 w-3" />
                  {admin.role}
                </Badge>
                <Badge variant={admin.status === "active" ? "default" : "secondary"}>{admin.status}</Badge>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="gap-1" onClick={() => setEditingAdmin(admin)}>
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="gap-1" onClick={() => toggleStatus(admin.id)}>
                  <User className="h-4 w-4" />
                  {admin.status === "active" ? "Deactivate" : "Activate"}
                </Button>
                <Button variant="outline" size="sm" className="gap-1 text-destructive" onClick={() => handleDelete(admin.id)}>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminLoader } from "@/components/admin/AdminLoader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=12");
        const data = await response.json();
        if (!cancelled) setServices(data);
      } catch {
        if (!cancelled) toast.error("Could not load services (demo API)");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, { method: "DELETE" });
      setServices((prev) => prev.filter((s) => s.id !== id));
      toast.success("Removed (demo)");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleSave = async () => {
    if (!editingService?.title?.trim()) {
      toast.error("Title is required");
      return;
    }
    try {
      const isNew = !editingService.id;
      const method = isNew ? "POST" : "PUT";
      const url = isNew
        ? "https://jsonplaceholder.typicode.com/posts"
        : `https://jsonplaceholder.typicode.com/posts/${editingService.id}`;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingService.title,
          body: editingService.body || "",
          userId: editingService.userId || 1,
        }),
      });
      const data = await response.json();
      if (isNew) {
        setServices((prev) => [data, ...prev]);
        toast.success("Created (demo)");
      } else {
        setServices((prev) => prev.map((s) => (s.id === editingService.id ? data : s)));
        toast.success("Updated (demo)");
      }
      setEditingService(null);
    } catch {
      toast.error("Save failed");
    }
  };

  const filteredServices = services.filter(
    (service) =>
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <AdminLoader label="Loading services…" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <AdminPageHeader
        title="Services"
        description="Demo data from JSONPlaceholder. Replace with your CMS or API when ready."
      >
        <Button
          type="button"
          className="gap-2"
          onClick={() => setEditingService({ id: 0, title: "", body: "", userId: 1 })}
        >
          <Plus className="h-4 w-4" />
          New service
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
              placeholder="Search services…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editingService} onOpenChange={(o) => !o && setEditingService(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingService?.id ? "Edit service" : "New service"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={editingService?.title || ""}
                onChange={(e) => setEditingService((s) => ({ ...s, title: e.target.value }))}
                placeholder="Service name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                rows={6}
                value={editingService?.body || ""}
                onChange={(e) => setEditingService((s) => ({ ...s, body: e.target.value }))}
                placeholder="Describe what this service includes…"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" type="button" onClick={() => setEditingService(null)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSave}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {filteredServices.length === 0 ? (
        <AdminEmptyState title="No services" description="Try a different search or add a new entry." />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredServices.map((service) => (
            <Card key={service.id} className="border-border shadow-sm transition-shadow hover:shadow-md">
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="secondary">#{service.id}</Badge>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingService(service)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(service.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="line-clamp-2 leading-snug">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-4">{service.body}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { get, post, put, del } from "@/data/api";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminLoader } from "@/components/admin/AdminLoader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const emptyForm = () => ({
  title: "",
  slug: "",
  description: "",
  priceMonthly: "",
  currency: "USD",
  featuresText: "",
  highlighted: false,
  sortOrder: 0,
  isActive: true,
});

export default function AdminPricingPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm());

  const load = async () => {
    setLoading(true);
    const res = await get("/api/pricing/manage/all");
    setLoading(false);
    if (res.ok && res.data?.data?.plans) {
      setPlans(res.data.data.plans);
    } else {
      setPlans([]);
      if (!res.ok) toast.error(res.message || "Could not load pricing (sign in as CEO/CTO)");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (plan) => {
    setEditingId(plan._id);
    setForm({
      title: plan.title || "",
      slug: plan.slug || "",
      description: plan.description || "",
      priceMonthly: String(plan.priceMonthly ?? ""),
      currency: plan.currency || "USD",
      featuresText: (plan.features || []).join(", "),
      highlighted: !!plan.highlighted,
      sortOrder: plan.sortOrder ?? 0,
      isActive: plan.isActive !== false,
    });
    setDialogOpen(true);
  };

  const save = async () => {
    const features = form.featuresText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const body = {
      title: form.title.trim(),
      slug: form.slug.trim().toLowerCase().replace(/\s+/g, "-"),
      description: form.description.trim(),
      priceMonthly: Number(form.priceMonthly),
      currency: form.currency.trim() || "USD",
      features,
      highlighted: form.highlighted,
      sortOrder: Number(form.sortOrder) || 0,
      isActive: form.isActive,
    };
    if (!body.title || !body.slug || Number.isNaN(body.priceMonthly)) {
      toast.error("Title, slug, and valid price are required");
      return;
    }

    if (editingId) {
      const res = await put(`/api/pricing/manage/${editingId}`, body);
      if (res.ok) {
        toast.success("Plan updated");
        setDialogOpen(false);
        load();
      } else toast.error(res.message || "Update failed");
    } else {
      const res = await post("/api/pricing/manage", body);
      if (res.ok) {
        toast.success("Plan created");
        setDialogOpen(false);
        load();
      } else toast.error(res.message || "Create failed");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this plan?")) return;
    const res = await del(`/api/pricing/manage/${id}`);
    if (res.ok) {
      toast.success("Plan deleted");
      load();
    } else toast.error("Delete failed");
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <AdminLoader label="Loading pricing…" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <AdminPageHeader
        title="Pricing"
        description="Manage plans shown on the public Pricing page. Requires CEO or CTO role."
      >
        <Button type="button" className="gap-2" onClick={openNew}>
          <Plus className="h-4 w-4" />
          New plan
        </Button>
      </AdminPageHeader>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit plan" : "New plan"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pt">Title</Label>
                <Input
                  id="pt"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ps">Slug</Label>
                <Input
                  id="ps"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="starter"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pd">Description</Label>
              <Textarea
                id="pd"
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="pp">Price / mo</Label>
                <Input
                  id="pp"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.priceMonthly}
                  onChange={(e) => setForm((f) => ({ ...f, priceMonthly: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pc">Currency</Label>
                <Input
                  id="pc"
                  value={form.currency}
                  onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pso">Sort</Label>
                <Input
                  id="pso"
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pf">Features (comma separated)</Label>
              <Textarea
                id="pf"
                rows={3}
                value={form.featuresText}
                onChange={(e) => setForm((f) => ({ ...f, featuresText: e.target.value }))}
                placeholder="Feature one, Feature two"
              />
            </div>
            <div className="flex flex-wrap gap-6">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.highlighted}
                  onChange={(e) => setForm((f) => ({ ...f, highlighted: e.target.checked }))}
                  className="rounded border-border"
                />
                Highlighted
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="rounded border-border"
                />
                Active (visible on site)
              </label>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={save}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {plans.length === 0 ? (
        <AdminEmptyState title="No plans yet" description="Create a plan or seed the database." />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan._id}
              className={cn(
                "border-border shadow-sm transition-shadow hover:shadow-md",
                plan.highlighted && "ring-1 ring-primary/40"
              )}
            >
              <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {plan.title}
                    {plan.highlighted ? <Star className="h-4 w-4 fill-primary text-primary" /> : null}
                  </CardTitle>
                  <CardDescription className="font-mono text-xs">{plan.slug}</CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(plan)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => remove(plan._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-2xl font-semibold text-foreground">
                  {plan.currency} {plan.priceMonthly}
                  <span className="text-sm font-normal text-muted-foreground">/mo</span>
                </p>
                <p className="text-sm text-muted-foreground line-clamp-3">{plan.description}</p>
                <ul className="list-inside list-disc text-sm text-muted-foreground">
                  {(plan.features || []).slice(0, 4).map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={plan.isActive ? "default" : "secondary"}>{plan.isActive ? "Active" : "Hidden"}</Badge>
                  <Badge variant="outline">Order {plan.sortOrder}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

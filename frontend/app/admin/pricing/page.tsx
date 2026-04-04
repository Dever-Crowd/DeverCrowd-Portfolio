"use client";

import { useState } from "react";
import {
  useAdminPricingPlans,
  useCreatePricingPlan,
  useUpdatePricingPlan,
  useDeletePricingPlan,
  CreatePlanBody,
  PricingFormData,
  PricingPlan,
} from "@/hooks/usePricing";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminLoader } from "@/components/admin/AdminLoader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { Plus, Pencil, Trash2, Star, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from "@/components/ui/select";

// ─── Helpers ───────────────────────────────────────────────────────────────────
const emptyForm = (): PricingFormData => ({
  title: "",
  slug: "",
  description: "",
  originalPrice: 0,
  discountPercent: 0,
  currency: "USD",
  featuresText: "",
  highlighted: false,
  sortOrder: 0,
  isActive: true,
  billingCycle: "monthly",
});

function slugify(str: string): string {
  return str.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function formToBody(form: PricingFormData): CreatePlanBody {
  return {
    title: form.title.trim(),
    slug: slugify(form.slug || form.title),
    description: form.description.trim(),
    originalPrice: Number(form.originalPrice),
    currency: form.currency.trim() || "USD",
    features: form.featuresText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    highlighted: form.highlighted,
    sortOrder: Number(form.sortOrder) || 0,
    isActive: form.isActive,
    billingCycle: form.billingCycle,
    discountPercent: form.discountPercent || 0

  };
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function AdminPricingPage() {
  const { data: plans = [], isLoading, isError, error } = useAdminPricingPlans();
  const createMutation = useCreatePricingPlan();
  const updateMutation = useUpdatePricingPlan();
  const deleteMutation = useDeletePricingPlan();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PricingFormData>(emptyForm());

  const isSaving = createMutation.isPending || updateMutation.isPending;

  // ─── Dialog handlers ─────────────────────────────────────────────────────────
  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (plan: PricingPlan) => {
    setEditingId(plan._id);
    setForm({
      title: plan.title || "",
      slug: plan.slug || "",
      description: plan.description || "",
      originalPrice: plan.originalPrice ?? 0,
      currency: plan.currency || "USD",
      featuresText: (plan.features || []).join(", "),
      highlighted: !!plan.highlighted,
      sortOrder: plan.sortOrder ?? 0,
      isActive: plan.isActive !== false,
      billingCycle: plan.billingCycle || "monthly",
      discountPercent: plan.discountPercent || 0
    });
    setDialogOpen(true);
  };

  const confirmDelete = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  // ─── Save ─────────────────────────────────────────────────────────────────────
  const save = async () => {
    const body = formToBody(form);

    if (!body.title || !body.slug || Number.isNaN(body.originalPrice)) {
      return; // shadcn form validation handles messaging
    }

    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, body });
    } else {
      await createMutation.mutateAsync(body);
    }

    setDialogOpen(false);
  };

  // ─── Delete ───────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deletingId) return;
    await deleteMutation.mutateAsync(deletingId);
    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  // ─── Loading & Error states ───────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <AdminLoader label="Loading pricing…" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{(error as Error)?.message || "Failed to load pricing plans"}</span>
        </div>
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────────
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

      {/* ── Plan Form Dialog ─────────────────────────────────────────────────── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit plan" : "New plan"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {/* Title + Slug */}
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pt">Title *</Label>
                <Input
                  id="pt"
                  value={form.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setForm((f) => ({
                      ...f,
                      title,
                      // Auto-generate slug only if user hasn't manually changed it
                      slug: f.slug === slugify(f.title) || f.slug === ""
                        ? slugify(title)
                        : f.slug,
                    }));
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ps">Slug *</Label>
                <Input
                  id="ps"
                  value={form.slug}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, slug: slugify(e.target.value) }))
                  }
                  placeholder="starter"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="pd">Description</Label>
              <Textarea
                id="pd"
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>

            {/* Price + Currency + Sort */}
            <div className="grid gap-2 sm:grid-cols-3">
              {/* Original Price + Discount */}
              <div className="space-y-2">
                <Label htmlFor="op">Price</Label>
                <Input
                  id="op"
                  type="number"
                  min={0}
                  placeholder="e.g. 1999"
                  value={form.originalPrice}
                  onChange={(e) => setForm((f) => ({ ...f, originalPrice: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dp">Discount %</Label>
                <Input
                  id="dp"
                  type="number"
                  min={0}
                  max={100}
                  placeholder="e.g. 20"
                  value={form.discountPercent}
                  onChange={(e) => setForm((f) => ({ ...f, discountPercent: Number(e.target.value) }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Cycle</Label>
                <Select
                  value={form.billingCycle}
                  onValueChange={(v: "monthly" | "yearly" | "one-time") =>
                    setForm((f) => ({ ...f, billingCycle: v }))
                  }
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="one-time">One-time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pc">Currency</Label>
                <Input
                  id="pc"
                  value={form.currency}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, currency: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pso">Sort order</Label>
                <Input
                  id="pso"
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))
                  }
                />
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2">
              <Label htmlFor="pf">Features (comma separated)</Label>
              <Textarea
                id="pf"
                rows={3}
                value={form.featuresText}
                onChange={(e) =>
                  setForm((f) => ({ ...f, featuresText: e.target.value }))
                }
                placeholder="Feature one, Feature two, Feature three"
              />
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap gap-6">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.highlighted}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, highlighted: e.target.checked }))
                  }
                  className="rounded border-border"
                />
                Highlighted
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isActive: e.target.checked }))
                  }
                  className="rounded border-border"
                />
                Active (visible on site)
              </label>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="button" onClick={save} disabled={isSaving}>
              {isSaving ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation Dialog ───────────────────────────────────────── */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this plan?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The plan will be permanently removed
              from the database and the public pricing page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Plans Grid ───────────────────────────────────────────────────────── */}
      {plans.length === 0 ? (
        <AdminEmptyState
          title="No plans yet"
          description="Create your first pricing plan to display it on the public site."
        />
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
                    {plan.highlighted && (
                      <Star className="h-4 w-4 fill-primary text-primary" />
                    )}
                  </CardTitle>
                  <CardDescription className="font-mono text-xs">
                    {plan.slug}
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEdit(plan)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => confirmDelete(plan._id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {plan.discountPercent ? (
                  <p className="text-2xl font-semibold text-foreground">
                    {plan.currency} {plan.realPrice}
                    <span className="text-sm text-muted-foreground line-through mb-1">
                      {plan.originalPrice}
                    </span>
                    <span className="text-sm font-normal text-muted-foreground">
                      {plan.billingCycle === "monthly" && "/mo"}
                      {plan.billingCycle === "yearly" && "/yr"}
                      {plan.billingCycle === "one-time" && " one-time"}
                    </span>
                  </p>
                ) : (
                  <p className="text-2xl font-semibold text-foreground">
                    {plan.currency} {plan.originalPrice}
                    <span className="text-sm font-normal text-muted-foreground">
                      {plan.billingCycle === "monthly" && "/mo"}
                      {plan.billingCycle === "yearly" && "/yr"}
                      {plan.billingCycle === "one-time" && " one-time"}
                    </span>
                  </p>
                )}
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {plan.description}
                </p>
                <ul className="list-inside list-disc text-sm text-muted-foreground">
                  {(plan.features || []).slice(0, 4).map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={plan.isActive ? "default" : "secondary"}>
                    {plan.isActive ? "Active" : "Hidden"}
                  </Badge>
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
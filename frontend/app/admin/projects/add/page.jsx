"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { post } from "@/data/api";
import { getAdminSelectStyles } from "@/lib/admin-react-select";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Loader2 } from "lucide-react";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "in progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "completed", label: "Completed" },
];

const selectStyles = getAdminSelectStyles();

export default function AdminAddProjectPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    pic: null,
    timeToFinish: "",
    client: "",
    status: "pending",
    cost: "",
    timeSpend: "",
    category: "",
    scope: [],
    stack: [],
    industry: [],
    live: "",
    github: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "pic") {
      setForm((prev) => ({ ...prev, pic: files?.[0] || null }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (field, value) => {
    const arr = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    setForm((prev) => ({ ...prev, [field]: arr }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title || form.title.length < 3 || form.title.length > 100)
      errs.title = "Title must be 3–100 characters";
    if (!form.description || form.description.length < 10)
      errs.description = "Description must be at least 10 characters";
    if (!form.timeToFinish || form.timeToFinish.length < 2 || form.timeToFinish.length > 50)
      errs.timeToFinish = "Time to finish must be 2–50 characters";
    if (!form.client || form.client.length < 2 || form.client.length > 50 || !/^[a-zA-Z0-9\s]+$/.test(form.client))
      errs.client = "Client must be 2–50 alphanumeric characters";
    if (!["pending", "in progress", "review", "completed"].includes(form.status)) errs.status = "Invalid status";
    if (!form.pic) errs.pic = "Image is required";
    if (!form.category || form.category.length < 2 || form.category.length > 50 || !/^[a-zA-Z0-9\s]+$/.test(form.category))
      errs.category = "Invalid category";
    if (!form.cost || Number.isNaN(Number(form.cost))) errs.cost = "Cost must be a number";
    if (!form.timeSpend) errs.timeSpend = "Time spent is required";
    if (form.scope.length === 0) errs.scope = "Add at least one scope item";
    if (form.stack.length === 0) errs.stack = "Add at least one stack item";
    if (form.industry.length === 0) errs.industry = "Add at least one industry";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("pic", form.pic);
      formData.append("timeToFinish", form.timeToFinish);
      formData.append("client", form.client);
      formData.append("status", form.status);
      formData.append("cost", form.cost);
      formData.append("timeSpend", form.timeSpend);
      formData.append("category", form.category);
      formData.append("live", form.live);
      formData.append("github", form.github);
      form.scope.forEach((item) => formData.append("scope[]", item));
      form.stack.forEach((item) => formData.append("stack[]", item));
      form.industry.forEach((item) => formData.append("industry[]", item));

      const res = await post("/api/projects", formData);
      if (res.ok) {
        toast.success("Project created");
        router.push("/admin/projects");
      } else {
        toast.error(res.message || res.data?.message || "Could not create project");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass = "space-y-2";

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <AdminPageHeader
        title="New project"
        description="Upload a cover image and fill project details. Submits as multipart/form-data to POST /api/projects."
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Basics</CardTitle>
            <CardDescription>Title, client, and categorization</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className={fieldClass}>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={form.title} onChange={handleChange} />
              {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            </div>
            <div className={fieldClass}>
              <Label htmlFor="client">Client</Label>
              <Input id="client" name="client" value={form.client} onChange={handleChange} />
              {errors.client && <p className="text-sm text-destructive">{errors.client}</p>}
            </div>
            <div className={fieldClass}>
              <Label htmlFor="category">Category</Label>
              <Input id="category" name="category" value={form.category} onChange={handleChange} />
              {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
            </div>
            <div className={fieldClass}>
              <Label htmlFor="timeToFinish">Time to finish</Label>
              <Input id="timeToFinish" name="timeToFinish" value={form.timeToFinish} onChange={handleChange} />
              {errors.timeToFinish && <p className="text-sm text-destructive">{errors.timeToFinish}</p>}
            </div>
            <div className={fieldClass}>
              <Label htmlFor="cost">Cost</Label>
              <Input id="cost" name="cost" type="number" value={form.cost} onChange={handleChange} min={0} step="0.01" />
              {errors.cost && <p className="text-sm text-destructive">{errors.cost}</p>}
            </div>
            <div className={fieldClass}>
              <Label htmlFor="timeSpend">Time spent</Label>
              <Input id="timeSpend" name="timeSpend" value={form.timeSpend} onChange={handleChange} />
              {errors.timeSpend && <p className="text-sm text-destructive">{errors.timeSpend}</p>}
            </div>
            <div className={fieldClass}>
              <Label>Status</Label>
              <Select
                instanceId="project-status"
                styles={selectStyles}
                menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                menuPosition="fixed"
                options={statusOptions}
                value={statusOptions.find((o) => o.value === form.status)}
                onChange={(opt) => setForm((prev) => ({ ...prev, status: opt.value }))}
              />
              {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Tags & links</CardTitle>
            <CardDescription>Comma-separated lists and URLs</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className={fieldClass}>
              <Label htmlFor="scope">Scope</Label>
              <Input
                id="scope"
                name="scope"
                value={form.scope.join(", ")}
                onChange={(e) => handleArrayChange("scope", e.target.value)}
                placeholder="Design, Development"
              />
              {errors.scope && <p className="text-sm text-destructive">{errors.scope}</p>}
            </div>
            <div className={fieldClass}>
              <Label htmlFor="stack">Stack</Label>
              <Input
                id="stack"
                name="stack"
                value={form.stack.join(", ")}
                onChange={(e) => handleArrayChange("stack", e.target.value)}
                placeholder="Next.js, Node"
              />
              {errors.stack && <p className="text-sm text-destructive">{errors.stack}</p>}
            </div>
            <div className={fieldClass}>
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                name="industry"
                value={form.industry.join(", ")}
                onChange={(e) => handleArrayChange("industry", e.target.value)}
                placeholder="SaaS, Retail"
              />
              {errors.industry && <p className="text-sm text-destructive">{errors.industry}</p>}
            </div>
            <div className={fieldClass}>
              <Label htmlFor="live">Live URL</Label>
              <Input id="live" name="live" type="url" value={form.live} onChange={handleChange} placeholder="https://" />
            </div>
            <div className={fieldClass}>
              <Label htmlFor="github">GitHub URL</Label>
              <Input id="github" name="github" type="url" value={form.github} onChange={handleChange} placeholder="https://" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Content & media</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className={fieldClass}>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={8}
                value={form.description}
                onChange={handleChange}
                className="min-h-[200px] resize-y"
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>
            <div className={fieldClass}>
              <Label htmlFor="pic">Cover image</Label>
              <Input id="pic" name="pic" type="file" accept="image/*" onChange={handleChange} />
              {errors.pic && <p className="text-sm text-destructive">{errors.pic}</p>}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting} className="min-w-[140px] gap-2">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {submitting ? "Saving…" : "Create project"}
          </Button>
        </div>
      </form>
    </div>
  );
}

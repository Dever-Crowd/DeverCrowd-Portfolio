"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Select from "react-select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { get, put } from "@/data/api";
import { getAdminSelectStyles } from "@/lib/admin-react-select";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminLoader } from "@/components/admin/AdminLoader";
import { Loader2 } from "lucide-react";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "in progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "completed", label: "Completed" },
];

const selectStyles = getAdminSelectStyles();

export default function AdminEditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [project, setProject] = useState(null);
  const [loadError, setLoadError] = useState(null);
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

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await get(`/api/projects/${id}`);
        if (cancelled) return;
        if (!res.ok || !res.data?.data?.project) {
          setLoadError("Project not found");
          return;
        }
        const proj = res.data.data.project;
        setProject(proj);
        const toArr = (v) => (Array.isArray(v) ? v.map((x) => (typeof x === "string" ? x : x?.name)).filter(Boolean) : []);
        setForm({
          title: proj.title || "",
          description: proj.description || "",
          pic: null,
          timeToFinish: proj.timeToFinish || "",
          client: proj.client || "",
          status: proj.status || "pending",
          cost: proj.cost != null ? String(proj.cost) : "",
          timeSpend: proj.timeSpend || "",
          category: proj.category || "",
          scope: toArr(proj.scope),
          stack: toArr(proj.stack),
          industry: toArr(proj.industry),
          live: proj.live || "",
          github: proj.github || "",
        });
      } catch {
        if (!cancelled) setLoadError("Failed to load project");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

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
    if (!form.timeToFinish || form.timeToFinish.length < 2) errs.timeToFinish = "Time to finish required";
    if (!form.client || form.client.length < 2) errs.client = "Client required";
    if (!["pending", "in progress", "review", "completed"].includes(form.status)) errs.status = "Invalid status";
    if (!form.category || form.category.length < 2) errs.category = "Invalid category";
    if (!form.cost || Number.isNaN(Number(form.cost))) errs.cost = "Cost must be a number";
    if (!form.timeSpend) errs.timeSpend = "Time spent is required";
    if ((form.scope || []).length === 0) errs.scope = "Scope is required";
    if ((form.stack || []).length === 0) errs.stack = "Stack is required";
    if ((form.industry || []).length === 0) errs.industry = "Industry is required";
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
      if (form.pic) formData.append("pic", form.pic);
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

      const res = await put(`/api/projects/${id}`, formData);
      if (res.ok) {
        toast.success("Project updated");
        router.push("/admin/projects");
      } else {
        toast.error(res.message || res.data?.message || "Update failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (!project && !loadError) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <AdminLoader label="Loading project…" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <AdminPageHeader title="Project" description={loadError} />
        <Button variant="outline" onClick={() => router.push("/admin/projects")}>
          Back to projects
        </Button>
      </div>
    );
  }

  const remotePic = project.pic && /^https?:\/\//.test(project.pic);
  const fieldClass = "space-y-2";

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <AdminPageHeader
        title="Edit project"
        description="Update details and optionally replace the cover image."
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Basics</CardTitle>
            <CardDescription>Title, client, and categorization</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              { label: "Title", name: "title" },
              { label: "Client", name: "client" },
              { label: "Category", name: "category" },
              { label: "Time to finish", name: "timeToFinish" },
              { label: "Cost", name: "cost", type: "number" },
              { label: "Time spent", name: "timeSpend" },
            ].map(({ label, name, type = "text" }) => (
              <div key={name} className={fieldClass}>
                <Label htmlFor={name}>{label}</Label>
                <Input id={name} name={name} value={form[name]} onChange={handleChange} type={type} />
                {errors[name] && <p className="text-sm text-destructive">{errors[name]}</p>}
              </div>
            ))}
            <div className={fieldClass}>
              <Label>Status</Label>
              <Select
                instanceId="edit-project-status"
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
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {["scope", "stack", "industry"].map((name) => (
              <div key={name} className={fieldClass}>
                <Label htmlFor={name}>{name.charAt(0).toUpperCase() + name.slice(1)} (comma separated)</Label>
                <Input
                  id={name}
                  name={name}
                  value={(form[name] || []).join(", ")}
                  onChange={(e) => handleArrayChange(name, e.target.value)}
                />
                {errors[name] && <p className="text-sm text-destructive">{errors[name]}</p>}
              </div>
            ))}
            <div className={fieldClass}>
              <Label htmlFor="live">Live URL</Label>
              <Input id="live" name="live" type="url" value={form.live} onChange={handleChange} />
            </div>
            <div className={fieldClass}>
              <Label htmlFor="github">GitHub URL</Label>
              <Input id="github" name="github" type="url" value={form.github} onChange={handleChange} />
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
              {project.pic && !form.pic && (
                <div className="relative mb-3 h-40 w-full max-w-xs overflow-hidden rounded-lg border border-border bg-muted">
                  <Image
                    src={project.pic}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized={remotePic}
                    sizes="200px"
                  />
                </div>
              )}
              <Input id="pic" name="pic" type="file" accept="image/*" onChange={handleChange} />
              <p className="text-xs text-muted-foreground">Leave empty to keep the current image.</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting} className="min-w-[140px] gap-2">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {submitting ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}

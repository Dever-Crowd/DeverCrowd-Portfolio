"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { del, get } from "@/data/api";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminLoader } from "@/components/admin/AdminLoader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { cn } from "@/lib/utils";
import { mediaUrl } from "@/lib/mediaUrl";

function statusBadgeClass(status) {
  const s = (status || "").toLowerCase();
  if (s === "completed") return "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
  if (s === "in progress" || s === "in_progress")
    return "border-primary/30 bg-primary/10 text-primary";
  if (s === "review") return "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-400";
  return "border-border bg-muted text-muted-foreground";
}

function ProjectCover({ src, title }) {
  const url = mediaUrl(src);
  const remote = typeof url === "string" && /^https?:\/\//.test(url);
  return (
    <div className="relative h-44 w-full overflow-hidden rounded-t-xl bg-muted">
      {src ? (
        <Image
          src={url}
          alt={title || "Project"}
          fill
          className="object-cover transition duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 400px"
          unoptimized={remote}
        />
      ) : (
        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">No image</div>
      )}
    </div>
  );
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await get("/api/projects");
        if (cancelled) return;
        if (res.ok && res.data?.data?.projects) {
          setProjects(res.data.data.projects);
          setError(null);
        } else {
          setProjects([]);
          setError(res.message || "Could not load projects.");
          toast.error("Could not load projects");
        }
      } catch {
        if (!cancelled) {
          setError("Network error");
          toast.error("Failed to load projects");
        }
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
      const res = await del(`/api/projects/${id}`);
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p._id !== id));
        toast.success("Project deleted");
      } else {
        toast.error(res.data?.message || "Delete failed");
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  const filtered = projects.filter(
    (p) =>
      (p.title?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (p.description?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (p.client?.toLowerCase() || "").includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <AdminLoader label="Loading projects…" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <AdminPageHeader
        title="Projects"
        description="Create, edit, and organize client work. Data loads from your API."
      >
        <Button asChild className="gap-2">
          <Link href="/admin/projects/add">
            <Plus className="h-4 w-4" />
            New project
          </Link>
        </Button>
      </AdminPageHeader>

      {error && projects.length === 0 ? (
        <AdminEmptyState
          title="No projects loaded"
          description={error}
          icon={Search}
        />
      ) : null}

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title, description, client…"
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search projects"
            />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filtered.length}</span> of{" "}
            <span className="font-medium text-foreground">{projects.length}</span> projects
          </p>
        </CardContent>
      </Card>

      {filtered.length === 0 && !error ? (
        <AdminEmptyState
          title={search.trim() ? "No projects match" : "No projects yet"}
          description={
            search.trim()
              ? "Try a different search or clear the filter."
              : "Create your first project to see it listed here."
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project) => (
            <Card
              key={project._id}
              className="group overflow-hidden border-border shadow-sm transition-shadow hover:shadow-md"
            >
              <CardHeader className="p-0">
                <ProjectCover src={project.pic} title={project.title} />
              </CardHeader>
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="outline" className={cn("font-normal", statusBadgeClass(project.status))}>
                    {project.status || "—"}
                  </Badge>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="Edit project">
                      <Link href={`/admin/projects/${project._id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      title="Delete project"
                      onClick={() => handleDelete(project._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="line-clamp-2 text-lg leading-snug">{project.title}</CardTitle>
                <p className="line-clamp-3 text-sm text-muted-foreground">{project.description}</p>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground/80">Client:</span> {project.client || "—"} ·{" "}
                  <span className="font-medium text-foreground/80">Category:</span> {project.category || "—"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

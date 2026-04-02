"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Plus, Edit, Trash2, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminLoader } from "@/components/admin/AdminLoader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";

function BlogsAdminContent() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPost, setEditingPost] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const limit = 6;
  const currentPage = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        const data = await response.json();
        if (!cancelled) setPosts(data);
      } catch {
        if (!cancelled) toast.error("Could not load posts");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const handleDelete = async (id) => {
    try {
      await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, { method: "DELETE" });
      setPosts((prev) => prev.filter((post) => post.id !== id));
      toast.success("Post deleted (demo)");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleSave = async () => {
    if (!editingPost?.title?.trim()) {
      toast.error("Title is required");
      return;
    }
    try {
      const isNew = !editingPost.id;
      const method = editingPost.id ? "PUT" : "POST";
      const url = editingPost.id
        ? `https://jsonplaceholder.typicode.com/posts/${editingPost.id}`
        : "https://jsonplaceholder.typicode.com/posts";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingPost.title,
          body: editingPost.body || "",
          userId: editingPost.userId || 1,
        }),
      });
      const data = await response.json();
      if (editingPost.id) {
        setPosts((prev) => prev.map((p) => (p.id === editingPost.id ? data : p)));
        toast.success("Post updated (demo)");
      } else {
        setPosts((prev) => [data, ...prev]);
        toast.success("Post created (demo)");
      }
      setEditingPost(null);
    } catch {
      toast.error("Save failed");
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / limit));
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * limit, currentPage * limit);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <AdminLoader label="Loading blog posts…" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <AdminPageHeader
        title="Blog"
        description="Demo CRUD against JSONPlaceholder. Swap URLs for your real blog API."
      >
        <Button
          type="button"
          className="gap-2"
          onClick={() => setEditingPost({ id: 0, title: "", body: "", userId: 1 })}
        >
          <Plus className="h-4 w-4" />
          New post
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
              placeholder="Search posts…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editingPost} onOpenChange={(open) => !open && setEditingPost(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingPost?.id ? "Edit post" : "New post"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="post-title">Title</Label>
              <Input
                id="post-title"
                value={editingPost?.title || ""}
                onChange={(e) => setEditingPost((p) => ({ ...p, title: e.target.value }))}
                placeholder="Post title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="post-body">Body</Label>
              <Textarea
                id="post-body"
                rows={10}
                value={editingPost?.body || ""}
                onChange={(e) => setEditingPost((p) => ({ ...p, body: e.target.value }))}
                placeholder="Write your content…"
                className="min-h-[200px] resize-y"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" type="button" onClick={() => setEditingPost(null)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSave}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {paginatedPosts.length === 0 ? (
        <AdminEmptyState title="No posts" description="Adjust search or create a new post." />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {paginatedPosts.map((post) => (
            <Card key={post.id} className="border-border shadow-sm transition-shadow hover:shadow-md">
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="secondary">#{post.id}</Badge>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingPost(post)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(post.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="line-clamp-2 text-lg leading-snug">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-4">{post.body}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredPosts.length > limit && (
        <div className="flex flex-wrap items-center justify-center gap-4 border-t border-border pt-6">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => router.push(`?page=${currentPage - 1}`)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={currentPage >= totalPages}
            onClick={() => router.push(`?page=${currentPage + 1}`)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="p-4 sm:p-6 lg:p-8">
          <AdminLoader />
        </div>
      }
    >
      <BlogsAdminContent />
    </Suspense>
  );
}

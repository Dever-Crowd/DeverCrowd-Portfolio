"use client";

import { useQuery } from "@tanstack/react-query";
import { get } from "@/data/api";
import { Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ─── Public Blogs Hook ─────────────────────────────
export function usePublicBlogs() {
  return useQuery({
    queryKey: ["blogs", "public"],
    queryFn: async () => {
      const res = await get("/api/blogs");
      if (!res.ok) throw new Error(res.message || "Could not load blogs");
      return res.data?.blogs ?? [];
    },
    staleTime: 1000 * 60 * 5,
  });
}

// ─── Single Blog Card ──────────────────────────────
function BlogCard({ blog }) {
  return (
    <Link
      href={`/blogs/${blog.slug}`}
      className="group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      <div className="p-6 flex flex-col flex-1">
        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {blog.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-primary/10 text-primary  text-xs rounded-full font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">
          {blog.title}
        </h3>

        {/* Description */}
        {blog.body && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {blog.body}
          </p>
        )}

        {/* Author & Date */}
        <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {blog.writer_name ? `By ${blog.writer_name}` : "Admin"}
          </span>
          {blog.updatedAt && (
            <span>{new Date(blog.updatedAt).toLocaleDateString()}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── Blogs Page ───────────────────────────────────
export default function BlogsPage() {
  const { data: blogs = [], isLoading, isError } = usePublicBlogs();
  const publishedBlogs = blogs.filter(blog => blog.status !== "draft");
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-14 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Latest Blogs
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Stay updated with our latest articles.
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading blogs…
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="flex items-center justify-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Failed to load blogs. Please try again later.
        </div>
      )}

      {/* No Blogs */}
      {!isLoading && !isError && publishedBlogs.length === 0 && (
        <p className="py-20 text-center text-muted-foreground">
          No blogs available yet.
        </p>
      )}

      {/* Blogs Grid */}
      {!isLoading && !isError && publishedBlogs.length > 0 && (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {publishedBlogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </section>
  );
}
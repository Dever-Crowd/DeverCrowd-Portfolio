"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Loader2, AlertCircle, Heart, Eye } from "lucide-react";
import { get, post } from "@/data/api";

export default function BlogPage() {
  const { slug } = useParams(); // دلوقتي جاي من URL
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");


  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await get(`/api/blogs/${slug}`);
        if (!res.ok) throw new Error(res.message);
        setBlog(res.data.blog);
        setLikes(res.data.blog.likes.length ?? 0);
        setComments(res.data.blog.comments ?? []);
      } catch (err) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBlog();
  }, [slug]);


  // Like blog
  const handleLike = async () => {
    try {
      const res = await post(`/api/blogs/${slug}/like`);
      if (!res.ok) throw new Error(res.message);
      setLikes(res.data.totalLikes);
    } catch (err) {
      alert("Failed to like blog");
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading blog…
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
        <AlertCircle className="h-4 w-4 shrink-0" />
        Failed to load blog.
      </div>
    );

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Featured Image */}
      {blog.featured_image && (
        <div className="w-full h-80 rounded-lg overflow-hidden shadow-lg mb-8">
          <img
            src={blog.featured_image}
            alt={blog.title}
            className="w-full h-full object-cover object-center"
          />
        </div>
      )}

      {/* Meta: Writer, Category, Date */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4 sm:mb-8">
        <div className="flex items-center gap-2">
          {blog.writer_pic && (
            <img
              src={blog.writer_pic}
              alt={blog.writer_name}
              className="w-6 h-6 rounded-full object-cover"
            />
          )}
          <span>By {blog.writer_name}</span>
        </div>
        {blog.category && (
          <>
            <span className="hidden sm:inline">•</span>
            <span className="capitalize">{blog.category}</span>
          </>
        )}
        <span className="hidden sm:inline">•</span>
        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
      </div>

      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
          {blog.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Title & Subtitle */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-2">{blog.title}</h1>
      {blog.subtitle && (
        <p className="text-lg sm:text-xl text-muted-foreground mb-4">{blog.subtitle}</p>
      )}

      {/* Body */}
      <article className="prose prose-sm sm:prose-lg max-w-none text-foreground mb-12">
        <div dangerouslySetInnerHTML={{ __html: blog.body }} />
      </article>

      {/* Likes / Actions */}
      <div className="flex flex-wrap items-center gap-4 border-t border-gray-200 pt-6">
        <button
          onClick={handleLike}
          className="flex items-center gap-2 text-red-500 hover:text-red-600 transition"
        >
          <Heart className="h-5 w-5" />
          {likes} Likes
        </button>

      </div>
    </section>
  );
}
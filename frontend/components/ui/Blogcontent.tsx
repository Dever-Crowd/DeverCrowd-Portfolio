import { cn } from "@/lib/utils";

interface BlogContentProps {
    html: string;
    className?: string;
}

export default function BlogContent({ html, className }: BlogContentProps) {
    return (
        <div
            className={cn(
                "prose prose-invert max-w-none text-sm leading-relaxed",
                // Headings
                "prose-h1:text-2xl prose-h1:font-bold prose-h1:mb-4",
                "prose-h2:text-xl prose-h2:font-semibold prose-h2:mb-3",
                "prose-h3:text-lg prose-h3:font-semibold prose-h3:mb-2",
                // Paragraphs
                "prose-p:mb-4 prose-p:text-muted-foreground",
                // Lists
                "prose-ul:list-disc prose-ul:pl-5 prose-ul:mb-4",
                "prose-ol:list-decimal prose-ol:pl-5 prose-ol:mb-4",
                "prose-li:mb-1 prose-li:text-muted-foreground",
                // Code
                "prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-xs prose-code:font-mono",
                "prose-pre:rounded-xl prose-pre:bg-muted prose-pre:p-4 prose-pre:overflow-x-auto",
                // Links
                "prose-a:text-primary prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-primary/80",
                // Strong & Em
                "prose-strong:text-foreground prose-strong:font-semibold",
                "prose-em:italic",
                className
            )}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import CodeBlock from "@tiptap/extension-code-block";
import {
    Bold,
    Italic,
    UnderlineIcon,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Code,
    Link as LinkIcon,
    Undo,
    Redo,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
    value?: string;
    onChange?: (html: string) => void;
    placeholder?: string;
    className?: string;
}

type ToolbarButtonProps = {
    onClick: () => void;
    active?: boolean;
    title: string;
    children: React.ReactNode;
};

const ToolbarButton = ({ onClick, active, title, children }: ToolbarButtonProps) => (
    <button
        type="button"
        title={title}
        onClick={onClick}
        className={cn(
            "flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors",
            active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
    >
        {children}
    </button>
);

export default function RichTextEditor({
    value = "",
    onChange,
    placeholder = "Start writing...",
    className,
}: RichTextEditorProps) {
    const editor = useEditor({
        immediatelyRender: false, // ← السطر ده بس
        extensions: [
            StarterKit.configure({ codeBlock: false }),
            Underline,
            CodeBlock,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: "text-primary underline underline-offset-4" },
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: "outline-none min-h-[200px] max-w-none text-sm tiptap min-h-[200px] text-sm",
            },
        },
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());
        },
    });

    if (!editor) return null;

    const setLink = () => {
        const url = window.prompt("URL:");
        if (!url) return;
        editor.chain().focus().setLink({ href: url }).run();
    };

    return (
        <div className={cn("rounded-xl border border-border bg-card overflow-hidden", className)}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 border-b border-border px-3 py-2">
                {/* Text style */}
                <ToolbarButton title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
                    <Bold className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
                    <Italic className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")}>
                    <UnderlineIcon className="h-4 w-4" />
                </ToolbarButton>

                <div className="mx-1 h-5 w-px bg-border" />

                {/* Headings */}
                <ToolbarButton title="H1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })}>
                    <Heading1 className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton title="H2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>
                    <Heading2 className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton title="H3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}>
                    <Heading3 className="h-4 w-4" />
                </ToolbarButton>

                <div className="mx-1 h-5 w-px bg-border" />

                {/* Lists */}
                <ToolbarButton title="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>
                    <List className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton title="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>
                    <ListOrdered className="h-4 w-4" />
                </ToolbarButton>

                <div className="mx-1 h-5 w-px bg-border" />

                {/* Code & Link */}
                <ToolbarButton title="Code block" onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")}>
                    <Code className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton title="Link" onClick={setLink} active={editor.isActive("link")}>
                    <LinkIcon className="h-4 w-4" />
                </ToolbarButton>

                <div className="mx-1 h-5 w-px bg-border" />

                {/* Undo / Redo */}
                <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()}>
                    <Undo className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()}>
                    <Redo className="h-4 w-4" />
                </ToolbarButton>
            </div>

            {/* Editor area */}
            <div className="px-4 py-3 relative">
                {editor.isEmpty && (
                    <p className="pointer-events-none absolute top-3 left-4 text-sm text-muted-foreground select-none">
                        {placeholder}
                    </p>
                )}
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
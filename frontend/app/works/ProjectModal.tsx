"use client";

import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { X, ExternalLink } from "lucide-react";
import { BsGithub } from "react-icons/bs";
import type { NormalizedProject } from "@/hooks/useProjects";

interface ProjectModalProps {
    project: NormalizedProject;
    onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

                <motion.div
                    className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#0f111a]"
                    initial={{ opacity: 0, scale: 0.92, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 40 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Image */}
                    <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-t-3xl">
                        <Image
                            src={project.pic}
                            alt={project.title}
                            fill
                            className="object-cover"
                            unoptimized={project.pic?.startsWith("http")}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f111a] via-transparent to-transparent" />

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm border border-white/10 transition hover:bg-black/70"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <div className="absolute bottom-4 right-4 flex gap-2">
                            {project.live && (
                                <Link
                                    href={project.live}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/80"
                                >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    Live
                                </Link>
                            )}
                            {project.github && (
                                <Link
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                                >
                                    <BsGithub className="h-3.5 w-3.5" />
                                    GitHub
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8 space-y-6">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-white">{project.title}</h2>
                            <p className="mt-2 text-sm text-white/60 leading-relaxed">{project.description}</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {[
                                { label: "Client", value: project.client },
                                { label: "Timeline", value: project.timeSpend },
                                { label: "Category", value: project.category },
                            ].map(({ label, value }) =>
                                value ? (
                                    <div key={label} className="rounded-xl border border-white/8 bg-white/4 p-3">
                                        <p className="text-xs text-white/40 mb-1">{label}</p>
                                        <p className="text-sm font-medium text-white">{value}</p>
                                    </div>
                                ) : null
                            )}
                        </div>

                        {[
                            { label: "Stack", items: project.stack },
                            { label: "Industry", items: project.industry },
                            { label: "Scope of Work", items: project.scope },
                        ].map(({ label, items }) =>
                            items?.length ? (
                                <div key={label}>
                                    <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3">
                                        {label}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {items.map((item, i) => (
                                            <span
                                                key={i}
                                                className="rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-medium text-primary"
                                            >
                                                {item.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ) : null
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
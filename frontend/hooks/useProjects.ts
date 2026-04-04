import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, del } from "@/data/api";
import { mediaUrl } from "@/lib/mediaUrl";
import { toast } from "sonner";

export interface NamedItem {
    name: string;
}

export interface Project {
    _id: string;
    title: string;
    name: string;
    description: string;
    client: string;
    timeSpend: string;
    category: string;
    status: string;
    pic: string;
    live: string;
    github: string;
    stack: NamedItem[];
    industry: NamedItem[];
    scope: NamedItem[];
}

export interface NormalizedProject {
    name: string;
    title: string;
    description: string;
    client: string;
    timeSpend: string;
    category: string;
    status: string;
    pic: string;
    live: string;
    github: string;
    stack: NamedItem[];
    industry: NamedItem[];
    scope: NamedItem[];
    _id: string;
}

function toNamedList(arr: unknown[]): NamedItem[] {
    if (!arr?.length) return [];
    return arr.map((x) =>
        typeof x === "string" ? { name: x } : { name: (x as Record<string, string>)?.name ?? String(x) }
    );
}

export function normalizeProject(p: Partial<Project>): NormalizedProject {
    return {
        _id: p._id ?? "",
        name: p.title || p.name || "",
        title: p.title || p.name || "",
        description: p.description ?? "",
        client: p.client ?? "",
        timeSpend: p.timeSpend ?? "",
        category: p.category ?? "",
        status: p.status ?? "",
        pic: mediaUrl(p.pic),
        live: p.live || "",
        github: p.github || "",
        stack: toNamedList((p.stack as unknown[]) || []),
        industry: toNamedList((p.industry as unknown[]) || []),
        scope: toNamedList((p.scope as unknown[]) || []),
    };
}

export const useProjects = () =>
    useQuery({
        queryKey: ["projects"],
        queryFn: async () => {
            const res = await get<{ projects: Project[] }>("/api/projects");
            if (!res.ok) throw new Error(res.message || "Failed to load projects");
            return (res.data?.projects ?? []).map(normalizeProject);
        },
    });

export const useDeleteProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => del(`/api/projects/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            toast.success("Project deleted");
        },
        onError: () => toast.error("Delete failed"),
    });
};
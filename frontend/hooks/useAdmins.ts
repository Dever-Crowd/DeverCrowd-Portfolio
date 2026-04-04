import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, del } from "@/data/api";
import { toast } from "sonner";

export interface Admin {
    _id: string;
    username: string;
    nickname: string;
    email: string;
    role: string;
    pic: string;
    tasksNumber: number;
    tasksDone: number;
    tasks?: { title: string; deadline: string; priority: string }[];
    comments?: { username: string; userId: string; commentText: string }[];
}

export interface RegisterAdminInput {
    username: string;
    nickname: string;
    email: string;
    password: string;
    role: string;
    pic: File | null;
}

export const useAdmins = () =>
    useQuery({
        queryKey: ["admins"],
        queryFn: async () => {
            const res = await get<{  admins: Admin[]  }>("/api/admin/profiles");
            if (!res.ok) throw new Error(res.message || "Failed to load admins");
            return res.data?.admins ?? [];
        },
    });

export const useRegisterAdmin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (input: RegisterAdminInput) => {
            const formData = new FormData();
            formData.append("username", input.username);
            formData.append("nickname", input.nickname);
            formData.append("email", input.email);
            formData.append("password", input.password);
            formData.append("role", input.role);
            if (input.pic) formData.append("pic", input.pic);

            const res = await post("/api/admin/register", formData);
            if (!res.ok) {
                const errors = (res.data as { errors?: { msg: string }[] })?.errors;
                const firstError = errors?.[0]?.msg;
                throw new Error(firstError || res.message || "Failed to register admin");
            }
            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admins"] });
            toast.success("Admin registered successfully");
        },
        onError: (err: Error) => toast.error(err.message || "Registration failed"),
    });
};

export const useDeleteAdmin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await del(`/api/admin/profiles/${id}`);
            if (!res.ok) throw new Error(res.message || "Failed to delete admin");
            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admins"] });
            toast.success("Admin deleted");
        },
        onError: (err: Error) => toast.error(err.message || "Delete failed"),
    });
};
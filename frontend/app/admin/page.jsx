"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  FileText,
  Briefcase,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  CheckSquare,
  ArrowRight,
  Tags,
} from "lucide-react";
import { motion } from "motion/react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

const AdminChartsSection = dynamic(() => import("./AdminChartsSection"), {
  ssr: false,
  loading: () => (
    <Card className="border-border">
      <CardHeader>
        <div className="h-5 w-40 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-4 w-64 max-w-full animate-pulse rounded bg-muted" />
      </CardHeader>
      <CardContent>
        <div className="h-[300px] animate-pulse rounded-lg bg-muted/60" />
      </CardContent>
    </Card>
  ),
});

const stats = [
  {
    title: "Total projects",
    value: "24",
    icon: Briefcase,
    delta: "+12%",
    positive: true,
  },
  {
    title: "Blog posts",
    value: "85",
    icon: FileText,
    delta: "+23%",
    positive: true,
  },
  {
    title: "Active users",
    value: "1,234",
    icon: Users,
    delta: "-3%",
    positive: false,
  },
  {
    title: "Messages",
    value: "42",
    icon: MessageSquare,
    delta: "+8%",
    positive: true,
  },
];

const activity = [
  { dot: "bg-[var(--chart-1)]", title: 'New project "E-commerce Platform" created', time: "2 hours ago" },
  { dot: "bg-[var(--chart-2)]", title: 'Blog post "React best practices" published', time: "5 hours ago" },
  { dot: "bg-[var(--chart-3)]", title: 'Service "Mobile development" updated', time: "1 day ago" },
  { dot: "bg-[var(--chart-4)]", title: "New admin user added", time: "2 days ago" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <AdminPageHeader
        title="Dashboard"
        description="Welcome back. Here’s a snapshot of activity across your workspace."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border-border shadow-sm transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.title}</CardTitle>
                <s.icon className="h-4 w-4 text-muted-foreground" aria-hidden />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold tracking-tight">{s.value}</div>
                <p className="mt-1 flex items-center text-xs text-muted-foreground">
                  <span
                    className={`mr-1 inline-flex items-center font-medium ${
                      s.positive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {s.positive ? (
                      <TrendingUp className="mr-0.5 h-3 w-3" />
                    ) : (
                      <TrendingDown className="mr-0.5 h-3 w-3" />
                    )}
                    {s.delta}
                  </span>
                  from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AdminChartsSection />

        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Latest updates across projects and content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activity.map((item) => (
              <div key={item.title} className="flex gap-3">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.dot}`} aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-snug text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle>Quick actions</CardTitle>
          <CardDescription>Shortcuts to common admin tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
              <Link href="/admin/projects/add">
                <Briefcase className="h-6 w-6 text-primary" />
                <span>New project</span>
                <ArrowRight className="h-3 w-3 opacity-50" />
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
              <Link href="/admin/blogs">
                <FileText className="h-6 w-6 text-primary" />
                <span>Blog posts</span>
                <ArrowRight className="h-3 w-3 opacity-50" />
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
              <Link href="/admin/pricing">
                <Tags className="h-6 w-6 text-primary" />
                <span>Pricing</span>
                <ArrowRight className="h-3 w-3 opacity-50" />
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
              <Link href="/admin/admins">
                <Users className="h-6 w-6 text-primary" />
                <span>Manage admins</span>
                <ArrowRight className="h-3 w-3 opacity-50" />
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
              <Link href="/admin/messages">
                <MessageSquare className="h-6 w-6 text-primary" />
                <span>Messages</span>
                <ArrowRight className="h-3 w-3 opacity-50" />
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
              <Link href="/admin/services">
                <CheckSquare className="h-6 w-6 text-primary" />
                <span>Services</span>
                <ArrowRight className="h-3 w-3 opacity-50" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

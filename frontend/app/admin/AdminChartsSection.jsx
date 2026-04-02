"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { name: "Jan", projects: 4, blogs: 8 },
  { name: "Feb", projects: 3, blogs: 12 },
  { name: "Mar", projects: 6, blogs: 10 },
  { name: "Apr", projects: 8, blogs: 15 },
  { name: "May", projects: 5, blogs: 18 },
  { name: "Jun", projects: 9, blogs: 22 },
];

export default function AdminChartsSection() {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle>Monthly activity</CardTitle>
        <CardDescription>Projects and blog posts created each month (sample data)</CardDescription>
      </CardHeader>
      <CardContent className="pl-0">
        <div className="h-[300px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} />
              <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--foreground)",
                }}
              />
              <Legend />
              <Bar dataKey="projects" name="Projects" fill="var(--chart-1)" radius={[4, 4, 0, 0]} maxBarSize={48} />
              <Bar dataKey="blogs" name="Blog posts" fill="var(--chart-2)" radius={[4, 4, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

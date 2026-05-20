"use client";

import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn, formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface ComparisonPoint {
  month: string;
  income: number;
  expenses: number;
}

export function RevenueChart({
  data,
  className,
}: {
  data: ComparisonPoint[];
  className?: string;
}) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Income vs expenses</CardTitle>
          <p className="text-xs text-muted-foreground">Last 6 months</p>
        </div>
        <Link
          href="/finance"
          className="text-sm font-medium text-primary hover:underline"
        >
          View finance →
        </Link>
      </CardHeader>
      <CardContent className="flex-1 pl-2 pr-4">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="month"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) =>
                v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toString()
              }
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--accent) / 0.08)" }}
              contentStyle={{
                background: "hsl(var(--popover))",
                borderColor: "hsl(var(--border))",
                borderRadius: "0.5rem",
                fontSize: "0.8rem",
              }}
              formatter={(value: number, name) => [
                formatCurrency(value),
                name === "income" ? "Income" : "Expenses",
              ]}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: "0.75rem", paddingTop: 8 }}
              formatter={(value) =>
                value === "income" ? "Income" : "Expenses"
              }
            />
            <Bar
              dataKey="income"
              fill="hsl(var(--primary))"
              radius={[6, 6, 0, 0]}
              maxBarSize={28}
            />
            <Bar
              dataKey="expenses"
              fill="hsl(var(--accent))"
              radius={[6, 6, 0, 0]}
              maxBarSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

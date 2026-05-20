"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Slice {
  name: string;
  value: number;
  color: string;
}

export function FinanceChart({
  data,
  className,
}: {
  data: Slice[];
  className?: string;
}) {
  const total = data.reduce((a, d) => a + d.value, 0);

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="pb-2">
        <CardTitle>Invoice breakdown</CardTitle>
        <p className="text-xs text-muted-foreground">By payment status</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <div className="relative">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--popover))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "0.5rem",
                  fontSize: "0.8rem",
                }}
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={56}
                outerRadius={84}
                paddingAngle={2}
                strokeWidth={0}
              >
                {data.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="font-display text-2xl font-semibold leading-none">{total}</p>
            <p className="mt-1 text-xs text-muted-foreground">invoices</p>
          </div>
        </div>
        <ul className="mt-4 space-y-2">
          {data.map((d) => (
            <li key={d.name} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: d.color }}
                  aria-hidden
                />
                <span className="text-muted-foreground">{d.name}</span>
              </span>
              <span className="font-medium">{d.value}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

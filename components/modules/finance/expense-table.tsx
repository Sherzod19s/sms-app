"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import type { Expense, ExpenseCategory } from "@/lib/types";

type SortKey = "description" | "category" | "amount" | "date";
type SortDir = "asc" | "desc";

// Per-category subtle badge tint
const CATEGORY_VARIANTS: Record<
  ExpenseCategory,
  "success" | "warning" | "danger" | "info" | "secondary" | "default"
> = {
  Salaries: "info",
  Rent: "warning",
  Utilities: "secondary",
  Supplies: "success",
  Marketing: "default",
  Maintenance: "danger",
  Other: "secondary",
};

export function ExpenseTable({
  expenses,
  onEdit,
  onDelete,
}: {
  expenses: Expense[];
  onEdit: (e: Expense) => void;
  onDelete: (id: string) => void;
}) {
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({
    key: "date",
    dir: "desc",
  });

  const rows = [...expenses].sort((a, b) => {
    const { key, dir } = sort;
    let cmp = 0;
    if (key === "amount") cmp = a.amount - b.amount;
    else cmp = String(a[key]).localeCompare(String(b[key]));
    return dir === "asc" ? cmp : -cmp;
  });

  const toggle = (key: SortKey) =>
    setSort((s) => ({
      key,
      dir: s.key === key && s.dir === "asc" ? "desc" : "asc",
    }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Expenses</CardTitle>
        <p className="text-xs text-muted-foreground">
          {expenses.length} record{expenses.length === 1 ? "" : "s"}
        </p>
      </CardHeader>
      <CardContent className="px-0 pt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHead label="Description" k="description" sort={sort} onClick={toggle} />
              <SortableHead label="Category" k="category" sort={sort} onClick={toggle} />
              <SortableHead label="Date" k="date" sort={sort} onClick={toggle} />
              <SortableHead label="Amount" k="amount" sort={sort} onClick={toggle} />
              <TableHead className="w-12 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-medium">{e.description}</TableCell>
                <TableCell>
                  <Badge variant={CATEGORY_VARIANTS[e.category]}>{e.category}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(e.date)}
                </TableCell>
                <TableCell className="font-medium">{formatCurrency(e.amount)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Row actions">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(e)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDelete(e.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function SortableHead({
  label,
  k,
  sort,
  onClick,
}: {
  label: string;
  k: SortKey;
  sort: { key: SortKey; dir: SortDir };
  onClick: (k: SortKey) => void;
}) {
  const active = sort.key === k;
  return (
    <TableHead>
      <button
        onClick={() => onClick(k)}
        className={cn(
          "inline-flex items-center gap-1.5 text-left text-muted-foreground transition-colors hover:text-foreground",
          active && "text-foreground"
        )}
      >
        {label}
        {active ? (
          sort.dir === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : (
            <ArrowDown className="h-3.5 w-3.5" />
          )
        ) : (
          <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
        )}
      </button>
    </TableHead>
  );
}

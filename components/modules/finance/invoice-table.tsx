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
import type { Invoice, InvoiceStatus, Student } from "@/lib/types";

type SortKey = "studentName" | "amount" | "issueDate" | "dueDate" | "status";
type SortDir = "asc" | "desc";

const STATUS_VARIANTS: Record<InvoiceStatus, "success" | "warning" | "danger"> = {
  Paid: "success",
  Partial: "warning",
  Unpaid: "danger",
};

export function InvoiceTable({
  invoices,
  students,
  onEdit,
  onDelete,
}: {
  invoices: Invoice[];
  students: Student[];
  onEdit: (inv: Invoice) => void;
  onDelete: (id: string) => void;
}) {
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({
    key: "issueDate",
    dir: "desc",
  });

  const rows = [...invoices].sort((a, b) => {
    const { key, dir } = sort;
    const aName = students.find((s) => s.id === a.studentId)?.name ?? "";
    const bName = students.find((s) => s.id === b.studentId)?.name ?? "";
    let cmp = 0;
    switch (key) {
      case "studentName":
        cmp = aName.localeCompare(bName);
        break;
      case "amount":
        cmp = a.amount - b.amount;
        break;
      case "issueDate":
        cmp = a.issueDate.localeCompare(b.issueDate);
        break;
      case "dueDate":
        cmp = a.dueDate.localeCompare(b.dueDate);
        break;
      case "status":
        cmp = a.status.localeCompare(b.status);
        break;
    }
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
        <CardTitle>Invoices</CardTitle>
        <p className="text-xs text-muted-foreground">{invoices.length} total</p>
      </CardHeader>
      <CardContent className="px-0 pt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHead label="Student" k="studentName" sort={sort} onClick={toggle} />
              <SortableHead label="Amount" k="amount" sort={sort} onClick={toggle} />
              <SortableHead label="Issued" k="issueDate" sort={sort} onClick={toggle} />
              <SortableHead label="Due" k="dueDate" sort={sort} onClick={toggle} />
              <SortableHead label="Status" k="status" sort={sort} onClick={toggle} />
              <TableHead className="w-12 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((inv) => {
              const stu = students.find((s) => s.id === inv.studentId);
              return (
                <TableRow key={inv.id}>
                  <TableCell>
                    <p className="font-medium">{stu?.name ?? "Unknown"}</p>
                    <p className="text-xs text-muted-foreground">{inv.description}</p>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(inv.amount)}
                    {inv.status === "Partial" && (
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(inv.amountPaid)} paid
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(inv.issueDate)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(inv.dueDate)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANTS[inv.status]}>{inv.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Row actions">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(inv)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => onDelete(inv.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
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

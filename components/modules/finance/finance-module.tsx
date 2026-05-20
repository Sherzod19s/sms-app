"use client";

import { useMemo, useState } from "react";
import { Plus, Receipt } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDelete } from "@/components/shared/confirm-delete";
import { useInvoices } from "@/hooks/use-invoices";
import { useStudents } from "@/hooks/use-students";
import { parseISO, startOfMonth } from "date-fns";
import type { Invoice } from "@/lib/types";
import { FinanceSummary } from "./finance-summary";
import { FinanceChart } from "./finance-chart";
import { InvoiceTable } from "./invoice-table";
import { InvoiceDialog } from "./invoice-form";

export function FinanceModule() {
  const { data: invoices, add, update, remove, hydrated } = useInvoices();
  const { data: students } = useStudents();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Invoice | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const summary = useMemo(() => {
    const totalBilled = invoices.reduce((a, i) => a + i.amount, 0);
    const totalCollected = invoices.reduce((a, i) => a + i.amountPaid, 0);
    const outstanding = totalBilled - totalCollected;
    const monthStart = startOfMonth(new Date());
    const thisMonthCollected = invoices
      .filter((i) => parseISO(i.issueDate) >= monthStart)
      .reduce((a, i) => a + i.amountPaid, 0);
    return { totalCollected, outstanding, thisMonthCollected };
  }, [invoices]);

  const breakdown = useMemo(() => {
    const counts = { Paid: 0, Unpaid: 0, Partial: 0 };
    invoices.forEach((i) => {
      counts[i.status]++;
    });
    return [
      { name: "Paid", value: counts.Paid, color: "hsl(var(--success))" },
      { name: "Unpaid", value: counts.Unpaid, color: "hsl(var(--destructive))" },
      { name: "Partial", value: counts.Partial, color: "hsl(var(--warning))" },
    ];
  }, [invoices]);

  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (inv: Invoice) => {
    setEditing(inv);
    setDialogOpen(true);
  };
  const handleSubmit = (values: Omit<Invoice, "id">) => {
    if (editing) {
      update(editing.id, values);
      toast.success("Invoice updated");
    } else {
      add(values);
      toast.success("Invoice created");
    }
    setDialogOpen(false);
    setEditing(null);
  };
  const handleDelete = () => {
    if (!deletingId) return;
    remove(deletingId);
    toast.warning("Invoice removed");
    setDeletingId(null);
  };

  if (!hydrated) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-48" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-72" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Finance</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track invoices, collections & outstanding balances.
          </p>
        </div>
        <Button onClick={openAdd} className="self-start">
          <Plus className="mr-2 h-4 w-4" /> Create invoice
        </Button>
      </header>

      <FinanceSummary {...summary} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <FinanceChart data={breakdown} className="lg:col-span-1" />
        <div className="lg:col-span-2">
          {invoices.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="No invoices yet"
              description="Create your first invoice to start tracking payments."
              action={
                <Button onClick={openAdd}>
                  <Plus className="mr-2 h-4 w-4" /> Create invoice
                </Button>
              }
            />
          ) : (
            <InvoiceTable
              invoices={invoices}
              students={students}
              onEdit={openEdit}
              onDelete={(id) => setDeletingId(id)}
            />
          )}
        </div>
      </div>

      <InvoiceDialog
        open={dialogOpen}
        onOpenChange={(o) => {
          setDialogOpen(o);
          if (!o) setEditing(null);
        }}
        students={students}
        editing={editing}
        onSubmit={handleSubmit}
      />

      <ConfirmDelete
        open={deletingId !== null}
        onOpenChange={(o) => !o && setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete this invoice?"
        description="The invoice will be permanently removed."
      />
    </div>
  );
}

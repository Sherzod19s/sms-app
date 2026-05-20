"use client";

import { useMemo, useState } from "react";
import { Plus, Receipt, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDelete } from "@/components/shared/confirm-delete";
import { useInvoices } from "@/hooks/use-invoices";
import { useStudents } from "@/hooks/use-students";
import { useExpenses } from "@/hooks/use-expenses";
import type { Expense, Invoice } from "@/lib/types";
import { FinanceSummary } from "./finance-summary";
import { FinanceChart } from "./finance-chart";
import { InvoiceTable } from "./invoice-table";
import { InvoiceDialog } from "./invoice-form";
import { ExpenseTable } from "./expense-table";
import { ExpenseDialog } from "./expense-form";

// One target type lets a single confirm dialog cover both lists.
type DeleteTarget = { kind: "invoice" | "expense"; id: string };

export function FinanceModule() {
  const {
    data: invoices,
    add: addInvoice,
    update: updateInvoice,
    remove: removeInvoice,
    hydrated: invoicesHydrated,
  } = useInvoices();
  const {
    data: expenses,
    add: addExpense,
    update: updateExpense,
    remove: removeExpense,
    hydrated: expensesHydrated,
  } = useExpenses();
  const { data: students } = useStudents();

  const hydrated = invoicesHydrated && expensesHydrated;

  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [deleting, setDeleting] = useState<DeleteTarget | null>(null);

  // ----- Summary calculations -----
  const summary = useMemo(() => {
    const totalIncome = invoices.reduce((a, i) => a + i.amountPaid, 0);
    const totalExpenses = expenses.reduce((a, e) => a + e.amount, 0);
    return {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
    };
  }, [invoices, expenses]);

  // Invoice status breakdown (donut)
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

  // ----- Invoice handlers -----
  const openAddInvoice = () => {
    setEditingInvoice(null);
    setInvoiceDialogOpen(true);
  };
  const openEditInvoice = (inv: Invoice) => {
    setEditingInvoice(inv);
    setInvoiceDialogOpen(true);
  };
  const handleInvoiceSubmit = (values: Omit<Invoice, "id">) => {
    if (editingInvoice) {
      updateInvoice(editingInvoice.id, values);
      toast.success("Invoice updated");
    } else {
      addInvoice(values);
      toast.success("Invoice created");
    }
    setInvoiceDialogOpen(false);
    setEditingInvoice(null);
  };

  // ----- Expense handlers -----
  const openAddExpense = () => {
    setEditingExpense(null);
    setExpenseDialogOpen(true);
  };
  const openEditExpense = (e: Expense) => {
    setEditingExpense(e);
    setExpenseDialogOpen(true);
  };
  const handleExpenseSubmit = (values: Omit<Expense, "id">) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, values);
      toast.success("Expense updated");
    } else {
      addExpense(values);
      toast.success("Expense added");
    }
    setExpenseDialogOpen(false);
    setEditingExpense(null);
  };

  // ----- Delete handler -----
  const handleDelete = () => {
    if (!deleting) return;
    if (deleting.kind === "invoice") {
      removeInvoice(deleting.id);
      toast.warning("Invoice removed");
    } else {
      removeExpense(deleting.id);
      toast.warning("Expense removed");
    }
    setDeleting(null);
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
            Track income, expenses, and net balance across the centre.
          </p>
        </div>
        <Button onClick={openAddInvoice} className="self-start">
          <Plus className="mr-2 h-4 w-4" /> Create invoice
        </Button>
      </header>

      <FinanceSummary {...summary} />

      {/* Invoices section: donut + table */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <FinanceChart data={breakdown} className="lg:col-span-1" />
        <div className="lg:col-span-2">
          {invoices.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="No invoices yet"
              description="Create your first invoice to start tracking payments."
              action={
                <Button onClick={openAddInvoice}>
                  <Plus className="mr-2 h-4 w-4" /> Create invoice
                </Button>
              }
            />
          ) : (
            <InvoiceTable
              invoices={invoices}
              students={students}
              onEdit={openEditInvoice}
              onDelete={(id) => setDeleting({ kind: "invoice", id })}
            />
          )}
        </div>
      </div>

      {/* Expenses section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold tracking-tight">
              Expenses
            </h2>
            <p className="text-sm text-muted-foreground">
              Track outgoing costs by category.
            </p>
          </div>
          <Button variant="outline" onClick={openAddExpense}>
            <Plus className="mr-2 h-4 w-4" /> Add expense
          </Button>
        </div>

        {expenses.length === 0 ? (
          <EmptyState
            icon={Wallet}
            title="No expenses yet"
            description="Record your first expense to keep an eye on cash flow."
            action={
              <Button onClick={openAddExpense}>
                <Plus className="mr-2 h-4 w-4" /> Add expense
              </Button>
            }
          />
        ) : (
          <ExpenseTable
            expenses={expenses}
            onEdit={openEditExpense}
            onDelete={(id) => setDeleting({ kind: "expense", id })}
          />
        )}
      </section>

      <InvoiceDialog
        open={invoiceDialogOpen}
        onOpenChange={(o) => {
          setInvoiceDialogOpen(o);
          if (!o) setEditingInvoice(null);
        }}
        students={students}
        editing={editingInvoice}
        onSubmit={handleInvoiceSubmit}
      />

      <ExpenseDialog
        open={expenseDialogOpen}
        onOpenChange={(o) => {
          setExpenseDialogOpen(o);
          if (!o) setEditingExpense(null);
        }}
        editing={editingExpense}
        onSubmit={handleExpenseSubmit}
      />

      <ConfirmDelete
        open={deleting !== null}
        onOpenChange={(o) => !o && setDeleting(null)}
        onConfirm={handleDelete}
        title={
          deleting?.kind === "expense"
            ? "Delete this expense?"
            : "Delete this invoice?"
        }
        description={
          deleting?.kind === "expense"
            ? "The expense will be permanently removed."
            : "The invoice will be permanently removed."
        }
      />
    </div>
  );
}

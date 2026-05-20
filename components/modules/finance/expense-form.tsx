"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EXPENSE_CATEGORIES } from "@/lib/types";
import type { Expense, ExpenseCategory } from "@/lib/types";

const schema = z.object({
  description: z.string().min(2, "Description required"),
  category: z.enum(EXPENSE_CATEGORIES),
  amount: z.coerce.number().positive("Amount must be > 0"),
  date: z.string().min(1, "Date required"),
});

type FormValues = z.infer<typeof schema>;

export function ExpenseDialog({
  open,
  onOpenChange,
  editing,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  editing: Expense | null;
  onSubmit: (values: Omit<Expense, "id">) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const defaults: FormValues = {
    description: "",
    category: "Supplies",
    amount: 0,
    date: today,
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });

  useEffect(() => {
    if (open) reset(editing ?? defaults);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editing]);

  const category = watch("category");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit expense" : "Add expense"}</DialogTitle>
          <DialogDescription>
            {editing
              ? "Update this expense's details."
              : "Record a new outgoing expense."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="Description"
              error={errors.description?.message}
              className="sm:col-span-2"
            >
              <Textarea rows={2} {...register("description")} placeholder="Centre rent" />
            </Field>
            <Field label="Category" error={errors.category?.message}>
              <Select
                value={category}
                onValueChange={(v) =>
                  setValue("category", v as ExpenseCategory, { shouldValidate: true })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Amount (TJ Somoni)" error={errors.amount?.message}>
              <Input type="number" min={0} step={0.01} {...register("amount")} />
            </Field>
            <Field label="Date" error={errors.date?.message} className="sm:col-span-2">
              <Input type="date" {...register("date")} />
            </Field>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {editing ? "Save changes" : "Add expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block">{label}</Label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

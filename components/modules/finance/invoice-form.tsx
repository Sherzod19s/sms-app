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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Invoice, InvoiceStatus, Student } from "@/lib/types";

const schema = z
  .object({
    studentId: z.string().min(1, "Student is required"),
    description: z.string().min(2, "Description required"),
    amount: z.coerce.number().positive("Amount must be > 0"),
    amountPaid: z.coerce.number().min(0, "Cannot be negative"),
    issueDate: z.string().min(1, "Issue date required"),
    dueDate: z.string().min(1, "Due date required"),
    status: z.enum(["Paid", "Unpaid", "Partial"]),
  })
  .refine((v) => v.amountPaid <= v.amount, {
    message: "Paid cannot exceed total",
    path: ["amountPaid"],
  });

type FormValues = z.infer<typeof schema>;

export function InvoiceDialog({
  open,
  onOpenChange,
  students,
  editing,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  students: Student[];
  editing: Invoice | null;
  onSubmit: (values: Omit<Invoice, "id">) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const defaults: FormValues = {
    studentId: students[0]?.id ?? "",
    description: "Monthly tuition",
    amount: 1000,
    amountPaid: 0,
    issueDate: today,
    dueDate: today,
    status: "Unpaid",
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
    if (open) {
      reset(editing ?? defaults);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editing]);

  const submit = (values: FormValues) => {
    // Derive amountPaid from status sensibly if user left default
    let paid = values.amountPaid;
    if (values.status === "Paid") paid = values.amount;
    if (values.status === "Unpaid") paid = 0;
    onSubmit({ ...values, amountPaid: paid, status: values.status as InvoiceStatus });
  };

  const studentId = watch("studentId");
  const status = watch("status");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit invoice" : "Create invoice"}</DialogTitle>
          <DialogDescription>
            {editing ? "Update billing details." : "Issue a new invoice to a student."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Student" error={errors.studentId?.message} className="sm:col-span-2">
              <Select
                value={studentId}
                onValueChange={(v) => setValue("studentId", v, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose…" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field
              label="Description"
              error={errors.description?.message}
              className="sm:col-span-2"
            >
              <Textarea rows={2} {...register("description")} />
            </Field>
            <Field label="Amount (TJ Somoni)" error={errors.amount?.message}>
              <Input type="number" min={0} step={0.01} {...register("amount")} />
            </Field>
            <Field label="Amount paid" error={errors.amountPaid?.message}>
              <Input type="number" min={0} step={0.01} {...register("amountPaid")} />
            </Field>
            <Field label="Issue date" error={errors.issueDate?.message}>
              <Input type="date" {...register("issueDate")} />
            </Field>
            <Field label="Due date" error={errors.dueDate?.message}>
              <Input type="date" {...register("dueDate")} />
            </Field>
            <Field label="Status" error={errors.status?.message} className="sm:col-span-2">
              <Select
                value={status}
                onValueChange={(v) =>
                  setValue("status", v as InvoiceStatus, { shouldValidate: true })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Unpaid">Unpaid</SelectItem>
                  <SelectItem value="Partial">Partial</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {editing ? "Save changes" : "Create invoice"}
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

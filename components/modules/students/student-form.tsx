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
import type { ClassRoom, Student, Status } from "@/lib/types";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.coerce.number().int().min(3, "Min age 3").max(18, "Max age 18"),
  classId: z.string().min(1, "Class is required"),
  parentName: z.string().min(2, "Parent name required"),
  parentContact: z.string().min(6, "Contact must be at least 6 characters"),
  enrollmentDate: z.string().min(1, "Enrolment date required"),
  status: z.enum(["active", "inactive"]),
});

type FormValues = z.infer<typeof schema>;

export function StudentDialog({
  open,
  onOpenChange,
  classes,
  editing,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  classes: ClassRoom[];
  editing: Student | null;
  onSubmit: (values: Omit<Student, "id">) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      age: 6,
      classId: classes[0]?.id ?? "",
      parentName: "",
      parentContact: "",
      enrollmentDate: today,
      status: "active",
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        editing
          ? { ...editing }
          : {
              name: "",
              age: 6,
              classId: classes[0]?.id ?? "",
              parentName: "",
              parentContact: "",
              enrollmentDate: today,
              status: "active",
            }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editing]);

  const submit = (values: FormValues) => {
    onSubmit({
      ...values,
      status: values.status as Status,
    });
  };

  const classId = watch("classId");
  const status = watch("status");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit student" : "Add student"}</DialogTitle>
          <DialogDescription>
            {editing
              ? "Update this student's details."
              : "Enrol a new student into the centre."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full name" error={errors.name?.message} className="sm:col-span-2">
              <Input {...register("name")} placeholder="Aiden Wong" />
            </Field>
            <Field label="Age" error={errors.age?.message}>
              <Input type="number" min={3} max={18} {...register("age")} />
            </Field>
            <Field label="Assigned class" error={errors.classId?.message}>
              <Select
                value={classId}
                onValueChange={(v) => setValue("classId", v, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose…" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Parent name" error={errors.parentName?.message}>
              <Input {...register("parentName")} placeholder="Karen Wong" />
            </Field>
            <Field label="Parent contact" error={errors.parentContact?.message}>
              <Input {...register("parentContact")} placeholder="+852 9876 1111" />
            </Field>
            <Field label="Enrolment date" error={errors.enrollmentDate?.message}>
              <Input type="date" {...register("enrollmentDate")} />
            </Field>
            <Field label="Status" error={errors.status?.message}>
              <Select
                value={status}
                onValueChange={(v) =>
                  setValue("status", v as Status, { shouldValidate: true })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {editing ? "Save changes" : "Add student"}
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

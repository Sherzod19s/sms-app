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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ClassRoom, Teacher, WeekDay } from "@/lib/types";
import { classColorFromName } from "./color";

const WEEK_DAYS: WeekDay[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const SHORT_DAYS: Record<WeekDay, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  subject: z.string().min(2, "Subject required"),
  teacherId: z.string().min(1, "Teacher is required"),
  scheduleDays: z.array(z.enum(WEEK_DAYS as [WeekDay, ...WeekDay[]])).min(1, "Pick at least one day"),
  maxCapacity: z.coerce.number().int().min(1, "Capacity must be at least 1"),
  room: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ClassDialog({
  open,
  onOpenChange,
  teachers,
  editing,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  teachers: Teacher[];
  editing: ClassRoom | null;
  onSubmit: (values: Omit<ClassRoom, "id">) => void;
}) {
  const defaults: FormValues = {
    name: "",
    subject: "",
    teacherId: teachers[0]?.id ?? "",
    scheduleDays: [],
    maxCapacity: 10,
    room: "",
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
    if (!open) return;
    if (editing) {
      reset({
        name: editing.name,
        subject: editing.subject,
        teacherId: editing.teacherId,
        scheduleDays: editing.scheduleDays,
        maxCapacity: editing.maxCapacity,
        room: editing.room ?? "",
      });
    } else {
      reset(defaults);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editing]);

  const teacherId = watch("teacherId");
  const scheduleDays = watch("scheduleDays");
  const toggleDay = (d: WeekDay) => {
    const next = scheduleDays.includes(d)
      ? scheduleDays.filter((x) => x !== d)
      : [...scheduleDays, d];
    setValue("scheduleDays", next, { shouldValidate: true });
  };

  const submit = (values: FormValues) => {
    // Preserve color when editing; otherwise derive from name.
    const color = editing ? editing.color : classColorFromName(values.name);
    onSubmit({
      ...values,
      room: values.room?.trim() ? values.room.trim() : undefined,
      color,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit class" : "Add class"}</DialogTitle>
          <DialogDescription>
            {editing ? "Update this class's details." : "Add a new class to the centre."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Class name" error={errors.name?.message} className="sm:col-span-2">
              <Input {...register("name")} placeholder="Math Juniors" />
            </Field>
            <Field
              label="Subject / description"
              error={errors.subject?.message}
              className="sm:col-span-2"
            >
              <Input {...register("subject")} placeholder="Mathematics for ages 6–9" />
            </Field>
            <Field label="Assigned teacher" error={errors.teacherId?.message}>
              <Select
                value={teacherId}
                onValueChange={(v) => setValue("teacherId", v, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose…" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.length === 0 ? (
                    <SelectItem value="__none__" disabled>
                      No teachers yet
                    </SelectItem>
                  ) : (
                    teachers.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Max capacity" error={errors.maxCapacity?.message}>
              <Input type="number" min={1} {...register("maxCapacity")} />
            </Field>
            <Field label="Room (optional)" error={errors.room?.message} className="sm:col-span-2">
              <Input {...register("room")} placeholder="Room A" />
            </Field>
            <Field
              label="Schedule days"
              error={errors.scheduleDays?.message}
              className="sm:col-span-2"
            >
              <div className="flex flex-wrap gap-2 rounded-md border p-3">
                {WEEK_DAYS.map((d) => {
                  const checked = scheduleDays.includes(d);
                  return (
                    <label
                      key={d}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-md border bg-background px-2.5 py-1.5 text-sm"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleDay(d)}
                      />
                      {SHORT_DAYS[d]}
                    </label>
                  );
                })}
              </div>
            </Field>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {editing ? "Save changes" : "Add class"}
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

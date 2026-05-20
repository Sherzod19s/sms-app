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
import type { ClassRoom, ClassSession, Teacher } from "@/lib/types";

const schema = z
  .object({
    classId: z.string().min(1, "Class is required"),
    teacherId: z.string().min(1, "Teacher is required"),
    date: z.string().min(1, "Date is required"),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, "Use HH:mm"),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, "Use HH:mm"),
    room: z.string().min(1, "Room is required"),
  })
  .refine((v) => v.endTime > v.startTime, {
    message: "End must be after start",
    path: ["endTime"],
  });

type FormValues = z.infer<typeof schema>;

export function SessionDialog({
  open,
  onOpenChange,
  classes,
  teachers,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  classes: ClassRoom[];
  teachers: Teacher[];
  onSubmit: (values: Omit<ClassSession, "id">) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const defaults: FormValues = {
    classId: classes[0]?.id ?? "",
    teacherId: classes[0]?.teacherId ?? "",
    date: today,
    startTime: "09:00",
    endTime: "10:00",
    room: "Room A",
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

  // Auto-fill teacher when class changes.
  const classId = watch("classId");
  useEffect(() => {
    const cls = classes.find((c) => c.id === classId);
    if (cls) setValue("teacherId", cls.teacherId, { shouldValidate: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId]);

  useEffect(() => {
    if (open) reset(defaults);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const teacherId = watch("teacherId");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add session</DialogTitle>
          <DialogDescription>
            Schedule a new class session. The teacher auto-fills from the class.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Class" error={errors.classId?.message} className="sm:col-span-2">
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
            <Field label="Teacher" error={errors.teacherId?.message} className="sm:col-span-2">
              <Select
                value={teacherId}
                onValueChange={(v) => setValue("teacherId", v, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose…" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Date" error={errors.date?.message}>
              <Input type="date" {...register("date")} />
            </Field>
            <Field label="Room" error={errors.room?.message}>
              <Input {...register("room")} placeholder="Room A" />
            </Field>
            <Field label="Start time" error={errors.startTime?.message}>
              <Input type="time" {...register("startTime")} />
            </Field>
            <Field label="End time" error={errors.endTime?.message}>
              <Input type="time" {...register("endTime")} />
            </Field>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Add session
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

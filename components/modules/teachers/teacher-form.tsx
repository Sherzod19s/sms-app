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
import type { ClassRoom, Teacher } from "@/lib/types";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  subject: z.string().min(2, "Subject required"),
  contact: z.string().min(6, "Contact must be at least 6 characters"),
  classIds: z.array(z.string()),
  joinDate: z.string().min(1, "Join date required"),
});

type FormValues = z.infer<typeof schema>;

export function TeacherDialog({
  open,
  onOpenChange,
  classes,
  editing,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  classes: ClassRoom[];
  editing: Teacher | null;
  onSubmit: (values: Omit<Teacher, "id">) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const defaults: FormValues = {
    name: "",
    subject: "",
    contact: "",
    classIds: [],
    joinDate: today,
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

  const classIds = watch("classIds");
  const toggleClass = (id: string) => {
    const next = classIds.includes(id)
      ? classIds.filter((c) => c !== id)
      : [...classIds, id];
    setValue("classIds", next, { shouldValidate: true });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit teacher" : "Add teacher"}</DialogTitle>
          <DialogDescription>
            {editing ? "Update this teacher's details." : "Add a new staff member."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full name" error={errors.name?.message} className="sm:col-span-2">
              <Input {...register("name")} placeholder="Priya Sharma" />
            </Field>
            <Field label="Subject" error={errors.subject?.message}>
              <Input {...register("subject")} placeholder="Mathematics" />
            </Field>
            <Field label="Contact" error={errors.contact?.message}>
              <Input {...register("contact")} placeholder="+852 9123 4567" />
            </Field>
            <Field label="Join date" error={errors.joinDate?.message}>
              <Input type="date" {...register("joinDate")} />
            </Field>
            <Field
              label="Assigned classes"
              error={errors.classIds?.message}
              className="sm:col-span-2"
            >
              {classes.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No classes available yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-2 rounded-md border p-3 sm:grid-cols-2">
                  {classes.map((c) => (
                    <label
                      key={c.id}
                      className="flex cursor-pointer items-center gap-2 text-sm"
                    >
                      <Checkbox
                        checked={classIds.includes(c.id)}
                        onCheckedChange={() => toggleClass(c.id)}
                      />
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: c.color }}
                      />
                      {c.name}
                    </label>
                  ))}
                </div>
              )}
            </Field>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {editing ? "Save changes" : "Add teacher"}
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

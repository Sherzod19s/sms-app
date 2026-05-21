"use client";

import { useState } from "react";
import { Plus, BookOpen, Pencil, Trash2, Users, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDelete } from "@/components/shared/confirm-delete";
import { useClasses } from "@/hooks/use-classes";
import { useTeachers } from "@/hooks/use-teachers";
import { useStudents } from "@/hooks/use-students";
import type { ClassRoom, WeekDay } from "@/lib/types";
import { ClassDialog } from "./class-form";

const SHORT_DAYS: Record<WeekDay, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

export function ClassesModule() {
  const { data: classes, add, update, remove, hydrated } = useClasses();
  const { data: teachers } = useTeachers();
  const { data: students } = useStudents();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ClassRoom | null>(null);
  const [deletingClass, setDeletingClass] = useState<ClassRoom | null>(null);

  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (c: ClassRoom) => {
    setEditing(c);
    setDialogOpen(true);
  };
  const handleSubmit = (values: Omit<ClassRoom, "id">) => {
    if (editing) {
      update(editing.id, values);
      toast.success("Class updated");
    } else {
      add(values);
      toast.success("Class added");
    }
    setDialogOpen(false);
    setEditing(null);
  };
  const handleDelete = () => {
    if (!deletingClass) return;
    remove(deletingClass.id);
    toast.warning("Class removed");
    setDeletingClass(null);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Classes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your centre&rsquo;s classes and subjects
          </p>
        </div>
        <Button onClick={openAdd} className="self-start">
          <Plus className="mr-2 h-4 w-4" /> Add class
        </Button>
      </header>

      {!hydrated ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-52 w-full" />
          ))}
        </div>
      ) : classes.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No classes yet"
          description="Create your first class to start assigning teachers and students."
          action={
            <Button onClick={openAdd}>
              <Plus className="mr-2 h-4 w-4" /> Add your first class
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((c) => {
            const teacher = teachers.find((t) => t.id === c.teacherId);
            const studentCount = students.filter(
              (s) => s.classId === c.id && s.status === "active"
            ).length;
            return (
              <Card key={c.id} className="overflow-hidden">
                {/* Color accent strip */}
                <div className="h-1.5" style={{ background: c.color }} aria-hidden />
                <CardContent className="flex h-[calc(100%-0.375rem)] flex-col p-5">
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="font-display text-lg font-semibold leading-tight tracking-tight">
                        {c.name}
                      </h3>
                      <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
                        {c.subject}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm">
                        <span className="text-muted-foreground">Teacher: </span>
                        <span className="font-medium">{teacher?.name ?? "Unassigned"}</span>
                      </p>
                      <Badge variant="secondary" className="shrink-0">
                        <Users className="mr-1 h-3 w-3" />
                        {studentCount}/{c.maxCapacity}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {c.scheduleDays.length === 0 ? (
                        <span className="text-xs text-muted-foreground">
                          No days set
                        </span>
                      ) : (
                        c.scheduleDays.map((d) => (
                          <span
                            key={d}
                            className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium"
                          >
                            {SHORT_DAYS[d]}
                          </span>
                        ))
                      )}
                    </div>

                    {c.room && (
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {c.room}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-1 border-t pt-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${c.name}`}
                      onClick={() => openEdit(c)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${c.name}`}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setDeletingClass(c)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <ClassDialog
        open={dialogOpen}
        onOpenChange={(o) => {
          setDialogOpen(o);
          if (!o) setEditing(null);
        }}
        teachers={teachers}
        editing={editing}
        onSubmit={handleSubmit}
      />

      <ConfirmDelete
        open={deletingClass !== null}
        onOpenChange={(o) => !o && setDeletingClass(null)}
        onConfirm={handleDelete}
        title={
          deletingClass
            ? `Are you sure you want to delete ${deletingClass.name}?`
            : "Delete class?"
        }
        description="This cannot be undone. Students and sessions referencing this class will keep their existing IDs but will show as unassigned."
        confirmLabel="Delete"
      />
    </div>
  );
}

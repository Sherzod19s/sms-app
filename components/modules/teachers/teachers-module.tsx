"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDelete } from "@/components/shared/confirm-delete";
import { useTeachers } from "@/hooks/use-teachers";
import { useClasses } from "@/hooks/use-classes";
import { useSessions } from "@/hooks/use-sessions";
import type { Teacher } from "@/lib/types";
import { TeacherTable } from "./teacher-table";
import { TeacherDialog } from "./teacher-form";
import { TeacherDetailModal } from "./teacher-detail";

export function TeachersModule() {
  const { data: teachers, add, update, remove, hydrated } = useTeachers();
  const { data: classes } = useClasses();
  const { data: sessions } = useSessions();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [detailTeacher, setDetailTeacher] = useState<Teacher | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return teachers;
    return teachers.filter((t) => t.name.toLowerCase().includes(term));
  }, [teachers, search]);

  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (t: Teacher) => {
    setEditing(t);
    setDialogOpen(true);
  };
  const handleSubmit = (values: Omit<Teacher, "id">) => {
    if (editing) {
      update(editing.id, values);
      toast.success("Teacher updated");
    } else {
      add(values);
      toast.success("Teacher added");
    }
    setDialogOpen(false);
    setEditing(null);
  };
  const handleDelete = () => {
    if (!deletingId) return;
    remove(deletingId);
    toast.warning("Teacher removed");
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Teachers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {hydrated ? `${teachers.length} on staff` : "Loading…"} &middot; manage profiles
            and class assignments.
          </p>
        </div>
        <Button onClick={openAdd} className="self-start">
          <Plus className="mr-2 h-4 w-4" /> Add teacher
        </Button>
      </header>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name…"
          className="pl-9 sm:max-w-sm"
        />
      </div>

      {!hydrated ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title={search ? "No matches" : "No teachers yet"}
          description={
            search
              ? "Try a different search term."
              : "Add your first teacher to begin assigning classes."
          }
          action={
            !search ? (
              <Button onClick={openAdd}>
                <Plus className="mr-2 h-4 w-4" /> Add teacher
              </Button>
            ) : undefined
          }
        />
      ) : (
        <TeacherTable
          rows={filtered}
          classes={classes}
          onEdit={openEdit}
          onDelete={(id) => setDeletingId(id)}
          onView={(t) => setDetailTeacher(t)}
        />
      )}

      <TeacherDialog
        open={dialogOpen}
        onOpenChange={(o) => {
          setDialogOpen(o);
          if (!o) setEditing(null);
        }}
        classes={classes}
        editing={editing}
        onSubmit={handleSubmit}
      />

      <TeacherDetailModal
        teacher={detailTeacher}
        classes={classes}
        sessions={sessions}
        onClose={() => setDetailTeacher(null)}
      />

      <ConfirmDelete
        open={deletingId !== null}
        onOpenChange={(o) => !o && setDeletingId(null)}
        onConfirm={handleDelete}
        title="Remove this teacher?"
        description="They will be unassigned from any classes. This can't be undone."
        confirmLabel="Remove"
      />
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Plus, Search, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDelete } from "@/components/shared/confirm-delete";
import { useStudents } from "@/hooks/use-students";
import { useClasses } from "@/hooks/use-classes";
import type { Student, Status } from "@/lib/types";
import { StudentTable } from "./student-table";
import { StudentDialog } from "./student-form";

type SortKey = "name" | "age" | "enrollmentDate" | "status";
type SortDir = "asc" | "desc";

export function StudentsModule() {
  const { data: students, add, update, remove, hydrated } = useStudents();
  const { data: classes } = useClasses();

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({
    key: "enrollmentDate",
    dir: "desc",
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    let rows = students.filter((s) => {
      if (term && !s.name.toLowerCase().includes(term)) return false;
      if (classFilter !== "all" && s.classId !== classFilter) return false;
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      return true;
    });
    rows = [...rows].sort((a, b) => {
      const { key, dir } = sort;
      const va = a[key];
      const vb = b[key];
      let cmp: number;
      if (typeof va === "number" && typeof vb === "number") cmp = va - vb;
      else cmp = String(va).localeCompare(String(vb));
      return dir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [students, search, classFilter, statusFilter, sort]);

  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (s: Student) => {
    setEditing(s);
    setDialogOpen(true);
  };
  const handleSubmit = (values: Omit<Student, "id">) => {
    if (editing) {
      update(editing.id, values);
      toast.success("Student updated");
    } else {
      add(values);
      toast.success("Student added");
    }
    setDialogOpen(false);
    setEditing(null);
  };
  const handleDelete = () => {
    if (!deletingId) return;
    remove(deletingId);
    toast.warning("Student removed");
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Students
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {hydrated ? `${students.length} total` : "Loading…"} &middot; manage profiles,
            enrolment status & class assignment.
          </p>
        </div>
        <Button onClick={openAdd} className="self-start">
          <Plus className="mr-2 h-4 w-4" /> Add student
        </Button>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name…"
            className="pl-9"
          />
        </div>
        <Select
          value={classFilter}
          onValueChange={(v) => {
            setClassFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Filter class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All classes</SelectItem>
            {classes.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v as Status | "all");
            setPage(1);
          }}
        >
          <SelectTrigger className="sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!hydrated ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title={search || classFilter !== "all" || statusFilter !== "all" ? "No matches" : "No students yet"}
          description={
            search || classFilter !== "all" || statusFilter !== "all"
              ? "Try adjusting your search or filters."
              : "Add your first student to get started."
          }
          action={
            <Button onClick={openAdd}>
              <Plus className="mr-2 h-4 w-4" /> Add student
            </Button>
          }
        />
      ) : (
        <StudentTable
          rows={paged}
          classes={classes}
          page={safePage}
          pageCount={pageCount}
          totalRows={filtered.length}
          onPageChange={setPage}
          sort={sort}
          onSortChange={setSort}
          onEdit={openEdit}
          onDelete={(id) => setDeletingId(id)}
        />
      )}

      <StudentDialog
        open={dialogOpen}
        onOpenChange={(o) => {
          setDialogOpen(o);
          if (!o) setEditing(null);
        }}
        classes={classes}
        editing={editing}
        onSubmit={handleSubmit}
      />

      <ConfirmDelete
        open={deletingId !== null}
        onOpenChange={(o) => !o && setDeletingId(null)}
        onConfirm={handleDelete}
        title="Remove this student?"
        description="They'll be permanently removed from the centre roster. This can't be undone."
        confirmLabel="Remove"
      />
    </div>
  );
}

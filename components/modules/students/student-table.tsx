"use client";

import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AvatarInitials } from "@/components/shared/avatar-initials";
import { cn, formatDate } from "@/lib/utils";
import type { ClassRoom, Student } from "@/lib/types";

type SortKey = "name" | "age" | "enrollmentDate" | "status";
type SortDir = "asc" | "desc";

interface Props {
  rows: Student[];
  classes: ClassRoom[];
  page: number;
  pageCount: number;
  totalRows: number;
  onPageChange: (n: number) => void;
  sort: { key: SortKey; dir: SortDir };
  onSortChange: (s: { key: SortKey; dir: SortDir }) => void;
  onEdit: (s: Student) => void;
  onDelete: (id: string) => void;
}

export function StudentTable({
  rows,
  classes,
  page,
  pageCount,
  totalRows,
  onPageChange,
  sort,
  onSortChange,
  onEdit,
  onDelete,
}: Props) {
  const toggleSort = (key: SortKey) => {
    if (sort.key === key) {
      onSortChange({ key, dir: sort.dir === "asc" ? "desc" : "asc" });
    } else {
      onSortChange({ key, dir: "asc" });
    }
  };

  return (
    <div className="rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <SortableHead label="Name" k="name" sort={sort} onClick={toggleSort} />
            <SortableHead label="Age" k="age" sort={sort} onClick={toggleSort} />
            <TableHead>Class</TableHead>
            <SortableHead label="Status" k="status" sort={sort} onClick={toggleSort} />
            <SortableHead
              label="Enrolled"
              k="enrollmentDate"
              sort={sort}
              onClick={toggleSort}
            />
            <TableHead className="w-12 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((s) => {
            const cls = classes.find((c) => c.id === s.classId);
            return (
              <TableRow key={s.id}>
                <TableCell className="pr-0">
                  <AvatarInitials name={s.name} size="sm" />
                </TableCell>
                <TableCell>
                  <Link
                    href={`/students/${s.id}`}
                    className="font-medium hover:underline"
                  >
                    {s.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">{s.parentName}</p>
                </TableCell>
                <TableCell>{s.age}</TableCell>
                <TableCell>
                  {cls ? (
                    <Link
                      href="/classes"
                      className="inline-flex items-center gap-2 rounded-full bg-secondary px-2.5 py-0.5 text-xs transition-colors hover:bg-accent/20"
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: cls.color }}
                      />
                      {cls.name}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={s.status === "active" ? "success" : "secondary"}>
                    {s.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(s.enrollmentDate)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Row actions">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/students/${s.id}`}>View profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(s)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDelete(s.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between border-t px-4 py-3 text-xs text-muted-foreground">
        <span>
          Showing {rows.length} of {totalRows}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>
          <span>
            Page {page} of {pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === pageCount}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

function SortableHead({
  label,
  k,
  sort,
  onClick,
}: {
  label: string;
  k: SortKey;
  sort: { key: SortKey; dir: SortDir };
  onClick: (k: SortKey) => void;
}) {
  const active = sort.key === k;
  return (
    <TableHead>
      <button
        onClick={() => onClick(k)}
        className={cn(
          "inline-flex items-center gap-1.5 text-left text-muted-foreground transition-colors hover:text-foreground",
          active && "text-foreground"
        )}
      >
        {label}
        {active ? (
          sort.dir === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : (
            <ArrowDown className="h-3.5 w-3.5" />
          )
        ) : (
          <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
        )}
      </button>
    </TableHead>
  );
}

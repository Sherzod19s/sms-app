"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AvatarInitials } from "@/components/shared/avatar-initials";
import { cn, formatDate } from "@/lib/utils";
import type { ClassRoom, Teacher } from "@/lib/types";

type SortKey = "name" | "subject" | "joinDate";
type SortDir = "asc" | "desc";

export function TeacherTable({
  rows,
  classes,
  onEdit,
  onDelete,
  onView,
}: {
  rows: Teacher[];
  classes: ClassRoom[];
  onEdit: (t: Teacher) => void;
  onDelete: (id: string) => void;
  onView: (t: Teacher) => void;
}) {
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({
    key: "name",
    dir: "asc",
  });

  const sorted = [...rows].sort((a, b) => {
    const { key, dir } = sort;
    const cmp = String(a[key]).localeCompare(String(b[key]));
    return dir === "asc" ? cmp : -cmp;
  });

  const toggle = (key: SortKey) =>
    setSort((s) => ({
      key,
      dir: s.key === key && s.dir === "asc" ? "desc" : "asc",
    }));

  return (
    <div className="rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <SortableHead label="Name" k="name" sort={sort} onClick={toggle} />
            <SortableHead label="Subject" k="subject" sort={sort} onClick={toggle} />
            <TableHead>Assigned classes</TableHead>
            <TableHead>Contact</TableHead>
            <SortableHead label="Joined" k="joinDate" sort={sort} onClick={toggle} />
            <TableHead className="w-12 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((t) => {
            const assigned = classes.filter((c) => t.classIds.includes(c.id));
            return (
              <TableRow key={t.id}>
                <TableCell className="pr-0">
                  <AvatarInitials name={t.name} size="sm" />
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => onView(t)}
                    className="text-left font-medium hover:underline"
                  >
                    {t.name}
                  </button>
                </TableCell>
                <TableCell className="text-muted-foreground">{t.subject}</TableCell>
                <TableCell>
                  {assigned.length === 0 ? (
                    <span className="text-muted-foreground">—</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {assigned.map((c) => (
                        <span
                          key={c.id}
                          className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2 py-0.5 text-xs"
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ background: c.color }}
                          />
                          {c.name}
                        </span>
                      ))}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">{t.contact}</TableCell>
                <TableCell className="text-muted-foreground">{formatDate(t.joinDate)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Row actions">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(t)}>View profile</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(t)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDelete(t.id)}
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

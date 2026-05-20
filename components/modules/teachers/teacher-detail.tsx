"use client";

import { endOfWeek, isWithinInterval, parseISO, startOfWeek } from "date-fns";
import { Phone, GraduationCap, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AvatarInitials } from "@/components/shared/avatar-initials";
import { formatDate } from "@/lib/utils";
import type { ClassRoom, ClassSession, Teacher } from "@/lib/types";

export function TeacherDetailModal({
  teacher,
  classes,
  sessions,
  onClose,
}: {
  teacher: Teacher | null;
  classes: ClassRoom[];
  sessions: ClassSession[];
  onClose: () => void;
}) {
  if (!teacher) return null;
  const assigned = classes.filter((c) => teacher.classIds.includes(c.id));
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

  const weekSessions = sessions
    .filter((s) => s.teacherId === teacher.id)
    .filter((s) => isWithinInterval(parseISO(s.date), { start: weekStart, end: weekEnd }))
    .sort((a, b) =>
      a.date === b.date ? a.startTime.localeCompare(b.startTime) : a.date.localeCompare(b.date)
    );

  return (
    <Dialog open={!!teacher} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="sr-only">{teacher.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Profile header */}
          <div className="flex items-start gap-4">
            <AvatarInitials name={teacher.name} size="lg" />
            <div className="flex-1">
              <h2 className="font-display text-2xl font-semibold tracking-tight">
                {teacher.name}
              </h2>
              <p className="text-sm text-muted-foreground">{teacher.subject}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Joined {formatDate(teacher.joinDate)}
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="flex items-center gap-3 rounded-lg border bg-secondary/40 p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background">
              <Phone className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Contact</p>
              <p className="text-sm font-medium">{teacher.contact}</p>
            </div>
          </div>

          {/* Assigned classes */}
          <section>
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <GraduationCap className="h-4 w-4" /> Assigned classes
            </h3>
            {assigned.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No classes assigned yet.
              </p>
            ) : (
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {assigned.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center gap-3 rounded-md border bg-background p-3"
                  >
                    <span
                      className="h-8 w-1 rounded-full"
                      style={{ background: c.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{c.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {c.scheduleDays.join(", ")} &middot; cap {c.maxCapacity}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* This week's sessions */}
          <section>
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <Calendar className="h-4 w-4" /> This week&rsquo;s sessions
            </h3>
            {weekSessions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nothing scheduled this week.
              </p>
            ) : (
              <ul className="space-y-2">
                {weekSessions.map((s) => {
                  const cls = classes.find((c) => c.id === s.classId);
                  return (
                    <li
                      key={s.id}
                      className="flex items-center justify-between gap-3 rounded-md border bg-background p-3"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ background: cls?.color ?? "currentColor" }}
                        />
                        <div>
                          <p className="text-sm font-medium">{cls?.name ?? "Class"}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(s.date, "EEE d MMM")} &middot; {s.room}
                          </p>
                        </div>
                      </div>
                      <Badge variant="info">
                        {s.startTime}–{s.endTime}
                      </Badge>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

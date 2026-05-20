import Link from "next/link";
import { isSameDay, parseISO } from "date-fns";
import { CalendarOff, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import type { ClassRoom, ClassSession, Teacher } from "@/lib/types";

export function UpcomingClasses({
  sessions,
  classes,
  teachers,
}: {
  sessions: ClassSession[];
  classes: ClassRoom[];
  teachers: Teacher[];
}) {
  const today = new Date();
  const todays = sessions
    .filter((s) => isSameDay(parseISO(s.date), today))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Today&rsquo;s classes</CardTitle>
          <p className="text-xs text-muted-foreground">
            {todays.length} session{todays.length === 1 ? "" : "s"} scheduled
          </p>
        </div>
        <Link
          href="/schedule"
          className="text-sm font-medium text-primary hover:underline"
        >
          View schedule →
        </Link>
      </CardHeader>
      <CardContent className="flex-1 pt-2">
        {todays.length === 0 ? (
          <EmptyState
            icon={CalendarOff}
            title="No classes today"
            description="Enjoy the breather — or use the schedule to add one."
          />
        ) : (
          <ul className="space-y-2">
            {todays.map((s) => {
              const cls = classes.find((c) => c.id === s.classId);
              const teacher = teachers.find((t) => t.id === s.teacherId);
              return (
                <li
                  key={s.id}
                  className="flex items-center gap-3 rounded-lg border bg-background/40 p-3"
                >
                  <span
                    className="h-9 w-1 shrink-0 rounded-full"
                    style={{ background: cls?.color ?? "hsl(var(--primary))" }}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{cls?.name ?? "Untitled"}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {teacher?.name ?? "Unassigned"}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-0.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {s.startTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {s.room}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

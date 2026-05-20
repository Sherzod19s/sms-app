"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { EventClickArg, EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Plus, Calendar as CalendarIcon, Clock, MapPin, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSessions } from "@/hooks/use-sessions";
import { useClasses } from "@/hooks/use-classes";
import { useTeachers } from "@/hooks/use-teachers";
import { useStudents } from "@/hooks/use-students";
import type { ClassSession } from "@/lib/types";
import { SessionDialog } from "./session-form";

// FullCalendar must be client-only.
const Calendar = dynamic(() => import("@fullcalendar/react").then((m) => m.default), {
  ssr: false,
});

export function ScheduleModule() {
  const { data: sessions, add, hydrated } = useSessions();
  const { data: classes } = useClasses();
  const { data: teachers } = useTeachers();
  const { data: students } = useStudents();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeSession, setActiveSession] = useState<ClassSession | null>(null);
  const [popoverPos, setPopoverPos] = useState<{ x: number; y: number } | null>(null);

  const events = useMemo<EventInput[]>(
    () =>
      sessions.map((s) => {
        const cls = classes.find((c) => c.id === s.classId);
        return {
          id: s.id,
          title: cls?.name ?? "Class",
          start: `${s.date}T${s.startTime}:00`,
          end: `${s.date}T${s.endTime}:00`,
          backgroundColor: cls?.color ?? "hsl(var(--primary))",
          extendedProps: { session: s },
        };
      }),
    [sessions, classes]
  );

  const handleEventClick = (info: EventClickArg) => {
    const session = info.event.extendedProps.session as ClassSession;
    const rect = info.el.getBoundingClientRect();
    setPopoverPos({ x: rect.left + rect.width / 2, y: rect.top });
    setActiveSession(session);
  };

  const handleSubmit = (values: Omit<ClassSession, "id">) => {
    add(values);
    toast.success("Session added");
    setDialogOpen(false);
  };

  if (!hydrated) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-[500px]" />
      </div>
    );
  }

  const activeClass = activeSession
    ? classes.find((c) => c.id === activeSession.classId)
    : null;
  const activeTeacher = activeSession
    ? teachers.find((t) => t.id === activeSession.teacherId)
    : null;
  const activeStudentCount = activeSession
    ? students.filter((s) => s.classId === activeSession.classId && s.status === "active")
        .length
    : 0;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Schedule</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Plan and view class sessions across the week.
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="self-start">
          <Plus className="mr-2 h-4 w-4" /> Add session
        </Button>
      </header>

      {classes.length === 0 ? (
        <EmptyState
          icon={CalendarIcon}
          title="No classes available"
          description="Sessions are tied to classes. Add at least one class first."
        />
      ) : (
        <Card>
          <CardContent className="p-4 sm:p-6">
            <Calendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek",
              }}
              events={events}
              eventClick={handleEventClick}
              height="auto"
              firstDay={1}
              dayMaxEvents={3}
              nowIndicator
            />
          </CardContent>
        </Card>
      )}

      {/* Floating popover for selected event */}
      {activeSession && popoverPos && (
        <Popover
          open
          onOpenChange={(o) => {
            if (!o) {
              setActiveSession(null);
              setPopoverPos(null);
            }
          }}
        >
          <PopoverTrigger asChild>
            <span
              style={{
                position: "fixed",
                left: popoverPos.x,
                top: popoverPos.y,
                width: 0,
                height: 0,
              }}
            />
          </PopoverTrigger>
          <PopoverContent align="center" className="w-72">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: activeClass?.color ?? "currentColor" }}
                />
                <p className="font-display text-base font-semibold">
                  {activeClass?.name ?? "Class"}
                </p>
              </div>
              <div className="space-y-1.5 text-sm">
                <Row icon={Users} label="Teacher" value={activeTeacher?.name ?? "—"} />
                <Row
                  icon={Clock}
                  label="Time"
                  value={`${activeSession.startTime} – ${activeSession.endTime}`}
                />
                <Row icon={MapPin} label="Room" value={activeSession.room} />
                <Row
                  icon={Users}
                  label="Students"
                  value={`${activeStudentCount} enrolled`}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}

      <SessionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        classes={classes}
        teachers={teachers}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

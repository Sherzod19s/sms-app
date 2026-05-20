"use client";

import { format, isSameDay, parseISO, startOfMonth, subMonths } from "date-fns";
import {
  GraduationCap,
  Wallet,
  AlertTriangle,
  CalendarDays,
} from "lucide-react";
import { useStudents } from "@/hooks/use-students";
import { useInvoices } from "@/hooks/use-invoices";
import { useSessions } from "@/hooks/use-sessions";
import { useClasses } from "@/hooks/use-classes";
import { useTeachers } from "@/hooks/use-teachers";
import { KpiCard } from "./kpi-card";
import { RevenueChart } from "./revenue-chart";
import { UpcomingClasses } from "./upcoming-classes";
import { RecentEnrollments } from "./recent-enrollments";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";

export function Dashboard() {
  const { data: students, hydrated: sH } = useStudents();
  const { data: invoices, hydrated: iH } = useInvoices();
  const { data: sessions, hydrated: seH } = useSessions();
  const { data: classes } = useClasses();
  const { data: teachers } = useTeachers();

  const hydrated = sH && iH && seH;

  // KPI calculations
  const totalStudents = students.filter((s) => s.status === "active").length;
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthlyRevenue = invoices
    .filter(
      (i) =>
        i.status === "Paid" &&
        parseISO(i.issueDate) >= monthStart &&
        parseISO(i.issueDate) <= today
    )
    .reduce((sum, i) => sum + i.amountPaid, 0);
  const unpaidCount = invoices.filter(
    (i) => i.status === "Unpaid" || i.status === "Partial"
  ).length;
  const classesToday = sessions.filter((s) =>
    isSameDay(parseISO(s.date), today)
  ).length;

  // Last 6 months revenue
  const revenueByMonth = Array.from({ length: 6 }).map((_, idx) => {
    const monthDate = subMonths(today, 5 - idx);
    const key = format(monthDate, "yyyy-MM");
    const total = invoices
      .filter(
        (inv) =>
          inv.status === "Paid" && inv.issueDate.startsWith(key)
      )
      .reduce((s, inv) => s + inv.amountPaid, 0);
    return { month: format(monthDate, "MMM"), revenue: total };
  });

  if (!hydrated) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="mb-2 h-7 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Skeleton className="h-80 lg:col-span-2" />
          <Skeleton className="h-80" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Good {greeting()}, Botir Karimov
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&rsquo;s what&rsquo;s happening at Aqlvoy Sen today.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={GraduationCap}
          label="Total Students"
          value={totalStudents.toString()}
          hint={`${students.length - totalStudents} inactive`}
          tone="default"
        />
        <KpiCard
          icon={Wallet}
          label="Monthly Revenue"
          value={formatCurrency(monthlyRevenue)}
          hint={format(today, "MMMM yyyy")}
          tone="success"
        />
        <KpiCard
          icon={AlertTriangle}
          label="Unpaid Invoices"
          value={unpaidCount.toString()}
          hint="Need follow-up"
          tone="warning"
        />
        <KpiCard
          icon={CalendarDays}
          label="Classes Today"
          value={classesToday.toString()}
          hint={format(today, "EEEE")}
          tone="info"
        />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <RevenueChart data={revenueByMonth} className="lg:col-span-2" />
        <UpcomingClasses
          sessions={sessions}
          classes={classes}
          teachers={teachers}
        />
      </section>

      <RecentEnrollments students={students} classes={classes} />
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

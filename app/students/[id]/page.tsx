"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, Mail, Phone, Calendar, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AvatarInitials } from "@/components/shared/avatar-initials";
import { EmptyState } from "@/components/shared/empty-state";
import { useStudents } from "@/hooks/use-students";
import { useClasses } from "@/hooks/use-classes";
import { useInvoices } from "@/hooks/use-invoices";
import { useTeachers } from "@/hooks/use-teachers";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { InvoiceStatus } from "@/lib/types";

const STATUS_VARIANTS: Record<InvoiceStatus, "success" | "warning" | "danger"> = {
  Paid: "success",
  Partial: "warning",
  Unpaid: "danger",
};

export default function StudentDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: students, hydrated } = useStudents();
  const { data: classes } = useClasses();
  const { data: invoices } = useInvoices();
  const { data: teachers } = useTeachers();

  if (!hydrated) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const student = students.find((s) => s.id === params.id);
  if (!student) return notFound();

  const cls = classes.find((c) => c.id === student.classId);
  const teacher = teachers.find((t) => t.id === cls?.teacherId);
  const studentInvoices = invoices.filter((i) => i.studentId === student.id);

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
          <Link href="/students">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to students
          </Link>
        </Button>
      </div>

      {/* Profile header */}
      <Card>
        <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
          <AvatarInitials name={student.name} size="lg" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-2xl font-semibold tracking-tight">
                {student.name}
              </h1>
              <Badge variant={student.status === "active" ? "success" : "secondary"}>
                {student.status}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Age {student.age} &middot; Enrolled {formatDate(student.enrollmentDate)}
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Attendance
            </p>
            <p className="font-display text-3xl font-semibold">85%</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Parent / Guardian</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="truncate text-sm font-medium">{student.parentName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
                <Phone className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Contact</p>
                <p className="truncate text-sm font-medium">{student.parentContact}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Class</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full"
                style={{ background: `${cls?.color ?? "#888"}33` }}
              >
                <GraduationCap
                  className="h-4 w-4"
                  style={{ color: cls?.color ?? "var(--muted-foreground)" }}
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Assigned to</p>
                <p className="text-sm font-medium">{cls?.name ?? "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Schedule</p>
                <p className="text-sm font-medium">
                  {cls?.scheduleDays.join(", ") ?? "—"}
                </p>
              </div>
            </div>
            {teacher && (
              <div className="flex items-center gap-3 pt-1">
                <AvatarInitials name={teacher.name} size="sm" />
                <div>
                  <p className="text-xs text-muted-foreground">Lead teacher</p>
                  <p className="text-sm font-medium">{teacher.name}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="Total invoices" value={studentInvoices.length.toString()} />
            <Row
              label="Total billed"
              value={formatCurrency(
                studentInvoices.reduce((a, i) => a + i.amount, 0)
              )}
            />
            <Row
              label="Total paid"
              value={formatCurrency(
                studentInvoices.reduce((a, i) => a + i.amountPaid, 0)
              )}
            />
            <Row
              label="Outstanding"
              value={formatCurrency(
                studentInvoices.reduce((a, i) => a + (i.amount - i.amountPaid), 0)
              )}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice history</CardTitle>
        </CardHeader>
        <CardContent>
          {studentInvoices.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No invoices yet"
              description="This student doesn't have any billing history."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Issued</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentInvoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">{inv.description}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(inv.issueDate)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(inv.dueDate)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANTS[inv.status]}>{inv.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(inv.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

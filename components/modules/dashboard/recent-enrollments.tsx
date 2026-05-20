import Link from "next/link";
import { parseISO } from "date-fns";
import { UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AvatarInitials } from "@/components/shared/avatar-initials";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate } from "@/lib/utils";
import type { ClassRoom, Student } from "@/lib/types";

export function RecentEnrollments({
  students,
  classes,
}: {
  students: Student[];
  classes: ClassRoom[];
}) {
  const recent = [...students]
    .sort(
      (a, b) =>
        parseISO(b.enrollmentDate).getTime() -
        parseISO(a.enrollmentDate).getTime()
    )
    .slice(0, 4);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Recent enrolments</CardTitle>
          <p className="text-xs text-muted-foreground">
            Latest students added to the centre
          </p>
        </div>
        <Link
          href="/students"
          className="text-sm font-medium text-primary hover:underline"
        >
          View all students →
        </Link>
      </CardHeader>
      <CardContent className="pt-2">
        {recent.length === 0 ? (
          <EmptyState
            icon={UserPlus}
            title="No enrolments yet"
            description="Once you add students, the most recent four will appear here."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Enrolled</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.map((s) => {
                const cls = classes.find((c) => c.id === s.classId);
                return (
                  <TableRow key={s.id}>
                    <TableCell>
                      <Link
                        href={`/students/${s.id}`}
                        className="flex items-center gap-3 hover:underline"
                      >
                        <AvatarInitials name={s.name} size="sm" />
                        <span className="font-medium">{s.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {cls?.name ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={s.status === "active" ? "success" : "secondary"}>
                        {s.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatDate(s.enrollmentDate)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

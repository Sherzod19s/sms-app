import type {
  ClassRoom,
  ClassSession,
  Expense,
  ExpenseCategory,
  Invoice,
  InvoiceStatus,
  Status,
  Student,
  Teacher,
  WeekDay,
} from "../types";

// ----- Students -----

export interface StudentRow {
  id: string;
  full_name: string;
  age: number;
  class_id: string | null;
  parent_name: string | null;
  parent_contact: string | null;
  enrollment_date: string;
  status: Status;
}

export const studentFromRow = (r: StudentRow): Student => ({
  id: r.id,
  name: r.full_name,
  age: r.age,
  classId: r.class_id ?? "",
  parentName: r.parent_name ?? "",
  parentContact: r.parent_contact ?? "",
  enrollmentDate: r.enrollment_date,
  status: r.status,
});

export const studentToRow = (s: Partial<Omit<Student, "id">>) => {
  const row: Record<string, unknown> = {};
  if (s.name !== undefined) row.full_name = s.name;
  if (s.age !== undefined) row.age = s.age;
  if (s.classId !== undefined) row.class_id = s.classId || null;
  if (s.parentName !== undefined) row.parent_name = s.parentName;
  if (s.parentContact !== undefined) row.parent_contact = s.parentContact;
  if (s.enrollmentDate !== undefined) row.enrollment_date = s.enrollmentDate;
  if (s.status !== undefined) row.status = s.status;
  return row;
};

// ----- Profiles -----
// Profiles represent application users (admins + teacher-role accounts), not
// the centre's teaching staff. The latter live in their own `teachers` table.

export interface ProfileRow {
  id: string;
  full_name: string;
  role: "admin" | "teacher";
  created_at: string;
}

// ----- Teachers -----
// classIds is derived on the client by joining against the classes table —
// it isn't a column on the teachers row itself.

export interface TeacherRow {
  id: string;
  full_name: string;
  subject: string | null;
  contact: string | null;
  join_date: string;
  created_at: string;
}

export const teacherFromRow = (r: TeacherRow, classIds: string[] = []): Teacher => ({
  id: r.id,
  name: r.full_name,
  subject: r.subject ?? "",
  classIds,
  contact: r.contact ?? "",
  joinDate: r.join_date,
});

export const teacherToRow = (t: Partial<Omit<Teacher, "id">>) => {
  const row: Record<string, unknown> = {};
  if (t.name !== undefined) row.full_name = t.name;
  if (t.subject !== undefined) row.subject = t.subject || null;
  if (t.contact !== undefined) row.contact = t.contact || null;
  if (t.joinDate !== undefined) row.join_date = t.joinDate;
  // classIds is intentionally NOT mapped to a column — it's synced separately
  // by updating classes.teacher_id rows.
  return row;
};

// ----- Classes -----

export interface ClassRow {
  id: string;
  name: string;
  subject: string;
  teacher_id: string | null;
  schedule_days: string[];
  max_capacity: number;
  room: string | null;
  color: string | null;
  created_at: string;
}

export const classFromRow = (r: ClassRow): ClassRoom => ({
  id: r.id,
  name: r.name,
  subject: r.subject,
  teacherId: r.teacher_id ?? "",
  scheduleDays: (r.schedule_days ?? []) as WeekDay[],
  maxCapacity: r.max_capacity,
  room: r.room ?? undefined,
  color: r.color ?? "#0d9488",
});

export const classToRow = (c: Partial<Omit<ClassRoom, "id">>) => {
  const row: Record<string, unknown> = {};
  if (c.name !== undefined) row.name = c.name;
  if (c.subject !== undefined) row.subject = c.subject;
  if (c.teacherId !== undefined) row.teacher_id = c.teacherId || null;
  if (c.scheduleDays !== undefined) row.schedule_days = c.scheduleDays;
  if (c.maxCapacity !== undefined) row.max_capacity = c.maxCapacity;
  if (c.room !== undefined) row.room = c.room || null;
  if (c.color !== undefined) row.color = c.color;
  return row;
};

// ----- Invoices -----

export interface InvoiceRow {
  id: string;
  student_id: string | null;
  description: string;
  amount: number | string;
  amount_paid: number | string;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
}

export const invoiceFromRow = (r: InvoiceRow): Invoice => ({
  id: r.id,
  studentId: r.student_id ?? "",
  description: r.description,
  amount: Number(r.amount),
  amountPaid: Number(r.amount_paid),
  status: r.status,
  issueDate: r.issue_date,
  dueDate: r.due_date,
});

export const invoiceToRow = (i: Partial<Omit<Invoice, "id">>) => {
  const row: Record<string, unknown> = {};
  if (i.studentId !== undefined) row.student_id = i.studentId || null;
  if (i.description !== undefined) row.description = i.description;
  if (i.amount !== undefined) row.amount = i.amount;
  if (i.amountPaid !== undefined) row.amount_paid = i.amountPaid;
  if (i.status !== undefined) row.status = i.status;
  if (i.issueDate !== undefined) row.issue_date = i.issueDate;
  if (i.dueDate !== undefined) row.due_date = i.dueDate;
  return row;
};

// ----- Expenses -----

export interface ExpenseRow {
  id: string;
  description: string;
  category: string;
  amount: number | string;
  date: string;
}

export const expenseFromRow = (r: ExpenseRow): Expense => ({
  id: r.id,
  description: r.description,
  category: r.category as ExpenseCategory,
  amount: Number(r.amount),
  date: r.date,
});

export const expenseToRow = (e: Partial<Omit<Expense, "id">>) => {
  const row: Record<string, unknown> = {};
  if (e.description !== undefined) row.description = e.description;
  if (e.category !== undefined) row.category = e.category;
  if (e.amount !== undefined) row.amount = e.amount;
  if (e.date !== undefined) row.date = e.date;
  return row;
};

// ----- Sessions -----

export interface SessionRow {
  id: string;
  class_id: string | null;
  teacher_id: string | null;
  date: string;
  start_time: string;
  end_time: string;
  room: string | null;
}

export const sessionFromRow = (r: SessionRow): ClassSession => ({
  id: r.id,
  classId: r.class_id ?? "",
  teacherId: r.teacher_id ?? "",
  date: r.date,
  startTime: r.start_time,
  endTime: r.end_time,
  room: r.room ?? "",
});

export const sessionToRow = (s: Partial<Omit<ClassSession, "id">>) => {
  const row: Record<string, unknown> = {};
  if (s.classId !== undefined) row.class_id = s.classId || null;
  if (s.teacherId !== undefined) row.teacher_id = s.teacherId || null;
  if (s.date !== undefined) row.date = s.date;
  if (s.startTime !== undefined) row.start_time = s.startTime;
  if (s.endTime !== undefined) row.end_time = s.endTime;
  if (s.room !== undefined) row.room = s.room || null;
  return row;
};

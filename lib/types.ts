export type Status = "active" | "inactive";
export type InvoiceStatus = "Paid" | "Unpaid" | "Partial";

export const EXPENSE_CATEGORIES = [
  "Salaries",
  "Rent",
  "Utilities",
  "Supplies",
  "Marketing",
  "Maintenance",
  "Other",
] as const;
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
export type WeekDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface Student {
  id: string;
  name: string;
  age: number;
  classId: string;
  parentName: string;
  parentContact: string;
  enrollmentDate: string; // ISO date
  status: Status;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  classIds: string[];
  contact: string;
  joinDate: string; // ISO date
}

export interface ClassRoom {
  id: string;
  name: string;
  subject: string;
  teacherId: string;
  scheduleDays: WeekDay[];
  maxCapacity: number;
  room?: string;
  color: string; // hex for calendar / badge
}

export interface Invoice {
  id: string;
  studentId: string;
  description: string;
  amount: number;
  amountPaid: number;
  issueDate: string; // ISO
  dueDate: string; // ISO
  status: InvoiceStatus;
}

export interface Expense {
  id: string;
  description: string;
  category: ExpenseCategory;
  amount: number;
  date: string; // ISO yyyy-MM-dd
}

export interface ClassSession {
  id: string;
  classId: string;
  teacherId: string;
  date: string; // ISO date (yyyy-MM-dd)
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  room: string;
}

export interface CRUDHook<T> {
  data: T[];
  add: (item: Omit<T, "id">) => T;
  update: (id: string, patch: Partial<Omit<T, "id">>) => void;
  remove: (id: string) => void;
  hydrated: boolean;
}

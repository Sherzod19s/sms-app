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
  // Fields below aren't in the profiles table — populated as best-effort
  // (empty defaults) so existing UI continues to render.
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
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
}

export interface Expense {
  id: string;
  description: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
}

export interface ClassSession {
  id: string;
  classId: string;
  teacherId: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
}

/**
 * Common shape exposed by every module hook. Both `hydrated` and `loading` are
 * present so existing components that check `hydrated` and any new code that
 * prefers `loading` both work. `loading` is true while the initial fetch is in
 * flight; `hydrated` is its inverse.
 */
export interface CRUDHook<T> {
  data: T[];
  add: (item: Omit<T, "id">) => Promise<void>;
  update: (id: string, patch: Partial<Omit<T, "id">>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  loading: boolean;
  hydrated: boolean;
}

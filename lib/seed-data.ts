import { addDays, format, startOfWeek } from "date-fns";
import type {
  ClassRoom,
  ClassSession,
  Invoice,
  Student,
  Teacher,
} from "./types";

// Stable ids so cross-references resolve.
export const CLASSES: ClassRoom[] = [
  {
    id: "cls_math_juniors",
    name: "Math Juniors",
    teacherId: "tch_priya",
    scheduleDays: ["Monday", "Wednesday", "Friday"],
    maxCapacity: 12,
    color: "#f97316", // orange
  },
  {
    id: "cls_english_starters",
    name: "English Starters",
    teacherId: "tch_daniel",
    scheduleDays: ["Tuesday", "Thursday"],
    maxCapacity: 10,
    color: "#10b981", // emerald
  },
  {
    id: "cls_science_kids",
    name: "Science Kids",
    teacherId: "tch_priya",
    scheduleDays: ["Monday", "Thursday"],
    maxCapacity: 14,
    color: "#3b82f6", // blue
  },
  {
    id: "cls_art_craft",
    name: "Art & Craft",
    teacherId: "tch_mei",
    scheduleDays: ["Wednesday", "Saturday"],
    maxCapacity: 10,
    color: "#ec4899", // pink
  },
];

export const TEACHERS: Teacher[] = [
  {
    id: "tch_priya",
    name: "Priya Sharma",
    subject: "Mathematics & Science",
    classIds: ["cls_math_juniors", "cls_science_kids"],
    contact: "+852 9123 4567",
    joinDate: "2023-01-15",
  },
  {
    id: "tch_daniel",
    name: "Daniel O'Connor",
    subject: "English & Phonics",
    classIds: ["cls_english_starters"],
    contact: "+852 9234 5678",
    joinDate: "2023-06-02",
  },
  {
    id: "tch_mei",
    name: "Mei Ling Chan",
    subject: "Art & Creative Studies",
    classIds: ["cls_art_craft"],
    contact: "+852 9345 6789",
    joinDate: "2024-02-20",
  },
];

export const STUDENTS: Student[] = [
  {
    id: "stu_001",
    name: "Aiden Wong",
    age: 7,
    classId: "cls_math_juniors",
    parentName: "Karen Wong",
    parentContact: "+852 9876 1111",
    enrollmentDate: "2024-09-01",
    status: "active",
  },
  {
    id: "stu_002",
    name: "Sophia Lee",
    age: 6,
    classId: "cls_english_starters",
    parentName: "Michael Lee",
    parentContact: "+852 9876 2222",
    enrollmentDate: "2024-09-03",
    status: "active",
  },
  {
    id: "stu_003",
    name: "Ethan Chen",
    age: 8,
    classId: "cls_science_kids",
    parentName: "Jessica Chen",
    parentContact: "+852 9876 3333",
    enrollmentDate: "2024-08-22",
    status: "active",
  },
  {
    id: "stu_004",
    name: "Lily Tanaka",
    age: 5,
    classId: "cls_art_craft",
    parentName: "Hiroshi Tanaka",
    parentContact: "+852 9876 4444",
    enrollmentDate: "2025-01-10",
    status: "active",
  },
  {
    id: "stu_005",
    name: "Noah Ahmed",
    age: 7,
    classId: "cls_math_juniors",
    parentName: "Fatima Ahmed",
    parentContact: "+852 9876 5555",
    enrollmentDate: "2024-10-18",
    status: "active",
  },
  {
    id: "stu_006",
    name: "Olivia Park",
    age: 6,
    classId: "cls_english_starters",
    parentName: "James Park",
    parentContact: "+852 9876 6666",
    enrollmentDate: "2025-02-04",
    status: "inactive",
  },
  {
    id: "stu_007",
    name: "Lucas Garcia",
    age: 8,
    classId: "cls_science_kids",
    parentName: "Maria Garcia",
    parentContact: "+852 9876 7777",
    enrollmentDate: "2025-03-12",
    status: "active",
  },
  {
    id: "stu_008",
    name: "Zara Khan",
    age: 5,
    classId: "cls_art_craft",
    parentName: "Imran Khan",
    parentContact: "+852 9876 8888",
    enrollmentDate: "2025-04-01",
    status: "active",
  },
];

// Build invoices relative to "today" so the dashboard month metric works on any system date.
const today = new Date();
const thisMonth = format(today, "yyyy-MM");
const lastMonth = format(addDays(today, -35), "yyyy-MM");
const twoMonthsAgo = format(addDays(today, -65), "yyyy-MM");

export const INVOICES: Invoice[] = [
  {
    id: "inv_001",
    studentId: "stu_001",
    description: "Monthly tuition",
    amount: 1200,
    amountPaid: 1200,
    issueDate: `${thisMonth}-01`,
    dueDate: `${thisMonth}-15`,
    status: "Paid",
  },
  {
    id: "inv_002",
    studentId: "stu_002",
    description: "Monthly tuition",
    amount: 1000,
    amountPaid: 0,
    issueDate: `${thisMonth}-01`,
    dueDate: `${thisMonth}-15`,
    status: "Unpaid",
  },
  {
    id: "inv_003",
    studentId: "stu_003",
    description: "Monthly tuition + materials",
    amount: 1450,
    amountPaid: 700,
    issueDate: `${thisMonth}-01`,
    dueDate: `${thisMonth}-20`,
    status: "Partial",
  },
  {
    id: "inv_004",
    studentId: "stu_004",
    description: "Monthly tuition",
    amount: 900,
    amountPaid: 900,
    issueDate: `${lastMonth}-01`,
    dueDate: `${lastMonth}-15`,
    status: "Paid",
  },
  {
    id: "inv_005",
    studentId: "stu_005",
    description: "Monthly tuition",
    amount: 1200,
    amountPaid: 0,
    issueDate: `${thisMonth}-05`,
    dueDate: `${thisMonth}-25`,
    status: "Unpaid",
  },
  {
    id: "inv_006",
    studentId: "stu_007",
    description: "Monthly tuition",
    amount: 1450,
    amountPaid: 1450,
    issueDate: `${twoMonthsAgo}-01`,
    dueDate: `${twoMonthsAgo}-15`,
    status: "Paid",
  },
];

// 5 sessions spread across the current week so calendar always has events.
const weekStart = startOfWeek(today, { weekStartsOn: 1 });
const fmt = (d: Date) => format(d, "yyyy-MM-dd");

export const SESSIONS: ClassSession[] = [
  {
    id: "ses_001",
    classId: "cls_math_juniors",
    teacherId: "tch_priya",
    date: fmt(addDays(weekStart, 0)), // Mon
    startTime: "09:00",
    endTime: "10:00",
    room: "Room A",
  },
  {
    id: "ses_002",
    classId: "cls_english_starters",
    teacherId: "tch_daniel",
    date: fmt(addDays(weekStart, 1)), // Tue
    startTime: "10:30",
    endTime: "11:30",
    room: "Room B",
  },
  {
    id: "ses_003",
    classId: "cls_art_craft",
    teacherId: "tch_mei",
    date: fmt(addDays(weekStart, 2)), // Wed
    startTime: "14:00",
    endTime: "15:30",
    room: "Studio 1",
  },
  {
    id: "ses_004",
    classId: "cls_science_kids",
    teacherId: "tch_priya",
    date: fmt(addDays(weekStart, 3)), // Thu
    startTime: "13:00",
    endTime: "14:00",
    room: "Lab",
  },
  {
    id: "ses_005",
    classId: "cls_math_juniors",
    teacherId: "tch_priya",
    date: fmt(addDays(weekStart, 4)), // Fri
    startTime: "09:00",
    endTime: "10:00",
    room: "Room A",
  },
];

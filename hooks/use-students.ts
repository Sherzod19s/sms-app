"use client";

import type { Student } from "@/lib/types";
import { STUDENTS } from "@/lib/seed-data";
import { createCRUDHook } from "./create-crud-hook";

export const useStudents = createCRUDHook<Student>("sms:students", STUDENTS, "stu");

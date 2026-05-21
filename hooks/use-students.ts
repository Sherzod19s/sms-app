"use client";

import type { Student } from "@/lib/types";
import {
  studentFromRow,
  studentToRow,
  type StudentRow,
} from "@/lib/supabase/mappers";
import { createCRUDHook } from "./create-crud-hook";

export const useStudents = createCRUDHook<Student, StudentRow>({
  table: "students",
  orderBy: { column: "created_at", ascending: false },
  fromRow: studentFromRow,
  toRow: studentToRow,
});

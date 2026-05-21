"use client";

import type { ClassRoom } from "@/lib/types";
import { classFromRow, classToRow, type ClassRow } from "@/lib/supabase/mappers";
import { createCRUDHook } from "./create-crud-hook";

export const useClasses = createCRUDHook<ClassRoom, ClassRow>({
  table: "classes",
  orderBy: { column: "created_at", ascending: true },
  fromRow: classFromRow,
  toRow: classToRow,
});

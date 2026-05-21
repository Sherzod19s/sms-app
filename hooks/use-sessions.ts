"use client";

import type { ClassSession } from "@/lib/types";
import {
  sessionFromRow,
  sessionToRow,
  type SessionRow,
} from "@/lib/supabase/mappers";
import { createCRUDHook } from "./create-crud-hook";

export const useSessions = createCRUDHook<ClassSession, SessionRow>({
  table: "sessions",
  orderBy: { column: "date", ascending: true },
  fromRow: sessionFromRow,
  toRow: sessionToRow,
});

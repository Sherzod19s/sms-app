"use client";

import type { Expense } from "@/lib/types";
import {
  expenseFromRow,
  expenseToRow,
  type ExpenseRow,
} from "@/lib/supabase/mappers";
import { createCRUDHook } from "./create-crud-hook";

export const useExpenses = createCRUDHook<Expense, ExpenseRow>({
  table: "expenses",
  orderBy: { column: "date", ascending: false },
  fromRow: expenseFromRow,
  toRow: expenseToRow,
});

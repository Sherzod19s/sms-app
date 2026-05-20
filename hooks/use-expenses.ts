"use client";

import type { Expense } from "@/lib/types";
import { EXPENSES } from "@/lib/seed-data";
import { createCRUDHook } from "./create-crud-hook";

export const useExpenses = createCRUDHook<Expense>("sms:expenses", EXPENSES, "exp");

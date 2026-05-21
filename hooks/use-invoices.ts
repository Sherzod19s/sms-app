"use client";

import type { Invoice } from "@/lib/types";
import {
  invoiceFromRow,
  invoiceToRow,
  type InvoiceRow,
} from "@/lib/supabase/mappers";
import { createCRUDHook } from "./create-crud-hook";

export const useInvoices = createCRUDHook<Invoice, InvoiceRow>({
  table: "invoices",
  orderBy: { column: "issue_date", ascending: false },
  fromRow: invoiceFromRow,
  toRow: invoiceToRow,
});

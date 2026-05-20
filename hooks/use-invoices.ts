"use client";

import type { Invoice } from "@/lib/types";
import { INVOICES } from "@/lib/seed-data";
import { createCRUDHook } from "./create-crud-hook";

export const useInvoices = createCRUDHook<Invoice>("sms:invoices", INVOICES, "inv");

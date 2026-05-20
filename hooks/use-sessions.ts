"use client";

import type { ClassSession } from "@/lib/types";
import { SESSIONS } from "@/lib/seed-data";
import { createCRUDHook } from "./create-crud-hook";

export const useSessions = createCRUDHook<ClassSession>("sms:sessions", SESSIONS, "ses");

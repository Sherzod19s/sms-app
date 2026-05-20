"use client";

import type { Teacher } from "@/lib/types";
import { TEACHERS } from "@/lib/seed-data";
import { createCRUDHook } from "./create-crud-hook";

export const useTeachers = createCRUDHook<Teacher>("sms:teachers", TEACHERS, "tch");

"use client";

import type { ClassRoom } from "@/lib/types";
import { CLASSES } from "@/lib/seed-data";
import { createCRUDHook } from "./create-crud-hook";

export const useClasses = createCRUDHook<ClassRoom>("sms:classes", CLASSES, "cls");

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";

export function ContentWrap({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();
  return (
    <div
      className={cn(
        "flex min-h-screen flex-col transition-[padding] duration-300 ease-out",
        collapsed ? "lg:pl-[72px]" : "lg:pl-[260px]"
      )}
    >
      {children}
    </div>
  );
}

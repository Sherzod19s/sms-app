"use client";

import { Bell, Moon, Settings, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { MobileNav } from "./mobile-nav";
import { useInvoices } from "@/hooks/use-invoices";
import { useStudents } from "@/hooks/use-students";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data: invoices, hydrated } = useInvoices();
  const { data: students } = useStudents();

  useEffect(() => setMounted(true), []);

  const unpaidInvoices = hydrated
    ? invoices.filter((i) => i.status === "Unpaid" || i.status === "Partial")
    : [];
  const unpaidCount = unpaidInvoices.length;
  const today = new Date();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <MobileNav />

      <div className="hidden flex-col leading-tight sm:flex">
        <span className="font-display text-base font-semibold tracking-tight">
          Aqlvoy Sen Learning Centre
        </span>
        <span className="text-xs text-muted-foreground">
          {format(today, "EEEE, d MMMM yyyy")}
        </span>
      </div>

      <div className="ml-auto flex items-center gap-1">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {mounted && theme === "dark" ? (
            <Sun className="h-[18px] w-[18px]" />
          ) : (
            <Moon className="h-[18px] w-[18px]" />
          )}
        </Button>

        {/* Settings */}
        <Button
          asChild
          variant="ghost"
          size="icon"
          aria-label="Settings"
        >
          <Link href="/settings">
            <Settings className="h-[18px] w-[18px]" />
          </Link>
        </Button>

        {/* Notification bell */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="h-[18px] w-[18px]" />
              {unpaidCount > 0 && (
                <span className="absolute right-1.5 top-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-none text-destructive-foreground">
                  {unpaidCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="border-b p-3">
              <p className="text-sm font-semibold">Notifications</p>
              <p className="text-xs text-muted-foreground">
                {unpaidCount} invoice{unpaidCount === 1 ? "" : "s"} needing attention
              </p>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {unpaidInvoices.length === 0 ? (
                <p className="p-4 text-center text-sm text-muted-foreground">
                  All caught up ✨
                </p>
              ) : (
                unpaidInvoices.slice(0, 6).map((inv) => {
                  const stu = students.find((s) => s.id === inv.studentId);
                  return (
                    <div key={inv.id} className="border-b p-3 last:border-b-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{stu?.name ?? "Unknown"}</p>
                        <Badge variant={inv.status === "Unpaid" ? "danger" : "warning"}>
                          {inv.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Due {format(new Date(inv.dueDate), "d MMM")}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
            {unpaidCount > 0 && (
              <div className="border-t p-2">
                <Button asChild variant="ghost" size="sm" className="w-full">
                  <Link href="/finance">View all</Link>
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}

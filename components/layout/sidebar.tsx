"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, ChevronsRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NAV_ITEMS } from "./nav-items";
import { useSidebar } from "./sidebar-context";

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebar();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-30 hidden h-screen border-r bg-card transition-[width] duration-300 ease-out lg:flex lg:flex-col",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="font-display text-base font-semibold leading-tight tracking-tight">
              Brightseed
            </p>
            <p className="text-xs text-muted-foreground">Learning Centre</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col overflow-y-auto p-3">
        <div className="flex-1 space-y-1">
          {NAV_ITEMS.filter((i) => !i.footer).map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent/10 hover:text-foreground",
                  collapsed && "justify-center px-0"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Footer nav items pinned to the bottom with a divider */}
        {NAV_ITEMS.some((i) => i.footer) && (
          <div className="mt-2 space-y-1 border-t pt-2">
            {NAV_ITEMS.filter((i) => i.footer).map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent/10 hover:text-foreground",
                    collapsed && "justify-center px-0"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggle}
          className={cn("w-full justify-start gap-2 text-muted-foreground", collapsed && "justify-center px-0")}
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          {!collapsed && <span>Collapse</span>}
        </Button>
      </div>
    </aside>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/layout/sidebar-context";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, BookOpen, Receipt, Wallet, X
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/students",  label: "Students",  icon: Users },
  { href: "/classes",   label: "Classes",   icon: BookOpen },
  { href: "/invoices",  label: "Invoices",  icon: Receipt },
  { href: "/expenses",  label: "Expenses",  icon: Wallet },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={close} />
      )}
      <aside className={cn(
        "fixed top-0 left-0 z-30 h-full w-64 bg-white border-r flex flex-col transition-transform duration-200",
        "lg:translate-x-0 lg:static lg:z-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <span className="font-semibold text-lg">TutorApp</span>
          <button onClick={close} className="lg:hidden"><X size={18} /></button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname.startsWith(href)
                  ? "bg-teal-50 text-teal-700"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
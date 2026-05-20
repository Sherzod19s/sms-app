import {
  LayoutDashboard,
  GraduationCap,
  Wallet,
  Calendar,
  Users,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** When true, render with a separator above it (used to pin Settings to the bottom group). */
  footer?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/students", label: "Students", icon: GraduationCap },
  { href: "/finance", label: "Finance", icon: Wallet },
  { href: "/schedule", label: "Schedule", icon: Calendar },
  { href: "/teachers", label: "Teachers", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings, footer: true },
];

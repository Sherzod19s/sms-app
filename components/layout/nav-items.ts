import {
  LayoutDashboard,
  GraduationCap,
  Wallet,
  Calendar,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/students", label: "Students", icon: GraduationCap },
  { href: "/finance", label: "Finance", icon: Wallet },
  { href: "/schedule", label: "Schedule", icon: Calendar },
  { href: "/teachers", label: "Teachers", icon: Users },
];

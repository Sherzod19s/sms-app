"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AvatarInitials } from "@/components/shared/avatar-initials";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type ThemeChoice = "light" | "dark" | "system";

type Account = {
  fullName: string;
  email: string;
  role: "admin" | "teacher";
};

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [account, setAccount] = useState<Account | null>(null);
  const [loadingAccount, setLoadingAccount] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user || cancelled) {
        setLoadingAccount(false);
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", authData.user.id)
        .single();
      if (cancelled) return;
      setAccount({
        fullName: profile?.full_name ?? authData.user.email ?? "User",
        email: authData.user.email ?? "",
        role: (profile?.role as "admin" | "teacher") ?? "teacher",
      });
      setLoadingAccount(false);
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account and appearance preferences.
        </p>
      </header>

      {/* My Account */}
      <Card>
        <CardHeader>
          <CardTitle>My account</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingAccount ? (
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
            </div>
          ) : account ? (
            <div className="flex items-center gap-4">
              <AvatarInitials name={account.fullName} size="lg" />
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg font-semibold leading-tight">
                  {account.fullName}
                </p>
                <p className="truncate text-sm text-muted-foreground">{account.email}</p>
                <Badge
                  variant={account.role === "admin" ? "info" : "secondary"}
                  className="mt-2 capitalize"
                >
                  {account.role}
                </Badge>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Not signed in.</p>
          )}
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <Label className="mb-2 block">Theme</Label>
          <div
            role="radiogroup"
            aria-label="Theme"
            className="inline-flex rounded-md border bg-secondary p-1"
          >
            <ThemeOption
              icon={<Sun className="h-4 w-4" />}
              label="Light"
              value="light"
              current={theme as ThemeChoice | undefined}
              onSelect={setTheme}
            />
            <ThemeOption
              icon={<Moon className="h-4 w-4" />}
              label="Dark"
              value="dark"
              current={theme as ThemeChoice | undefined}
              onSelect={setTheme}
            />
            <ThemeOption
              icon={<Monitor className="h-4 w-4" />}
              label="System"
              value="system"
              current={theme as ThemeChoice | undefined}
              onSelect={setTheme}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            System matches your operating system&rsquo;s light/dark preference.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function ThemeOption({
  icon,
  label,
  value,
  current,
  onSelect,
}: {
  icon: React.ReactNode;
  label: string;
  value: ThemeChoice;
  current: ThemeChoice | undefined;
  onSelect: (v: string) => void;
}) {
  const active = current === value;
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={() => onSelect(value)}
      className={cn(
        "inline-flex items-center gap-2 rounded-sm px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

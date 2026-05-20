"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

// Pre-fill defaults — these are the in-app branding values. A future task
// can wire these to localStorage so changes persist app-wide.
const CENTER_CONFIG = {
  centerName: "Aqlvoy Sen",
  adminName: "Botir Karimov",
  currencySymbol: "SM",
};

// All localStorage keys our CRUD hooks use. Listed explicitly so the reset
// is intentional and won't nuke unrelated keys.
const STORAGE_KEYS = [
  "sms:students",
  "sms:teachers",
  "sms:classes",
  "sms:invoices",
  "sms:sessions",
  "sms:expenses",
];

type ThemeChoice = "light" | "dark" | "system";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const [centerName, setCenterName] = useState(CENTER_CONFIG.centerName);
  const [adminName, setAdminName] = useState(CENTER_CONFIG.adminName);
  const [currencySymbol, setCurrencySymbol] = useState(CENTER_CONFIG.currencySymbol);

  const saveGeneral = () => {
    // In-memory only for now; persistence is a future task.
    toast.success("Settings saved");
  };

  const resetData = () => {
    STORAGE_KEYS.forEach((k) => window.localStorage.removeItem(k));
    toast.success("Data reset — reloading…");
    // Reload so all hooks re-seed from defaults on next mount.
    setTimeout(() => window.location.reload(), 600);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure centre details, appearance, and local data.
        </p>
      </header>

      {/* General */}
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="center-name" className="mb-1.5 block">
              Centre name
            </Label>
            <Input
              id="center-name"
              value={centerName}
              onChange={(e) => setCenterName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="admin-name" className="mb-1.5 block">
              Admin name
            </Label>
            <Input
              id="admin-name"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="currency-symbol" className="mb-1.5 block">
              Currency symbol
            </Label>
            <Input
              id="currency-symbol"
              value={currencySymbol}
              onChange={(e) => setCurrencySymbol(e.target.value)}
              className="max-w-[120px]"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Used when displaying monetary values throughout the app.
            </p>
          </div>
          <Separator />
          <div className="flex justify-end">
            <Button onClick={saveGeneral}>Save changes</Button>
          </div>
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

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm dark:border-amber-900/40 dark:bg-amber-900/20">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-amber-900 dark:text-amber-200">
              Resetting will permanently delete every student, teacher, class, invoice,
              session and expense in this browser, and reseed with the default sample
              data. This can&rsquo;t be undone.
            </p>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Reset to seed data</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset all data?</AlertDialogTitle>
                <AlertDialogDescription>
                  This clears every record across the six modules and reloads the page.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={resetData}>Reset data</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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

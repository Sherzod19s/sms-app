"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/layout/sidebar-context";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ContentWrap } from "@/components/layout/content-wrap";
import { PageTransition } from "@/components/layout/page-transition";

// Pages that should render WITHOUT the sidebar / header shell.
const BARE_ROUTES = ["/login", "/signup"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare = BARE_ROUTES.some((p) => pathname === p || pathname.startsWith(p + "/"));

  if (bare) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <Sidebar />
      <ContentWrap>
        <Header />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <PageTransition>{children}</PageTransition>
        </main>
      </ContentWrap>
    </SidebarProvider>
  );
}

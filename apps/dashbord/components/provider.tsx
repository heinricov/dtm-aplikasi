"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { usePathname } from "next/navigation";
import { TooltipProvider } from "@/components/ui/tooltip";
import LayoutDashboard from "./dashboard/layout-dashboard";
import { Toaster } from "@/components/ui/sonner";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/login" || pathname?.startsWith("/login");
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          {isLogin ? children : <LayoutDashboard>{children}</LayoutDashboard>}
        </TooltipProvider>
        <Toaster />
      </ThemeProvider>
    </>
  );
}

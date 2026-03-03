"use client";

import * as React from "react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";

export function DashboardBrand({
  brand
}: {
  brand: {
    name: string;
    icon: React.ElementType;
    version: string;
  };
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center gap-2 bg-accent rounded-lg">
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <brand.icon className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{brand.name}</span>
            <span className="truncate text-xs">{brand.version}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

"use client";

import * as React from "react";

import { NavCollaps } from "@/components/dashboard/nav-collaps";
import { NavMain } from "@/components/dashboard/nav-main";
import { NavUser } from "@/components/dashboard/nav-user";
import { DashboardBrand } from "@/components/dashboard/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from "@/components/ui/sidebar";
import { NavMenus } from "./nav-menu";
import { dataMenus } from "./data-menu";
import { SelectSeparator } from "../ui/select";
import WrapperRole from "../wrapper-role";
import { accessRole } from "@/services/access";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <DashboardBrand brand={dataMenus.brand} />
      </SidebarHeader>
      <SelectSeparator />
      <SidebarContent>
        <NavMenus items={dataMenus.menus} />
        <WrapperRole access={accessRole}>
          <NavCollaps title="Data" items={dataMenus.menuData} />
        </WrapperRole>
        <NavMain title="Documents" items={dataMenus.documents} />
      </SidebarContent>
      <SelectSeparator />
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

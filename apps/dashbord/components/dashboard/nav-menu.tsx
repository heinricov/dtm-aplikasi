"use client";

import { type Icon } from "@tabler/icons-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export function NavMenus({
  items
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const pathname = usePathname();
  const isActive = (url: string) => {
    if (!pathname) return false;
    if (url === "/dashboard") return pathname === url;
    return pathname === url || pathname.startsWith(`${url}/`);
  };
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <a href={item.url}>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={isActive(item.url)}
                >
                  {item.icon && <item.icon />}
                  {item.title}
                </SidebarMenuButton>
              </a>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

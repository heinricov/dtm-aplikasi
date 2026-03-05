"use client";

import { ChevronsUpDown, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar";
import { IconHelpCircle, IconSettings, IconUser } from "@tabler/icons-react";
import { logout } from "@/services/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getUserById } from "@/services/user";

export function NavUser() {
  const { isMobile } = useSidebar();
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    avatar?: string;
  }>({
    name: "User",
    email: "user@example.com",
    avatar: "/avatars/shadcn.jpg"
  });
  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined" ? localStorage.getItem("dtm_user") : null;
      if (raw) {
        const parsed = JSON.parse(raw) as { name?: string; email?: string };
        setUserData((prev) => ({
          ...prev,
          name: parsed?.name ?? prev.name,
          email: parsed?.email ?? prev.email
        }));
        return;
      }
      if (typeof document !== "undefined") {
        const cookie = document.cookie
          .split(";")
          .map((s) => s.trim())
          .find((c) => c.startsWith("access_token="));
        const token = cookie?.split("=")[1];
        if (token) {
          try {
            const parts = token.split(".");
            if (parts.length === 3) {
              const payloadStr = atob(parts[1]);
              const payload = JSON.parse(payloadStr) as {
                sub?: string;
                email?: string;
              };
              if (payload?.sub) {
                getUserById(payload.sub).then((u) => {
                  if (u) {
                    setUserData((prev) => ({
                      ...prev,
                      name: String(u.name ?? prev.name),
                      email: String(u.email ?? prev.email)
                    }));
                    try {
                      localStorage.setItem(
                        "dtm_user",
                        JSON.stringify({ name: u.name, email: u.email })
                      );
                    } catch {}
                  }
                });
              }
            }
          } catch {}
        }
      }
    } catch {
      // ignore
    }
  }, []);
  const router = useRouter();

  async function onLogout() {
    try {
      await logout();
      try {
        document.cookie =
          "access_token=; Path=/; Max-Age=0; SameSite=Lax; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        localStorage.removeItem("dtm_user");
      } catch {
        // ignore client cookie errors
      }
      toast.success("Logged out");
      router.push("/login");
    } catch (err) {
      const message =
        (err as { message?: string })?.message ?? "Failed to logout";
      toast.error(message);
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback className="rounded-lg">
                  {userData.name.toUpperCase().split("")[0]}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userData.name}</span>
                <span className="truncate text-xs">{userData.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback className="rounded-lg">
                    {userData.name.toUpperCase().split("")[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userData.name}</span>
                  <span className="truncate text-xs">{userData.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {/* <DropdownMenuItem>
                <IconUser />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconSettings />
                Settings
              </DropdownMenuItem> */}
              <DropdownMenuItem onClick={() => router.push("/helps")}>
                <IconHelpCircle />
                Helps
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                onLogout();
              }}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

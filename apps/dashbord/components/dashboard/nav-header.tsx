"use client";

import { Fragment } from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "../ui/breadcrumb";
import { ButtonTheme } from "./button-theme";
import { usePathname } from "next/navigation";

export default function NavHeader() {
  const pathname = usePathname();
  const segs = (pathname || "/").split("/").filter(Boolean);
  const baseIndex = segs[0] === "dashboard" ? 1 : 0;
  const trail = segs.slice(baseIndex);
  const toTitle = (s: string) =>
    decodeURIComponent(s)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (m) => m.toUpperCase());
  const baseHref = segs[0] === "dashboard" ? "/dashboard" : "/";
  let acc = baseHref;
  return (
    <header className="sticky top-0 z-50 flex h-17 shrink-0 items-center gap-2 border-b bg-background/80 backdrop-blur transition-[width,height] ease-linear supports-backdrop-filter:bg-background/60 group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href={baseHref}>
                {segs[0] === "dashboard" ? "Dashboard" : "Home"}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {trail.length > 0 && (
              <BreadcrumbSeparator className="hidden md:block" />
            )}
            {trail.map((seg, i) => {
              const isLast = i === trail.length - 1;
              acc = `${acc}/${seg}`;
              if (isLast) {
                return (
                  <BreadcrumbItem key={acc}>
                    <BreadcrumbPage>{toTitle(seg)}</BreadcrumbPage>
                  </BreadcrumbItem>
                );
              }
              return (
                <Fragment key={`${acc}-group`}>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href={acc}>{toTitle(seg)}</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="ml-auto pr-4">
        <ButtonTheme />
      </div>
    </header>
  );
}

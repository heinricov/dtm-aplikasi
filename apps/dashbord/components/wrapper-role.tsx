"use client";
import React, { useEffect, useMemo, useState } from "react";

export default function WrapperRole({
  children,
  menu,
  access
}: {
  children: React.ReactNode;
  menu?: string[];
  access?: Array<{
    role: string;
    dontHaveAccess: Array<{ url: string; titleMenu?: string }>;
  }>;
}) {
  const [role, setRole] = useState<string | null>(null);
  const decodeTokenPayload = (
    token: string
  ): { role?: string | null } | null => {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;
      const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const padded = base64.padEnd(
        base64.length + ((4 - (base64.length % 4)) % 4),
        "="
      );
      const json = atob(padded);
      return JSON.parse(json) as { role?: string | null };
    } catch {
      return null;
    }
  };
  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined" ? localStorage.getItem("dtm_user") : null;
      if (raw) {
        const parsed = JSON.parse(raw) as { role?: string | null };
        const nextRole = String(parsed?.role ?? "").toLowerCase();
        if (nextRole) {
          setRole(nextRole);
          return;
        }
      }
      if (typeof document !== "undefined") {
        const cookie = document.cookie
          .split(";")
          .map((s) => s.trim())
          .find((c) => c.startsWith("access_token="));
        const token = cookie?.split("=")[1];
        if (token) {
          const payload = decodeTokenPayload(token);
          const nextRole = String(payload?.role ?? "").toLowerCase();
          if (nextRole) {
            setRole(nextRole);
            return;
          }
        }
        return;
      }
    } catch {
      setRole(null);
    }
  }, []);
  const effectiveRole = role ?? "user";
  const isAdmin = effectiveRole === "admin";
  const hiddenPages = useMemo(() => {
    const fromMenu = menu ?? [];
    const fromAccess =
      access?.find(
        (r) =>
          String(r.role).toLowerCase() === String(effectiveRole).toLowerCase()
      )?.dontHaveAccess ?? [];
    const fromTitles = fromAccess
      .map((item) => String(item.titleMenu ?? ""))
      .filter(Boolean);
    return new Set([
      ...fromMenu,
      ...fromAccess.map((item) => String(item.url)),
      ...fromTitles
    ]);
  }, [access, menu, role]);
  const renderedChildren = useMemo(() => {
    if (isAdmin || ((!menu || menu.length === 0) && !access)) {
      return children;
    }
    return React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child;
      const props = child.props as { items?: Array<Record<string, unknown>> };
      if (!Array.isArray(props.items)) return child;
      const items = props.items
        .map((item) => {
          const url = String(item.url ?? "");
          const title = String(item.title ?? "");
          const childItems = Array.isArray(item.items)
            ? item.items.filter(
                (sub: { url?: string; title?: string }) =>
                  !hiddenPages.has(String(sub.url)) &&
                  !hiddenPages.has(String(sub.title))
              )
            : item.items;
          if (hiddenPages.has(url) || hiddenPages.has(title)) {
            if (Array.isArray(childItems) && childItems.length > 0) {
              return { ...item, items: childItems };
            }
            return null;
          }
          if (Array.isArray(childItems)) {
            return { ...item, items: childItems };
          }
          return item;
        })
        .filter(Boolean);
      if (items.length === 0) return null;
      return React.cloneElement(
        child as React.ReactElement<any>,
        { ...props, items } as any
      );
    });
  }, [access, children, hiddenPages, isAdmin, menu]);
  const shouldHideAll = !isAdmin && !access && (!menu || menu.length === 0);
  return (
    <div className={shouldHideAll ? "hidden" : ""}>
      <div>{renderedChildren}</div>
    </div>
  );
}

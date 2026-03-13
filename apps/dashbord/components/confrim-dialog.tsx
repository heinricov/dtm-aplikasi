"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Trash2Icon } from "lucide-react";

export function ConfirmDialog({
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  trigger,
  onConfirm,
  icon,
  dialogVarian = "destructive",
  open,
  onOpenChange,
  size = "sm"
}: {
  title?: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  trigger?: React.ReactNode;
  onConfirm: () => void | Promise<void>;
  icon?: React.ReactNode;
  dialogVarian?: "destructive" | "secondary";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: "default" | "sm";
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const controlled = typeof open === "boolean";
  const isOpen = controlled ? (open as boolean) : internalOpen;
  const setOpen = React.useCallback(
    (v: boolean) => {
      if (controlled) onOpenChange?.(v);
      else setInternalOpen(v);
    },
    [controlled, onOpenChange]
  );
  async function handleConfirm() {
    await onConfirm?.();
    setOpen(false);
  }
  return (
    <AlertDialog open={isOpen} onOpenChange={setOpen}>
      {trigger ? (
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      ) : null}
      <AlertDialogContent size={size}>
        <AlertDialogHeader>
          <AlertDialogMedia
            className={
              dialogVarian === "secondary"
                ? "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-500"
                : "bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive"
            }
          >
            {icon ?? <Trash2Icon />}
          </AlertDialogMedia>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description ? (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            variant={dialogVarian === "secondary" ? "secondary" : "destructive"}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

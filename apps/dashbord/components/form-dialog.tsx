"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

export function FormDialog({
  title,
  description,
  formFields,
  trigger,
  open: openProp,
  onOpenChange
}: {
  title: string;
  description: string;
  formFields:
    | React.ReactNode
    | ((utils: { close: () => void }) => React.ReactNode);
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = typeof openProp === "boolean";
  const open = isControlled ? (openProp as boolean) : internalOpen;
  const setOpen = React.useCallback(
    (val: boolean) => {
      if (isControlled) {
        onOpenChange?.(val);
      } else {
        setInternalOpen(val);
      }
    },
    [isControlled, onOpenChange]
  );
  const close = React.useCallback(() => setOpen(false), [setOpen]);

  const renderedFields = React.useMemo(() => {
    if (typeof formFields === "function") {
      return formFields({ close });
    }
    if (React.isValidElement(formFields)) {
      return React.cloneElement(
        formFields as React.ReactElement<any>,
        {
          onSuccessClose: close
        } as any
      );
    }
    return formFields;
  }, [formFields, close]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <Button variant="outline">Open Dialog</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {renderedFields}
      </DialogContent>
    </Dialog>
  );
}

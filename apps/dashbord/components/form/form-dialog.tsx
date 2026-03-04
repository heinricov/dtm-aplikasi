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
  trigger
}: {
  title: string;
  description: string;
  formFields:
    | React.ReactNode
    | ((utils: { close: () => void }) => React.ReactNode);
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const close = React.useCallback(() => setOpen(false), []);

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

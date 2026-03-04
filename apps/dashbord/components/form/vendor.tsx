"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../ui/field";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { createVendor } from "@/services/vendor";
import { toast } from "sonner";

export default function VendorForm({
  onSuccessClose
}: {
  onSuccessClose?: () => void;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const title = String(fd.get("title") ?? "").trim();
    const name = String(fd.get("name") ?? "").trim();
    const description = String(fd.get("description") ?? "").trim();
    try {
      setSubmitting(true);
      await createVendor({
        title,
        name,
        description: description || undefined
      });
      form.reset();
      router.refresh();
      onSuccessClose?.();
      toast.success("Vendor created successfully");
    } catch (err) {
      const message =
        (err as { message?: string })?.message ?? "Failed to create";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <form onSubmit={onSubmit}>
      <FieldGroup>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input
                id="title"
                name="title"
                placeholder="Input Title here"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                name="name"
                placeholder="Input Name here"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="description-1">Description</FieldLabel>
              <Input
                id="description-1"
                name="description"
                placeholder="Input Description here"
              />
            </Field>
          </FieldGroup>
          <Separator className="my-4" />
          <DialogFooter className="flex justify-end px-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Add New"}
            </Button>
          </DialogFooter>
        </FieldSet>
      </FieldGroup>
    </form>
  );
}

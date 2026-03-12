"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../ui/field";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { createVendor, updateVendor, type Vendor } from "@/services/vendor";
import { toast } from "sonner";

export default function VendorForm({
  onSuccessClose,
  onSuccess,
  mode = "create",
  initial
}: {
  onSuccessClose?: () => void;
  onSuccess?: (value: Vendor) => void;
  mode?: "create" | "edit" | "view";
  initial?: Partial<Vendor> & { id?: string };
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const isView = mode === "view";
  const isEdit = mode === "edit";

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
      if (isView) return;
      if (isEdit && initial?.id) {
        const updated = await updateVendor(initial.id as string, {
          title,
          name,
          description
        });
        onSuccess?.(updated);
        toast.success("Vendor updated successfully");
      } else {
        const created = await createVendor({
          title,
          name,
          description: description || undefined
        });
        onSuccess?.(created);
        toast.success("Vendor created successfully");
      }
      form.reset();
      router.refresh();
      onSuccessClose?.();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("vendor:updated"));
      }
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
                defaultValue={initial?.title ? String(initial.title) : ""}
                disabled={isView}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                name="name"
                placeholder="Input Name here"
                defaultValue={initial?.name ? String(initial.name) : ""}
                disabled={isView}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="description-1">Description</FieldLabel>
              <Input
                id="description-1"
                name="description"
                placeholder="Input Description here"
                defaultValue={
                  initial?.description ? String(initial.description) : ""
                }
                disabled={isView}
              />
            </Field>
          </FieldGroup>
          <Separator className="my-4" />
          <DialogFooter className="flex justify-end px-4">
            <DialogClose asChild>
              <Button variant="outline">{isView ? "Close" : "Cancel"}</Button>
            </DialogClose>
            {!isView && (
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : isEdit ? "Update" : "Add New"}
              </Button>
            )}
          </DialogFooter>
        </FieldSet>
      </FieldGroup>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../ui/field";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { createSender, updateSender, type Sender } from "@/services/sender";
import { toast } from "sonner";

export default function SenderForm({
  onSuccessClose,
  onSuccess,
  mode = "create",
  initial
}: {
  onSuccessClose?: () => void;
  onSuccess?: (value: Sender) => void;
  mode?: "create" | "edit" | "view";
  initial?: Partial<Sender> & { id?: string };
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const isView = mode === "view";
  const isEdit = mode === "edit";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    if (isView) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "").trim();
    const description = String(fd.get("description") ?? "").trim();
    try {
      setSubmitting(true);
      if (isEdit && initial?.id) {
        const updated = await updateSender(initial.id as string, {
          name,
          description
        });
        onSuccess?.(updated);
        toast.success("Sender updated successfully");
      } else {
        const created = await createSender({
          name,
          description: description || undefined
        });
        onSuccess?.(created);
        toast.success("Sender created successfully");
      }
      form.reset();
      router.refresh();
      onSuccessClose?.();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("sender:updated"));
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

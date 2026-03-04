"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../ui/field";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { createUser, updateUser, type User } from "@/services/user";
import { toast } from "sonner";

export default function UserForm({
  onSuccessClose,
  mode = "create",
  initial
}: {
  onSuccessClose?: () => void;
  mode?: "create" | "edit" | "view";
  initial?: Partial<User> & { id?: string };
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
    const email = String(fd.get("email") ?? "").trim();
    const roleRaw = String(fd.get("role") ?? "");
    const password = String(fd.get("password") ?? "");
    try {
      setSubmitting(true);
      if (isEdit && initial?.id) {
        const payload: Partial<{
          name: string;
          email: string;
          password: string;
          role: string | null;
        }> = { name, email, role: roleRaw };
        if (password.trim().length > 0) {
          payload.password = password;
        }
        await updateUser(initial.id as string, payload);
        toast.success("User updated successfully");
      } else {
        await createUser({
          name,
          email,
          password,
          role: roleRaw || null
        });
        toast.success("User created successfully");
      }
      form.reset();
      router.refresh();
      onSuccessClose?.();
    } catch (err) {
      const message =
        (err as { message?: string })?.message ?? "Failed to submit";
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
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Input Email here"
                defaultValue={initial?.email ? String(initial.email) : ""}
                disabled={isView}
                required
              />
            </Field>
            {!isView && (
              <Field>
                <FieldLabel htmlFor="password">
                  {isEdit ? "New Password (optional)" : "Password"}
                </FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder={
                    isEdit ? "Leave blank to keep current" : "Input Password"
                  }
                  required={!isEdit}
                />
              </Field>
            )}
            <Field>
              <FieldLabel htmlFor="role">Role</FieldLabel>
              <Input
                id="role"
                name="role"
                placeholder="Input Role here (optional)"
                defaultValue={initial?.role != null ? String(initial.role) : ""}
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

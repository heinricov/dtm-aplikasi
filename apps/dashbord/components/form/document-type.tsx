import { Field, FieldGroup, FieldLabel, FieldSet } from "../ui/field";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";

export default function DocumentTypeForm() {
  return (
    <form>
      <FieldGroup>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name-1">Name</FieldLabel>
              <Input
                id="name-1"
                name="name"
                placeholder="Evil Rabbit"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="username-1">Username</FieldLabel>
              <Input
                id="username-1"
                name="username"
                placeholder="@evilrabbit"
              />
            </Field>
          </FieldGroup>
          <Separator className="my-4" />
          <DialogFooter className="flex justify-end px-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </FieldSet>
      </FieldGroup>
    </form>
  );
}

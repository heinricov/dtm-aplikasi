"use client";
import * as React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import {
  createIncomingDocument,
  updateIncomingDocument,
  type IncomingDocument
} from "@/services/incoming-document";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../ui/select";
import { getDocumentTypes, type DocumentType } from "@/services/document-type";
import { getSenders, type Sender } from "@/services/sender";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export default function IncomingDocumentForm({
  onSuccessClose,
  mode = "create",
  initial
}: {
  onSuccessClose?: () => void;
  mode?: "create" | "edit" | "view";
  initial?: Partial<IncomingDocument> & { id?: string };
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const [docTypes, setDocTypes] = useState<DocumentType[]>([]);
  const [documentTypeId, setDocumentTypeId] = useState(
    initial?.document_type_id ? String(initial.document_type_id) : ""
  );
  const [senders, setSenders] = useState<Sender[]>([]);
  const [senderId, setSenderId] = useState(
    initial?.sender_id ? String(initial.sender_id) : ""
  );
  const [receiptDate, setReceiptDate] = useState(
    initial?.document_receipt_date
      ? String(initial.document_receipt_date).slice(0, 10)
      : ""
  );
  const [titleValue, setTitleValue] = useState(
    initial?.title ? String(initial.title) : ""
  );
  const [userId, setUserId] = useState(
    initial?.user_id ? String(initial.user_id) : ""
  );
  const [section, setSection] = useState<
    "form" | "next" | "invoice" | "pl" | "do"
  >("form");
  const nextDisabled =
    isView ||
    receiptDate.trim() === "" ||
    titleValue.trim() === "" ||
    documentTypeId.trim() === "" ||
    senderId.trim() === "";

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await getDocumentTypes();
        if (mounted) setDocTypes(list);
      } catch {
        if (mounted) setDocTypes([]);
      }
      try {
        const sList = await getSenders();
        if (mounted) setSenders(sList);
      } catch {
        if (mounted) setSenders([]);
      }
      try {
        const raw =
          typeof window !== "undefined"
            ? localStorage.getItem("dtm_user")
            : null;
        if (raw) {
          const parsed = JSON.parse(raw) as { id?: string };
          if (parsed?.id && mounted) {
            setUserId(String(parsed.id));
          }
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    if (isView) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const user_id = String(fd.get("user_id") ?? "").trim();
    const document_receipt_date = String(
      fd.get("document_receipt_date") ?? ""
    ).trim();
    const document_type_id = String(fd.get("document_type_id") ?? "").trim();
    const sender_id = String(fd.get("sender_id") ?? "").trim();
    const qtyRaw = String(fd.get("qty") ?? "").trim();
    const qty = qtyRaw ? Number(qtyRaw) : undefined;
    const title = String(fd.get("title") ?? "").trim();
    const note = String(fd.get("note") ?? "").trim();
    const description = String(fd.get("description") ?? "").trim();
    try {
      setSubmitting(true);
      if (isEdit && initial?.id) {
        await updateIncomingDocument(initial.id as string, {
          user_id,
          document_receipt_date,
          title,
          document_type_id,
          sender_id,
          qty,
          note,
          description
        });
        toast.success("Incoming document updated successfully");
      } else {
        await createIncomingDocument({
          user_id,
          document_receipt_date,
          title: title || undefined,
          document_type_id,
          sender_id,
          qty,
          note: note || undefined,
          description: description || undefined
        });
        toast.success("Incoming document created successfully");
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
      {section === "form" && (
        <IncomingDocumentFields
          initial={initial}
          isView={isView}
          docTypes={docTypes}
          documentTypeId={documentTypeId}
          setDocumentTypeId={setDocumentTypeId}
          senders={senders}
          senderId={senderId}
          setSenderId={setSenderId}
          userId={userId}
          setReceiptDate={setReceiptDate}
          setTitleValue={setTitleValue}
        />
      )}
      {section === "next" && (
        <NextPageButton
          onInvoice={() => setSection("invoice")}
          onPl={() => setSection("pl")}
          onDo={() => setSection("do")}
        />
      )}
      {section === "invoice" && <InvoiceField />}
      {section === "pl" && <PlField />}
      {section === "do" && <DoField />}
      <Separator className="my-4" />
      <DialogFooter className="flex justify-end px-4">
        <DialogClose asChild>
          <Button variant="outline">{isView ? "Close" : "Cancel"}</Button>
        </DialogClose>
        {!isView && section !== "form" && (
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : isEdit ? "Update" : "Add New"}
          </Button>
        )}
        {section === "form" && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setSection("next")}
            disabled={nextDisabled}
          >
            Next
          </Button>
        )}
      </DialogFooter>
    </form>
  );
}

export function IncomingDocumentFields({
  initial,
  isView,
  docTypes,
  documentTypeId,
  setDocumentTypeId,
  senders,
  senderId,
  setSenderId,
  userId,
  setReceiptDate,
  setTitleValue
}: {
  initial?: Partial<IncomingDocument> & { id?: string };
  isView: boolean;
  docTypes: DocumentType[];
  documentTypeId: string;
  setDocumentTypeId: (value: string) => void;
  senders: Sender[];
  senderId: string;
  setSenderId: (value: string) => void;
  userId: string;
  setReceiptDate: (value: string) => void;
  setTitleValue: (value: string) => void;
}) {
  return (
    <FieldGroup className="">
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="document_receipt_date">Receipt Date</FieldLabel>
          <Input
            id="document_receipt_date"
            name="document_receipt_date"
            type="date"
            placeholder="YYYY-MM-DD"
            defaultValue={
              initial?.document_receipt_date
                ? String(initial.document_receipt_date).slice(0, 10)
                : ""
            }
            disabled={isView}
            required
            onChange={(e) => setReceiptDate(e.currentTarget.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="title">Title</FieldLabel>
          <Input
            id="title"
            name="title"
            placeholder="Title"
            defaultValue={initial?.title ? String(initial.title) : ""}
            disabled={isView}
            onChange={(e) => setTitleValue(e.currentTarget.value)}
          />
        </Field>
        <Field className="hidden">
          <FieldLabel htmlFor="user_id">User</FieldLabel>
          <Input
            id="user_id"
            name="user_id"
            placeholder="User ID"
            value={userId}
            readOnly
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="document_type_id">Document Type</FieldLabel>
          <Select value={documentTypeId} onValueChange={setDocumentTypeId}>
            <SelectTrigger disabled={isView}>
              <SelectValue placeholder="Choose document type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {docTypes.map((dt) => (
                  <SelectItem key={dt.id} value={dt.id}>
                    {dt.title}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FieldDescription>
            Select document type for this incoming document.
          </FieldDescription>
          <input type="hidden" name="document_type_id" value={documentTypeId} />
        </Field>
        <Field>
          <FieldLabel htmlFor="sender_id">Sender</FieldLabel>
          <Select value={senderId} onValueChange={setSenderId}>
            <SelectTrigger disabled={isView}>
              <SelectValue placeholder="Choose sender" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {senders.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FieldDescription>
            Select the sender for this document.
          </FieldDescription>
          <input type="hidden" name="sender_id" value={senderId} />
        </Field>
        <Field>
          <FieldLabel htmlFor="qty">Quantity</FieldLabel>
          <Input
            id="qty"
            name="qty"
            type="number"
            placeholder="Quantity"
            defaultValue={
              typeof initial?.qty === "number" ? String(initial.qty) : ""
            }
            disabled={isView}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="note">Note</FieldLabel>
          <Input
            id="note"
            name="note"
            placeholder="Note"
            defaultValue={initial?.note ? String(initial.note) : ""}
            disabled={isView}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Input
            id="description"
            name="description"
            placeholder="Description"
            defaultValue={
              initial?.description ? String(initial.description) : ""
            }
            disabled={isView}
          />
        </Field>
      </div>
    </FieldGroup>
  );
}

export function NextPageButton({
  onInvoice,
  onPl,
  onDo
}: {
  onInvoice: () => void;
  onPl: () => void;
  onDo: () => void;
}) {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4">
        <Button variant="outline" className="w-64" onClick={onInvoice}>
          INVOICE
        </Button>
        <Button variant="outline" className="w-64" onClick={onDo}>
          Delivery Order
        </Button>
        <Button variant="outline" className="w-64" onClick={onPl}>
          Packing List
        </Button>
      </div>
    </>
  );
}

export function InvoiceField() {
  const [date, setDate] = React.useState<Date>();
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="checkout-7j9-exp-year-f59">Silo</FieldLabel>
        <Select defaultValue="">
          <SelectTrigger id="checkout-7j9-exp-year-f59">
            <SelectValue placeholder="YYYY" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="2024">BPT</SelectItem>
              <SelectItem value="2025">CTI</SelectItem>
              <SelectItem value="2026">CDT</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <FieldLabel htmlFor="checkout-7j9-exp-year-f59">Vendor</FieldLabel>
        <Select defaultValue="">
          <SelectTrigger id="checkout-7j9-exp-year-f59">
            <SelectValue placeholder="YYYY" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="2024">PT Indra</SelectItem>
              <SelectItem value="2025">PT Advance</SelectItem>
              <SelectItem value="2026">PT Prima</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <FieldLabel htmlFor="checkout-7j9-card-name-43j">
          Invoice Number
        </FieldLabel>
        <Input
          id="checkout-7j9-card-name-43j"
          placeholder="Evil Rabbit"
          required
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
          PO Number
        </FieldLabel>
        <Input
          id="checkout-7j9-card-number-uw1"
          placeholder="1234 5678 9012 3456"
          required
        />
      </Field>
      <Field className="mx-auto w-44">
        <FieldLabel htmlFor="date-picker-simple">Date</FieldLabel>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker-simple"
              className="justify-start font-normal"
            >
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              defaultMonth={date}
            />
          </PopoverContent>
        </Popover>
      </Field>
    </FieldGroup>
  );
}

export function PlField() {
  const [date, setDate] = React.useState<Date>();
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="checkout-7j9-exp-year-f59">Silo</FieldLabel>
        <Select defaultValue="">
          <SelectTrigger id="checkout-7j9-exp-year-f59">
            <SelectValue placeholder="YYYY" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="2024">BPT</SelectItem>
              <SelectItem value="2025">CTI</SelectItem>
              <SelectItem value="2026">CDT</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <FieldLabel htmlFor="checkout-7j9-exp-year-f59">Vendor</FieldLabel>
        <Select defaultValue="">
          <SelectTrigger id="checkout-7j9-exp-year-f59">
            <SelectValue placeholder="YYYY" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="2024">PT Indra</SelectItem>
              <SelectItem value="2025">PT Advance</SelectItem>
              <SelectItem value="2026">PT Prima</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <FieldLabel htmlFor="checkout-7j9-card-name-43j">
          Invoice Number
        </FieldLabel>
        <Input
          id="checkout-7j9-card-name-43j"
          placeholder="Evil Rabbit"
          required
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
          PO Number
        </FieldLabel>
        <Input
          id="checkout-7j9-card-number-uw1"
          placeholder="1234 5678 9012 3456"
          required
        />
      </Field>
      <Field className="mx-auto w-44">
        <FieldLabel htmlFor="date-picker-simple">Date</FieldLabel>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker-simple"
              className="justify-start font-normal"
            >
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              defaultMonth={date}
            />
          </PopoverContent>
        </Popover>
      </Field>
    </FieldGroup>
  );
}

export function DoField() {
  const [date, setDate] = React.useState<Date>();
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="checkout-7j9-exp-year-f59">Silo</FieldLabel>
        <Select defaultValue="">
          <SelectTrigger id="checkout-7j9-exp-year-f59">
            <SelectValue placeholder="YYYY" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="2024">BPT</SelectItem>
              <SelectItem value="2025">CTI</SelectItem>
              <SelectItem value="2026">CDT</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <FieldLabel htmlFor="checkout-7j9-exp-year-f59">Vendor</FieldLabel>
        <Select defaultValue="">
          <SelectTrigger id="checkout-7j9-exp-year-f59">
            <SelectValue placeholder="YYYY" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="2024">PT Indra</SelectItem>
              <SelectItem value="2025">PT Advance</SelectItem>
              <SelectItem value="2026">PT Prima</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <FieldLabel htmlFor="checkout-7j9-card-name-43j">
          Invoice Number
        </FieldLabel>
        <Input
          id="checkout-7j9-card-name-43j"
          placeholder="Evil Rabbit"
          required
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
          PO Number
        </FieldLabel>
        <Input
          id="checkout-7j9-card-number-uw1"
          placeholder="1234 5678 9012 3456"
          required
        />
      </Field>
      <Field className="mx-auto w-44">
        <FieldLabel htmlFor="date-picker-simple">Date</FieldLabel>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker-simple"
              className="justify-start font-normal"
            >
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              defaultMonth={date}
            />
          </PopoverContent>
        </Popover>
      </Field>
    </FieldGroup>
  );
}

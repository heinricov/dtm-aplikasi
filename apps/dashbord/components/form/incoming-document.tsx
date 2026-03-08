"use client";
import * as React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet
} from "../ui/field";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import {
  createIncomingDocument,
  updateIncomingDocument,
  type IncomingDocument
} from "@/services/incoming-document";
import { createReceiptInvoice } from "@/services/receipt-invoice";
import { createReceiptPl } from "@/services/receipt-pl";
import { createReceiptDo } from "@/services/receipt-do";
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
import { getSilos, type Silo } from "@/services/silo";
import { getVendors, type Vendor } from "@/services/vendor";
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
  const [silos, setSilos] = useState<Silo[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [receiptDate, setReceiptDate] = useState(
    initial?.document_receipt_date
      ? String(initial.document_receipt_date).slice(0, 10)
      : ""
  );
  const [titleValue, setTitleValue] = useState(
    initial?.title ? String(initial.title) : ""
  );
  const [qtyValue, setQtyValue] = useState(
    typeof initial?.qty === "number" ? String(initial.qty) : ""
  );
  const [noteValue, setNoteValue] = useState(
    initial?.note ? String(initial.note) : ""
  );
  const [descriptionValue, setDescriptionValue] = useState(
    initial?.description ? String(initial.description) : ""
  );
  const [userId, setUserId] = useState(
    initial?.user_id ? String(initial.user_id) : ""
  );
  const [section, setSection] = useState<
    "form" | "next" | "invoice" | "pl" | "do"
  >("form");
  const [invoiceSiloId, setInvoiceSiloId] = useState("");
  const [invoiceVendorId, setInvoiceVendorId] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoicePo, setInvoicePo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState<Date>();
  const [plSiloId, setPlSiloId] = useState("");
  const [plNo, setPlNo] = useState("");
  const [plShipRef, setPlShipRef] = useState("");
  const [plDate, setPlDate] = useState<Date>();
  const [doSiloId, setDoSiloId] = useState("");
  const [doVendorId, setDoVendorId] = useState("");
  const [doNo, setDoNo] = useState("");
  const [doPid, setDoPid] = useState("");
  const [doDate, setDoDate] = useState<Date>();
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
        const siloList = await getSilos();
        if (mounted) setSilos(siloList);
      } catch {
        if (mounted) setSilos([]);
      }
      try {
        const vendorList = await getVendors();
        if (mounted) setVendors(vendorList);
      } catch {
        if (mounted) setVendors([]);
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
    const user_id = userId.trim();
    const document_receipt_date = receiptDate.trim();
    const document_type_id = documentTypeId.trim();
    const sender_id = senderId.trim();
    const qty = qtyValue.trim() ? Number(qtyValue.trim()) : undefined;
    const title = titleValue.trim();
    const note = noteValue.trim();
    const description = descriptionValue.trim();
    try {
      setSubmitting(true);
      let incomingId = initial?.id ? String(initial.id) : "";
      if (isEdit && incomingId) {
        await updateIncomingDocument(incomingId, {
          user_id,
          document_receipt_date,
          title,
          document_type_id,
          sender_id,
          qty,
          note,
          description
        });
      } else {
        const created = await createIncomingDocument({
          user_id,
          document_receipt_date,
          title: title || undefined,
          document_type_id,
          sender_id,
          qty,
          note: note || undefined,
          description: description || undefined
        });
        incomingId = String(created?.id ?? "");
      }
      if (section === "invoice") {
        await createReceiptInvoice({
          incoming_document_id: incomingId,
          silo_id: invoiceSiloId,
          vendor_id: invoiceVendorId,
          no_invoice: invoiceNo || undefined,
          no_po: invoicePo || undefined,
          scan_date: invoiceDate
        });
        toast.success("Receipt invoice created successfully");
      } else if (section === "pl") {
        await createReceiptPl({
          incoming_document_id: incomingId,
          silo_id: plSiloId,
          no_pl: plNo,
          ship_ref: plShipRef,
          scan_date: plDate
        });
        toast.success("Receipt packing list created successfully");
      } else if (section === "do") {
        await createReceiptDo({
          incoming_document_id: incomingId,
          silo_id: doSiloId,
          vendor_id: doVendorId,
          no_do: doNo,
          no_pid: doPid,
          scan_date: doDate
        });
        toast.success("Receipt delivery order created successfully");
      } else {
        toast.success(
          isEdit
            ? "Incoming document updated successfully"
            : "Incoming document created successfully"
        );
      }
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
          setQtyValue={setQtyValue}
          setNoteValue={setNoteValue}
          setDescriptionValue={setDescriptionValue}
        />
      )}
      {section === "next" && (
        <NextPageButton
          onInvoice={() => setSection("invoice")}
          onPl={() => setSection("pl")}
          onDo={() => setSection("do")}
        />
      )}
      {section === "invoice" && (
        <InvoiceField
          silos={silos}
          vendors={vendors}
          siloId={invoiceSiloId}
          setSiloId={setInvoiceSiloId}
          vendorId={invoiceVendorId}
          setVendorId={setInvoiceVendorId}
          noInvoice={invoiceNo}
          setNoInvoice={setInvoiceNo}
          noPo={invoicePo}
          setNoPo={setInvoicePo}
          date={invoiceDate}
          setDate={setInvoiceDate}
        />
      )}
      {section === "pl" && (
        <PlField
          silos={silos}
          siloId={plSiloId}
          setSiloId={setPlSiloId}
          noPl={plNo}
          setNoPl={setPlNo}
          shipRef={plShipRef}
          setShipRef={setPlShipRef}
          date={plDate}
          setDate={setPlDate}
        />
      )}
      {section === "do" && (
        <DoField
          silos={silos}
          vendors={vendors}
          siloId={doSiloId}
          setSiloId={setDoSiloId}
          vendorId={doVendorId}
          setVendorId={setDoVendorId}
          noDo={doNo}
          setNoDo={setDoNo}
          noPid={doPid}
          setNoPid={setDoPid}
          date={doDate}
          setDate={setDoDate}
        />
      )}
      <Separator className="my-4" />
      <DialogFooter className="flex justify-end px-4">
        <DialogClose asChild>
          <Button variant="outline">{isView ? "Close" : "Cancel"}</Button>
        </DialogClose>
        {!isView &&
          (section === "invoice" || section === "pl" || section === "do") && (
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : isEdit ? "Update" : "Add New"}
            </Button>
          )}
        {(section === "invoice" || section === "pl" || section === "do") && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setSection("next")}
          >
            Back
          </Button>
        )}
        {section === "next" && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setSection("form")}
          >
            Back
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
  setTitleValue,
  setQtyValue,
  setNoteValue,
  setDescriptionValue
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
  setQtyValue: (value: string) => void;
  setNoteValue: (value: string) => void;
  setDescriptionValue: (value: string) => void;
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
            onChange={(e) => setQtyValue(e.currentTarget.value)}
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
            onChange={(e) => setNoteValue(e.currentTarget.value)}
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
            onChange={(e) => setDescriptionValue(e.currentTarget.value)}
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

export function InvoiceField({
  silos,
  vendors,
  siloId,
  setSiloId,
  vendorId,
  setVendorId,
  noInvoice,
  setNoInvoice,
  noPo,
  setNoPo,
  date,
  setDate
}: {
  silos: Silo[];
  vendors: Vendor[];
  siloId: string;
  setSiloId: (value: string) => void;
  vendorId: string;
  setVendorId: (value: string) => void;
  noInvoice: string;
  setNoInvoice: (value: string) => void;
  noPo: string;
  setNoPo: (value: string) => void;
  date?: Date;
  setDate: (value: Date | undefined) => void;
}) {
  return (
    <FieldGroup className="mt-5">
      <FieldSet>
        <FieldLegend>Invoice Form</FieldLegend>
        <FieldDescription>
          Input incoming invoice document details here.
        </FieldDescription>
        <Separator />
        <Field>
          <FieldLabel htmlFor="checkout-7j9-exp-year-f59">Silo</FieldLabel>
          <Select value={siloId} onValueChange={setSiloId}>
            <SelectTrigger id="checkout-7j9-exp-year-f59">
              <SelectValue placeholder="Silo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {silos.map((silo) => (
                  <SelectItem key={silo.id} value={silo.id}>
                    {silo.title}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="checkout-7j9-exp-year-f59">Vendor</FieldLabel>
          <Select value={vendorId} onValueChange={setVendorId}>
            <SelectTrigger id="checkout-7j9-exp-year-f59">
              <SelectValue placeholder="Vendor or Patner name" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {vendors.map((vendor) => (
                  <SelectItem key={vendor.id} value={vendor.id}>
                    {vendor.name || vendor.title}
                  </SelectItem>
                ))}
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
            value={noInvoice}
            onChange={(e) => setNoInvoice(e.currentTarget.value)}
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
            value={noPo}
            onChange={(e) => setNoPo(e.currentTarget.value)}
          />
        </Field>
        <Field className="">
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
      </FieldSet>
    </FieldGroup>
  );
}

export function PlField({
  silos,
  siloId,
  setSiloId,
  noPl,
  setNoPl,
  shipRef,
  setShipRef,
  date,
  setDate
}: {
  silos: Silo[];
  siloId: string;
  setSiloId: (value: string) => void;
  noPl: string;
  setNoPl: (value: string) => void;
  shipRef: string;
  setShipRef: (value: string) => void;
  date?: Date;
  setDate: (value: Date | undefined) => void;
}) {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="checkout-7j9-exp-year-f59">Silo</FieldLabel>
        <Select value={siloId} onValueChange={setSiloId}>
          <SelectTrigger id="checkout-7j9-exp-year-f59">
            <SelectValue placeholder="Silo" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {silos.map((silo) => (
                <SelectItem key={silo.id} value={silo.id}>
                  {silo.title}
                </SelectItem>
              ))}
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
          value={noPl}
          onChange={(e) => setNoPl(e.currentTarget.value)}
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
          value={shipRef}
          onChange={(e) => setShipRef(e.currentTarget.value)}
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

export function DoField({
  silos,
  vendors,
  siloId,
  setSiloId,
  vendorId,
  setVendorId,
  noDo,
  setNoDo,
  noPid,
  setNoPid,
  date,
  setDate
}: {
  silos: Silo[];
  vendors: Vendor[];
  siloId: string;
  setSiloId: (value: string) => void;
  vendorId: string;
  setVendorId: (value: string) => void;
  noDo: string;
  setNoDo: (value: string) => void;
  noPid: string;
  setNoPid: (value: string) => void;
  date?: Date;
  setDate: (value: Date | undefined) => void;
}) {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="checkout-7j9-exp-year-f59">Silo</FieldLabel>
        <Select value={siloId} onValueChange={setSiloId}>
          <SelectTrigger id="checkout-7j9-exp-year-f59">
            <SelectValue placeholder="Silo" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {silos.map((silo) => (
                <SelectItem key={silo.id} value={silo.id}>
                  {silo.title}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <FieldLabel htmlFor="checkout-7j9-exp-year-f59">Vendor</FieldLabel>
        <Select value={vendorId} onValueChange={setVendorId}>
          <SelectTrigger id="checkout-7j9-exp-year-f59">
            <SelectValue placeholder="Vendor or Patner name" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {vendors.map((vendor) => (
                <SelectItem key={vendor.id} value={vendor.id}>
                  {vendor.name || vendor.title}
                </SelectItem>
              ))}
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
          value={noDo}
          onChange={(e) => setNoDo(e.currentTarget.value)}
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
          value={noPid}
          onChange={(e) => setNoPid(e.currentTarget.value)}
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

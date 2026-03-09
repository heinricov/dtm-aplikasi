"use client";
import * as React from "react";

import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { getDocumentTypes, type DocumentType } from "@/services/document-type";
import { getSenders, type Sender } from "@/services/sender";
import { getSilos, type Silo } from "@/services/silo";
import { getVendors, type Vendor } from "@/services/vendor";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ButtonGroup } from "../ui/button-group";
import { IconPlus } from "@tabler/icons-react";
import { Textarea } from "../ui/textarea";

type InvoiceItem = {
  silo_id: string;
  vendor_id: string;
  no_invoice: string;
  no_po: string;
};

type PlItem = {
  silo_id: string;
  no_pl: string;
  ship_ref: string;
};

type DoItem = {
  silo_id: string;
  vendor_id: string;
  no_do: string;
  no_pid: string;
};
type BaseInfo = {
  title: string;
  date: string;
  docType: string;
  sender: string;
};

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
      : new Date().toISOString().slice(0, 10)
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
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [plItems, setPlItems] = useState<PlItem[]>([]);
  const [doItems, setDoItems] = useState<DoItem[]>([]);
  const nextDisabled =
    isView ||
    receiptDate.trim() === "" ||
    titleValue.trim() === "" ||
    documentTypeId.trim() === "" ||
    senderId.trim() === "";
  const baseInfo = {
    title: titleValue || "",
    date: receiptDate || "",
    docType:
      docTypes.find((dt) => String(dt.id) === documentTypeId)?.title ||
      documentTypeId ||
      "",
    sender:
      senders.find((s) => String(s.id) === senderId)?.name || senderId || ""
  };
  const invoiceRows = invoiceItems.map((item, index) => ({
    key: `${index}`,
    silo:
      silos.find((s) => String(s.id) === item.silo_id)?.title || item.silo_id,
    vendor:
      vendors.find((v) => String(v.id) === item.vendor_id)?.name ||
      vendors.find((v) => String(v.id) === item.vendor_id)?.title ||
      item.vendor_id,
    no_invoice: item.no_invoice,
    no_po: item.no_po
  }));
  const plRows = plItems.map((item, index) => ({
    key: `${index}`,
    silo:
      silos.find((s) => String(s.id) === item.silo_id)?.title || item.silo_id,
    no_pl: item.no_pl,
    ship_ref: item.ship_ref
  }));
  const doRows = doItems.map((item, index) => ({
    key: `${index}`,
    silo:
      silos.find((s) => String(s.id) === item.silo_id)?.title || item.silo_id,
    vendor:
      vendors.find((v) => String(v.id) === item.vendor_id)?.name ||
      vendors.find((v) => String(v.id) === item.vendor_id)?.title ||
      item.vendor_id,
    no_do: item.no_do,
    no_pid: item.no_pid
  }));

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
    if (section === "invoice" && invoiceItems.length === 0) {
      toast.error("Tambahkan data invoice terlebih dahulu");
      return;
    }
    if (section === "pl" && plItems.length === 0) {
      toast.error("Tambahkan data packing list terlebih dahulu");
      return;
    }
    if (section === "do" && doItems.length === 0) {
      toast.error("Tambahkan data delivery order terlebih dahulu");
      return;
    }
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
        await Promise.all(
          invoiceItems.map((item) =>
            createReceiptInvoice({
              incoming_document_id: incomingId,
              silo_id: item.silo_id,
              vendor_id: item.vendor_id,
              no_invoice: item.no_invoice || undefined,
              no_po: item.no_po || undefined
            })
          )
        );
        toast.success("Receipt invoice created successfully");
      } else if (section === "pl") {
        await Promise.all(
          plItems.map((item) =>
            createReceiptPl({
              incoming_document_id: incomingId,
              silo_id: item.silo_id,
              no_pl: item.no_pl,
              ship_ref: item.ship_ref
            })
          )
        );
        toast.success("Receipt packing list created successfully");
      } else if (section === "do") {
        await Promise.all(
          doItems.map((item) =>
            createReceiptDo({
              incoming_document_id: incomingId,
              silo_id: item.silo_id,
              vendor_id: item.vendor_id,
              no_do: item.no_do,
              no_pid: item.no_pid
            })
          )
        );
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
      setInvoiceItems([]);
      setPlItems([]);
      setDoItems([]);
    } catch (err) {
      const message =
        (err as { message?: string })?.message ?? "Failed to submit";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <form onSubmit={onSubmit} className="">
      <FieldGroup className="max-w-6xl mx-auto mt-10">
        <FieldSet>
          <FieldLegend>
            {section === "form"
              ? "Incoming Document"
              : section === "invoice"
                ? "Receipt Invoice"
                : section === "pl"
                  ? "Receipt Packing List"
                  : section === "do"
                    ? "Receipt Delivery Order"
                    : "Incoming Document"}
          </FieldLegend>
          {section === "form" && (
            <FieldDescription>
              All transactions are secure and encrypted
            </FieldDescription>
          )}
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
              receiptDate={receiptDate}
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
              onAdd={() => {
                if (
                  !invoiceSiloId ||
                  !invoiceVendorId ||
                  !invoiceNo ||
                  !invoicePo
                ) {
                  toast.error("Lengkapi data invoice terlebih dahulu");
                  return;
                }
                setInvoiceItems((prev) => [
                  ...prev,
                  {
                    silo_id: invoiceSiloId,
                    vendor_id: invoiceVendorId,
                    no_invoice: invoiceNo,
                    no_po: invoicePo,
                    scan_date: invoiceDate
                  }
                ]);
                setInvoiceSiloId("");
                setInvoiceVendorId("");
                setInvoiceNo("");
                setInvoicePo("");
                setInvoiceDate(undefined);
              }}
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
              onAdd={() => {
                if (!plSiloId || !plNo || !plShipRef) {
                  toast.error("Lengkapi data packing list terlebih dahulu");
                  return;
                }
                setPlItems((prev) => [
                  ...prev,
                  {
                    silo_id: plSiloId,
                    no_pl: plNo,
                    ship_ref: plShipRef,
                    scan_date: plDate
                  }
                ]);
                setPlSiloId("");
                setPlNo("");
                setPlShipRef("");
                setPlDate(undefined);
              }}
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
              onAdd={() => {
                if (!doSiloId || !doVendorId || !doNo || !doPid) {
                  toast.error("Lengkapi data delivery order terlebih dahulu");
                  return;
                }
                setDoItems((prev) => [
                  ...prev,
                  {
                    silo_id: doSiloId,
                    vendor_id: doVendorId,
                    no_do: doNo,
                    no_pid: doPid,
                    scan_date: doDate
                  }
                ]);
                setDoSiloId("");
                setDoVendorId("");
                setDoNo("");
                setDoPid("");
                setDoDate(undefined);
              }}
            />
          )}
        </FieldSet>
        {section === "invoice" && (
          <TableRepeaterData
            section="invoice"
            baseInfo={baseInfo}
            rows={invoiceRows}
          />
        )}
        {section === "pl" && (
          <TableRepeaterData section="pl" baseInfo={baseInfo} rows={plRows} />
        )}
        {section === "do" && (
          <TableRepeaterData section="do" baseInfo={baseInfo} rows={doRows} />
        )}
        <Separator className="my-4" />
        <div className="flex justify-end gap-2">
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
          {!isView && (
            <Button
              type="button"
              variant="outline"
              onClick={() => redirect("/")}
            >
              Cancel
            </Button>
          )}
        </div>
      </FieldGroup>
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
  receiptDate,
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
  receiptDate: string;
  setTitleValue: (value: string) => void;
  setQtyValue: (value: string) => void;
  setNoteValue: (value: string) => void;
  setDescriptionValue: (value: string) => void;
}) {
  return (
    <FieldGroup className="">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <Field>
            <FieldLabel htmlFor="document_receipt_date">
              Receipt Date
            </FieldLabel>
            <Input
              id="document_receipt_date"
              name="document_receipt_date"
              type="date"
              placeholder={receiptDate}
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
            <input
              type="hidden"
              name="document_type_id"
              value={documentTypeId}
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
            <input type="hidden" name="sender_id" value={senderId} />
          </Field>
        </div>
        <div className="space-y-4">
          <Field>
            <FieldLabel htmlFor="checkout-7j9-optional-comments">
              Note
            </FieldLabel>
            <Textarea
              id="note"
              name="note"
              placeholder="Note"
              defaultValue={initial?.note ? String(initial.note) : ""}
              disabled={isView}
              onChange={(e) => setNoteValue(e.currentTarget.value)}
              className="resize-none"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="checkout-7j9-optional-comments">
              Description
            </FieldLabel>
            <Textarea
              id="description"
              name="description"
              placeholder="Description"
              defaultValue={
                initial?.description ? String(initial.description) : ""
              }
              disabled={isView}
              onChange={(e) => setDescriptionValue(e.currentTarget.value)}
              className="resize-none"
            />
          </Field>
        </div>
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
    <div className="mt-20 mb-20">
      <div className="grid grid-cols-3 gap-4">
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
    </div>
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
  setDate,
  onAdd
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
  onAdd: () => void;
}) {
  return (
    <FieldGroup className="mt-2">
      <FieldSet className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="checkout-7j9-card-name-43j">
              Invoice Number
            </FieldLabel>
            <Input
              id="checkout-7j9-card-name-43j"
              placeholder="INV-0000"
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
              placeholder="PO-0000"
              value={noPo}
              onChange={(e) => setNoPo(e.currentTarget.value)}
            />
          </Field>
        </div>
      </FieldSet>
      <div className="flex items-end justify-end gap-4">
        <ButtonGroup>
          <Button variant="secondary" type="button" onClick={onAdd}>
            <IconPlus />
            Add
          </Button>
        </ButtonGroup>
      </div>
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
  setDate,
  onAdd
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
  onAdd: () => void;
}) {
  return (
    <FieldGroup className="mt-2">
      <FieldSet className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
            <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
              Ship Ref
            </FieldLabel>
            <Input
              id="checkout-7j9-card-number-uw1"
              placeholder="REF-0000"
              value={shipRef}
              onChange={(e) => setShipRef(e.currentTarget.value)}
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field className="col-span-2">
            <FieldLabel htmlFor="checkout-7j9-card-name-43j">
              Nomor Packing List
            </FieldLabel>
            <Input
              id="checkout-7j9-card-name-43j"
              placeholder="PL-0000"
              value={noPl}
              onChange={(e) => setNoPl(e.currentTarget.value)}
            />
          </Field>
        </div>
      </FieldSet>
      <div className="flex items-end justify-end gap-4">
        <ButtonGroup>
          <Button variant="secondary" type="button" onClick={onAdd}>
            <IconPlus />
            Add
          </Button>
        </ButtonGroup>
      </div>
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
  setDate,
  onAdd
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
  onAdd: () => void;
}) {
  return (
    <FieldGroup className="mt-2">
      <FieldSet className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="do-number">Nomor Delivery Order</FieldLabel>
            <Input
              id="do-number"
              placeholder="DO-0000"
              value={noDo}
              onChange={(e) => setNoDo(e.currentTarget.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="do-pid">Nomor PID</FieldLabel>
            <Input
              id="do-pid"
              placeholder="PID-0000"
              value={noPid}
              onChange={(e) => setNoPid(e.currentTarget.value)}
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="do-silo">Silo</FieldLabel>
            <Select value={siloId} onValueChange={setSiloId}>
              <SelectTrigger id="do-silo">
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
            <FieldLabel htmlFor="do-vendor">Vendor</FieldLabel>
            <Select value={vendorId} onValueChange={setVendorId}>
              <SelectTrigger id="do-vendor">
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
        </div>
        <div className="flex items-end justify-end gap-4">
          <ButtonGroup>
            <Button variant="secondary" type="button" onClick={onAdd}>
              <IconPlus />
              Add
            </Button>
          </ButtonGroup>
        </div>
      </FieldSet>
    </FieldGroup>
  );
}

export function TableRepeaterData({
  section,
  baseInfo,
  rows
}: {
  section: "invoice" | "pl" | "do";
  baseInfo: BaseInfo;
  rows: Array<Record<string, string | number | Date | undefined>>;
}) {
  const headers =
    section === "invoice"
      ? [
          { key: "silo", label: "Silo" },
          { key: "vendor", label: "Vendor" },
          { key: "no_invoice", label: "Invoice" },
          { key: "no_po", label: "PO" }
        ]
      : section === "pl"
        ? [
            { key: "silo", label: "Silo" },
            { key: "no_pl", label: "PL" },
            { key: "ship_ref", label: "Ship Ref" },
            { key: "scan_date", label: "Date" }
          ]
        : [
            { key: "silo", label: "Silo" },
            { key: "vendor", label: "Vendor" },
            { key: "no_do", label: "DO" },
            { key: "no_pid", label: "PID" }
          ];
  return (
    <div>
      <div className="flex gap-2">
        <p>Incoming Document :</p> <p>{baseInfo.title}</p>
      </div>
      <div className="flex gap-2">
        <p>Document Date :</p> <p>{baseInfo.date}</p>
      </div>
      <div className="flex gap-2">
        <p>Document Type :</p> <p>{baseInfo.docType}</p>
      </div>
      <div className="flex gap-2">
        <p>Document Sender :</p> <p>{baseInfo.sender}</p>
      </div>
      <Table className="mt-5">
        <TableHeader className="bg-accent">
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header.key} className="capitalize">
                {header.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={headers.length} className="text-center">
                Belum ada data
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, index) => (
              <TableRow key={String(row.key ?? index)}>
                {headers.map((header) => {
                  const value = row[header.key];
                  const text =
                    value instanceof Date
                      ? format(value, "yyyy-MM-dd")
                      : String(value ?? "");
                  return (
                    <TableCell key={header.key} className="font-medium">
                      {text}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

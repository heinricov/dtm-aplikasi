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
import { format } from "date-fns";
import { ButtonGroup } from "../ui/button-group";
import { IconPlus } from "@tabler/icons-react";
import { DatePickerInput } from "../ui/field-date-input";
import FieldSelectInput from "../ui/field-select-input";
import { FieldInput } from "../ui/field-input";
import { FieldInputTextarea } from "../ui/field-input-textarea";
import { FormDialog } from "../form-dialog";
import DocumentTypeForm from "../form/document-type";
import { Plus } from "lucide-react";
import SenderForm from "./sender";
import VendorForm from "./vendor";
import SiloForm from "./silo";

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
  qty: number;
};

export default function IncomingDocumentForm({
  onSuccessClose,
  mode = "create",
  initial,
  formOnly = false
}: {
  onSuccessClose?: () => void;
  mode?: "create" | "edit" | "view";
  initial?: Partial<IncomingDocument> & { id?: string };
  formOnly?: boolean;
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
  const initialReceiptDate = initial?.document_receipt_date
    ? new Date(String(initial.document_receipt_date))
    : new Date();
  const [receiptDate, setReceiptDate] = useState<Date | undefined>(
    isNaN(initialReceiptDate.getTime()) ? new Date() : initialReceiptDate
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
  const activeSection = formOnly ? "form" : section;
  const nextDisabled =
    isView ||
    !receiptDate ||
    titleValue.trim() === "" ||
    documentTypeId.trim() === "" ||
    senderId.trim() === "";
  const baseInfo = {
    title: titleValue || "",
    date: receiptDate ? format(receiptDate, "yyyy-MM-dd") : "",
    docType:
      docTypes.find((dt) => String(dt.id) === documentTypeId)?.title ||
      documentTypeId ||
      "",
    sender:
      senders.find((s) => String(s.id) === senderId)?.name || senderId || "",
    qty: invoiceItems.length + plItems.length + doItems.length
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
  const senderOptions = React.useMemo(
    () =>
      senders.map((sender) => ({
        value: String(sender.id),
        label: sender.name
      })),
    [senders]
  );

  const refreshSenders = React.useCallback(async () => {
    try {
      const list = await getSenders();
      setSenders(list);
    } catch {
      setSenders([]);
    }
  }, []);

  const refreshSilos = React.useCallback(async () => {
    try {
      const list = await getSilos();
      setSilos(list);
    } catch {
      setSilos([]);
    }
  }, []);

  const refreshVendors = React.useCallback(async () => {
    try {
      const list = await getVendors();
      setVendors(list);
    } catch {
      setVendors([]);
    }
  }, []);

  const refreshDocumentTypes = React.useCallback(async () => {
    try {
      const list = await getDocumentTypes();
      setDocTypes(list);
    } catch {
      setDocTypes([]);
    }
  }, []);

  useEffect(() => {
    if (!initial?.id) return;
    if (initial?.document_type_id != null) {
      setDocumentTypeId(String(initial.document_type_id));
    }
    if (initial?.sender_id != null) {
      setSenderId(String(initial.sender_id));
    }
    if (initial?.document_receipt_date != null) {
      const parsed = new Date(String(initial.document_receipt_date));
      if (!isNaN(parsed.getTime())) {
        setReceiptDate(parsed);
      }
    }
    if (initial?.title != null) {
      setTitleValue(String(initial.title));
    }
    if (typeof initial?.qty === "number") {
      setQtyValue(String(initial.qty));
    }
    if (initial?.note != null) {
      setNoteValue(String(initial.note));
    }
    if (initial?.description != null) {
      setDescriptionValue(String(initial.description));
    }
    if (initial?.user_id != null) {
      setUserId(String(initial.user_id));
    }
  }, [initial?.id]);

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
  useEffect(() => {
    const handler = () => {
      void refreshSenders();
    };
    window.addEventListener("sender:updated", handler);
    return () => {
      window.removeEventListener("sender:updated", handler);
    };
  }, [refreshSenders]);
  useEffect(() => {
    const handler = () => {
      void refreshSilos();
    };
    window.addEventListener("silo:updated", handler);
    return () => {
      window.removeEventListener("silo:updated", handler);
    };
  }, [refreshSilos]);
  useEffect(() => {
    const handler = () => {
      void refreshVendors();
    };
    window.addEventListener("vendor:updated", handler);
    return () => {
      window.removeEventListener("vendor:updated", handler);
    };
  }, [refreshVendors]);
  useEffect(() => {
    const handler = () => {
      void refreshDocumentTypes();
    };
    window.addEventListener("document-type:updated", handler);
    return () => {
      window.removeEventListener("document-type:updated", handler);
    };
  }, [refreshDocumentTypes]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (e.target !== e.currentTarget) {
      return;
    }
    if (submitting) return;
    if (isView) return;
    if (activeSection === "invoice" && invoiceItems.length === 0) {
      toast.error("Tambahkan data invoice terlebih dahulu");
      return;
    }
    if (activeSection === "pl" && plItems.length === 0) {
      toast.error("Tambahkan data packing list terlebih dahulu");
      return;
    }
    if (activeSection === "do" && doItems.length === 0) {
      toast.error("Tambahkan data delivery order terlebih dahulu");
      return;
    }
    const user_id = userId.trim();
    const document_receipt_date = receiptDate
      ? format(receiptDate, "yyyy-MM-dd")
      : "";
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
      if (activeSection === "invoice") {
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
      } else if (activeSection === "pl") {
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
      } else if (activeSection === "do") {
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
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("incoming-document:updated"));
      }
      if (!isEdit) {
        router.push("/dashboard/incoming-document");
      }
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
            {activeSection === "form"
              ? "Incoming Document"
              : activeSection === "invoice"
                ? "Receipt Invoice"
                : activeSection === "pl"
                  ? "Receipt Packing List"
                  : activeSection === "do"
                    ? "Receipt Delivery Order"
                    : "Incoming Document"}
          </FieldLegend>
          {activeSection === "form" && (
            <FieldDescription>
              All transactions are secure and encrypted
            </FieldDescription>
          )}
          {activeSection === "form" && (
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
              titleValue={titleValue}
              setTitleValue={setTitleValue}
              noteValue={noteValue}
              setQtyValue={setQtyValue}
              setNoteValue={setNoteValue}
              descriptionValue={descriptionValue}
              setDescriptionValue={setDescriptionValue}
              senderOptions={senderOptions}
              refreshDocumentTypes={refreshDocumentTypes}
              refreshSenders={refreshSenders}
            />
          )}
          {!formOnly && activeSection === "next" && (
            <NextPageButton
              onInvoice={() => setSection("invoice")}
              onPl={() => setSection("pl")}
              onDo={() => setSection("do")}
            />
          )}
          {!formOnly && activeSection === "invoice" && (
            <InvoiceField
              silos={silos}
              vendors={vendors}
              refreshSilos={refreshSilos}
              refreshVendors={refreshVendors}
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
          {!formOnly && activeSection === "pl" && (
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
          {!formOnly && activeSection === "do" && (
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
        {!formOnly && activeSection === "invoice" && (
          <TableRepeaterData
            section="invoice"
            baseInfo={baseInfo}
            rows={invoiceRows}
          />
        )}
        {!formOnly && activeSection === "pl" && (
          <TableRepeaterData section="pl" baseInfo={baseInfo} rows={plRows} />
        )}
        {!formOnly && activeSection === "do" && (
          <TableRepeaterData section="do" baseInfo={baseInfo} rows={doRows} />
        )}
        <Separator className="my-4" />
        <div className="flex justify-end gap-2">
          {!isView &&
            (formOnly ||
              activeSection === "invoice" ||
              activeSection === "pl" ||
              activeSection === "do") && (
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : isEdit ? "Update" : "Add New"}
              </Button>
            )}
          {!formOnly &&
            (activeSection === "invoice" ||
              activeSection === "pl" ||
              activeSection === "do") && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setSection("next")}
              >
                Back
              </Button>
            )}
          {!formOnly && activeSection === "next" && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setSection("form")}
            >
              Back
            </Button>
          )}
          {!formOnly && activeSection === "form" && (
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
              onClick={() => redirect("/dashboard/incoming-document")}
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
  titleValue,
  setTitleValue,
  noteValue,
  setQtyValue,
  setNoteValue,
  descriptionValue,
  setDescriptionValue,
  senderOptions,
  refreshDocumentTypes,
  refreshSenders
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
  setReceiptDate: (value: Date | undefined) => void;
  receiptDate?: Date;
  titleValue: string;
  setTitleValue: (value: string) => void;
  noteValue: string;
  setQtyValue: (value: string) => void;
  setNoteValue: (value: string) => void;
  descriptionValue: string;
  setDescriptionValue: (value: string) => void;
  senderOptions: Array<{ value: string; label: string }>;
  refreshDocumentTypes: () => Promise<void>;
  refreshSenders: () => Promise<void>;
}) {
  return (
    <FieldGroup className="">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="flex gap-2">
            <DatePickerInput
              label="Receipt Date"
              id="document_receipt_date"
              name="document_receipt_date"
              value={receiptDate}
              onChange={setReceiptDate}
              placeholder="YYYY-MM-DD"
              disabled={isView}
              required
              className="w-full"
            />
            <FieldInput
              label="Title"
              id="title"
              name="title"
              placeholder="Title"
              value={titleValue}
              disabled={isView}
              onChange={setTitleValue}
            />
          </div>

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
          <div className="flex gap-2">
            <FieldSelectInput
              label="Document Type"
              id="document_type_id"
              name="document_type_id"
              value={documentTypeId}
              onChange={setDocumentTypeId}
              placeholder="Choose document type"
              disabled={isView}
              required
              className="w-full"
              options={docTypes.map((dt) => ({
                value: String(dt.id),
                label: dt.title
              }))}
              actionButton={
                <FormDialog
                  title="Add New Document Type"
                  description="Add a new document type for incoming documents."
                  trigger={
                    <Button className="" size="icon" variant="outline">
                      <Plus />
                    </Button>
                  }
                  formFields={({ close }) => (
                    <DocumentTypeForm
                      onSuccess={async (created) => {
                        await refreshDocumentTypes();
                        setDocumentTypeId(String(created.id));
                        close();
                      }}
                    />
                  )}
                />
              }
            />

            <FieldSelectInput
              label="Sender"
              id="sender_id"
              name="sender_id"
              value={senderId}
              onChange={setSenderId}
              placeholder="Choose sender"
              disabled={isView}
              required
              className="w-full"
              options={senderOptions}
              actionButton={
                <FormDialog
                  title="Add New Sender"
                  description="Add a new sender for incoming documents."
                  trigger={
                    <Button className="" size="icon" variant="outline">
                      <Plus />
                    </Button>
                  }
                  formFields={({ close }) => (
                    <SenderForm
                      onSuccess={async (created) => {
                        await refreshSenders();
                        setSenderId(String(created.id));
                        close();
                      }}
                    />
                  )}
                />
              }
            />
          </div>
        </div>
        <div className="space-y-4">
          <FieldInputTextarea
            label="Note"
            id="note"
            name="note"
            placeholder="Note"
            value={noteValue}
            disabled={isView}
            onChange={setNoteValue}
            className="resize-none"
          />
          <FieldInputTextarea
            label="Description"
            id="description"
            name="description"
            placeholder="Description"
            value={descriptionValue}
            disabled={isView}
            onChange={setDescriptionValue}
            className="resize-none"
          />
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
  refreshSilos,
  refreshVendors,
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
  refreshSilos: () => Promise<void>;
  refreshVendors: () => Promise<void>;
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
        <div className="grid grid-cols-4 gap-4">
          <FieldSelectInput
            label="Silo"
            id="invoice-silo"
            value={siloId}
            onChange={setSiloId}
            placeholder="Silo"
            options={silos.map((silo) => ({
              value: String(silo.id),
              label: silo.title
            }))}
            actionButton={
              <FormDialog
                title="Add New Silo"
                description="Add a new silo for incoming documents."
                trigger={
                  <Button className="" size="icon" variant="outline">
                    <Plus />
                  </Button>
                }
                formFields={({ close }) => (
                  <SiloForm
                    onSuccess={async (created) => {
                      await refreshSilos();
                      setSiloId(String(created.id));
                      close();
                    }}
                  />
                )}
              />
            }
          />
          <FieldSelectInput
            label="Vendor"
            id="invoice-vendor"
            value={vendorId}
            onChange={setVendorId}
            placeholder="Vendor or Patner name"
            options={vendors.map((vendor) => ({
              value: String(vendor.id),
              label: vendor.name || vendor.title || String(vendor.id)
            }))}
            actionButton={
              <FormDialog
                title="Add New Vendor"
                description="Add a new vendor for incoming documents."
                trigger={
                  <Button className="" size="icon" variant="outline">
                    <Plus />
                  </Button>
                }
                formFields={({ close }) => (
                  <VendorForm
                    onSuccess={async (created) => {
                      await refreshVendors();
                      setVendorId(String(created.id));
                      close();
                    }}
                  />
                )}
              />
            }
          />
          <FieldInput
            label="Invoice Number"
            id="invoice-number"
            placeholder="INV-0000"
            value={noInvoice}
            onChange={setNoInvoice}
          />
          <FieldInput
            label="PO Number"
            id="po-number"
            placeholder="PO-0000"
            value={noPo}
            onChange={setNoPo}
          />
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
          <FieldSelectInput
            label="Silo"
            id="pl-silo"
            value={siloId}
            onChange={setSiloId}
            placeholder="Silo"
            options={silos.map((silo) => ({
              value: String(silo.id),
              label: silo.title
            }))}
          />
          <FieldInput
            label="Ship Ref"
            id="ship-ref"
            placeholder="REF-0000"
            value={shipRef}
            onChange={setShipRef}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FieldInput
            label="Nomor Packing List"
            id="pl-number"
            placeholder="PL-0000"
            value={noPl}
            onChange={setNoPl}
            className="col-span-2"
          />
        </div>
        <DatePickerInput
          label="Date"
          id="pl-date"
          value={date}
          onChange={setDate}
          placeholder="YYYY-MM-DD"
          className="w-52"
        />
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
          <FieldInput
            label="Nomor Delivery Order"
            id="do-number"
            placeholder="DO-0000"
            value={noDo}
            onChange={setNoDo}
          />
          <FieldInput
            label="Nomor PID"
            id="do-pid"
            placeholder="PID-0000"
            value={noPid}
            onChange={setNoPid}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FieldSelectInput
            label="Silo"
            id="do-silo"
            value={siloId}
            onChange={setSiloId}
            placeholder="Silo"
            options={silos.map((silo) => ({
              value: String(silo.id),
              label: silo.title
            }))}
          />
          <FieldSelectInput
            label="Vendor"
            id="do-vendor"
            value={vendorId}
            onChange={setVendorId}
            placeholder="Vendor or Patner name"
            options={vendors.map((vendor) => ({
              value: String(vendor.id),
              label: vendor.name || vendor.title || String(vendor.id)
            }))}
          />
        </div>
        <DatePickerInput
          label="Date"
          id="do-date"
          value={date}
          onChange={setDate}
          placeholder="YYYY-MM-DD"
          className="w-52"
        />
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
      <div className="flex gap-2">
        <p>Total Qty :</p> <p>{baseInfo.qty}</p>
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

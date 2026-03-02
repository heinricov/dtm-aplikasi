-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentType" (
    "id" UUID NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "description" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Silo" (
    "id" UUID NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "description" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Silo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sender" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sender_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "id" UUID NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bank" (
    "id" UUID NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "description" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncomingDocument" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "document_receipt_date" DATE NOT NULL,
    "document_type_id" UUID NOT NULL,
    "sender_id" UUID NOT NULL,
    "qty" INTEGER,
    "description" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IncomingDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReceiptInvoice" (
    "id" UUID NOT NULL,
    "incoming_document_id" UUID NOT NULL,
    "silo_id" UUID NOT NULL,
    "no_invoice" VARCHAR(150),
    "no_po" VARCHAR(150),
    "vendor_id" UUID NOT NULL,
    "scan_date" DATE,
    "upload_date" DATE,
    "description" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReceiptInvoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReceiptDo" (
    "id" UUID NOT NULL,
    "incoming_document_id" UUID NOT NULL,
    "no_do" VARCHAR(150) NOT NULL,
    "no_pid" VARCHAR(150) NOT NULL,
    "silo_id" UUID NOT NULL,
    "vendor_id" UUID NOT NULL,
    "scan_date" DATE,
    "upload_date" DATE,
    "description" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReceiptDo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReceiptPl" (
    "id" UUID NOT NULL,
    "incoming_document_id" UUID NOT NULL,
    "silo_id" UUID NOT NULL,
    "no_pl" VARCHAR(150) NOT NULL,
    "ship_ref" VARCHAR(150) NOT NULL,
    "scan_date" DATE,
    "upload_date" DATE,
    "description" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReceiptPl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReceiptVoucherPayment" (
    "id" UUID NOT NULL,
    "incoming_document_id" UUID NOT NULL,
    "silo_id" UUID NOT NULL,
    "bank_id" UUID NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "scan_date" DATE,
    "upload_date" DATE,
    "description" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReceiptVoucherPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReceiptOtherDocument" (
    "id" UUID NOT NULL,
    "incoming_document_id" UUID NOT NULL,
    "no_document" VARCHAR(150) NOT NULL,
    "scan_date" DATE,
    "upload_date" DATE,
    "description" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReceiptOtherDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "IncomingDocument" ADD CONSTRAINT "IncomingDocument_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingDocument" ADD CONSTRAINT "IncomingDocument_document_type_id_fkey" FOREIGN KEY ("document_type_id") REFERENCES "DocumentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingDocument" ADD CONSTRAINT "IncomingDocument_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "Sender"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceiptInvoice" ADD CONSTRAINT "ReceiptInvoice_incoming_document_id_fkey" FOREIGN KEY ("incoming_document_id") REFERENCES "IncomingDocument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceiptInvoice" ADD CONSTRAINT "ReceiptInvoice_silo_id_fkey" FOREIGN KEY ("silo_id") REFERENCES "Silo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceiptInvoice" ADD CONSTRAINT "ReceiptInvoice_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceiptDo" ADD CONSTRAINT "ReceiptDo_incoming_document_id_fkey" FOREIGN KEY ("incoming_document_id") REFERENCES "IncomingDocument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceiptDo" ADD CONSTRAINT "ReceiptDo_silo_id_fkey" FOREIGN KEY ("silo_id") REFERENCES "Silo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceiptDo" ADD CONSTRAINT "ReceiptDo_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceiptPl" ADD CONSTRAINT "ReceiptPl_incoming_document_id_fkey" FOREIGN KEY ("incoming_document_id") REFERENCES "IncomingDocument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceiptPl" ADD CONSTRAINT "ReceiptPl_silo_id_fkey" FOREIGN KEY ("silo_id") REFERENCES "Silo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceiptVoucherPayment" ADD CONSTRAINT "ReceiptVoucherPayment_incoming_document_id_fkey" FOREIGN KEY ("incoming_document_id") REFERENCES "IncomingDocument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceiptVoucherPayment" ADD CONSTRAINT "ReceiptVoucherPayment_silo_id_fkey" FOREIGN KEY ("silo_id") REFERENCES "Silo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceiptVoucherPayment" ADD CONSTRAINT "ReceiptVoucherPayment_bank_id_fkey" FOREIGN KEY ("bank_id") REFERENCES "Bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceiptOtherDocument" ADD CONSTRAINT "ReceiptOtherDocument_incoming_document_id_fkey" FOREIGN KEY ("incoming_document_id") REFERENCES "IncomingDocument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

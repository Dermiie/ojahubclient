
import { useState } from "react";
import {
  Box,
  ShieldCheck,
  ArrowLeft,
  CalendarDays,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";

import { Button } from "@/components/ui/button";

import {
  fetchInvoices,
  fetchCustomers,
  saveInvoice,
  saveCustomer,
  type Invoice,
} from "@/lib/invoices";

interface InvoiceLine {
  name: string;
  qty: number;
  price: number;
}

interface InvoiceDraft {
  customerName: string;
  customerPhone: string;
  lines: InvoiceLine[];
  total: number;
}

const DRAFT_KEY = "ojahub-invoice-draft";

const naira = (amount: number) =>
  `₦${amount.toLocaleString("en-NG", {
    maximumFractionDigits: 0,
  })}`;

function readDraft(): InvoiceDraft | null {
  try {
    const draftText = localStorage.getItem(DRAFT_KEY);

    if (!draftText) return null;

    return JSON.parse(draftText) as InvoiceDraft;
  } catch {
    return null;
  }
}

export default function ReviewPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [draft] = useState<InvoiceDraft | null>(readDraft);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const isDev = location.pathname.startsWith("/__dev");

  const backPath = isDev ? "/__dev/new-invoice" : "/invoices/new";

  const validDraft =
    draft !== null &&
    typeof draft.customerName === "string" &&
    draft.customerName.trim().length > 0 &&
    Array.isArray(draft.lines) &&
    draft.lines.length > 0 &&
    draft.lines.every(
      (line) =>
        typeof line.name === "string" &&
        line.name.trim().length > 0 &&
        Number.isFinite(line.qty) &&
        Number.isInteger(line.qty) &&
        line.qty > 0 &&
        Number.isFinite(line.price) &&
        line.price > 0,
    );

  const createInvoice = async () => {
    if (!draft || !validDraft || sending) return;

    setSending(true);
    setError("");

    try {
      const customers = await fetchCustomers();

      const existingCustomer = customers.find(
        (customer) =>
          customer.name.trim().toLowerCase() ===
          draft.customerName.trim().toLowerCase(),
      );

      const customerId = existingCustomer?.id ?? `C-${Date.now()}`;

      if (!existingCustomer) {
        await saveCustomer({
          id: customerId,
          name: draft.customerName.trim(),
        });
      }

      const invoices = await fetchInvoices();

      const highestNumber = invoices.reduce((highest, invoice) => {
        const match = invoice.no.match(/^INV-(\d+)$/i);

        return match ? Math.max(highest, Number(match[1])) : highest;
      }, 0);

      const invoiceNo = `INV-${String(highestNumber + 1).padStart(4, "0")}`;

      const now = new Date();

      const newInvoice: Invoice = {
        no: invoiceNo,
        customerId,
        status: "Waiting",
        paid: 0,
        day: "Today",
        time: now.toLocaleTimeString("en-NG", {
          hour: "numeric",
          minute: "2-digit",
        }),
        lines: draft.lines.map((line) => ({
          name: line.name.trim(),
          qty: line.qty,
          price: line.price,
        })),
      };

      await saveInvoice(newInvoice);

      localStorage.removeItem(DRAFT_KEY);

      navigate(
        isDev
          ? `/__dev/invoice-ready/${invoiceNo}`
          : `/invoices/${invoiceNo}/ready`,
      );
    } catch (err) {
      console.error("Invoice creation failed:", err);
      setError("Unable to create invoice. Please try again.");
      setSending(false);
    }
  };

  if (!validDraft || !draft) {
    return (
      <main className="min-h-[350px] bg-background-main p-5 sm:p-8">
        <div className="mx-auto max-w-xl rounded-xl border border-border-default bg-background-main p-6">
          <h1 className="text-lg font-bold text-text-primary">
            Nothing to review
          </h1>

          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Add a customer and at least one valid product first.
          </p>

          <Button
            className="mt-5 rounded-full bg-primary-base px-6 text-text-inverse hover:bg-primary-hover"
            onClick={() => navigate(backPath)}
          >
            <ArrowLeft className="mr-2 size-4" />
            Back to invoice
          </Button>
        </div>
      </main>
    );
  }

  const total = draft.lines.reduce(
    (sum, line) => sum + line.qty * line.price,
    0,
  );

  const totalQuantity = draft.lines.reduce((sum, line) => sum + line.qty, 0);

  const today = new Date().toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const initials = draft.customerName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="w-full min-w-0 bg-background-main px-3 py-4 sm:px-5 sm:py-5">
      {/* Page heading */}
      <header className="mb-5">
        <button
          type="button"
          onClick={() => navigate(backPath)}
          className="mb-3 inline-flex size-7 items-center justify-center rounded-full border border-border-default text-icon-grey transition hover:bg-background-card"
          aria-label="Go back"
        >
          <ArrowLeft size={15} />
        </button>

        <p className="text-[10px] text-text-secondary">Invoices</p>

        <h1 className="mt-1 text-lg font-bold tracking-tight text-text-primary sm:text-xl">
          Review before sending
        </h1>

        <p className="mt-2 text-[10px] text-text-secondary">
          This is exactly what {draft.customerName.split(" ")[0]} will see when
          she opens the link.
        </p>
      </header>

      {/* Main Figma layout */}
      <div className="grid min-w-0 items-start gap-3 lg:grid-cols-2 xl:gap-4">
        {/* LEFT: Compact invoice preview */}
        <section className="min-w-0 overflow-hidden rounded-2xl border border-border-default bg-background-main">
          {/* Business and invoice heading */}
          <div className="flex items-center justify-between gap-3 border-b border-border-subtle px-3 py-3 sm:px-4">
            <div className="flex min-w-0 items-center gap-2">
              <div className="grid size-8 flex-none place-items-center rounded-full bg-secondary-base text-[10px] font-bold text-text-inverse">
                OH
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-bold text-text-primary">OjaHub</p>
                <p className="mt-0.5 text-[9px] text-text-secondary">
                  Invoice preview
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[9px] text-text-secondary">INVOICE</p>
              <p className="mt-1 text-[11px] font-semibold text-text-primary">
                New invoice
              </p>
              <p className="mt-1 text-[9px] text-text-secondary">{today}</p>
            </div>
          </div>

          {/* Customer information */}
          <div className="flex items-start justify-between gap-3 px-3 py-4 sm:px-4">
            <div className="min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-wide text-text-secondary">
                Bill to
              </p>

              <div className="mt-2 flex items-center gap-2">
                <div className="grid size-8 flex-none place-items-center rounded-xl bg-primary-subtle text-[10px] font-semibold text-primary-base">
                  {initials}
                </div>

                <div className="min-w-0">
                  <p className="break-words text-[10px] font-semibold text-text-primary">
                    {draft.customerName}
                  </p>

                  {draft.customerPhone && (
                    <p className="mt-1 text-[9px] text-text-secondary">
                      {draft.customerPhone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-none text-right">
              <p className="text-[9px] font-semibold uppercase tracking-wide text-text-secondary">
                Date issued
              </p>

              <div className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-text-primary">
                <CalendarDays size={12} className="text-text-secondary" />
                {today}
              </div>
            </div>
          </div>

          {/* Product list */}
          <div className="px-3 pb-3 sm:px-4 sm:pb-4">
            <div className="overflow-hidden rounded-xl border border-border-subtle">
              {/* Table heading */}
              <div className="grid grid-cols-[minmax(0,1fr)_42px_85px] gap-2 bg-background-card px-3 py-2.5 text-[8px] font-semibold uppercase tracking-wide text-text-secondary sm:grid-cols-[minmax(0,1fr)_48px_95px]">
                <span>Product</span>
                <span className="text-center">Qty</span>
                <span className="text-right">Amount</span>
              </div>

              {/* Product rows */}
              <div className="divide-y divide-border-subtle">
                {draft.lines.map((line, index) => (
                  <div
                    key={`${line.name}-${index}`}
                    className="grid grid-cols-[minmax(0,1fr)_42px_85px] items-center gap-2 px-3 py-3 sm:grid-cols-[minmax(0,1fr)_48px_95px]"
                  >
                    <div className="min-w-0">
                      <p className="break-words text-[10px] font-medium text-text-primary">
                        {line.name}
                      </p>
                      <p className="mt-1 text-[9px] text-text-secondary">
                        {naira(line.price)} per unit
                      </p>
                    </div>

                    <span className="text-center text-[10px] text-text-secondary">
                      {line.qty}
                    </span>

                    <span className="text-right text-[10px] font-semibold text-text-primary">
                      {naira(line.qty * line.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total due */}
            <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-primary-subtle px-3 py-3.5">
              <span className="text-[10px] font-medium text-text-primary">
                Total due
              </span>

              <span className="text-base font-bold text-primary-active">
                {naira(total)}
              </span>
            </div>
          </div>
        </section>

        {/* RIGHT: Alerts and actions */}
        <aside className="min-w-0 space-y-2">
          {/* Account verification notice */}
          <section className="flex gap-2.5 rounded-2xl border border-success-light bg-success-light p-3">
            <div className="grid size-7 flex-none place-items-center rounded-full bg-background-main">
              <ShieldCheck size={14} className="text-success-base" />
            </div>

            <div className="min-w-0">
              <h2 className="text-[10px] font-semibold text-success-base">
                No alerts to check
              </h2>

              <p className="mt-1 text-[9px] leading-[1.6] text-text-secondary">
                {draft.customerName} gets her own one-time account number. When
                she transfers, OjaHub confirms it and marks this invoice paid.
              </p>
            </div>
          </section>

          {/* Stock update notice */}
          <section className="flex gap-2.5 rounded-2xl border border-border-default bg-background-card p-3">
            <div className="grid size-7 flex-none place-items-center rounded-full bg-secondary-base/15">
              <Box size={14} className="text-secondary-base" />
            </div>

            <div className="min-w-0">
              <h2 className="text-[10px] font-semibold text-text-primary">
                Stock updates on payment
              </h2>

              <p className="mt-1 text-[9px] leading-[1.6] text-text-secondary">
                Stock updates will happen when the invoice is paid.
              </p>
            </div>
          </section>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              disabled={sending}
              onClick={() => navigate(backPath)}
              className="h-9 flex-1 rounded-full border border-border-default bg-background-main text-[11px] font-semibold text-text-primary hover:bg-background-card"
            >
              Edit
            </Button>

            <Button
              type="button"
              disabled={sending}
              onClick={createInvoice}
              className="h-9 flex-[1.8] rounded-full bg-primary-base text-[11px] font-semibold text-text-inverse hover:bg-primary-hover"
            >
              {sending ? "Creating invoice..." : "Create and send"}
            </Button>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-border-default bg-background-card p-3 text-[10px] leading-5 text-text-primary"
            >
              {error}
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}

import { useEffect, useState } from "react";
import {
  Check,
  CheckCircle2,
  Copy,
  Link2,
  MessageCircle,
  X,
  FileText,
} from "lucide-react";
import { Link, useParams } from "react-router";

import { Button } from "@/components/ui/button";

import {
  fetchInvoices,
  fetchCustomers,
  formatNaira,
  getInvoiceTotal,
  type Invoice,
  type Customer,
} from "@/lib/invoices";

export default function InvoiceReadyPage() {
  const { invoiceNo } = useParams();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadInvoice() {
      try {
        setLoading(true);
        setError("");

        const [invoices, customers] = await Promise.all([
          fetchInvoices(),
          fetchCustomers(),
        ]);

        const foundInvoice = invoices.find((item) => item.no === invoiceNo);

        if (!active) return;

        if (!foundInvoice) {
          setInvoice(null);
          setCustomer(null);
          return;
        }

        const foundCustomer =
          customers.find((item) => item.id === foundInvoice.customerId) ?? null;

        setInvoice(foundInvoice);
        setCustomer(foundCustomer);
      } catch (err) {
        console.error("Could not load invoice:", err);

        if (active) {
          setError("Unable to load this invoice. Please try again.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (invoiceNo) {
      loadInvoice();
    } else {
      setInvoice(null);
      setCustomer(null);
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [invoiceNo]);

  if (loading) {
    return (
      <div className="grid min-h-[350px] place-items-center bg-background-main">
        <div className="text-center">
          <div className="mx-auto size-9 animate-spin rounded-full border-2 border-primary-light border-t-primary-base" />
          <p className="mt-3 text-xs text-text-secondary">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <main className="min-h-[350px] bg-background-main p-5 sm:p-8">
        <div className="mx-auto max-w-lg rounded-2xl border border-border-default bg-background-main p-6">
          <div className="grid size-11 place-items-center rounded-xl bg-primary-subtle">
            <FileText className="size-5 text-primary-base" />
          </div>

          <h1 className="mt-4 text-lg font-bold text-text-primary">
            {error ? "Something went wrong" : "Invoice not found"}
          </h1>

          <p className="mt-2 text-sm leading-6 text-text-secondary">
            {error ||
              "This invoice could not be found in your saved invoice data."}
          </p>

          <Link
            to="/invoices"
            className="mt-5 inline-flex items-center justify-center rounded-full bg-primary-base px-5 py-2.5 text-xs font-semibold text-text-inverse transition hover:bg-primary-hover"
          >
            Back to invoices
          </Link>
        </div>
      </main>
    );
  }

  const total = getInvoiceTotal(invoice);
  const customerName = customer?.name ?? "Customer";

  // Placeholder URL until public invoice links and payment
  // provider integration are connected.
  const payLink = `ojahub.com/pay/${invoice.no}`;
  const fullPayLink = `https://${payLink}`;

  const message =
    `Hello ${customerName}, thank you for your business. ` +
    `Your invoice ${invoice.no} for ` +
    `${invoice.lines.map((line) => `${line.name} x${line.qty}`).join(", ")} ` +
    `is ready. Total due: ${formatNaira(total)}. ` +
    `View your invoice here: ${fullPayLink}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullPayLink);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch (err) {
      console.error("Could not copy invoice link:", err);
      setCopied(false);
    }
  };

  return (
    <main className="mx-auto min-h-full w-full max-w-[1250px] bg-background-main px-3 py-4 sm:px-6 sm:py-7 lg:px-8">
      {/* Page heading */}
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] text-text-secondary">Invoices</p>

          <h1 className="mt-1 text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
            Send invoice
          </h1>

          <p className="mt-1 text-xs text-text-secondary">
            Your invoice has been created successfully.
          </p>
        </div>

        <Link
          to="/invoices"
          aria-label="Close"
          className="grid size-9 flex-none place-items-center rounded-full border border-border-default text-icon-grey transition hover:bg-background-card"
        >
          <X size={16} />
        </Link>
      </header>

      {/* Main content */}
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(260px,0.78fr)_minmax(0,1.22fr)] xl:gap-7">
        {/* WhatsApp message preview */}
        <section className="min-w-0">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-primary">
              Message preview
            </h2>

            <span className="rounded-full bg-primary-subtle px-2.5 py-1 text-[9px] font-medium text-primary-base">
              WhatsApp
            </span>
          </div>

          <div className="rounded-2xl border border-secondary-base/30 bg-background-card p-3 sm:p-4">
            <div className="mb-3 flex items-center gap-2 rounded-xl bg-background-main px-3 py-2.5">
              <div className="grid size-8 place-items-center rounded-full bg-primary-subtle">
                <MessageCircle size={15} className="text-primary-base" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-text-primary">
                  WhatsApp message
                </p>
                <p className="text-[9px] text-text-secondary">
                  Message to {customerName}
                </p>
              </div>
            </div>

            <div className="ml-auto max-w-[96%] rounded-xl rounded-tr-sm bg-success-light p-3 text-[11px] leading-[1.75] text-text-primary shadow-sm sm:p-4">
              <p className="whitespace-pre-wrap break-words">{message}</p>

              <div className="mt-2 flex justify-end">
                <span className="text-[9px] text-text-secondary">
                  Invoice preview
                </span>
              </div>
            </div>

            <p className="mt-3 text-center text-[9px] text-text-secondary">
              This is a preview of the message your customer will receive.
            </p>
          </div>
        </section>

        {/* Invoice confirmation and actions */}
        <section className="min-w-0 space-y-4">
          {/* Success heading */}
          <div className="flex items-center gap-3">
            <div className="grid size-11 flex-none place-items-center rounded-full bg-success-light">
              <CheckCircle2
                size={25}
                className="text-success-base"
                strokeWidth={2.5}
              />
            </div>

            <div className="min-w-0">
              <h2 className="text-base font-bold text-text-primary sm:text-lg">
                Invoice ready
              </h2>

              <p className="mt-1 text-[10px] text-text-secondary">
                {invoice.no} · {formatNaira(total)} · {customerName}
              </p>
            </div>
          </div>

          {/* Invoice link */}
          <div className="rounded-xl border border-border-default bg-background-main p-3 sm:p-4">
            <div className="flex min-w-0 items-center gap-2">
              <div className="grid size-8 flex-none place-items-center rounded-lg bg-primary-subtle">
                <Link2 size={15} className="text-primary-base" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[9px] text-text-secondary">Invoice link</p>

                <p className="mt-1 truncate text-[11px] font-medium text-text-primary">
                  {payLink}
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={copyLink}
                className="h-8 flex-none gap-1.5 rounded-lg border-border-default px-3 text-[10px] text-text-secondary hover:bg-background-card"
              >
                {copied ? (
                  <Check size={13} className="text-success-base" />
                ) : (
                  <Copy size={13} />
                )}

                {copied ? "Copied" : "Copy"}
              </Button>
            </div>

            <p className="mt-2 text-[9px] leading-4 text-text-tertiary">
              Preview link only. Public invoice links and online payments will
              become active after backend integration.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-2.5">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(message)}`}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-primary-base px-5 py-3 text-xs font-semibold text-text-inverse transition hover:bg-primary-hover"
            >
              <MessageCircle size={15} />
              Send on WhatsApp
            </a>

            <Link
              to={`/invoices/${invoice.no}`}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-border-default bg-background-main px-5 py-3 text-xs font-semibold text-text-primary transition hover:bg-background-card"
            >
              <Check size={15} className="text-primary-base" />
              Done, view invoice
            </Link>
          </div>

          {/* Confirmation note */}
          <div className="flex items-start gap-2 rounded-xl bg-primary-subtle p-3">
            <CheckCircle2
              size={14}
              className="mt-0.5 flex-none text-primary-base"
            />

            <p className="text-[10px] leading-5 text-text-secondary">
              Your invoice has been saved. You can view it in your invoice list
              at any time.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

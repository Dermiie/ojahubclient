import { useEffect, useState } from "react";
import { Check, Copy, Link2, MessageCircle, X, FileText } from "lucide-react";
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
          <div className="mx-auto size-10 animate-spin rounded-full border-2 border-primary-light border-t-primary-base" />
          <p className="mt-3 text-sm font-medium text-text-secondary">
            Loading invoice...
          </p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <main className="min-h-[350px] bg-background-main p-5 sm:p-8">
        <div className="mx-auto max-w-lg rounded-2xl border border-border-default bg-background-main p-6 sm:p-8">
          <div className="grid size-12 place-items-center rounded-xl bg-primary-subtle">
            <FileText className="size-6 text-primary-base" />
          </div>

          <h1 className="mt-5 text-xl font-bold text-text-primary sm:text-2xl">
            {error ? "Something went wrong" : "Invoice not found"}
          </h1>

          <p className="mt-3 text-sm leading-7 text-text-secondary sm:text-base">
            {error ||
              "This invoice could not be found in your saved invoice data."}
          </p>

          <Link
            to="/invoices"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-primary-base px-6 py-3 text-sm font-semibold text-text-inverse transition hover:bg-primary-hover"
          >
            Back to invoices
          </Link>
        </div>
      </main>
    );
  }

  const total = getInvoiceTotal(invoice);
  const customerName = customer?.name ?? "Customer";

  // Placeholder business name until it is connected to the
  // signed-in business or organisation data.
  const businessName = "Adaeze Fabrics";

  // Placeholder URL until public invoice links and payment
  // provider integration are connected.
  const payLink = `ojahub.com/pay/${invoice.no}`;
  const fullPayLink = `https://${payLink}`;

  const sentTime = new Date()
    .toLocaleTimeString("en-NG", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace(/\s/g, "")
    .toLowerCase();

  const messageIntro =
    `Hello ${customerName}, thank you for your business at ${businessName}. ` +
    `Your invoice for ` +
    `${invoice.lines.map((line) => `${line.name} x${line.qty}`).join(", ")} ` +
    `is ready. Total due: ${formatNaira(total)}. ` +
    `View details and pay instantly here: `;

  const message = `${messageIntro}${fullPayLink}`;

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
    <main className="mx-auto min-h-full w-full max-w-[520px] bg-background-main px-4 py-5 sm:px-6 sm:py-8 lg:max-w-[1250px] lg:px-8">
      {/* Mobile close */}
      <header className="flex justify-end lg:hidden">
        <Link
          to="/invoices"
          aria-label="Close"
          className="grid size-10 flex-none place-items-center rounded-full border border-border-default bg-background-main text-primary-base transition hover:bg-primary-subtle"
        >
          <X size={19} />
        </Link>
      </header>

      {/* Desktop page heading */}
      <header className="mb-8 hidden lg:block">
        <p className="text-sm font-medium text-text-secondary">Invoice</p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-text-primary">
          Send invoice
        </h1>
      </header>

      {/* Main content */}
      <div className="lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:grid-rows-[auto_auto_1fr] lg:items-start lg:gap-x-8">
        {/* Success heading */}
        <section className="flex flex-col items-center text-center lg:col-start-2 lg:row-start-1 lg:flex-row lg:gap-4 lg:text-left">
          <div className="grid size-16 flex-none place-items-center rounded-full bg-success-light lg:size-14">
            <div className="grid size-12 place-items-center rounded-full bg-primary-base lg:size-10">
              <Check size={26} className="text-text-inverse" strokeWidth={3} />
            </div>
          </div>

          <div className="min-w-0">
            <h2 className="mt-4 text-xl font-bold text-text-primary sm:text-2xl lg:mt-0">
              Invoice ready
            </h2>

            <p className="mt-2 break-words text-sm leading-6 text-text-secondary lg:mt-1">
              {invoice.no} · {formatNaira(total)}
              <span className="lg:hidden"> for {customerName}</span>
            </p>
          </div>
        </section>

        {/* WhatsApp message preview */}
        <section className="mt-6 rounded-2xl bg-secondary-base/15 p-4 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0 lg:p-6">
          <div className="flex justify-center">
            <span className="rounded-full bg-background-main/80 px-3 py-1.5 text-xs font-semibold text-text-secondary">
              Message preview
            </span>
          </div>

          <div className="mt-4 rounded-xl rounded-tr-sm bg-success-light p-4 text-sm leading-6 text-text-primary shadow-sm">
            <p className="whitespace-pre-wrap break-words">
              {messageIntro}
              <span className="break-all text-primary-base underline">
                {payLink}
              </span>
            </p>

            <div className="mt-2 flex justify-end">
              <span className="text-xs text-text-secondary">{sentTime}</span>
            </div>
          </div>
        </section>

        {/* Invoice link */}
        <section className="mt-5 flex min-w-0 items-center gap-3 rounded-xl border border-border-default bg-background-main px-4 py-3 lg:col-start-2 lg:row-start-2">
          <Link2 size={18} className="flex-none text-text-secondary" />

          <p className="min-w-0 flex-1 truncate text-sm font-medium text-text-primary">
            {payLink}
          </p>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={copyLink}
            className="h-9 flex-none gap-2 rounded-lg border-border-default px-3 text-sm font-semibold text-text-primary hover:bg-primary-subtle"
          >
            {copied ? (
              <Check size={16} className="text-success-base" />
            ) : (
              <Copy size={16} />
            )}

            {copied ? "Copied" : "Copy"}
          </Button>
        </section>

        {/* Actions */}
        <section className="mt-10 space-y-3 lg:col-start-2 lg:row-start-3 lg:mt-3">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary-base px-5 py-3 text-sm font-semibold text-text-inverse transition hover:bg-primary-hover"
          >
            <MessageCircle size={18} />
            Send on WhatsApp
          </a>

          <Link
            to={`/invoices/${invoice.no}`}
            className="flex min-h-12 w-full items-center justify-center rounded-full border border-primary-base bg-background-main px-5 py-3 text-sm font-semibold text-primary-base transition hover:bg-primary-subtle"
          >
            Done, view invoice
          </Link>
        </section>
      </div>
    </main>
  );
}

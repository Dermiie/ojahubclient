import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  MessageCircle,
  Receipt,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router";

import {
  fetchInvoices,
  fetchCustomers,
  formatNaira,
  getInvoiceBalance,
  getInvoiceTotal,
  type Invoice,
  type Customer,
} from "@/lib/invoices";

import RecordPaymentModal from "../recordpaymentmodal";

type PageData = {
  invoice: Invoice;
  customer?: Customer;
};

export default function InvoiceDetailPage() {
  const { invoiceNo } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const isDevRoute = location.pathname.startsWith("/__dev");

  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    let active = true;

    const loadInvoice = async () => {
      try {
        setLoading(true);
        setNotFound(false);

        const [invoices, customers] = await Promise.all([
          fetchInvoices(),
          fetchCustomers(),
        ]);

        const foundInvoice = invoices.find((item) => item.no === invoiceNo);

        if (!active) return;

        if (!foundInvoice) {
          setNotFound(true);
          setData(null);
          return;
        }

        const foundCustomer = customers.find(
          (item) => item.id === foundInvoice.customerId,
        );

        setData({
          invoice: foundInvoice,
          customer: foundCustomer,
        });
      } catch (error) {
        console.error("Unable to load invoice:", error);

        if (active) {
          setNotFound(true);
          setData(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadInvoice();

    return () => {
      active = false;
    };
  }, [invoiceNo]);

  const invoice = data?.invoice;
  const customer = data?.customer;

  const total = useMemo(
    () => (invoice ? getInvoiceTotal(invoice) : 0),
    [invoice],
  );

  const balance = useMemo(
    () => (invoice ? getInvoiceBalance(invoice) : 0),
    [invoice],
  );

  const statusLabel = (status: Invoice["status"]) => {
    switch (status) {
      case "Paid":
        return "Paid";
      case "Part-paid":
        return "Part-paid";
      case "Owing":
        return "Payment overdue";
      default:
        return "Waiting for transfer";
    }
  };

  const statusStyles = (status: Invoice["status"]) => {
    switch (status) {
      case "Paid":
        return "bg-success-light text-success-base";
      case "Part-paid":
        return "bg-secondary-base/15 text-secondary-base";
      case "Owing":
        return "bg-background-muted text-text-primary";
      default:
        return "bg-primary-subtle text-primary-base";
    }
  };

  const goBack = () => {
    navigate(isDevRoute ? "/__dev/invoice-preview" : "/invoices");
  };

  const shareInvoice = () => {
    if (!invoice) return;

    const message = [
      "OjaHub Invoice",
      `Invoice: ${invoice.no}`,
      `Customer: ${customer?.name ?? "Customer"}`,
      `Invoice total: ${formatNaira(total)}`,
      `Amount paid: ${formatNaira(invoice.paid)}`,
      `Balance: ${formatNaira(balance)}`,
    ].join("\n");

    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const copyInvoiceNumber = async () => {
    if (!invoice) return;

    try {
      await navigator.clipboard.writeText(invoice.no);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Unable to copy invoice number:", error);
    }
  };

  const handlePaymentSaved = (
    updatedInvoice: Invoice,
    updatedCustomer: Customer,
  ) => {
    setData({
      invoice: updatedInvoice,
      customer: updatedCustomer,
    });

    setShowPaymentModal(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-background-main">
        <div className="flex items-center gap-3 text-sm font-medium text-primary-active">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-light border-t-primary-base" />
          Loading invoice...
        </div>
      </div>
    );
  }

  if (notFound || !invoice) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-background-main px-5">
        <div className="w-full max-w-md rounded-2xl border border-border-default bg-background-main p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-subtle text-primary-active">
            <Receipt size={25} />
          </div>

          <h2 className="text-xl font-bold text-text-primary">
            Invoice not found
          </h2>

          <p className="mt-2 text-sm leading-6 text-text-secondary">
            This invoice could not be found in your saved invoice data. It may
            not have been saved yet, or the invoice number may be incorrect.
          </p>

          <button
            type="button"
            onClick={goBack}
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary-base px-6 text-sm font-semibold text-text-inverse transition hover:bg-primary-hover"
          >
            <ArrowLeft size={16} />
            Back to invoices
          </button>
        </div>
      </div>
    );
  }

  const resolvedCustomer: Customer = customer ?? {
    id: invoice.customerId,
    name: "Customer",
  };

  const customerFirstName = resolvedCustomer.name.split(" ")[0];
  const formattedDate = invoice.day || "Today";

  return (
    <div className="min-h-screen bg-background-main pb-8">
      <div className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6 lg:px-9 lg:py-6">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={goBack}
              aria-label="Back to invoices"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-default text-primary-active transition hover:bg-primary-subtle"
            >
              <ArrowLeft size={17} />
            </button>

            <div className="min-w-0">
              <p className="text-[10px] font-medium text-text-tertiary">
                Invoices
              </p>

              <div className="mt-0.5 flex items-center gap-2">
                <h1 className="text-xl font-bold text-text-primary">
                  {invoice.no}
                </h1>

                <button
                  type="button"
                  onClick={copyInvoiceNumber}
                  aria-label="Copy invoice number"
                  className="text-text-tertiary transition hover:text-primary-base"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>

          {/* Desktop actions */}
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={shareInvoice}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-border-default bg-background-main px-4 text-[11px] font-semibold text-text-primary transition hover:bg-background-card"
            >
              <MessageCircle size={14} />
              Resend on WhatsApp
            </button>

            <button
              type="button"
              onClick={() => setShowPaymentModal(true)}
              disabled={balance <= 0}
              className="inline-flex h-9 items-center gap-2 rounded-full bg-primary-base px-4 text-[11px] font-semibold text-text-inverse transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Receipt size={14} />
              Record payment
            </button>
          </div>
        </div>

        {/* Invoice summary card */}
        <section className="relative mb-5 min-h-[132px] overflow-hidden rounded-[17px] bg-primary-active px-5 py-5 text-text-inverse sm:px-7 sm:py-6">
          {/* Decorative rings */}
          <div className="pointer-events-none absolute -right-10 -top-24 h-64 w-64 rounded-full border border-white/[0.08]" />
          <div className="pointer-events-none absolute -right-1 -top-16 h-52 w-52 rounded-full border border-white/[0.08]" />
          <div className="pointer-events-none absolute right-9 -top-8 h-36 w-36 rounded-full border border-white/[0.08]" />

          <div className="relative z-10">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-semibold ${statusStyles(invoice.status)}`}
            >
              {invoice.status === "Paid" ? (
                <CheckCircle2 size={11} />
              ) : (
                <Clock3 size={11} />
              )}
              {statusLabel(invoice.status)}
            </span>

            {/* Figma shows invoice total here, not remaining balance */}
            <h2 className="mt-2 text-[30px] font-bold tracking-tight sm:text-[36px]">
              {formatNaira(total)}
            </h2>

            <div className="mt-1 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-secondary-base text-[9px] font-bold text-text-inverse">
                {resolvedCustomer.name.charAt(0).toUpperCase()}
              </div>

              <span className="text-[10px] font-semibold text-text-inverse">
                {resolvedCustomer.name}
              </span>
            </div>

            {invoice.paid > 0 && (
              <p className="mt-3 text-[9px] text-text-secondary-inverse">
                {formatNaira(invoice.paid)} paid
                {balance > 0
                  ? ` · ${formatNaira(balance)} remaining`
                  : " · Fully paid"}
              </p>
            )}
          </div>
        </section>

        {/* Activity and Items */}
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
          {/* Activity */}
          <section className="rounded-xl border border-border-default bg-background-main p-4 sm:p-5">
            <h2 className="mb-5 text-[12px] font-bold text-text-primary">
              Activity
            </h2>

            <div className="relative space-y-5">
              <div className="absolute bottom-4 left-[6px] top-2 w-px bg-primary-light" />

              {/* Created */}
              <div className="relative flex gap-3">
                <div className="relative z-10 flex h-[13px] w-[13px] shrink-0 items-center justify-center rounded-full bg-primary-base text-text-inverse ring-4 ring-background-main">
                  <Check size={9} strokeWidth={3} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-text-primary">
                    Created
                  </p>

                  <p className="mt-1 text-[9px] leading-4 text-text-secondary">
                    Invoice created for {resolvedCustomer.name}
                  </p>

                  <p className="mt-1 text-[8px] text-text-tertiary">
                    {formattedDate}
                    {invoice.time ? ` · ${invoice.time}` : ""}
                  </p>
                </div>
              </div>

              {/* Sent on WhatsApp */}
              <div className="relative flex gap-3">
                <div className="relative z-10 flex h-[13px] w-[13px] shrink-0 items-center justify-center rounded-full bg-primary-base text-text-inverse ring-4 ring-background-main">
                  <Check size={9} strokeWidth={3} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-text-primary">
                    Sent on WhatsApp
                  </p>

                  <p className="mt-1 text-[9px] leading-4 text-text-secondary">
                    Invoice sent to customer
                  </p>
                </div>
              </div>

              {/* Opened */}
              <div className="relative flex gap-3">
                <div className="relative z-10 flex h-[13px] w-[13px] shrink-0 items-center justify-center rounded-full bg-primary-base text-text-inverse ring-4 ring-background-main">
                  <Check size={9} strokeWidth={3} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-text-primary">
                    Opened by {customerFirstName}
                  </p>

                  <p className="mt-1 text-[9px] leading-4 text-text-secondary">
                    Invoice viewed by customer
                  </p>
                </div>
              </div>

              {/* Payment status */}
              <div className="relative flex gap-3">
                <div className="relative z-10 flex h-[13px] w-[13px] shrink-0 items-center justify-center rounded-full border border-secondary-base bg-background-main ring-4 ring-background-main">
                  <span className="h-1 w-1 rounded-full bg-secondary-base" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-text-primary">
                    Payment
                  </p>

                  <p className="mt-1 text-[9px] leading-4 text-text-secondary">
                    {balance > 0
                      ? "Waiting for transfer"
                      : "Invoice fully paid"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Items */}
          <section className="rounded-xl border border-border-default bg-background-main p-4 sm:p-5">
            <h2 className="mb-5 text-[12px] font-bold text-text-primary">
              Items
            </h2>

            {/* Desktop table */}
            <div className="hidden sm:block">
              <div className="grid grid-cols-[minmax(0,1fr)_55px_85px_95px] gap-3 border-b border-border-subtle pb-3 text-[9px] font-medium text-text-secondary">
                <span>Product</span>
                <span className="text-right">Qty</span>
                <span className="text-right">Price</span>
                <span className="text-right">Total</span>
              </div>

              <div className="divide-y divide-border-subtle">
                {invoice.lines.map((line, index) => (
                  <div
                    key={`${line.name}-${index}`}
                    className="grid grid-cols-[minmax(0,1fr)_55px_85px_95px] items-center gap-3 py-3"
                  >
                    <span className="break-words text-[10px] font-medium text-text-primary">
                      {line.name}
                    </span>

                    <span className="text-right text-[9px] text-text-secondary">
                      {line.qty}
                    </span>

                    <span className="text-right text-[9px] text-text-secondary">
                      {formatNaira(line.price)}
                    </span>

                    <span className="text-right text-[10px] font-semibold text-text-primary">
                      {formatNaira(line.qty * line.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile item list */}
            <div className="space-y-4 sm:hidden">
              {invoice.lines.map((line, index) => (
                <div
                  key={`${line.name}-${index}`}
                  className="flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="break-words text-[10px] font-medium leading-5 text-text-primary">
                      {line.name}
                    </p>

                    <p className="mt-0.5 text-[9px] text-text-secondary">
                      {line.qty} × {formatNaira(line.price)}
                    </p>
                  </div>

                  <p className="shrink-0 text-[10px] font-semibold text-text-primary">
                    {formatNaira(line.qty * line.price)}
                  </p>
                </div>
              ))}
            </div>

            <div className="my-4 border-t border-border-subtle" />

            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-text-secondary">
                Total due
              </span>

              <span className="text-[11px] font-bold text-text-primary">
                {formatNaira(total)}
              </span>
            </div>

            {invoice.paid > 0 && (
              <>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-text-secondary">
                    Total paid
                  </span>

                  <span className="text-[10px] font-bold text-success-base">
                    {formatNaira(invoice.paid)}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-text-secondary">
                    Still to pay
                  </span>

                  <span className="text-[10px] font-bold text-text-primary">
                    {formatNaira(balance)}
                  </span>
                </div>
              </>
            )}
          </section>
        </div>

        {/* Mobile actions */}
        <div className="mt-5 grid grid-cols-1 gap-2 sm:hidden">
          <button
            type="button"
            onClick={() => setShowPaymentModal(true)}
            disabled={balance <= 0}
            className="flex h-11 items-center justify-center gap-2 rounded-full bg-primary-base text-[11px] font-semibold text-text-inverse transition hover:bg-primary-hover disabled:opacity-50"
          >
            <Receipt size={14} />
            Record payment
          </button>

          <button
            type="button"
            onClick={shareInvoice}
            className="flex h-11 items-center justify-center gap-2 rounded-full border border-border-default bg-background-main text-[11px] font-semibold text-text-primary transition hover:bg-background-card"
          >
            <MessageCircle size={14} />
            Resend on WhatsApp
          </button>
        </div>
      </div>

      {/* Record Payment Modal */}
      {showPaymentModal && (
        <RecordPaymentModal
          invoice={invoice}
          customer={resolvedCustomer}
          onClose={() => setShowPaymentModal(false)}
          onSaved={handlePaymentSaved}
        />
      )}
    </div>
  );
}

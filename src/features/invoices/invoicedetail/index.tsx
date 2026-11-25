import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  Clock3,
  Info,
  MessageCircle,
  Receipt,
  Share2,
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
        return "Paid · verified";
      case "Part-paid":
        return "Part-paid";
      case "Owing":
        return "Payment overdue";
      default:
        return "Waiting for transfer";
    }
  };

  const statusDot = (status: Invoice["status"]) => {
    switch (status) {
      case "Paid":
        return "bg-success-base";
      case "Part-paid":
        return "bg-secondary-base";
      case "Owing":
        return "bg-text-tertiary";
      default:
        return "bg-primary-base";
    }
  };

  const goBack = () => {
    navigate(isDevRoute ? "/__dev/invoice-preview" : "/invoices");
  };

  const viewPayment = () => {
    navigate("/payments");
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

  const shareReceipt = () => {
    if (!invoice) return;

    const message = [
      "OjaHub Receipt",
      `Invoice: ${invoice.no}`,
      `Customer: ${customer?.name ?? "Customer"}`,
      `Amount paid: ${formatNaira(invoice.paid)}`,
    ].join("\n");

    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const remindCustomer = () => {
    if (!invoice) return;

    const message = [
      `Hello ${customer?.name ?? "Customer"}, this is a friendly reminder about invoice ${invoice.no}.`,
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

  const isPaid = balance <= 0;
  const isPartPaid = !isPaid && invoice.status === "Part-paid";

  const paidPercent =
    total > 0 ? Math.min(100, Math.round((invoice.paid / total) * 100)) : 0;

  const ringTone = isPartPaid
    ? "border-text-inverse/10"
    : "border-primary-base/10";

  const customerFirstName = resolvedCustomer.name.split(" ")[0];

  // Generate initials from the first two words of the customer name.
  const customerInitials = resolvedCustomer.name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  const firstItemName = invoice.lines[0]?.name;

  const paidNote = [
    `Paid by transfer ${(invoice.day || "today").toLowerCase()}${
      invoice.time ? ` at ${invoice.time}` : ""
    }`,
    firstItemName ? `${firstItemName} stock updated` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  const heroNote = isPaid
    ? paidNote
    : invoice.paid > 0
      ? `${formatNaira(invoice.paid)} paid · ${formatNaira(balance)} remaining`
      : `${formatNaira(balance)} still to pay`;

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
              <p className="hidden text-[10px] font-medium text-text-tertiary sm:block">
                Invoices
              </p>

              <h1 className="text-xl font-bold text-text-primary sm:mt-0.5">
                {invoice.no}
              </h1>
            </div>
          </div>

          {/* Desktop actions */}
          <div className="hidden items-center gap-2 sm:flex">
            {isPaid ? (
              <>
                <button
                  type="button"
                  onClick={viewPayment}
                  className="inline-flex h-9 items-center gap-2 rounded-full border border-border-default bg-background-main px-4 text-[11px] font-semibold text-text-primary transition hover:bg-background-card"
                >
                  View payment
                </button>

                <button
                  type="button"
                  onClick={shareReceipt}
                  className="inline-flex h-9 items-center gap-2 rounded-full bg-primary-base px-4 text-[11px] font-semibold text-text-inverse transition hover:bg-primary-hover"
                >
                  <Share2 size={14} />
                  Share receipt
                </button>
              </>
            ) : isPartPaid ? (
              <>
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(true)}
                  className="inline-flex h-9 items-center gap-2 rounded-full border border-border-default bg-background-main px-4 text-[11px] font-semibold text-text-primary transition hover:bg-background-card"
                >
                  Paid another way
                </button>

                <button
                  type="button"
                  onClick={remindCustomer}
                  className="inline-flex h-9 items-center gap-2 rounded-full bg-primary-base px-4 text-[11px] font-semibold text-text-inverse transition hover:bg-primary-hover"
                >
                  <MessageCircle size={14} />
                  Remind {customerFirstName} to pay the rest
                </button>
              </>
            ) : (
              <>
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
                  className="inline-flex h-9 items-center gap-2 rounded-full bg-primary-base px-4 text-[11px] font-semibold text-text-inverse transition hover:bg-primary-hover"
                >
                  <Receipt size={14} />
                  Record payment
                </button>
              </>
            )}
          </div>
        </div>

        {/* Invoice summary card */}
        <section
          className={`relative mb-5 min-h-[132px] overflow-hidden rounded-[17px] px-5 py-5 sm:px-7 sm:py-6 ${
            isPartPaid
              ? "bg-primary-active text-text-inverse"
              : "bg-success-light text-text-primary"
          }`}
        >
          {/* Decorative rings */}
          <div
            className={`pointer-events-none absolute -right-10 -top-24 h-64 w-64 rounded-full border ${ringTone}`}
          />
          <div
            className={`pointer-events-none absolute -right-1 -top-16 h-52 w-52 rounded-full border ${ringTone}`}
          />
          <div
            className={`pointer-events-none absolute right-9 -top-8 h-36 w-36 rounded-full border ${ringTone}`}
          />

          {isPartPaid ? (
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-text-inverse/15 px-2.5 py-1 text-[9px] font-semibold text-text-inverse">
                <span className="size-1.5 rounded-full bg-text-inverse" />
                {statusLabel(invoice.status)}
              </span>

              <p className="mt-3 text-[10px] text-text-secondary-inverse">
                Still to pay
              </p>

              <h2 className="mt-1 text-[30px] font-bold tracking-tight sm:text-[36px]">
                {formatNaira(balance)}
              </h2>

              {/* Payment progress */}
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-text-inverse/20">
                <div
                  className="h-full rounded-full bg-primary-light"
                  style={{ width: `${paidPercent}%` }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between gap-3 text-[9px] text-text-secondary-inverse">
                <span>{formatNaira(invoice.paid)} paid · verified</span>
                <span>of {formatNaira(total)}</span>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <div className="flex h-6 min-w-6 items-center justify-center rounded-lg bg-secondary-base px-1.5 text-[9px] font-bold text-text-inverse">
                  {customerInitials || "CU"}
                </div>

                <span className="text-[10px] font-semibold text-text-inverse">
                  {resolvedCustomer.name}
                </span>
              </div>
            </div>
          ) : (
            <div className="relative z-10">
              <span
                className={`inline-flex items-center gap-1.5 text-[10px] font-semibold ${
                  isPaid ? "text-success-base" : "text-text-secondary"
                }`}
              >
                {isPaid ? (
                  <span
                    className={`size-1.5 rounded-full ${statusDot(invoice.status)}`}
                  />
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
                <div className="flex h-6 min-w-6 items-center justify-center rounded-lg bg-background-main px-1.5 text-[9px] font-bold text-text-primary">
                  {customerInitials || "CU"}
                </div>

                <span className="text-[10px] font-semibold text-text-primary">
                  {resolvedCustomer.name}
                </span>
              </div>

              <p className="mt-3 text-[9px] leading-4 text-text-secondary">
                {heroNote}
              </p>
            </div>
          )}
        </section>

        {/* Activity and Items */}
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
          {/* Activity */}
          <section className="rounded-xl border border-border-default bg-background-main p-4 sm:p-5">
            <h2 className="mb-5 text-[12px] font-bold text-text-primary">
              Activity
            </h2>

            <div className="relative space-y-5">
              <div className="absolute bottom-4 left-[6px] top-2 w-px bg-primary-base" />

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
                    {invoice.time ? `${invoice.time} · ` : ""}from Maza Maza
                    Warehouse
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
              {!isPartPaid && (
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
              )}

              {/* Payment status */}
              <div className="relative flex gap-3">
                {isPaid || isPartPaid ? (
                  <div className="relative z-10 flex h-[13px] w-[13px] shrink-0 items-center justify-center rounded-full bg-primary-base text-text-inverse ring-4 ring-background-main">
                    <Check size={9} strokeWidth={3} />
                  </div>
                ) : (
                  <div className="relative z-10 flex h-[13px] w-[13px] shrink-0 items-center justify-center rounded-full border border-secondary-base bg-background-main ring-4 ring-background-main">
                    <span className="h-1 w-1 rounded-full bg-secondary-base" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-text-primary">
                    {isPartPaid
                      ? `Paid ${formatNaira(invoice.paid)}`
                      : isPaid
                        ? "Paid"
                        : "Payment"}
                  </p>

                  <p className="mt-1 text-[9px] leading-4 text-text-secondary">
                    {isPaid || isPartPaid
                      ? "Verified by OjaHub"
                      : "Waiting for transfer"}
                  </p>
                </div>
              </div>

              {/* Remaining balance */}
              {isPartPaid && (
                <div className="relative flex gap-3">
                  <div className="relative z-10 flex h-[13px] w-[13px] shrink-0 items-center justify-center rounded-full border border-dashed border-primary-base bg-background-main ring-4 ring-background-main" />

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-text-primary">
                      {formatNaira(balance)} still to pay
                    </p>

                    <p className="mt-1 text-[9px] leading-4 text-text-secondary">
                      {customerFirstName} can pay with the same link
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Items */}
          <section
            className={`bg-background-main sm:block sm:rounded-xl sm:border sm:border-border-default sm:p-5 ${
              isPartPaid ? "hidden" : ""
            }`}
          >
            <h2 className="mb-4 text-[12px] font-bold text-text-primary sm:mb-5">
              Items
            </h2>

            <div className="space-y-4">
              {invoice.lines.map((line, index) => (
                <div
                  key={`${line.name}-${index}`}
                  className="flex items-start justify-between gap-3"
                >
                  <p className="min-w-0 break-words text-[10px] font-medium leading-5 text-text-primary">
                    {line.name}{" "}
                    <span className="text-text-secondary">
                      · {line.qty} × {formatNaira(line.price)}
                    </span>
                  </p>

                  <p className="shrink-0 text-[10px] font-semibold text-text-primary">
                    {formatNaira(line.qty * line.price)}
                  </p>
                </div>
              ))}
            </div>

            <div className={isPaid ? "hidden sm:block" : ""}>
              <div className="my-4 border-t border-border-subtle" />

              {isPaid || isPartPaid ? (
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-text-primary">
                    Total paid
                  </span>

                  <span className="text-[11px] font-bold text-text-primary">
                    {formatNaira(invoice.paid)}
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-text-secondary">
                      Total due
                    </span>

                    <span className="text-[11px] font-bold text-text-primary">
                      {formatNaira(total)}
                    </span>
                  </div>

                  {invoice.paid > 0 && (
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-text-secondary">
                        Total paid
                      </span>

                      <span className="text-[10px] font-bold text-success-base">
                        {formatNaira(invoice.paid)}
                      </span>
                    </div>
                  )}

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
            </div>
          </section>
        </div>

        {/* Mobile stock note */}
        {isPartPaid && (
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-secondary-base/15 p-3 sm:hidden">
            <Info size={14} className="mt-0.5 flex-none text-secondary-base" />

            <p className="text-[10px] leading-4 text-text-secondary">
              Stock leaves Maza Maza Warehouse when the invoice is fully paid,
              unless you release the goods earlier.
            </p>
          </div>
        )}

        {/* Mobile actions */}
        <div className="mt-5 grid grid-cols-1 gap-2 sm:hidden">
          {isPaid ? (
            <>
              <button
                type="button"
                onClick={shareReceipt}
                className="flex h-11 items-center justify-center gap-2 rounded-full bg-primary-base text-[11px] font-semibold text-text-inverse transition hover:bg-primary-hover"
              >
                Share receipt
              </button>

              <button
                type="button"
                onClick={viewPayment}
                className="flex h-11 items-center justify-center gap-2 rounded-full border border-border-default bg-background-main text-[11px] font-semibold text-text-primary transition hover:bg-background-card"
              >
                View payment
              </button>
            </>
          ) : isPartPaid ? (
            <>
              <button
                type="button"
                onClick={remindCustomer}
                className="flex h-11 items-center justify-center gap-2 rounded-full bg-primary-base text-[11px] font-semibold text-text-inverse transition hover:bg-primary-hover"
              >
                <MessageCircle size={14} />
                Remind {customerFirstName} to pay the rest
              </button>

              <button
                type="button"
                onClick={() => setShowPaymentModal(true)}
                className="flex h-11 items-center justify-center gap-2 rounded-full border border-border-default bg-background-main text-[11px] font-semibold text-text-primary transition hover:bg-background-card"
              >
                Paid another way?
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setShowPaymentModal(true)}
                className="flex h-11 items-center justify-center gap-2 rounded-full bg-primary-base text-[11px] font-semibold text-text-inverse transition hover:bg-primary-hover"
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
            </>
          )}
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

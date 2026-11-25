import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  Plus,
  FileText,
  ChevronRight,
  X,
  CheckCircle2,
  Clock3,
  CircleAlert,
  Receipt,
} from 'lucide-react';
import { Link } from 'react-router';

import {
  fetchInvoices,
  fetchCustomers,
  formatNaira,
  getInvoiceTotal,
  getInvoiceBalance,
  getItemsSummary,
} from '@/lib/invoices';

import type { Invoice } from '@/lib/invoices';

type InvoiceFilter = 'All' | Invoice['status'] | 'Outstanding';

const statusStyles: Record<Invoice['status'], string> = {
  Waiting: 'bg-background-muted text-text-secondary',
  Paid: 'bg-success-light text-success-base',
  'Part-paid': 'bg-primary-subtle text-primary-base',
  Owing: 'bg-secondary-base/15 text-secondary-base',
};

const statusDots: Record<Invoice['status'], string> = {
  Waiting: 'bg-text-tertiary',
  Paid: 'bg-success-base',
  'Part-paid': 'bg-primary-base',
  Owing: 'bg-secondary-base',
};

function StatusBadge({ status }: { status: Invoice['status'] }) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[status]}`}
    >
      <span className={`size-1.5 rounded-full ${statusDots[status]}`} />
      {status}
    </span>
  );
}

function CustomerAvatar({
  name,
  small = false,
}: {
  name: string;
  small?: boolean;
}) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Alternate between the green and tan avatar styles from Figma.
  const tone =
    name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % 2 === 0
      ? "bg-primary-subtle text-primary-base"
      : "bg-secondary-base/15 text-secondary-base";

  return (
    <div
      className={`grid flex-none place-items-center font-bold ${
        small ? "size-7 rounded-lg text-[10px]" : "size-10 rounded-xl text-xs"
      } ${tone}`}
    >
      {initials || "CU"}
    </div>
  );
}

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState<InvoiceFilter>("All");
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const {
    data: invoices = [],
    isLoading: invoicesLoading,
    isError: invoicesError,
    refetch: refetchInvoices,
  } = useQuery({
    queryKey: ['invoices'],
    queryFn: fetchInvoices,
  });

  const {
    data: customers = [],
    isLoading: customersLoading,
    isError: customersError,
    refetch: refetchCustomers,
  } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
  });

  const isLoading = invoicesLoading || customersLoading;
  const hasError = invoicesError || customersError;

  const customerMap = useMemo(
    () => new Map(customers.map((customer) => [customer.id, customer])),
    [customers],
  );

  const getCustomerName = (invoice: Invoice) =>
    customerMap.get(invoice.customerId)?.name ?? invoice.customerId;

  const stats = useMemo(() => {
    const waiting = invoices.filter((invoice) => invoice.status === 'Waiting');

    const outstanding = invoices.filter(
      (invoice) => invoice.status === 'Owing' || invoice.status === 'Part-paid',
    );

    const paidToday = invoices.filter(
      (invoice) =>
        invoice.status === "Paid" && invoice.day.toLowerCase() === "today",
    );

    return {
      waitingAmount: waiting.reduce(
        (sum, invoice) => sum + getInvoiceBalance(invoice),
        0,
      ),
      waitingCount: waiting.length,

      outstandingAmount: outstanding.reduce(
        (sum, invoice) => sum + getInvoiceBalance(invoice),
        0,
      ),
      outstandingCount: outstanding.length,

      paidTodayAmount: paidToday.reduce(
        (sum, invoice) => sum + invoice.paid,
        0,
      ),
      paidTodayCount: paidToday.length,
    };
  }, [invoices]);

  const statusCounts = useMemo(
    () => ({
      All: invoices.length,
      Waiting: invoices.filter((item) => item.status === 'Waiting').length,
      Paid: invoices.filter((item) => item.status === 'Paid').length,
      'Part-paid': invoices.filter((item) => item.status === 'Part-paid')
        .length,
      Owing: invoices.filter((item) => item.status === 'Owing').length,
    }),
    [invoices],
  );

  const filteredInvoices = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return invoices.filter((invoice) => {
      const customerName =
        customerMap.get(invoice.customerId)?.name ?? invoice.customerId;

      const matchesStatus =
        activeStatus === 'All' ||
        (activeStatus === 'Outstanding'
          ? invoice.status === 'Owing' || invoice.status === 'Part-paid'
          : invoice.status === activeStatus);

      const searchableText = [
        invoice.no,
        invoice.customerId,
        customerName,
        getItemsSummary(invoice),
        invoice.status,
      ]
        .join(' ')
        .toLowerCase();

      return matchesStatus && (!search || searchableText.includes(search));
    });
  }, [invoices, customerMap, activeStatus, searchTerm]);

  // Group invoices by day (Today, Yesterday...) for the mobile list.
  const groupedInvoices = useMemo(() => {
    const groups: Array<{ day: string; items: Invoice[] }> = [];

    filteredInvoices.forEach((invoice) => {
      const group = groups.find((item) => item.day === invoice.day);

      if (group) {
        group.items.push(invoice);
      } else {
        groups.push({ day: invoice.day, items: [invoice] });
      }
    });

    return groups;
  }, [filteredInvoices]);

  const hasFilters = Boolean(searchTerm) || activeStatus !== "All";

  const filters: Array<'All' | Invoice['status']> = [
    'All',
    'Waiting',
    'Paid',
    'Part-paid',
    'Owing',
  ];

  const handleRetry = () => {
    void refetchInvoices();
    void refetchCustomers();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setActiveStatus('All');
  };

  return (
    <main className="mx-auto w-full min-w-0 max-w-[1600px] space-y-5 bg-background-main px-3 py-4 sm:space-y-6 sm:px-5 sm:py-6 lg:px-7">
      {/* Page heading */}
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          Invoices
        </h1>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            type="button"
            onClick={() => setShowMobileSearch((current) => !current)}
            aria-label={showMobileSearch ? "Hide search" : "Show search"}
            aria-expanded={showMobileSearch}
            className="grid size-10 place-items-center rounded-full border border-border-default bg-background-main text-text-primary transition hover:bg-background-muted"
          >
            <Search size={18} />
          </button>

          <Link
            to="/invoices/new"
            aria-label="New invoice"
            className="grid size-10 place-items-center rounded-full bg-primary-base text-text-inverse shadow-sm transition hover:bg-primary-hover"
          >
            <Plus size={20} />
          </Link>
        </div>

        {/* Desktop action */}
        <Link
          to="/invoices/new"
          className="hidden h-10 items-center gap-2 rounded-full bg-primary-base px-4 text-sm font-semibold text-text-inverse shadow-sm transition hover:bg-primary-hover sm:inline-flex"
        >
          <Plus size={16} />
          New Invoice
        </Link>
      </header>

      {/* Summary cards */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {/* Waiting */}
        <button
          type="button"
          onClick={() => setActiveStatus('Waiting')}
          aria-pressed={activeStatus === 'Waiting'}
          className="group rounded-2xl bg-primary-active p-5 text-left text-text-inverse transition hover:shadow-md sm:p-6"
        >
          {/* Decorative arcs */}
          <div className="pointer-events-none absolute -right-10 -top-16 size-44 rounded-full border border-text-inverse/10" />
          <div className="pointer-events-none absolute -right-3 -top-10 size-28 rounded-full border border-text-inverse/10" />

          <div className="relative">
            <span className="block text-xs font-medium text-text-secondary-inverse">
              Waiting for transfer
            </span>

            <p className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">
              {formatNaira(stats.waitingAmount)}
            </p>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-text-secondary-inverse">
              {stats.waitingCount}{' '}
              {stats.waitingCount === 1 ? 'invoice' : 'invoices'} awaiting
              payment
            </span>
          </div>
        </button>

        {/* Owing or part-paid */}
        <button
          type="button"
          onClick={() => setActiveStatus('Outstanding')}
          aria-pressed={activeStatus === 'Outstanding'}
          className="group rounded-2xl bg-secondary-base/15 p-5 text-left transition hover:shadow-md sm:p-6"
          onClick={() => setActiveStatus("Outstanding")}
          aria-pressed={activeStatus === "Outstanding"}
          className="group rounded-2xl bg-secondary-base/15 p-4 text-left transition hover:shadow-md sm:p-5"
        >
          <span className="block text-xs font-medium text-text-secondary">
            <span className="sm:hidden">Owing / part-paid</span>
            <span className="hidden sm:inline">Owing or part-paid</span>
          </span>

          <p className="mt-2 text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
            {formatNaira(stats.outstandingAmount)}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-text-secondary">
              {stats.outstandingCount}{' '}
              {stats.outstandingCount === 1 ? 'invoice' : 'invoices'} part-paid
              or owing
            </span>

            <ChevronRight
              size={18}
              className="text-secondary-base transition group-hover:translate-x-1"
            />
          </div>
          <span className="mt-2 block text-xs text-secondary-base">
            {stats.outstandingCount}{" "}
            {stats.outstandingCount === 1 ? "invoice" : "invoices"}
          </span>
        </button>

        {/* Paid today */}
        <button
          type="button"
          onClick={() => setActiveStatus('Paid')}
          aria-pressed={activeStatus === 'Paid'}
          className="group rounded-2xl border border-border-default bg-background-main p-5 text-left transition hover:shadow-md sm:col-span-2 sm:p-6 xl:col-span-1"
          onClick={() => setActiveStatus("Paid")}
          aria-pressed={activeStatus === "Paid"}
          className="group hidden rounded-2xl border border-border-default bg-background-main p-5 text-left transition hover:shadow-md sm:block"
        >
          <span className="block text-xs font-medium text-text-secondary">
            Paid today
          </span>

          <p className="mt-2 text-2xl font-bold tracking-tight text-text-primary">
            {formatNaira(stats.paidTodayAmount)}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-text-tertiary">
              {stats.paidCount} completed{' '}
              {stats.paidCount === 1 ? 'payment' : 'payments'}
            </span>

            <ChevronRight
              size={18}
              className="text-text-tertiary transition group-hover:translate-x-1"
            />
          </div>
          <span className="mt-2 block text-xs text-success-base">
            {stats.paidTodayCount}{" "}
            {stats.paidTodayCount === 1 ? "invoice" : "invoices"} · all verified
          </span>
        </button>
      </section>

      {/* Search and status filters */}
      <section className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center">
        {/* Search */}
        <div
          className={`${
            showMobileSearch ? "block" : "hidden"
          } relative min-w-0 flex-1 sm:block`}
        >
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary"
          />

          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search invoice, customer or product..."
            aria-label="Search invoices"
            className="h-10 w-full rounded-xl border border-transparent bg-background-card pl-11 pr-10 text-sm text-text-primary outline-none transition placeholder:text-text-tertiary focus:border-primary-base focus:bg-background-main focus:ring-2 focus:ring-primary-base/10"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-text-tertiary transition hover:bg-background-muted"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="-mx-3 min-w-0 overflow-x-auto px-3 sm:mx-0 sm:px-0 lg:flex-none">
          <div className="flex w-max items-center gap-2">
            {filters.map((status) => {
              const active = activeStatus === status;

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setActiveStatus(status)}
                  aria-pressed={active}
                  className={`inline-flex h-9 flex-none items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition sm:h-8 sm:px-3.5 sm:text-xs ${
                    active
                      ? 'border-primary-base bg-primary-base text-text-inverse'
                      : 'border-border-default bg-background-main text-text-secondary hover:border-primary-base/50'
                  }`}
                >
                  {status}

                  <span
                    className={`text-xs ${
                      active ? 'text-text-inverse/75' : 'text-text-tertiary'
                    }`}
                  >
                    {statusCounts[status]}
                  </span>
                  {status === "Waiting" && (
                    <span
                      className={`text-xs sm:hidden ${
                        active ? "text-text-inverse/75" : "text-text-tertiary"
                      }`}
                    >
                      · {statusCounts[status]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {activeStatus === "Outstanding" && (
          <div className="flex flex-none items-center gap-2 text-sm text-text-secondary">
            <span>Showing Part-paid and Owing invoices</span>

            <button
              type="button"
              onClick={() => setActiveStatus('All')}
              className="font-semibold text-primary-base hover:underline"
            >
              Clear
            </button>
          </div>
        )}
      </section>

      {/* Invoice results */}
      <section className="overflow-hidden rounded-2xl border border-border-default bg-background-main sm:rounded-3xl">
        {/* Results heading */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-default bg-background-main px-4 py-5 sm:px-6">
          <div>
            <h2 className="text-base font-semibold text-text-primary sm:text-lg">
              {activeStatus === 'Outstanding'
                ? 'Outstanding invoices'
                : activeStatus === 'All'
                  ? 'All invoices'
                  : `${activeStatus} invoices`}
            </h2>

            <p className="mt-1 text-xs text-text-tertiary sm:text-sm">
              Your recent customer transactions
            </p>
          </div>

          <span className="rounded-full bg-background-muted px-4 py-2 text-xs font-medium text-text-secondary">
            {filteredInvoices.length}{' '}
            {filteredInvoices.length === 1 ? 'result' : 'results'}
          </span>
        </div>

        {isLoading ? (
          <div className="flex min-h-52 items-center justify-center bg-background-main">
            <div className="text-center">
              <div className="mx-auto size-8 animate-spin rounded-full border-2 border-border-default border-t-primary-base" />

              <p className="mt-3 text-sm text-text-tertiary">
                Loading invoices...
              </p>
            </div>
          </div>
        ) : hasError ? (
          <div className="flex min-h-52 flex-col items-center justify-center bg-background-main px-5 text-center">
            <FileText size={30} className="text-text-tertiary" />

            <p className="mt-3 text-base font-semibold text-text-primary">
              Unable to load invoices
            </p>

            <p className="mt-1 text-sm text-text-tertiary">
              Please check your connection and try again.
            </p>

            <button
              type="button"
              onClick={handleRetry}
              className="mt-4 rounded-full bg-primary-base px-5 py-2.5 text-sm font-semibold text-text-inverse transition hover:bg-primary-hover"
            >
              Try again
            </button>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center bg-background-main px-5 text-center">
            <div className="grid size-14 place-items-center rounded-2xl bg-background-muted">
              <Receipt size={23} className="text-text-tertiary" />
            </div>

            <p className="mt-4 text-base font-semibold text-text-primary">
              No invoices found
            </p>

            <p className="mt-1 max-w-xs text-sm leading-6 text-text-tertiary">
              {searchTerm
                ? 'Try searching with another customer, invoice number or product.'
                : activeStatus === 'Outstanding'
                  ? 'There are no part-paid or owing invoices at the moment.'
                  : 'There are no invoices in this category yet.'}
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 text-sm font-semibold text-primary-base hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop invoice table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[760px] bg-background-main text-left">
                <thead>
                  <tr className="border-b border-border-subtle text-xs font-medium text-text-secondary">
                    <th className="px-5 py-3.5">Invoice</th>
                    <th className="px-5 py-3.5">Customer</th>
                    <th className="px-5 py-3.5">Items</th>
                    <th className="px-5 py-3.5">Date</th>
                    <th className="px-5 py-3.5">Amount</th>
                    <th className="px-5 py-3.5">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border-subtle">
                  {filteredInvoices.map((invoice) => {
                    const customerName = getCustomerName(invoice);
                    const amount = getInvoiceTotal(invoice);

                    return (
                      <tr
                        key={invoice.no}
                        className="bg-background-main transition hover:bg-background-card"
                      >
                        <td className="whitespace-nowrap px-5 py-4">
                          <Link
                            to={`/invoices/${invoice.no}`}
                            className="text-sm font-medium text-text-secondary transition hover:text-primary-base"
                          >
                            {invoice.no}
                          </Link>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <CustomerAvatar name={customerName} small />

                            <span className="max-w-[180px] truncate text-sm font-medium text-text-primary">
                              {customerName}
                            </span>
                          </div>
                        </td>

                        <td className="max-w-[190px] px-5 py-4">
                          <span className="block truncate text-sm text-text-secondary">
                            {getItemsSummary(invoice)}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-text-secondary">
                          {invoice.day} {invoice.time}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm font-bold text-text-primary">
                          {formatNaira(amount)}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge status={invoice.status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile invoice list grouped by day */}
            <div className="bg-background-main md:hidden">
              {groupedInvoices.map((group) => (
                <div key={group.day}>
                  <p className="pb-2 pt-3 text-sm font-semibold text-text-secondary">
                    {group.day}
                  </p>

                  <div className="divide-y divide-border-subtle">
                    {group.items.map((invoice) => {
                      const customerName = getCustomerName(invoice);
                      const amount = getInvoiceTotal(invoice);

                      return (
                        <Link
                          key={invoice.no}
                          to={`/invoices/${invoice.no}`}
                          className="flex items-center gap-3 bg-background-main py-4 transition active:bg-background-card"
                        >
                          <CustomerAvatar name={customerName} />

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-text-primary">
                              {customerName}
                            </p>

                            <p className="mt-1 text-xs text-text-tertiary">
                              {invoice.no} · {invoice.time}
                            </p>
                          </div>

                          <div className="flex flex-none flex-col items-end gap-2">
                            <span className="text-sm font-bold text-text-primary">
                              {formatNaira(amount)}
                            </span>

                            <StatusBadge status={invoice.status} />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
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
      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyles[status]}`}
    >
      <span className={`size-1.5 rounded-full ${statusDots[status]}`} />
      {status}
    </span>
  );
}

function CustomerAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="grid size-9 flex-none place-items-center rounded-xl bg-primary-subtle text-[10px] font-bold text-primary-base">
      {initials || 'CU'}
    </div>
  );
}

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatus, setActiveStatus] = useState<InvoiceFilter>('All');

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

    const paid = invoices.filter((invoice) => invoice.status === 'Paid');

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

      paidAmount: paid.reduce((sum, invoice) => sum + invoice.paid, 0),
      paidCount: paid.length,
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

  const hasFilters = Boolean(searchTerm) || activeStatus !== 'All';

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
    <main className="mx-auto w-full min-w-0 max-w-[1600px] space-y-5 px-3 py-4 sm:px-5 sm:py-6 lg:px-7">
      {/* Page heading */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-text-tertiary">
            Sell / Invoices
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-text-primary">
            Invoices
          </h1>

          <p className="mt-1 text-xs text-text-tertiary sm:text-sm">
            Manage payments and keep track of your customer invoices.
          </p>
        </div>

        <Link
          to="/invoices/new"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-primary-base px-4 text-xs font-semibold text-text-inverse shadow-sm transition hover:bg-primary-hover sm:px-5 sm:text-sm"
        >
          <Plus size={16} />
          New invoice
        </Link>
      </header>

      {/* Summary cards */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <button
          type="button"
          onClick={() => setActiveStatus('Waiting')}
          aria-pressed={activeStatus === 'Waiting'}
          className="group rounded-2xl bg-primary-active p-4 text-left text-text-inverse transition hover:shadow-md sm:p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary-inverse">
              Waiting for transfer
            </span>
            <Clock3 size={17} className="text-text-secondary-inverse" />
          </div>

          <p className="mt-2 text-2xl font-bold tracking-tight">
            {formatNaira(stats.waitingAmount)}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-[10px] text-text-secondary-inverse">
              {stats.waitingCount}{' '}
              {stats.waitingCount === 1 ? 'invoice' : 'invoices'} awaiting
              payment
            </span>
            <ChevronRight
              size={15}
              className="text-text-secondary-inverse transition group-hover:translate-x-1"
            />
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveStatus('Outstanding')}
          aria-pressed={activeStatus === 'Outstanding'}
          className="group rounded-2xl bg-secondary-base/15 p-4 text-left transition hover:shadow-md sm:p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary">
              Outstanding balances
            </span>
            <CircleAlert size={17} className="text-secondary-base" />
          </div>

          <p className="mt-2 text-2xl font-bold tracking-tight text-text-primary">
            {formatNaira(stats.outstandingAmount)}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-[10px] text-text-secondary">
              {stats.outstandingCount}{' '}
              {stats.outstandingCount === 1 ? 'invoice' : 'invoices'} part-paid
              or owing
            </span>
            <ChevronRight
              size={15}
              className="text-secondary-base transition group-hover:translate-x-1"
            />
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveStatus('Paid')}
          aria-pressed={activeStatus === 'Paid'}
          className="group rounded-2xl border border-border-default bg-background-card p-4 text-left transition hover:shadow-md sm:col-span-2 sm:p-5 xl:col-span-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-tertiary">
              Fully paid invoices
            </span>
            <CheckCircle2 size={17} className="text-success-base" />
          </div>

          <p className="mt-2 text-2xl font-bold tracking-tight text-text-primary">
            {formatNaira(stats.paidAmount)}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-[10px] text-text-tertiary">
              {stats.paidCount} completed{' '}
              {stats.paidCount === 1 ? 'payment' : 'payments'}
            </span>
            <ChevronRight
              size={15}
              className="text-text-tertiary transition group-hover:translate-x-1"
            />
          </div>
        </button>
      </section>

      {/* Search and filters */}
      <section className="space-y-3">
        <div className="relative">
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
            className="h-11 w-full rounded-xl border border-border-default bg-background-card pl-11 pr-11 text-xs text-text-primary outline-none transition placeholder:text-text-tertiary focus:border-primary-base focus:ring-2 focus:ring-primary-base/10 sm:text-sm"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-text-tertiary transition hover:bg-background-muted"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Status filters */}
        <div className="-mx-3 overflow-x-auto px-3 sm:mx-0 sm:px-0">
          <div className="flex w-max min-w-full items-center gap-2">
            {filters.map((status) => {
              const active = activeStatus === status;

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setActiveStatus(status)}
                  aria-pressed={active}
                  className={`inline-flex h-9 items-center gap-2 rounded-full border px-4 text-[11px] font-medium transition ${
                    active
                      ? 'border-primary-base bg-primary-base text-text-inverse'
                      : 'border-border-default bg-background-card text-text-secondary hover:border-primary-base/50'
                  }`}
                >
                  {status}

                  <span
                    className={`text-[10px] ${
                      active ? 'text-text-inverse/75' : 'text-text-tertiary'
                    }`}
                  >
                    {statusCounts[status]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active outstanding filter indicator */}
        {activeStatus === 'Outstanding' && (
          <div className="flex items-center gap-2 text-xs text-text-secondary">
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
      <section className="overflow-hidden rounded-2xl border border-border-default bg-background-card sm:rounded-3xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-default px-4 py-4 sm:px-5">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">
              {activeStatus === 'Outstanding'
                ? 'Outstanding invoices'
                : activeStatus === 'All'
                  ? 'All invoices'
                  : `${activeStatus} invoices`}
            </h2>

            <p className="mt-1 text-[10px] text-text-tertiary">
              Your recent customer transactions
            </p>
          </div>

          <span className="rounded-full bg-background-muted px-3 py-1.5 text-[10px] font-medium text-text-secondary">
            {filteredInvoices.length}{' '}
            {filteredInvoices.length === 1 ? 'result' : 'results'}
          </span>
        </div>

        {isLoading ? (
          <div className="flex min-h-52 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto size-7 animate-spin rounded-full border-2 border-border-default border-t-primary-base" />
              <p className="mt-3 text-xs text-text-tertiary">
                Loading invoices...
              </p>
            </div>
          </div>
        ) : hasError ? (
          <div className="flex min-h-52 flex-col items-center justify-center px-5 text-center">
            <FileText size={28} className="text-text-tertiary" />

            <p className="mt-3 text-sm font-semibold text-text-primary">
              Unable to load invoices
            </p>

            <p className="mt-1 text-xs text-text-tertiary">
              Please check your connection and try again.
            </p>

            <button
              type="button"
              onClick={handleRetry}
              className="mt-4 rounded-full bg-primary-base px-4 py-2 text-xs font-semibold text-text-inverse transition hover:bg-primary-hover"
            >
              Try again
            </button>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center px-5 text-center">
            <div className="grid size-12 place-items-center rounded-2xl bg-background-muted">
              <Receipt size={21} className="text-text-tertiary" />
            </div>

            <p className="mt-4 text-sm font-semibold text-text-primary">
              No invoices found
            </p>

            <p className="mt-1 max-w-xs text-xs leading-5 text-text-tertiary">
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
                className="mt-4 text-xs font-semibold text-primary-base hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop invoice table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className="bg-background-muted/50 text-[10px] font-semibold uppercase tracking-wide text-text-tertiary">
                    <th className="px-5 py-4">Invoice</th>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Items</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right" />
                  </tr>
                </thead>

                <tbody className="divide-y divide-border-default">
                  {filteredInvoices.map((invoice) => {
                    const customerName = getCustomerName(invoice);
                    const amount = getInvoiceTotal(invoice);

                    return (
                      <tr
                        key={invoice.no}
                        className="transition hover:bg-background-muted/40"
                      >
                        <td className="px-5 py-4">
                          <Link
                            to={`/invoices/${invoice.no}`}
                            className="text-xs font-semibold text-text-primary transition hover:text-primary-base"
                          >
                            {invoice.no}
                          </Link>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <CustomerAvatar name={customerName} />

                            <span className="max-w-[180px] truncate text-xs font-medium text-text-primary">
                              {customerName}
                            </span>
                          </div>
                        </td>

                        <td className="max-w-[190px] px-5 py-4">
                          <span className="block truncate text-xs text-text-secondary">
                            {getItemsSummary(invoice)}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="text-xs text-text-primary">
                            {invoice.day}
                          </div>

                          <div className="mt-1 text-[10px] text-text-tertiary">
                            {invoice.time}
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-xs font-semibold text-text-primary">
                          {formatNaira(amount)}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge status={invoice.status} />
                        </td>

                        <td className="px-5 py-4 text-right">
                          <Link
                            to={`/invoices/${invoice.no}`}
                            aria-label={`View invoice ${invoice.no}`}
                            className="inline-grid size-8 place-items-center rounded-full text-text-tertiary transition hover:bg-background-muted hover:text-primary-base"
                          >
                            <ChevronRight size={17} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile invoice cards */}
            <div className="divide-y divide-border-default md:hidden">
              {filteredInvoices.map((invoice) => {
                const customerName = getCustomerName(invoice);
                const amount = getInvoiceTotal(invoice);

                return (
                  <Link
                    key={invoice.no}
                    to={`/invoices/${invoice.no}`}
                    className="flex items-center gap-3 px-4 py-4 transition active:bg-background-muted/60"
                  >
                    <CustomerAvatar name={customerName} />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-text-primary">
                        {customerName}
                      </p>

                      <p className="mt-1 text-[10px] text-text-tertiary">
                        {invoice.no} · {invoice.day}
                      </p>

                      <p className="mt-1 truncate text-[10px] text-text-secondary">
                        {getItemsSummary(invoice)}
                      </p>
                    </div>

                    <div className="flex flex-none flex-col items-end gap-2">
                      <span className="text-xs font-bold text-text-primary">
                        {formatNaira(amount)}
                      </span>

                      <StatusBadge status={invoice.status} />
                    </div>

                    <ChevronRight
                      size={15}
                      className="flex-none text-text-tertiary"
                    />
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </section>

      {/* Results footer */}
      {!isLoading && !hasError && filteredInvoices.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3">
          <p className="text-[10px] text-text-tertiary">
            Showing {filteredInvoices.length} of {invoices.length} invoices
          </p>

          <Link
            to="/invoices/new"
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary-base transition hover:underline"
          >
            <Plus size={14} />
            Create invoice
          </Link>
        </div>
      )}
    </main>
  );
}

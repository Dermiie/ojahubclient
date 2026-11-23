
export const INVOICES_STORAGE_KEY = "ojahub-invoices";
export const CUSTOMERS_STORAGE_KEY = "ojahub-customers";

export type InvoiceStatusValue =
  | "Waiting"
  | "Paid"
  | "Part-paid"
  | "Owing";

export type PaymentMode = "full" | "partial" | "book-down";

export type PaymentMethod =
  | "Cash"
  | "Transfer to my account"
  | "POS";

export interface InvoiceLine {
  name: string;
  qty: number;
  price: number;
}

export interface InvoicePayment {
  id: string;
  mode: PaymentMode;
  amount: number;
  method?: PaymentMethod;
  createdAt: string;
}

export interface Invoice {
  no: string;
  customerId: string;
  status: InvoiceStatusValue;
  paid: number;
  day: string;
  time: string;
  lines: InvoiceLine[];
  payments?: InvoicePayment[];
}

export interface Customer {
  id: string;
  name: string;
  balance?: number;
}

export interface RecordPaymentInput {
  mode: PaymentMode;
  amount: number;
  method?: PaymentMethod;
}

const shortProductNames: Record<string, string> = {
  "Super Wax Ankara": "Super Wax",
  "Hollandis Wax Print": "Hollandis",
  "Swiss Voile Lace": "Swiss Voile",
  "Aso-oke Bundle": "Aso-oke",
};

export const formatNaira = (amount: number): string =>
  `₦${amount.toLocaleString("en-NG")}`;

export const getInvoiceTotal = (invoice: Invoice): number =>
  invoice.lines.reduce(
    (sum, line) => sum + line.qty * line.price,
    0,
  );

export const getInvoiceBalance = (invoice: Invoice): number =>
  Math.max(0, getInvoiceTotal(invoice) - invoice.paid);

export const getItemsSummary = (invoice: Invoice): string =>
  invoice.lines
    .map(
      (line) =>
        `${shortProductNames[line.name] ?? line.name} x ${line.qty}`,
    )
    .join(", ");

export const getInvoicePath = (no: string): string =>
  `/invoices/${no}`;

const SEED_CUSTOMERS: Customer[] = [
  { id: "NF", name: "Ngozi Fabrics Onitsha" },
  { id: "BT", name: "Bisi Textiles" },
  { id: "FW", name: "Funke Wholesales" },
  { id: "MT", name: "Mama Tunde" },
  { id: "ES", name: "Emeka Stores" },
  { id: "CS", name: "Chidi & Sons" },
];

const SEED_INVOICES: Invoice[] = [
  {
    no: "INV-0143",
    customerId: "NF",
    status: "Waiting",
    paid: 0,
    day: "Today",
    time: "4:12pm",
    lines: [
      { name: "Super Wax Ankara", qty: 25, price: 8000 },
      { name: "Hollandis Wax Print", qty: 10, price: 10500 },
    ],
  },
  {
    no: "INV-0142",
    customerId: "ES",
    status: "Paid",
    paid: 85000,
    day: "Today",
    time: "3:58pm",
    lines: [{ name: "Super Wax Ankara", qty: 10, price: 8500 }],
  },
  {
    no: "INV-0141",
    customerId: "MT",
    status: "Part-paid",
    paid: 19500,
    day: "Today",
    time: "2:15pm",
    lines: [{ name: "Hollandis Wax Print", qty: 4, price: 10500 }],
  },
  {
    no: "INV-0140",
    customerId: "BT",
    status: "Owing",
    paid: 0,
    day: "Today",
    time: "11:20am",
    lines: [{ name: "Swiss Voile Lace", qty: 12, price: 6500 }],
  },
  {
    no: "INV-0139",
    customerId: "CS",
    status: "Paid",
    paid: 210000,
    day: "Today",
    time: "9:05am",
    lines: [{ name: "Super Wax Ankara", qty: 20, price: 10500 }],
  },
  {
    no: "INV-0138",
    customerId: "FW",
    status: "Waiting",
    paid: 0,
    day: "Yesterday",
    time: "5:40pm",
    lines: [
      { name: "George Wrapper", qty: 2, price: 13000 },
      { name: "Aso-oke Bundle", qty: 1, price: 38000 },
    ],
  },
];

function readList<T>(key: string, seed: T[]): T[] {
  const saved = localStorage.getItem(key);

  if (saved === null) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }

  const parsed: unknown = JSON.parse(saved);
  return Array.isArray(parsed) ? (parsed as T[]) : [];
}

export async function fetchInvoices(): Promise<Invoice[]> {
  return readList<Invoice>(INVOICES_STORAGE_KEY, SEED_INVOICES);
}

export async function fetchCustomers(): Promise<Customer[]> {
  return readList<Customer>(CUSTOMERS_STORAGE_KEY, SEED_CUSTOMERS);
}

export async function saveInvoice(
  invoice: Invoice,
): Promise<Invoice[]> {
  const invoices = await fetchInvoices();

  const existingIndex = invoices.findIndex(
    (item) => item.no === invoice.no,
  );

  const updatedInvoices = [...invoices];

  if (existingIndex >= 0) {
    updatedInvoices[existingIndex] = invoice;
  } else {
    updatedInvoices.unshift(invoice);
  }

  localStorage.setItem(
    INVOICES_STORAGE_KEY,
    JSON.stringify(updatedInvoices),
  );

  return updatedInvoices;
}

export async function saveCustomer(
  customer: Customer,
): Promise<Customer[]> {
  const customers = await fetchCustomers();

  const existingIndex = customers.findIndex(
    (item) => item.id === customer.id,
  );

  const updatedCustomers = [...customers];

  if (existingIndex >= 0) {
    updatedCustomers[existingIndex] = customer;
  } else {
    updatedCustomers.unshift(customer);
  }

  localStorage.setItem(
    CUSTOMERS_STORAGE_KEY,
    JSON.stringify(updatedCustomers),
  );

  return updatedCustomers;
}

/**
 * Records a payment or books an amount to the customer's credit balance.
 *
 * Paid in full / Part payment:
 * - Increase invoice.paid.
 * - Update invoice status.
 *
 * Book me down:
 * - Do not increase invoice.paid.
 * - Add the amount to the customer's balance.
 * - Keep the invoice outstanding.
 */
export async function recordInvoicePayment(
  invoiceNo: string,
  input: RecordPaymentInput,
): Promise<{ invoice: Invoice; customer: Customer }> {
  const invoices = await fetchInvoices();
  const customers = await fetchCustomers();

  const invoice = invoices.find(
    (item) => item.no === invoiceNo,
  );

  if (!invoice) {
    throw new Error("Invoice not found.");
  }

  const customer = customers.find(
    (item) => item.id === invoice.customerId,
  );

  if (!customer) {
    throw new Error("Customer not found.");
  }

  const total = getInvoiceTotal(invoice);
  const balance = getInvoiceBalance(invoice);

  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error("Enter a valid amount greater than zero.");
  }

  if (input.amount > balance) {
    throw new Error("The amount cannot exceed the outstanding balance.");
  }

  if (input.mode !== "book-down" && !input.method) {
    throw new Error("Select a payment method.");
  }

  const now = new Date();

  const payment: InvoicePayment = {
    id: `PAY-${Date.now()}`,
    mode: input.mode,
    amount: input.amount,
    method: input.mode === "book-down" ? undefined : input.method,
    createdAt: now.toISOString(),
  };

  const updatedInvoice: Invoice = {
    ...invoice,
    paid:
      input.mode === "book-down"
        ? invoice.paid
        : invoice.paid + input.amount,
    payments: [...(invoice.payments ?? []), payment],
  };

  if (input.mode === "book-down") {
    updatedInvoice.status =
      updatedInvoice.paid >= total ? "Paid" : "Owing";
  } else if (updatedInvoice.paid >= total) {
    updatedInvoice.status = "Paid";
  } else if (updatedInvoice.paid > 0) {
    updatedInvoice.status = "Part-paid";
  } else {
    updatedInvoice.status = "Waiting";
  }

  const updatedCustomer: Customer = {
    ...customer,
    balance:
      (customer.balance ?? 0) +
      (input.mode === "book-down" ? input.amount : 0),
  };

  await saveInvoice(updatedInvoice);
  await saveCustomer(updatedCustomer);

  return {
    invoice: updatedInvoice,
    customer: updatedCustomer,
  };
}

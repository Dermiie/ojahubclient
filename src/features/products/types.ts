export type Unit = "bundle" | "piece" | "yard";

export type StockLocation = {
  id: string;
  name: string;
  shortName: string;
  mobileName?: string;
};
export type PriceTier = {
  label: string;
  price: number;
  // the smallest amount to buy at this price, if there is one
  minimum?: number;
  // an extra small line under the price, like "6 or more: ₦8,500"
  note?: string;
};
export type DailySale = {
  day: string;
  quantity: number;
};
export type Product = {
  id: string;
  name: string;
  unit: Unit;
  image?: string;
  coverImage?: string;
  mobileCoverImage?: string;
  category?: string;
  priceTiers?: PriceTier[];
  stockBars?: Record<string, number>;
  stockNotes?: Record<string, string>;
  weeklySales?: { revenue: number; days: DailySale[] };
  retailPrice: number;
  stock: Record<string, number>;
  lowStockLevel: number;
};

export type StockFilter = "all" | "low";

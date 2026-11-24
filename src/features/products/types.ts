export type Unit = "bundle" | "piece" | "yard";

export type StockLocation = {
  id: string;
  name: string;
  shortName: string;
  mobileName?: string;
};

export type Product = {
  id: string;
  name: string;
  unit: Unit;
  image?: string;
  retailPrice: number;
  stock: Record<string, number>;
  lowStockLevel: number;
};

export type StockFilter = "all" | "low";

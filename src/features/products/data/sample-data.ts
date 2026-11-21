import type { Product, StockLocation } from "../types";

export const LOCATIONS: StockLocation[] = [
  { id: "stall-3", name: "Balogun Stall 3", shortName: "Stall 3" },
  { id: "maza-maza", name: "Maza Maza Warehouse", shortName: "Maza Maza" },
  { id: "trade-fair", name: "Trade Fair", shortName: "Trade Fair" },
];

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "super-wax-ankara",
    name: "Super Wax Ankara",
    unit: "bundle",
    retailPrice: 10000,
    stock: { "stall-3": 15, "maza-maza": 85 }, // no trade-fair means none there
    lowStockLevel: 20,
  },
  {
    id: "hollandis-wax-print",
    name: "Hollandis Wax Print",
    unit: "bundle",
    retailPrice: 12500,
    stock: { "stall-3": 9, "maza-maza": 40 },
    lowStockLevel: 10,
  },
  {
    id: "swiss-voile-lace",
    name: "Swiss Voile Lace",
    unit: "yard",
    retailPrice: 6500,
    stock: { "maza-maza": 64 },
    lowStockLevel: 10,
  },
  {
    id: "george-wrapper",
    name: "George Wrapper",
    unit: "piece",
    retailPrice: 45000,
    stock: { "stall-3": 8, "trade-fair": 14 },
    lowStockLevel: 5,
  },
  {
    id: "aso-oke-bundle",
    name: "Aso-oke Bundle",
    unit: "bundle",
    retailPrice: 38000,
    stock: { "maza-maza": 12 },
    lowStockLevel: 5,
  },
];

 
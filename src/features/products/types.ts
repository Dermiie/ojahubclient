export type Unit = 'bundle' | 'piece' | 'yard';

export type StockLocation = {
  id: string;
  name: string;
  shortName: string;
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
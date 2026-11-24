// The Products page. adding the piecs together...
import { useState } from "react";
import ProductsHeader from "./components/products-header";
import ProductsTabs from "./components/products-tabs";
import SummaryCards from "./components/summary-cards";
import ProductsFilters from "./components/products-filters";
import ProductsTable from "./components/products-table";
import { SAMPLE_PRODUCTS } from "./data/sample-data";
import type { StockFilter } from "./types";

export default function ProductsPage() {
  // what the user typed in the search box
  const [search, setSearch] = useState("");
  // which button is picked: all products or only low stock
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  // which location is picked ("all" or a location id)
  const [locationId, setLocationId] = useState("all");
  // only the products that match the search, the picked button and the location
  const products = SAMPLE_PRODUCTS.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    // the stock numbers to look at: every location, or just the picked one
    const quantities =
      locationId === "all"
        ? Object.values(product.stock)
        : [product.stock[locationId] ?? 0];
    // the product must have some stock in what we are looking at
    const matchesLocation = quantities.some((qty) => qty > 0);
    // low means some stock, but less than the low level
    const isLow = quantities.some(
      (qty) => qty > 0 && qty < product.lowStockLevel,
    );
    return matchesSearch && matchesLocation && (stockFilter === "all" || isLow);
  });
  return (
    <div className="flex flex-col lg:gap-[26px]">
      {/* header and tabs: 15px apart on mobile */}
      <div className="flex flex-col gap-[15px] lg:gap-[18px]">
        <ProductsHeader />
        <ProductsTabs />
      </div>
      {/* each part has its own space above it on mobile */}
      <div className="mt-[19.73px] lg:mt-0">
        <SummaryCards />
      </div>
      <div className="mt-[29px] lg:mt-0">
        <ProductsFilters
          search={search}
          onSearchChange={setSearch}
          stockFilter={stockFilter}
          onStockFilterChange={setStockFilter}
          locationId={locationId}
          onLocationChange={setLocationId}
        />
      </div>
      <div className="mt-4 lg:mt-0">
        <ProductsTable products={products} />
      </div>
    </div>
  );
}

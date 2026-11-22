// The Products page. adds the piecs together...

import { useState } from "react";
import ProductsHeader from "./components/products-header";
import ProductsTabs from "./components/products-tabs";
import SummaryCards from "./components/summary-cards";
import ProductsFilters from "./components/products-filters";
import ProductsTable from "./components/products-table";
import { SAMPLE_PRODUCTS } from "./data/sample-data";

export default function ProductsPage() {
  // what the user typed in the search box
  const [search, setSearch] = useState("");

  // only the products whose name has the typed words
  const products = SAMPLE_PRODUCTS.filter((product) =>
    product.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

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
        <ProductsFilters search={search} onSearchChange={setSearch} />
      </div>
      <div className="mt-4 lg:mt-0">
        <ProductsTable products={products} />
      </div>
    </div>
  );
}

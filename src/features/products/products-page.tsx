// The Products page. adding the piecs together...

import ProductsHeader from "./components/products-header";
import ProductsTabs from "./components/products-tabs";
import SummaryCards from "./components/summary-cards";
import ProductsFilters from "./components/products-filters";

export default function ProductsPage() {
  return (
    <div className="flex flex-col gap-[26px]">
      <div className="flex flex-col gap-[18px]">
        <ProductsHeader />
        <ProductsTabs />
      </div>
      <SummaryCards />
      <ProductsFilters />
    </div>
  );
}

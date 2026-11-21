// The Products page. adding the piecs together...

// The Products page. We add one piece at a time inside it.
import ProductsHeader from "./components/products-header";
import ProductsTabs from "./components/products-tabs";

export default function ProductsPage() {
  return (
    <div className="flex flex-col gap-[26px]">
      <div className="flex flex-col gap-[18px]">
        <ProductsHeader />
        <ProductsTabs />
      </div>
    </div>
  );
}

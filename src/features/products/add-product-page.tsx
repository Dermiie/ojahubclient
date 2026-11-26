// The Add product page. The pieces get added one by one.
import AddProductHeader from "./components/add-product-header";
import AddProductDetails from "./components/add-product-details";
import AddProductPrices from "./components/add-product-prices";
import AddProductPriceBreaks from "./components/add-product-price-breaks";
import AddProductOpeningStock from "./components/add-product-opening-stock";
import AddProductPreview from "./components/add-product-preview";

export default function AddProductPage() {
  return (
    <div className="flex flex-col lg:gap-[42px]">
      <AddProductHeader />

      {/* the form on the left, the preview and save buttons on the right */}
      <div className="grid grid-cols-1 gap-[16.23px] lg:grid-cols-[1fr_364.26px]">
        {/* left column */}
        <div className="flex flex-col gap-[16.23px]">
          <AddProductDetails />
          <AddProductPrices />
          <AddProductPriceBreaks />
        </div>

        {/* right column */}
        <AddProductPreview />

        {/* opening stock sits under the left column */}
        <AddProductOpeningStock />
      </div>
    </div>
  );
}
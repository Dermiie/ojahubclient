// The Edit product page: the same form as Add product, filled in with the product.
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import AddProductHeader from "./components/add-product-header";
import AddProductDetails from "./components/add-product-details";
import AddProductPrices from "./components/add-product-prices";
import type { Prices } from "./components/add-product-prices";
import AddProductPriceBreaks from "./components/add-product-price-breaks";
import type { PriceBreak } from "./components/add-product-price-breaks";
import type { NewPriceBreak } from "./components/add-price-break-dialog";
import EditProductTryIt from "./components/edit-product-try-it";
import EditProductStock from "./components/edit-product-stock";
import EditProductBottomBar from "./components/edit-product-bottom-bar";
import type { Product } from "./types";
import { SAMPLE_PRODUCTS } from "./data/sample-data";

// the price breaks from the Figma, sample data until the backend is ready
const SAMPLE_BREAKS: PriceBreak[] = [
  { id: "break-1", customer: "retail", quantity: 6, price: "8500" },
  { id: "break-2", customer: "bulk", quantity: 20, price: "8000" },
];

// the form, it starts filled in with the product
function EditProductForm({ product }: { product: Product }) {
  const navigate = useNavigate();

  // the price of one customer type, empty if the product has none
  const tierPrice = (label: string) =>
    String(product.priceTiers?.find((tier) => tier.label === label)?.price ?? "");

  const [name, setName] = useState(product.name);
  const [soldBy, setSoldBy] = useState<string>(product.unit);
  // "Wax prints" becomes "wax-prints" to match the dropdown
  const [category, setCategory] = useState(
    (product.category ?? "").toLowerCase().replace(/\s+/g, "-"),
  );
  const [photo, setPhoto] = useState<File | null>(null);
  const [prices, setPrices] = useState<Prices>({
    retail: String(product.retailPrice),
    semiWholesale: tierPrice("Semi-wholesale"),
    bulk: tierPrice("Bulk importer"),
  });
  const [priceBreaks, setPriceBreaks] = useState<PriceBreak[]>(
    product.id === "super-wax-ankara" ? SAMPLE_BREAKS : [],
  );

  // change one of the three prices
  const changePrice = (key: keyof Prices, value: string) => {
    setPrices((current) => ({ ...current, [key]: value }));
  };

  // add a price break to the list, with its own id
  const addPriceBreak = (priceBreak: NewPriceBreak) => {
    setPriceBreaks((current) => [
      ...current,
      { ...priceBreak, id: crypto.randomUUID() },
    ]);
  };

  // remove one price break from the list
  const removePriceBreak = (id: string) => {
    setPriceBreaks((current) => current.filter((item) => item.id !== id));
  };

  // for now just log it, then go back to the product details
  const saveProduct = () => {
    console.log("Saving changes:", { name, soldBy, category, prices, priceBreaks });
    // TODO: send to the backend
    navigate(`/products/${product.id}`);
  };

  return (
    <div className="flex flex-col gap-[31px] px-1 pb-10 sm:px-0 lg:gap-[42px] lg:pb-0">
      {/* the back button goes to this product's details */}
      <AddProductHeader title="Edit product" backTo={`/products/${product.id}`} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_364.26px] lg:gap-[16.23px]">
        {/* left column */}
        <div className="flex flex-col lg:gap-[16.23px]">
          <AddProductDetails
            name={name}
            onNameChange={setName}
            soldBy={soldBy}
            onSoldByChange={setSoldBy}
            category={category}
            onCategoryChange={setCategory}
            photo={photo}
            onPhotoChange={setPhoto}
            existingPhoto={product.coverImage ?? product.image}
          />
          <AddProductPrices
            unit={soldBy}
            prices={prices}
            onPriceChange={changePrice}
          />
          <AddProductPriceBreaks
            unit={soldBy}
            productName={name}
            breaks={priceBreaks}
            onAdd={addPriceBreak}
            onRemove={removePriceBreak}
            subtitle="Price drops automatically when a customer buys more."
          />
          {/* mobile only: the stock numbers, just to look at */}
          <EditProductStock unit={soldBy} stock={product.stock} />
        </div>

        {/* right column: the dark green Try it card (desktop only) */}
        <div>
          <EditProductTryIt
            unit={soldBy}
            retailPrice={prices.retail}
            bulkPrice={prices.bulk}
            breaks={priceBreaks}
            onSave={saveProduct}
          />
        </div>
      </div>

      {/* mobile only: the save button that stays at the bottom */}
      <EditProductBottomBar onSave={saveProduct} />
    </div>
  );
}

export default function EditProductPage() {
  // the id from the address, for example /products/super-wax-ankara/edit
  const { productId } = useParams();
  const product = SAMPLE_PRODUCTS.find((item) => item.id === productId);

  if (!product) {
    return <p className="text-[14px] text-text-secondary">Product not found</p>;
  }

  return <EditProductForm product={product} />;
}
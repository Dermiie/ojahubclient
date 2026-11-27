// The Add product page. The pieces get added one by one.
import { useState } from "react";
import AddProductHeader from "./components/add-product-header";
import AddProductDetails from "./components/add-product-details";
import AddProductPrices from "./components/add-product-prices";
import type { Prices } from "./components/add-product-prices";
import AddProductPriceBreaks from "./components/add-product-price-breaks";
import type { PriceBreak } from "./components/add-product-price-breaks";
import type { NewPriceBreak } from "./components/add-price-break-dialog";
import AddProductOpeningStock from "./components/add-product-opening-stock";
import AddProductPreview from "./components/add-product-preview";
import AddProductBottomBar from "./components/add-product-bottom-bar";

export default function AddProductPage() {
  // the page remembers what the user types, so Save can collect it later
  const [name, setName] = useState("");
  const [soldBy, setSoldBy] = useState("bundle");
  const [category, setCategory] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [prices, setPrices] = useState<Prices>({
    retail: "",
    semiWholesale: "",
    bulk: "",
  });
  // the price breaks the user has added
  const [priceBreaks, setPriceBreaks] = useState<PriceBreak[]>([]);

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

  return (
    <div className="flex flex-col gap-[31px] px-1 pb-10 sm:px-0 lg:gap-[42px] lg:pb-0">
      <AddProductHeader />

      {/* the form on the left, the preview and save buttons on the right */}
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
          />
          {/* soldBy is the unit: bundle, yard or piece */}
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
          />
        </div>

        {/* right column */}
        <AddProductPreview />

        {/* opening stock sits under the left column */}
        <AddProductOpeningStock />
      </div>

      {/* the save buttons at the bottom on mobile */}
      <AddProductBottomBar />
    </div>
  );
}

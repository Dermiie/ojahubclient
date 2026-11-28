// The Add product page. The pieces get added one by one.
import { useState } from "react";
import { useNavigate } from "react-router";
import AddProductHeader from "./components/add-product-header";
import AddProductDetails from "./components/add-product-details";
import AddProductPrices from "./components/add-product-prices";
import type { Prices } from "./components/add-product-prices";
import AddProductPriceBreaks from "./components/add-product-price-breaks";
import type { PriceBreak } from "./components/add-product-price-breaks";
import type { NewPriceBreak } from "./components/add-price-break-dialog";
import AddProductOpeningStock, {
  EMPTY_STOCK,
} from "./components/add-product-opening-stock";
import AddProductPreview from "./components/add-product-preview";
import AddProductBottomBar from "./components/add-product-bottom-bar";

// the prices when the form is empty
const EMPTY_PRICES: Prices = { retail: "", semiWholesale: "", bulk: "" };

export default function AddProductPage() {
  const navigate = useNavigate();

  // the page remembers what the user types, so Save can collect it later
  const [name, setName] = useState("");
  const [soldBy, setSoldBy] = useState("bundle");
  const [category, setCategory] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [prices, setPrices] = useState<Prices>(EMPTY_PRICES);
  // the price breaks the user has added
  const [priceBreaks, setPriceBreaks] = useState<PriceBreak[]>([]);
  // how many the user has put in for each location
  const [stock, setStock] = useState<Record<string, number>>(EMPTY_STOCK);

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

  // add or take away one at a location, it never goes below 0
  const changeStock = (id: string, amount: number) => {
    setStock((current) => ({
      ...current,
      [id]: Math.max(0, current[id] + amount),
    }));
  };

  // put the whole form back to empty
  const resetForm = () => {
    setName("");
    setSoldBy("bundle");
    setCategory("");
    setPhoto(null);
    setPrices(EMPTY_PRICES);
    setPriceBreaks([]);
    setStock(EMPTY_STOCK);
  };

  // collect everything, returns true if it was ready to save
  const collectProduct = () => {
    // the name and the retail price are needed
    if (name.trim() === "" || prices.retail === "") {
      console.log("Fill in the name and the retail price first");
      return false;
    }

    const product = {
      name,
      soldBy,
      category,
      photo,
      prices,
      priceBreaks,
      openingStock: stock,
    };

    // TODO: send to the backend
    console.log("Saving product:", product);
    return true;
  };

  // save, then go back to the products list
  const saveProduct = () => {
    if (collectProduct()) navigate("/products");
  };

  // save, then clear the form for the next product
  const saveAndAddAnother = () => {
    if (collectProduct()) resetForm();
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
            subtitle="Price drops automatically when a customer buys more"
          />
        </div>

        {/* right column */}
        <AddProductPreview
          onSave={saveProduct}
          onSaveAndAddAnother={saveAndAddAnother}
        />

        {/* opening stock sits under the left column */}
        <AddProductOpeningStock
          unit={soldBy}
          quantities={stock}
          onChange={changeStock}
        />
      </div>

      {/* the save buttons at the bottom on mobile */}
      <AddProductBottomBar
        onSave={saveProduct}
        onSaveAndAddAnother={saveAndAddAnother}
      />
    </div>
  );
}

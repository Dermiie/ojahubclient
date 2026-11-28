// The Product details page. adding the piecs together...
import { Link, useParams } from "react-router";
import ProductDetailsHeader from "./components/product-details-header";
import ProductPhotoCard from "./components/product-photo-card";
import ProductPricesCard from "./components/product-prices-card";
import ProductStockCard from "./components/product-stock-card";
import ProductSoldChart from "./components/product-sold-chart";
import { SAMPLE_PRODUCTS } from "./data/sample-data";
import ProductBottomBar from "./components/product-bottom-bar";

export default function ProductDetailsPage() {
  // the id from the link, like /products/1
  const { productId } = useParams();
  // the product that has this id
  const product = SAMPLE_PRODUCTS.find((item) => item.id === productId);

  // if there is no product with that id
  if (!product) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-text-secondary">Product not found.</p>
        <Link to="/products" className="text-primary-base">
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-[89px] lg:gap-[42px] lg:pb-0">
      <ProductDetailsHeader product={product} />

      {/* two equal columns, one on top of the other on mobile */}
      <div className="grid grid-cols-1 gap-[16.23px] px-[2px] sm:px-0 lg:grid-cols-2">
        {/* left column */}
        <div className="flex flex-col gap-[16.23px]">
          <ProductPhotoCard product={product} />
          <ProductPricesCard product={product} />
        </div>

        {/* right column */}
        <div className="flex flex-col gap-[16.23px]">
          <ProductStockCard product={product} />
          <ProductSoldChart product={product} />
        </div>
      </div>
      <ProductBottomBar />
    </div>
  );
}

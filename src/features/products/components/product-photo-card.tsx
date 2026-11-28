// The photo card on the Product details page: the photo and the small tag on it.
import tagIcon from "../assets/icons/tag.svg";
import type { Product } from "../types";

export default function ProductPhotoCard({ product }: { product: Product }) {
  // the big photo if the product has one, if not the normal photo
  const photo = product.coverImage ?? product.image;
  // "Wax prints · sold by the bundle", or just "Sold by the bundle" with no category
  const tagText = product.category
    ? `${product.category} · sold by the ${product.unit}`
    : `Sold by the ${product.unit}`;

  return (
    <div className="relative hidden h-[187.04px] overflow-hidden rounded-[22.72px] lg:block">
      <img
        src={photo}
        alt={product.name}
        className="size-full object-cover object-[50%_37.2%]"
      />

      {/* the tag on the photo */}
      <div className="absolute bottom-[16.23px] left-[16.23px] flex items-center gap-[6.49px] rounded-[12.98px] bg-background-main px-[11.36px] py-[8.12px]">
        <span className="text-[12px] font-medium leading-[1.3] tracking-[-0.02em] text-text-primary">
          {tagText}
        </span>
        <img src={tagIcon} alt="" className="size-[12.98px]" />
      </div>
    </div>
  );
}

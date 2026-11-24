// The Prices card on the Product details page: the price boxes for each tier.
import type { Product } from "../types";

// the look of each box: background, label colour and small-line colour
const BOX_STYLES = [
  {
    box: "bg-background-card",
    label: "text-text-secondary",
    note: "text-text-secondary",
  },
  {
    box: "bg-primary-subtle",
    label: "text-[#1C5E3A]",
    note: "text-primary-base",
  },
  { box: "bg-[#F8F1E8]", label: "text-[#4E331C]", note: "text-[#4E331C]" },
];

export default function ProductPricesCard({ product }: { product: Product }) {
  // the tiers, or just Retail if the product has none
  const tiers = product.priceTiers ?? [
    { label: "Retail", price: product.retailPrice },
  ];

  return (
    <>
      {/* desktop view */}
      <div className="hidden flex-col gap-[12.98px] rounded-[22.72px] border-[0.81px] border-border-subtle px-[19.48px] py-[17.85px] lg:flex">
        {/* title, unit and the link */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-[3.25px]">
            <span className="text-[16px] font-medium leading-[1.3] tracking-[-0.02em] text-text-primary">
              Prices
            </span>
            <span className="text-[12px] leading-[1.3] tracking-[-0.02em] text-text-secondary">
              per {product.unit}
            </span>
          </div>
          <span className="text-[12px] font-medium leading-[1.3] tracking-[-0.02em] text-primary-base">
            Price profiles
          </span>
        </div>

        {/* the price boxes, two in a row */}
        <div className="grid grid-cols-2 gap-x-[10px] gap-y-[9.74px]">
          {tiers.map((tier, index) => {
            const style = BOX_STYLES[index % BOX_STYLES.length];
            return (
              <div
                key={tier.label}
                className={`flex flex-col gap-[4.87px] rounded-[16.23px] p-[12.98px] ${style.box}`}
              >
                <span
                  className={`text-[12px] font-medium leading-[1.3] tracking-[-0.02em] ${style.label}`}
                >
                  {tier.label}
                </span>
                <span className="text-[18px] font-bold leading-[1.3] text-text-primary">
                  ₦{tier.price.toLocaleString()}
                </span>
                {(tier.note || tier.minimum) && (
                  <span
                    className={`text-[12px] leading-[1.3] tracking-[-0.02em] ${style.note}`}
                  >
                    {tier.note ?? `Minimum of ${tier.minimum}`}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* mobile view: one card with a row for each price */}
      <div className="flex flex-col overflow-hidden rounded-[24px] border border-border-default lg:hidden">
        {/* grey header row */}
        <div className="flex items-center justify-between bg-background-card px-4 py-[14px]">
          <span className="text-[16px] font-medium leading-[1.3] text-text-primary">
            Prices
          </span>
          <span className="text-[12px] leading-[1.3] tracking-[-0.02em] text-text-secondary">
            per {product.unit}
          </span>
        </div>

        {/* one row for each price */}
        {tiers.map((tier, index) => {
          // the small line: the note, or the minimum
          // the small line: the note, or the minimum
          const isLast = index === tiers.length - 1;
          const small =
            tier.note !== undefined
              ? `${tier.note} each`
              : tier.minimum && isLast
                ? `Minimum ${tier.minimum} ${product.unit}s`
                : null;
          return (
            <div
              key={tier.label}
              className="flex items-center justify-between border-t border-border-subtle px-4 py-[14px]"
            >
              <div className="flex flex-col gap-[2px]">
                <span className="text-[16px] font-medium leading-[1.3] text-text-primary">
                  {tier.label}
                </span>
                {small && (
                  <span className="text-[12px] leading-[1.3] tracking-[-0.02em] text-text-secondary">
                    {small}
                  </span>
                )}
              </div>
              <span
                className={`text-[18px] font-bold leading-[1.3] ${
                  index === tiers.length - 1 && tiers.length > 1
                    ? "text-[#257349]"
                    : "text-text-primary"
                }`}
              >
                ₦{tier.price.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}

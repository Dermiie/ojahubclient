// The Prices per bundle card on the Add product form: retail, semi-wholesale and bulk importer.
import { useNavigate } from "react-router";

// the three prices the page remembers
export type Prices = {
  retail: string;
  semiWholesale: string;
  bulk: string;
};

// the page gives us the unit, the prices and a way to change one
type Props = {
  unit: string;
  prices: Prices;
  onPriceChange: (key: keyof Prices, value: string) => void;
};

// the small label above a field
const labelStyle =
  "text-[12px] font-medium leading-[1.3] tracking-[-0.02em] text-text-primary";

// the three price fields, the first one shows 10,000 and the others say same as retail
const FIELDS: { key: keyof Prices; label: string; placeholder: string }[] = [
  { key: "retail", label: "Retail", placeholder: "10,000" },
  {
    key: "semiWholesale",
    label: "Semi-wholesale",
    placeholder: "Same as retail",
  },
  { key: "bulk", label: "Bulk importer", placeholder: "Same as retail" },
];

export default function AddProductPrices({
  unit,
  prices,
  onPriceChange,
}: Props) {
  const navigate = useNavigate();

  // opens the Price profile page
  const goToProfiles = () => navigate("/products/price-profile");

  return (
    <>
      {/* desktop view */}
      <div className="hidden flex-col gap-[12.98px] rounded-[22.72px] border-[0.81px] border-[#E3E7E5] px-[19.48px] py-[17.85px] lg:flex">
        {/* title and subtitle on the left, the manage profiles link on the right */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-[3.25px]">
            <h2 className="text-[14px] font-semibold leading-[1.3] tracking-[-0.02em] text-text-primary">
              Prices per {unit}
            </h2>
            <p className="text-[12px] leading-[1.3] tracking-[-0.02em] text-text-secondary">
              Only retail is required. Each customer gets their profile’s price
            </p>
          </div>
          {/* opens the Price profile page */}
          <button
            type="button"
            onClick={goToProfiles}
            className="py-[6.49px] text-[11px] font-medium leading-[1.3] tracking-[-0.02em] text-[#257349]"
          >
            Manage profiles
          </button>
        </div>

        {/* the three fields */}
        <div className="grid grid-cols-3 gap-[11.36px]">
          {FIELDS.map((field) => (
            <label key={field.key} className="flex flex-col gap-[5.68px]">
              <span className={labelStyle}>{field.label}</span>
              <div className="flex h-[42.2px] items-center rounded-[12.98px] border-[0.81px] border-border-default bg-background-main pl-[12.98px]">
                {/* the naira sign */}
                <span className="text-[12px] font-medium leading-[1.3] tracking-[-0.02em] text-[#257349]">
                  ₦
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder={field.placeholder}
                  value={prices[field.key]}
                  onChange={(e) =>
                    onPriceChange(field.key, e.target.value.replace(/\D/g, ""))
                  }
                  className="min-w-0 flex-1 bg-transparent py-[10.96px] pl-[4.87px] pr-[9.74px] text-[12px] font-medium leading-[1.3] tracking-[-0.02em] text-text-primary outline-none placeholder:text-text-secondary"
                />
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* mobile view: a grey card with one white row for each price */}
      <div className="flex flex-col gap-3 rounded-[24px] bg-background-card p-4 lg:hidden">
        {/* title and the manage profiles link */}
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-medium leading-[1.3] text-text-primary">
            Prices per {unit}
          </h2>
          <button
            type="button"
            onClick={goToProfiles}
            className="py-2 text-[12px] font-medium leading-[1.3] tracking-[-0.02em] text-[#257349]"
          >
            Manage profiles
          </button>
        </div>

        {/* the three rows */}
        {FIELDS.map((field) => (
          <label
            key={field.key}
            className="flex items-center gap-[10px] rounded-[16px] bg-background-main py-[6px] pl-[14px] pr-[6px]"
          >
            <span className="min-w-0 flex-1 text-[16px] font-medium leading-[1.3] text-text-primary">
              {field.label}
            </span>
            <div className="flex h-[46px] w-[150px] shrink-0 items-center rounded-[13px] border border-border-default pl-3">
              {/* the naira sign */}
              <span className="text-[16px] font-medium leading-[1.3] text-[#257349]">
                ₦
              </span>
              <input
                type="text"
                inputMode="numeric"
                placeholder={field.placeholder}
                value={prices[field.key]}
                onChange={(e) =>
                  onPriceChange(field.key, e.target.value.replace(/\D/g, ""))
                }
                className="h-[42px] min-w-0 flex-1 bg-transparent py-[10.5px] pl-1 pr-[10px] text-[14px] font-medium leading-[1.3] tracking-[-0.02em] text-text-primary outline-none placeholder:text-text-secondary"
              />
            </div>
          </label>
        ))}
      </div>
    </>
  );
}
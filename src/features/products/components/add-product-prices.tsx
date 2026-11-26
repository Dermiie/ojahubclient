// The Prices per bundle card on the Add product form: retail, semi-wholesale and bulk importer.

// the small label above a field
const labelStyle =
  "text-[12px] font-medium leading-[1.3] tracking-[-0.02em] text-text-primary";

// the three price fields, the first one shows 10,000 and the others say same as retail
const FIELDS = [
  { label: "Retail", placeholder: "10,000" },
  { label: "Semi-wholesale", placeholder: "Same as retail" },
  { label: "Bulk importer", placeholder: "Same as retail" },
];

export default function AddProductPrices() {
  return (
    // desktop view
    <div className="hidden flex-col gap-[12.98px] rounded-[22.72px] border-[0.81px] border-[#E3E7E5] px-[19.48px] py-[17.85px] lg:flex">
      {/* title and subtitle */}
      <div className="flex flex-col gap-[3.25px]">
        <h2 className="text-[14px] font-semibold leading-[1.3] tracking-[-0.02em] text-text-primary">
          Prices per bundle
        </h2>
        <p className="text-[12px] leading-[1.3] tracking-[-0.02em] text-text-secondary">
          Only retail is required. Each customer gets their profile’s price
        </p>
      </div>

      {/* the three fields */}
      <div className="grid grid-cols-3 gap-[11.36px]">
        {FIELDS.map((field) => (
          <label key={field.label} className="flex flex-col gap-[5.68px]">
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
                className="min-w-0 flex-1 bg-transparent py-[10.96px] pl-[4.87px] pr-[9.74px] text-[12px] font-medium leading-[1.3] tracking-[-0.02em] text-text-primary outline-none placeholder:text-text-secondary"
              />
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

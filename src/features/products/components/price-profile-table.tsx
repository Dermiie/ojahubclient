// The table on the Price profile page: one row for each customer profile.
import pencilIcon from "../assets/icons/pencil.svg";
import { SAMPLE_PRODUCTS } from "../data/sample-data";

// the same four columns for the header and every row
const columns =
  "grid grid-cols-[1fr_153px_209px_145px] items-center border-b-[0.81px] border-[#EEF0EF]";

// the three profiles, the look of each little letter box
const PROFILES = [
  {
    label: "Retail",
    letters: "R",
    note: "Walk-in buyers",
    isDefault: true,
    avatar: "bg-[#F5F7F6] text-text-primary",
  },
  {
    label: "Semi-wholesale",
    letters: "SW",
    note: "Small shops",
    isDefault: false,
    avatar: "bg-[#E7F3EC] text-[#2E8B57]",
  },
  {
    label: "Bulk importer",
    letters: "BI",
    note: "Big orders",
    isDefault: false,
    avatar: "bg-[#F6ECDF] text-[#6B4426]",
  },
];

// the prices come from Super Wax Ankara for now
const product = SAMPLE_PRODUCTS.find((item) => item.id === "super-wax-ankara");

// the price and the minimum for one profile, Retail starts at 1
const tierFor = (label: string) => {
  const tier = product?.priceTiers?.find((item) => item.label === label);
  return {
    price: tier?.price ?? product?.retailPrice ?? 0,
    minimum: tier?.minimum ?? 1,
  };
};

export default function PriceProfileTable() {
  return (
    // desktop only for now, the mobile design comes later
    <div className="hidden overflow-hidden rounded-[22.72px] border-[0.81px] border-[#E3E7E5] pt-[4.87px] lg:block">
      {/* the column names */}
      <div className={columns}>
        <span className="px-[19.477px] py-[9.738px] text-[11px] font-medium leading-[1.3] tracking-[-0.02em] text-[#8A5A33]">
          Profile
        </span>
        <span className="p-[9.738px] text-right text-[11px] font-medium leading-[1.3] tracking-[-0.02em] text-[#8A5A33]">
          No of products
        </span>
        <span className="p-[9.738px] text-right text-[11px] font-medium leading-[1.3] tracking-[-0.02em] text-[#8A5A33]">
          Super Wax price
        </span>
        <span />
      </div>

      {/* one row for each profile */}
      {PROFILES.map((profile) => {
        const { price, minimum } = tierFor(profile.label);

        return (
          <div key={profile.label} className={columns}>
            {/* letter box, name and note */}
            <div className="flex items-center gap-[9.738px] px-[19.477px] py-[9.738px]">
              <span
                className={`flex size-[35.707px] shrink-0 items-center justify-center rounded-[11.361px] text-[11px] font-medium leading-[1.3] tracking-[-0.02em] ${profile.avatar}`}
              >
                {profile.letters}
              </span>
              <div className="flex flex-col gap-[1.623px]">
                <div className="flex items-center gap-[5.8px]">
                  <span className="text-[12px] font-medium leading-[1.3] tracking-[-0.02em] text-text-primary">
                    {profile.label}
                  </span>
                  {/* the green badge, only on the default profile */}
                  {profile.isDefault && (
                    <span className="rounded-full bg-[#2E8B57] px-[6.492px] py-[2.435px] text-[11px] font-medium leading-[1.3] tracking-[-0.02em] text-white">
                      Default
                    </span>
                  )}
                </div>
                <span className="text-[11px] leading-[1.3] tracking-[-0.02em] text-text-secondary">
                  {profile.note}
                </span>
              </div>
            </div>

            {/* the minimum amount */}
            <span className="px-[9.738px] text-right text-[12px] leading-[1.3] tracking-[-0.02em] text-text-primary">
              minimum of {minimum}
            </span>

            {/* the price */}
            <span className="px-[9.738px] text-right text-[12px] font-medium leading-[1.3] tracking-[-0.02em] text-text-primary">
              ₦{price.toLocaleString("en-US")}
            </span>

            {/* the pencil button, it does nothing yet */}
            <div className="flex justify-end px-[19.477px] py-[10.956px]">
              <button
                type="button"
                aria-label={`Edit ${profile.label} profile`}
                className="flex size-[32.461px] items-center justify-center rounded-[9.738px] bg-[#F5F7F6]"
              >
                <img src={pencilIcon} alt="" className="size-[12.984px]" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
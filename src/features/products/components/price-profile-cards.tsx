// Mobile list of price profiles (hidden on desktop, the table shows there)
import pencilIcon from "../assets/icons/pencil.svg";


const PROFILES = [
  {
    id: "retail",
    letters: "R",
    name: "Retail",
    note: "42 customers · walk-in buyers",
    isDefault: true,
    avatarClass: "bg-[#F4F6F5] text-[#1F2A24]",
  },
  {
    id: "semi-wholesale",
    letters: "SW",
    name: "Semi-wholesale",
    note: "12 customers · small shops",
    isDefault: false,
    avatarClass: "bg-[#E7F3EC] text-[#257349]",
  },
  {
    id: "bulk-importer",
    letters: "BI",
    name: "Bulk importer",
    note: "6 customers · big orders",
    isDefault: false,
    avatarClass: "bg-[#F8ECDF] text-[#4E331C]",
  },
];

export default function PriceProfileCards() {
  return (
    <div className="flex flex-col gap-[18px] lg:hidden">
      {/* the three profile cards */}
      <div className="flex flex-col gap-[10px]">
        {PROFILES.map((profile) => (
          <div
            key={profile.id}
            className="flex items-center gap-[14px] rounded-[22px] border border-[#D1D1D1] p-4"
          >
            {/* letters box */}
            <div
              className={`flex size-12 shrink-0 items-center justify-center rounded-[16px] text-[16px] font-medium leading-none ${profile.avatarClass}`}
            >
              {profile.letters}
            </div>

            {/* name + note */}
            <div className="flex flex-1 flex-col gap-[3px]">
              <div className="flex items-center gap-2">
                <span className="text-[16px] font-medium leading-none text-[#1F2A24]">
                  {profile.name}
                </span>
                {profile.isDefault && (
                  <span className="rounded-full bg-[#2E8B57] px-2 py-[3px] text-[11px] font-medium leading-none tracking-[-0.02em] text-white">
                    Default
                  </span>
                )}
              </div>
              <span className="text-[12px] leading-none tracking-[-0.02em] text-[#727E79]">
                {profile.note}
              </span>
            </div>

            {/* edit button, does nothing yet */}
            <button
              type="button"
              aria-label={`Edit ${profile.name}`}
              className="flex size-[42px] shrink-0 items-center justify-center rounded-[14px] bg-[#F4F6F5]"
            >
              <img src={pencilIcon} alt="" className="size-[17px]" />
            </button>
          </div>
        ))}
      </div>

      {/* add a profile button, does nothing yet */}
      <button
        type="button"
        className="flex h-[54px] w-full items-center justify-center gap-2 rounded-[40px] border border-dashed border-[#848E89] bg-white text-[16px] font-medium leading-none text-[#1F2A24]"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M8 3v10M3 8h10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        Add a profile
      </button>
    </div>
  );
}
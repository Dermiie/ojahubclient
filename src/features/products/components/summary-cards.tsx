// The three summary cards above the table.

import ringsImage from "../assets/icons/card-rings.svg";

export default function SummaryCards() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Stock value card */}
      <div className="relative flex flex-col gap-[6.201px] overflow-hidden rounded-[24.805px] bg-[#12432a] px-[20.671px] pb-[22.738px] pt-[20.671px]">
        <img
          src={ringsImage}
          alt=""
          className="absolute right-0 top-0 h-[134px] w-[136px] max-w-none"
        />

        <p className="relative text-[16px] font-normal leading-[1.3] tracking-[-0.02em] text-text-secondary-inverse">
          Stock value
        </p>
        <p className="text-h3-bold relative text-text-inverse">₦4,860,000</p>
        <p className="text-b2-medium relative text-text-secondary-inverse">
          5 products · 3 locations
        </p>
      </div>

      {/* Running low card */}
      <div className="flex flex-col gap-[6.201px] rounded-[24.805px] bg-[#f8f1e8] px-[20.671px] pb-[22.738px] pt-[20.671px]">
        <p className="text-[16px] font-normal leading-[1.3] tracking-[-0.02em] text-[#6b4426]">
          Running low
        </p>
        <p className="text-h3-bold text-[#101a14]">2 items</p>
        <p className="text-b2-medium text-[#853700]">Both at Balogun Stall 3</p>
      </div>

      {/* Stock on the move card */}
      <div className="flex flex-col gap-[6.201px] rounded-[24.805px] border-[1.034px] border-background-muted p-[19.637px]">
        <p className="text-[16px] font-normal leading-[1.3] tracking-[-0.02em] text-text-secondary">
          Stock on the move
        </p>
        <p className="text-h3-bold text-[#101a14]">60 bundles</p>
        <p className="text-b2-medium text-text-secondary">
          1 transfer in transit · 1 pending
        </p>
      </div>
    </div>
  );
}

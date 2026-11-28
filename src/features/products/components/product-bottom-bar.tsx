// The fixed bottom bar on mobile with the Edit and Add stock buttons.
import addIcon from "../assets/icons/add.svg";
import editIcon from "../assets/icons/edit.svg";

export default function ProductBottomBar() {
  return (
    // fixed to the bottom, hidden on desktop. md:left-[18%] keeps it off the sidebar
    <div className="fixed bottom-0 left-0 right-0 z-30 flex justify-center gap-[10px] border-t border-border-subtle bg-background-main px-[13px] pb-[26px] pt-[14px] md:left-[18%] lg:hidden">
      {/* edit button */}
      <button
        type="button"
        className="flex h-[48px] max-w-[177px] flex-1 items-center justify-center gap-3 rounded-[60px] border border-border-default bg-background-main text-[14px] font-semibold leading-[1.3] text-text-primary"
      >
        <img src={editIcon} alt="" className="size-5" />
        Edit
      </button>

      {/* add stock button */}
      <button
        type="button"
        className="flex h-[48px] max-w-[177px] flex-1 items-center justify-center gap-[6px] rounded-[60px] bg-primary-base text-[14px] font-semibold leading-[1.3] text-white"
      >
        <img src={addIcon} alt="" className="size-5" />
        Add stock
      </button>
    </div>
  );
}

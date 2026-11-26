// The Details part of the Add product form: photo, product name, sold by and category.
import cameraIcon from "../assets/icons/camera.svg";
import arrowDownIcon from "../assets/icons/arrow-down.svg";

// the look of a small label above a field
const labelStyle =
  "text-[12px] font-medium leading-[1.3] tracking-[-0.02em] text-text-primary";

// the look of the two drop-down boxes
const selectStyle =
  "h-[42.2px] w-full appearance-none rounded-[12.98px] border-[0.81px] border-border-default bg-background-main pl-[12.98px] pr-[22.72px] text-[14px] leading-[1.3] tracking-[-0.02em] text-text-secondary outline-none";

export default function AddProductDetails() {
  return (
    // desktop view
    <div className="hidden flex-col gap-[16.23px] lg:flex">
      <h2 className="text-[14px] font-semibold leading-[1.3] tracking-[-0.02em] text-text-primary">
        Details
      </h2>

      {/* photo box and product name */}
      <div className="flex items-start gap-[12.98px]">
        <button
          type="button"
          className="flex w-[144px] shrink-0 flex-col items-center gap-2 rounded-[24px] border-[1.5px] border-dashed border-[#848E89] bg-background-card px-5 py-6"
        >
          <img src={cameraIcon} alt="" className="size-6" />
          <span className="text-[12px] font-medium leading-[1.3] tracking-[-0.02em] text-text-primary">
            Add photo
          </span>
        </button>

        <label className="flex min-w-0 flex-1 flex-col gap-[5.68px]">
          <span className={labelStyle}>Product name</span>
          <div className="relative">
            {/* the space placeholder lets us show the two-colour hint while empty */}
            <input
              type="text"
              placeholder=" "
              className="peer h-[42.2px] w-full rounded-[12.98px] border-[0.81px] border-border-default bg-background-main px-[12.98px] text-[14px] leading-[1.3] tracking-[-0.02em] text-text-primary outline-none"
            />
            <span className="pointer-events-none absolute left-[13.79px] top-1/2 hidden -translate-y-1/2 text-[14px] leading-[1.3] tracking-[-0.02em] text-text-secondary peer-placeholder-shown:block">
              <span className="text-text-primary">eg.</span> Super Wax Ankara
            </span>
          </div>
        </label>
      </div>

      {/* sold by and category */}
      <div className="grid grid-cols-2 gap-[11.36px]">
        <label className="flex flex-col gap-[5.68px]">
          <span className={labelStyle}>Sold by the</span>
          <div className="relative">
            <select className={selectStyle}>
              <option value="bundle">Bundle</option>
              <option value="yard">Yard</option>
              <option value="piece">Piece</option>
            </select>
            <img
              src={arrowDownIcon}
              alt=""
              className="pointer-events-none absolute right-[22.72px] top-1/2 size-[21px] -translate-y-1/2"
            />
          </div>
        </label>

        <label className="flex flex-col gap-[5.68px]">
          <span className={labelStyle}>Category</span>
          <div className="relative">
            <select className={selectStyle} defaultValue="">
              <option value="" disabled>
                Choose a category
              </option>
              <option value="wax-prints">Wax prints</option>
            </select>
            <img
              src={arrowDownIcon}
              alt=""
              className="pointer-events-none absolute right-[22.72px] top-1/2 size-[21px] -translate-y-1/2"
            />
          </div>
        </label>
      </div>
    </div>
  );
}

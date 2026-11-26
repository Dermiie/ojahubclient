// The Details part of the Add product form: photo, product name, sold by and category.
import { useEffect, useRef, useState } from "react";
import cameraIcon from "../assets/icons/camera.svg";
import arrowDownIcon from "../assets/icons/arrow-down.svg";
import plusSmallIcon from "../assets/icons/plus-small.svg";

// the look of a small label above a field
const labelStyle =
  "text-[12px] font-medium leading-[1.3] tracking-[-0.02em] text-text-primary";

// the look of the two drop-down boxes
const selectStyle =
  "h-[42.2px] w-full appearance-none rounded-[12.98px] border-[0.81px] border-border-default bg-background-main pl-[12.98px] pr-[22.72px] text-[14px] leading-[1.3] tracking-[-0.02em] text-text-secondary outline-none";

// the same two looks for the mobile view
const mobileLabelStyle =
  "text-[14px] font-medium leading-[1.3] tracking-[-0.02em] text-text-primary";

const mobileSelectStyle =
  "h-[52px] w-full appearance-none rounded-[16px] border border-border-default bg-background-main pl-4 pr-7 text-[14px] leading-[1.3] tracking-[-0.02em] text-text-secondary outline-none";

// the page gives us the values and a way to change each one
type Props = {
  name: string;
  onNameChange: (value: string) => void;
  soldBy: string;
  onSoldByChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  photo: File | null;
  onPhotoChange: (file: File | null) => void;
};

export default function AddProductDetails({
  name,
  onNameChange,
  soldBy,
  onSoldByChange,
  category,
  onCategoryChange,
  photo,
  onPhotoChange,
}: Props) {
  // the hidden file input, the photo boxes click it to open the file picker
  const fileInput = useRef<HTMLInputElement>(null);
  const openPicker = () => fileInput.current?.click();

  // a temporary address so the browser can show the chosen photo
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!photo) {
      setPhotoUrl(null);
      return;
    }
    const url = URL.createObjectURL(photo);
    setPhotoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  return (
    <>
      {/* the file picker, hidden, used by both views */}
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          onPhotoChange(e.target.files?.[0] ?? null);
          e.target.value = "";
        }}
      />

      {/* desktop view */}
      <div className="hidden flex-col gap-[16.23px] lg:flex">
        <h2 className="text-[14px] font-semibold leading-[1.3] tracking-[-0.02em] text-text-primary">
          Details
        </h2>

        {/* photo box and product name */}
        <div className="flex items-start gap-[12.98px]">
          <div className="relative w-[144px] shrink-0">
            {photoUrl ? (
              // the chosen photo, click it to change it
              <button
                type="button"
                aria-label="Change photo"
                onClick={openPicker}
                className="block h-[99px] w-full overflow-hidden rounded-[24px] bg-[#E3E7E5]"
              >
                <img
                  src={photoUrl}
                  alt="Product"
                  className="size-full object-cover"
                />
              </button>
            ) : (
              <button
                type="button"
                onClick={openPicker}
                className="flex w-full flex-col items-center gap-2 rounded-[24px] border-[1.5px] border-dashed border-[#848E89] bg-background-card px-5 py-6"
              >
                <img src={cameraIcon} alt="" className="size-6" />
                <span className="text-[12px] font-medium leading-[1.3] tracking-[-0.02em] text-text-primary">
                  Add photo
                </span>
              </button>
            )}

            {/* the green plus badge, shown whether or not a photo is picked */}
            <span className="pointer-events-none absolute -bottom-[4.35px] -right-[7.71px] flex size-7 items-center justify-center rounded-full border-[3px] border-white bg-primary-base">
              <img src={plusSmallIcon} alt="" className="size-3" />
            </span>
          </div>

          <label className="flex min-w-0 flex-1 flex-col gap-[5.68px]">
            <span className={labelStyle}>Product name</span>
            <div className="relative">
              {/* the space placeholder lets us show the two-colour hint while empty */}
              <input
                type="text"
                placeholder=" "
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
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
              <select
                value={soldBy}
                onChange={(e) => onSoldByChange(e.target.value)}
                className={selectStyle}
              >
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
              <select
                value={category}
                onChange={(e) => onCategoryChange(e.target.value)}
                className={selectStyle}
              >
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

      {/* mobile view */}
      <div className="flex flex-col gap-[14px] pb-[21px] lg:hidden">
        {/* photo box and product name */}
        <div className="flex items-center gap-3">
          {photoUrl ? (
            <button
              type="button"
              aria-label="Change photo"
              onClick={openPicker}
              className="h-[76px] w-[91px] shrink-0 overflow-hidden rounded-[21.624px] bg-[#E3E7E5]"
            >
              <img
                src={photoUrl}
                alt="Product"
                className="size-full object-cover"
              />
            </button>
          ) : (
            <button
              type="button"
              onClick={openPicker}
              className="flex h-[76px] w-[91px] shrink-0 flex-col items-center justify-center gap-[7.208px] rounded-[21.624px] border-[1.351px] border-dashed border-[#848E89] bg-background-card px-[18.02px]"
            >
              <img src={cameraIcon} alt="" className="size-5" />
              <span className="text-[10px] font-medium leading-[1.3] tracking-[-0.02em] text-text-primary">
                Add photo
              </span>
            </button>
          )}

          <label className="flex min-w-0 flex-1 flex-col gap-[7px]">
            <span className={mobileLabelStyle}>Product name</span>
            <div className="relative">
              {/* the space placeholder lets us show the two-colour hint while empty */}
              <input
                type="text"
                placeholder=" "
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                className="peer h-[52px] w-full rounded-[16px] border border-border-default bg-background-main px-[14px] text-[14px] leading-[1.3] tracking-[-0.02em] text-text-primary outline-none"
              />
              <span className="pointer-events-none absolute left-[15px] top-1/2 hidden -translate-y-1/2 text-[14px] leading-[1.3] tracking-[-0.02em] text-text-secondary peer-placeholder-shown:block">
                <span className="text-text-primary">eg.</span> Super Wax Ankara
              </span>
            </div>
          </label>
        </div>

        {/* sold by and category, no arrow icons on mobile */}
        <div className="grid grid-cols-2 gap-[10px]">
          <label className="flex flex-col gap-[7px]">
            <span className={mobileLabelStyle}>Sold by the</span>
            <select
              value={soldBy}
              onChange={(e) => onSoldByChange(e.target.value)}
              className={mobileSelectStyle}
            >
              <option value="bundle">Bundle</option>
              <option value="yard">Yard</option>
              <option value="piece">Piece</option>
            </select>
          </label>

          <label className="flex flex-col gap-[7px]">
            <span className={mobileLabelStyle}>Category</span>
            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className={mobileSelectStyle}
            >
              <option value="" disabled>
                Choose a category
              </option>
              <option value="wax-prints">Wax prints</option>
            </select>
          </label>
        </div>
      </div>
    </>
  );
}

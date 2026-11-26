// The two save buttons that stay at the bottom of the screen on mobile.

export default function AddProductBottomBar() {
  return (
    // mobile view
    <div className="fixed inset-x-0 bottom-0 z-30 flex flex-col gap-1 border-t border-border-subtle bg-background-main px-[18px] pb-[26px] pt-[14px] lg:hidden">
      <button
        type="button"
        className="flex w-full items-center justify-center rounded-[60px] bg-primary-base px-[10px] py-[14px] text-[14px] font-semibold leading-[1.3] text-white"
      >
        Save product
      </button>
      <button
        type="button"
        className="flex w-full items-center justify-center rounded-[60px] border border-primary-base bg-background-main px-[10px] py-[14px] text-[14px] font-semibold leading-[1.3] text-primary-base"
      >
        Save and add another
      </button>
    </div>
  );
}

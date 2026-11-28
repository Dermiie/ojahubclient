// The one save button that stays at the bottom of the screen on mobile, on the Edit page.

// the page tells us what to do when the button is clicked
type Props = {
  onSave: () => void;
};

export default function EditProductBottomBar({ onSave }: Props) {
  return (
    // mobile view
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border-subtle bg-background-main px-[18px] pb-[26px] pt-[14px] lg:hidden">
      <button
        type="button"
        onClick={onSave}
        className="flex w-full items-center justify-center rounded-[60px] bg-primary-base px-[10px] py-[14px] text-[14px] font-semibold leading-[1.3] text-white"
      >
        Save product
      </button>
    </div>
  );
}
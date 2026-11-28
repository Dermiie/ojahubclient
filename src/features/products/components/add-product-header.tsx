// Top of the Add product page: the back button, the label and the title.
import { Link, useNavigate } from "react-router";
import backIcon from "../assets/icons/back.svg";

// the label, title and back link can change, so other pages can use this header too
type Props = {
  label?: string;
  title?: string;
  // the mobile view can have its own title, if not it uses the normal one
  mobileTitle?: string;
  // a page address, or "back" to go to the page the user came from
  backTo?: string;
};

// the round back button: a normal link, or "back" goes to the previous page
function BackButton({
  backTo,
  className,
}: {
  backTo: string;
  className: string;
}) {
  const navigate = useNavigate();

  if (backTo !== "back") {
    return (
      <Link to={backTo} aria-label="Go back" className={className}>
        <img src={backIcon} alt="" className="size-5" />
      </Link>
    );
  }

  // if there is no page before this one, go to the products list instead
  const goBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate("/products");
    }
  };

  return (
    <button
      type="button"
      onClick={goBack}
      aria-label="Go back"
      className={className}
    >
      <img src={backIcon} alt="" className="size-5" />
    </button>
  );
}

export default function AddProductHeader({
  label = "Products",
  title = "Add product",
  mobileTitle,
  backTo = "/products",
}: Props) {
  return (
    <>
      {/* desktop view */}
      <div className="hidden items-center gap-[14px] lg:flex">
        {/* round back button, goes to the products list */}
        <BackButton
          backTo={backTo}
          className="flex size-[44px] items-center justify-center rounded-full border border-[#E3E7E5]"
        />

        {/* the label and the title */}
        <div className="flex flex-col gap-[6px]">
          <span className="text-[14px] leading-[1.3] tracking-[-0.02em] text-[#5F6B66]">
            {label}
          </span>
          <h1 className="text-[24px] font-semibold leading-[1.3] text-text-primary">
            {title}
          </h1>
        </div>
      </div>

      {/* mobile view */}
      <div className="flex items-center gap-3 lg:hidden">
        {/* round back button, goes to the products list */}
        <BackButton
          backTo={backTo}
          className="flex size-[46px] shrink-0 items-center justify-center rounded-full border border-border-default"
        />

        {/* the title */}
        <h1 className="text-[24px] font-bold leading-[27px] text-text-primary">
          {mobileTitle ?? title}
        </h1>
      </div>
    </>
  );
}
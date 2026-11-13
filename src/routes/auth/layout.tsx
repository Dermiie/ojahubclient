import { Link, Outlet, useLocation } from "react-router";
import loginDesktop from "@/assets/Images/Login desktop.png";
import loginMobile from "@/assets/Images/Login-mobile.png";
import registerDesktop from "@/assets/Images/Registration-desktop.png";
import registerMobile from "@/assets/Images/Registration mobile.png";
import desktopLogo from "@/assets/logo/Desktop logo + wordmark.svg";
import mobileLogo from "@/assets/logo/Mobile logo + wordmark.svg";

export default function AuthLayout() {
  const location = useLocation();
  const isLogin = location.pathname === "/auth/login";
  const isRegister = location.pathname === "/auth/register";
  const isForgotPassword = location.pathname === "/auth/forgot-password";
  const isVerify = location.pathname === "/auth/verify";
  const isSetNewPassword = location.pathname === "/auth/set-new-password";

  const desktopImage = isLogin
    ? loginDesktop
    : isRegister
      ? registerDesktop
      : null;

  const mobileImage = isLogin
    ? loginMobile
    : isRegister
      ? registerMobile
      : null;

  if (isForgotPassword || isVerify || isSetNewPassword) {
    return <Outlet />;
  }

  return (
    <div className="min-h-dvh bg-background-main">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1440px] flex-col lg:flex-row lg:gap-12 lg:p-6 xl:gap-12 xl:px-10">
        {/* Artwork panel */}
        <aside className="relative h-[275px] w-full shrink-0 overflow-hidden lg:sticky lg:top-6 lg:h-[calc(100dvh-3rem)] lg:w-1/2 lg:max-w-[702px] lg:self-start lg:rounded-[30px]">
          {desktopImage && (
            <picture>
              <source media="(min-width: 64rem)" srcSet={desktopImage} />
              <img
                src={mobileImage ?? desktopImage}
                alt="Ojahub promotional artwork"
                className="absolute inset-0 size-full object-cover object-top"
              />
            </picture>
          )}

          {/* Mobile logo — login only */}
          {isLogin && (
            <img
              src={mobileLogo}
              alt="Ojahub"
              className="absolute left-[25px] top-[72px] z-10 h-12.5 w-31.25 object-contain lg:hidden"
            />
          )}

          {/* Desktop overlay */}
          <div className="absolute inset-0 z-10 hidden flex-col gap-8 p-8 text-text-inverse lg:flex">
            {isRegister ? (
              <Link
                to="/"
                aria-label="Go to home page"
                className="w-fit cursor-pointer"
              >
                <img
                  src={desktopLogo}
                  alt="Ojahub"
                  className="h-[52px] w-[140px] object-contain"
                />
              </Link>
            ) : (
              <img
                src={desktopLogo}
                alt="Ojahub"
                className="h-[52px] w-[140px] object-contain"
              />
            )}

            {isRegister && (
              <div className="max-w-[528px]">
                <h2 className="mb-5 text-balance text-d2-bold xl:text-d1-bold">
                  Get paid instantly. No more fake alerts
                </h2>
                <p className="text-h5-medium font-normal text-text-secondary-inverse">
                  Track stock across shops and warehouses, send invoices on
                  WhatsApp, and let OjaHub confirm every transfer for you.
                </p>
              </div>
            )}

            {isLogin && (
              <h2 className="max-w-[500px] text-balance text-h3-bold tracking-tight xl:text-d2-bold">
                Your shop, your stock, your money. In one place.
              </h2>
            )}
          </div>
        </aside>

        {/* Form panel */}
        <section
          className={`relative z-10 w-full ${
            isRegister ? "max-md:-mt-[125px]" : "max-md:-mt-[29px]"
          } md:-mt-[29px] rounded-t-[32px] bg-white px-4 ${
            isRegister
              ? "pt-[53px] [@media(max-height:860px)_and_(max-width:767px)]:pt-[36px]"
              : "pt-8"
          } max-md:pb-6 md:w-[515px] md:flex-none md:flex md:items-center md:justify-center md:rounded-none md:bg-transparent md:px-0 md:pt-0 ${
            isRegister
              ? "md:h-[700px] md:translate-y-0"
              : "md:h-[602px] md:-translate-y-[81px]"
          }`}
        >
          <Outlet />
        </section>
      </div>
    </div>
  );
}

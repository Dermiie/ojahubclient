import { Outlet, useLocation } from "react-router";
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

  return (
    <>
      {isForgotPassword || isVerify || isSetNewPassword ? (
        <Outlet />
      ) : (
        <div className="mx-auto flex min-h-screen w-full flex-col bg-white p-0 md:w-[calc(100%-160px)] md:max-w-[1360px] md:flex-row md:items-center md:justify-center md:gap-[95px] md:pt-3">
          <div
            className={`relative w-full md:flex-none ${
              isLogin
                ? "md:h-[1000px] md:w-[702px] md:-translate-y-[5px]"
                : "md:h-[999px] md:w-[667px] md:-translate-y-[44px]"
            }`}
          >
            <div className="relative h-full w-full">
              <picture className="block w-full">
                <source
                  media="(max-width: 767px)"
                  srcSet={mobileImage ?? undefined}
                />
                {desktopImage && (
                  <img
                    src={desktopImage}
                    alt="Ojahub promotional artwork"
                    className={`block w-full h-[275px] rounded-none md:object-cover md:object-top md:rounded-[30px] ${
                      isLogin
                        ? "md:h-[1000px] md:w-[702px]"
                        : "md:h-[999px] md:w-[667px]"
                    }`}
                  />
                )}
              </picture>
              <picture className="hidden md:block absolute left-8 top-8 z-10">
                <source media="(max-width: 767px)" srcSet={mobileLogo} />
                <img
                  src={desktopLogo}
                  alt="Ojahub"
                  className="block w-[140px] h-[52px] object-contain"
                />
              </picture>

              {isLogin && (
                <img
                  src={mobileLogo}
                  alt="Ojahub"
                  className="md:hidden absolute left-[25px] top-[72px] z-20 w-[125px] h-[50px] object-contain"
                />
              )}

              {isRegister && (
                <div className="hidden md:block absolute left-8 top-[116px] z-10 max-w-[528px] text-white">
                  <h2 className="text-[54px] font-bold leading-[65px] mb-5">
                    <span className="block whitespace-nowrap">
                      Get paid instantly. No
                    </span>
                    <span className="block">more fake alerts</span>
                  </h2>

                  <p className="max-w-[528px] text-[18px] font-normal leading-[1.3] text-gray-300">
                    Track stock across shops and warehouses, send invoices on
                    WhatsApp, and let OjaHub confirm every transfer for you.
                  </p>
                </div>
              )}

              {isLogin && (
                <div className="hidden md:block absolute left-8 top-[116px] z-10 w-[500px] text-white">
                  <h2 className="text-[49px] font-bold leading-[1.2] tracking-tight mb-2">
                    Your shop, your stock, your money. In one place.
                  </h2>
                </div>
              )}
            </div>
          </div>
          <section className="relative z-10 w-full max-[375px]:-mt-[29px] -mt-[29px] rounded-t-[32px] bg-white px-4 pt-8 md:mt-0 md:h-[602px] md:w-[500px] md:flex-none md:flex md:items-center md:justify-center md:-translate-y-[81px] md:rounded-none md:bg-transparent md:px-0 md:pt-0">
            <Outlet />
          </section>
        </div>
      )}
    </>
  );
}

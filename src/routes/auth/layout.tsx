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
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-white p-0 md:p-6">
          <div className="relative w-full flex items-start justify-center p-0 md:p-2">
            <div className="relative w-full md:w-auto">
              <picture className="block">
                <source
                  media="(max-width: 767px)"
                  srcSet={mobileImage ?? undefined}
                />
                {desktopImage && (
                  <img
                    src={desktopImage}
                    alt="Ojahub promotional artwork"
                    className="block w-full h-[320px] object-cover object-[center_20%] rounded-none md:w-auto md:h-auto md:max-h-[calc(100vh-64px)] md:object-contain md:rounded-[30px]"
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
                  className="md:hidden absolute left-5 top-5 z-20 w-[110px] h-[42px] object-contain"
                />
              )}

              {isRegister && (
                <div className="hidden md:block absolute left-8 top-[116px] z-10 max-w-[400px] text-white">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#E8F5EC] px-3 py-2 text-xs font-medium text-[#263B30] mb-7">
                    <span className="text-green-700">✓</span>
                    Built for Balogun, Alaba and Ariaria
                  </span>

                  <h2 className="text-[40px] font-bold leading-[1.08] tracking-tight mb-5">
                    Get paid instantly. No more fake alerts
                  </h2>

                  <p className="max-w-[390px] text-[13px] leading-[1.5] text-gray-200">
                    Track stock across shops and warehouses, send invoices on
                    WhatsApp, and let OjaHub confirm every transfer for you.
                  </p>
                </div>
              )}

              {isLogin && (
                <div className="hidden md:block absolute left-8 top-[116px] z-10 max-w-[400px] text-white">
                  <h2 className="text-[40px] font-bold leading-[1.08] tracking-tight mb-5">
                    Your shop, your stock, your money. In one place.
                  </h2>
                </div>
              )}
            </div>
          </div>

          <section className="relative z-10 -mt-6 rounded-t-[24px] bg-white px-6 pt-8 md:mt-0 md:rounded-none md:bg-transparent md:px-0 md:pt-0 md:flex md:items-center md:justify-center">
            <Outlet />
          </section>
        </div>
      )}
    </>
  );
}

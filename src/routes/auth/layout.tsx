import { Outlet, useLocation } from 'react-router';
import loginDesktop from '@/assets/Images/Login desktop.png';
import loginMobile from '@/assets/Images/Login-mobile.png';
import registerDesktop from '@/assets/Images/Registration-desktop.png';
import registerMobile from '@/assets/Images/Registration mobile.png';
import desktopLogo from '@/assets/logo/Desktop logo + wordmark.svg';
import mobileLogo from '@/assets/logo/Mobile logo + wordmark.svg';

/**
 * Layout strategy (mobile-first):
 * - < lg (1024px): stacked. A 275px artwork banner, with the form sheet
 *   overlapping it by 29px with rounded top corners.
 * - ≥ lg: two columns. The artwork panel is sticky and sized to the viewport
 *   (100dvh minus the page padding), so it can never be taller than the screen
 *   and never causes a scroll by itself. If the form is taller than the
 *   viewport, only the form column scrolls while the artwork stays in place.
 * - No fixed pixel widths/heights or translate offsets: columns flex, and the
 *   whole thing is capped and centred at 1440px on very wide screens.
 */
export default function AuthLayout() {
  const location = useLocation();
  const isLogin = location.pathname === '/auth/login';
  const isRegister = location.pathname === '/auth/register';
  const isForgotPassword = location.pathname === '/auth/forgot-password';
  const isVerify = location.pathname === '/auth/verify';
  const isSetNewPassword = location.pathname === '/auth/set-new-password';

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
        {/* ---------- Artwork panel ---------- */}
        <aside className="relative h-[275px] w-full shrink-0 overflow-hidden lg:sticky lg:top-6 lg:h-[calc(100dvh-3rem)] lg:w-1/2 lg:max-w-[702px] lg:self-start lg:rounded-[30px]">
          {desktopImage && (
            <picture>
              {/* Matches Tailwind's lg breakpoint (64rem) */}
              <source media="(min-width: 64rem)" srcSet={desktopImage} />
              <img
                src={mobileImage ?? desktopImage}
                alt="Ojahub promotional artwork"
                className="absolute inset-0 size-full object-cover object-top"
              />
            </picture>
          )}

          {/* Mobile logo — login only (unchanged behaviour) */}
          {isLogin && (
            <img
              src={mobileLogo}
              alt="Ojahub"
              className="absolute left-[25px] top-[72px] z-10 h-12.5 w-31.25 object-contain lg:hidden"
            />
          )}

          {/* Desktop overlay: logo + headline flow in a column, no magic offsets */}
          <div className="absolute inset-0 z-10 hidden flex-col gap-8 p-8 text-text-inverse lg:flex">
            <img
              src={desktopLogo}
              alt="Ojahub"
              className="h-[52px] w-[140px] object-contain"
            />

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

        {/* ---------- Form panel ---------- */}
        <section className="relative z-10 -mt-[29px] flex-1 rounded-t-[32px] bg-background-main px-4 pb-10 pt-8 sm:px-8 lg:mt-0 lg:flex lg:items-center lg:justify-center lg:rounded-none lg:bg-transparent lg:px-0 lg:py-8">
          <div className=" w-full max-w-[500px]">
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
}

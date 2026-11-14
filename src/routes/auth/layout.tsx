import { Link, Outlet, useLocation } from 'react-router';
import loginDesktop from '@/assets/Images/Login desktop.png';
import loginMobile from '@/assets/Images/Login-mobile.png';
import registerDesktop from '@/assets/Images/Registration-desktop.png';
import registerMobile from '@/assets/Images/Registration mobile.png';
import desktopLogo from '@/assets/logo/Desktop logo + wordmark.svg';
import mobileLogo from '@/assets/logo/Mobile logo + wordmark.svg';

/**
 * Responsive strategy (mobile-first):
 *
 * < md (phones)      Stacked: 275px artwork banner, form sheet overlaps it
 *                    (29px on login, 125px on register) with rounded top corners.
 * md – lg (tablets)  Same stacked layout, form centred in the space below the banner.
 * ≥ lg (desktop)     Two columns. The artwork is sticky and sized from the viewport
 *                    height, capped at the Figma size (702×1000 login, 690×890
 *                    register), so it never causes a scroll. When everything fits,
 *                    the row is centred vertically; if the form is taller than the
 *                    screen, only the form scrolls while the artwork stays put.
 * ≥ 2xl              Full Figma display type sizes (text-d1-bold).
 *
 * Needs the `short` variant in the global CSS (see index.css):
 *   @custom-variant short (@media (max-height: 860px));
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

  const desktopLogoImg = (
    <img
      src={desktopLogo}
      alt="Ojahub"
      className="h-[52px] w-[140px] object-contain"
    />
  );

  return (
    <div className="flex min-h-dvh flex-col bg-background-main lg:justify-center lg:p-6 xl:px-10">
      <div
        className={`mx-auto flex w-full max-w-[1360px] flex-1 flex-col lg:flex-none lg:flex-row lg:gap-12 ${
          isRegister ? 'xl:gap-20' : 'xl:gap-24'
        }`}
      >
        {/* ---------- Artwork panel ---------- */}
        <aside
          className={`relative h-[275px] w-full shrink-0 overflow-hidden lg:sticky lg:top-6 lg:h-[calc(100dvh-3rem)] lg:w-1/2 lg:self-start lg:rounded-[30px] ${
            isLogin
              ? 'lg:max-h-[1000px] lg:max-w-[702px]'
              : 'lg:max-h-[890px] lg:max-w-[690px]'
          }`}
        >
          {desktopImage && (
            <picture>
              {/* 64rem = Tailwind's lg breakpoint */}
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
              className="absolute left-[25px] top-[72px] z-10 h-[50px] w-[125px] object-contain lg:hidden"
            />
          )}

          {/* Desktop overlay: logo + headline in a padded column */}
          <div className="absolute inset-0 z-10 hidden flex-col items-start gap-8 p-8 text-text-inverse lg:flex">
            {isRegister ? (
              <Link to="/" aria-label="Go to home page">
                {desktopLogoImg}
              </Link>
            ) : (
              desktopLogoImg
            )}

            {isRegister && (
              <div className="max-w-[600px]">
                <h2 className="mb-5 text-balance text-d2-bold 2xl:text-d1-bold">
                  <span className="2xl:block 2xl:whitespace-nowrap">
                    Get paid instantly. No
                  </span>{' '}
                  <span className="2xl:block">more fake alerts</span>
                </h2>
                <p className="text-h5-medium font-normal text-text-secondary-inverse xl:text-button-lg xl:font-normal">
                  Track stock across shops and warehouses, send invoices on
                  WhatsApp, and let OjaHub confirm every transfer for you.
                </p>
              </div>
            )}

            {isLogin && (
              <h2 className="max-w-[500px] text-balance text-d2-bold tracking-tight 2xl:text-d1-bold">
                Your shop, your stock, your money. In one place.
              </h2>
            )}
          </div>
        </aside>

        {/* ---------- Form panel ---------- */}
        <section
          className={`relative z-10 flex-1 rounded-t-[32px] bg-background-main px-4 pb-6 sm:px-8 md:flex md:items-center md:justify-center md:py-12 lg:mt-0 lg:rounded-none lg:bg-transparent lg:px-0 lg:py-8 ${
            isRegister
              ? '-mt-[125px] pt-[53px] max-md:short:pt-9'
              : '-mt-[29px] pt-8'
          }`}
        >
          <div className="mx-auto w-full max-w-[515px]">
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
}

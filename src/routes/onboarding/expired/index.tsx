
import { ArrowRight, Check, LockKeyhole } from 'lucide-react';

const availableFeatures = [
  'View stock, invoices, and customers',
  'Get paid on invoices already sent',
];

const pausedFeatures = [
  'New invoice',
  'Adding or moving stock',
  'Low-stock SMS alerts',
];

/* Green background + calendar illustration */
function BannerIllustration() {
  return (
    <>
      <img
        src="/Vector 2.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 hidden h-[180px] w-[180px] object-contain md:block"
      />

      <img
        src="/image 4.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-8 -translate-y-10 -translate-x-10 hidden h-[220px] w-[220px] object-contain md:block"
      />
    </>
  );
}

export default function SubscriptionExpired() {
  return (
    <main className="fixed inset-0 z-[9999] overflow-y-auto bg-white px-4 pt-4 pb-8 font-sans md:px-8 md:pt-8 md:pb-16">
      {/* HEADER (desktop only) */}
      <header className="mx-auto hidden w-full max-w-[1120px] items-center justify-between md:flex">
        <img
          src="/ojahub.jpg"
          alt="Ojahub"
          className="h-8 w-auto object-contain"
        />

        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary-base text-sm font-semibold text-white">
            AF
          </div>
          <span className="text-[15px] font-medium text-text-primary">
            Adaeze Fabrics
          </span>
        </div>
      </header>

      <section className="mx-auto w-full max-w-[860px] md:mt-12">
        {/* BANNER */}
        <div className="relative overflow-hidden rounded-xl bg-[#F8F0E5] p-4 md:min-h-[312px] md:rounded-2xl md:px-8 md:pt-7 md:pb-10">
          <BannerIllustration />

          <div className="relative max-w-[460px]">
            <div className="flex size-9 items-center justify-center rounded-lg bg-white md:size-11 md:rounded-xl">
              <LockKeyhole className="size-[18px] text-[#C99B5B] md:size-5" />
            </div>

            <h1 className="mt-3 text-lg leading-6 font-bold text-text-primary md:mt-6 md:text-[32px] md:leading-10 md:tracking-[-0.4px]">
              Your plan has ended
            </h1>

            <p className="mt-1.5 text-[11px] leading-4 text-text-secondary md:mt-3 md:text-[15px] md:leading-[22px]">
              <span className="md:block">
                Monthly plan ended on 20 Oct 2026. Your records are safe.
              </span>{' '}
              <span className="md:block">
                Renew now to keep selling without interruptions.
              </span>
            </p>

            {/* Desktop actions */}
            <div className="mt-7 hidden items-center gap-3 md:flex">
              <button
                type="button"
                className="flex h-11 items-center justify-center rounded-full border border-primary-base px-7 text-[15px] font-semibold text-primary-base transition-colors hover:bg-primary-subtle"
              >
                View my records
              </button>

              <button
                type="button"
                className="flex h-11 items-center justify-center gap-2 rounded-full bg-primary-base px-7 text-[15px] font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                Renew from ₦5,000
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* FEATURE PANELS */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:mt-4 md:grid-cols-2 md:gap-4">
          {/* You can still */}
          <div className="md:rounded-2xl md:bg-[#E8F4EC] md:px-7 md:py-5">
            <h2 className="mb-2.5 text-sm font-semibold text-text-primary md:mb-4 md:text-[17px] md:text-primary-base">
              You can still
            </h2>

            <ul className="space-y-2.5 md:space-y-4">
              {availableFeatures.map((text) => (
                <li
                  key={text}
                  className="flex min-h-[44px] items-center gap-2.5 rounded-lg bg-[#E8F4EC] px-3 py-2 md:min-h-0 md:gap-3 md:rounded-none md:bg-transparent md:p-0"
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-base text-white md:size-8">
                    <Check className="size-3.5 md:size-4" strokeWidth={3} />
                  </span>

                  <span className="text-xs font-medium text-text-primary md:text-[15px]">
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Paused until renew */}
          <div className="md:rounded-2xl md:bg-[#F1F3F2] md:px-7 md:py-5">
            <h2 className="mb-2.5 text-sm font-semibold text-text-primary md:mb-4 md:text-[17px]">
              Paused until renew
            </h2>

            <ul className="space-y-2.5 md:space-y-4">
              {pausedFeatures.map((text) => (
                <li
                  key={text}
                  className="flex min-h-[44px] items-center gap-2.5 rounded-lg bg-[#F1F3F2] px-3 py-2 md:min-h-0 md:gap-3 md:rounded-none md:bg-transparent md:p-0"
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#E3E8E5] text-[#929D96] md:size-8">
                    <LockKeyhole className="size-3.5 md:size-4" />
                  </span>

                  <span className="text-xs text-[#89938D] md:text-[15px]">
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* MOBILE ACTIONS */}
        <div className="mt-6 flex flex-col gap-3 md:hidden">
          <button
            type="button"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary-base text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Go to Dashboard
            <ArrowRight className="size-4" />
          </button>

          <button
            type="button"
            className="flex h-11 w-full items-center justify-center rounded-full border border-primary-base text-sm font-semibold text-primary-base transition-colors hover:bg-primary-subtle"
          >
            View receipt
          </button>
        </div>
      </section>
    </main>
  );
}

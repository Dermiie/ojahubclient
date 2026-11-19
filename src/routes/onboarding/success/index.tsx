import { ArrowRight, Check } from 'lucide-react';

const subscriptionDetails = [
  { label: 'Plan', value: 'Yearly' },
  { label: 'Active until', value: '27 Oct 2027' },
  { label: 'Reference', value: 'PSK-7Q2M9X41' },
];

export default function SubscriptionSuccess() {
  return (
    <main className="fixed inset-0 z-[9999] overflow-y-auto bg-white px-4 pt-[60px] pb-10 font-sans sm:pt-[80px]">
      <section className="mx-auto w-full max-w-[400px] sm:max-w-[520px]">
        {/* Success icon */}
        <div
          aria-hidden="true"
          className="mx-auto flex size-[80px] items-center justify-center rounded-full bg-primary-subtle sm:size-[96px]"
        >
          <div className="flex size-[40px] items-center justify-center rounded-full bg-primary-base sm:size-[48px]">
            <Check
              className="size-[22px] text-white sm:size-[26px]"
              strokeWidth={3}
            />
          </div>
        </div>

        {/* Heading */}
        <div className="mt-5 text-center sm:mt-[22px]">
          <h1 className="text-[24px] leading-[29px] font-bold tracking-[-0.7px] text-text-primary sm:text-[36px] sm:leading-[42px] sm:tracking-[-1px]">
            You're all set!
          </h1>

          <p className="mx-auto mt-2 max-w-[260px] text-[14px] leading-[20px] text-text-secondary sm:mt-[6px] sm:max-w-none sm:text-[14px] sm:leading-[20px]">
            Payment received. Adaeze Fabrics is open for business.
          </p>
        </div>

        {/* Payment summary card */}
        <div
          role="status"
          className="mt-8 overflow-hidden rounded-[12px] bg-background-card sm:mt-[28px] sm:rounded-[16px]"
        >
          {/* Amount paid + status */}
          <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-2 px-4 py-4 sm:grid-cols-[1fr_auto] sm:px-[22px] sm:pt-[18px] sm:pb-[14px]">
            <p className="col-start-1 row-start-1 text-[12px] leading-[16px] text-text-secondary sm:text-[14px] sm:leading-[20px]">
              Amount Paid
            </p>

            <div className="col-start-2 row-start-1 flex items-center gap-[6px] rounded-full bg-primary-subtle px-[10px] py-[4px] sm:row-span-2 sm:gap-2 sm:self-center sm:px-[16px] sm:py-[8px]">
              <span className="hidden size-[6px] shrink-0 rounded-full bg-primary-base sm:block sm:size-[8px]" />
              <span className="text-[11px] leading-[14px] font-medium text-primary-base sm:text-[13px] sm:leading-[16px]">
                <span className="sm:hidden">successful</span>
                <span className="hidden whitespace-nowrap sm:inline">
                  Payment successful
                </span>
              </span>
            </div>

            <h2 className="col-start-3 row-start-1 text-[16px] leading-[20px] font-bold text-text-primary sm:col-start-1 sm:row-start-2 sm:text-[26px] sm:leading-[32px]">
              ₦48,000
            </h2>
          </div>

          {/* Dashed divider */}
          <div className="mx-4 border-t border-dashed border-border-default sm:mx-0" />

          {/* Subscription details */}
          <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-3 sm:px-[28px] sm:py-[18px]">
            {subscriptionDetails.map((detail) => (
              <div
                key={detail.label}
                className="flex min-w-0 items-center justify-between gap-3 sm:block"
              >
                <p className="text-[12px] leading-[16px] text-text-secondary sm:text-[14px] sm:leading-[20px]">
                  {detail.label}
                </p>
                <p className="whitespace-nowrap text-[13px] leading-[18px] font-semibold text-text-primary sm:mt-[4px] sm:text-[16px] sm:leading-[22px]">
                  {detail.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:mt-[28px] sm:grid sm:grid-cols-2 sm:gap-[32px]">
          <button
            type="button"
            className="order-2 flex h-[44px] items-center justify-center rounded-full border border-primary-base text-[14px] leading-none font-semibold text-primary-base transition-colors hover:bg-primary-subtle sm:order-1 sm:h-[44px] sm:text-[14px]"
          >
            View receipt
          </button>

          <button
            type="button"
            className="order-1 flex h-[44px] items-center justify-center gap-2 rounded-full bg-primary-base text-[14px] leading-none font-semibold text-white transition-colors hover:bg-primary-hover sm:order-2 sm:h-[44px] sm:text-[14px]"
          >
            Go to Dashboard
            <ArrowRight className="size-[16px]" />
          </button>
        </div>
      </section>
    </main>
  );
}
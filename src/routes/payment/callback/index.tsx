import { parseApiError } from '@/api/api';
import { useOnboardingState } from '@/api/onboarding/onboarding';

import {
  PLANS,
  useVerifyPayment,
  type VerifyPaymentResult,
} from '@/api/subscription/subscriptionApi';
import { formatNaira } from '@/lib/money';
import { cn } from 'cn';
import { ArrowRight, Check, X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

/*
 * Paystack sends the user back here after paying:
 *   /onboarding/success?reference=OJA-20261126-A1B2C3
 *
 * We never trust the redirect alone. The page asks the backend to check
 * the payment with Paystack, then shows one of three screens:
 *   1. Confirming...   while the backend checks
 *   2. Success         payment worked, subscription active
 *   3. Failed          payment not completed (or no reference in the link)
 */

type ResultVariant = 'success' | 'failed';

interface Detail {
  label: string;
  value: string;
}

// "27 Oct 2027"
const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '-';
  return dateFormat.format(date);
}

// ---------- Page ----------

export default function PaymentResultPage() {
  const [searchParams] = useSearchParams();

  // Paystack adds both ?reference= and ?trxref= (same value)
  const reference = searchParams.get('reference') ?? searchParams.get('trxref');

  const {
    mutate: verify,
    data: result,
    error,
    isPending,
    isIdle,
  } = useVerifyPayment();

  // Check the payment once, when the page opens.
  // The ref stops React (in development) from sending it twice.
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!reference || hasStartedRef.current) return;
    hasStartedRef.current = true;
    verify(reference);
  }, [reference, verify]);

  function checkAgain() {
    if (reference) verify(reference);
  }

  // No reference: the user opened this page without coming from Paystack
  if (!reference) {
    return (
      <PaymentFailed
        message="We could not find a payment reference in this link."
        reference={null}
        onCheckAgain={null}
      />
    );
  }

  // isIdle: the first render, just before the check starts
  if (isIdle || isPending) {
    return <ConfirmingPayment />;
  }

  // 400 not completed or failed, 404 not found, 502 Paystack down, network
  if (error) {
    return (
      <PaymentFailed
        message={parseApiError(error).message}
        reference={reference}
        onCheckAgain={checkAgain}
      />
    );
  }

  if (result) {
    return <PaymentSuccess result={result} />;
  }

  return <ConfirmingPayment />;
}

// ---------- Screens ----------

function ConfirmingPayment() {
  return (
    <ResultShell>
      <div
        role="status"
        className="flex flex-col items-center pt-10 text-center sm:pt-16"
      >
        <div className="size-12 animate-spin rounded-full border-4 border-primary-subtle border-t-primary-base" />

        <h1 className="mt-6 text-[24px] leading-[29px] font-bold tracking-[-0.7px] text-text-primary sm:text-[28px] sm:leading-[34px]">
          Confirming your payment...
        </h1>

        <p className="mt-2 max-w-[300px] text-[14px] leading-[20px] text-text-secondary">
          This takes a few seconds. Please don't close this page.
        </p>
      </div>
    </ResultShell>
  );
}

function PaymentSuccess({ result }: { result: VerifyPaymentResult }) {
  const navigate = useNavigate();
  const { data: onboarding } = useOnboardingState();

  const plan = PLANS.find((item) => item.id === result.plan);
  const businessName = onboarding?.business?.name ?? 'Your business';

  const details: Detail[] = [
    { label: 'Plan', value: plan ? plan.label : result.plan },
    { label: 'Active until', value: formatDate(result.currentPeriodEnd) },
    { label: 'Reference', value: result.reference },
  ];

  return (
    <ResultShell>
      <ResultIcon variant="success" />

      <ResultHeading
        title="You're all set!"
        text={`Payment received. ${businessName} is open for business.`}
      />

      <SummaryCard
        variant="success"
        label="Amount Paid"
        value={plan ? formatNaira(plan.priceKobo) : '-'}
        details={details}
      />

      <p className="mt-4 text-center text-[12px] leading-[16px] text-text-tertiary sm:text-[14px] sm:leading-[20px]">
        A receipt has been sent to your email.
      </p>

      <div className="mt-8 sm:mt-[28px]">
        <button
          type="button"
          className="flex h-[44px] w-full items-center justify-center gap-2 rounded-full bg-primary-base text-[14px] leading-none font-semibold text-white transition-colors hover:bg-primary-hover"
          onClick={() => navigate('/', { replace: true })}
        >
          Go to Dashboard
          <ArrowRight className="size-[16px]" />
        </button>
      </div>
    </ResultShell>
  );
}

interface PaymentFailedProps {
  message: string;
  reference: string | null;
  /** null hides the "Check again" button (nothing to check) */
  onCheckAgain: (() => void) | null;
}

function PaymentFailed({
  message,
  reference,
  onCheckAgain,
}: PaymentFailedProps) {
  const navigate = useNavigate();

  const details: Detail[] = [];
  if (reference) {
    details.push({ label: 'Reference', value: reference });
  }

  return (
    <ResultShell>
      <ResultIcon variant="failed" />

      <ResultHeading title="Payment not completed" text={message} />

      <SummaryCard
        variant="failed"
        label="Payment"
        value="Not completed"
        details={details}
      />

      <p className="mt-4 text-center text-[12px] leading-[16px] text-text-tertiary sm:text-[14px] sm:leading-[20px]">
        If money left your account, wait a minute and tap "Check again".
        Paystack can take a moment to confirm.
      </p>

      <div
        className={cn(
          'mt-8 flex flex-col gap-3 sm:mt-[28px]',
          onCheckAgain && 'sm:grid sm:grid-cols-2 sm:gap-[32px]',
        )}
      >
        <button
          type="button"
          className="order-2 flex h-[44px] items-center justify-center rounded-full border border-primary-base text-[14px] leading-none font-semibold text-primary-base transition-colors hover:bg-primary-subtle sm:order-1"
          onClick={() => navigate('/onboarding/step-four', { replace: true })}
        >
          Back to plans
        </button>

        {onCheckAgain && (
          <button
            type="button"
            className="order-1 flex h-[44px] items-center justify-center gap-2 rounded-full bg-primary-base text-[14px] leading-none font-semibold text-white transition-colors hover:bg-primary-hover sm:order-2"
            onClick={onCheckAgain}
          >
            Check again
          </button>
        )}
      </div>
    </ResultShell>
  );
}

// ---------- Shared pieces ----------

/** Full-screen white page, centred column (covers the onboarding header). */
function ResultShell({ children }: { children: ReactNode }) {
  return (
    <main className="fixed inset-0 z-[9999] overflow-y-auto bg-white px-4 pt-[60px] pb-10 font-sans sm:pt-[80px]">
      <section className="mx-auto w-full max-w-[400px] sm:max-w-[520px]">
        {children}
      </section>
    </main>
  );
}

/** Green tick for success, red cross for failed. */
function ResultIcon({ variant }: { variant: ResultVariant }) {
  const isSuccess = variant === 'success';

  return (
    <div
      aria-hidden="true"
      className={cn(
        'mx-auto flex size-[80px] items-center justify-center rounded-full sm:size-[96px]',
        isSuccess ? 'bg-primary-subtle' : 'bg-destructive/10',
      )}
    >
      <div
        className={cn(
          'flex size-[40px] items-center justify-center rounded-full sm:size-[48px]',
          isSuccess ? 'bg-primary-base' : 'bg-destructive',
        )}
      >
        {isSuccess ? (
          <Check
            className="size-[22px] text-white sm:size-[26px]"
            strokeWidth={3}
          />
        ) : (
          <X
            className="size-[22px] text-white sm:size-[26px]"
            strokeWidth={3}
          />
        )}
      </div>
    </div>
  );
}

function ResultHeading({ title, text }: { title: string; text: string }) {
  return (
    <div className="mt-5 text-center sm:mt-[22px]">
      <h1 className="text-[24px] leading-[29px] font-bold tracking-[-0.7px] text-text-primary sm:text-[36px] sm:leading-[42px] sm:tracking-[-1px]">
        {title}
      </h1>

      <p className="mx-auto mt-2 max-w-[260px] text-[14px] leading-[20px] text-text-secondary sm:mt-[6px] sm:max-w-none">
        {text}
      </p>
    </div>
  );
}

interface SummaryCardProps {
  variant: ResultVariant;
  label: string; // small text, e.g. "Amount Paid"
  value: string; // big text, e.g. "₦48,000"
  details: Detail[]; // rows under the dashed line (none = no dashed line)
}

/** The grey card: big value + status pill, then the detail rows. */
function SummaryCard({ variant, label, value, details }: SummaryCardProps) {
  const isSuccess = variant === 'success';

  return (
    <div
      role="status"
      className="mt-8 overflow-hidden rounded-[12px] bg-background-card sm:mt-[28px] sm:rounded-[16px]"
    >
      {/* Value + status */}
      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-2 px-4 py-4 sm:grid-cols-[1fr_auto] sm:px-[22px] sm:pt-[18px] sm:pb-[14px]">
        <p className="col-start-1 row-start-1 text-[12px] leading-[16px] text-text-secondary sm:text-[14px] sm:leading-[20px]">
          {label}
        </p>

        <div
          className={cn(
            'col-start-2 row-start-1 flex items-center gap-[6px] rounded-full px-[10px] py-[4px] sm:row-span-2 sm:gap-2 sm:self-center sm:px-[16px] sm:py-[8px]',
            isSuccess ? 'bg-primary-subtle' : 'bg-destructive/10',
          )}
        >
          <span
            className={cn(
              'hidden size-[6px] shrink-0 rounded-full sm:block sm:size-[8px]',
              isSuccess ? 'bg-primary-base' : 'bg-destructive',
            )}
          />
          <span
            className={cn(
              'text-[11px] leading-[14px] font-medium sm:text-[13px] sm:leading-[16px]',
              isSuccess ? 'text-primary-base' : 'text-destructive',
            )}
          >
            {/* Short word on mobile, full label from sm */}
            <span className="sm:hidden">
              {isSuccess ? 'successful' : 'failed'}
            </span>
            <span className="hidden whitespace-nowrap sm:inline">
              {isSuccess ? 'Payment successful' : 'Payment failed'}
            </span>
          </span>
        </div>

        <h2 className="col-start-3 row-start-1 text-[16px] leading-[20px] font-bold text-text-primary sm:col-start-1 sm:row-start-2 sm:text-[26px] sm:leading-[32px]">
          {value}
        </h2>
      </div>

      {details.length > 0 && (
        <>
          {/* Dashed divider */}
          <div className="mx-4 border-t border-dashed border-border-default sm:mx-0" />

          {/* Detail rows: label left + value right on mobile, columns from sm */}
          <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-3 sm:px-[28px] sm:py-[18px]">
            {details.map((detail) => (
              <div
                key={detail.label}
                className="flex min-w-0 items-center justify-between gap-3 sm:block"
              >
                <p className="text-[12px] leading-[16px] text-text-secondary sm:text-[14px] sm:leading-[20px]">
                  {detail.label}
                </p>
                <p className="truncate text-[13px] leading-[18px] font-semibold text-text-primary sm:mt-[4px] sm:text-[16px] sm:leading-[22px]">
                  {detail.value}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

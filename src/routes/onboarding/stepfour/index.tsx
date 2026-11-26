import { parseApiError } from '@/api/api';
import { useChoosePlan } from '@/api/onboarding/onboarding';
import {
  FREE_TRIAL_PLAN_ID,
  PLANS,
  TRIAL_DAYS,
  type Plan,
  type PlanId,
} from '@/api/subscription/subscriptionApi';
import { Button } from '@/components/ui/button';
import StepProgress from '@/components/ui/stepProgress';
import { formatNaira } from '@/lib/money';
import { cn } from 'cn';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

// The plans and prices are hard-coded in subscriptionApi.ts for now.
// Only the words around the prices live here.
const PERIOD_LABELS: Record<PlanId, string> = {
  monthly: 'month',
  six_months: '6 months',
  yearly: 'year',
};

const DEFAULT_PLAN: PlanId = 'yearly';

const DASHBOARD = '/';

/** Price per month in kobo. ₦48,000 for 12 months → 400000 (₦4,000) */
function monthlyCostKobo(plan: Plan): number {
  return Math.round(plan.priceKobo / plan.months);
}

/** The small text under the price */
function planDescription(plan: Plan): string {
  if (plan.months === 1) return 'Pay as you go, cancel anytime';

  const perMonth = `Works out to ${formatNaira(monthlyCostKobo(plan))} a month`;
  if (plan.id === 'yearly') return `${perMonth}. Best value.`;
  return perMonth;
}

function planBadge(plan: Plan, plans: Plan[]): string | null {
  if (plan.id !== 'yearly') return null;

  const monthlyPlan = plans.find((item) => item.id === 'monthly');
  if (!monthlyPlan) return null;

  const saving = 1 - monthlyCostKobo(plan) / monthlyPlan.priceKobo;
  const savingPercent = Math.round(saving * 100);
  if (savingPercent <= 0) return null;

  return `Save ${savingPercent}%`;
}

function payButtonLabel(planId: PlanId): string {
  const plan = PLANS.find((item) => item.id === planId);
  if (!plan) return 'Choose a plan';

  return `Pay ${formatNaira(plan.priceKobo)} for ${plan.label}`;
}

export default function StepFour() {
  const navigate = useNavigate();
  const {
    mutate: choosePlan,
    isPending: isSaving,
    error: saveError,
    variables: sentPlan,
  } = useChoosePlan();

  const [selectedPlan, setSelectedPlan] = useState<PlanId>(DEFAULT_PLAN);
  const [isGoingToPaystack, setIsGoingToPaystack] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  // One message for the banner: a failed request first, then payError.
  let errorMessage: string | null = payError;
  if (saveError) {
    errorMessage = parseApiError(saveError).message;
  }

  const isBusy = isSaving || isGoingToPaystack;
  const isStartingTrial = isSaving && sentPlan?.plan === FREE_TRIAL_PLAN_ID;
  const isStartingPayment =
    isGoingToPaystack || (isSaving && sentPlan?.plan !== FREE_TRIAL_PLAN_ID);

  // const selectedPlanDetails = PLANS.find((plan) => plan.id === selectedPlan);

  // const paymentDescription = selectedPlanDetails
  //   ? `Pay for ${selectedPlan} at ₦${selectedPlanDetails.priceKobo / 100}`
  //   : 'Choose a plan';

  /** "Start free trial": no payment, straight to the dashboard. */
  function onFreeTrial() {
    choosePlan(
      { plan: FREE_TRIAL_PLAN_ID },
      {
        onSuccess: () => {
          navigate(DASHBOARD, { replace: true });
        },
      },
    );
  }

  function onPay() {
    choosePlan(
      { plan: selectedPlan },
      {
        onSuccess: (result) => {
          // Expected answer: { type: 'payment', payment: { authorizationUrl } }
          if (result.type === 'payment' && result.payment.authorizationUrl) {
            setIsGoingToPaystack(true);
            // Leaves our app. Paystack sends the user back after paying.
            window.location.assign(result.payment.authorizationUrl);
            return;
          }

          // Anything else means the backend did not start a payment.
          // Usually the backend is out of date (it has no Paystack step yet).
          console.error(
            'PUT /api/onboarding/plan did not return a Paystack link:',
            result,
          );
          setPayError('We could not open Paystack. Please try again.');
        },
      },
    );
  }

  return (
    <div className="space-y-5">
      <div className="mx-auto space-y-5 md:w-8/12">
        <StepProgress currentStep={4} totalSteps={4} label="Choose Your Plan" />
        <div className="flex flex-col items-center space-y-3">
          <h1 className="text-center text-h2-bold md:w-3/4 md:text-d1-bold">
            Pick your plan
          </h1>
          <p className="text-center text-base text-text-tertiary md:w-3/5">
            Every plan has every feature, Pay for longer and your monthly cost
            drops. Change or cancel any time.
          </p>
        </div>
      </div>

      <div
        role="radiogroup"
        aria-label="Plans"
        className="grid gap-6 md:grid-cols-3"
      >
        {PLANS.map((plan) => {
          const isSelected = plan.id === selectedPlan;
          const badge = planBadge(plan, PLANS);

          return (
            <button
              key={plan.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setSelectedPlan(plan.id)}
              className={cn(
                'rounded-2xl border p-8 text-left transition-colors',
                isSelected
                  ? 'border-primary-active bg-primary-active'
                  : 'border-border-default bg-background-main hover:bg-background-card',
              )}
            >
              {/* Title row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <p
                    className={cn(
                      'text-h5-medium',
                      isSelected ? 'text-text-inverse' : 'text-text-primary',
                    )}
                  >
                    {plan.label}
                  </p>
                  {badge && (
                    <span className="rounded-full bg-primary-light px-2.5 py-1 text-b3-medium text-primary-active">
                      {badge}
                    </span>
                  )}
                </div>

                {/* Radio circle */}
                {isSelected ? (
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-text-inverse">
                    <span className="size-3 rounded-full bg-primary-light" />
                  </span>
                ) : (
                  <span className="size-5 shrink-0 rounded-full border-2 border-border-strong" />
                )}
              </div>

              {/* Price */}
              <p className="mt-4">
                <span
                  className={cn(
                    'text-h4-medium md:text-h3-semibold',
                    isSelected ? 'text-text-inverse' : 'text-text-primary',
                  )}
                >
                  {formatNaira(plan.priceKobo)}
                </span>
                <span
                  className={cn(
                    'text-h4-medium',
                    isSelected
                      ? 'text-text-secondary-inverse'
                      : 'text-text-secondary',
                  )}
                >
                  {' '}
                  / {PERIOD_LABELS[plan.id]}
                </span>
              </p>

              {/* Description */}
              <p
                className={cn(
                  'mt-4 text-base',
                  isSelected
                    ? 'text-text-secondary-inverse'
                    : 'text-text-secondary',
                )}
              >
                {planDescription(plan)}
              </p>
            </button>
          );
        })}
      </div>

      <div className="border p-10 rounded-2xl flex gap-2 justify-between items-center">
        <div>
          <p>Not ready to pay yet?</p>
          <p>
            Use everything free for 7 days. No card needed. Pick a plan when
            you're ready
          </p>
        </div>
        <Button
          variant={'outline'}
          size="lg"
          disabled={isBusy}
          onClick={onFreeTrial}
        >
          {isStartingTrial
            ? 'Starting trial...'
            : `Start ${TRIAL_DAYS}-day free trial`}
        </Button>
      </div>

      <div className="mx-auto space-y-4 py-5 md:mt-10 md:w-8/12">
        {/* 400 (earlier steps not done), 409 (pending payment, trial still active),
            502 (Paystack is down), 500, network, or no Paystack link (payError).
            401 and 403 ONBOARDING_REQUIRED are handled by the api instance. */}
        {errorMessage && (
          <p
            role="alert"
            className="rounded-xl bg-destructive/10 px-3 py-2 text-b2-medium text-destructive"
          >
            {errorMessage}
          </p>
        )}

        <div className="flex w-full justify-between">
          <Button
            variant="outline"
            size="lg"
            disabled={isBusy}
            onClick={() => navigate('/onboarding/step-three')}
          >
            Back
          </Button>
          <Button size="lg" disabled={isBusy} onClick={onPay}>
            {isStartingPayment
              ? 'Opening Paystack...'
              : payButtonLabel(selectedPlan)}
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

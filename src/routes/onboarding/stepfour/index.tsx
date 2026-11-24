import { parseApiError } from '@/api/api';
import { useChoosePlan } from '@/api/onboarding/onboarding';
import {
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

/**
 * The "Save 20%" badge, only on Yearly (as in the design).
 * Worked out against the monthly plan, so it stays right if prices change.
 */
function planBadge(plan: Plan, plans: Plan[]): string | null {
  if (plan.id !== 'yearly') return null;

  const monthlyPlan = plans.find((item) => item.id === 'monthly');
  if (!monthlyPlan) return null;

  const saving = 1 - monthlyCostKobo(plan) / monthlyPlan.priceKobo;
  const savingPercent = Math.round(saving * 100);
  if (savingPercent <= 0) return null;

  return `Save ${savingPercent}%`;
}

export default function StepFour() {
  const navigate = useNavigate();
  const {
    mutate: choosePlan,
    isPending: isSaving,
    error: saveError,
  } = useChoosePlan();

  const [selectedPlan, setSelectedPlan] = useState<PlanId>(DEFAULT_PLAN);

  function onfreetrial() {
    choosePlan(
      { plan: selectedPlan },
      {
        onSuccess: () => {
          navigate('/onboarding/success');
        },
      },
    );
  }

  function onContinue() {
    choosePlan(
      { plan: selectedPlan },
      {
        onSuccess: () => {
          navigate('/onboarding/success');
        },
        // Errors show in the banner above the buttons (from saveError)
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
        <Button variant={'outline'} onClick={onfreetrial}>
          Start 7 day free trial
        </Button>
      </div>

      <div className="mx-auto space-y-4 py-5 md:mt-20 md:w-8/12">
        {/* 400 (earlier steps not done), 409 (trial already over), 500, network.
            401 and 403 ONBOARDING_REQUIRED are handled by the api instance. */}
        {saveError && (
          <p
            role="alert"
            className="rounded-xl bg-destructive/10 px-3 py-2 text-b2-medium text-destructive"
          >
            {parseApiError(saveError).message}
          </p>
        )}

        <div className="flex w-full justify-between">
          <Button
            variant="outline"
            size="lg"
            disabled={isSaving}
            onClick={() => navigate('/onboarding/step-three')}
          >
            Back
          </Button>
          <Button size="lg" disabled={isSaving} onClick={onContinue}>
            {isSaving ? 'Starting...' : `Start ${TRIAL_DAYS}-day free trial`}
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

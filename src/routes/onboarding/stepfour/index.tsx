import { parseApiError } from '@/api/api';
import { useChoosePlan } from '@/api/onboarding/onboarding';
import {
  usePlans,
  useSubscription,
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

// type Plan = {
//   value: string;
//   title: string;
//   price: number;
//   unit: string;
//   description: string;
//   badge?: string; // optional, only Yearly has one
// };

// const PLANS: Plan[] = [
//   {
//     value: 'monthly',
//     title: 'Monthly',
//     price: 5000,
//     unit: 'month',
//     description: 'Pay as you go, cancel anytime',
//   },
//   {
//     value: 'six-months',
//     title: '6 months',
//     price: 27000,
//     unit: '6 months',
//     description: 'Works out to ₦4,500 a month',
//   },
//   {
//     value: 'yearly',
//     title: 'Yearly',
//     price: 48000,
//     unit: 'year',
//     description: 'Works out to ₦4,000 a month. Best value.',
//     badge: 'Save 20%',
//   },
// ];

const PERIOD_LABELS: Record<PlanId, string> = {
  monthly: 'month',
  six_months: '6 months',
  yearly: 'year',
};

const DEFAULT_PLAN: PlanId = 'yearly';

function monthlyCostKobo(plan: Plan): number {
  return Math.round(plan.priceKobo / plan.months);
}

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
    data: plansList,
    isPending: isLoadingPlans,
    isError: plansFailed,
    refetch: retryPlans,
  } = usePlans();
  const { data: subscriptionState } = useSubscription();
  const {
    mutate: choosePlan,
    isPending: isSaving,
    error: saveError,
  } = useChoosePlan();

  const [pickedPlan, setPickedPlan] = useState<PlanId | null>(null);

  const savedPlan = subscriptionState?.subscription?.plan;
  const selectedPlan = pickedPlan ?? savedPlan ?? DEFAULT_PLAN;

  const onContinue = () => {
    choosePlan(
      { plan: selectedPlan },
      {
        onSuccess: () => {
          navigate('/onboarding/success');
        },
        // Errors show in the banner below the cards (from saveError)
      },
    );
  };

  return (
    <div className=" space-y-5">
      <div className="md:w-8/12 mx-auto space-y-5">
        <StepProgress currentStep={4} totalSteps={4} label="Choose Your Plan" />
        <div className="flex items-center flex-col space-y-3">
          <h1 className=" text-center text-h2-bold md:text-d1-bold md:w-[75%]">
            Pick your plan
          </h1>
          <p className="text-center text-text-tertiary text-base md:w-[60%]">
            Every plan has every feature, Pay for longer and your monthly cost
            drops. Change or cancel any time.
          </p>
        </div>
      </div>

      {isLoadingPlans && (
        <div className="grid gap-6 md:grid-cols-3" aria-busy="true">
          {[1, 2, 3].map((placeholder) => (
            <div
              key={placeholder}
              className="h-52 animate-pulse rounded-2xl bg-background-card"
            />
          ))}
        </div>
      )}

      {plansFailed && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border-default p-8 text-center">
          <p className="text-text-secondary">
            We couldn&apos;t load the plans. Check your connection and try
            again.
          </p>
          <Button variant="outline" onClick={() => retryPlans()}>
            Try again
          </Button>
        </div>
      )}
      {/* 3. The plan cards */}
      {plansList && (
        <div
          role="radiogroup"
          aria-label="Plans"
          className="grid gap-6 md:grid-cols-3"
        >
          {plansList.plans.map((plan) => {
            const isSelected = plan.id === selectedPlan;
            const badge = planBadge(plan, plansList.plans);

            return (
              <button
                key={plan.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setPickedPlan(plan.id)}
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
      )}
      <div className="w-full">
        <Button variant={'outline'}>Start Free Trail</Button>
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
          <Button
            size="lg"
            disabled={!plansList || isSaving}
            onClick={onContinue}
          >
            {isSaving
              ? 'Starting...'
              : `Start ${plansList?.trialDays ?? 14}-day free trial`}
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

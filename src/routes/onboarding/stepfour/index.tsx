import { Button } from '@/components/ui/button';
import StepProgress from '@/components/ui/stepProgress';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

type Plan = {
  value: string;
  title: string;
  price: number;
  unit: string;
  description: string;
  badge?: string; // optional, only Yearly has one
};

const PLANS: Plan[] = [
  {
    value: 'monthly',
    title: 'Monthly',
    price: 5000,
    unit: 'month',
    description: 'Pay as you go, cancel anytime',
  },
  {
    value: 'six-months',
    title: '6 months',
    price: 27000,
    unit: '6 months',
    description: 'Works out to ₦4,500 a month',
  },
  {
    value: 'yearly',
    title: 'Yearly',
    price: 48000,
    unit: 'year',
    description: 'Works out to ₦4,000 a month. Best value.',
    badge: 'Save 20%',
  },
];

export default function StepFour() {
  const [plan, setPlan] = useState<string>('yearly');
  const navigate = useNavigate();
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
      <div className="grid gap-6 md:grid-cols-3 ">
        {PLANS.map((item) => {
          const isSelected = item.value === plan;

          return (
            <button
              key={item.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setPlan(item.value)}
              className={`rounded-2xl border p-8 text-left transition-colors ${
                isSelected
                  ? 'border-primary-active bg-primary-active'
                  : 'border-border-default bg-background-main hover:bg-background-card'
              }`}
            >
              {/* Title row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <p
                    className={`text-h5-medium ${
                      isSelected ? 'text-text-inverse' : 'text-text-primary'
                    }`}
                  >
                    {item.title}
                  </p>
                  {item.badge && (
                    <span className="rounded-full bg-primary-light px-2.5 py-1 text-b3-medium text-primary-active">
                      {item.badge}
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
                  className={`text-h3-semibold -md:text-h4-medium ${
                    isSelected ? 'text-text-inverse' : 'text-text-primary'
                  }`}
                >
                  ₦{item.price.toLocaleString()}
                </span>
                <span
                  className={`text-h4-medium ${
                    isSelected
                      ? 'text-text-secondary-inverse'
                      : 'text-text-secondary'
                  }`}
                >
                  / {item.unit}
                </span>
              </p>

              {/* Description */}
              <p
                className={`mt-4 text-base ${
                  isSelected
                    ? 'text-text-secondary-inverse'
                    : 'text-text-secondary'
                }`}
              >
                {item.description}
              </p>
            </button>
          );
        })}
      </div>
      <div className="flex w-full justify-between py-5 md:mt-20 md:w-8/12 mx-auto ">
        <Button
          variant={'outline'}
          size={'lg'}
          onClick={() => {
            navigate('/onboarding/step-three');
          }}
        >
          Back
        </Button>
        <Button
          size={'lg'}
          className={'self-end'}
          onClick={() => {
            navigate('/onboarding/step-four');
          }}
        >
          Continue {<ArrowRight />}
        </Button>
      </div>
    </div>
  );
}

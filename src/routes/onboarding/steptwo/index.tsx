import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import StepProgress from '@/components/ui/stepProgress';
import { ArrowRight, Store, Warehouse, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

type PlaceOption = {
  value: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

const PLACE_OPTIONS: PlaceOption[] = [
  {
    value: 'shop',
    title: 'Stall or Shop',
    description: 'Where you sell',
    icon: Store,
  },
  {
    value: 'warehouse',
    title: 'Warehouse',
    description: 'Where you store your stock',
    icon: Warehouse,
  },
];

export default function Steptwo() {
  const [placeType, setPlaceType] = useState<string>('shop');
  const navigate = useNavigate();
  return (
    <div className=" md:w-8/12 mx-auto space-y-5">
      <StepProgress currentStep={2} totalSteps={4} label="Your business" />
      <h1 className="text-h2-bold md:text-d1-bold md:w-[75%]">
        Where do you keep your goods
      </h1>
      <p className=" text-text-tertiary">
        Start with one place. You can add more stalls and warehouses any time
      </p>
      <div className="space-y-3">
        <p className="text-b1-medium text-base">Type of Place</p>
        <div className="grid gap-4 sm:grid-cols-2 mb-3">
          {PLACE_OPTIONS.map((option) => {
            const isSelected = option.value === placeType;
            const Icon = option.icon;

            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setPlaceType(option.value)}
                className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition-colors ${
                  isSelected
                    ? 'border-primary-base bg-primary-subtle'
                    : 'border-border-default bg-background-main hover:bg-background-card'
                }`}
              >
                {/* Icon box */}
                <div
                  className={`flex size-13 shrink-0 items-center justify-center rounded-xl ${
                    isSelected
                      ? 'bg-primary-base text-text-inverse'
                      : 'bg-secondary-base/15 text-secondary-base'
                  }`}
                >
                  <Icon className="size-6" strokeWidth={1.75} />
                </div>

                {/* Text */}
                <div className="flex-1">
                  <p className="text-h5-bold text-text-primary">
                    {option.title}
                  </p>
                  <p className="mt-0.5 text-b2-regular text-text-secondary">
                    {option.description}
                  </p>
                </div>

                {/* Radio circle */}
                {isSelected ? (
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-light">
                    <span className="size-3.5 rounded-full bg-primary-base" />
                  </span>
                ) : (
                  <span className="size-6 shrink-0 rounded-full border border-border-default" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3 mt-5 gap-4 grid md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="Location-name" className="text-base">
            Location Name
          </FieldLabel>
          <Input
            id="Location-name"
            type="text"
            placeholder="Jimmy Electronic Shop 4"
            className="h-12 bg-background-main border border-border-default"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="AddressOrLandmark" className="text-base">
            Address or Landmark
          </FieldLabel>
          <Input
            id="AddressOrLandmark"
            type="text"
            placeholder="Line 4, behind the gate"
            className="h-12 bg-background-main border border-border-default"
          />
        </Field>
      </div>
      <div className="flex w-full justify-between mt-10">
        <Button
          variant={'outline'}
          size={'lg'}
          onClick={() => {
            navigate('/onboarding/step-one');
          }}
        >
          Back
        </Button>
        <Button
          size={'lg'}
          className={'self-end'}
          onClick={() => {
            navigate('/onboarding/step-three');
          }}
        >
          Continue {<ArrowRight />}
        </Button>
      </div>
    </div>
  );
}

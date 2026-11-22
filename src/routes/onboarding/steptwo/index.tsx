import { parseApiError } from '@/api/api';
import {
  useOnboardingState,
  useSaveLocation,
} from '@/api/onboarding/onboarding';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import StepProgress from '@/components/ui/stepProgress';
import { locationStepSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';

import { ArrowRight, Store, Warehouse, type LucideIcon } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import type z from 'zod';

type LocationValues = z.infer<typeof locationStepSchema>;

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

const FIELDS: (keyof LocationValues)[] = ['type', 'name', 'address'];

const EMPTY_VALUES: LocationValues = {
  type: 'shop',
  name: '',
  address: '',
};

const inputClass = 'h-12 border border-border-default bg-background-main';

export default function Steptwo() {
  const navigate = useNavigate();
  const { data: savedProgress } = useOnboardingState();
  const { mutate: saveLocation, isPending } = useSaveLocation();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<LocationValues>({
    resolver: zodResolver(locationStepSchema),
    mode: 'onTouched', // validate after leaving a field, then on every change
    defaultValues: EMPTY_VALUES,
  });

  // Coming back to this step? Fill the form with what was saved before.
  const savedLocation = savedProgress?.location;
  useEffect(() => {
    if (!savedLocation) return;

    reset({
      type: savedLocation.type,
      name: savedLocation.name,
      address: savedLocation.address,
    });
  }, [savedLocation, reset]);

  const onSubmit = (values: LocationValues) => {
    clearErrors('root');

    saveLocation(values, {
      onSuccess: () => {
        navigate('/onboarding/step-three');
      },
      onError: (err) => {
        const { message, fieldErrors } = parseApiError(err);
        let mapped = false;

        // 400 validation → under each field
        for (const [name, msg] of Object.entries(fieldErrors)) {
          if (FIELDS.includes(name as keyof LocationValues)) {
            setError(name as keyof LocationValues, {
              type: 'server',
              message: msg,
            });
            mapped = true;
          }
        }

        // 404, 429, 500, network → banner
        // (401 and 403 ONBOARDING_REQUIRED are handled by the api instance:
        // it sends the user to login or back to step one)
        if (!mapped) setError('root.server', { type: 'server', message });
      },
    });
  };

  return (
    <div className=" md:w-8/12 mx-auto space-y-5">
      <StepProgress currentStep={2} totalSteps={4} label="Your business" />
      <h1 className="text-h2-bold md:text-d1-bold md:w-[75%]">
        Where do you keep your goods
      </h1>
      <p className=" text-text-tertiary">
        Start with one place. You can add more stalls and warehouses any time
      </p>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {/* The place cards are buttons, not an <input>,
            so they are connected with Controller instead of register */}
        <Controller
          control={control}
          name="type"
          render={({ field, fieldState }) => (
            <div className="space-y-3">
              <p id="place-type-label" className="text-b1-medium">
                Type of Place
              </p>

              <div
                role="radiogroup"
                aria-labelledby="place-type-label"
                className="grid gap-4 sm:grid-cols-2"
              >
                {PLACE_OPTIONS.map((option) => {
                  const isSelected = option.value === field.value;
                  const Icon = option.icon;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => field.onChange(option.value)}
                      className={cn(
                        'flex items-center gap-4 rounded-2xl border p-4 text-left transition-colors',
                        isSelected
                          ? 'border-primary-base bg-primary-subtle'
                          : 'border-border-default bg-background-main hover:bg-background-card',
                      )}
                    >
                      {/* Icon box */}
                      <div
                        className={cn(
                          'flex size-13 shrink-0 items-center justify-center rounded-xl',
                          isSelected
                            ? 'bg-primary-base text-text-inverse'
                            : 'bg-secondary-base/15 text-secondary-base',
                        )}
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

              <FieldError errors={[fieldState.error]} />
            </div>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="location-name" className="text-base">
              Location Name
            </FieldLabel>
            <Input
              id="location-name"
              type="text"
              placeholder="Jimmy Electronic Shop 4"
              aria-invalid={!!errors.name}
              className={inputClass}
              {...register('name')}
            />
            <FieldError errors={[errors.name]} />
          </Field>

          <Field data-invalid={!!errors.address}>
            <FieldLabel htmlFor="location-address" className="text-base">
              Address or Landmark
            </FieldLabel>
            <Input
              id="location-address"
              type="text"
              placeholder="Line 4, behind the gate"
              aria-invalid={!!errors.address}
              className={inputClass}
              {...register('address')}
            />
            <FieldError errors={[errors.address]} />
          </Field>
        </div>

        {errors.root?.server && (
          <p
            role="alert"
            className="rounded-xl bg-destructive/10 px-3 py-2 text-b2-medium text-destructive"
          >
            {errors.root.server.message}
          </p>
        )}

        <div className="mt-10 flex w-full justify-between">
          {/* type="button" so Back never submits the form */}
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => navigate('/onboarding/step-one')}
          >
            Back
          </Button>
          <Button type="submit" size="lg" disabled={isPending}>
            {isPending ? 'Saving...' : 'Continue'}
            <ArrowRight />
          </Button>
        </div>
      </form>
    </div>
  );
}

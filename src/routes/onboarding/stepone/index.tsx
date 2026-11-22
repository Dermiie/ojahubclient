import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CategorySelect from '@/components/ui/categorySelect';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import StepProgress from '@/components/ui/stepProgress';
import { parseApiError } from '@/api/api';
import { businessStepSchema } from '@/lib/validations';
import {
  BUSINESS_CATEGORIES,
  useOnboardingState,
  useSaveBusiness,
} from '@/api/onboarding/onboarding';

type BusinessValues = z.infer<typeof businessStepSchema>;

const FIELDS: (keyof BusinessValues)[] = [
  'name',
  'category',
  'businessLocation',
];

const EMPTY_VALUES: BusinessValues = {
  name: '',
  category: 'Fabrics',
  businessLocation: '',
};

const inputClass = 'h-12 border border-border-default bg-background-main';

export default function Stepone() {
  const navigate = useNavigate();
  const { data: savedProgress } = useOnboardingState();
  const { mutate: saveBusiness, isPending } = useSaveBusiness();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<BusinessValues>({
    resolver: zodResolver(businessStepSchema),
    mode: 'onTouched',
    defaultValues: EMPTY_VALUES,
  });

  // Coming back to this step? Fill the form with what was saved before.
  const savedBusiness = savedProgress?.business;
  useEffect(() => {
    if (!savedBusiness) return;

    reset({
      name: savedBusiness.name,
      category: savedBusiness.category ?? EMPTY_VALUES.category,
      businessLocation: savedBusiness.businessLocation ?? '',
    });
  }, [savedBusiness, reset]);

  const onSubmit = (formData: BusinessValues) => {
    clearErrors('root');

    saveBusiness(formData, {
      // useSaveBusiness has already put the businessId on the cached user,
      // so the step-two guard lets the user through.
      onSuccess: () => {
        navigate('/onboarding/step-two');
      },
      onError: (err) => {
        const { message, fieldErrors } = parseApiError(err);
        let mapped = false;

        // 400 validation → under each field
        for (const [name, msg] of Object.entries(fieldErrors)) {
          if (FIELDS.includes(name as keyof BusinessValues)) {
            setError(name as keyof BusinessValues, {
              type: 'server',
              message: msg,
            });
            mapped = true;
          }
        }

        // 404, 429, 500, network → banner
        // (401 is handled by the api instance: it sends the user to login)
        if (!mapped) setError('root.server', { type: 'server', message });
      },
    });
  };

  return (
    <div className="mx-auto space-y-5 md:w-8/12">
      <StepProgress currentStep={1} totalSteps={4} label="Your business" />

      <h1 className="text-h2-bold md:w-3/4 md:text-d1-bold">
        Tell us about your business
      </h1>
      <p className="text-text-tertiary">
        This appears on every invoice you send. Type below and watch it update
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-3 space-y-3"
      >
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="business-name" className="text-base">
            Business Name
          </FieldLabel>
          <Input
            id="business-name"
            type="text"
            placeholder="Jimmy Electronic"
            aria-invalid={!!errors.name}
            className={inputClass}
            {...register('name')}
          />
          <FieldError errors={[errors.name]} />
        </Field>

        <Controller
          control={control}
          name="category"
          render={({ field, fieldState }) => (
            <div>
              <CategorySelect
                label="What do you sell?"
                options={[...BUSINESS_CATEGORIES]}
                value={field.value}
                onChange={field.onChange}
              />
              <FieldError className="mt-2" errors={[fieldState.error]} />
            </div>
          )}
        />

        <Field data-invalid={!!errors.businessLocation}>
          <FieldLabel htmlFor="business-location" className="text-base">
            Business Location
          </FieldLabel>
          <Input
            id="business-location"
            type="text"
            placeholder="Balogun market, Lagos"
            aria-invalid={!!errors.businessLocation}
            className={inputClass}
            {...register('businessLocation')}
          />
          <FieldError errors={[errors.businessLocation]} />
        </Field>

        {errors.root?.server && (
          <p
            role="alert"
            className="rounded-xl bg-destructive/10 px-3 py-2 text-b2-medium text-destructive"
          >
            {errors.root.server.message}
          </p>
        )}

        <div className="flex w-full justify-end">
          <Button type="submit" size="lg" disabled={isPending}>
            {isPending ? 'Saving...' : 'Continue'}
            <ArrowRight />
          </Button>
        </div>
      </form>
    </div>
  );
}

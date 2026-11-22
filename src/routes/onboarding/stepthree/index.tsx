import { parseApiError } from '@/api/api';
import {
  PRODUCT_UNITS,
  useOnboardingState,
  useSaveProduct,
  useSkipProduct,
  type ProductInput,
  type ProductUnit,
} from '@/api/onboarding/onboarding';
import { Button } from '@/components/ui/button';
import CategorySelect from '@/components/ui/categorySelect';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import StepProgress from '@/components/ui/stepProgress';
import { koboToNaira, nairaToKobo, parseNaira } from '@/lib/money';
import { productStepSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router';
import type z from 'zod';

type ProductValues = z.infer<typeof productStepSchema>;

// The API needs lowercase units; these are the words shown on screen.
const UNIT_LABELS: Record<ProductUnit, { one: string; many: string }> = {
  piece: { one: 'Piece', many: 'Pieces' },
  bundle: { one: 'Bundle', many: 'Bundles' },
  carton: { one: 'Carton', many: 'Cartons' },
  pack: { one: 'Pack', many: 'Packs' },
  yard: { one: 'Yard', many: 'Yards' },
  bag: { one: 'Bag', many: 'Bags' },
};

// The server names some fields differently from this form.
// Server field → form field, used to show server errors under the right input.
const SERVER_FIELD_TO_FORM_FIELD: Record<string, keyof ProductValues> = {
  name: 'name',
  unit: 'unit',
  priceKobo: 'price',
  quantity: 'quantity',
};

const EMPTY_VALUES: ProductValues = {
  name: '',
  unit: 'piece',
  price: '',
  quantity: '',
};

const inputClass = 'h-12 border border-border-default bg-background-main';

export default function StepThree() {
  const navigate = useNavigate();
  const { data: savedProgress } = useOnboardingState();
  const { mutate: saveProduct, isPending: isSaving } = useSaveProduct();
  const { mutate: skipProduct, isPending: isSkipping } = useSkipProduct();
  const isBusy = isSaving || isSkipping;

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ProductValues>({
    resolver: zodResolver(productStepSchema),
    mode: 'onTouched',
    defaultValues: EMPTY_VALUES,
  });

  const selectedUnit = useWatch({ control, name: 'unit' });
  const unitLabel = UNIT_LABELS[selectedUnit];

  // Coming back to this step? Fill the form with what was saved before.
  const savedProduct = savedProgress?.product;
  useEffect(() => {
    if (!savedProduct) return;

    reset({
      name: savedProduct.name,
      unit: savedProduct.unit,
      price:
        savedProduct.priceKobo === null
          ? ''
          : String(koboToNaira(savedProduct.priceKobo)),
      quantity:
        savedProduct.quantity === null ? '' : String(savedProduct.quantity),
    });
  }, [savedProduct, reset]);

  const showServerError = (err: unknown) => {
    const { message, fieldErrors } = parseApiError(err);
    let mapped = false;

    // 400 validation → under each field
    for (const [serverField, msg] of Object.entries(fieldErrors)) {
      const formField = SERVER_FIELD_TO_FORM_FIELD[serverField];
      if (formField) {
        setError(formField, { type: 'server', message: msg });
        mapped = true;
      }
    }

    // Everything else → banner. This includes the 403s
    // ("Save your business details first", "Save your first location first")
    // because PUT /product sends them without details.code,
    // so the api instance does NOT redirect for them.
    if (!mapped) setError('root.server', { type: 'server', message });
  };

  const onSubmit = (values: ProductValues) => {
    clearErrors('root');

    const priceNaira = parseNaira(values.price)!;

    // Shape the body the backend expects
    const payload: ProductInput = {
      name: values.name,
      unit: values.unit,
      priceKobo: nairaToKobo(priceNaira), // "55,000" → 5500000
      quantity: Number(values.quantity), // "70" → 70
    };

    saveProduct(payload, {
      onSuccess: () => {
        navigate('/onboarding/step-four');
      },
      onError: showServerError,
    });
  };

  const onSkip = () => {
    clearErrors();

    skipProduct(undefined, {
      onSuccess: () => {
        navigate('/onboarding/step-four');
      },
      onError: showServerError,
    });
  };

  return (
    <div className=" md:w-8/12 mx-auto space-y-5">
      <StepProgress currentStep={3} totalSteps={4} label="Your business" />
      <h1 className="text-h2-bold md:text-d1-bold md:w-[75%]">
        Add your best seller
      </h1>
      <p className=" text-text-tertiary">
        One product to start. wholesale prices can come later.
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-3 space-y-3"
      >
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="product-name" className="text-base">
            Product Name
          </FieldLabel>
          <Input
            id="product-name"
            type="text"
            placeholder="Lace fabric"
            aria-invalid={!!errors.name}
            className={inputClass}
            {...register('name')}
          />
          <FieldError errors={[errors.name]} />
        </Field>

        {/* CategorySelect is a custom picker, not an <input>,
            so it is connected with Controller instead of register */}
        <Controller
          control={control}
          name="unit"
          render={({ field, fieldState }) => (
            <div>
              <CategorySelect
                label="Sold By"
                options={[...PRODUCT_UNITS]}
                value={field.value}
                onChange={field.onChange}
                getOptionLabel={(unit) => UNIT_LABELS[unit as ProductUnit].one}
              />
              <FieldError className="mt-2" errors={[fieldState.error]} />
            </div>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <Field data-invalid={!!errors.price}>
            <FieldLabel htmlFor="product-price" className="text-base">
              Price per {unitLabel.one} (₦)
            </FieldLabel>
            <Input
              id="product-price"
              type="text"
              inputMode="decimal" // number keypad on phones, still allows commas
              placeholder="55,000"
              aria-invalid={!!errors.price}
              className={inputClass}
              {...register('price')}
            />
            <FieldError errors={[errors.price]} />
          </Field>

          <Field data-invalid={!!errors.quantity}>
            <FieldLabel htmlFor="product-quantity" className="text-base">
              {unitLabel.many} in store
            </FieldLabel>
            <Input
              id="product-quantity"
              type="text"
              inputMode="numeric" // number keypad on phones
              placeholder="70"
              aria-invalid={!!errors.quantity}
              className={inputClass}
              {...register('quantity')}
            />
            <FieldError errors={[errors.quantity]} />
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

        <div className="mt-10 flex w-full items-center justify-between gap-3">
          {/* type="button" so Back and Skip never submit the form */}
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={isBusy}
            onClick={() => navigate('/onboarding/step-two')}
          >
            Back
          </Button>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="lg"
              disabled={isBusy}
              onClick={onSkip}
            >
              {isSkipping ? 'Skipping...' : 'Skip for now'}
            </Button>
            <Button type="submit" size="lg" disabled={isBusy}>
              {isSaving ? 'Saving...' : 'Continue'}
              <ArrowRight />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

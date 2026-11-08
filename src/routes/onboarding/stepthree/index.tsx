import { Button } from '@/components/ui/button';
import CategorySelect from '@/components/ui/categorySelect';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import StepProgress from '@/components/ui/stepProgress';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

const ITEMS = ['Piece', 'Bundle', 'Carton', 'Pack', 'Yard', 'Bag'];

export default function StepThree() {
  const [items, setItems] = useState<string>('Piece');
  const navigate = useNavigate();
  return (
    <div className=" md:w-8/12 mx-auto space-y-5">
      <StepProgress currentStep={3} totalSteps={4} label="Your business" />
      <h1 className="text-h2-bold md:text-d1-bold md:w-[75%]">
        Add your best seller
      </h1>
      <p className=" text-text-tertiary">
        One product to start. wholesale prices can come later.
      </p>
      <div className="space-y-3 mt-3">
        <Field>
          <FieldLabel htmlFor="Business-name" className="text-base">
            Business Name
          </FieldLabel>
          <Input
            id="Business-name"
            type="text"
            placeholder="Jimmy Electronic"
            className="h-12 bg-background-main border border-border-default"
          />
        </Field>

        <CategorySelect
          label="Sold By"
          options={ITEMS}
          value={items}
          onChange={setItems}
        />

        <div className="flex gap-4">
          <Field>
            <FieldLabel htmlFor="price" className="text-base">
              Price per {items}
            </FieldLabel>
            <Input
              id="price"
              type="text"
              className="h-12 bg-background-main border border-border-default"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="amount" className="text-base">
              {items + 's'} in store
            </FieldLabel>
            <Input
              id="amount"
              type="text"
              placeholder=""
              className="h-12 bg-background-main border border-border-default"
            />
          </Field>
        </div>
        <div className="flex w-full justify-between mt-10">
          <Button
            variant={'outline'}
            size={'lg'}
            onClick={() => {
              navigate('/onboarding/step-two');
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
    </div>
  );
}

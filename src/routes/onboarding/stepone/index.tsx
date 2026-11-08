import { Button } from '@/components/ui/button';
import CategorySelect from '@/components/ui/categorySelect';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import StepProgress from '@/components/ui/stepProgress';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

const CATEGORIES = [
  'Fabrics',
  'Electronics',
  'Phones',
  'Provision',
  'Cosmetics',
  'Building materials',
  'Others',
];

export default function Stepone() {
  const [category, setCategory] = useState<string>('Fabrics');
  const navigate = useNavigate();
  return (
    <div className=" md:w-8/12 mx-auto space-y-5">
      <StepProgress currentStep={1} totalSteps={4} label="Your business" />
      <h1 className="text-h2-bold md:text-d1-bold md:w-[75%]">
        Tell us about your business
      </h1>
      <p className=" text-text-tertiary">
        This appears on every invoice you send. Type below and watch it update
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
          label="What do you sell?"
          options={CATEGORIES}
          value={category}
          onChange={setCategory}
        />

        <Field>
          <FieldLabel
            htmlFor="Business-name"
            className="text-b1-medium text-base"
          >
            Business Location
          </FieldLabel>
          <Input
            id="Business-name"
            type="text"
            placeholder="Balogun market, Lagos"
            className="h-12 bg-background-main border border-border-default"
          />
        </Field>

        <div className="flex w-full justify-end">
          <Button
            size={'lg'}
            className={'self-end'}
            onClick={() => {
              navigate('/onboarding/step-two');
            }}
          >
            Continue {<ArrowRight />}
          </Button>
        </div>
      </div>
    </div>
  );
}

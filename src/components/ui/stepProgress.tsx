type StepProgressProps = {
  currentStep: number; // starts at 1
  totalSteps: number;
  label?: string;
};

export default function StepProgress({
  currentStep,
  totalSteps,
  label,
}: StepProgressProps) {
  // Makes an array like [1, 2, 3, 4] so we can map over it
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="w-full">
      <div className="flex gap-6">
        {steps.map((step) => (
          <div
            key={step}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              step <= currentStep ? 'bg-primary-active' : 'bg-primary-light'
            }`}
          />
        ))}
      </div>

      <p className="mt-4 text-center text-b2-regular text-text-secondary">
        Step {currentStep} of {totalSteps} {label}
      </p>
    </div>
  );
}

// Example usage:
// <StepProgress currentStep={1} totalSteps={4} label="Your business" />

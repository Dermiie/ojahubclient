type CategorySelectProps = {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

export default function CategorySelect({
  label,
  options,
  value,
  onChange,
}: CategorySelectProps) {
  return (
    <div>
      <p className="mb-3 text-base font-medium ">{label}</p>

      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const isSelected = option === value;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`flex min-w-[130px] items-center justify-center gap-2 rounded-full border px-6 py-2 text-base transition-colors ${
                isSelected
                  ? 'border-primary-active bg-primary-active text-white'
                  : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
              }`}
            >
              {isSelected && (
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    d="M5 13l4 4L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

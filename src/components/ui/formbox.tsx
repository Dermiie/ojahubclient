import { cn } from "@/lib/utils";
import {
  Controller,
  type Control,
  type FieldError as FieldErrorType,
  type FieldValues,
  type Path,
  type RegisterOptions,
  type UseFormRegister,
} from "react-hook-form";
import { Textarea } from "./textarea";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./input-otp";
import { Input } from "./input";
import { Eye, EyeOff } from "lucide-react";
import { FieldLegend, FieldSet, Field, FieldLabel, FieldError } from "./field";

export type SelectOption = {
  name: string;
  id: string | number;
  description?: string;
};

type FormFieldProps<T extends FieldValues> = {
  label: string;
  type: string;
  id: string;
  register: UseFormRegister<T>;
  errors?: FieldErrorType | undefined;
  placeholder?: string;
  showPassword?: boolean;
  setShowPassword?: (
    showPassword: boolean | ((prev: boolean) => boolean),
  ) => void;
  name: Path<T>;
  className?: string;
  disabled?: boolean;
  defaultValue?: string | Date | number | boolean;
  inputType: "input" | "textarea" | "select" | "switch" | "radio" | "otp";
  registerOptions?: RegisterOptions<T>;
  control?: Control<T>;
  options?: SelectOption[];
  styles?: string;
};

export default function Formbox<T extends FieldValues>({
  label,
  type,
  id,
  register,
  errors,
  placeholder,
  showPassword,
  setShowPassword,
  name,
  className,
  disabled,
  defaultValue,
  inputType,
  registerOptions,
  control,
  styles,
}: FormFieldProps<T>) {
  const togglePassword = () => setShowPassword?.((prev: boolean) => !prev);
  const renderField = () => {
    switch (inputType ?? type) {
      case "textarea":
        return (
          <Textarea
            rows={4}
            placeholder={placeholder}
            id={id}
            {...register(name, registerOptions)}
            disabled={disabled}
          />
        );
      case "otp":
        return (
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <InputOTP
                maxLength={6}
                value={field.value ?? ""}
                onChange={field.onChange}
                containerClassName="w-full"
                className={cn(errors ? `aria-invalid:border-destructive` : "")}
              >
                <InputOTPGroup className="w-full flex gap-2">
                  <InputOTPSlot
                    index={0}
                    className="flex-1 h-14 rounded-md border text-lg"
                  />
                  <InputOTPSlot
                    index={1}
                    className="flex-1 h-14 rounded-md border text-lg"
                  />
                  <InputOTPSlot
                    index={2}
                    className="flex-1 h-14 rounded-md border text-lg"
                  />
                  <InputOTPSlot
                    index={3}
                    className="flex-1 h-14 rounded-md border text-lg"
                  />
                  <InputOTPSlot
                    index={4}
                    className="flex-1 h-14 rounded-md border text-lg"
                  />
                  <InputOTPSlot
                    index={5}
                    className="flex-1 h-14 rounded-md border text-lg"
                  />
                </InputOTPGroup>
              </InputOTP>
            )}
          />
        );
      default:
        return (
          <div className="relative">
            <Input
              type={showPassword ? "text" : type}
              placeholder={placeholder}
              className={cn(
                "focus:outline-blue-500 focus:ring-blue-500 h-[56px] border",
                styles,
                errors ? "border-red-500" : "",
              )}
              id={id}
              {...register(name, registerOptions)}
              disabled={disabled}
              defaultValue={
                defaultValue instanceof Date
                  ? defaultValue.toISOString().split("T")[0]
                  : typeof defaultValue === "boolean"
                    ? String(defaultValue)
                    : defaultValue
              }
            />
            {type === "password" && (
              <button
                type="button"
                aria-label={showPassword ? "hide passwoerd" : "show password"}
                onClick={togglePassword}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            )}
          </div>
        );
    }
  };

  return (
    <div className={`${className}`}>
      <FieldSet>
        <FieldLegend className="w-full relative">
          <Field>
            <FieldLabel
              htmlFor={id}
              className={cn("text-sm", errors ? "text-red-500" : "")}
            >
              {label}
            </FieldLabel>
            {renderField()}
          </Field>
        </FieldLegend>
      </FieldSet>
      {errors?.message && (
        <FieldError className="text-xs text-destructive">
          {String(errors?.message)}
        </FieldError>
      )}
    </div>
  );
}

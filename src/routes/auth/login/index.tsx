import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import Actionbtn from "@/components/ui/action-btn";
import { useForm } from "react-hook-form";
import Formbox from "@/components/ui/formbox";
import { loginSchema } from "@/lib/validations";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onFormSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <div className="w-full max-w-[500px] mx-auto">
      <div className="mb-8">
        <h1 className="text-[30px] leading-[1] font-bold text-[#202B28] md:text-[42px]">
          Welcome back
        </h1>
        <p className="mt-2 text-[13px] leading-[1] font-medium text-[#D3D6D4]">
          Log in to see today's sales and payments.
        </p>
      </div>

      <form
        className="flex flex-col space-y-5"
        onSubmit={handleSubmit(onFormSubmit)}
      >
        <Formbox
          className="[&>fieldset>legend>div>label]:text-[12.89px] [&>fieldset>legend>div>label]:font-semibold"
          label="Phone number or email"
          type="email"
          inputType="input"
          id="email"
          register={register}
          name="email"
          placeholder="Phone number or email"
          errors={errors?.email}
          styles="h-[43px] rounded-[14.32px] border-[#D1D1D1] px-[10.74px] text-[12.89px] font-medium leading-[1] md:h-[56px]"
        />
        {/* <div>
          <label className="block mb-2 text-[#258B55]">
            Phone number or email
          </label>
          <input
            type="text"
            placeholder="Phone number or email"
            className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-green-600"
          />
        </div> */}

        <div>
          <div className="mb-2 max-md:mb-[7.16px] flex items-center justify-between">
            <label className="text-[#258B55] max-md:text-[12.89px] max-md:leading-[17px] max-md:font-semibold">
              Password
            </label>

            <a
              href="/auth/forgot-password"
              className="text-sm font-medium text-[#258B55] hover:underline max-md:text-[12.89px] max-md:leading-[17px] max-md:font-semibold"
            >
              Forgot password?
            </a>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              {...register("password")}
              className="w-full rounded-xl border border-gray-300 p-4 pr-16 outline-none focus:border-green-600 max-md:h-[43px] max-md:rounded-[14.32px] max-md:border-[1.43px] max-md:border-[#1C5E3A] max-md:px-[10.74px] max-md:py-0 max-md:pr-[38px] max-md:text-[12.89px] max-md:placeholder:text-[#95A19C]"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 max-md:right-[10.74px]"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="keepLoggedIn"
            className="h-4 w-4 accent-[#258B55]"
          />
          <label
            htmlFor="keepLoggedIn"
            className="text-[12.89px] leading-[1] font-medium text-[#D3D6D4]"
          >
            Keep me logged in on this computer
          </label>
        </div>

        <Actionbtn
          type="submit"
          text="Log in"
          classname="w-full h-[44px] rounded-[60px] bg-[#2E8B57] px-[10px] py-[12px] text-[16px] leading-[1] font-semibold text-white hover:bg-[#2E8B57]/90 max-md:!mt-30 md:h-[56px] md:text-[18px] md:font-bold"
        />

        <button
          type="button"
          className="flex h-[44px] w-full items-center justify-center gap-[10px] rounded-[60px] border border-[#D1D1D1] bg-white px-[10px] py-[12px] text-[16px] leading-[1] font-semibold text-[#1F2A24] hover:bg-gray-50 md:h-[56px] md:text-[18px]"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.73 7.18l7.65 5.93c4.46-4.12 7.12-10.18 7.12-17.58Z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a24 24 0 0 0 0 21.56l7.98-6.19Z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.9-5.87l-7.65-5.93c-2.13 1.43-4.85 2.28-8.25 2.28-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 43.62 14.62 48 24 48Z"
            />
          </svg>
          Sign in with Google
        </button>

        {/* <button
          type="submit"
          className="w-full rounded-xl bg-[#258B55] p-4 font-semibold text-white"
        >
          Log in
        </button> */}

        <p className="mt-6 max-md:relative max-md:top-[-8px] text-center text-sm text-gray-500">
          New to OjaHub?{" "}
          <button
            type="button"
            onClick={() => navigate("/auth/register")}
            className="font-medium text-[#258B55] hover:underline"
          >
            Create an account
          </button>
        </p>
      </form>
    </div>
  );
}

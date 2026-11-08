import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="w-full max-w-[520px] mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#202B28]">Welcome back</h1>
        <p className="mt-2 text-gray-500">
          Log in to see today's sales and payments.
        </p>
      </div>

      <form className="space-y-5">
        <div>
          <label className="block mb-2">Phone number or email</label>
          <input
            type="text"
            placeholder="Enter your phone number or email"
            className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-green-600"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label>Password</label>
            <a
              href="/auth/forgot-password"
              className="text-sm font-medium text-[#258B55] hover:underline"
            >
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-gray-300 p-4 pr-16 outline-none focus:border-green-600"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
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
          <label htmlFor="keepLoggedIn" className="text-sm text-gray-600">
            Keep me logged in
          </label>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-[#258B55] p-4 font-semibold text-white"
        >
          Log in
        </button>

        <p className="mt-6 text-center text-sm text-gray-500">
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

import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";
import desktopLogo from "@/assets/logo/Logo-forgot password.svg";
import forgotPasswordIcon from "@/assets/logo/forgot password icon.svg";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      alert("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      alert("Please enter a valid email address.");
      return;
    }

    navigate("/auth/verify?flow=forgot-password", {
      state: { email: trimmedEmail },
    });
  };

  return (
    <div className="relative min-h-screen w-full bg-white px-6 py-6 md:p-0">
      {/* Header */}
      <header className="flex items-center justify-between md:absolute md:left-0 md:right-0 md:top-0 md:px-[4vw] md:pt-[4px]">
        {/* Desktop logo */}
        <Link to="/" aria-label="Go to home page" className="hidden md:block">
          <img
            src={desktopLogo}
            alt="OjaHub"
            className="h-[29px] w-[78px] object-contain"
          />
        </Link>

        {/* Desktop back button */}
        <button
          type="button"
          onClick={() => navigate("/auth/login")}
          className="hidden items-center gap-[4px] rounded-full bg-[#E3E7E5] px-[8px] py-[4px] text-[11px] leading-none text-[#1F2A24] md:flex"
        >
          <ChevronLeft size={10} />
          Back to login
        </button>

        <button
          type="button"
          onClick={() => navigate("/auth/login")}
          className="flex items-center gap-1 text-sm text-[#26332D] md:hidden"
        >
          <ChevronLeft size={18} />
          Back
        </button>
      </header>

      {/* Form area */}
      <div className="flex min-h-[calc(100vh-100px)] flex-col md:min-h-screen md:items-center md:justify-center">
        <div className="mx-auto flex w-full max-w-[500px] flex-1 flex-col justify-between md:flex-none md:[zoom:0.7]">
          <div className="mt-8 flex flex-1 flex-col md:mt-0 md:flex-none">
            {/* Lock icon */}
            <img
              src={forgotPasswordIcon}
              alt=""
              className="mb-4 h-[68px] w-[68px] object-contain md:mb-6 md:h-[90px] md:w-[90px]"
            />

            <h1 className="text-2xl font-bold text-[#26332D] md:text-[32px]">
              Forgot your Password?
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-gray-500 md:mt-3 md:max-w-[440px] md:text-[15px] md:text-[#4B554F]">
              You forgot your password, no wahala, enter the email address on
              your account below and a code will be sent to you.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-6 flex flex-1 flex-col md:flex-none"
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[#1F2A24] md:mb-3 md:text-[18px]"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email address"
                  className="w-full rounded-[18px] border border-gray-300 px-5 py-3 text-sm outline-none focus:border-[#258B55] focus:ring-1 focus:ring-[#258B55] md:h-[54px] md:text-[18px]"
                />
              </div>

              <button
                type="submit"
                className="mt-auto w-full rounded-full bg-[#2E8B57] py-3 font-semibold text-white md:mt-[50px] md:h-[54px] md:py-0 md:text-[18px] md:font-bold"
              >
                Send reset code
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500 md:mt-7 md:text-[15px]">
            Remember?{" "}
            <button
              type="button"
              onClick={() => navigate("/auth/login")}
              className="font-semibold text-[#258B55] hover:underline"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

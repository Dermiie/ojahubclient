import { useState } from "react";
import { useNavigate } from "react-router";
import { LockKeyhole, ChevronLeft } from "lucide-react";
import desktopLogo from "@/assets/logo/Logo-forgot password.svg";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (
    event: Parameters<NonNullable<React.ComponentProps<"form">["onSubmit"]>>[0],
  ) => {
    event.preventDefault();

    if (!phoneNumber.trim()) {
      alert("Please enter your phone number.");
      return;
    }

    navigate("/auth/verify?flow=forgot-password", {
      state: {
        phoneNumber: `+234${phoneNumber}`,
      },
    });
  };

  return (
    <div className="min-h-screen w-full bg-white px-6 py-6 md:px-12 md:py-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <img
          src={desktopLogo}
          alt="OjaHub"
          className="hidden md:block w-[80px] h-auto object-contain"
        />

        <button
          type="button"
          onClick={() => navigate("/auth/login")}
          className="hidden md:block rounded-full bg-[#E8F0EC] px-4 py-2 text-sm text-[#26332D]"
        >
          ‹ Back to login
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
      <div className="mx-auto flex min-h-[calc(100vh-100px)] w-full max-w-[500px] flex-col justify-between md:justify-center">
        <div className="mt-8 flex flex-1 flex-col md:mt-0 md:flex-none">
          {/* Lock icon */}
          <div className="mb-4 flex h-[90px] w-[90px] items-center justify-center rounded-2xl bg-[#E8F5EC]">
            <LockKeyhole size={32} className="text-[#258B55]" />
          </div>

          <h1 className="text-2xl font-bold text-[#26332D]">
            Forgot your Password?
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            You forgot your password, na wahala, enter the phone number on your
            account below and a code will be sent to you.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-1 flex-col">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Phone number
              </label>

              <div className="flex overflow-hidden rounded-xl border border-gray-300">
                <span className="border-r border-gray-300 px-3 py-3 text-sm">
                  NG +234
                </span>

                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  placeholder="803 000 0000"
                  className="min-w-0 flex-1 px-3 py-3 text-sm outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-auto w-full rounded-full bg-[#258B55] py-3 font-semibold text-white"
            >
              Send reset code
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500 md:mt-6">
          Remember?{" "}
          <button
            type="button"
            onClick={() => navigate("/auth/login")}
            className="font-medium text-[#258B55] hover:underline"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}

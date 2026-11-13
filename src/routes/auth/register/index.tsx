import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import Actionbtn from "@/components/ui/action-btn";
import googleLogo from "@/assets/logo/google-logo.svg";

export default function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;

    if (!fullName.trim() || !phoneNumber.trim() || !email.trim()) {
      alert("Please complete all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      alert("Your password must contain at least 8 characters.");
      return;
    }

    navigate("/auth/verify?flow=register", {
      state: { email },
    });
  };

  // One input style for every field, mobile and desktop
  const inputClass =
    "h-[44px] w-full rounded-[16px] border border-[#D1D1D1] px-[12px] text-[13px] leading-[17px] font-medium text-[#1F2A24] outline-none placeholder:text-[#95A19C] focus:border-[#2E8B57] md:h-[48px] md:px-[15px] md:text-[14px] md:leading-[18px] md:placeholder:text-[14px]";

  return (
    <div className="flex w-full items-start justify-center px-0 py-0 md:min-h-0 md:items-start md:px-0 md:py-0">
      <div className="w-full max-w-[500px] md:[zoom:1]">
        <h1 className="w-fit whitespace-nowrap text-[30px] leading-[1] font-bold text-[#26332D] md:w-[387px] md:text-[36px]">
          Create your account
        </h1>

        <p className="mt-2 w-full text-[13px] leading-[1.7] font-normal text-gray-500 md:w-[387px] md:text-[15px]">
          Set up your shop in 3 minutes.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-[38px] space-y-[20px] md:mt-6 md:space-y-7 [@media(max-height:860px)_and_(max-width:767px)]:mt-[28px] [@media(max-height:860px)_and_(max-width:767px)]:space-y-[14px]"
        >
          {/* Full name */}
          <div>
            <label className="mb-2 block w-full text-[13px] leading-[17px] font-semibold md:text-[16px] md:leading-[1]">
              Full name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className={inputClass}
            />
          </div>

          {/* Phone number */}
          <div>
            <label className="mb-2 block w-full text-[13px] leading-[17px] font-semibold md:text-[16px] md:leading-[1]">
              Phone number
            </label>

            <div className="flex h-[44px] w-full items-center gap-[8px] overflow-hidden rounded-[16px] border border-[#D1D1D1] px-[9px] focus-within:border-[#2E8B57] md:h-[48px] md:gap-0 md:px-0">
              <span className="flex h-[26px] w-[62px] shrink-0 items-center justify-start border-r border-[#D1D1D1] px-0 text-[12px] leading-[1] font-medium text-[#1F2A24] md:h-[34px] md:w-[95px] md:px-[10px] md:text-[17px]">
                NG +234
              </span>

              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="803 000 0000"
                className="min-w-0 flex-1 px-0 text-[13px] leading-[1] font-medium text-[#1F2A24] outline-none placeholder:text-[#95A19C] md:px-[15px] md:text-[14px] md:placeholder:text-[14px]"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-[7.16px] block w-full text-[13px] leading-[17px] font-semibold md:mb-2 md:text-[16px] md:leading-[18px]">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-[7.16px] block w-full text-[13px] leading-[17px] font-semibold md:mb-2 md:text-[16px] md:leading-[18px]">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="At least 8 characters"
                className={`${inputClass} pr-10 md:pr-16`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-[8px] top-1/2 z-10 -translate-y-1/2 text-gray-400 md:right-4"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-[18px] w-[18px] md:h-5 md:w-5" />
                ) : (
                  <Eye className="h-[18px] w-[18px] md:h-5 md:w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-4 pt-[10px] md:space-y-7 md:pt-0 [@media(max-height:860px)_and_(max-width:767px)]:space-y-3 [@media(max-height:860px)_and_(max-width:767px)]:pt-[4px]">
            <button
              type="submit"
              className="flex h-[44px] w-full items-center justify-center gap-[6px] rounded-[60px] bg-[#278B53] px-[10px] py-[12px] text-[16px] leading-[1] font-bold text-white transition hover:bg-[#207544] md:h-[45px] md:text-[18px]"
            >
              Create account
            </button>

            <Actionbtn
              type="button"
              variant="outline"
              text={
                <span className="flex items-center justify-center gap-[12px] text-[16px] leading-[1] font-bold text-[#1F2A24] md:text-[18px]">
                  <img src={googleLogo} alt="Google" className="h-6 w-6" />
                  Sign up with Google
                </span>
              }
              classname="h-[44px] md:h-[45px] w-full rounded-[60px] border border-[#D1D1D1] bg-white px-[10px] hover:bg-gray-50"
            />
          </div>
        </form>

        <p className="mt-[29px] text-center text-[13px] leading-[17px] font-medium text-[#727E79] md:mt-6 md:text-[14px] [@media(max-height:860px)_and_(max-width:767px)]:mt-[20px]">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/auth/login")}
            className="font-semibold text-[#2E8B57] underline"
          >
            Log in
          </button>
        </p>

        <p className="mx-auto mt-[13px] w-full whitespace-nowrap text-center text-[clamp(11px,3.3vw,13px)] leading-[1.3] font-medium text-[#727E79] md:mt-2  md:w-[477px] md:text-[14px] md:leading-[23px] [@media(max-height:860px)_and_(max-width:767px)]:mt-2">
          By continuing you agree to the{" "}
          <span className="cursor-pointer text-[#2E8B57] underline">Terms</span>{" "}
          and{" "}
          <span className="cursor-pointer text-[#2E8B57] underline">
            Privacy Policy
          </span>
          .
        </p>
      </div>
    </div>
  );
}

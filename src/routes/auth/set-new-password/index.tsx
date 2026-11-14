import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Eye, EyeOff, ChevronLeft, Check } from "lucide-react";
import desktopLogo from "@/assets/logo/Logo-forgot password.svg";

export default function SetNewPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  // Receive the email from the previous page
  const email = (location.state as { email?: string } | null)?.email;

  // Password fields
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password requirements
  const hasMinLength = newPassword.length >= 8;
  const hasNumber = /\d/.test(newPassword);
  const passwordsMatch =
    newPassword === confirmPassword && confirmPassword.length > 0;

  // Calculate password strength
  const strengthScore = Number(hasMinLength) + Number(hasNumber);
  const strengthLabel =
    strengthScore === 0 ? "weak" : strengthScore === 1 ? "fair" : "strong";
  const activeBars = strengthScore === 0 ? 0 : strengthScore === 1 ? 2 : 3;

  const inputClass =
    "w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 text-sm outline-none focus:border-[#258B55] focus:ring-1 focus:ring-[#258B55] md:h-[54px] md:rounded-[18px] md:px-5 md:text-[18px]";

  const chipClass = (met: boolean) =>
    `flex items-center gap-[6px] rounded-full px-2 py-1 text-xs md:px-[14px] md:py-[6px] md:text-[15px] md:font-semibold ${
      met ? "bg-[#E7F3EC] text-[#258B55]" : "bg-gray-100 text-gray-500"
    }`;

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

        {/* Mobile back button */}
        <button
          type="button"
          onClick={() => navigate("/auth/login")}
          className="flex items-center gap-1 text-sm text-[#26332D] md:hidden"
        >
          <ChevronLeft size={18} />
          Back
        </button>
      </header>

      {/* Password form area */}
      <main className="flex min-h-[calc(100vh-120px)] flex-col md:min-h-screen md:items-center md:justify-center">
        <div className="mx-auto flex w-full max-w-[500px] flex-1 flex-col justify-between md:flex-none md:justify-start md:[zoom:0.6]">
          {/* Page heading */}
          <div className="mt-8 md:mt-0">
            <h1 className="text-2xl font-bold text-[#26332D] md:text-[32px] md:leading-[44px]">
              Set a new password
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-gray-500 md:mt-[6px] md:max-w-[440px] md:text-[15px]">
              Enter the code sent to{" "}
              <strong className="text-[#1F2A24]">
                {email || "your email address"}
              </strong>
              , then choose a new password.
            </p>
          </div>

          {/* New password field */}
          <div className="mt-8 md:mt-6">
            <label className="mb-2 block text-sm font-medium text-[#26332D] md:mb-3 md:text-[18px]">
              New password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="Enter new password"
                className={inputClass}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 md:right-5"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          {/* Password strength */}
          <div className="mt-4 md:mt-[33px]">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="flex flex-1 gap-2 md:gap-[14px]">
                {[0, 1, 2, 3].map((bar) => (
                  <div
                    key={bar}
                    className={`h-1.5 flex-1 rounded-full md:h-[5px] ${
                      bar < activeBars ? "bg-[#258B55]" : "bg-[#D6EADF]"
                    }`}
                  />
                ))}
              </div>

              <span className="text-xs font-semibold text-[#258B55] md:pr-[18px] md:text-[15px]">
                {strengthLabel}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 md:mt-4 md:gap-[10px]">
              <span className={chipClass(hasMinLength)}>
                {hasMinLength ? <Check size={14} /> : <span>○</span>}
                8+ characters
              </span>

              <span className={chipClass(hasNumber)}>
                {hasNumber ? <Check size={14} /> : <span>○</span>}A number
              </span>
            </div>
          </div>

          {/* Confirm password field */}
          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-[#26332D] md:mb-3 md:text-[18px]">
              Confirm new password
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Type it again"
                className={inputClass}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 md:right-5"
              >
                {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          {confirmPassword.length > 0 && !passwordsMatch && (
            <p className="mt-2 text-xs text-red-500 md:text-[14px]">
              Passwords do not match.
            </p>
          )}

          {/* Save new password button */}
          <div className="mt-auto md:mt-[34px]">
            <button
              type="button"
              onClick={() => {
                if (!hasMinLength || !hasNumber) {
                  alert("Please meet all password requirements.");
                  return;
                }

                if (!passwordsMatch) {
                  alert("Your passwords do not match.");
                  return;
                }

                alert("Password update is not connected yet.");
              }}
              className="mt-6 w-full rounded-full bg-[#2E8B57] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1F7548] md:mt-0 md:h-[54px] md:py-0 md:text-[18px] md:font-bold"
            >
              Save new password
            </button>

            {/* Resend code */}
            <p className="mt-4 text-center text-xs text-gray-500 md:mt-6 md:text-[15px]">
              Didn't get a code?{" "}
              <button
                type="button"
                onClick={() =>
                  alert(
                    "Resending OTP is not available until SMS verification is enabled.",
                  )
                }
                className="font-bold text-[#258B55]"
              >
                Resend
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

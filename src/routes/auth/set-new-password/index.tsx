import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Eye, EyeOff, ChevronLeft } from "lucide-react";
import desktopLogo from "@/assets/logo/Logo-forgot password.svg";

export default function SetNewPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  // Receive the phone number from the previous verification page
  const phoneNumber = (location.state as { phoneNumber?: string } | null)
    ?.phoneNumber;

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
    strengthScore === 0 ? "Weak" : strengthScore === 1 ? "Fair" : "Strong";

  const activeBars = strengthScore === 0 ? 0 : strengthScore === 1 ? 2 : 4;

  return (
    <div className="min-h-screen w-full bg-white px-6 py-6 md:px-12 md:py-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        {/* Desktop logo */}
        <div className="hidden md:block">
          <img
            src={desktopLogo}
            alt="OjaHub"
            className="w-[110px] object-contain"
          />
        </div>

        {/* Desktop back button */}
        <button
          type="button"
          onClick={() => navigate("/auth/login")}
          className="hidden rounded-full bg-[#E8F0EC] px-4 py-2 text-sm text-[#26332D] md:block"
        >
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
      <main className="mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-[500px] flex-col justify-between md:justify-center">
        {/* Page heading */}
        <div className="mt-8 md:mt-0">
          <h1 className="text-2xl font-bold text-[#26332D]">
            Set a new password
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            Enter the code sent to{" "}
            <strong>{phoneNumber || "+234 803 000 0000"}</strong>, then choose a
            new password.
          </p>
        </div>

        {/* New password field */}
        <div className="mt-8">
          <label className="mb-2 block text-sm font-medium text-[#26332D]">
            New password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="Enter new password"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 text-sm outline-none focus:border-[#258B55] focus:ring-1 focus:ring-[#258B55]"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
        </div>

        {/* Password strength */}
        <div className="mt-4">
          <div className="flex items-center gap-3">
            <div className="flex flex-1 gap-2">
              {[0, 1, 2, 3].map((bar) => (
                <div
                  key={bar}
                  className={`h-1.5 flex-1 rounded-full ${
                    bar < activeBars ? "bg-[#258B55]" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>

            <span className="text-xs font-semibold text-[#258B55]">
              {strengthLabel}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span
              className={`rounded-full px-2 py-1 ${
                hasMinLength
                  ? "bg-[#E8F5EC] text-[#258B55]"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {hasMinLength ? "✓" : "○"} 8+ characters
            </span>

            <span
              className={`rounded-full px-2 py-1 ${
                hasNumber
                  ? "bg-[#E8F5EC] text-[#258B55]"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {hasNumber ? "✓" : "○"} A number
            </span>
          </div>
        </div>

        {/* Confirm password field */}
        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-[#26332D]">
            Confirm new password
          </label>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm new password"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 text-sm outline-none focus:border-[#258B55] focus:ring-1 focus:ring-[#258B55]"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
        </div>

        {confirmPassword.length > 0 && !passwordsMatch && (
          <p className="mt-2 text-xs text-red-500">Passwords do not match.</p>
        )}

        {/* Save new password button */}
        <div className="mt-auto md:mt-6">
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
            className="mt-6 w-full rounded-full bg-[#258B55] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1F7548]"
          >
            Save new password
          </button>

          {/* Resend code */}
          <p className="mt-4 text-center text-xs text-gray-500">
            Didn't get a code?{" "}
            <button
              type="button"
              onClick={() =>
                alert(
                  "Resending OTP is not available until SMS verification is enabled.",
                )
              }
              className="font-semibold text-[#258B55]"
            >
              Resend
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}

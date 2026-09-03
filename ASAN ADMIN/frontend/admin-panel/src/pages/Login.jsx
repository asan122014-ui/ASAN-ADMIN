import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import {
  loginAdmin,
  saveAdminSession,
} from "../services/adminAuthService";

function Login() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const navigate =
    useNavigate();

  /* =========================================================
     EMAIL VALIDATION
  ========================================================= */

  const isValidEmail = (
    value
  ) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      String(
        value || ""
      ).trim()
    );

  /* =========================================================
     LOGIN
  ========================================================= */

  const handleLogin =
    async () => {
      if (loading) {
        return;
      }

      setErrorMessage("");

      const normalizedEmail =
        String(
          email || ""
        )
          .trim()
          .toLowerCase();

      /* =====================================================
         VALIDATION
      ===================================================== */

      if (
        !normalizedEmail ||
        !password
      ) {
        setErrorMessage(
          "Please enter your email and password."
        );

        return;
      }

      if (
        !isValidEmail(
          normalizedEmail
        )
      ) {
        setErrorMessage(
          "Please enter a valid email address."
        );

        return;
      }

      try {
        setLoading(true);

        /* =====================================================
           LOGIN REQUEST
        ===================================================== */

        const response =
          await loginAdmin(
            normalizedEmail,
            password
          );

        /* =====================================================
           VALIDATE RESPONSE
        ===================================================== */

        if (
          !response?.success
        ) {
          throw new Error(
            response?.message ||
              "Login failed"
          );
        }

        const token =
          response.token;

        const admin =
          response.data;

        if (
          !token ||
          !admin
        ) {
          throw new Error(
            "Invalid server response"
          );
        }

        /* =====================================================
           STORE SESSION
        ===================================================== */

        saveAdminSession(
          token,
          admin
        );

        /* =====================================================
           NAVIGATE
        ===================================================== */

        navigate(
          "/dashboard",
          {
            replace: true,
          }
        );
      } catch (error) {
        console.error(
          "Admin login error:",
          error
        );

        const message =
          error?.response
            ?.data
            ?.message ||
          error?.message ||
          "Login failed. Please try again.";

        setErrorMessage(
          message
        );
      } finally {
        setLoading(false);
      }
    };

  /* =========================================================
     ENTER KEY
  ========================================================= */

  const handleKeyDown = (
    event
  ) => {
    if (
      event.key ===
      "Enter"
    ) {
      event.preventDefault();

      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9EE] flex items-center justify-center px-4 py-8 relative overflow-hidden">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#FFEDB9] opacity-80" />

      <div className="absolute -bottom-32 -right-24 w-80 h-80 rounded-full bg-[#FFF0C7] opacity-90" />

      <div className="absolute top-20 right-[10%] w-20 h-20 rounded-full bg-[#FFE09A] opacity-40" />

      {/* =====================================================
          LOGIN WRAPPER
      ===================================================== */}

      <div className="relative w-full max-w-md">

        {/* ===================================================
            BRAND
        =================================================== */}

        <div className="text-center mb-7">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF3D1] border border-[#F0D48C] mb-4">

            <ShieldCheck
              size={17}
              className="text-[#B87700]"
            />

            <span className="text-xs font-bold tracking-[0.18em] text-[#B87700]">
              SECURE ADMIN ACCESS
            </span>

          </div>

          <h1 className="text-4xl font-black tracking-tight text-[#1C1917]">
            ASAN Admin
          </h1>

          <p className="mt-2 text-sm text-[#8C8276]">
            Manage drivers, operations and platform activity.
          </p>
        </div>

        {/* ===================================================
            CARD
        =================================================== */}

        <div className="bg-[#FFFDF8] border border-[#EED69B] rounded-[28px] shadow-xl shadow-orange-100/50 px-6 sm:px-8 py-8">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-7">
            <h2 className="text-2xl font-extrabold text-[#1C1917]">
              Welcome back
            </h2>

            <p className="text-sm text-[#8C8276] mt-1">
              Sign in using your administrator credentials.
            </p>
          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {errorMessage && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm font-medium text-red-600">
              {errorMessage}
            </div>
          )}

          {/* =================================================
              FORM
          ================================================= */}

          <div
            className="space-y-5"
            onKeyDown={
              handleKeyDown
            }
          >

            {/* ===============================================
                EMAIL
            =============================================== */}

            <div>
              <label className="block text-sm font-semibold text-[#4A433B] mb-2">
                Email address
              </label>

              <div className="relative">

                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9C9184]"
                />

                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  disabled={
                    loading
                  }
                  onChange={(
                    event
                  ) => {
                    setEmail(
                      event.target
                        .value
                    );

                    if (
                      errorMessage
                    ) {
                      setErrorMessage(
                        ""
                      );
                    }
                  }}
                  placeholder="admin@example.com"
                  className="w-full h-14 pl-12 pr-4 rounded-xl border border-[#E4D8C8] bg-white text-[#1C1917] placeholder:text-[#AAA096] outline-none transition focus:border-[#FFB000] focus:ring-4 focus:ring-[#FFB000]/10 disabled:opacity-60"
                />

              </div>
            </div>

            {/* ===============================================
                PASSWORD
            =============================================== */}

            <div>
              <label className="block text-sm font-semibold text-[#4A433B] mb-2">
                Password
              </label>

              <div className="relative">

                <LockKeyhole
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9C9184]"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="current-password"
                  value={
                    password
                  }
                  disabled={
                    loading
                  }
                  onChange={(
                    event
                  ) => {
                    setPassword(
                      event.target
                        .value
                    );

                    if (
                      errorMessage
                    ) {
                      setErrorMessage(
                        ""
                      );
                    }
                  }}
                  placeholder="Enter your password"
                  className="w-full h-14 pl-12 pr-12 rounded-xl border border-[#E4D8C8] bg-white text-[#1C1917] placeholder:text-[#AAA096] outline-none transition focus:border-[#FFB000] focus:ring-4 focus:ring-[#FFB000]/10 disabled:opacity-60"
                />

                <button
                  type="button"
                  disabled={
                    loading
                  }
                  onClick={() =>
                    setShowPassword(
                      (
                        current
                      ) =>
                        !current
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8C8276] hover:text-[#1C1917] transition disabled:opacity-50"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff
                      size={19}
                    />
                  ) : (
                    <Eye
                      size={19}
                    />
                  )}
                </button>

              </div>
            </div>

            {/* ===============================================
                LOGIN BUTTON
            =============================================== */}

            <button
              type="button"
              disabled={
                loading
              }
              onClick={
                handleLogin
              }
              className="w-full h-14 rounded-xl bg-[#FFB000] hover:bg-[#EFA500] active:scale-[0.99] transition text-[#1C1917] font-extrabold shadow-lg shadow-yellow-200/60 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {loading
                ? "Signing in..."
                : "Sign in to Admin"}
            </button>

          </div>

          {/* =================================================
              SECURITY INFO
          ================================================= */}

          <div className="mt-7 pt-6 border-t border-[#EEE4D5]">

            <div className="flex items-start gap-3">

              <ShieldCheck
                size={18}
                className="text-[#B87700] mt-0.5 shrink-0"
              />

              <p className="text-xs leading-5 text-[#8C8276]">
                This portal is restricted to authorized ASAN administrators. Admin sessions are securely authenticated before protected operations are available.
              </p>

            </div>

          </div>
        </div>

        {/* ===================================================
            FOOTER
        =================================================== */}

        <div className="text-center mt-6 text-xs text-[#9A9187]">
          ©{" "}
          {new Date().getFullYear()}{" "}
          ASAN Transport System
        </div>

      </div>

    </div>
  );
}

export default Login;
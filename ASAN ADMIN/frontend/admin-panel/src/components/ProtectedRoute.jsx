import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

function ProtectedRoute({ children }) {
  const [checking, setChecking] =
    useState(true);

  const [authorized, setAuthorized] =
    useState(false);

  /* =========================================================
     API
  ========================================================= */

  const API =
    import.meta.env.VITE_API_URL ||
    "https://asan-driverapp.onrender.com";

  /* =========================================================
     VERIFY ADMIN SESSION
  ========================================================= */

  useEffect(() => {
    let active = true;

    const verifySession =
      async () => {
        const token =
          localStorage.getItem(
            "adminToken"
          );

        if (!token) {
          if (active) {
            setAuthorized(false);
            setChecking(false);
          }

          return;
        }

        try {
          const response =
            await axios.get(
              `${API}/api/admin-auth/me`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          if (
            !response?.data?.success ||
            !response?.data?.data
          ) {
            throw new Error(
              "Invalid Admin session"
            );
          }

          const admin =
            response.data.data;

          /* =================================================
             STORE FRESH ADMIN DATA
          ================================================= */

          localStorage.setItem(
            "admin",
            JSON.stringify(
              admin
            )
          );

          localStorage.setItem(
            "adminRole",
            admin.role
          );

          if (active) {
            setAuthorized(true);
          }
        } catch (error) {
          console.error(
            "Admin session verification failed:",
            error
          );

          /* =================================================
             CLEAR INVALID SESSION
          ================================================= */

          localStorage.removeItem(
            "adminToken"
          );

          localStorage.removeItem(
            "admin"
          );

          localStorage.removeItem(
            "adminRole"
          );

          if (active) {
            setAuthorized(false);
          }
        } finally {
          if (active) {
            setChecking(false);
          }
        }
      };

    verifySession();

    return () => {
      active = false;
    };
  }, [API]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (checking) {
    return (
      <div className="min-h-screen bg-[#FFF9EE] flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4">

          <div className="w-11 h-11 border-4 border-[#FFE29A] border-t-[#FFB000] rounded-full animate-spin" />

          <div className="text-center">
            <p className="text-sm font-bold text-[#1C1917]">
              Verifying Admin Session
            </p>

            <p className="text-xs text-[#8C8276] mt-1">
              Please wait a moment
            </p>
          </div>

        </div>
      </div>
    );
  }

  /* =========================================================
     UNAUTHORIZED
  ========================================================= */

  if (!authorized) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  /* =========================================================
     AUTHORIZED
  ========================================================= */

  return children;
}

export default ProtectedRoute;
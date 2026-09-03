import {
  Search,
  BarChart3,
  ClipboardList,
  LogOut,
  ShieldCheck,
} from "lucide-react";

import {
  logoutAdmin,
  clearAdminSession,
  getStoredAdmin,
  getStoredAdminRole,
} from "../services/adminAuthService";

function Topbar({
  search = "",
  setSearch,
  openAnalytics,
  openLogs,
}) {
  /* =========================================================
     ADMIN SESSION
  ========================================================= */

  const admin =
    getStoredAdmin();

  const role =
    getStoredAdminRole();

  const isSuperAdmin =
    role === "superadmin";

  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearch = (
    event
  ) => {
    if (
      typeof setSearch ===
      "function"
    ) {
      setSearch(
        event.target.value
      );
    }
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout =
    async () => {
      const confirmed =
        window.confirm(
          "Are you sure you want to logout?"
        );

      if (
        !confirmed
      ) {
        return;
      }

      try {
        /*
          Backend logout currently logs
          the logout event.

          JWT itself is stateless, so the
          frontend still removes the token.
        */

        await logoutAdmin();
      } catch (error) {
        console.error(
          "Admin logout error:",
          error
        );
      } finally {
        clearAdminSession();

        window.location.replace(
          "/"
        );
      }
    };

  return (
    <div className="flex flex-col gap-5">

      {/* =====================================================
          ADMIN INFO
      ===================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-[#FFF3D1] border border-[#F0D48C] flex items-center justify-center">

            <ShieldCheck
              size={20}
              className="text-[#B87700]"
            />

          </div>

          <div>

            <p className="text-xs font-semibold text-[#8C8276]">
              Signed in as
            </p>

            <p className="font-bold text-[#1C1917]">
              {admin?.email ||
                "Administrator"}
            </p>

          </div>

        </div>

        <span className="self-start sm:self-auto px-3 py-1.5 rounded-full bg-[#FFF3D1] border border-[#F0D48C] text-[#B87700] text-xs font-bold uppercase tracking-wide">
          {role ===
          "superadmin"
            ? "Super Admin"
            : role ===
              "reviewer"
            ? "Reviewer"
            : "Admin"}
        </span>

      </div>

      {/* =====================================================
          SEARCH + ACTIONS
      ===================================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        {/* ===================================================
            SEARCH
        =================================================== */}

        <div className="relative w-full lg:max-w-[440px]">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9C9184]"
          />

          <input
            type="text"
            placeholder="Search by name, email, phone, driver ID or vehicle..."
            value={search}
            onChange={
              handleSearch
            }
            className="w-full h-12 pl-11 pr-4 rounded-xl border border-[#E4D8C8] bg-white text-[#1C1917] placeholder:text-[#AAA096] outline-none transition focus:border-[#FFB000] focus:ring-4 focus:ring-[#FFB000]/10"
          />

        </div>

        {/* ===================================================
            ACTION BUTTONS
        =================================================== */}

        <div className="flex flex-wrap items-center gap-3">

          {/* =================================================
              LOGS
          ================================================= */}

          {isSuperAdmin && (
            <button
              type="button"
              onClick={() =>
                openLogs?.()
              }
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#F6F0E7] hover:bg-[#EDE3D4] text-[#4A433B] font-bold transition"
            >
              <ClipboardList
                size={18}
              />

              Logs
            </button>
          )}

          {/* =================================================
              ANALYTICS
          ================================================= */}

          <button
            type="button"
            onClick={() =>
              openAnalytics?.()
            }
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#1C1917] hover:bg-black text-white font-bold transition"
          >
            <BarChart3
              size={18}
            />

            Analytics
          </button>

          {/* =================================================
              LOGOUT
          ================================================= */}

          <button
            type="button"
            onClick={
              handleLogout
            }
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold transition"
          >
            <LogOut
              size={18}
            />

            Logout
          </button>

        </div>

      </div>

    </div>
  );
}

export default Topbar;
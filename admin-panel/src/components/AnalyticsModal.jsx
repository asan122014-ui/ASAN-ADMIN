import { useEffect } from "react";
import DriverAnalytics from "./DriverAnalytics";

import {
  BarChart3,
  Users,
  CheckCircle,
  Clock3,
  XCircle,
  X,
} from "lucide-react";

function AnalyticsModal({
  stats = {},
  analytics = {},
  onClose,
}) {
  /* ================= ESC CLOSE ================= */

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () =>
      document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  /* ================= LOCK SCROLL ================= */

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  /* ================= SAFE DATA ================= */

  const safeStats = stats || {};

  const chartData = {
    registrations:
      safeStats.registrations || [],

    approvals:
      safeStats.approvals || [],
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-md flex items-center justify-center p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[28px] shadow-2xl w-full max-w-7xl max-h-[92vh] overflow-hidden"
      >

        {/* ================= HEADER ================= */}

        <div className="bg-gradient-to-r from-indigo-700 via-blue-700 to-slate-800 px-8 py-6 flex items-center justify-between">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-white">
              <BarChart3 size={28} />
            </div>

            <div>

              <h2 className="text-3xl font-bold text-white">
                Driver Analytics
              </h2>

              <p className="text-blue-100 mt-1">
                Monitor registrations, approvals and overall platform performance.
              </p>

            </div>

          </div>

          <button
            onClick={onClose}
            className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 text-white transition flex items-center justify-center"
          >
            <X size={22} />
          </button>

        </div>

        {/* ================= CONTENT ================= */}

        <div className="overflow-y-auto max-h-[calc(92vh-92px)] p-8 bg-slate-50">

          {/* SUMMARY CARDS */}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

            <div className="bg-white rounded-3xl shadow-lg border p-6 hover:-translate-y-1 hover:shadow-xl transition-all">

              <div className="flex justify-between items-center">

                <Users className="text-indigo-600" size={30} />

                <span className="text-xs font-semibold text-gray-400">
                  TOTAL
                </span>

              </div>

              <p className="text-gray-500 mt-5">
                Total Drivers
              </p>

              <h2 className="text-4xl font-bold mt-2 text-slate-800">
                {safeStats.totalDrivers || 0}
              </h2>

            </div>

            <div className="bg-white rounded-3xl shadow-lg border p-6 hover:-translate-y-1 hover:shadow-xl transition-all">

              <div className="flex justify-between items-center">

                <Clock3 className="text-yellow-500" size={30} />

                <span className="text-xs font-semibold text-gray-400">
                  WAITING
                </span>

              </div>

              <p className="text-gray-500 mt-5">
                Pending Drivers
              </p>

              <h2 className="text-4xl font-bold mt-2 text-yellow-600">
                {safeStats.pendingDrivers || 0}
              </h2>

            </div>

            <div className="bg-white rounded-3xl shadow-lg border p-6 hover:-translate-y-1 hover:shadow-xl transition-all">

              <div className="flex justify-between items-center">

                <CheckCircle className="text-green-600" size={30} />

                <span className="text-xs font-semibold text-gray-400">
                  APPROVED
                </span>

              </div>

              <p className="text-gray-500 mt-5">
                Approved Drivers
              </p>

              <h2 className="text-4xl font-bold mt-2 text-green-600">
                {safeStats.approvedDrivers || 0}
              </h2>

            </div>

            <div className="bg-white rounded-3xl shadow-lg border p-6 hover:-translate-y-1 hover:shadow-xl transition-all">

              <div className="flex justify-between items-center">

                <XCircle className="text-red-600" size={30} />

                <span className="text-xs font-semibold text-gray-400">
                  REJECTED
                </span>

              </div>

              <p className="text-gray-500 mt-5">
                Rejected Drivers
              </p>

              <h2 className="text-4xl font-bold mt-2 text-red-600">
                {safeStats.rejectedDrivers || 0}
              </h2>

            </div>

          </div>
                    {/* ================= ANALYTICS SECTION ================= */}

          <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

              <div>
                <h3 className="text-2xl font-bold text-slate-800">
                  Registration Insights
                </h3>

                <p className="text-slate-500 mt-1">
                  Review weekly registrations, approvals and overall driver activity.
                </p>
              </div>

              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl px-6 py-4 shadow-lg">

                <p className="text-sm opacity-80">
                  Last Updated
                </p>

                <h4 className="text-lg font-semibold">
                  {new Date().toLocaleString()}
                </h4>

              </div>

            </div>

            <DriverAnalytics stats={chartData} />

          </div>

          {/* ================= FOOTER ================= */}

          <div className="mt-8 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl">

            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">

              <div>

                <h3 className="text-2xl font-bold">
                  Analytics Overview
                </h3>

                <p className="text-slate-300 mt-2 max-w-3xl">
                  This dashboard provides a complete overview of driver
                  registrations, approvals and platform activity. Use these
                  insights to monitor operational performance and make informed
                  decisions.
                </p>

              </div>

              <button
                onClick={onClose}
                className="bg-white text-slate-900 px-8 py-3 rounded-2xl font-semibold hover:bg-slate-100 transition-all duration-300 shadow-lg"
              >
                Close Analytics
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AnalyticsModal;
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
  onClose,
}) {
  /* =========================================================
     ESC CLOSE
  ========================================================= */

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener(
      "keydown",
      handleEsc
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEsc
      );
    };
  }, [onClose]);

  /* =========================================================
     LOCK SCROLL
  ========================================================= */

  useEffect(() => {
    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, []);

  /* =========================================================
     SAFE DATA
  ========================================================= */

  const safeStats =
    stats || {};

  const summary =
    safeStats.summary || {};

  const chartData = {
    registrations:
      Array.isArray(
        safeStats.registrations
      )
        ? safeStats.registrations
        : [],

    approvals:
      Array.isArray(
        safeStats.approvals
      )
        ? safeStats.approvals
        : [],

    rejections:
      Array.isArray(
        safeStats.rejections
      )
        ? safeStats.rejections
        : [],
  };

  const totalDrivers =
    Number(
      summary.total
    ) || 0;

  const pendingDrivers =
    Number(
      summary.pending
    ) || 0;

  const approvedDrivers =
    Number(
      summary.approved
    ) || 0;

  const rejectedDrivers =
    Number(
      summary.rejected
    ) || 0;

  /* =========================================================
     SUMMARY CARDS
  ========================================================= */

  const cards = [
    {
      key: "total",
      label: "Total Drivers",
      value: totalDrivers,
      badge: "TOTAL",
      icon: Users,
      iconBg:
        "bg-[#FFF3D1]",
      iconColor:
        "text-[#B87700]",
    },
    {
      key: "pending",
      label: "Pending Drivers",
      value: pendingDrivers,
      badge: "WAITING",
      icon: Clock3,
      iconBg:
        "bg-yellow-100",
      iconColor:
        "text-yellow-700",
    },
    {
      key: "approved",
      label: "Approved Drivers",
      value: approvedDrivers,
      badge: "APPROVED",
      icon: CheckCircle,
      iconBg:
        "bg-green-100",
      iconColor:
        "text-green-700",
    },
    {
      key: "rejected",
      label: "Rejected Drivers",
      value: rejectedDrivers,
      badge: "REJECTED",
      icon: XCircle,
      iconBg:
        "bg-red-100",
      iconColor:
        "text-red-600",
    },
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
    >
      <div
        onClick={(event) =>
          event.stopPropagation()
        }
        className="bg-[#FFFDF8] border border-[#EED69B] rounded-[28px] shadow-2xl w-full max-w-7xl max-h-[92vh] overflow-hidden"
      >

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="bg-[#1C1917] px-5 sm:px-8 py-6 flex items-center justify-between gap-5">

          <div className="flex items-center gap-4 min-w-0">

            <div className="w-14 h-14 rounded-2xl bg-[#FFB000] text-[#1C1917] flex items-center justify-center shrink-0">
              <BarChart3
                size={27}
              />
            </div>

            <div className="min-w-0">

              <p className="text-xs font-bold tracking-[0.18em] text-[#FFD36A] mb-1">
                PLATFORM INSIGHTS
              </p>

              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Driver Analytics
              </h2>

              <p className="text-white/60 mt-1 text-sm">
                Monitor registrations, approvals, rejections and driver activity.
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 text-white transition flex items-center justify-center shrink-0"
          >
            <X
              size={22}
            />
          </button>

        </div>

        {/* ===================================================
            CONTENT
        =================================================== */}

        <div className="overflow-y-auto max-h-[calc(92vh-96px)] p-5 sm:p-8 bg-[#FFF9EE]">

          {/* =================================================
              SUMMARY CARDS
          ================================================= */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

            {cards.map(
              (card) => {
                const Icon =
                  card.icon;

                return (
                  <div
                    key={
                      card.key
                    }
                    className="bg-[#FFFDF8] rounded-2xl border border-[#EEE4D5] p-5 shadow-sm hover:shadow-md transition"
                  >

                    <div className="flex justify-between items-start gap-4">

                      <div
                        className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center`}
                      >
                        <Icon
                          size={23}
                          className={
                            card.iconColor
                          }
                        />
                      </div>

                      <span className="text-[10px] font-black tracking-wider text-[#9C9184]">
                        {
                          card.badge
                        }
                      </span>

                    </div>

                    <p className="text-sm text-[#8C8276] mt-5 font-semibold">
                      {
                        card.label
                      }
                    </p>

                    <h2 className="text-4xl font-black mt-2 text-[#1C1917]">
                      {
                        card.value
                      }
                    </h2>

                  </div>
                );
              }
            )}

          </div>

          {/* =================================================
              ANALYTICS SECTION
          ================================================= */}

          <div className="bg-[#FFFDF8] rounded-3xl border border-[#EEE4D5] p-5 sm:p-8 shadow-sm">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

              <div>

                <p className="text-xs font-bold tracking-[0.15em] text-[#B87700] mb-2">
                  LAST 7 DAYS
                </p>

                <h3 className="text-2xl font-black text-[#1C1917]">
                  Registration Insights
                </h3>

                <p className="text-[#8C8276] mt-1">
                  Review recent registrations, approvals and rejections.
                </p>

              </div>

              <div className="bg-[#FFF3D1] border border-[#F0D48C] rounded-2xl px-5 py-3">

                <p className="text-xs font-semibold text-[#8C8276]">
                  Last Updated
                </p>

                <h4 className="text-sm font-bold text-[#4A433B] mt-1">
                  {new Date().toLocaleString()}
                </h4>

              </div>

            </div>

            <DriverAnalytics
              stats={
                chartData
              }
            />

          </div>

          {/* =================================================
              OVERVIEW FOOTER
          ================================================= */}

          <div className="mt-8 bg-[#1C1917] rounded-3xl p-6 sm:p-8 text-white shadow-lg">

            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">

              <div>

                <p className="text-xs font-bold tracking-[0.15em] text-[#FFD36A] mb-2">
                  ASAN ANALYTICS
                </p>

                <h3 className="text-2xl font-black">
                  Analytics Overview
                </h3>

                <p className="text-white/60 mt-2 max-w-3xl leading-6">
                  Use these insights to monitor driver onboarding activity, review trends and overall operational performance.
                </p>

              </div>

              <button
                type="button"
                onClick={onClose}
                className="bg-[#FFB000] hover:bg-[#EFA500] text-[#1C1917] px-7 py-3 rounded-xl font-black transition shrink-0"
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
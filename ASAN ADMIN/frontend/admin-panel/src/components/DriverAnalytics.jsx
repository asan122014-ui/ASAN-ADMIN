import { useCallback, useMemo, useState } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Doughnut } from "react-chartjs-2";

import {
  Calendar,
  Users,
  CheckCircle,
  ClipboardCheck,
  XCircle,
} from "lucide-react";

/* =========================================================
   REGISTER CHART.JS
========================================================= */

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

/* =========================================================
   DRIVER ANALYTICS
========================================================= */

function DriverAnalytics({ stats = {} }) {
  /* =========================================================
     STATE
  ========================================================= */

  const [selectedDate, setSelectedDate] = useState("");

  /* =========================================================
     SAFE BACKEND DATA
  ========================================================= */

  const registrations = Array.isArray(stats?.registrations)
    ? stats.registrations
    : [];

  const approvals = Array.isArray(stats?.approvals)
    ? stats.approvals
    : [];

  const rejections = Array.isArray(stats?.rejections)
    ? stats.rejections
    : [];

  /* =========================================================
     DATE FILTER
  ========================================================= */

  const filterData = useCallback(
    (data) => {
      if (!selectedDate) {
        return data;
      }

      return data.filter(
        (item) => String(item?._id || "") === selectedDate
      );
    },
    [selectedDate]
  );

  const filteredRegistrations = useMemo(
    () => filterData(registrations),
    [filterData, registrations]
  );

  const filteredApprovals = useMemo(
    () => filterData(approvals),
    [filterData, approvals]
  );

  const filteredRejections = useMemo(
    () => filterData(rejections),
    [filterData, rejections]
  );

  /* =========================================================
     DATE LABEL
  ========================================================= */

  const formatLabel = (dateValue) => {
    if (!dateValue) {
      return "";
    }

    const date = new Date(`${dateValue}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });
  };

  /* =========================================================
     DATE RANGE
  ========================================================= */

  const dateKeys = useMemo(() => {
    if (selectedDate) {
      return [selectedDate];
    }

    const dates = new Set();

    [registrations, approvals, rejections].forEach((group) => {
      group.forEach((item) => {
        if (item?._id) {
          dates.add(item._id);
        }
      });
    });

    return Array.from(dates).sort().slice(-7);
  }, [
    registrations,
    approvals,
    rejections,
    selectedDate,
  ]);

  /* =========================================================
     COUNT MAP
  ========================================================= */

  const createCountMap = (data) => {
    const map = {};

    data.forEach((item) => {
      if (!item?._id) {
        return;
      }

      map[item._id] =
        (map[item._id] || 0) +
        (Number(item.count) || 0);
    });

    return map;
  };

  const registrationMap = useMemo(
    () => createCountMap(filteredRegistrations),
    [filteredRegistrations]
  );

  const approvalMap = useMemo(
    () => createCountMap(filteredApprovals),
    [filteredApprovals]
  );

  const rejectionMap = useMemo(
    () => createCountMap(filteredRejections),
    [filteredRejections]
  );

  /* =========================================================
     CHART ARRAYS
  ========================================================= */

  const chartLabels = dateKeys.map(formatLabel);

  const registrationData = dateKeys.map(
    (date) => registrationMap[date] || 0
  );

  const approvalData = dateKeys.map(
    (date) => approvalMap[date] || 0
  );

  const rejectionData = dateKeys.map(
    (date) => rejectionMap[date] || 0
  );

  /* =========================================================
     TOTAL ACTIVITY
  ========================================================= */

  const totalRegistrations = filteredRegistrations.reduce(
    (sum, item) =>
      sum + (Number(item?.count) || 0),
    0
  );

  const totalApprovals = filteredApprovals.reduce(
    (sum, item) =>
      sum + (Number(item?.count) || 0),
    0
  );

  const totalRejections = filteredRejections.reduce(
    (sum, item) =>
      sum + (Number(item?.count) || 0),
    0
  );

  const totalReviewDecisions =
    totalApprovals + totalRejections;

  /* =========================================================
     REVIEW DISTRIBUTION
  ========================================================= */

  const approvalShare =
    totalReviewDecisions > 0
      ? Math.round(
          (totalApprovals / totalReviewDecisions) * 100
        )
      : 0;

  const rejectionShare =
    totalReviewDecisions > 0
      ? Math.round(
          (totalRejections / totalReviewDecisions) * 100
        )
      : 0;

  /* =========================================================
     CHART OPTIONS
  ========================================================= */

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        labels: {
          color: "#625B53",

          font: {
            size: 12,
            weight: "600",
          },

          usePointStyle: true,
        },
      },

      tooltip: {
        backgroundColor: "#1C1917",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        padding: 12,
        cornerRadius: 10,
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },

        ticks: {
          color: "#8C8276",
        },
      },

      y: {
        beginAtZero: true,

        ticks: {
          precision: 0,
          color: "#8C8276",
        },

        grid: {
          color: "#EEE4D5",
        },
      },
    },
  };

  /* =========================================================
     BAR CHART
  ========================================================= */

  const combinedBarData = {
    labels: chartLabels,

    datasets: [
      {
        label: "Registrations",
        data: registrationData,
        backgroundColor: "#FFB000",
        borderRadius: 8,
      },

      {
        label: "Approvals",
        data: approvalData,
        backgroundColor: "#22C55E",
        borderRadius: 8,
      },

      {
        label: "Rejections",
        data: rejectionData,
        backgroundColor: "#EF4444",
        borderRadius: 8,
      },
    ],
  };

  /* =========================================================
     DOUGHNUT
  ========================================================= */

  const doughnutData = {
    labels: [
      "Approved",
      "Rejected",
    ],

    datasets: [
      {
        data: [
          totalApprovals,
          totalRejections,
        ],

        backgroundColor: [
          "#22C55E",
          "#EF4444",
        ],

        borderWidth: 0,
      },
    ],
  };

  /* =========================================================
     DATA STATUS
  ========================================================= */

  const hasChartData =
    totalRegistrations > 0 ||
    totalApprovals > 0 ||
    totalRejections > 0;

  /* =========================================================
     SUMMARY CARDS
  ========================================================= */

  const summaryCards = [
    {
      key: "registrations",
      label: "Registrations",
      value: totalRegistrations,
      icon: Users,
      bg: "bg-[#FFF3D1]",
      iconColor: "text-[#B87700]",
    },

    {
      key: "approvals",
      label: "Approvals",
      value: totalApprovals,
      icon: CheckCircle,
      bg: "bg-green-100",
      iconColor: "text-green-700",
    },

    {
      key: "rejections",
      label: "Rejections",
      value: totalRejections,
      icon: XCircle,
      bg: "bg-red-100",
      iconColor: "text-red-600",
    },

    {
      key: "reviews",
      label: "Review Decisions",
      value: totalReviewDecisions,
      icon: ClipboardCheck,
      bg: "bg-blue-100",
      iconColor: "text-blue-700",
    },
  ];

  return (
    <div className="space-y-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        <div>
          <h2 className="text-2xl font-black text-[#1C1917]">
            Driver Activity
          </h2>

          <p className="text-[#8C8276] mt-1">
            Registration and driver review activity from the analytics period.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">

          <div className="flex items-center gap-2">

            <Calendar
              size={18}
              className="text-[#B87700]"
            />

            <input
              type="date"
              value={selectedDate}
              onChange={(event) =>
                setSelectedDate(event.target.value)
              }
              className="h-11 border border-[#E4D8C8] bg-white rounded-xl px-4 text-[#4A433B] outline-none focus:border-[#FFB000] focus:ring-4 focus:ring-[#FFB000]/10"
            />

          </div>

          {selectedDate && (
            <button
              type="button"
              onClick={() => setSelectedDate("")}
              className="h-11 px-4 rounded-xl bg-[#F6F0E7] hover:bg-[#ECE2D3] text-[#625B53] font-bold text-sm transition"
            >
              Clear Date
            </button>
          )}

        </div>

      </div>

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.key}
              className="border border-[#EEE4D5] bg-white rounded-2xl p-5"
            >

              <div
                className={`w-11 h-11 ${card.bg} rounded-xl flex items-center justify-center`}
              >
                <Icon
                  size={21}
                  className={card.iconColor}
                />
              </div>

              <p className="text-sm text-[#8C8276] font-semibold mt-4">
                {card.label}
              </p>

              <h3 className="text-3xl font-black text-[#1C1917] mt-1">
                {card.value}
              </h3>

            </div>
          );
        })}

      </div>

      {/* =====================================================
          ACTIVITY CHART
      ===================================================== */}

      <div className="bg-white rounded-2xl border border-[#EEE4D5] p-5 sm:p-6">

        <div className="mb-6">

          <h3 className="text-lg font-black text-[#1C1917]">
            Driver Activity Trend
          </h3>

          <p className="text-sm text-[#8C8276] mt-1">
            Registration, approval and rejection events grouped by date.
          </p>

        </div>

        <div className="h-[350px]">

          {hasChartData && chartLabels.length > 0 ? (
            <Bar
              data={combinedBarData}
              options={chartOptions}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-[#9C9184] text-sm">
              No analytics data available for the selected period.
            </div>
          )}

        </div>

      </div>

      {/* =====================================================
          REVIEW DISTRIBUTION
      ===================================================== */}

      <div className="grid lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-2xl border border-[#EEE4D5] p-5 sm:p-6">

          <h3 className="text-lg font-black text-[#1C1917]">
            Review Decision Distribution
          </h3>

          <p className="text-sm text-[#8C8276] mt-1 mb-6">
            Comparison of approval and rejection actions during the selected period.
          </p>

          <div className="h-[300px]">

            {totalReviewDecisions > 0 ? (
              <Doughnut
                data={doughnutData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  cutout: "68%",

                  plugins: {
                    legend: {
                      position: "bottom",

                      labels: {
                        usePointStyle: true,
                        padding: 20,
                      },
                    },
                  },
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-[#9C9184] text-sm">
                No driver review decisions available.
              </div>
            )}

          </div>

        </div>

        {/* ===================================================
            REVIEW SUMMARY
        =================================================== */}

        <div className="bg-[#1C1917] rounded-2xl p-6 text-white">

          <p className="text-xs font-bold tracking-[0.16em] text-[#FFD36A]">
            REVIEW ACTIVITY
          </p>

          <h3 className="text-2xl font-black mt-2">
            Decision Summary
          </h3>

          <div className="space-y-6 mt-8">

            {/* APPROVAL SHARE */}

            <div>

              <div className="flex items-center justify-between mb-2">

                <p className="text-white/70 text-sm">
                  Approved Decisions
                </p>

                <p className="font-black">
                  {approvalShare}%
                </p>

              </div>

              <div className="h-2 bg-white/10 rounded-full overflow-hidden">

                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    width: `${approvalShare}%`,
                  }}
                />

              </div>

            </div>

            {/* REJECTION SHARE */}

            <div>

              <div className="flex items-center justify-between mb-2">

                <p className="text-white/70 text-sm">
                  Rejected Decisions
                </p>

                <p className="font-black">
                  {rejectionShare}%
                </p>

              </div>

              <div className="h-2 bg-white/10 rounded-full overflow-hidden">

                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{
                    width: `${rejectionShare}%`,
                  }}
                />

              </div>

            </div>

          </div>

          <div className="mt-8 pt-6 border-t border-white/10">

            <p className="text-white/60 leading-7">
              During the selected analytics period,{" "}
              <strong className="text-white">
                {totalRegistrations}
              </strong>{" "}
              registration event
              {totalRegistrations === 1 ? "" : "s"} occurred.
              Administrators made{" "}
              <strong className="text-white">
                {totalReviewDecisions}
              </strong>{" "}
              review decision
              {totalReviewDecisions === 1 ? "" : "s"}, including{" "}
              <strong className="text-green-400">
                {totalApprovals}
              </strong>{" "}
              approval
              {totalApprovals === 1 ? "" : "s"} and{" "}
              <strong className="text-red-400">
                {totalRejections}
              </strong>{" "}
              rejection
              {totalRejections === 1 ? "" : "s"}.
            </p>

          </div>

        </div>

      </div>

      {/* =====================================================
          INFO
      ===================================================== */}

      <div className="rounded-xl border border-[#F0D48C] bg-[#FFF8E8] px-5 py-4">

        <p className="text-sm text-[#725B27] leading-6">
          Registration counts and review counts are independent activity metrics.
          A driver may register on one date and be approved or rejected on another
          date, so review percentages represent the distribution of review
          decisions rather than a registration conversion rate.
        </p>

      </div>

    </div>
  );
}

export default DriverAnalytics;

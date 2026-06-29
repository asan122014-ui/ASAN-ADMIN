import { useState, useMemo } from "react";
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
  TrendingUp,
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

function DriverAnalytics({ stats = {} }) {
  /* ================= STATE ================= */

  const [selectedDate, setSelectedDate] = useState("");

  /* ================= BACKEND DATA ================= */

  const registrations = stats?.registrations || [];
  const approvals = stats?.approvals || [];

  /* ================= WEEK DAYS ================= */

  const weekDays = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ];

  /* ================= GET DAY ================= */

  const getDay = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
    });

  /* ================= FILTER ================= */

  const filterData = (data) => {
    if (!selectedDate) return data;

    return data.filter((item) => item?._id === selectedDate);
  };

  const filteredRegistrations = useMemo(
    () => filterData(registrations),
    [registrations, selectedDate]
  );

  const filteredApprovals = useMemo(
    () => filterData(approvals),
    [approvals, selectedDate]
  );

  /* ================= NORMALIZE ================= */

  const normalize = (data) => {
    const map = {};

    data.forEach((item) => {
      if (!item?._id) return;

      const day = getDay(item._id);

      map[day] = (map[day] || 0) + (item.count || 0);
    });

    return weekDays.map((day) => map[day] || 0);
  };

  const registrationData = useMemo(
    () => normalize(filteredRegistrations),
    [filteredRegistrations]
  );

  const approvalData = useMemo(
    () => normalize(filteredApprovals),
    [filteredApprovals]
  );

  /* ================= TOTALS ================= */

  const totalRegistrations = filteredRegistrations.reduce(
    (sum, item) => sum + (item.count || 0),
    0
  );

  const totalApprovals = filteredApprovals.reduce(
    (sum, item) => sum + (item.count || 0),
    0
  );

  const approvalRate =
    totalRegistrations > 0
      ? Math.round((totalApprovals / totalRegistrations) * 100)
      : 0;

  const hasRegistrations = totalRegistrations > 0;

  const hasApprovals = totalApprovals > 0;
    /* ================= CHART OPTIONS ================= */

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        labels: {
          color: "#374151",
          font: {
            size: 13,
            weight: "600",
          },
        },
      },

      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },

        ticks: {
          color: "#6b7280",
        },
      },

      y: {
        beginAtZero: true,

        ticks: {
          precision: 0,
          color: "#6b7280",
        },

        grid: {
          color: "#e5e7eb",
        },
      },
    },
  };

  /* ================= DOUGHNUT ================= */

  const doughnutData = {
    labels: ["Approved", "Pending"],

    datasets: [
      {
        data: [
          totalApprovals,
          Math.max(totalRegistrations - totalApprovals, 0),
        ],

        backgroundColor: [
          "#22c55e",
          "#facc15",
        ],

        borderWidth: 0,
      },
    ],
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">

        <div>

          <h2 className="text-3xl font-bold text-slate-800">
            Driver Analytics
          </h2>

          <p className="text-slate-500 mt-2">
            Registration and approval insights from your backend.
          </p>

        </div>

        <div className="flex items-center gap-3">

          <Calendar
            size={18}
            className="text-slate-500"
          />

          <input
            type="date"
            value={selectedDate}
            onChange={(e) =>
              setSelectedDate(e.target.value)
            }
            className="border rounded-xl px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500"
          />

        </div>

      </div>

      {/* SUMMARY CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white shadow-xl">

          <Users size={34} />

          <p className="mt-5 text-indigo-100">
            Total Registrations
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {totalRegistrations}
          </h2>

        </div>

        <div className="rounded-3xl bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white shadow-xl">

          <CheckCircle size={34} />

          <p className="mt-5 text-green-100">
            Total Approvals
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {totalApprovals}
          </h2>

        </div>

        <div className="rounded-3xl bg-gradient-to-r from-orange-500 to-yellow-500 p-6 text-white shadow-xl">

          <TrendingUp size={34} />

          <p className="mt-5 text-orange-100">
            Approval Rate
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {approvalRate}%
          </h2>

        </div>

      </div>

      {/* CHART GRID */}

      <div className="grid lg:grid-cols-2 gap-8">
                {/* ================= REGISTRATION CHART ================= */}

        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6">

          <h3 className="text-lg font-semibold text-slate-700 mb-6">
            Weekly Registrations
          </h3>

          <div className="h-[320px]">

            {hasRegistrations ? (
              <Bar
                data={{
                  labels: weekDays,
                  datasets: [
                    {
                      label: "Registrations",
                      data: registrationData,
                      backgroundColor: "#6366f1",
                      borderRadius: 10,
                    },
                  ],
                }}
                options={chartOptions}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                No registration data available
              </div>
            )}

          </div>

        </div>

        {/* ================= RIGHT COLUMN ================= */}

        <div className="space-y-6">

          {/* APPROVAL CHART */}

          <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6">

            <h3 className="text-lg font-semibold text-slate-700 mb-6">
              Weekly Approvals
            </h3>

            <div className="h-[220px]">

              {hasApprovals ? (
                <Bar
                  data={{
                    labels: weekDays,
                    datasets: [
                      {
                        label: "Approvals",
                        data: approvalData,
                        backgroundColor: "#22c55e",
                        borderRadius: 10,
                      },
                    ],
                  }}
                  options={chartOptions}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  No approval data available
                </div>
              )}

            </div>

          </div>

          {/* DOUGHNUT CHART */}

          <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6">

            <h3 className="text-lg font-semibold text-slate-700 mb-6">
              Approval Distribution
            </h3>

            <div className="h-[250px]">

              {totalRegistrations > 0 ? (
                <Doughnut
                  data={doughnutData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                      },
                    },
                  }}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  No data available
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* ================= SUMMARY ================= */}

      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-xl">

        <h3 className="text-2xl font-bold mb-4">
          Analytics Summary
        </h3>

        <p className="text-slate-300 leading-7">
          A total of <strong>{totalRegistrations}</strong> driver registrations
          have been received. Out of these,
          <strong> {totalApprovals}</strong> drivers have been approved,
          resulting in an approval rate of
          <strong> {approvalRate}%</strong>.
        </p>

      </div>

    </div>
  );
}

export default DriverAnalytics;
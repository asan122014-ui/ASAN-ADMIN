import { useEffect, useState, useMemo } from "react";
import {
  Activity,
  User,
  Clock,
  Search,
  LogIn,
  LogOut,
  CheckCircle,
  XCircle,
} from "lucide-react";

function LogsModal({ logs = [], onClose }) {
  const logList = Array.isArray(logs) ? logs : [];

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const allowedActions = [
    "ADMIN_LOGIN",
    "ADMIN_LOGOUT",
    "DRIVER_APPROVED",
    "DRIVER_REJECTED",
  ];

  /* ================= ESC CLOSE ================= */

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  /* ================= BODY SCROLL LOCK ================= */

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  /* ================= FILTER LOGS ================= */

  const filteredLogs = useMemo(() => {
    return logList.filter((log) => {
      if (!allowedActions.includes(log?.action)) return false;

      const matchesSearch =
        log?.action?.toLowerCase().includes(search.toLowerCase()) ||
        log?.adminId?.username
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        log?.message?.toLowerCase().includes(search.toLowerCase());

      const matchesDate = dateFilter
        ? new Date(log.createdAt).toISOString().split("T")[0] === dateFilter
        : true;

      return matchesSearch && matchesDate;
    });
  }, [logList, search, dateFilter]);

  /* ================= ANALYTICS ================= */

  const analytics = useMemo(() => {
    return logList
      .filter((log) => allowedActions.includes(log?.action))
      .reduce((acc, log) => {
        acc[log.action] = (acc[log.action] || 0) + 1;
        return acc;
      }, {});
  }, [logList]);

  /* ================= LABEL ================= */

  const formatAction = (action) => {
    switch (action) {
      case "ADMIN_LOGIN":
        return "Admin Login";

      case "ADMIN_LOGOUT":
        return "Admin Logout";

      case "DRIVER_APPROVED":
        return "Driver Approved";

      case "DRIVER_REJECTED":
        return "Driver Rejected";

      default:
        return action;
    }
  };

  /* ================= COLORS ================= */

  const getColor = (action) => {
    switch (action) {
      case "ADMIN_LOGIN":
        return "bg-blue-100 text-blue-700";

      case "ADMIN_LOGOUT":
        return "bg-gray-200 text-gray-700";

      case "DRIVER_APPROVED":
        return "bg-green-100 text-green-700";

      case "DRIVER_REJECTED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getDotColor = (action) => {
    switch (action) {
      case "ADMIN_LOGIN":
        return "bg-blue-500";

      case "ADMIN_LOGOUT":
        return "bg-gray-500";

      case "DRIVER_APPROVED":
        return "bg-green-500";

      case "DRIVER_REJECTED":
        return "bg-red-500";

      default:
        return "bg-slate-400";
    }
  };

  const getIcon = (action) => {
    switch (action) {
      case "ADMIN_LOGIN":
        return <LogIn size={18} />;

      case "ADMIN_LOGOUT":
        return <LogOut size={18} />;

      case "DRIVER_APPROVED":
        return <CheckCircle size={18} />;

      case "DRIVER_REJECTED":
        return <XCircle size={18} />;

      default:
        return <Activity size={18} />;
    }
  };
    return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={() => onClose?.()}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[95%] max-w-6xl max-h-[92vh] overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col"
      >
        {/* ================= HEADER ================= */}

        <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-6 text-white">
          <div>
            <h2 className="flex items-center gap-3 text-2xl font-bold">
              <Activity size={24} />
              System Activity Logs
            </h2>

            <p className="mt-1 text-sm text-indigo-100">
              Monitor administrator activity and driver approvals
            </p>
          </div>

          <button
            onClick={() => onClose?.()}
            className="text-2xl font-bold hover:rotate-90 transition"
          >
            ✕
          </button>
        </div>

        {/* ================= FILTERS ================= */}

        <div className="sticky top-0 z-10 bg-white border-b px-8 py-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-4 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* ================= ANALYTICS ================= */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 p-8 border-b bg-slate-50">

          <div className="rounded-2xl bg-blue-50 border border-blue-100 p-5 text-center">
            <LogIn className="mx-auto mb-2 text-blue-600" />
            <p className="text-sm text-slate-500">Logins</p>
            <h3 className="text-2xl font-bold text-blue-700">
              {analytics.ADMIN_LOGIN || 0}
            </h3>
          </div>

          <div className="rounded-2xl bg-gray-100 border border-gray-200 p-5 text-center">
            <LogOut className="mx-auto mb-2 text-gray-600" />
            <p className="text-sm text-slate-500">Logouts</p>
            <h3 className="text-2xl font-bold text-gray-700">
              {analytics.ADMIN_LOGOUT || 0}
            </h3>
          </div>

          <div className="rounded-2xl bg-green-50 border border-green-100 p-5 text-center">
            <CheckCircle className="mx-auto mb-2 text-green-600" />
            <p className="text-sm text-slate-500">Approved</p>
            <h3 className="text-2xl font-bold text-green-700">
              {analytics.DRIVER_APPROVED || 0}
            </h3>
          </div>

          <div className="rounded-2xl bg-red-50 border border-red-100 p-5 text-center">
            <XCircle className="mx-auto mb-2 text-red-600" />
            <p className="text-sm text-slate-500">Rejected</p>
            <h3 className="text-2xl font-bold text-red-700">
              {analytics.DRIVER_REJECTED || 0}
            </h3>
          </div>

        </div>

        {/* ================= LOG LIST ================= */}

        <div className="flex-1 overflow-y-auto px-8 py-8">

          {filteredLogs.length === 0 ? (

            <div className="flex flex-col items-center justify-center py-20 text-slate-400">

              <Activity size={55} />

              <h3 className="mt-5 text-xl font-semibold">
                No Logs Found
              </h3>

              <p className="mt-2">
                Try changing your search or date filter.
              </p>

            </div>

          ) : (

            <div className="relative">

              <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-slate-200"></div>

              {filteredLogs.map((log, index) => (

                <div
                  key={log?._id || index}
                  className="relative flex gap-6 mb-8"
                >

                  <div
                    className={`w-4 h-4 rounded-full mt-6 ${getDotColor(
                      log.action
                    )}`}
                  />

                  <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300">

                    <div className="flex justify-between items-center mb-4">

                      <div
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getColor(
                          log.action
                        )}`}
                      >
                        {getIcon(log.action)}
                        {formatAction(log.action)}
                      </div>

                      <span className="flex items-center gap-2 text-sm text-slate-400">
                        <Clock size={15} />
                        {log.createdAt
                          ? new Date(log.createdAt).toLocaleString()
                          : "--"}
                      </span>

                    </div>

                    <div className="flex items-center gap-2 text-slate-700 mb-3">
                      <User size={16} />

                      <span className="font-semibold">
                        {log.adminId?.username || "Administrator"}
                      </span>
                    </div>

                    {log.driverId && (
                      <p className="text-slate-600 mb-2">
                        Driver:
                        <strong> {log.driverId.name}</strong>
                        {" • "}
                        {log.driverId.driverId}
                      </p>
                    )}

                    {log.message && (
                      <div className="rounded-xl bg-slate-50 border p-4 text-slate-600">
                        {log.message}
                      </div>
                    )}

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* ================= FOOTER ================= */}

        <div className="border-t bg-slate-50 px-8 py-4 text-center text-sm text-slate-500">
          Showing{" "}
          <strong>{filteredLogs.length}</strong>{" "}
          log record{filteredLogs.length !== 1 ? "s" : ""}
        </div>

      </div>
    </div>
  );
}

export default LogsModal;
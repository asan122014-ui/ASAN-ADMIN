import { useMemo } from "react";
import {
  ShieldCheck,
  LogIn,
  LogOut,
  CheckCircle,
  XCircle,
  Clock3,
} from "lucide-react";

function AdminTimeline({ logs = [] }) {
  const logList = Array.isArray(logs) ? logs : [];

  /* ================= ADMIN NAME ================= */

  const getAdminName = (log) => {
    if (typeof log?.adminId === "object") {
      return log.adminId?.username || "Administrator";
    }
    return "Administrator";
  };

  /* ================= INITIALS ================= */

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  /* ================= DATE ================= */

  const formatDate = (date) => {
    if (!date) return "Unknown";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* ================= ICON ================= */

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
        return <ShieldCheck size={18} />;
    }
  };

  /* ================= COLORS ================= */

  const getColor = (action) => {
    switch (action) {
      case "ADMIN_LOGIN":
        return "bg-blue-100 text-blue-600";

      case "ADMIN_LOGOUT":
        return "bg-slate-200 text-slate-700";

      case "DRIVER_APPROVED":
        return "bg-green-100 text-green-600";

      case "DRIVER_REJECTED":
        return "bg-red-100 text-red-600";

      default:
        return "bg-indigo-100 text-indigo-600";
    }
  };

  /* ================= SORT ================= */

  const sortedLogs = useMemo(() => {
    return [...logList].sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    );
  }, [logList]);

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">

      {/* ================= HEADER ================= */}

      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-700 p-6 flex items-center justify-between">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-white">
            <ShieldCheck size={28} />
          </div>

          <div>

            <h2 className="text-2xl font-bold text-white">
              Admin Activity Timeline
            </h2>

            <p className="text-slate-300 text-sm mt-1">
              Recent administrator actions across the platform
            </p>

          </div>

        </div>

        <div className="bg-white/15 text-white px-5 py-3 rounded-2xl text-center">

          <p className="text-xs uppercase tracking-wider opacity-80">
            Activities
          </p>

          <h3 className="text-2xl font-bold">
            {sortedLogs.length}
          </h3>

        </div>

      </div>

      {/* ================= TIMELINE ================= */}

      <div className="relative p-8">

        <div className="absolute left-14 top-8 bottom-8 w-[2px] bg-slate-200">
                  {sortedLogs.length === 0 ? (

          <div className="py-20 flex flex-col items-center justify-center text-slate-400">

            <Clock3 size={48} className="mb-4 opacity-50" />

            <h3 className="text-xl font-semibold">
              No Activity Found
            </h3>

            <p className="mt-2 text-sm">
              Administrator actions will appear here.
            </p>

          </div>

        ) : (

          <div className="space-y-8">

            {sortedLogs.map((log, index) => {

              const adminName = getAdminName(log);

              return (

                <div
                  key={log?._id || index}
                  className="relative flex gap-6 group"
                >

                  {/* Timeline Dot */}

                  <div className="relative z-10">

                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${getColor(
                        log?.action
                      )}`}
                    >
                      {getIcon(log?.action)}
                    </div>

                  </div>

                  {/* Activity Card */}

                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:bg-white hover:shadow-xl transition-all duration-300">

                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">

                      <div className="flex items-start gap-4">

                        {/* Avatar */}

                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white flex items-center justify-center font-bold shadow">
                          {getInitials(adminName)}
                        </div>

                        <div>

                          <h3 className="text-lg font-semibold text-slate-800">
                            {adminName}
                          </h3>

                          <p className="text-slate-500 text-sm mt-1">
                            {log?.message || "No activity description available"}
                          </p>

                          {log?.driverId && (
                            <p className="text-sm text-slate-600 mt-3">
                              <strong>Driver:</strong>{" "}
                              {log.driverId?.name || "-"}
                            </p>
                          )}

                        </div>

                      </div>

                      <div className="text-right">

                        <span
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getColor(
                            log?.action
                          )}`}
                        >
                          {getIcon(log?.action)}
                          {(log?.action || "UNKNOWN")
                            .replace(/_/g, " ")
                            .toUpperCase()}
                        </span>

                        <p className="text-xs text-slate-400 mt-3">
                          {formatDate(log?.createdAt)}
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              );
            })}

          </div>

        )}

      </div>

      {/* ================= FOOTER ================= */}

      <div className="border-t bg-slate-50 px-8 py-5 flex justify-between items-center">

        <div>
          <h4 className="font-semibold text-slate-700">
            Activity Monitoring
          </h4>

          <p className="text-sm text-slate-500">
            Timeline updates automatically as administrators perform actions.
          </p>
        </div>

        <span className="text-xs text-slate-400">
          Updated: {new Date().toLocaleString()}
        </span>

      </div>

    </div>
  </div>
  );
}

export default AdminTimeline;
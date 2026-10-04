import { useMemo } from "react";

import {
  ShieldCheck,
  LogIn,
  LogOut,
  CheckCircle,
  XCircle,
  Clock3,
  UserPlus,
} from "lucide-react";

function AdminTimeline({
  logs = [],
}) {
  /* =========================================================
     SAFE LOG LIST
  ========================================================= */

  const logList =
    Array.isArray(logs)
      ? logs
      : [];

  /* =========================================================
     ADMIN NAME
  ========================================================= */

  const getAdminName = (
    log
  ) => {
    if (
      typeof log?.adminId ===
        "object" &&
      log?.adminId
    ) {
      return (
        log.adminId.email ||
        "Administrator"
      );
    }

    return "Administrator";
  };

  /* =========================================================
     ADMIN ROLE
  ========================================================= */

  const getAdminRole = (
    log
  ) => {
    const role =
      log?.adminId?.role;

    if (
      role ===
      "superadmin"
    ) {
      return "Super Admin";
    }

    if (
      role ===
      "reviewer"
    ) {
      return "Reviewer";
    }

    return "Admin";
  };

  /* =========================================================
     INITIALS
  ========================================================= */

  const getInitials = (
    value
  ) => {
    const text =
      String(
        value || ""
      ).trim();

    if (!text) {
      return "AD";
    }

    /*
      For email addresses, use the
      first part before @.
    */

    const namePart =
      text.includes("@")
        ? text.split("@")[0]
        : text;

    const pieces =
      namePart
        .replace(
          /[._-]+/g,
          " "
        )
        .split(" ")
        .filter(Boolean);

    if (
      pieces.length === 1
    ) {
      return pieces[0]
        .substring(0, 2)
        .toUpperCase();
    }

    return pieces
      .slice(0, 2)
      .map(
        (word) =>
          word[0]
      )
      .join("")
      .toUpperCase();
  };

  /* =========================================================
     DATE
  ========================================================= */

  const formatDate = (
    value
  ) => {
    if (!value) {
      return "Unknown";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "Unknown";
    }

    return date.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  /* =========================================================
     ACTION LABEL
  ========================================================= */

  const formatAction = (
    action
  ) => {
    switch (
      String(
        action || ""
      ).toUpperCase()
    ) {
      case "ADMIN_LOGIN":
        return "Admin Login";

      case "ADMIN_LOGOUT":
        return "Admin Logout";

      case "ADMIN_CREATED":
        return "Admin Created";

      case "DRIVER_APPROVED":
        return "Driver Approved";

      case "DRIVER_REJECTED":
        return "Driver Rejected";

      default:
        return String(
          action ||
            "Unknown Activity"
        )
          .replaceAll(
            "_",
            " "
          )
          .toLowerCase()
          .replace(
            /\b\w/g,
            (character) =>
              character.toUpperCase()
          );
    }
  };

  /* =========================================================
     ICON
  ========================================================= */

  const getIcon = (
    action
  ) => {
    switch (
      String(
        action || ""
      ).toUpperCase()
    ) {
      case "ADMIN_LOGIN":
        return (
          <LogIn
            size={18}
          />
        );

      case "ADMIN_LOGOUT":
        return (
          <LogOut
            size={18}
          />
        );

      case "ADMIN_CREATED":
        return (
          <UserPlus
            size={18}
          />
        );

      case "DRIVER_APPROVED":
        return (
          <CheckCircle
            size={18}
          />
        );

      case "DRIVER_REJECTED":
        return (
          <XCircle
            size={18}
          />
        );

      default:
        return (
          <ShieldCheck
            size={18}
          />
        );
    }
  };

  /* =========================================================
     COLORS
  ========================================================= */

  const getColor = (
    action
  ) => {
    switch (
      String(
        action || ""
      ).toUpperCase()
    ) {
      case "ADMIN_LOGIN":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "ADMIN_LOGOUT":
        return "bg-gray-100 text-gray-700 border-gray-200";

      case "ADMIN_CREATED":
        return "bg-purple-50 text-purple-700 border-purple-200";

      case "DRIVER_APPROVED":
        return "bg-green-50 text-green-700 border-green-200";

      case "DRIVER_REJECTED":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-[#FFF3D1] text-[#B87700] border-[#F0D48C]";
    }
  };

  /* =========================================================
     SORT LOGS
  ========================================================= */

  const sortedLogs =
    useMemo(() => {
      return [
        ...logList,
      ].sort(
        (
          first,
          second
        ) =>
          new Date(
            second.createdAt ||
              0
          ).getTime() -
          new Date(
            first.createdAt ||
              0
          ).getTime()
      );
    }, [logList]);

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="bg-[#FFFDF8] rounded-3xl border border-[#EEE4D5] overflow-hidden shadow-sm">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="bg-[#1C1917] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-2xl bg-[#FFB000] text-[#1C1917] flex items-center justify-center shrink-0">

            <ShieldCheck
              size={27}
            />

          </div>

          <div>

            <p className="text-xs font-bold tracking-[0.16em] text-[#FFD36A] mb-1">
              AUDIT ACTIVITY
            </p>

            <h2 className="text-2xl font-black text-white">
              Admin Activity Timeline
            </h2>

            <p className="text-white/60 text-sm mt-1">
              Recent administrator actions across the platform.
            </p>

          </div>

        </div>

        <div className="bg-white/10 border border-white/10 text-white px-5 py-3 rounded-2xl self-start sm:self-auto">

          <p className="text-[10px] uppercase tracking-wider text-white/50 font-bold">
            Activities
          </p>

          <h3 className="text-2xl font-black text-[#FFD36A] mt-1">
            {
              sortedLogs.length
            }
          </h3>

        </div>

      </div>

      {/* =====================================================
          TIMELINE
      ===================================================== */}

      <div className="relative p-5 sm:p-8 bg-[#FFF9EE]">

        {sortedLogs.length ===
        0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">

            <div className="w-20 h-20 rounded-3xl bg-[#FFF3D1] border border-[#F0D48C] flex items-center justify-center">

              <Clock3
                size={34}
                className="text-[#B87700]"
              />

            </div>

            <h3 className="text-xl font-black text-[#1C1917] mt-5">
              No Activity Found
            </h3>

            <p className="mt-2 text-sm text-[#8C8276]">
              Administrator actions will appear here.
            </p>

          </div>
        ) : (
          <div className="relative">

            {/* TIMELINE LINE */}

            <div className="absolute left-[23px] top-6 bottom-6 w-[2px] bg-[#E5D8C8]" />

            <div className="space-y-6">

              {sortedLogs.map(
                (
                  log,
                  index
                ) => {
                  const adminName =
                    getAdminName(
                      log
                    );

                  const adminRole =
                    getAdminRole(
                      log
                    );

                  const color =
                    getColor(
                      log?.action
                    );

                  return (
                    <div
                      key={
                        log?._id ||
                        index
                      }
                      className="relative flex gap-5"
                    >

                      {/* =====================================
                          ACTION ICON
                      ===================================== */}

                      <div className="relative z-10 shrink-0">

                        <div
                          className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-sm ${color}`}
                        >
                          {
                            getIcon(
                              log?.action
                            )
                          }
                        </div>

                      </div>

                      {/* =====================================
                          CARD
                      ===================================== */}

                      <div className="flex-1 min-w-0 bg-white border border-[#EEE4D5] rounded-2xl p-5 sm:p-6 hover:shadow-md transition">

                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-5">

                          {/* =================================
                              ADMIN + MESSAGE
                          ================================= */}

                          <div className="flex items-start gap-4 min-w-0">

                            <div className="w-11 h-11 rounded-full bg-[#1C1917] text-[#FFD36A] flex items-center justify-center font-black text-sm shrink-0">

                              {
                                getInitials(
                                  adminName
                                )
                              }

                            </div>

                            <div className="min-w-0">

                              <div className="flex flex-wrap items-center gap-2">

                                <h3 className="font-black text-[#1C1917] break-all">
                                  {
                                    adminName
                                  }
                                </h3>

                                <span className="px-2.5 py-1 rounded-full bg-[#F6F0E7] text-[#625B53] text-[10px] font-black uppercase tracking-wide">
                                  {
                                    adminRole
                                  }
                                </span>

                              </div>

                              <p className="text-[#8C8276] text-sm mt-2 leading-6">
                                {
                                  log?.message ||
                                  "No activity description available."
                                }
                              </p>

                              {/* DRIVER */}

                              {log?.driverId && (
                                <div className="mt-4 bg-[#FFF9EE] border border-[#EEE4D5] rounded-xl p-4">

                                  <p className="text-xs font-bold text-[#8C8276] uppercase tracking-wide">
                                    Driver
                                  </p>

                                  <p className="font-black text-[#1C1917] mt-1">
                                    {
                                      log
                                        .driverId
                                        ?.name ||
                                      "Unknown Driver"
                                    }
                                  </p>

                                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-[#8C8276]">

                                    {log
                                      .driverId
                                      ?.driverId && (
                                      <span>
                                        ID:{" "}
                                        {
                                          log
                                            .driverId
                                            .driverId
                                        }
                                      </span>
                                    )}

                                    {log
                                      .driverId
                                      ?.status && (
                                      <span className="capitalize">
                                        Status:{" "}
                                        {
                                          log
                                            .driverId
                                            .status
                                        }
                                      </span>
                                    )}

                                  </div>

                                </div>
                              )}

                            </div>

                          </div>

                          {/* =================================
                              ACTION + DATE
                          ================================= */}

                          <div className="lg:text-right shrink-0">

                            <span
                              className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border text-xs font-bold ${color}`}
                            >
                              {
                                getIcon(
                                  log?.action
                                )
                              }

                              {
                                formatAction(
                                  log?.action
                                )
                              }
                            </span>

                            <p className="text-xs text-[#9C9184] mt-3">
                              {
                                formatDate(
                                  log?.createdAt
                                )
                              }
                            </p>

                          </div>

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          </div>
        )}

      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="border-t border-[#EEE4D5] bg-[#FFFDF8] px-5 sm:px-8 py-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

        <div>

          <h4 className="font-black text-[#1C1917]">
            Activity Monitoring
          </h4>

          <p className="text-sm text-[#8C8276] mt-1">
            Audit records are generated when administrators perform tracked actions.
          </p>

        </div>

        <span className="text-xs text-[#9C9184]">
          Updated:{" "}
          {new Date().toLocaleString()}
        </span>

      </div>

    </div>
  );
}

export default AdminTimeline;
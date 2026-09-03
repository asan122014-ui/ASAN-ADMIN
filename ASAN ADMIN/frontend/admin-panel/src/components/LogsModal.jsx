import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Activity,
  User,
  Clock,
  Search,
  LogIn,
  LogOut,
  CheckCircle,
  XCircle,
  UserPlus,
  ShieldCheck,
  X,
  Car,
} from "lucide-react";

/* =========================================================
   LOGS MODAL
========================================================= */

function LogsModal({
  logs = [],
  onClose,
}) {
  const logList =
    Array.isArray(logs)
      ? logs
      : [];

  /* =========================================================
     STATE
  ========================================================= */

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    dateFilter,
    setDateFilter,
  ] = useState("");

  /* =========================================================
     ESC CLOSE
  ========================================================= */

  useEffect(() => {
    const handleEsc = (
      event
    ) => {
      if (
        event.key ===
        "Escape"
      ) {
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
     BODY SCROLL LOCK
  ========================================================= */

  useEffect(() => {
    const previousOverflow =
      document.body.style
        .overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, []);

  /* =========================================================
     DATE FORMAT
  ========================================================= */

  const formatDateTime = (
    value
  ) => {
    if (!value) {
      return "--";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "--";
    }

    return date.toLocaleString();
  };

  /* =========================================================
     DATE KEY
  ========================================================= */

  const getDateKey = (
    value
  ) => {
    if (!value) {
      return "";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "";
    }

    const year =
      date.getFullYear();

    const month =
      String(
        date.getMonth() + 1
      ).padStart(
        2,
        "0"
      );

    const day =
      String(
        date.getDate()
      ).padStart(
        2,
        "0"
      );

    return `${year}-${month}-${day}`;
  };

  /* =========================================================
     FILTER LOGS
  ========================================================= */

  const filteredLogs =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return logList.filter(
        (
          log
        ) => {
          const action =
            String(
              log?.action || ""
            ).toLowerCase();

          const adminEmail =
            String(
              log?.adminId
                ?.email || ""
            ).toLowerCase();

          const adminRole =
            String(
              log?.adminId
                ?.role || ""
            ).toLowerCase();

          const driverName =
            String(
              log?.driverId
                ?.name || ""
            ).toLowerCase();

          const driverCode =
            String(
              log?.driverId
                ?.driverId || ""
            ).toLowerCase();

          const driverEmail =
            String(
              log?.driverId
                ?.email || ""
            ).toLowerCase();

          const message =
            String(
              log?.message || ""
            ).toLowerCase();

          const matchesSearch =
            !normalizedSearch ||
            action.includes(
              normalizedSearch
            ) ||
            adminEmail.includes(
              normalizedSearch
            ) ||
            adminRole.includes(
              normalizedSearch
            ) ||
            driverName.includes(
              normalizedSearch
            ) ||
            driverCode.includes(
              normalizedSearch
            ) ||
            driverEmail.includes(
              normalizedSearch
            ) ||
            message.includes(
              normalizedSearch
            );

          const matchesDate =
            !dateFilter ||
            getDateKey(
              log?.createdAt
            ) === dateFilter;

          return (
            matchesSearch &&
            matchesDate
          );
        }
      );
    }, [
      logList,
      search,
      dateFilter,
    ]);

  /* =========================================================
     ANALYTICS
  ========================================================= */

  const analytics =
    useMemo(() => {
      return logList.reduce(
        (
          accumulator,
          log
        ) => {
          const action =
            String(
              log?.action || ""
            ).toUpperCase();

          if (!action) {
            return accumulator;
          }

          accumulator[
            action
          ] =
            (
              accumulator[
                action
              ] || 0
            ) + 1;

          return accumulator;
        },
        {}
      );
    }, [logList]);

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
          action || "Activity"
        )
          .replaceAll(
            "_",
            " "
          )
          .toLowerCase()
          .replace(
            /\b\w/g,
            (
              character
            ) =>
              character.toUpperCase()
          );
    }
  };

  /* =========================================================
     ACTION STYLE
  ========================================================= */

  const getStyle = (
    action
  ) => {
    switch (
      String(
        action || ""
      ).toUpperCase()
    ) {
      case "ADMIN_LOGIN":
        return {
          badge:
            "bg-blue-50 text-blue-700 border-blue-200",

          dot:
            "bg-blue-500",
        };

      case "ADMIN_LOGOUT":
        return {
          badge:
            "bg-gray-100 text-gray-700 border-gray-200",

          dot:
            "bg-gray-500",
        };

      case "ADMIN_CREATED":
        return {
          badge:
            "bg-purple-50 text-purple-700 border-purple-200",

          dot:
            "bg-purple-500",
        };

      case "DRIVER_APPROVED":
        return {
          badge:
            "bg-green-50 text-green-700 border-green-200",

          dot:
            "bg-green-500",
        };

      case "DRIVER_REJECTED":
        return {
          badge:
            "bg-red-50 text-red-700 border-red-200",

          dot:
            "bg-red-500",
        };

      default:
        return {
          badge:
            "bg-[#FFF3D1] text-[#B87700] border-[#F0D48C]",

          dot:
            "bg-[#FFB000]",
        };
    }
  };

  /* =========================================================
     ACTION ICON
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
            size={17}
          />
        );

      case "ADMIN_LOGOUT":
        return (
          <LogOut
            size={17}
          />
        );

      case "ADMIN_CREATED":
        return (
          <UserPlus
            size={17}
          />
        );

      case "DRIVER_APPROVED":
        return (
          <CheckCircle
            size={17}
          />
        );

      case "DRIVER_REJECTED":
        return (
          <XCircle
            size={17}
          />
        );

      default:
        return (
          <Activity
            size={17}
          />
        );
    }
  };

  /* =========================================================
     CLEAR FILTERS
  ========================================================= */

  const clearFilters =
    () => {
      setSearch("");
      setDateFilter("");
    };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6"
      onClick={() =>
        onClose?.()
      }
    >
      <div
        onClick={(
          event
        ) =>
          event.stopPropagation()
        }
        className="w-full max-w-6xl max-h-[92vh] overflow-hidden rounded-3xl bg-[#FFFDF8] border border-[#EED69B] shadow-2xl flex flex-col"
      >

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="flex items-center justify-between gap-5 bg-[#1C1917] px-5 sm:px-8 py-6 text-white">

          <div className="flex items-center gap-4 min-w-0">

            <div className="w-13 h-13 min-w-[52px] min-h-[52px] rounded-2xl bg-[#FFB000] text-[#1C1917] flex items-center justify-center">

              <Activity
                size={25}
              />

            </div>

            <div className="min-w-0">

              <p className="text-xs font-bold tracking-[0.18em] text-[#FFD36A] mb-1">
                AUDIT TRAIL
              </p>

              <h2 className="text-2xl sm:text-3xl font-black">
                System Activity Logs
              </h2>

              <p className="mt-1 text-sm text-white/60">
                Review administrator activity and driver verification actions.
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={() =>
              onClose?.()
            }
            className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition shrink-0"
          >
            <X
              size={21}
            />
          </button>

        </div>

        {/* ===================================================
            FILTERS
        =================================================== */}

        <div className="bg-[#FFFDF8] border-b border-[#EEE4D5] px-5 sm:px-8 py-5">

          <div className="flex flex-col lg:flex-row gap-4">

            <div className="relative flex-1">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9C9184]"
              />

              <input
                type="text"
                placeholder="Search action, admin, driver or message..."
                value={
                  search
                }
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target
                      .value
                  )
                }
                className="w-full h-12 rounded-xl border border-[#E4D8C8] bg-white pl-11 pr-4 text-[#1C1917] outline-none focus:border-[#FFB000] focus:ring-4 focus:ring-[#FFB000]/10"
              />

            </div>

            <input
              type="date"
              value={
                dateFilter
              }
              onChange={(
                event
              ) =>
                setDateFilter(
                  event.target
                    .value
                )
              }
              className="h-12 rounded-xl border border-[#E4D8C8] bg-white px-4 text-[#4A433B] outline-none focus:border-[#FFB000] focus:ring-4 focus:ring-[#FFB000]/10"
            />

            {(search ||
              dateFilter) && (
              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="h-12 px-5 rounded-xl bg-[#F6F0E7] hover:bg-[#ECE2D3] text-[#625B53] font-bold transition"
              >
                Clear
              </button>
            )}

          </div>

        </div>

        {/* ===================================================
            ANALYTICS
        =================================================== */}

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 p-5 sm:p-8 border-b border-[#EEE4D5] bg-[#FFF9EE]">

          {/* LOGIN */}

          <div className="rounded-2xl bg-blue-50 border border-blue-200 p-4 text-center">

            <LogIn
              className="mx-auto mb-2 text-blue-600"
              size={21}
            />

            <p className="text-xs font-semibold text-[#8C8276]">
              Logins
            </p>

            <h3 className="text-2xl font-black text-blue-700 mt-1">
              {
                analytics.ADMIN_LOGIN ||
                0
              }
            </h3>

          </div>

          {/* LOGOUT */}

          <div className="rounded-2xl bg-gray-100 border border-gray-200 p-4 text-center">

            <LogOut
              className="mx-auto mb-2 text-gray-600"
              size={21}
            />

            <p className="text-xs font-semibold text-[#8C8276]">
              Logouts
            </p>

            <h3 className="text-2xl font-black text-gray-700 mt-1">
              {
                analytics.ADMIN_LOGOUT ||
                0
              }
            </h3>

          </div>

          {/* CREATED */}

          <div className="rounded-2xl bg-purple-50 border border-purple-200 p-4 text-center">

            <UserPlus
              className="mx-auto mb-2 text-purple-600"
              size={21}
            />

            <p className="text-xs font-semibold text-[#8C8276]">
              Admins Created
            </p>

            <h3 className="text-2xl font-black text-purple-700 mt-1">
              {
                analytics.ADMIN_CREATED ||
                0
              }
            </h3>

          </div>

          {/* APPROVED */}

          <div className="rounded-2xl bg-green-50 border border-green-200 p-4 text-center">

            <CheckCircle
              className="mx-auto mb-2 text-green-600"
              size={21}
            />

            <p className="text-xs font-semibold text-[#8C8276]">
              Approved
            </p>

            <h3 className="text-2xl font-black text-green-700 mt-1">
              {
                analytics.DRIVER_APPROVED ||
                0
              }
            </h3>

          </div>

          {/* REJECTED */}

          <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-center col-span-2 lg:col-span-1">

            <XCircle
              className="mx-auto mb-2 text-red-600"
              size={21}
            />

            <p className="text-xs font-semibold text-[#8C8276]">
              Rejected
            </p>

            <h3 className="text-2xl font-black text-red-700 mt-1">
              {
                analytics.DRIVER_REJECTED ||
                0
              }
            </h3>

          </div>

        </div>

        {/* ===================================================
            LOG LIST
        =================================================== */}

        <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-7 bg-[#FFFDF8]">

          {filteredLogs.length ===
          0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">

              <div className="w-20 h-20 rounded-3xl bg-[#FFF3D1] border border-[#F0D48C] flex items-center justify-center">

                <Activity
                  size={34}
                  className="text-[#B87700]"
                />

              </div>

              <h3 className="mt-5 text-xl font-black text-[#1C1917]">
                No Logs Found
              </h3>

              <p className="mt-2 text-sm text-[#8C8276]">
                No activity records match the current filters.
              </p>

            </div>
          ) : (
            <div className="relative">

              <div className="absolute left-[7px] sm:left-[9px] top-3 bottom-3 w-[2px] bg-[#EEE4D5]" />

              <div className="space-y-5">

                {filteredLogs.map(
                  (
                    log,
                    index
                  ) => {
                    const style =
                      getStyle(
                        log?.action
                      );

                    return (
                      <div
                        key={
                          log?._id ||
                          index
                        }
                        className="relative flex gap-4 sm:gap-6"
                      >

                        {/* TIMELINE DOT */}

                        <div
                          className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full mt-7 shrink-0 border-4 border-[#FFFDF8] ring-2 ring-[#EEE4D5] ${style.dot}`}
                        />

                        {/* LOG CARD */}

                        <div className="flex-1 rounded-2xl border border-[#EEE4D5] bg-white p-5 sm:p-6 hover:shadow-md transition min-w-0">

                          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-3 mb-5">

                            <div
                              className={`self-start flex items-center gap-2 px-3 py-2 rounded-full border text-xs font-bold ${style.badge}`}
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
                            </div>

                            <span className="flex items-center gap-2 text-xs text-[#8C8276]">

                              <Clock
                                size={14}
                              />

                              {
                                formatDateTime(
                                  log?.createdAt
                                )
                              }

                            </span>

                          </div>

                          {/* ADMIN */}

                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 mb-4">

                            <div className="flex items-center gap-2 text-[#625B53]">

                              <User
                                size={16}
                                className="text-[#B87700]"
                              />

                              <span className="font-semibold break-all">
                                {
                                  log
                                    ?.adminId
                                    ?.email ||
                                  "Administrator"
                                }
                              </span>

                            </div>

                            {log?.adminId
                              ?.role && (
                              <span className="self-start px-2.5 py-1 rounded-full bg-[#F6F0E7] text-[#625B53] text-[10px] font-black uppercase tracking-wide">
                                {
                                  log
                                    .adminId
                                    .role ===
                                  "superadmin"
                                    ? "Super Admin"
                                    : "Reviewer"
                                }
                              </span>
                            )}

                          </div>

                          {/* DRIVER */}

                          {log?.driverId && (
                            <div className="rounded-xl bg-[#FFF9EE] border border-[#EEE4D5] p-4 mb-4">

                              <div className="flex items-start gap-3">

                                <Car
                                  size={17}
                                  className="text-[#B87700] mt-0.5 shrink-0"
                                />

                                <div>

                                  <p className="text-xs text-[#8C8276] font-semibold">
                                    Driver
                                  </p>

                                  <p className="font-bold text-[#1C1917] mt-1">
                                    {
                                      log
                                        .driverId
                                        .name ||
                                      "Unknown Driver"
                                    }
                                  </p>

                                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-[#8C8276]">

                                    {log
                                      .driverId
                                      .driverId && (
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
                                      .email && (
                                      <span>
                                        {
                                          log
                                            .driverId
                                            .email
                                        }
                                      </span>
                                    )}

                                  </div>

                                </div>

                              </div>

                            </div>
                          )}

                          {/* MESSAGE */}

                          {log?.message && (
                            <div className="rounded-xl bg-[#F8F3EB] border border-[#EEE4D5] p-4 text-sm leading-6 text-[#625B53]">
                              {
                                log.message
                              }
                            </div>
                          )}

                          {/* METADATA */}

                          {log?.metadata &&
                            Object.keys(
                              log.metadata
                            ).length >
                              0 && (
                              <details className="mt-4">

                                <summary className="cursor-pointer text-xs font-bold text-[#B87700] select-none">
                                  View metadata
                                </summary>

                                <pre className="mt-3 overflow-x-auto rounded-xl bg-[#1C1917] text-white/80 p-4 text-xs whitespace-pre-wrap break-all">
                                  {JSON.stringify(
                                    log.metadata,
                                    null,
                                    2
                                  )}
                                </pre>

                              </details>
                            )}

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            </div>
          )}

        </div>

        {/* ===================================================
            FOOTER
        =================================================== */}

        <div className="border-t border-[#EEE4D5] bg-[#FFF9EE] px-5 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-[#8C8276]">

          <span>
            Showing{" "}
            <strong className="text-[#1C1917]">
              {
                filteredLogs.length
              }
            </strong>{" "}
            log record
            {filteredLogs.length !==
            1
              ? "s"
              : ""}
          </span>

          <div className="flex items-center gap-2">

            <ShieldCheck
              size={15}
              className="text-[#B87700]"
            />

            <span>
              Super Admin audit access
            </span>

          </div>

        </div>

      </div>
    </div>
  );
}

export default LogsModal;
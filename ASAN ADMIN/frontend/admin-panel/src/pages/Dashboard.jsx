import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { io } from "socket.io-client";

import {
  RefreshCw,
} from "lucide-react";

import axios from "axios";

import Topbar from "../components/Topbar";
import StatsPanel from "../components/StatsPanel";
import DriverTable from "../components/DriverTable";
import DriverDetailDrawer from "../components/DriverDetailDrawer";
import AnalyticsModal from "../components/AnalyticsModal";
import LogsModal from "../components/LogsModal";
import ParentTable from "../components/ParentTable";
import PendingAlert from "../components/PendingAlert";
import LocationChangeRequests from "../components/LocationChangeRequests";

import BillingSettings from "./BillingSettings";

import {
  getDashboardStats,
  getDrivers,
  getAdminAnalytics,
  getAdminLogs,
} from "../services/adminService";

import {
  getAdminToken,
  getStoredAdminRole,
} from "../services/adminAuthService";

import {
  getDriverRequests,
  assignDriver,
} from "../services/driverRequestService";

/* =========================================================
   API BASE URL
========================================================= */

const BASE_URL =
  import.meta.env
    .VITE_API_URL ||
  "https://asan-driverapp.onrender.com";

/* =========================================================
   RESPONSE ARRAY HELPER
========================================================= */

const extractArray = (
  response
) => {
  /*
    Supports:

    1.
    {
      success: true,
      data: [...]
    }

    2. Axios response:
    {
      data: {
        success: true,
        data: [...]
      }
    }

    3. Direct array:
    [...]
  */

  if (
    Array.isArray(
      response
    )
  ) {
    return response;
  }

  if (
    Array.isArray(
      response?.data
    )
  ) {
    return response.data;
  }

  if (
    Array.isArray(
      response?.data?.data
    )
  ) {
    return response.data.data;
  }

  return [];
};

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard() {
  /* =========================================================
     VIEW
  ========================================================= */

  const [
    view,
    setView,
  ] =
    useState(
      "drivers"
    );

  /* =========================================================
     DRIVER DATA
  ========================================================= */

  const [
    drivers,
    setDrivers,
  ] =
    useState([]);

  const [
    filteredDrivers,
    setFilteredDrivers,
  ] =
    useState([]);

  const [
    selectedDriver,
    setSelectedDriver,
  ] =
    useState(null);

  /* =========================================================
     PARENT DATA
  ========================================================= */

  const [
    parents,
    setParents,
  ] =
    useState([]);

  /* =========================================================
     DRIVER REQUESTS
  ========================================================= */

  const [
    driverRequests,
    setDriverRequests,
  ] =
    useState([]);

  const [
    selectedRequest,
    setSelectedRequest,
  ] =
    useState(null);

  const [
    loadingRequests,
    setLoadingRequests,
  ] =
    useState(false);

  /* =========================================================
     ANALYTICS
  ========================================================= */

  const [
    analyticsData,
    setAnalyticsData,
  ] =
    useState({
      summary: {},
      registrations: [],
      approvals: [],
      rejections: [],
    });

  /* =========================================================
     STATS
  ========================================================= */

  const [
    stats,
    setStats,
  ] =
    useState({
      totalDrivers: 0,
      approvedDrivers: 0,
      pendingDrivers: 0,
      rejectedDrivers: 0,
      totalStudents: 0,
      totalTrips: 0,
    });

  /* =========================================================
     UI STATE
  ========================================================= */

  const [
    refreshing,
    setRefreshing,
  ] =
    useState(false);

  const [
    showAnalytics,
    setShowAnalytics,
  ] =
    useState(false);

  const [
    showLogs,
    setShowLogs,
  ] =
    useState(false);

  const [
    search,
    setSearch,
  ] =
    useState("");

  const filter = "all";
  const dateFilter = "";

  /* =========================================================
     LOGS
  ========================================================= */

  const [
    logs,
    setLogs,
  ] =
    useState([]);

  const logList =
    Array.isArray(
      logs
    )
      ? logs
      : [];

  /* =========================================================
     FETCH PARENTS
  ========================================================= */

  const fetchParents =
    async () => {
      try {
        const token =
          getAdminToken();

        if (!token) {
          console.warn(
            "No admin token found while fetching parents."
          );

          return;
        }

        const response =
          await axios.get(
            `${BASE_URL}/api/parent`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          extractArray(
            response
          );

        console.log(
          "Parents fetched:",
          data.length
        );

        setParents(
          data
        );
      } catch (
        error
      ) {
        console.error(
          "Parent fetch error:",
          error
        );

        console.error(
          "Parent API response:",
          error?.response
            ?.data
        );

        setParents(
          []
        );
      }
    };

  /* =========================================================
     FETCH DASHBOARD STATS
  ========================================================= */

  const fetchStats =
    async () => {
      try {
        const response =
          await getDashboardStats();

        const data =
          response?.data ||
          response ||
          {};

        setStats({
          totalDrivers:
            Number(
              data.totalDrivers
            ) || 0,

          approvedDrivers:
            Number(
              data.approvedDrivers
            ) || 0,

          pendingDrivers:
            Number(
              data.pendingDrivers
            ) || 0,

          rejectedDrivers:
            Number(
              data.rejectedDrivers
            ) || 0,

          totalStudents:
            Number(
              data.totalStudents
            ) || 0,

          totalTrips:
            Number(
              data.totalTrips
            ) || 0,
        });
      } catch (
        error
      ) {
        console.error(
          "Dashboard stats error:",
          error
        );

        console.error(
          "Dashboard stats API response:",
          error?.response
            ?.data
        );
      }
    };

  /* =========================================================
     FETCH DRIVERS
  ========================================================= */

  const fetchDrivers =
    async () => {
      try {
        const response =
          await getDrivers();

        const data =
          extractArray(
            response
          );

        console.log(
          "Drivers fetched:",
          data.length
        );

        setDrivers(
          data
        );
      } catch (
        error
      ) {
        console.error(
          "Driver fetch error:",
          error
        );

        console.error(
          "Driver API response:",
          error?.response
            ?.data
        );

        setDrivers(
          []
        );
      }
    };

  /* =========================================================
     FETCH DRIVER REQUESTS
  ========================================================= */

  const loadRequests =
    async () => {
      try {
        setLoadingRequests(
          true
        );

        const token =
          getAdminToken();

        if (!token) {
          console.error(
            "No admin token found while loading driver requests."
          );

          setDriverRequests(
            []
          );

          return;
        }

        const response =
          await getDriverRequests();

        console.log(
          "DRIVER REQUEST RAW RESPONSE:",
          response
        );

        const requests =
          extractArray(
            response
          );

        console.log(
          "DRIVER REQUESTS FOUND:",
          requests
        );

        console.log(
          "DRIVER REQUEST COUNT:",
          requests.length
        );

        setDriverRequests(
          requests
        );
      } catch (
        error
      ) {
        console.error(
          "Driver requests error:",
          error
        );

        console.error(
          "Driver request status:",
          error?.response
            ?.status
        );

        console.error(
          "Driver request backend response:",
          error?.response
            ?.data
        );

        setDriverRequests(
          []
        );
      } finally {
        setLoadingRequests(
          false
        );
      }
    };

  /* =========================================================
     FETCH ANALYTICS
  ========================================================= */

  const fetchAnalytics =
    async () => {
      try {
        const response =
          await getAdminAnalytics();

        const data =
          response?.data ||
          response ||
          {};

        setAnalyticsData({
          summary:
            data.summary ||
            {},

          registrations:
            Array.isArray(
              data.registrations
            )
              ? data.registrations
              : [],

          approvals:
            Array.isArray(
              data.approvals
            )
              ? data.approvals
              : [],

          rejections:
            Array.isArray(
              data.rejections
            )
              ? data.rejections
              : [],
        });
      } catch (
        error
      ) {
        console.error(
          "Analytics fetch error:",
          error
        );

        console.error(
          "Analytics API response:",
          error?.response
            ?.data
        );

        setAnalyticsData({
          summary: {},
          registrations: [],
          approvals: [],
          rejections: [],
        });
      }
    };

  /* =========================================================
     FETCH LOGS
  ========================================================= */

  const fetchLogs =
    async () => {
      try {
        const response =
          await getAdminLogs();

        const data =
          extractArray(
            response
          );

        setLogs(
          data
        );
      } catch (
        error
      ) {
        console.error(
          "Logs fetch error:",
          error
        );

        setLogs(
          []
        );
      }
    };

  /* =========================================================
     DELETE PARENT
  ========================================================= */

  const handleDeleteParent =
    async (
      id
    ) => {
      const confirmed =
        window.confirm(
          "Delete this parent?"
        );

      if (
        !confirmed
      ) {
        return;
      }

      try {
        const token =
          getAdminToken();

        if (!token) {
          return;
        }

        await axios.delete(
          `${BASE_URL}/api/parent/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setParents(
          (
            previous
          ) =>
            previous.filter(
              (
                parent
              ) =>
                parent._id !==
                id
            )
        );

        await Promise.all([
          fetchStats(),
          loadRequests(),
        ]);
      } catch (
        error
      ) {
        console.error(
          "Delete parent error:",
          error
        );

        alert(
          error?.response
            ?.data
            ?.message ||
            "Delete failed"
        );
      }
    };

  /* =========================================================
     ASSIGN DRIVER
  ========================================================= */

  const handleAssignDriver =
    async (
      request,
      driver
    ) => {
      if (
        !request?._id
      ) {
        alert(
          "Invalid driver request."
        );

        return;
      }

      if (
        !driver?.driverId
      ) {
        alert(
          "Invalid driver."
        );

        return;
      }

      try {
        console.log(
          "Assigning driver:",
          {
            requestId:
              request._id,

            driverId:
              driver.driverId,
          }
        );

        const response =
          await assignDriver(
            request._id,
            driver.driverId
          );

        console.log(
          "Assign driver response:",
          response
        );

        alert(
          response?.message ||
          "Driver assigned successfully"
        );

        setSelectedRequest(
          null
        );

        await Promise.all([
          loadRequests(),
          fetchDrivers(),
          fetchParents(),
          fetchAnalytics(),
          fetchStats(),
        ]);
      } catch (
        error
      ) {
        console.error(
          "Assign driver error:",
          error
        );

        console.error(
          "Assign driver backend response:",
          error?.response
            ?.data
        );

        alert(
          error?.response
            ?.data
            ?.message ||
            error?.message ||
            "Failed to assign driver."
        );
      }
    };

  /* =========================================================
     FILTER DRIVERS
  ========================================================= */

  useEffect(() => {
    let data =
      [...drivers];

    if (
      filter !==
      "all"
    ) {
      data =
        data.filter(
          (
            driver
          ) =>
            String(
              driver.status ||
              ""
            )
              .toLowerCase() ===
            String(
              filter
            ).toLowerCase()
        );
    }

    const normalizedSearch =
      search
        .trim()
        .toLowerCase();

    if (
      normalizedSearch
    ) {
      data =
        data.filter(
          (
            driver
          ) => {
            const searchableValues =
              [
                driver.name,
                driver.email,
                driver.phone,
                driver.driverId,
                driver.vehicleNumber,
              ];

            return searchableValues.some(
              (
                value
              ) =>
                String(
                  value ||
                  ""
                )
                  .toLowerCase()
                  .includes(
                    normalizedSearch
                  )
            );
          }
        );
    }

    setFilteredDrivers(
      data
    );
  }, [
    drivers,
    search,
    filter,
  ]);

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
              log.action ||
              ""
            ).toLowerCase();

          const adminEmail =
            String(
              log.adminId
                ?.email ||
              ""
            ).toLowerCase();

          const adminUsername =
            String(
              log.adminId
                ?.username ||
              ""
            ).toLowerCase();

          const driverName =
            String(
              log.driverId
                ?.name ||
              ""
            ).toLowerCase();

          const driverId =
            String(
              log.driverId
                ?.driverId ||
              ""
            ).toLowerCase();

          const message =
            String(
              log.message ||
              ""
            ).toLowerCase();

          const matchesSearch =
            !normalizedSearch ||
            action.includes(
              normalizedSearch
            ) ||
            adminEmail.includes(
              normalizedSearch
            ) ||
            adminUsername.includes(
              normalizedSearch
            ) ||
            driverName.includes(
              normalizedSearch
            ) ||
            driverId.includes(
              normalizedSearch
            ) ||
            message.includes(
              normalizedSearch
            );

          let matchesDate =
            true;

          if (
            dateFilter &&
            log.createdAt
          ) {
            try {
              matchesDate =
                new Date(
                  log.createdAt
                )
                  .toISOString()
                  .split(
                    "T"
                  )[0] ===
                dateFilter;
            } catch {
              matchesDate =
                false;
            }
          }

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
     PENDING DRIVER REQUEST COUNT
  ========================================================= */

  const pendingRequestCount =
    useMemo(
      () =>
        driverRequests.filter(
          (
            request
          ) =>
            String(
              request.status ||
              ""
            )
              .trim()
              .toLowerCase() ===
            "pending"
        ).length,
      [
        driverRequests,
      ]
    );

  /* =========================================================
     APPROVED DRIVERS
  ========================================================= */

  const approvedDrivers =
    useMemo(
      () =>
        drivers.filter(
          (
            driver
          ) =>
            String(
              driver.status ||
              ""
            )
              .trim()
              .toLowerCase() ===
            "approved"
        ),
      [
        drivers,
      ]
    );

  /* =========================================================
     RECOMMENDED DRIVERS
  ========================================================= */

  const recommendedDrivers =
    useMemo(() => {
      if (
        !selectedRequest
      ) {
        return [];
      }

      const nearest =
        Array.isArray(
          selectedRequest
            .nearestDrivers
        )
          ? selectedRequest
              .nearestDrivers
          : [];

      if (
        nearest.length >
        0
      ) {
        return nearest;
      }

      return approvedDrivers;
    }, [
      selectedRequest,
      approvedDrivers,
    ]);

  /* =========================================================
     REFRESH DASHBOARD
  ========================================================= */

  const refreshDashboard =
    async () => {
      try {
        setRefreshing(
          true
        );

        await Promise.all([
          fetchStats(),
          fetchDrivers(),
          fetchParents(),
          loadRequests(),
          fetchAnalytics(),
        ]);

        const role =
          getStoredAdminRole();

        if (
          role ===
          "superadmin"
        ) {
          await fetchLogs();
        }
      } catch (
        error
      ) {
        console.error(
          "Dashboard refresh error:",
          error
        );
      } finally {
        setRefreshing(
          false
        );
      }
    };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    refreshDashboard();
  }, []);

  /* =========================================================
     SOCKET.IO
  ========================================================= */

  useEffect(() => {
    const token =
      getAdminToken();

    if (!token) {
      return undefined;
    }

    const socket =
      io(
        BASE_URL,
        {
          auth: {
            token,
          },

          transports: [
            "websocket",
            "polling",
          ],

          reconnection:
            true,
        }
      );

    socket.on(
      "connect",
      () => {
        console.log(
          "Admin socket connected"
        );
      }
    );

    socket.on(
      "connect_error",
      (
        error
      ) => {
        console.error(
          "Admin socket error:",
          error.message
        );
      }
    );

    /* =====================================================
       NEW DRIVER
    ===================================================== */

    socket.on(
      "new_driver",
      async () => {
        await Promise.all([
          fetchDrivers(),
          fetchStats(),
          fetchAnalytics(),
        ]);
      }
    );

    /* =====================================================
       DRIVER STATUS CHANGED
    ===================================================== */

    socket.on(
      "driver_status_changed",
      async () => {
        await Promise.all([
          fetchDrivers(),
          fetchStats(),
          fetchAnalytics(),
          loadRequests(),
        ]);
      }
    );

    /* =====================================================
       DRIVER APPROVED
    ===================================================== */

    socket.on(
      "driver_approved",
      async () => {
        await Promise.all([
          fetchDrivers(),
          fetchStats(),
          fetchAnalytics(),
          loadRequests(),
        ]);
      }
    );

    /* =====================================================
       DRIVER REJECTED
    ===================================================== */

    socket.on(
      "driver_rejected",
      async () => {
        await Promise.all([
          fetchDrivers(),
          fetchStats(),
          fetchAnalytics(),
          loadRequests(),
        ]);
      }
    );

    /* =====================================================
       DRIVER REQUEST CREATED
    ===================================================== */

    socket.on(
      "driver_request_created",
      async (
        request
      ) => {
        console.log(
          "Socket: new driver request",
          request
        );

        await Promise.all([
          loadRequests(),
          fetchStats(),
        ]);
      }
    );

    /* =====================================================
       DRIVER REQUEST ASSIGNED
    ===================================================== */

    socket.on(
      "driver_request_assigned",
      async () => {
        await Promise.all([
          loadRequests(),
          fetchParents(),
          fetchDrivers(),
          fetchStats(),
          fetchAnalytics(),
        ]);
      }
    );

    return () => {
      socket.off(
        "new_driver"
      );

      socket.off(
        "driver_status_changed"
      );

      socket.off(
        "driver_approved"
      );

      socket.off(
        "driver_rejected"
      );

      socket.off(
        "driver_request_created"
      );

      socket.off(
        "driver_request_assigned"
      );

      socket.disconnect();
    };
  }, []);

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#FFF9EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#B87700] mb-2">
              ASAN INSTITUTE · OVERVIEW
            </p>

            <h1 className="text-3xl sm:text-4xl font-black text-[#1C1917]">
              Institute Overview
            </h1>

            <p className="text-[#8C8276] mt-2">
              A clear view of your school transport operations, people and daily activity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">

            <div className="bg-[#FFFDF8] border border-[#EED69B] rounded-2xl px-6 py-4 shadow-sm min-w-[150px]">
              <p className="text-xs font-semibold text-[#8C8276]">
                Active Drivers
              </p>

              <h2 className="text-3xl font-black text-[#1C1917] mt-1">
                {stats.totalDrivers}
              </h2>
            </div>

            <button
              type="button"
              onClick={
                refreshDashboard
              }
              disabled={
                refreshing
              }
              className="
                flex
                items-center
                gap-2
                rounded-2xl
                bg-[#FFB000]
                px-5
                py-4
                font-bold
                text-[#1C1917]
                shadow-sm
                transition
                hover:bg-[#EFA500]
                disabled:opacity-60
              "
            >
              <RefreshCw
                size={18}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </button>

          </div>
        </div>

        {/* ===================================================
            SEARCH / ACTION BAR
        =================================================== */}

        <div className="bg-[#FFFDF8] rounded-2xl border border-[#EEE4D5] p-5 mb-8 shadow-sm">

          <Topbar
            search={
              search
            }
            setSearch={
              setSearch
            }
            openAnalytics={() =>
              setShowAnalytics(
                true
              )
            }
            openLogs={
              async () => {
                const role =
                  getStoredAdminRole();

                if (
                  role !==
                  "superadmin"
                ) {
                  alert(
                    "Admin logs are available only to Super Admin."
                  );

                  return;
                }

                await fetchLogs();

                setShowLogs(
                  true
                );
              }
            }
          />

        </div>

        {/* ===================================================
            STATS
        =================================================== */}

        <div className="mb-6">

          <StatsPanel
            stats={
              stats
            }
          />

        </div>

        {/* ===================================================
            PENDING REQUEST ALERT
        =================================================== */}

        <PendingAlert
          pending={
            pendingRequestCount
          }
        />

        {/* ===================================================
            DRIVER REQUESTS
        =================================================== */}

        <div className="bg-[#FFFDF8] rounded-2xl border border-[#EEE4D5] mt-8 mb-8 shadow-sm overflow-hidden">

          <div className="px-6 py-5 border-b border-[#EEE4D5] flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

            <div>

              <h2 className="text-2xl font-black text-[#1C1917]">
                Driver Requests
              </h2>

              <p className="text-[#8C8276] text-sm mt-1">
                Parents waiting for driver assignment
              </p>

            </div>

            <span className="bg-[#FFF3D1] text-[#B87700] border border-[#F0D48C] px-4 py-2 rounded-full text-sm font-bold">

              {pendingRequestCount}{" "}
              Pending

            </span>

          </div>

          <div className="p-6 overflow-x-auto">

            {loadingRequests ? (

              <div className="text-center py-10 text-[#8C8276]">
                Loading requests...
              </div>

            ) : driverRequests.length ===
              0 ? (

              <div className="text-center text-[#8C8276] py-10">

                <p className="font-bold text-[#4A433B]">
                  No driver requests available.
                </p>

                <p className="text-sm mt-2">
                  New parent driver requests will appear here.
                </p>

              </div>

            ) : (

              <table className="w-full min-w-[850px]">

                <thead>

                  <tr className="text-left border-b border-[#EEE4D5] text-sm text-[#8C8276]">

                    <th className="py-3">
                      Parent
                    </th>

                    <th>
                      Email
                    </th>

                    <th>
                      Phone
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {driverRequests.map(
                    (
                      request
                    ) => {
                      const status =
                        String(
                          request.status ||
                          "pending"
                        )
                          .trim()
                          .toLowerCase();

                      const isPending =
                        status ===
                        "pending";

                      return (
                        <tr
                          key={
                            request._id
                          }
                          className="border-b border-[#F2EADF]"
                        >

                          <td className="py-4 font-semibold text-[#1C1917]">

                            {request
                              .parentId
                              ?.name ||
                              "-"}

                          </td>

                          <td className="text-[#625B53]">

                            {request
                              .parentId
                              ?.email ||
                              "-"}

                          </td>

                          <td className="text-[#625B53]">

                            {request
                              .parentId
                              ?.phone ||
                              "-"}

                          </td>

                          <td className="text-[#625B53]">

                            {request.createdAt
                              ? new Date(
                                  request.createdAt
                                ).toLocaleDateString(
                                  "en-IN"
                                )
                              : "-"}

                          </td>

                          <td>

                            <span
                              className={`
                                px-3
                                py-1
                                rounded-full
                                text-sm
                                font-semibold

                                ${
                                  isPending
                                    ? "bg-yellow-100 text-yellow-700"
                                    : status === "assigned"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-[#F6F0E7] text-[#625B53]"
                                }
                              `}
                            >
                              {request.status ||
                                "Pending"}
                            </span>

                          </td>

                          <td>

                            {isPending && (

                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedRequest(
                                    request
                                  )
                                }
                                className="
                                  bg-[#FFB000]
                                  hover:bg-[#EFA500]
                                  text-[#1C1917]
                                  px-4
                                  py-2
                                  rounded-xl
                                  font-bold
                                  transition
                                "
                              >
                                Assign Driver
                              </button>

                            )}

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            )}

          </div>

        </div>

        {/* ===================================================
            VIEW SELECTOR
        =================================================== */}

        <div className="bg-[#FFFDF8] rounded-2xl border border-[#EEE4D5] p-5 mb-8 shadow-sm">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            <div>

              <h2 className="text-2xl font-black text-[#1C1917]">

                {view ===
                "drivers"
                  ? "Registered Drivers"
                  : view ===
                    "parents"
                  ? "Registered Parents"
                  : view === "locationChanges"
                  ? "Location Change Requests"
                  : "Billing Settings"}

              </h2>

              <p className="text-sm text-[#8C8276] mt-1">

                {view ===
                "drivers"
                  ? filteredDrivers.length
                  : view ===
                    "parents"
                  ? parents.length
                  : ""}

                {view !==
                  "billing" && view !== "locationChanges" &&
                  " Records Available"}

              </p>

            </div>

            <div className="flex flex-wrap gap-3">

              <button
                type="button"
                onClick={() =>
                  setView(
                    "drivers"
                  )
                }
                className={`
                  px-5
                  py-2.5
                  rounded-xl
                  font-bold
                  transition

                  ${
                    view ===
                    "drivers"
                      ? "bg-[#FFB000] text-[#1C1917]"
                      : "bg-[#F6F0E7] text-[#625B53] hover:bg-[#EFE5D6]"
                  }
                `}
              >
                Drivers
              </button>

              <button
                type="button"
                onClick={() =>
                  setView(
                    "parents"
                  )
                }
                className={`
                  px-5
                  py-2.5
                  rounded-xl
                  font-bold
                  transition

                  ${
                    view ===
                    "parents"
                      ? "bg-[#FFB000] text-[#1C1917]"
                      : "bg-[#F6F0E7] text-[#625B53] hover:bg-[#EFE5D6]"
                  }
                `}
              >
                Parents
              </button>

              <button
                type="button"
                onClick={() =>
                  setView(
                    "billing"
                  )
                }
                className={`
                  px-5
                  py-2.5
                  rounded-xl
                  font-bold
                  transition

                  ${
                    view ===
                    "billing"
                      ? "bg-[#FFB000] text-[#1C1917]"
                      : "bg-[#F6F0E7] text-[#625B53] hover:bg-[#EFE5D6]"
                  }
                `}
              >
                Billing
              </button>

              <button
                type="button"
                onClick={() => setView("locationChanges")}
                className={`px-5 py-2.5 rounded-xl font-bold transition ${view === "locationChanges" ? "bg-[#FFB000] text-[#1C1917]" : "bg-[#F6F0E7] text-[#625B53] hover:bg-[#EFE5D6]"}`}
              >
                Location Changes
              </button>

            </div>

          </div>

        </div>

        {/* ===================================================
            MAIN CONTENT
        =================================================== */}

        <div className="bg-[#FFFDF8] rounded-2xl border border-[#EEE4D5] overflow-hidden shadow-sm">

          <div className="px-6 py-4 border-b border-[#EEE4D5]">

            <h3 className="text-lg font-bold text-[#4A433B]">

              {view ===
              "drivers"
                ? "Driver Management"
                : view ===
                  "parents"
                ? "Parent Management"
                : view === "locationChanges"
                ? "Parent Location Requests"
                : "Billing Settings"}

            </h3>

          </div>

          <div className="p-6">

            {view ===
              "drivers" && (

              <DriverTable
                drivers={
                  filteredDrivers
                }
                onSelect={
                  setSelectedDriver
                }
              />

            )}

            {view ===
              "parents" && (

              <ParentTable
                parents={
                  parents
                }
                drivers={
                  drivers
                }
                onDelete={
                  handleDeleteParent
                }
                onAssign={
                  fetchParents
                }
              />

            )}

            {view ===
              "billing" && (

              <BillingSettings />

            )}

            {view === "locationChanges" && <LocationChangeRequests />}

          </div>

        </div>

        {/* ===================================================
            ASSIGN DRIVER MODAL
        =================================================== */}

        {selectedRequest && (

          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">

            <div className="bg-[#FFFDF8] rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">

              <div className="flex justify-between items-center border-b border-[#EEE4D5] px-6 sm:px-8 py-6">

                <div>

                  <h2 className="text-3xl font-black text-[#1C1917]">
                    Assign Driver
                  </h2>

                  <p className="text-[#8C8276] mt-1">
                    Choose an approved driver for this parent.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedRequest(
                      null
                    )
                  }
                  className="text-3xl text-[#8C8276] hover:text-red-500"
                >
                  ×
                </button>

              </div>

              <div className="p-6 sm:p-8">

                {/* ===========================================
                    PARENT DETAILS
                =========================================== */}

                <div className="bg-[#FFF7E4] rounded-2xl p-6 border border-[#F0DCA4] mb-8">

                  <h3 className="font-black text-xl mb-5 text-[#1C1917]">
                    Parent Details
                  </h3>

                  <div className="grid md:grid-cols-2 gap-5">

                    <div>

                      <p className="text-[#8C8276] text-sm">
                        Parent
                      </p>

                      <p className="font-semibold text-[#1C1917]">
                        {selectedRequest
                          .parentId
                          ?.name ||
                          "-"}
                      </p>

                    </div>

                    <div>

                      <p className="text-[#8C8276] text-sm">
                        Phone
                      </p>

                      <p className="font-semibold text-[#1C1917]">
                        {selectedRequest
                          .parentId
                          ?.phone ||
                          "-"}
                      </p>

                    </div>

                    <div>

                      <p className="text-[#8C8276] text-sm">
                        Email
                      </p>

                      <p className="font-semibold text-[#1C1917]">
                        {selectedRequest
                          .parentId
                          ?.email ||
                          "-"}
                      </p>

                    </div>

                    <div>

                      <p className="text-[#8C8276] text-sm">
                        Address
                      </p>

                      <p className="font-semibold text-[#1C1917]">
                        {selectedRequest
                          .parentId
                          ?.address ||
                          "Not Available"}
                      </p>

                    </div>

                  </div>

                </div>

                {/* ===========================================
                    APPROVED DRIVERS
                =========================================== */}

                <h3 className="text-2xl font-black mb-5 text-[#1C1917]">
                  Recommended Drivers
                </h3>

                {recommendedDrivers.length ===
                0 ? (

                  <div className="rounded-2xl border border-dashed border-[#E8D7A5] bg-[#FFF9EE] py-12 text-center">

                    <p className="font-bold text-[#4A433B]">
                      No approved drivers available
                    </p>

                    <p className="mt-2 text-sm text-[#8C8276]">
                      Approve at least one driver before assigning a request.
                    </p>

                  </div>

                ) : (

                  <div className="space-y-4">

                    {recommendedDrivers.map(
                      (
                        driver
                      ) => (

                        <div
                          key={
                            driver._id ||
                            driver.driverId
                          }
                          className="border border-[#EEE4D5] rounded-2xl p-5 hover:shadow-md transition"
                        >

                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-5">

                            <div>

                              <h4 className="text-xl font-black text-[#1C1917]">
                                {driver.name ||
                                  "Driver"}
                              </h4>

                              <p className="text-[#8C8276]">
                                {driver.driverId ||
                                  "-"}
                              </p>

                              <p className="mt-2 text-[#625B53]">
                                Vehicle:{" "}
                                {driver.vehicleNumber ||
                                  "-"}
                              </p>

                              {driver.distance !==
                                undefined &&
                                driver.distance !==
                                  null && (

                                <span className="inline-block mt-3 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">

                                  {driver.distance}{" "}
                                  km away

                                </span>

                              )}

                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                handleAssignDriver(
                                  selectedRequest,
                                  driver
                                )
                              }
                              className="
                                bg-[#FFB000]
                                hover:bg-[#EFA500]
                                text-[#1C1917]
                                px-6
                                py-3
                                rounded-xl
                                font-bold
                                transition
                              "
                            >
                              Assign
                            </button>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>

            </div>

          </div>

        )}

        {/* ===================================================
            DRIVER DETAIL DRAWER
        =================================================== */}

        {selectedDriver && (

          <DriverDetailDrawer
            driverId={
              selectedDriver._id
            }
            onClose={() =>
              setSelectedDriver(
                null
              )
            }
            refresh={
              async () => {
                await Promise.all([
                  fetchDrivers(),
                  fetchStats(),
                  fetchAnalytics(),
                  loadRequests(),
                ]);
              }
            }
          />

        )}

        {/* ===================================================
            ANALYTICS MODAL
        =================================================== */}

        {showAnalytics && (

          <AnalyticsModal
            stats={
              analyticsData
            }
            onClose={() =>
              setShowAnalytics(
                false
              )
            }
          />

        )}

        {/* ===================================================
            LOGS MODAL
        =================================================== */}

        {showLogs && (

          <LogsModal
            logs={
              filteredLogs
            }
            onClose={() =>
              setShowLogs(
                false
              )
            }
          />

        )}

      </div>
    </div>
  );
}

export default Dashboard;

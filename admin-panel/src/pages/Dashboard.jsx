import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { RefreshCw } from "lucide-react";

import Topbar from "../components/Topbar";
import StatsPanel from "../components/StatsPanel";
import DriverTable from "../components/DriverTable";
import DriverDetailDrawer from "../components/DriverDetailDrawer";
import AnalyticsModal from "../components/AnalyticsModal";
import LogsModal from "../components/LogsModal";
import ParentTable from "../components/ParentTable";
import PendingAlert from "../components/PendingAlert";
import BillingSettings from "./BillingSettings";

/* NEW */
import {
  getDriverRequests,
  assignDriver,
} from "../services/driverRequestService";

function Dashboard() {
  const BASE_URL = "https://asan-driverapp.onrender.com";
  const ADMIN_API = `${BASE_URL}/api/admin`;

  /* ==============================
        STATES
  ============================== */

  const [view, setView] = useState("drivers");

  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [parents, setParents] = useState([]);

  const [selectedDriver, setSelectedDriver] = useState(null);

  const [analyticsData, setAnalyticsData] = useState({
    registrations: [],
    approvals: [],
  });

  const [stats, setStats] = useState({
    totalDrivers: 0,
    approvedDrivers: 0,
    pendingDrivers: 0,
    rejectedDrivers: 0,
  });
  const [driverRequests, setDriverRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
const [selectedDriverId, setSelectedDriverId] = useState("");
const [loadingRequests, setLoadingRequests] = useState(false);

  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [logs, setLogs] = useState([]);
  const logList = Array.isArray(logs) ? logs : [];

  /* ==============================
        TOKEN
  ============================== */

  const getToken = () => localStorage.getItem("adminToken");

  /* ==============================
        FETCH DRIVERS
  ============================== */

  const fetchDrivers = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await axios.get(`${ADMIN_API}/drivers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = Array.isArray(res.data.data) ? res.data.data : [];

      setDrivers(data);
      setFilteredDrivers(data);
    } catch (err) {
      console.error("Driver fetch error:", err);
      setDrivers([]);
      setFilteredDrivers([]);
    }
  };

  /* ==============================
        FETCH PARENTS
  ============================== */

  const fetchParents = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/parent`);
      setParents(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ==============================
        FETCH DRIVER REQUESTS
============================== */

const loadRequests = async () => {
  try {
    setLoadingRequests(true);

    const token = getToken();

    if (!token) return;

    const res = await getDriverRequests(token);

    setDriverRequests(res.data.data || []);
  } catch (err) {
    console.error(err);
    setDriverRequests([]);
  } finally {
    setLoadingRequests(false);
  }
};

/* ==============================
        ASSIGN DRIVER
============================== */

const handleAssignDriver = async () => {
  if (!selectedDriverId) {
    alert("Please select a driver");
    return;
  }

  try {
    const token = getToken();

    await assignDriver(
      selectedRequest._id,
      selectedDriverId,
      token
    );

    alert("Driver assigned successfully!");

    // Close modal
    setSelectedRequest(null);
    setSelectedDriverId("");

    // Refresh everything
    await loadRequests();
    await fetchDrivers();
    await fetchParents();
    await fetchAnalytics();

  } catch (err) {
    console.error(err);
    alert("Failed to assign driver.");
  }
};

  /* ==============================
        DELETE PARENT
  ============================== */

  const handleDeleteParent = async (id) => {
    if (!window.confirm("Delete this parent?")) return;

    try {
      await axios.delete(`${BASE_URL}/api/parent/${id}`);

      setParents((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  /* ==============================
        FETCH ANALYTICS
  ============================== */

  const fetchAnalytics = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await axios.get(`${ADMIN_API}/analytics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const summary = res.data?.data?.summary || {};

      setStats({
        totalDrivers: summary.total || 0,
        approvedDrivers: summary.approved || 0,
        pendingDrivers: summary.pending || 0,
        rejectedDrivers: summary.rejected || 0,
      });

      setAnalyticsData(res.data?.data || {});
    } catch (err) {
      console.error(err);
    }
  };

  /* ==============================
        FETCH LOGS
  ============================== */

  const fetchLogs = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await axios.get(`${ADMIN_API}/logs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLogs(Array.isArray(res.data.data) ? res.data.data : []);
    } catch {
      setLogs([]);
    }
  };

  /* ==============================
        FILTER DRIVERS
  ============================== */

  const applyFilters = () => {
    let data = [...drivers];

    if (filter !== "all") {
      data = data.filter((driver) => driver.status === filter);
    }

    if (search) {
      data = data.filter((driver) =>
        driver.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredDrivers(data);
  };

  /* ==============================
        FILTER LOGS
  ============================== */

  const filteredLogs = useMemo(() => {
    return logList.filter((log) => {
      const action = (log.action || "").toUpperCase();

      const matchesSearch =
        action.includes(search.toUpperCase()) ||
        log.adminId?.username
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesDate = dateFilter
        ? new Date(log.createdAt).toISOString().split("T")[0] === dateFilter
        : true;

      return matchesSearch && matchesDate;
    });
  }, [logList, search, dateFilter]);


const refreshDashboard = async () => {
  await Promise.all([
    fetchDrivers(),
    fetchParents(),
    loadRequests(),
    fetchAnalytics(),
    fetchLogs(),
  ]);
};  

  /* ==============================
        EFFECTS
  ============================== */

  useEffect(() => {
  fetchDrivers();
  fetchParents();
  loadRequests();
}, []);

  useEffect(() => {
    if (drivers.length) {
      fetchAnalytics();
    }
  }, [drivers]);

  useEffect(() => {
    applyFilters();
  }, [drivers, search, filter]);

  /* ==============================
        SOCKET
  ============================== */

  useEffect(() => {
    const socket = io(BASE_URL, {
      transports: ["websocket"],
      reconnection: true,
    });

    socket.on("new_driver", (driver) => {
  setDrivers((prev) => [driver, ...prev]);

  setStats((prev) => ({
    ...prev,
    totalDrivers: prev.totalDrivers + 1,
    pendingDrivers: prev.pendingDrivers + 1,
  }));

  loadRequests();
});

socket.on("driver_request_created", () => {
  loadRequests();
});

socket.on("driver_request_assigned", () => {
  loadRequests();
});

socket.on("driver_approved", () => {
  setStats((prev) => ({
    ...prev,
    approvedDrivers: prev.approvedDrivers + 1,
    pendingDrivers: Math.max(prev.pendingDrivers - 1, 0),
  }));
});


    return () => socket.disconnect();
  }, []);
  return (
  <div className="min-h-screen bg-slate-100">
    <div className="max-w-7xl mx-auto px-8 py-8">

      {/* ================= HEADER ================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

        <div>
          <h1 className="text-4xl font-bold text-slate-800">
            ASAN Admin Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Manage Drivers, Parents and Monitor System Activity
          </p>
        </div>

        <div className="flex items-center gap-4">

  <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl px-6 py-4 text-white shadow-lg">
    <p className="text-sm opacity-80">Total Drivers</p>
    <h2 className="text-3xl font-bold">
      {stats.totalDrivers}
    </h2>
  </div>

  <button
  onClick={refreshDashboard}
  className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 rounded-2xl px-5 py-4 shadow-md transition"
>
  <RefreshCw size={18} />
  Refresh
</button>

</div>

      </div>

      {/* ================= SEARCH BAR ================= */}

      <div className="bg-white rounded-2xl shadow-md border p-5 mb-8">

        <Topbar
          search={search}
          setSearch={setSearch}
          openAnalytics={() => setShowAnalytics(true)}
          openLogs={() => {
            fetchLogs();
            setShowLogs(true);
          }}
        />

      </div>

      {/* ================= STATS ================= */}

      {/* ================= STATS ================= */}

<div className="mt-8 mb-6">
  <StatsPanel
    stats={{
      ...stats,
      pendingDrivers: driverRequests.filter(
        (r) => r.status === "Pending"
      ).length,
    }}
  />
</div>

<PendingAlert
  pending={
    driverRequests.filter(
      (r) => r.status === "Pending"
    ).length
  }
/>

{/* ================= DRIVER REQUESTS ================= */}

<div className="bg-white rounded-2xl shadow-lg border mt-8 mb-8">

  <div className="px-6 py-4 border-b bg-slate-50 flex justify-between items-center">

    <div>
      <h2 className="text-2xl font-bold text-slate-800">
        Driver Requests
      </h2>

      <p className="text-gray-500 text-sm">
        Parents requesting a driver assignment
      </p>
    </div>

    <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full font-semibold">
      {
        driverRequests.filter(
          (r) => r.status === "Pending"
        ).length
      } Pending
    </span>

  </div>

  <div className="p-6">

    {loadingRequests ? (

      <div className="text-center py-10">
        Loading requests...
      </div>

    ) : driverRequests.length === 0 ? (

      <div className="text-center text-gray-500 py-10">
        No driver requests available.
      </div>

    ) : (

      <table className="w-full">

        <thead>

          <tr className="text-left border-b">

            <th className="py-3">Parent</th>

            <th>Email</th>

            <th>Phone</th>

            <th>Date</th>

            <th>Status</th>

            <th></th>

          </tr>

        </thead>

        <tbody>

          {driverRequests.map((request) => (

            <tr
              key={request._id}
              className="border-b hover:bg-gray-50"
            >

              <td className="py-4 font-medium">
                {request.parentId?.name}
              </td>

              <td>
                {request.parentId?.email}
              </td>

              <td>
                {request.parentId?.phone}
              </td>

              <td>
                {new Date(
                  request.createdAt
                ).toLocaleDateString()}
              </td>

              <td>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    request.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {request.status}
                </span>

              </td>

              <td>

                {request.status === "Pending" && (

                  <button
                    onClick={() =>
                      setSelectedRequest(request)
                    }
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                  >
                    Assign Driver
                  </button>

                )}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    )}

  </div>

</div>

      {/* ================= FILTER BAR ================= */}

      <div className="bg-white rounded-2xl shadow-md border p-5 mb-8">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div>

            <h2 className="text-2xl font-semibold text-slate-800">
  {view === "drivers"
    ? "Registered Drivers"
    : view === "parents"
    ? "Registered Parents"
    : "Billing Settings"}
</h2>

            <p className="text-sm text-gray-500 mt-1">
              {view === "drivers"
                ? filteredDrivers.length
                : parents.length}{" "}
              Records Available
            </p>

          </div>

          <div className="flex gap-3">

  <button
    onClick={() => setView("drivers")}
    className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
      view === "drivers"
        ? "bg-indigo-600 text-white shadow-lg"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
  >
    Drivers
  </button>

  <button
    onClick={() => setView("parents")}
    className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
      view === "parents"
        ? "bg-indigo-600 text-white shadow-lg"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
  >
    Parents
  </button>

  <button
    onClick={() => setView("billing")}
    className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
      view === "billing"
        ? "bg-indigo-600 text-white shadow-lg"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
  >
    Billing
  </button>

</div>

        </div>

      </div>

      {/* ================= TABLE ================= */}

      <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">

        <div className="px-6 py-4 border-b bg-slate-50">

          <h3 className="text-lg font-semibold text-slate-700">
  {view === "drivers"
    ? "Driver Management"
    : view === "parents"
    ? "Parent Management"
    : "Billing Settings"}
</h3>

        </div>

        <div className="p-6 bg-white">
          
            {view === "drivers" && (
  <DriverTable
    drivers={filteredDrivers}
    onSelect={setSelectedDriver}
  />
)}

{view === "parents" && (
  <ParentTable
    parents={parents}
    drivers={drivers}
    onDelete={handleDeleteParent}
    onAssign={fetchParents}
  />
)}

{view === "billing" && (
  <BillingSettings />
)}

        </div>

      </div>

      {/* ================= ASSIGN DRIVER MODAL ================= */}

{selectedRequest && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">

    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">

      {/* Header */}
      <div className="flex justify-between items-center border-b px-8 py-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">
            Assign Driver
          </h2>

          <p className="text-gray-500 mt-1">
            Choose the nearest driver for this parent
          </p>
        </div>

        <button
          onClick={() => setSelectedRequest(null)}
          className="text-3xl text-gray-400 hover:text-red-500"
        >
          ×
        </button>
      </div>

      <div className="p-8">

        {/* Parent Card */}

        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 border mb-8">

          <h3 className="font-bold text-xl mb-5">
            Parent Details
          </h3>

          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <p className="text-gray-500 text-sm">
                Parent
              </p>

              <p className="font-semibold">
                {selectedRequest.parentId?.name}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Phone
              </p>

              <p className="font-semibold">
                {selectedRequest.parentId?.phone}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Email
              </p>

              <p className="font-semibold">
                {selectedRequest.parentId?.email}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Address
              </p>

              <p className="font-semibold">
                {selectedRequest.parentId?.address || "Not Available"}
              </p>
            </div>

          </div>

        </div>

        {/* Recommended Drivers */}

        <h3 className="text-2xl font-bold mb-5">
          ⭐ Recommended Drivers
        </h3>

        <div className="space-y-4">

          {(selectedRequest.nearestDrivers?.length
            ? selectedRequest.nearestDrivers
            : drivers.filter(d => d.status === "approved")
          ).map((driver) => (

            <div
              key={driver.driverId}
              className="border rounded-2xl p-5 hover:shadow-lg transition"
            >

              <div className="flex justify-between items-center">

                <div>

                  <h4 className="text-xl font-bold">
                    {driver.name}
                  </h4>

                  <p className="text-gray-500">
                    {driver.driverId}
                  </p>

                  <p className="mt-2">
                    🚘 {driver.vehicleNumber}
                  </p>

                  {driver.distance && (
                    <span className="inline-block mt-3 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">

                      📍 {driver.distance} km away

                    </span>
                  )}

                </div>

                <button
                  onClick={async () => {

                    const token = getToken();

                    await assignDriver(
                      selectedRequest._id,
                      driver.driverId,
                      token
                    );

                    alert("Driver Assigned");

                    setSelectedRequest(null);

                    loadRequests();
                    fetchParents();
                    fetchDrivers();
                    fetchAnalytics();

                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Assign
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  </div>
)}
      {/* ================= DRAWER ================= */}

      {selectedDriver && (
        <DriverDetailDrawer
          driverId={selectedDriver._id}
          onClose={() => setSelectedDriver(null)}
          refresh={() => {
            fetchDrivers();
            fetchAnalytics();
          }}
        />
      )}

      {/* ================= MODALS ================= */}

      {showAnalytics && (
        <AnalyticsModal
          stats={analyticsData}
          onClose={() => setShowAnalytics(false)}
        />
      )}

      {showLogs && (
        <LogsModal
          logs={filteredLogs}
          onClose={() => setShowLogs(false)}
        />
      )}

    </div>
  </div>
);
}

export default Dashboard;

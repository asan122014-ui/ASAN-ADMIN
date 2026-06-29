import { useEffect, useState } from "react";
import axios from "axios";
import {
  X,
  User,
  Car,
  Phone,
  Mail,
  CreditCard,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
} from "lucide-react";

import DocumentModal from "./DocumentModal";

function DriverDetailDrawer({ driverId, onClose, refresh }) {

  const API = "https://asan-driverapp.onrender.com/api/admin";

  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  const [previewImage, setPreviewImage] = useState(null);

  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [showConfirm, setShowConfirm] = useState("");

  const role = localStorage.getItem("adminRole");
  const canApprove =
    role === "superadmin" || role === "reviewer";

  /* ================= TOKEN ================= */

  const getToken = () => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      console.error("No admin token");
      return null;
    }

    return token;
  };

  /* ================= LOAD DRIVER ================= */

  useEffect(() => {
    if (driverId) {
      fetchDriver();
    }
  }, [driverId]);

  const fetchDriver = async () => {
    try {
      const token = getToken();

      if (!token) return;

      setLoading(true);

      const res = await axios.get(
        `${API}/drivers/${driverId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDriver(res.data?.data || null);
    } catch (err) {
      console.error(err);
      setDriver(null);
    } finally {
      setLoading(false);
    }
  };

  /* ================= ESC CLOSE ================= */

  useEffect(() => {
    const esc = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", esc);

    return () =>
      document.removeEventListener("keydown", esc);
  }, [onClose]);

  /* ================= BODY LOCK ================= */

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  /* ================= TOAST ================= */

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  /* ================= APPROVE ================= */

  const approveDriver = async () => {
    try {
      const token = getToken();

      if (!token) return;

      setActionLoading(true);

      await axios.put(
        `${API}/drivers/${driverId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showToast("Driver Approved Successfully");

      refresh?.();

      setTimeout(() => {
        onClose?.();
      }, 1200);

    } catch (err) {
      console.error(err);
      showToast("Approval Failed");
    } finally {
      setActionLoading(false);
    }
  };

  /* ================= REJECT ================= */

  const rejectDriver = async () => {
    const reason = prompt("Enter rejection reason");

    if (!reason) return;

    try {
      const token = getToken();

      if (!token) return;

      setActionLoading(true);

      await axios.put(
        `${API}/drivers/${driverId}/reject`,
        { reason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showToast("Driver Rejected");

      refresh?.();

      setTimeout(() => {
        onClose?.();
      }, 1200);

    } catch (err) {
      console.error(err);
      showToast("Rejection Failed");
    } finally {
      setActionLoading(false);
    }
  };

  /* ================= STATUS ================= */

  const isApproved = driver?.status === "approved";
  const isRejected = driver?.status === "rejected";

  const documents = [
    driver?.licenseFront,
    driver?.licenseBack,
    driver?.rcFront,
    driver?.rcBack,
    driver?.insurance,
    driver?.idFront,
    driver?.idBack,
    driver?.profilePhoto,
  ].filter(Boolean);
    return (
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* DRAWER */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-6">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col">

          {/* HEADER */}
          <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white px-8 py-6 flex justify-between items-center">

            <div className="flex items-center gap-4">

              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold">
                {driver?.name?.charAt(0)}
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  {driver?.name}
                </h2>

                <p className="opacity-80">
                  Driver ID : {driver?.driverId}
                </p>
              </div>

            </div>

            <button
              onClick={onClose}
              className="w-11 h-11 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
            >
              <X size={22} />
            </button>

          </div>

          {/* BODY */}

          {loading ? (

            <div className="flex-1 flex items-center justify-center">
              Loading...
            </div>

          ) : driver ? (

            <div className="flex-1 overflow-y-auto p-8 bg-slate-50">

              {/* STATUS */}

              <div className="flex justify-between items-center mb-8">

                <span
                  className={`px-5 py-2 rounded-full text-sm font-semibold ${
                    driver.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : driver.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {driver.status.toUpperCase()}
                </span>

              </div>

              {/* INFORMATION GRID */}

              <div className="grid lg:grid-cols-2 gap-6">

                {/* PERSONAL DETAILS */}

                <div className="bg-white rounded-2xl shadow p-6">

                  <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
                    <User size={20} />
                    Personal Information
                  </h3>

                  <div className="space-y-4">

                    <div className="flex items-center gap-3">
                      <Mail size={18} className="text-indigo-500" />
                      <span>{driver.email}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone size={18} className="text-indigo-500" />
                      <span>{driver.phone}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <CreditCard size={18} className="text-indigo-500" />
                      <span>{driver.licenseNumber}</span>
                    </div>

                  </div>

                </div>

                {/* VEHICLE */}

                <div className="bg-white rounded-2xl shadow p-6">

                  <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
                    <Car size={20} />
                    Vehicle Details
                  </h3>

                  <div className="space-y-4">

                    <div>
                      <p className="text-sm text-gray-500">
                        Vehicle Number
                      </p>

                      <p className="font-semibold">
                        {driver.vehicleNumber}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Vehicle Type
                      </p>

                      <p className="font-semibold">
                        {driver.vehicleType}
                      </p>
                    </div>

                  </div>

                </div>

              </div>

              {/* DOCUMENTS */}

              <div className="bg-white rounded-2xl shadow mt-8 p-6">

                <h3 className="font-bold text-lg flex items-center gap-2 mb-5">
                  <ImageIcon size={20} />
                  Uploaded Documents
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

                  {documents.map((doc, index) => (

                    <div
                      key={index}
                      onClick={() => setPreviewImage(doc)}
                      className="rounded-xl overflow-hidden border cursor-pointer hover:shadow-xl hover:scale-105 transition"
                    >
                      <img
                        src={doc}
                        alt="document"
                        className="w-full h-40 object-cover"
                      />
                    </div>

                  ))}

                </div>

              </div>
                            {/* ================= REJECTION REASON ================= */}

              {driver.rejectionReason && (
                <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
                  <h3 className="font-semibold text-red-700 mb-2">
                    Rejection Reason
                  </h3>

                  <p className="text-red-600">
                    {driver.rejectionReason}
                  </p>
                </div>
              )}

            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Driver not found
            </div>
          )}

          {/* ================= FOOTER ================= */}

          {driver && canApprove && (
            <div className="border-t bg-white px-8 py-6 flex flex-col md:flex-row gap-4">

              <button
                disabled={isApproved || actionLoading}
                onClick={() => setShowConfirm("approve")}
                className={`flex-1 py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all duration-300
                  ${
                    isApproved
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-xl hover:-translate-y-1"
                  }`}
              >
                <CheckCircle size={20} />
                {isApproved ? "Already Approved" : "Approve Driver"}
              </button>

              <button
                disabled={isRejected || actionLoading}
                onClick={() => setShowConfirm("reject")}
                className={`flex-1 py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all duration-300
                  ${
                    isRejected
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-500 to-rose-600 text-white hover:shadow-xl hover:-translate-y-1"
                  }`}
              >
                <XCircle size={20} />
                {isRejected ? "Already Rejected" : "Reject Driver"}
              </button>

            </div>
          )}

        </div>
      </div>

      {/* ================= CONFIRMATION MODAL ================= */}

      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60]">

          <div className="bg-white rounded-3xl shadow-2xl w-[380px] p-8">

            <h2 className="text-xl font-bold text-slate-800">
              Confirm Action
            </h2>

            <p className="text-gray-500 mt-2">
              Are you sure you want to{" "}
              <strong>{showConfirm}</strong> this driver?
            </p>

            <div className="flex justify-end gap-3 mt-8">

              <button
                onClick={() => setShowConfirm("")}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  const action = showConfirm;
                  setShowConfirm("");

                  if (action === "approve") {
                    approveDriver();
                  } else {
                    rejectDriver();
                  }
                }}
                className={`px-5 py-2 rounded-xl text-white transition
                  ${
                    showConfirm === "approve"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
              >
                Confirm
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ================= TOAST ================= */}

      {toast && (
        <div className="fixed bottom-8 right-8 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl z-[70] animate-bounce">
          {toast}
        </div>
      )}

      {/* ================= DOCUMENT PREVIEW ================= */}

      {previewImage && (
        <DocumentModal
          image={previewImage}
          onClose={() => setPreviewImage(null)}
        />
      )}

    </>
  );
}

export default DriverDetailDrawer;
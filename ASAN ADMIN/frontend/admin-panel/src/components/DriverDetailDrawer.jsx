import {
  useEffect,
  useState,
} from "react";

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
  Clock3,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

import DocumentModal from "./DocumentModal";

import {
  getStoredAdminRole,
} from "../services/adminAuthService";

import {
  getDriverById,
  approveDriver as approveDriverApi,
  rejectDriver as rejectDriverApi,
} from "../services/adminService";

/* =========================================================
   DRIVER DETAIL DRAWER
========================================================= */

function DriverDetailDrawer({
  driverId,
  onClose,
  refresh,
}) {
  /* =======================================================
     STATE
  ======================================================= */

  const [
    driver,
    setDriver,
  ] =
    useState(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(
      true
    );

  const [
    previewImage,
    setPreviewImage,
  ] =
    useState(
      null
    );

  const [
    toast,
    setToast,
  ] =
    useState(
      null
    );

  const [
    actionLoading,
    setActionLoading,
  ] =
    useState(
      false
    );

  const [
    showConfirm,
    setShowConfirm,
  ] =
    useState(
      ""
    );

  const [
    rejectionReason,
    setRejectionReason,
  ] =
    useState(
      ""
    );

  const [
    actionError,
    setActionError,
  ] =
    useState(
      ""
    );

  /* =======================================================
     ROLE
  ======================================================= */

  const role =
    getStoredAdminRole();

  const canReview =
    role ===
      "superadmin" ||
    role ===
      "reviewer";

  /* =======================================================
     FETCH DRIVER
  ======================================================= */

  const fetchDriver =
    async () => {
      if (
        !driverId
      ) {
        return;
      }

      try {
        setLoading(
          true
        );

        const response =
          await getDriverById(
            driverId
          );

        setDriver(
          response?.data ||
            null
        );
      } catch (
        error
      ) {
        console.error(
          "Driver details error:",
          error
        );

        setDriver(
          null
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  /* =======================================================
     LOAD DRIVER
  ======================================================= */

  useEffect(() => {
    fetchDriver();
  }, [
    driverId,
  ]);

  /* =======================================================
     RESET ACTION STATE WHEN DRIVER CHANGES
  ======================================================= */

  useEffect(() => {
    setShowConfirm(
      ""
    );

    setRejectionReason(
      ""
    );

    setActionError(
      ""
    );

    setPreviewImage(
      null
    );
  }, [
    driverId,
  ]);

  /* =======================================================
     ESCAPE CLOSE
  ======================================================= */

  useEffect(() => {
    const handleEscape =
      (
        event
      ) => {
        if (
          event.key !==
          "Escape"
        ) {
          return;
        }

        if (
          actionLoading
        ) {
          return;
        }

        if (
          showConfirm
        ) {
          setShowConfirm(
            ""
          );

          setActionError(
            ""
          );

          setRejectionReason(
            ""
          );

          return;
        }

        if (
          previewImage
        ) {
          setPreviewImage(
            null
          );

          return;
        }

        onClose?.();
      };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [
    actionLoading,
    onClose,
    showConfirm,
    previewImage,
  ]);

  /* =======================================================
     BODY LOCK
  ======================================================= */

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

  /* =======================================================
     TOAST
  ======================================================= */

  const showToast =
    (
      message
    ) => {
      setToast(
        message
      );

      window.setTimeout(
        () => {
          setToast(
            null
          );
        },
        3000
      );
    };

  /* =======================================================
     CLOSE DRAWER SAFELY
  ======================================================= */

  const handleClose =
    () => {
      if (
        actionLoading
      ) {
        return;
      }

      onClose?.();
    };

  /* =======================================================
     APPROVE DRIVER
  ======================================================= */

  const handleApprove =
    async () => {
      if (
        !driverId ||
        actionLoading
      ) {
        return;
      }

      try {
        setActionLoading(
          true
        );

        setActionError(
          ""
        );

        const response =
          await approveDriverApi(
            driverId
          );

        showToast(
          response?.message ||
            "Driver approved successfully"
        );

        /*
          Approved Drivers remain in the Driver collection,
          so refreshing the current drawer is valid.
        */

        await fetchDriver();

        await refresh?.();

        setShowConfirm(
          ""
        );
      } catch (
        error
      ) {
        console.error(
          "Approve Driver error:",
          error
        );

        const message =
          error?.response
            ?.data
            ?.message ||
          error?.message ||
          "Approval failed";

        setActionError(
          message
        );
      } finally {
        setActionLoading(
          false
        );
      }
    };

  /* =======================================================
     REJECT DRIVER
  ======================================================= */

  const handleReject =
    async () => {
      if (
        !driverId ||
        actionLoading
      ) {
        return;
      }

      const reason =
        rejectionReason.trim();

      /* =====================================================
         VALIDATION
      ===================================================== */

      if (
        !reason
      ) {
        setActionError(
          "Rejection reason is required."
        );

        return;
      }

      if (
        reason.length <
        5
      ) {
        setActionError(
          "Please provide a valid rejection reason."
        );

        return;
      }

      if (
        reason.length >
        500
      ) {
        setActionError(
          "Rejection reason must not exceed 500 characters."
        );

        return;
      }

      try {
        setActionLoading(
          true
        );

        setActionError(
          ""
        );

        /* ===================================================
           REJECTION FLOW

           Backend now handles:

           1. Validate Driver
           2. Validate rejection reason
           3. Create RejectedDriver snapshot
           4. Send rejection email
           5. Mark email as sent
           6. Create Admin audit log
           7. Send socket events
           8. Delete original Driver record
        =================================================== */

        const response =
          await rejectDriverApi(
            driverId,
            reason
          );

        /* ===================================================
           SUCCESS
        =================================================== */

        showToast(
          response?.message ||
            "Driver rejected successfully"
        );

        /* ===================================================
           RESET MODAL
        =================================================== */

        setRejectionReason(
          ""
        );

        setActionError(
          ""
        );

        setShowConfirm(
          ""
        );

        /*
          IMPORTANT:

          DO NOT call fetchDriver() here.

          The original Driver MongoDB record has already been
          removed after a successful rejection.
        */

        /* ===================================================
           REFRESH ADMIN LIST
        =================================================== */

        try {
          await refresh?.();
        } catch (
          refreshError
        ) {
          console.warn(
            "Driver list refresh failed after rejection:",
            refreshError
          );
        }

        /* ===================================================
           CLOSE DRAWER
        =================================================== */

        window.setTimeout(
          () => {
            onClose?.();
          },
          450
        );
      } catch (
        error
      ) {
        console.error(
          "Reject Driver error:",
          error
        );

        const responseData =
          error?.response
            ?.data;

        const message =
          responseData
            ?.message ||
          error?.message ||
          "Rejection failed";

        /*
          Examples:

          Email failed:
          → Driver remains pending.

          Driver deletion failed:
          → Backend indicates email was already sent and
            deletion can safely be retried.
        */

        setActionError(
          message
        );
      } finally {
        setActionLoading(
          false
        );
      }
    };

  /* =======================================================
     STATUS
  ======================================================= */

  const normalizedStatus =
    String(
      driver?.status ||
        ""
    )
      .trim()
      .toLowerCase();

  const isPending =
    normalizedStatus ===
    "pending";

  const isApproved =
    normalizedStatus ===
    "approved";

  const isRejected =
    normalizedStatus ===
    "rejected";

  const isRejectedSnapshot =
    Boolean(
      driver?.isRejectedSnapshot
    );

  /* =======================================================
     DOCUMENTS
  ======================================================= */

  const documents = [
    {
      label:
        "License Front",

      url:
        driver?.licenseFront,
    },

    {
      label:
        "License Back",

      url:
        driver?.licenseBack,
    },

    {
      label:
        "RC Front",

      url:
        driver?.rcFront,
    },

    {
      label:
        "RC Back",

      url:
        driver?.rcBack,
    },

    {
      label:
        "Insurance",

      url:
        driver?.insurance,
    },

    {
      label:
        "ID Front",

      url:
        driver?.idFront,
    },

    {
      label:
        "ID Back",

      url:
        driver?.idBack,
    },

    {
      label:
        "Profile Photo",

      url:
        driver?.profilePhoto,
    },
  ].filter(
    (
      document
    ) =>
      Boolean(
        document.url
      )
  );

  /* =======================================================
     DATE FORMATTER
  ======================================================= */

  const formatDateTime =
    (
      value
    ) => {
      if (
        !value
      ) {
        return "Not available";
      }

      const date =
        new Date(
          value
        );

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
        return "Not available";
      }

      return date.toLocaleString(
        "en-IN",
        {
          day:
            "2-digit",

          month:
            "short",

          year:
            "numeric",

          hour:
            "2-digit",

          minute:
            "2-digit",
        }
      );
    };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <>
      {/* =====================================================
          BACKDROP
      ===================================================== */}

      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={
          handleClose
        }
      />

      {/* =====================================================
          DRAWER
      ===================================================== */}

      <div className="fixed inset-0 flex items-center justify-center z-50 p-3 sm:p-6 pointer-events-none">

        <div className="pointer-events-auto bg-[#FFFDF8] border border-[#EED69B] rounded-3xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="bg-[#1C1917] text-white px-6 sm:px-8 py-6 flex justify-between items-center gap-4">

            <div className="flex items-center gap-4 min-w-0">

              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#FFB000] text-[#1C1917] flex items-center justify-center text-2xl font-black shrink-0">
                {driver?.name
                  ?.charAt(
                    0
                  )
                  ?.toUpperCase() ||
                  "D"}
              </div>

              <div className="min-w-0">

                <p className="text-xs font-bold tracking-[0.18em] text-[#FFD36A] mb-1">
                  DRIVER PROFILE
                </p>

                <h2 className="text-xl sm:text-2xl font-black truncate">
                  {driver?.name ||
                    "Driver Details"}
                </h2>

                <p className="text-sm text-white/60 truncate">
                  Driver ID:{" "}
                  {driver?.driverId ||
                    "Not assigned"}
                </p>

              </div>

            </div>

            <button
              type="button"
              disabled={
                actionLoading
              }
              onClick={
                handleClose
              }
              className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition shrink-0 disabled:opacity-40"
              aria-label="Close Driver details"
            >
              <X
                size={22}
              />
            </button>

          </div>

          {/* =================================================
              BODY
          ================================================= */}

          {loading ? (
            <div className="flex-1 min-h-[420px] flex flex-col gap-4 items-center justify-center bg-[#FFF9EE]">

              <div className="w-10 h-10 border-4 border-[#FFE09A] border-t-[#FFB000] rounded-full animate-spin" />

              <p className="text-sm font-semibold text-[#8C8276]">
                Loading driver details...
              </p>

            </div>
          ) : driver ? (
            <div className="flex-1 overflow-y-auto p-5 sm:p-8 bg-[#FFF9EE]">

              {/* ===============================================
                  STATUS
              =============================================== */}

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                <div className="flex flex-wrap items-center gap-2">

                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${
                      isApproved
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : isRejected
                          ? "bg-red-100 text-red-700 border border-red-200"
                          : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                    }`}
                  >
                    {normalizedStatus
                      ? normalizedStatus.toUpperCase()
                      : "UNKNOWN"}
                  </span>

                  {isRejectedSnapshot && (
                    <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">
                      Archived rejection
                    </span>
                  )}

                </div>

                {driver.reviewedBy && (
                  <div className="flex items-center gap-2 text-sm text-[#8C8276]">

                    <ShieldCheck
                      size={17}
                      className="text-[#B87700]"
                    />

                    <span>
                      Reviewed by{" "}
                      <strong className="text-[#4A433B]">
                        {driver
                          .reviewedBy
                          ?.email ||
                          "Admin"}
                      </strong>
                    </span>

                  </div>
                )}

              </div>

              {/* ===============================================
                  REJECTED SNAPSHOT INFORMATION
              =============================================== */}

              {isRejectedSnapshot && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">

                  <div className="flex items-start gap-3">

                    <AlertTriangle
                      size={20}
                      className="mt-0.5 shrink-0 text-red-600"
                    />

                    <div>

                      <h3 className="font-black text-red-700">
                        Original Driver registration removed
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-red-600">
                        The full Driver application was removed after rejection. Only the minimum rejection record is retained for application status and audit purposes.
                      </p>

                    </div>

                  </div>

                </div>
              )}

              {/* ===============================================
                  INFORMATION GRID
              =============================================== */}

              <div className="grid lg:grid-cols-2 gap-6">

                {/* =============================================
                    PERSONAL DETAILS
                ============================================= */}

                <div className="bg-[#FFFDF8] border border-[#EEE4D5] rounded-2xl p-6 shadow-sm">

                  <h3 className="font-black text-lg mb-5 flex items-center gap-2 text-[#1C1917]">

                    <User
                      size={20}
                      className="text-[#B87700]"
                    />

                    Personal Information

                  </h3>

                  <div className="space-y-5">

                    <div className="flex items-start gap-3">

                      <Mail
                        size={18}
                        className="text-[#B87700] mt-0.5"
                      />

                      <div className="min-w-0">

                        <p className="text-xs text-[#8C8276]">
                          Email
                        </p>

                        <p className="font-semibold text-[#4A433B] break-all">
                          {driver.email ||
                            "-"}
                        </p>

                      </div>

                    </div>

                    <div className="flex items-start gap-3">

                      <Phone
                        size={18}
                        className="text-[#B87700] mt-0.5"
                      />

                      <div>

                        <p className="text-xs text-[#8C8276]">
                          Phone
                        </p>

                        <p className="font-semibold text-[#4A433B]">
                          {driver.phone ||
                            "-"}
                        </p>

                      </div>

                    </div>

                    {!isRejectedSnapshot && (
                      <div className="flex items-start gap-3">

                        <CreditCard
                          size={18}
                          className="text-[#B87700] mt-0.5"
                        />

                        <div>

                          <p className="text-xs text-[#8C8276]">
                            License Number
                          </p>

                          <p className="font-semibold text-[#4A433B]">
                            {driver.licenseNumber ||
                              "-"}
                          </p>

                        </div>

                      </div>
                    )}

                    {!isRejectedSnapshot && (
                      <div>

                        <p className="text-xs text-[#8C8276] mb-1">
                          Address
                        </p>

                        <p className="font-semibold text-[#4A433B] leading-6">
                          {driver.address ||
                            "-"}
                        </p>

                      </div>
                    )}

                  </div>

                </div>

                {/* =============================================
                    VEHICLE / REVIEW SUMMARY
                ============================================= */}

                {!isRejectedSnapshot ? (
                  <div className="bg-[#FFFDF8] border border-[#EEE4D5] rounded-2xl p-6 shadow-sm">

                    <h3 className="font-black text-lg mb-5 flex items-center gap-2 text-[#1C1917]">

                      <Car
                        size={20}
                        className="text-[#B87700]"
                      />

                      Vehicle Details

                    </h3>

                    <div className="space-y-5">

                      <div>

                        <p className="text-xs text-[#8C8276]">
                          Vehicle Number
                        </p>

                        <p className="font-bold text-[#1C1917] mt-1">
                          {driver.vehicleNumber ||
                            "-"}
                        </p>

                      </div>

                      <div>

                        <p className="text-xs text-[#8C8276]">
                          Vehicle Type
                        </p>

                        <p className="font-semibold text-[#4A433B] mt-1">
                          {driver.vehicleType ||
                            "-"}
                        </p>

                      </div>

                      <div>

                        <p className="text-xs text-[#8C8276]">
                          Vehicle Model
                        </p>

                        <p className="font-semibold text-[#4A433B] mt-1">
                          {driver.vehicleModel ||
                            "Not provided"}
                        </p>

                      </div>

                    </div>

                  </div>
                ) : (
                  <div className="bg-[#FFFDF8] border border-[#EEE4D5] rounded-2xl p-6 shadow-sm">

                    <h3 className="font-black text-lg mb-5 flex items-center gap-2 text-[#1C1917]">

                      <Clock3
                        size={20}
                        className="text-[#B87700]"
                      />

                      Rejection Summary

                    </h3>

                    <div className="space-y-5">

                      <div>

                        <p className="text-xs text-[#8C8276]">
                          Rejected At
                        </p>

                        <p className="font-semibold text-[#4A433B] mt-1">
                          {formatDateTime(
                            driver.rejectedAt
                          )}
                        </p>

                      </div>

                      <div>

                        <p className="text-xs text-[#8C8276]">
                          Rejection Email
                        </p>

                        <p className="font-semibold text-[#4A433B] mt-1">
                          {driver.emailSent
                            ? "Sent successfully"
                            : "Not confirmed"}
                        </p>

                      </div>

                      {driver.emailSentAt && (
                        <div>

                          <p className="text-xs text-[#8C8276]">
                            Email Sent At
                          </p>

                          <p className="font-semibold text-[#4A433B] mt-1">
                            {formatDateTime(
                              driver.emailSentAt
                            )}
                          </p>

                        </div>
                      )}

                      <div>

                        <p className="text-xs text-[#8C8276]">
                          Driver Acknowledged
                        </p>

                        <p className="font-semibold text-[#4A433B] mt-1">
                          {driver.acknowledged
                            ? "Yes"
                            : "Not yet"}
                        </p>

                      </div>

                    </div>

                  </div>
                )}

              </div>

              {/* ===============================================
                  REVIEW INFORMATION
              =============================================== */}

              {(driver.approvedAt ||
                driver.rejectedAt ||
                driver.reviewedBy) && (
                <div className="bg-[#FFFDF8] border border-[#EEE4D5] rounded-2xl p-6 shadow-sm mt-6">

                  <h3 className="font-black text-lg mb-5 flex items-center gap-2 text-[#1C1917]">

                    <Clock3
                      size={20}
                      className="text-[#B87700]"
                    />

                    Review Information

                  </h3>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

                    {!isRejectedSnapshot && (
                      <div>

                        <p className="text-xs text-[#8C8276]">
                          Approved At
                        </p>

                        <p className="font-semibold text-[#4A433B] mt-1">
                          {formatDateTime(
                            driver.approvedAt
                          )}
                        </p>

                      </div>
                    )}

                    <div>

                      <p className="text-xs text-[#8C8276]">
                        Rejected At
                      </p>

                      <p className="font-semibold text-[#4A433B] mt-1">
                        {formatDateTime(
                          driver.rejectedAt
                        )}
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-[#8C8276]">
                        Reviewed By
                      </p>

                      <p className="font-semibold text-[#4A433B] mt-1">
                        {driver
                          .reviewedBy
                          ?.email ||
                          "Not reviewed"}
                      </p>

                    </div>

                  </div>

                </div>
              )}

              {/* ===============================================
                  DOCUMENTS
              =============================================== */}

              {!isRejectedSnapshot && (
                <div className="bg-[#FFFDF8] border border-[#EEE4D5] rounded-2xl mt-6 p-6 shadow-sm">

                  <h3 className="font-black text-lg flex items-center gap-2 mb-5 text-[#1C1917]">

                    <ImageIcon
                      size={20}
                      className="text-[#B87700]"
                    />

                    Uploaded Documents

                  </h3>

                  {documents.length ===
                  0 ? (
                    <div className="py-8 text-center text-sm text-[#8C8276]">
                      No documents available.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

                      {documents.map(
                        (
                          document
                        ) => (
                          <button
                            type="button"
                            key={
                              document.label
                            }
                            onClick={() =>
                              setPreviewImage(
                                document.url
                              )
                            }
                            className="text-left rounded-xl overflow-hidden border border-[#EEE4D5] bg-white hover:shadow-lg hover:-translate-y-1 transition"
                          >

                            <img
                              src={
                                document.url
                              }
                              alt={
                                document.label
                              }
                              className="w-full h-36 object-cover"
                            />

                            <div className="px-3 py-3">

                              <p className="text-xs font-bold text-[#4A433B]">
                                {document.label}
                              </p>

                            </div>

                          </button>
                        )
                      )}

                    </div>
                  )}

                </div>
              )}

              {/* ===============================================
                  REJECTION REASON
              =============================================== */}

              {driver.rejectionReason && (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">

                  <h3 className="font-bold text-red-700 mb-2 flex items-center gap-2">

                    <XCircle
                      size={18}
                    />

                    Rejection Reason

                  </h3>

                  <p className="text-red-600 leading-6 break-words">
                    {driver.rejectionReason}
                  </p>

                </div>
              )}

            </div>
          ) : (
            <div className="flex-1 min-h-[420px] flex items-center justify-center text-[#8C8276] bg-[#FFF9EE]">
              Driver not found
            </div>
          )}

          {/* =================================================
              FOOTER ACTIONS
          ================================================= */}

          {driver &&
            canReview && (
              <div className="border-t border-[#EEE4D5] bg-[#FFFDF8] px-5 sm:px-8 py-5">

                {isPending ? (
                  <div className="flex flex-col md:flex-row gap-4">

                    <button
                      type="button"
                      disabled={
                        actionLoading
                      }
                      onClick={() => {
                        setActionError(
                          ""
                        );

                        setShowConfirm(
                          "approve"
                        );
                      }}
                      className="flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >

                      <CheckCircle
                        size={20}
                      />

                      Approve Driver

                    </button>

                    <button
                      type="button"
                      disabled={
                        actionLoading
                      }
                      onClick={() => {
                        setActionError(
                          ""
                        );

                        setRejectionReason(
                          ""
                        );

                        setShowConfirm(
                          "reject"
                        );
                      }}
                      className="flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >

                      <XCircle
                        size={20}
                      />

                      Reject Driver

                    </button>

                  </div>
                ) : (
                  <div className="rounded-xl bg-[#F6F0E7] border border-[#EEE4D5] px-4 py-3 text-center text-sm font-semibold text-[#625B53]">
                    This application has already been{" "}
                    {normalizedStatus ||
                      "reviewed"}.
                  </div>
                )}

              </div>
            )}

        </div>
      </div>

      {/* =====================================================
          CONFIRM APPROVAL
      ===================================================== */}

      {showConfirm ===
        "approve" && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] px-4">

          <div className="bg-[#FFFDF8] border border-[#EED69B] rounded-3xl shadow-2xl w-full max-w-md p-7">

            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-5">

              <CheckCircle
                size={25}
                className="text-green-600"
              />

            </div>

            <h2 className="text-2xl font-black text-[#1C1917]">
              Approve Driver?
            </h2>

            <p className="text-[#8C8276] mt-2 leading-6">
              This will approve{" "}
              <strong className="text-[#4A433B]">
                {driver?.name}
              </strong>{" "}
              and allow the account to access approved Driver operations.
            </p>

            {actionError && (
              <div className="mt-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm font-semibold text-red-600">
                {actionError}
              </div>
            )}

            <div className="flex gap-3 mt-7">

              <button
                type="button"
                disabled={
                  actionLoading
                }
                onClick={() => {
                  setShowConfirm(
                    ""
                  );

                  setActionError(
                    ""
                  );
                }}
                className="flex-1 h-12 rounded-xl bg-[#F3ECE1] hover:bg-[#EAE0D1] font-bold text-[#625B53] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  actionLoading
                }
                onClick={
                  handleApprove
                }
                className="flex-1 h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold disabled:opacity-60"
              >
                {actionLoading
                  ? "Approving..."
                  : "Approve"}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          REJECTION MODAL
      ===================================================== */}

      {showConfirm ===
        "reject" && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] px-4">

          <div className="bg-[#FFFDF8] border border-[#EED69B] rounded-3xl shadow-2xl w-full max-w-lg p-7">

            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-5">

              <XCircle
                size={25}
                className="text-red-600"
              />

            </div>

            <h2 className="text-2xl font-black text-[#1C1917]">
              Reject Driver
            </h2>

            <p className="text-[#8C8276] mt-2 leading-6">
              Provide a clear reason for rejecting{" "}
              <strong className="text-[#4A433B]">
                {driver?.name}
              </strong>
              .
            </p>

            {/* =================================================
                REJECTION WARNING
            ================================================= */}

            <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">

              <AlertTriangle
                size={18}
                className="mt-0.5 shrink-0 text-amber-600"
              />

              <p className="text-sm leading-5 text-amber-700">
                The Driver will receive the reason by email. After successful delivery, the full Driver registration will be removed and only a minimal rejection record will remain.
              </p>

            </div>

            <div className="mt-5">

              <label className="block text-sm font-bold text-[#4A433B] mb-2">
                Rejection Reason
              </label>

              <textarea
                value={
                  rejectionReason
                }
                disabled={
                  actionLoading
                }
                onChange={(
                  event
                ) => {
                  setRejectionReason(
                    event.target
                      .value
                  );

                  if (
                    actionError
                  ) {
                    setActionError(
                      ""
                    );
                  }
                }}
                maxLength={
                  500
                }
                rows={
                  5
                }
                placeholder="Example: Driving license image is unclear and needs to be resubmitted."
                className="w-full resize-none rounded-xl border border-[#E4D8C8] bg-white px-4 py-3 outline-none focus:border-[#FFB000] focus:ring-4 focus:ring-[#FFB000]/10 disabled:opacity-60"
              />

              <div className="mt-2 flex items-center justify-between text-xs">

                <span
                  className={
                    rejectionReason.trim()
                      .length > 0 &&
                    rejectionReason.trim()
                      .length < 5
                      ? "font-semibold text-red-500"
                      : "text-[#8C8276]"
                  }
                >
                  Minimum 5 characters
                </span>

                <span className="text-[#8C8276]">
                  {rejectionReason.length}
                  /500
                </span>

              </div>

            </div>

            {actionError && (
              <div className="mt-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm font-semibold text-red-600">
                {actionError}
              </div>
            )}

            <div className="flex gap-3 mt-6">

              <button
                type="button"
                disabled={
                  actionLoading
                }
                onClick={() => {
                  setShowConfirm(
                    ""
                  );

                  setRejectionReason(
                    ""
                  );

                  setActionError(
                    ""
                  );
                }}
                className="flex-1 h-12 rounded-xl bg-[#F3ECE1] hover:bg-[#EAE0D1] font-bold text-[#625B53] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  actionLoading ||
                  rejectionReason.trim()
                    .length < 5
                }
                onClick={
                  handleReject
                }
                className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {actionLoading
                  ? "Rejecting..."
                  : "Reject Driver"}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          TOAST
      ===================================================== */}

      {toast && (
        <div className="fixed bottom-8 right-4 sm:right-8 bg-[#1C1917] text-white px-6 py-4 rounded-2xl shadow-2xl z-[70]">
          {toast}
        </div>
      )}

      {/* =====================================================
          DOCUMENT PREVIEW
      ===================================================== */}

      {previewImage && (
        <DocumentModal
          image={
            previewImage
          }
          onClose={() =>
            setPreviewImage(
              null
            )
          }
        />
      )}
    </>
  );
}

/* =========================================================
   EXPORT
========================================================= */

export default DriverDetailDrawer;
import { useState } from "react";

import {
  User,
  Users,
  Car,
  ChevronDown,
  ChevronUp,
  Trash2,
  School,
  Mail,
  Phone,
  MapPin,
  Calendar,
  UserRoundCheck,
} from "lucide-react";

/* =========================================================
   CHILD STATUS STYLE
========================================================= */

const getStatusStyle = (status) => {
  switch (
    String(status || "")
      .trim()
      .toLowerCase()
  ) {
    case "waiting":
      return {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        border: "border-yellow-200",
      };

    case "onboard":
      return {
        bg: "bg-blue-100",
        text: "text-blue-700",
        border: "border-blue-200",
      };

    case "dropped":
      return {
        bg: "bg-green-100",
        text: "text-green-700",
        border: "border-green-200",
      };

    default:
      return {
        bg: "bg-gray-100",
        text: "text-gray-600",
        border: "border-gray-200",
      };
  }
};

/* =========================================================
   DATE FORMAT
========================================================= */

const formatDate = (value) => {
  if (!value) {
    return "--";
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "--";
  }

  return date.toLocaleDateString();
};

/* =========================================================
   PARENT TABLE
========================================================= */

function ParentTable({
  parents = [],
  onDelete,
}) {
  /* =======================================================
     STATE
  ======================================================= */

  const [
    expanded,
    setExpanded,
  ] = useState(null);

  const [
    deletingId,
    setDeletingId,
  ] = useState(null);

  /* =======================================================
     SAFE PARENT LIST
  ======================================================= */

  const parentList =
    Array.isArray(parents)
      ? parents
      : [];

  /* =======================================================
     EXPAND
  ======================================================= */

  const toggleExpand = (
    id
  ) => {
    setExpanded(
      (
        current
      ) =>
        current === id
          ? null
          : id
    );
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete =
    async (
      event,
      parent
    ) => {
      event.stopPropagation();

      if (
        typeof onDelete !==
        "function"
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          `Delete ${parent?.name || "this parent"}?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setDeletingId(
          parent._id
        );

        await onDelete(
          parent._id
        );

        if (
          expanded ===
          parent._id
        ) {
          setExpanded(
            null
          );
        }
      } finally {
        setDeletingId(
          null
        );
      }
    };

  /* =======================================================
     EMPTY STATE
  ======================================================= */

  if (
    parentList.length ===
    0
  ) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center">

        <div className="w-20 h-20 rounded-3xl bg-[#FFF3D1] border border-[#F0D48C] flex items-center justify-center mb-5">

          <Users
            size={34}
            className="text-[#B87700]"
          />

        </div>

        <h2 className="text-xl font-black text-[#1C1917]">
          No Parents Found
        </h2>

        <p className="text-sm text-[#8C8276] mt-2 max-w-sm">
          Registered parent accounts will appear here.
        </p>

      </div>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="rounded-2xl border border-[#EEE4D5] bg-[#FFFDF8] overflow-hidden">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="bg-[#1C1917] px-5 sm:px-7 py-5">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>

            <p className="text-xs font-bold tracking-[0.18em] text-[#FFD36A] mb-1">
              PARENT DIRECTORY
            </p>

            <h2 className="text-xl sm:text-2xl font-black text-white">
              Parent Management
            </h2>

            <p className="text-sm text-white/60 mt-1">
              View registered parents, children and assigned drivers.
            </p>

          </div>

          <div className="bg-white/10 border border-white/10 rounded-2xl px-5 py-3">

            <p className="text-xs text-white/50 font-semibold">
              Total Parents
            </p>

            <h3 className="text-2xl font-black text-[#FFD36A] mt-1">
              {parentList.length}
            </h3>

          </div>

        </div>

      </div>

      {/* =====================================================
          PARENT LIST
      ===================================================== */}

      <div className="divide-y divide-[#EEE4D5]">

        {parentList.map(
          (
            parent,
            index
          ) => {
            const isExpanded =
              expanded ===
              parent._id;

            const childCount =
              Array.isArray(
                parent.children
              )
                ? parent.children
                    .length
                : 0;

            return (
              <div
                key={
                  parent._id ||
                  index
                }
                className="bg-[#FFFDF8]"
              >

                {/* ===========================================
                    PARENT ROW
                =========================================== */}

                <button
                  type="button"
                  onClick={() =>
                    toggleExpand(
                      parent._id
                    )
                  }
                  className="w-full text-left px-5 sm:px-7 py-5 hover:bg-[#FFFAF1] transition"
                >

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                    {/* =======================================
                        PARENT
                    ======================================= */}

                    <div className="flex items-center gap-4 min-w-0">

                      <div className="w-13 h-13 min-w-[52px] min-h-[52px] rounded-2xl bg-[#FFB000] text-[#1C1917] flex items-center justify-center font-black">

                        {parent.name
                          ?.charAt(0)
                          ?.toUpperCase() || (
                          <User
                            size={22}
                          />
                        )}

                      </div>

                      <div className="min-w-0">

                        <h3 className="font-black text-[#1C1917] truncate">
                          {parent.name ||
                            "Parent"}
                        </h3>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">

                          <span className="flex items-center gap-1.5 text-xs text-[#8C8276]">

                            <Phone
                              size={13}
                            />

                            {parent.phone ||
                              "--"}

                          </span>

                          <span className="flex items-center gap-1.5 text-xs text-[#8C8276]">

                            <Mail
                              size={13}
                            />

                            {parent.email ||
                              "--"}

                          </span>

                        </div>

                      </div>

                    </div>

                    {/* =======================================
                        SUMMARY
                    ======================================= */}

                    <div className="flex flex-wrap items-center gap-3">

                      <span className="px-3 py-1.5 rounded-full bg-[#F6F0E7] text-[#625B53] text-xs font-bold">
                        {childCount}{" "}
                        {childCount ===
                        1
                          ? "Child"
                          : "Children"}
                      </span>

                      {parent.driver ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-bold">

                          <UserRoundCheck
                            size={14}
                          />

                          Driver Assigned

                        </span>
                      ) : (
                        <span className="px-3 py-1.5 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-bold">
                          Driver Pending
                        </span>
                      )}

                      <div className="w-9 h-9 rounded-xl bg-[#F6F0E7] flex items-center justify-center text-[#625B53]">

                        {isExpanded ? (
                          <ChevronUp
                            size={18}
                          />
                        ) : (
                          <ChevronDown
                            size={18}
                          />
                        )}

                      </div>

                    </div>

                  </div>

                </button>

                {/* ===========================================
                    EXPANDED DETAILS
                =========================================== */}

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isExpanded
                      ? "max-h-[1400px]"
                      : "max-h-0"
                  }`}
                >

                  <div className="border-t border-[#EEE4D5] bg-[#FFF9EE] px-5 sm:px-7 py-6 space-y-6">

                    {/* =======================================
                        PARENT INFORMATION
                    ======================================= */}

                    <div className="bg-white rounded-2xl border border-[#EEE4D5] p-5">

                      <h4 className="font-black text-[#1C1917] mb-4 flex items-center gap-2">

                        <User
                          size={18}
                          className="text-[#B87700]"
                        />

                        Parent Information

                      </h4>

                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

                        <div>

                          <p className="text-xs text-[#8C8276]">
                            Name
                          </p>

                          <p className="font-semibold text-[#4A433B] mt-1">
                            {parent.name ||
                              "--"}
                          </p>

                        </div>

                        <div>

                          <p className="text-xs text-[#8C8276]">
                            Phone
                          </p>

                          <p className="font-semibold text-[#4A433B] mt-1">
                            {parent.phone ||
                              "--"}
                          </p>

                        </div>

                        <div className="min-w-0">

                          <p className="text-xs text-[#8C8276]">
                            Email
                          </p>

                          <p className="font-semibold text-[#4A433B] mt-1 break-all">
                            {parent.email ||
                              "--"}
                          </p>

                        </div>

                        <div>

                          <p className="text-xs text-[#8C8276]">
                            Registered
                          </p>

                          <p className="font-semibold text-[#4A433B] mt-1 flex items-center gap-2">

                            <Calendar
                              size={14}
                              className="text-[#B87700]"
                            />

                            {formatDate(
                              parent.createdAt
                            )}

                          </p>

                        </div>

                      </div>

                      {(parent.address ||
                        parent.homeAddress) && (
                        <div className="mt-5 pt-5 border-t border-[#EEE4D5]">

                          <p className="text-xs text-[#8C8276] mb-2">
                            Address
                          </p>

                          <div className="flex items-start gap-2">

                            <MapPin
                              size={16}
                              className="text-[#B87700] mt-0.5 shrink-0"
                            />

                            <p className="font-semibold text-[#4A433B] leading-6">
                              {parent.address ||
                                parent.homeAddress}
                            </p>

                          </div>

                        </div>
                      )}

                    </div>

                    {/* =======================================
                        ASSIGNED DRIVER
                    ======================================= */}

                    <div>

                      <div className="flex items-center gap-2 mb-4">

                        <Car
                          size={18}
                          className="text-[#B87700]"
                        />

                        <h4 className="font-black text-[#1C1917]">
                          Assigned Driver
                        </h4>

                      </div>

                      {parent.driver ? (
                        <div className="bg-white rounded-2xl border border-[#EEE4D5] p-5">

                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                            <div className="flex items-center gap-4">

                              <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center">

                                <Car
                                  size={22}
                                />

                              </div>

                              <div>

                                <h4 className="font-black text-[#1C1917]">
                                  {parent.driver
                                    .name ||
                                    "Assigned Driver"}
                                </h4>

                                <p className="text-sm text-[#8C8276] mt-1">
                                  {parent.driver
                                    .driverId ||
                                    "Driver ID unavailable"}
                                </p>

                              </div>

                            </div>

                            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">

                              <div>

                                <p className="text-xs text-[#8C8276]">
                                  Vehicle
                                </p>

                                <p className="font-semibold text-[#4A433B]">
                                  {parent.driver
                                    .vehicleNumber ||
                                    "--"}
                                </p>

                              </div>

                              <div>

                                <p className="text-xs text-[#8C8276]">
                                  Phone
                                </p>

                                <p className="font-semibold text-[#4A433B]">
                                  {parent.driver
                                    .phone ||
                                    "--"}
                                </p>

                              </div>

                            </div>

                          </div>

                        </div>
                      ) : (
                        <div className="bg-white rounded-2xl border border-dashed border-[#DCCEB9] p-6 text-center">

                          <Car
                            size={28}
                            className="mx-auto text-[#B7AA9A]"
                          />

                          <p className="text-sm font-semibold text-[#8C8276] mt-3">
                            No driver assigned
                          </p>

                          <p className="text-xs text-[#AAA096] mt-1">
                            Driver assignment should be handled from the Driver Requests section.
                          </p>

                        </div>
                      )}

                    </div>

                    {/* =======================================
                        CHILDREN
                    ======================================= */}

                    <div>

                      <div className="flex items-center gap-2 mb-4">

                        <School
                          size={18}
                          className="text-[#B87700]"
                        />

                        <h4 className="font-black text-[#1C1917]">
                          Children
                        </h4>

                      </div>

                      {Array.isArray(
                        parent.children
                      ) &&
                      parent.children
                        .length >
                        0 ? (
                        <div className="grid md:grid-cols-2 gap-4">

                          {parent.children.map(
                            (
                              child,
                              childIndex
                            ) => {
                              const style =
                                getStatusStyle(
                                  child.status
                                );

                              return (
                                <div
                                  key={
                                    child._id ||
                                    childIndex
                                  }
                                  className="bg-white rounded-2xl border border-[#EEE4D5] p-5"
                                >

                                  <div className="flex items-start justify-between gap-4">

                                    <div>

                                      <h4 className="font-black text-[#1C1917]">
                                        {child.name ||
                                          "Child"}
                                      </h4>

                                      <div className="space-y-1 mt-2 text-sm text-[#8C8276]">

                                        {child.school && (
                                          <p>
                                            {
                                              child.school
                                            }
                                          </p>
                                        )}

                                        {child.grade && (
                                          <p>
                                            Grade:{" "}
                                            {
                                              child.grade
                                            }
                                          </p>
                                        )}

                                        {child.age && (
                                          <p>
                                            Age:{" "}
                                            {
                                              child.age
                                            }
                                          </p>
                                        )}

                                      </div>

                                    </div>

                                    {child.status && (
                                      <span
                                        className={`${style.bg} ${style.text} ${style.border} border px-3 py-1 rounded-full text-xs font-bold capitalize shrink-0`}
                                      >
                                        {child.status}
                                      </span>
                                    )}

                                  </div>

                                </div>
                              );
                            }
                          )}

                        </div>
                      ) : (
                        <div className="bg-white rounded-2xl border border-dashed border-[#DCCEB9] p-6 text-center text-sm text-[#8C8276]">
                          No children available.
                        </div>
                      )}

                    </div>

                    {/* =======================================
                        DELETE
                    ======================================= */}

                    {typeof onDelete ===
                      "function" && (
                      <div className="flex justify-end pt-2">

                        <button
                          type="button"
                          disabled={
                            deletingId ===
                            parent._id
                          }
                          onClick={(
                            event
                          ) =>
                            handleDelete(
                              event,
                              parent
                            )
                          }
                          className="flex items-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 px-5 py-3 rounded-xl font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2
                            size={17}
                          />

                          {deletingId ===
                          parent._id
                            ? "Deleting..."
                            : "Delete Parent"}
                        </button>

                      </div>
                    )}

                  </div>

                </div>

              </div>
            );
          }
        )}

      </div>

    </div>
  );
}

export default ParentTable;
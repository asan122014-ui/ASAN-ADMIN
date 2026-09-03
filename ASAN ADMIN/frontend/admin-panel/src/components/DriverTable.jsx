import {
  Eye,
  Car,
  Phone,
  User,
  Calendar,
  ChevronRight,
  Mail,
} from "lucide-react";

/* =========================================================
   STATUS STYLE
========================================================= */

const getStatusStyle = (status) => {
  switch (
    String(status || "")
      .trim()
      .toLowerCase()
  ) {
    case "approved":
      return {
        bg: "bg-green-100",
        text: "text-green-700",
        border: "border-green-200",
        dot: "bg-green-500",
      };

    case "rejected":
      return {
        bg: "bg-red-100",
        text: "text-red-700",
        border: "border-red-200",
        dot: "bg-red-500",
      };

    case "pending":
    default:
      return {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        border: "border-yellow-200",
        dot: "bg-yellow-500",
      };
  }
};

/* =========================================================
   DATE FORMATTER
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
   DRIVER TABLE
========================================================= */

function DriverTable({
  drivers = [],
  onSelect,
}) {
  const driverList =
    Array.isArray(drivers)
      ? drivers
      : [];

  /* =======================================================
     SELECT DRIVER
  ======================================================= */

  const handleSelect = (
    driver
  ) => {
    if (
      typeof onSelect ===
      "function"
    ) {
      onSelect(driver);
    }
  };

  /* =======================================================
     EMPTY STATE
  ======================================================= */

  if (
    driverList.length === 0
  ) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center">

        <div className="w-20 h-20 rounded-3xl bg-[#FFF3D1] border border-[#F0D48C] flex items-center justify-center mb-5">

          <Car
            size={34}
            className="text-[#B87700]"
          />

        </div>

        <h2 className="text-xl font-black text-[#1C1917]">
          No Drivers Found
        </h2>

        <p className="text-sm text-[#8C8276] mt-2 max-w-sm">
          Registered drivers matching the current search or filter will appear here.
        </p>

      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-[#EEE4D5] bg-[#FFFDF8]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="bg-[#1C1917] px-5 sm:px-7 py-5">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>
            <p className="text-xs tracking-[0.18em] font-bold text-[#FFD36A] mb-1">
              DRIVER DIRECTORY
            </p>

            <h2 className="text-white text-xl sm:text-2xl font-black">
              Driver Management
            </h2>

            <p className="text-white/60 text-sm mt-1">
              Review registrations and manage driver verification.
            </p>
          </div>

          <div className="bg-white/10 border border-white/10 px-5 py-3 rounded-2xl min-w-[130px]">

            <p className="text-white/50 text-xs font-semibold">
              Drivers Shown
            </p>

            <h2 className="text-[#FFD36A] text-2xl font-black mt-1">
              {driverList.length}
            </h2>

          </div>

        </div>

      </div>

      {/* =====================================================
          DESKTOP TABLE
      ===================================================== */}

      <div className="hidden lg:block overflow-x-auto">

        <table className="w-full min-w-[1050px]">

          <thead className="bg-[#F8F3EB]">

            <tr className="text-left text-[#8C8276] text-xs font-bold uppercase tracking-wide">

              <th className="px-6 py-4">
                #
              </th>

              <th className="px-6 py-4">
                Driver
              </th>

              <th className="px-6 py-4">
                Contact
              </th>

              <th className="px-6 py-4">
                Vehicle
              </th>

              <th className="px-6 py-4">
                Registered
              </th>

              <th className="px-6 py-4">
                Status
              </th>

              <th className="px-6 py-4 text-right">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {driverList.map(
              (
                driver,
                index
              ) => {
                const style =
                  getStatusStyle(
                    driver.status
                  );

                return (
                  <tr
                    key={
                      driver._id ||
                      driver.driverId ||
                      index
                    }
                    className="border-t border-[#F0E8DD] hover:bg-[#FFFAF1] transition"
                  >

                    {/* INDEX */}

                    <td className="px-6 py-5 text-sm font-bold text-[#9B9186]">
                      #
                      {index + 1}
                    </td>

                    {/* DRIVER */}

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-4">

                        <div className="w-12 h-12 rounded-2xl bg-[#FFB000] text-[#1C1917] flex items-center justify-center font-black shrink-0">

                          {driver.name
                            ?.charAt(0)
                            ?.toUpperCase() || (
                            <User
                              size={20}
                            />
                          )}

                        </div>

                        <div className="min-w-0">

                          <p className="font-bold text-[#1C1917] truncate max-w-[190px]">
                            {driver.name ||
                              "Unknown Driver"}
                          </p>

                          <p className="text-xs text-[#8C8276] mt-1">
                            ID:{" "}
                            {driver.driverId ||
                              "Not assigned"}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* CONTACT */}

                    <td className="px-6 py-5">

                      <div className="space-y-2">

                        <div className="flex items-center gap-2 text-sm text-[#625B53]">

                          <Phone
                            size={15}
                            className="text-[#B87700] shrink-0"
                          />

                          <span>
                            {driver.phone ||
                              "--"}
                          </span>

                        </div>

                        <div className="flex items-center gap-2 text-xs text-[#8C8276]">

                          <Mail
                            size={14}
                            className="shrink-0"
                          />

                          <span className="max-w-[180px] truncate">
                            {driver.email ||
                              "--"}
                          </span>

                        </div>

                      </div>

                    </td>

                    {/* VEHICLE */}

                    <td className="px-6 py-5">

                      <div className="flex items-start gap-3">

                        <Car
                          size={18}
                          className="text-[#B87700] mt-0.5 shrink-0"
                        />

                        <div>

                          <p className="font-semibold text-[#4A433B]">
                            {driver.vehicleType ||
                              "--"}
                          </p>

                          <p className="text-xs text-[#8C8276] mt-1">
                            {driver.vehicleNumber ||
                              "--"}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* REGISTRATION */}

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-2 text-sm text-[#625B53]">

                        <Calendar
                          size={16}
                          className="text-[#B87700]"
                        />

                        {formatDate(
                          driver.createdAt
                        )}

                      </div>

                    </td>

                    {/* STATUS */}

                    <td className="px-6 py-5">

                      <span
                        className={`${style.bg} ${style.text} ${style.border} border px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-2`}
                      >

                        <span
                          className={`w-2 h-2 rounded-full ${style.dot}`}
                        />

                        {String(
                          driver.status ||
                            "pending"
                        ).toUpperCase()}

                      </span>

                    </td>

                    {/* ACTION */}

                    <td className="px-6 py-5 text-right">

                      <button
                        type="button"
                        onClick={() =>
                          handleSelect(
                            driver
                          )
                        }
                        className="inline-flex items-center gap-2 bg-[#FFB000] hover:bg-[#EFA500] text-[#1C1917] px-4 py-2.5 rounded-xl font-bold text-sm transition"
                      >
                        <Eye
                          size={17}
                        />

                        View

                        <ChevronRight
                          size={15}
                        />
                      </button>

                    </td>

                  </tr>
                );
              }
            )}

          </tbody>

        </table>

      </div>

      {/* =====================================================
          MOBILE / TABLET CARDS
      ===================================================== */}

      <div className="lg:hidden p-4 space-y-4">

        {driverList.map(
          (
            driver,
            index
          ) => {
            const style =
              getStatusStyle(
                driver.status
              );

            return (
              <div
                key={
                  driver._id ||
                  driver.driverId ||
                  index
                }
                className="bg-white rounded-2xl border border-[#EEE4D5] p-5 shadow-sm"
              >

                {/* HEADER */}

                <div className="flex items-start justify-between gap-4">

                  <div className="flex items-center gap-3 min-w-0">

                    <div className="w-12 h-12 rounded-2xl bg-[#FFB000] text-[#1C1917] flex items-center justify-center font-black shrink-0">

                      {driver.name
                        ?.charAt(0)
                        ?.toUpperCase() || (
                        <User
                          size={20}
                        />
                      )}

                    </div>

                    <div className="min-w-0">

                      <h3 className="font-black text-[#1C1917] truncate">
                        {driver.name ||
                          "Unknown Driver"}
                      </h3>

                      <p className="text-xs text-[#8C8276] mt-1">
                        {driver.driverId ||
                          "ID not assigned"}
                      </p>

                    </div>

                  </div>

                  <span
                    className={`${style.bg} ${style.text} ${style.border} border px-3 py-1 rounded-full text-xs font-bold shrink-0`}
                  >
                    {String(
                      driver.status ||
                        "pending"
                    ).toUpperCase()}
                  </span>

                </div>

                <div className="border-t border-[#F0E8DD] my-5" />

                {/* DETAILS */}

                <div className="grid sm:grid-cols-2 gap-4">

                  <div className="flex items-start gap-3">

                    <Car
                      size={17}
                      className="text-[#B87700] mt-1"
                    />

                    <div>
                      <p className="text-xs text-[#8C8276]">
                        Vehicle
                      </p>

                      <p className="font-semibold text-[#4A433B]">
                        {driver.vehicleType ||
                          "--"}
                      </p>

                      <p className="text-xs text-[#8C8276]">
                        {driver.vehicleNumber ||
                          "--"}
                      </p>
                    </div>

                  </div>

                  <div className="flex items-start gap-3">

                    <Phone
                      size={17}
                      className="text-[#B87700] mt-1"
                    />

                    <div>
                      <p className="text-xs text-[#8C8276]">
                        Phone
                      </p>

                      <p className="font-semibold text-[#4A433B]">
                        {driver.phone ||
                          "--"}
                      </p>
                    </div>

                  </div>

                  <div className="flex items-start gap-3">

                    <Mail
                      size={17}
                      className="text-[#B87700] mt-1"
                    />

                    <div className="min-w-0">
                      <p className="text-xs text-[#8C8276]">
                        Email
                      </p>

                      <p className="font-semibold text-[#4A433B] break-all">
                        {driver.email ||
                          "--"}
                      </p>
                    </div>

                  </div>

                  <div className="flex items-start gap-3">

                    <Calendar
                      size={17}
                      className="text-[#B87700] mt-1"
                    />

                    <div>
                      <p className="text-xs text-[#8C8276]">
                        Registered
                      </p>

                      <p className="font-semibold text-[#4A433B]">
                        {formatDate(
                          driver.createdAt
                        )}
                      </p>
                    </div>

                  </div>

                </div>

                {/* BUTTON */}

                <button
                  type="button"
                  onClick={() =>
                    handleSelect(
                      driver
                    )
                  }
                  className="mt-6 w-full bg-[#FFB000] hover:bg-[#EFA500] text-[#1C1917] py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition"
                >
                  <Eye
                    size={18}
                  />

                  View Driver Details
                </button>

              </div>
            );
          }
        )}

      </div>

    </div>
  );
}

export default DriverTable;
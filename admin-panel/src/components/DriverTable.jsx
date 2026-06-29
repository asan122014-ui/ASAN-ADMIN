import {
  Eye,
  Car,
  Phone,
  User,
  Calendar,
  ChevronRight,
} from "lucide-react";

function DriverTable({ drivers = [], onSelect }) {
  const driverList = Array.isArray(drivers) ? drivers : [];

  const handleSelect = (driver) => {
    if (onSelect) onSelect(driver);
  };

  const getStatusStyle = (status) => {
    switch ((status || "").toLowerCase()) {
      case "approved":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-600",
          dot: "bg-emerald-500",
        };

      case "rejected":
        return {
          bg: "bg-red-50",
          text: "text-red-600",
          dot: "bg-red-500",
        };

      default:
        return {
          bg: "bg-amber-50",
          text: "text-amber-600",
          dot: "bg-amber-500",
        };
    }
  };

  if (!driverList.length) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">

        <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-6">
          <Car size={40} className="text-slate-400" />
        </div>

        <h2 className="text-2xl font-bold text-slate-700">
          No Drivers Found
        </h2>

        <p className="text-slate-400 mt-2">
          Drivers will appear here after registration.
        </p>

      </div>
    );
  }

  return (
    <div className="rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-xl">

      {/* HEADER */}

      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-8 py-5">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-white text-2xl font-bold">
              Driver Management
            </h2>

            <p className="text-blue-100 text-sm mt-1">
              Manage registered drivers and approvals
            </p>

          </div>

          <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl">

            <p className="text-blue-100 text-xs uppercase">
              Total Drivers
            </p>

            <h2 className="text-white text-3xl font-bold">
              {driverList.length}
            </h2>

          </div>

        </div>

      </div>

      {/* DESKTOP TABLE */}

      <div className="hidden lg:block overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr className="text-left text-slate-500 text-sm">

              <th className="px-8 py-5">#</th>

              <th className="px-8 py-5">Driver</th>

              <th className="px-8 py-5">Vehicle</th>

              <th className="px-8 py-5">Phone</th>

              <th className="px-8 py-5">Registered</th>

              <th className="px-8 py-5">Status</th>

              <th className="px-8 py-5 text-right">
                Action
              </th>

            </tr>

          </thead>

          <tbody>
                        {driverList.map((driver, index) => {
              const style = getStatusStyle(driver.status);

              return (
                <tr
                  key={driver._id}
                  className="border-t hover:bg-slate-50 transition-all duration-300"
                >
                  {/* Index */}
                  <td className="px-8 py-5 font-semibold text-slate-500">
                    #{index + 1}
                  </td>

                  {/* Driver */}
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">

                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center shadow-lg">
                        <User size={24} />
                      </div>

                      <div>

                        <h3 className="font-semibold text-slate-800">
                          {driver.name}
                        </h3>

                        <p className="text-sm text-slate-500">
                          ID : {driver.driverId}
                        </p>

                      </div>

                    </div>
                  </td>

                  {/* Vehicle */}

                  <td className="px-8 py-5">

                    <div className="flex items-center gap-3">

                      <Car
                        size={18}
                        className="text-indigo-500"
                      />

                      <div>

                        <p className="font-medium">
                          {driver.vehicleType || "--"}
                        </p>

                        <p className="text-xs text-slate-400">
                          {driver.vehicleNumber || "--"}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* Phone */}

                  <td className="px-8 py-5">

                    <div className="flex items-center gap-2 text-slate-600">

                      <Phone size={16} />

                      {driver.phone || "--"}

                    </div>

                  </td>

                  {/* Registration */}

                  <td className="px-8 py-5">

                    <div className="flex items-center gap-2 text-slate-500">

                      <Calendar size={16} />

                      {driver.createdAt
                        ? new Date(driver.createdAt).toLocaleDateString()
                        : "--"}

                    </div>

                  </td>

                  {/* Status */}

                  <td className="px-8 py-5">

                    <span
                      className={`${style.bg} ${style.text} px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2`}
                    >

                      <span
                        className={`w-2 h-2 rounded-full ${style.dot}`}
                      ></span>

                      {driver.status || "Pending"}

                    </span>

                  </td>

                  {/* Action */}

                  <td className="px-8 py-5 text-right">

                    <button
                      onClick={() => handleSelect(driver)}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:scale-105 transition-all"
                    >
                      <Eye size={18} />
                      View
                      <ChevronRight size={16} />
                    </button>

                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>
            {/* ================= MOBILE CARDS ================= */}

      <div className="lg:hidden space-y-5">

        {driverList.map((driver) => {

          const style = getStatusStyle(driver.status);

          return (

            <div
              key={driver._id}
              className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300"
            >

              {/* Header */}

              <div className="flex justify-between items-start">

                <div className="flex items-center gap-4">

                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-md">
                    <User size={24} />
                  </div>

                  <div>

                    <h3 className="font-bold text-slate-800">
                      {driver.name}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {driver.driverId}
                    </p>

                  </div>

                </div>

                <span
                  className={`${style.bg} ${style.text} px-3 py-1 rounded-full text-xs font-semibold`}
                >
                  {driver.status}
                </span>

              </div>

              <div className="border-t my-5"></div>

              {/* Details */}

              <div className="space-y-4">

                <div className="flex items-center gap-3">

                  <Car
                    size={18}
                    className="text-indigo-500"
                  />

                  <div>

                    <p className="text-xs text-slate-400">
                      Vehicle
                    </p>

                    <p className="font-medium">
                      {driver.vehicleType || "--"}
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-3">

                  <Phone
                    size={18}
                    className="text-green-500"
                  />

                  <div>

                    <p className="text-xs text-slate-400">
                      Phone
                    </p>

                    <p className="font-medium">
                      {driver.phone || "--"}
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-3">

                  <Calendar
                    size={18}
                    className="text-orange-500"
                  />

                  <div>

                    <p className="text-xs text-slate-400">
                      Registered
                    </p>

                    <p className="font-medium">
                      {driver.createdAt
                        ? new Date(driver.createdAt).toLocaleDateString()
                        : "--"}
                    </p>

                  </div>

                </div>

              </div>

              {/* Button */}

              <button
                onClick={() => handleSelect(driver)}
                className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
              >
                <Eye size={18} />
                View Driver Details
              </button>

            </div>

          );

        })}

      </div>

    </div>
  );
}

/* ================= STATUS COLORS ================= */

function getStatusStyle(status) {

  switch ((status || "").toLowerCase()) {

    case "approved":
      return {
        bg: "bg-green-100",
        text: "text-green-700",
        dot: "bg-green-500",
      };

    case "pending":
      return {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        dot: "bg-yellow-500",
      };

    case "rejected":
      return {
        bg: "bg-red-100",
        text: "text-red-700",
        dot: "bg-red-500",
      };

    default:
      return {
        bg: "bg-slate-100",
        text: "text-slate-700",
        dot: "bg-slate-500",
      };

  }

}

export default DriverTable;
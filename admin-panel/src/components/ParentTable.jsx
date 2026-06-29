import { useState } from "react";
import {
  User,
  Users,
  Car,
  ChevronDown,
  ChevronUp,
  Trash2,
  School,
} from "lucide-react";

function ParentTable({
  parents = [],
  drivers = [],
  onDelete,
  onAssign,
}) {
  const [expanded, setExpanded] = useState(null);

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const handleDeleteClick = (id) => {
    if (!onDelete) return;

    if (!window.confirm("Delete this parent?")) return;

    onDelete(id);
  };

  const assignDriver = async (parentId, driverId) => {
    try {
      const res = await fetch(
        "https://asan-driverapp.onrender.com/api/parent/assign-driver",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            parentId,
            driverId,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Failed");
        return;
      }

      onAssign && onAssign();
    } catch (err) {
      console.error(err);
      alert("Failed to assign driver");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "waiting":
        return "bg-yellow-100 text-yellow-700";

      case "onboard":
        return "bg-blue-100 text-blue-700";

      case "dropped":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-lg overflow-hidden">

      {/* Header */}

      <div className="flex items-center justify-between px-8 py-6 border-b bg-slate-50">

        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Parent Management
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Manage parents, children and assigned drivers
          </p>
        </div>

        <div className="bg-indigo-600 text-white rounded-full px-5 py-2 font-semibold shadow">
          {parents.length}
        </div>

      </div>

      {parents.length === 0 ? (
        <div className="py-20 text-center">

          <Users
            size={60}
            className="mx-auto text-slate-300"
          />

          <h3 className="mt-5 text-xl font-semibold text-slate-700">
            No Parents Found
          </h3>

          <p className="text-slate-500 mt-2">
            Parents will appear here after registration.
          </p>

        </div>
      ) : (

        <div className="divide-y divide-slate-200">

          {parents.map((p) => (

            <div
              key={p._id}
              className="transition-all duration-300"
            >

              {/* Parent Row */}

              <div
                onClick={() => toggleExpand(p._id)}
                className="flex items-center justify-between px-8 py-5 hover:bg-slate-50 cursor-pointer"
              >

                {/* Left */}

                <div className="flex items-center gap-5">

                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-lg">
                    <User size={24} />
                  </div>

                  <div>

                    <h3 className="font-semibold text-slate-800">
                      {p.name}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {p.phone}
                    </p>

                    <p className="text-xs text-slate-400">
                      {p.email}
                    </p>

                  </div>

                </div>

                {/* Right */}

                <div className="flex items-center gap-5">

                  <select
                    value={p.driver?.driverId || ""}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      assignDriver(
                        p._id,
                        e.target.value
                      )
                    }
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  >
                    <option value="">
                      Assign Driver
                    </option>

                    {drivers.map((driver) => (
                      <option
                        key={driver._id}
                        value={driver.driverId}
                      >
                        {driver.name}
                      </option>
                    ))}
                  </select>

                  {expanded === p._id ? (
                    <ChevronUp
                      className="text-slate-500"
                    />
                  ) : (
                    <ChevronDown
                      className="text-slate-500"
                    />
                  )}

                </div>

              </div>
                            {/* Expanded Section */}

              <div
                className={`transition-all duration-500 overflow-hidden ${
                  expanded === p._id
                    ? "max-h-[900px]"
                    : "max-h-0"
                }`}
              >
                <div className="bg-slate-50 border-t px-8 py-6 space-y-6">

                  {/* Driver Card */}

                  <div>

                    <div className="flex items-center gap-2 mb-4">
                      <Car size={18} className="text-indigo-600" />
                      <h4 className="font-semibold text-slate-700">
                        Assigned Driver
                      </h4>
                    </div>

                    {p.driver ? (
                      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex justify-between items-center">

                        <div>
                          <h4 className="font-semibold text-slate-800">
                            {p.driver.name}
                          </h4>

                          <p className="text-sm text-slate-500 mt-1">
                            {p.driver.vehicleNumber || "Vehicle Not Added"}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-slate-600">
                            {p.driver.phone}
                          </p>

                          <span className="inline-block mt-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                            Active
                          </span>
                        </div>

                      </div>
                    ) : (
                      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-400">
                        No driver assigned
                      </div>
                    )}

                  </div>

                  {/* Children */}

                  <div>

                    <div className="flex items-center gap-2 mb-4">
                      <School
                        size={18}
                        className="text-indigo-600"
                      />

                      <h4 className="font-semibold text-slate-700">
                        Children
                      </h4>
                    </div>

                    {p.children?.length ? (

                      <div className="grid md:grid-cols-2 gap-4">

                        {p.children.map((child) => (

                          <div
                            key={child._id}
                            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5"
                          >

                            <div className="flex justify-between items-start">

                              <div>

                                <h4 className="font-semibold text-slate-800">
                                  {child.name}
                                </h4>

                                <p className="text-sm text-slate-500 mt-1">
                                  {child.school || "School not available"}
                                </p>

                              </div>

                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  child.status
                                )}`}
                              >
                                {child.status}
                              </span>

                            </div>

                          </div>

                        ))}

                      </div>

                    ) : (

                      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-400">
                        No children assigned
                      </div>

                    )}

                  </div>

                  {/* Footer */}

                  <div className="flex justify-end pt-2">

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(p._id);
                      }}
                      className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl transition shadow-md"
                    >
                      <Trash2 size={18} />
                      Delete Parent
                    </button>

                  </div>

                </div>
              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default ParentTable;
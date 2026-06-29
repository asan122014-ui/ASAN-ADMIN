import { AlertTriangle } from "lucide-react";

function PendingAlert({ pending = 0 }) {
  const count = Number(pending) || 0;

  // Don't show anything if there are no pending drivers
  if (count === 0) return null;

  return (
    <div
      className="mb-8 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl shadow-sm p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      role="alert"
      aria-live="polite"
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center">
          <AlertTriangle
            size={28}
            className="text-yellow-600"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Pending Driver Approvals
          </h2>

          <p className="text-sm text-slate-600 mt-1">
            {count} driver{count > 1 ? "s are" : " is"} waiting for admin
            approval.
          </p>
        </div>
      </div>

      {/* Right Badge */}
      <div className="flex items-center">
        <span className="bg-yellow-500 text-white text-xl font-bold px-5 py-2 rounded-full shadow">
          {count}
        </span>
      </div>
    </div>
  );
}

export default PendingAlert;
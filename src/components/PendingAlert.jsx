import {
  AlertTriangle,
  Car,
} from "lucide-react";

function PendingAlert({
  pending = 0,
}) {
  const count =
    Number(pending) || 0;

  if (count === 0) {
    return null;
  }

  return (
    <div
      className="mb-8 bg-[#FFF8E8] border border-[#F0D48C] rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm"
      role="alert"
      aria-live="polite"
    >
      {/* =====================================================
          LEFT
      ===================================================== */}

      <div className="flex items-center gap-4">

        <div className="w-14 h-14 rounded-2xl bg-[#FFF3D1] border border-[#F0D48C] flex items-center justify-center shrink-0">

          <AlertTriangle
            size={26}
            className="text-[#B87700]"
          />

        </div>

        <div>

          <p className="text-xs font-bold tracking-[0.14em] text-[#B87700] mb-1">
            ACTION REQUIRED
          </p>

          <h2 className="text-lg font-black text-[#1C1917]">
            Pending Driver Requests
          </h2>

          <p className="text-sm text-[#8C8276] mt-1">
            {count} parent
            {count === 1 ? " is" : "s are"} waiting for a driver assignment.
          </p>

        </div>

      </div>

      {/* =====================================================
          COUNT
      ===================================================== */}

      <div className="flex items-center gap-3 bg-[#FFFDF8] border border-[#EEE4D5] rounded-xl px-4 py-3">

        <Car
          size={19}
          className="text-[#B87700]"
        />

        <div>

          <p className="text-[10px] font-bold text-[#8C8276] uppercase tracking-wide">
            Pending
          </p>

          <p className="text-xl font-black text-[#1C1917]">
            {count}
          </p>

        </div>

      </div>

    </div>
  );
}

export default PendingAlert;
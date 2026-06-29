import {
  Users,
  Clock3,
  CheckCircle2,
  XCircle,
} from "lucide-react";

function StatsPanel({ stats = {} }) {
  const {
    totalDrivers = 0,
    pendingDrivers = 0,
    approvedDrivers = 0,
    rejectedDrivers = 0,
  } = stats;

  const cards = [
    {
      key: "total",
      label: "Total Drivers",
      value: Number(totalDrivers),
      icon: Users,
      bg: "from-indigo-500 to-indigo-600",
    },
    {
      key: "pending",
      label: "Pending",
      value: Number(pendingDrivers),
      icon: Clock3,
      bg: "from-yellow-400 to-orange-500",
    },
    {
      key: "approved",
      label: "Approved",
      value: Number(approvedDrivers),
      icon: CheckCircle2,
      bg: "from-emerald-500 to-green-600",
    },
    {
      key: "rejected",
      label: "Rejected",
      value: Number(rejectedDrivers),
      icon: XCircle,
      bg: "from-red-500 to-rose-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.key}
            className="
              bg-white
              rounded-2xl
              shadow-md
              hover:shadow-xl
              transition-all
              duration-300
              hover:-translate-y-1
              overflow-hidden
            "
          >
            {/* Top Gradient */}
            <div className={`h-2 bg-gradient-to-r ${card.bg}`} />

            <div className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-500 font-medium">
                  {card.label}
                </p>

                <h2 className="text-4xl font-bold text-slate-800 mt-2">
                  {card.value}
                </h2>
              </div>

              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${card.bg}
                flex items-center justify-center shadow-lg`}
              >
                <Icon size={28} className="text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StatsPanel;
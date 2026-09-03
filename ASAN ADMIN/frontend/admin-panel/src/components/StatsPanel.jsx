import {
  Users,
  Clock3,
  CheckCircle2,
  XCircle,
  GraduationCap,
  Route,
} from "lucide-react";

function StatsPanel({ stats = {} }) {
  const {
    totalDrivers = 0,
    pendingDrivers = 0,
    approvedDrivers = 0,
    rejectedDrivers = 0,
    totalStudents = 0,
    totalTrips = 0,
  } = stats;

  const cards = [
    {
      key: "totalDrivers",
      label: "Total Drivers",
      value: Number(totalDrivers) || 0,
      icon: Users,
      bg: "bg-[#FFF3D1]",
      text: "text-[#B87700]",
      border: "border-[#F0D48C]",
    },
    {
      key: "pendingDrivers",
      label: "Pending Review",
      value: Number(pendingDrivers) || 0,
      icon: Clock3,
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      border: "border-yellow-200",
    },
    {
      key: "approvedDrivers",
      label: "Approved",
      value: Number(approvedDrivers) || 0,
      icon: CheckCircle2,
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
    },
    {
      key: "rejectedDrivers",
      label: "Rejected",
      value: Number(rejectedDrivers) || 0,
      icon: XCircle,
      bg: "bg-red-50",
      text: "text-red-600",
      border: "border-red-200",
    },
    {
      key: "totalStudents",
      label: "Total Students",
      value: Number(totalStudents) || 0,
      icon: GraduationCap,
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    },
    {
      key: "totalTrips",
      label: "Total Trips",
      value: Number(totalTrips) || 0,
      icon: Route,
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.key}
            className="bg-[#FFFDF8] border border-[#EEE4D5] rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#8C8276]">
                  {card.label}
                </p>

                <h2 className="text-3xl font-black text-[#1C1917] mt-2">
                  {card.value}
                </h2>
              </div>

              <div
                className={`w-13 h-13 min-w-[52px] min-h-[52px] rounded-2xl ${card.bg} ${card.border} border flex items-center justify-center`}
              >
                <Icon
                  size={24}
                  className={card.text}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StatsPanel;
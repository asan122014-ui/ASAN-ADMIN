import {
  Search,
  BarChart3,
  ClipboardList,
  LogOut,
} from "lucide-react";

function Topbar({
  search = "",
  setSearch,
  openAnalytics,
  openLogs,
}) {
  const logout = () => {
    try {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminRole");
    } catch (err) {
      console.log("Logout cleanup failed");
    }

    window.location.replace("/");
  };

  const handleSearch = (e) => {
    if (typeof setSearch === "function") {
      setSearch(e.target.value);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

      {/* Search Box */}
      <div className="relative w-full lg:w-[420px]">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search drivers..."
          value={search}
          onChange={handleSearch}
          className="
            w-full
            pl-11
            pr-4
            py-3
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            text-slate-700
            placeholder:text-slate-400
            outline-none
            focus:border-indigo-500
            focus:ring-4
            focus:ring-indigo-100
            transition-all
          "
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">

        {/* Logs */}
        <button
          onClick={() => openLogs?.()}
          className="
            flex items-center gap-2
            px-5 py-3
            rounded-xl
            bg-slate-700
            text-white
            font-medium
            shadow
            hover:bg-slate-800
            hover:shadow-lg
            transition-all
            duration-300
          "
        >
          <ClipboardList size={18} />
          Logs
        </button>

        {/* Analytics */}
        <button
          onClick={() => openAnalytics?.()}
          className="
            flex items-center gap-2
            px-5 py-3
            rounded-xl
            bg-indigo-600
            text-white
            font-medium
            shadow
            hover:bg-indigo-700
            hover:shadow-lg
            transition-all
            duration-300
          "
        >
          <BarChart3 size={18} />
          Analytics
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="
            flex items-center gap-2
            px-5 py-3
            rounded-xl
            bg-red-500
            text-white
            font-medium
            shadow
            hover:bg-red-600
            hover:shadow-lg
            transition-all
            duration-300
          "
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>

    </div>
  );
}

export default Topbar;
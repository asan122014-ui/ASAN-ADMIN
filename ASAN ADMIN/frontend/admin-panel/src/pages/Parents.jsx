import { useEffect, useState } from "react";
import {
  Users,
  RefreshCw,
  Search,
  User,
  Phone,
  Mail,
} from "lucide-react";

import adminApi from "./services/adminApi";

function Parents() {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  /* =========================================================
     FETCH PARENTS
  ========================================================= */

  const fetchParents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminApi.get("/parent");

      const data = response?.data;

      const parentList = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setParents(parentList);
    } catch (err) {
      console.error("Error fetching parents:", err);

      setParents([]);

      setError(
        err?.response?.data?.message ||
          "Unable to load parent accounts."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    fetchParents();
  }, []);

  /* =========================================================
     FILTER
  ========================================================= */

  const normalizedSearch = search.trim().toLowerCase();

  const filteredParents = parents.filter((parent) => {
    if (!normalizedSearch) {
      return true;
    }

    const name = String(parent?.name || "").toLowerCase();
    const phone = String(parent?.phone || "").toLowerCase();
    const email = String(parent?.email || "").toLowerCase();

    return (
      name.includes(normalizedSearch) ||
      phone.includes(normalizedSearch) ||
      email.includes(normalizedSearch)
    );
  });

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#FFF9EE] p-5 sm:p-8">
      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-7">
        <div>
          <p className="text-xs font-bold tracking-[0.16em] text-[#B87700] mb-2">
            PARENT DIRECTORY
          </p>

          <h1 className="text-3xl font-black text-[#1C1917]">
            Parents
          </h1>

          <p className="text-sm text-[#8C8276] mt-1">
            View registered parent accounts on the platform.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchParents}
          disabled={loading}
          className="h-11 px-5 rounded-xl bg-[#1C1917] hover:bg-black text-white font-bold flex items-center justify-center gap-2 transition disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />

          Refresh
        </button>
      </div>

      {/* SEARCH */}

      <div className="bg-white border border-[#EEE4D5] rounded-2xl p-4 mb-6">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9C9184]"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, phone or email..."
            className="w-full h-12 rounded-xl border border-[#E4D8C8] bg-[#FFFDF8] pl-11 pr-4 text-[#1C1917] outline-none focus:border-[#FFB000] focus:ring-4 focus:ring-[#FFB000]/10"
          />
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      {/* LOADING */}

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <RefreshCw
            size={30}
            className="animate-spin text-[#B87700]"
          />

          <p className="text-sm text-[#8C8276] mt-4">
            Loading parents...
          </p>
        </div>
      ) : filteredParents.length === 0 ? (
        /* EMPTY STATE */

        <div className="bg-white border border-[#EEE4D5] rounded-2xl py-20 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-3xl bg-[#FFF3D1] border border-[#F0D48C] flex items-center justify-center">
            <Users
              size={34}
              className="text-[#B87700]"
            />
          </div>

          <h2 className="text-xl font-black text-[#1C1917] mt-5">
            No Parents Found
          </h2>

          <p className="text-sm text-[#8C8276] mt-2">
            No parent accounts match the current search.
          </p>
        </div>
      ) : (
        /* PARENT GRID */

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredParents.map((parent, index) => (
            <div
              key={parent?._id || index}
              className="bg-white border border-[#EEE4D5] rounded-2xl p-5 hover:shadow-md transition"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FFB000] text-[#1C1917] flex items-center justify-center font-black shrink-0">
                  {parent?.name?.charAt(0)?.toUpperCase() || (
                    <User size={20} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-black text-[#1C1917] truncate">
                    {parent?.name || "Parent"}
                  </h3>

                  <div className="space-y-2 mt-3">
                    <div className="flex items-center gap-2 text-sm text-[#8C8276]">
                      <Phone
                        size={15}
                        className="text-[#B87700]"
                      />

                      <span>
                        {parent?.phone || "--"}
                      </span>
                    </div>

                    <div className="flex items-start gap-2 text-sm text-[#8C8276]">
                      <Mail
                        size={15}
                        className="text-[#B87700] mt-0.5 shrink-0"
                      />

                      <span className="break-all">
                        {parent?.email || "--"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#EEE4D5]">
                    <p className="text-xs text-[#8C8276]">
                      Children
                    </p>

                    <p className="font-black text-[#1C1917] mt-1">
                      {Array.isArray(parent?.children)
                        ? parent.children.length
                        : 0}
                    </p>
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

export default Parents;
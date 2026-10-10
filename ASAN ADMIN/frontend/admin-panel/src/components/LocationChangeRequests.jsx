import { useCallback, useEffect, useState } from "react";
import { Check, Clock3, MapPin, Phone, RefreshCw, X } from "lucide-react";
import adminApi from "../services/adminApi";

export default function LocationChangeRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState("");
  const [error, setError] = useState("");

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await adminApi.get("/child-location-changes/admin?status=pending");
      setRequests(response.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load location requests.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadRequests(); }, [loadRequests]);

  const decide = async (requestId, decision) => {
    setActingId(requestId);
    setError("");
    try {
      await adminApi.patch(`/child-location-changes/admin/${requestId}/decision`, { decision });
      setRequests((current) => current.filter((item) => item._id !== requestId));
    } catch (err) {
      setError(err.response?.data?.message || "The request could not be updated.");
    } finally { setActingId(""); }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-[#4A433B]">Pending location changes</h3>
          <p className="mt-1 text-sm text-[#8C8276]">Review the reason and call the parent to confirm the requested change.</p>
        </div>
        <button type="button" onClick={loadRequests} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-[#E8DDCC] px-4 py-2.5 font-bold text-[#625B53] disabled:opacity-60"><RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh</button>
      </div>
      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}
      {loading ? <div className="py-12 text-center text-sm text-[#8C8276]">Loading requests…</div> : requests.length === 0 ? <div className="rounded-2xl border border-dashed border-[#E8DDCC] bg-[#FFFCF6] py-12 text-center"><p className="font-bold text-[#4A433B]">No pending location requests</p><p className="mt-1 text-sm text-[#8C8276]">New requests from parents will appear here.</p></div> : requests.map((request) => (
        <article key={request._id} className="rounded-2xl border border-[#EEE4D5] bg-[#FFFCF6] p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[1.5px] text-[#B77D00]">{request.locationType === "both" ? "Home and school locations" : request.locationType === "home" ? "Home pickup" : "School location"}</p>
              <h4 className="mt-1 text-lg font-extrabold text-[#1C1917]">{request.childName || "Child"}</h4>
              <p className="text-sm text-[#625B53]">Parent: {request.parentName || "—"}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF2C9] px-3 py-1.5 text-xs font-bold text-[#946500]"><Clock3 size={14} /> Awaiting review</span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-white p-3"><p className="text-[10px] font-bold uppercase tracking-wide text-[#9A8F7E]">Parent contact</p><p className="mt-1 inline-flex items-center gap-2 font-semibold text-[#302B25]"><Phone size={14} />{request.parentPhone || "Phone unavailable"}</p></div>
            <div className="rounded-xl bg-white p-3"><p className="text-[10px] font-bold uppercase tracking-wide text-[#9A8F7E]">Requested on</p><p className="mt-1 font-semibold text-[#302B25]">{request.createdAt ? new Date(request.createdAt).toLocaleString() : "—"}</p></div>
          </div>
          <div className="mt-3 rounded-xl bg-white p-3"><p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-[#9A8F7E]"><MapPin size={13} /> Parent’s reason</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[#302B25]">{request.reason}</p></div>
          <div className="mt-4 flex flex-wrap justify-end gap-2">
            <button type="button" disabled={actingId === request._id} onClick={() => decide(request._id, "reject")} className="inline-flex h-10 items-center gap-2 rounded-xl border border-red-200 px-4 font-bold text-red-700 disabled:opacity-50"><X size={16} /> Reject</button>
            <button type="button" disabled={actingId === request._id} onClick={() => decide(request._id, "approve")} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#FFB000] px-4 font-extrabold text-[#1C1917] disabled:opacity-50"><Check size={16} /> {actingId === request._id ? "Saving…" : "Approve"}</button>
          </div>
        </article>
      ))}
    </section>
  );
}

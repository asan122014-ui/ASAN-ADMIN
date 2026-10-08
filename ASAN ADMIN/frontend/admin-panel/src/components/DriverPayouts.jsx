import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Clock3, ImagePlus, RefreshCw } from "lucide-react";
import adminApi from "../services/adminApi";

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function DriverPayouts() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [proofs, setProofs] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await adminApi.get("/invoices/admin/driver-payouts");
      setPayouts(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (loadError) {
      setError(loadError.response?.data?.message || "Unable to load driver payout records.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const markPaid = async (payout) => {
    const file = proofs[payout._id];
    if (!file) {
      setError("Add a payment confirmation image before marking the installment paid.");
      return;
    }
    setSaving(payout._id);
    setError("");
    setNotice("");
    try {
      const form = new FormData();
      form.append("amount", String(payout.amount));
      form.append("proof", file);
      await adminApi.put(`/invoices/admin/driver-payouts/${payout._id}/paid`, form);
      setNotice("Payment recorded. The receipt is available only to this driver.");
      setProofs((current) => { const next = { ...current }; delete next[payout._id]; return next; });
      await load();
    } catch (saveError) {
      setError(saveError.response?.data?.message || "Unable to record this payment.");
    } finally {
      setSaving("");
    }
  };

  return <section className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h3 className="text-xl font-black text-[#1C1917]">Driver Payments</h3><p className="mt-1 text-sm text-[#8C8276]">Record the mid-service and service-completion transfers. Each receipt is private to its driver.</p></div>
      <button type="button" onClick={load} className="inline-flex items-center gap-2 rounded-xl border border-[#EEE4D5] px-4 py-2.5 text-sm font-bold"><RefreshCw size={15} /> Refresh</button>
    </div>
    {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {notice && <p role="status" className="rounded-xl bg-green-50 p-3 text-sm text-green-700">{notice}</p>}
    {loading ? <p className="py-8 text-center text-sm text-[#8C8276]">Loading payments…</p> : payouts.length === 0 ? <p className="rounded-2xl border border-dashed border-[#E8D9BE] p-8 text-center text-sm text-[#8C8276]">No paid booking or invoice records have created driver installments yet. When a parent payment is verified, the two installments appear here automatically.</p> : <div className="overflow-x-auto rounded-2xl border border-[#EEE4D5]"><table className="w-full min-w-[880px] text-left text-sm"><thead className="bg-[#FFF7E8] text-xs uppercase tracking-wide text-[#806B4D]"><tr><th className="p-4">Driver</th><th className="p-4">Service / month</th><th className="p-4">Installment</th><th className="p-4">Amount</th><th className="p-4">Status</th><th className="p-4">Payment proof / action</th></tr></thead><tbody className="divide-y divide-[#F0E8DA]">{payouts.map((payout) => <tr key={payout._id}><td className="p-4 font-bold">{payout.driverId}</td><td className="p-4">{payout.serviceName || payout.invoiceId?.childId?.name || "Monthly ride service"}<span className="block text-xs text-[#8C8276]">{payout.serviceMonth || payout.invoiceId?.month || "-"} · {payout.serviceReference || payout.invoiceId?.invoiceNumber || "Service"}</span></td><td className="p-4">{payout.installment === "mid_service" ? "After half the service" : "At service end"}</td><td className="p-4 font-black">{money(payout.amount)}</td><td className="p-4"><span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${payout.status === "Paid" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-800"}`}>{payout.status === "Paid" ? <CheckCircle2 size={13} /> : <Clock3 size={13} />}{payout.status}{payout.paidAt ? ` · ${new Date(payout.paidAt).toLocaleDateString("en-IN")}` : ""}</span></td><td className="p-4">{payout.status === "Paid" ? <span className="text-xs text-green-700">Receipt saved for driver</span> : <div className="flex items-center gap-2"><label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#E8D9BE] px-2.5 py-2 text-xs font-semibold"><ImagePlus size={14} />{proofs[payout._id]?.name || "Add receipt"}<input className="hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setProofs((current) => ({ ...current, [payout._id]: event.target.files?.[0] }))} /></label><button disabled={!proofs[payout._id] || saving === payout._id} type="button" onClick={() => markPaid(payout)} className="rounded-lg bg-[#FFB000] px-3 py-2 text-xs font-black disabled:cursor-not-allowed disabled:opacity-50">{saving === payout._id ? "Saving…" : "Mark paid"}</button></div>}</td></tr>)}</tbody></table></div>}
  </section>;
}

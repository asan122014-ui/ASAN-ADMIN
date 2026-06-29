import { useEffect, useState } from "react";
import BillingForm from "../components/BillingForm";
import {
  getBillingSettings,
  updateBillingSettings,
  generateMonthlyInvoices,
} from "../services/billingService";

function BillingSettings() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    ratePerKm: 0,
    platformCommission: 0,
    billingType: "postpaid",
    minimumFare: 0,
    paymentDueDays: 5,
  });

  /* ================= GET TOKEN ================= */

  const getToken = () => {
    return localStorage.getItem("adminToken");
  };

  /* ================= LOAD BILLING SETTINGS ================= */

  const loadBillingSettings = async () => {
    try {
      setLoading(true);

      const token = getToken();

      const res = await getBillingSettings(token);

      if (res.data.success) {
        setFormData({
          ratePerKm: res.data.data.ratePerKm,
          platformCommission: res.data.data.platformCommission,
          billingType: res.data.data.billingType,
          minimumFare: res.data.data.minimumFare,
          paymentDueDays: res.data.data.paymentDueDays,
        });
      }
    } catch (error) {
      console.error("Failed to load billing settings:", error);
      alert("Unable to load billing settings.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SAVE SETTINGS ================= */

  const handleSave = async () => {
    try {
      setLoading(true);

      const token = getToken();

      const res = await updateBillingSettings(formData, token);

      if (res.data.success) {
        alert("Billing settings updated successfully.");
      }
    } catch (error) {
      console.error("Save Error:", error);
      alert("Failed to update billing settings.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= GENERATE MONTHLY INVOICES ================= */

  const handleGenerateInvoices = async () => {
    try {
      setLoading(true);

      const token = getToken();

      const month = new Date().toISOString().slice(0, 7);

      const res = await generateMonthlyInvoices(
        { month },
        token
      );

      if (res.data.success) {
        alert("Monthly invoices generated successfully.");
      }
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to generate invoices."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD PAGE ================= */

  useEffect(() => {
    loadBillingSettings();
  }, []);

  return (
    <div className="p-6">

      <BillingForm
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
        loading={loading}
      />

      <div className="mt-6 flex justify-end">

        <button
          onClick={handleGenerateInvoices}
          disabled={loading}
          className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold shadow transition"
        >
          {loading
            ? "Generating..."
            : "Generate Monthly Invoices"}
        </button>

      </div>

    </div>
  );
}

export default BillingSettings;
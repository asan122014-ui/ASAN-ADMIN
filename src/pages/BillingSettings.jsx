import {
  useEffect,
  useState,
} from "react";

import BillingForm from "../components/BillingForm";

import {
  getBillingSettings,
  updateBillingSettings,
  generateMonthlyInvoices,
} from "../services/billingService";

function BillingSettings() {
  /* =========================================================
     STATE
  ========================================================= */

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    generating,
    setGenerating,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    formData,
    setFormData,
  ] = useState({
    ratePerKm: 0,
    platformCommission: 0,
    billingType: "postpaid",
    minimumFare: 0,
    paymentDueDays: 5,
  });

  /* =========================================================
     LOAD BILLING SETTINGS
  ========================================================= */

  const loadBillingSettings =
    async () => {
      try {
        setLoading(true);
        setErrorMessage("");
        setMessage("");

        const response =
          await getBillingSettings();

        if (
          !response?.success
        ) {
          throw new Error(
            response?.message ||
              "Unable to load billing settings"
          );
        }

        const data =
          response?.data || {};

        setFormData({
          ratePerKm:
            Number(
              data.ratePerKm
            ) || 0,

          platformCommission:
            Number(
              data.platformCommission
            ) || 0,

          billingType:
            data.billingType ||
            "postpaid",

          minimumFare:
            Number(
              data.minimumFare
            ) || 0,

          paymentDueDays:
            Number(
              data.paymentDueDays
            ) || 5,
        });
      } catch (error) {
        console.error(
          "Failed to load billing settings:",
          error
        );

        setErrorMessage(
          error?.response?.data
            ?.message ||
            error?.message ||
            "Unable to load billing settings."
        );
      } finally {
        setLoading(false);
      }
    };

  /* =========================================================
     SAVE SETTINGS
  ========================================================= */

  const handleSave =
    async () => {
      try {
        setLoading(true);
        setMessage("");
        setErrorMessage("");

        const response =
          await updateBillingSettings(
            formData
          );

        if (
          !response?.success
        ) {
          throw new Error(
            response?.message ||
              "Failed to update billing settings"
          );
        }

        setMessage(
          "Billing settings updated successfully."
        );
      } catch (error) {
        console.error(
          "Billing save error:",
          error
        );

        setErrorMessage(
          error?.response?.data
            ?.message ||
            error?.message ||
            "Failed to update billing settings."
        );
      } finally {
        setLoading(false);
      }
    };

  /* =========================================================
     GENERATE MONTHLY INVOICES
  ========================================================= */

  const handleGenerateInvoices =
    async () => {
      const confirmed =
        window.confirm(
          "Generate invoices for the current month?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setGenerating(true);
        setMessage("");
        setErrorMessage("");

        const month =
          new Date()
            .toISOString()
            .slice(
              0,
              7
            );

        const response =
          await generateMonthlyInvoices({
            month,
          });

        if (
          !response?.success
        ) {
          throw new Error(
            response?.message ||
              "Failed to generate invoices"
          );
        }

        setMessage(
          response?.message ||
            "Monthly invoices generated successfully."
        );
      } catch (error) {
        console.error(
          "Invoice generation error:",
          error
        );

        setErrorMessage(
          error?.response?.data
            ?.message ||
            error?.message ||
            "Failed to generate invoices."
        );
      } finally {
        setGenerating(false);
      }
    };

  /* =========================================================
     LOAD PAGE
  ========================================================= */

  useEffect(() => {
    loadBillingSettings();
  }, []);

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div>
        <p className="text-xs font-bold tracking-[0.15em] text-[#B87700] mb-2">
          BILLING CONFIGURATION
        </p>

        <h2 className="text-2xl font-black text-[#1C1917]">
          Billing Settings
        </h2>

        <p className="text-sm text-[#8C8276] mt-1">
          Configure pricing, commission and invoice settings.
        </p>
      </div>

      {/* =====================================================
          MESSAGE
      ===================================================== */}

      {message && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          {message}
        </div>
      )}

      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {errorMessage}
        </div>
      )}

      {/* =====================================================
          FORM
      ===================================================== */}

      <BillingForm
        formData={formData}
        setFormData={
          setFormData
        }
        onSave={
          handleSave
        }
        loading={
          loading
        }
      />

      {/* =====================================================
          GENERATE INVOICES
      ===================================================== */}

      <div className="bg-[#FFF9EE] border border-[#EEE4D5] rounded-2xl p-5 sm:p-6">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          <div>
            <h3 className="font-black text-[#1C1917]">
              Monthly Invoice Generation
            </h3>

            <p className="text-sm text-[#8C8276] mt-1">
              Generate billing invoices for the current month using the saved billing configuration.
            </p>
          </div>

          <button
            type="button"
            onClick={
              handleGenerateInvoices
            }
            disabled={
              loading ||
              generating
            }
            className="bg-[#FFB000] hover:bg-[#EFA500] disabled:opacity-60 disabled:cursor-not-allowed text-[#1C1917] px-6 py-3 rounded-xl font-black transition shrink-0"
          >
            {generating
              ? "Generating..."
              : "Generate Monthly Invoices"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default BillingSettings;
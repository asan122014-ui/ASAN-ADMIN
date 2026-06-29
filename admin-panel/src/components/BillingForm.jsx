import React from "react";

function BillingForm({
  formData,
  setFormData,
  onSave,
  loading,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "billingType"
          ? value
          : Number(value),
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">

      {/* Header */}

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">
          Billing Settings
        </h2>

        <p className="text-gray-500 mt-1">
          Configure pricing for the entire platform.
        </p>
      </div>

      {/* Form */}

      <div className="grid md:grid-cols-2 gap-6">

        {/* Rate Per KM */}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Rate Per KM (₹)
          </label>

          <input
            type="number"
            name="ratePerKm"
            value={formData.ratePerKm}
            onChange={handleChange}
            min="0"
            step="0.1"
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Platform Commission */}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Platform Commission (%)
          </label>

          <input
            type="number"
            name="platformCommission"
            value={formData.platformCommission}
            onChange={handleChange}
            min="0"
            max="100"
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Billing Type */}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Billing Type
          </label>

          <select
            name="billingType"
            value={formData.billingType}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="postpaid">Postpaid</option>
            <option value="prepaid">Prepaid</option>
          </select>
        </div>

        {/* Minimum Fare */}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Minimum Fare (₹)
          </label>

          <input
            type="number"
            name="minimumFare"
            value={formData.minimumFare}
            onChange={handleChange}
            min="0"
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Due Days */}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Payment Due Days
          </label>

          <input
            type="number"
            name="paymentDueDays"
            value={formData.paymentDueDays}
            onChange={handleChange}
            min="1"
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

      </div>

      {/* Save Button */}

      <div className="mt-10 flex justify-end">

        <button
          onClick={onSave}
          disabled={loading}
          className={`px-8 py-3 rounded-xl text-white font-semibold transition-all ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>

      </div>

    </div>
  );
}

export default BillingForm;
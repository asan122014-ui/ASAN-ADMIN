function BillingForm({
  formData,
  setFormData,
  onSave,
  loading,
}) {
  /* =========================================================
     HANDLE CHANGE
  ========================================================= */

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,

        [name]:
          name ===
          "billingType"
            ? value
            : value === ""
            ? ""
            : Number(value),
      })
    );
  };

  /* =========================================================
     SAVE
  ========================================================= */

  const handleSave = () => {
    const ratePerKm =
      Number(
        formData.ratePerKm
      );

    const platformCommission =
      Number(
        formData.platformCommission
      );

    const minimumFare =
      Number(
        formData.minimumFare
      );

    const paymentDueDays =
      Number(
        formData.paymentDueDays
      );

    if (
      Number.isNaN(
        ratePerKm
      ) ||
      ratePerKm < 0
    ) {
      alert(
        "Rate per KM must be 0 or greater."
      );

      return;
    }

    if (
      Number.isNaN(
        platformCommission
      ) ||
      platformCommission <
        0 ||
      platformCommission >
        100
    ) {
      alert(
        "Platform commission must be between 0 and 100."
      );

      return;
    }

    if (
      Number.isNaN(
        minimumFare
      ) ||
      minimumFare < 0
    ) {
      alert(
        "Minimum fare must be 0 or greater."
      );

      return;
    }

    if (
      Number.isNaN(
        paymentDueDays
      ) ||
      paymentDueDays < 1
    ) {
      alert(
        "Payment due days must be at least 1."
      );

      return;
    }

    if (
      typeof onSave ===
      "function"
    ) {
      onSave();
    }
  };

  /* =========================================================
     COMMON INPUT CLASS
  ========================================================= */

  const inputClass =
    "w-full h-12 rounded-xl border border-[#E4D8C8] bg-white px-4 text-[#1C1917] outline-none transition focus:border-[#FFB000] focus:ring-4 focus:ring-[#FFB000]/10 disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <div className="bg-[#FFFDF8] rounded-2xl border border-[#EEE4D5] p-5 sm:p-7 shadow-sm">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-7">

        <p className="text-xs font-bold tracking-[0.15em] text-[#B87700] mb-2">
          PLATFORM PRICING
        </p>

        <h2 className="text-2xl font-black text-[#1C1917]">
          Pricing Configuration
        </h2>

        <p className="text-sm text-[#8C8276] mt-1">
          Configure fares, platform commission and payment terms.
        </p>

      </div>

      {/* =====================================================
          FORM
      ===================================================== */}

      <div className="grid md:grid-cols-2 gap-6">

        {/* ===================================================
            RATE PER KM
        =================================================== */}

        <div>

          <label
            htmlFor="ratePerKm"
            className="block text-sm font-bold text-[#4A433B] mb-2"
          >
            Rate Per KM (₹)
          </label>

          <input
            id="ratePerKm"
            type="number"
            name="ratePerKm"
            value={
              formData.ratePerKm
            }
            onChange={
              handleChange
            }
            disabled={
              loading
            }
            min="0"
            step="0.1"
            placeholder="0"
            className={
              inputClass
            }
          />

          <p className="text-xs text-[#9C9184] mt-2">
            Amount charged per kilometre travelled.
          </p>

        </div>

        {/* ===================================================
            PLATFORM COMMISSION
        =================================================== */}

        <div>

          <label
            htmlFor="platformCommission"
            className="block text-sm font-bold text-[#4A433B] mb-2"
          >
            Platform Commission (%)
          </label>

          <input
            id="platformCommission"
            type="number"
            name="platformCommission"
            value={
              formData.platformCommission
            }
            onChange={
              handleChange
            }
            disabled={
              loading
            }
            min="0"
            max="100"
            step="0.1"
            placeholder="0"
            className={
              inputClass
            }
          />

          <p className="text-xs text-[#9C9184] mt-2">
            Percentage retained by the platform.
          </p>

        </div>

        {/* ===================================================
            BILLING TYPE
        =================================================== */}

        <div>

          <label
            htmlFor="billingType"
            className="block text-sm font-bold text-[#4A433B] mb-2"
          >
            Billing Type
          </label>

          <select
            id="billingType"
            name="billingType"
            value={
              formData.billingType
            }
            onChange={
              handleChange
            }
            disabled={
              loading
            }
            className={
              inputClass
            }
          >
            <option value="postpaid">
              Postpaid
            </option>

            <option value="prepaid">
              Prepaid
            </option>
          </select>

          <p className="text-xs text-[#9C9184] mt-2">
            Choose when customers are charged.
          </p>

        </div>

        {/* ===================================================
            MINIMUM FARE
        =================================================== */}

        <div>

          <label
            htmlFor="minimumFare"
            className="block text-sm font-bold text-[#4A433B] mb-2"
          >
            Minimum Fare (₹)
          </label>

          <input
            id="minimumFare"
            type="number"
            name="minimumFare"
            value={
              formData.minimumFare
            }
            onChange={
              handleChange
            }
            disabled={
              loading
            }
            min="0"
            step="0.1"
            placeholder="0"
            className={
              inputClass
            }
          />

          <p className="text-xs text-[#9C9184] mt-2">
            Minimum amount applicable to a bill.
          </p>

        </div>

        {/* ===================================================
            PAYMENT DUE DAYS
        =================================================== */}

        <div>

          <label
            htmlFor="paymentDueDays"
            className="block text-sm font-bold text-[#4A433B] mb-2"
          >
            Payment Due Days
          </label>

          <input
            id="paymentDueDays"
            type="number"
            name="paymentDueDays"
            value={
              formData.paymentDueDays
            }
            onChange={
              handleChange
            }
            disabled={
              loading
            }
            min="1"
            step="1"
            placeholder="5"
            className={
              inputClass
            }
          />

          <p className="text-xs text-[#9C9184] mt-2">
            Number of days allowed before payment is due.
          </p>

        </div>

      </div>

      {/* =====================================================
          SAVE
      ===================================================== */}

      <div className="mt-8 pt-6 border-t border-[#EEE4D5] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <p className="text-xs text-[#8C8276]">
          Changes will affect future billing calculations.
        </p>

        <button
          type="button"
          onClick={
            handleSave
          }
          disabled={
            loading
          }
          className="px-7 py-3 rounded-xl bg-[#1C1917] hover:bg-black text-white font-bold transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading
            ? "Saving..."
            : "Save Settings"}
        </button>

      </div>

    </div>
  );
}

export default BillingForm;
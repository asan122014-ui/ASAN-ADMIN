import adminApi from "./adminApi";

/* =========================================================
   GET BILLING SETTINGS
========================================================= */

export const getBillingSettings = async () => {
  const response = await adminApi.get(
    "/admin/billing"
  );

  return response.data;
};

/* =========================================================
   UPDATE BILLING SETTINGS
========================================================= */

export const updateBillingSettings = async (
  data
) => {
  const response = await adminApi.put(
    "/admin/billing",
    data
  );

  return response.data;
};

/* =========================================================
   GENERATE MONTHLY INVOICES
========================================================= */

export const generateMonthlyInvoices = async (
  data
) => {
  const response = await adminApi.post(
    "/invoices/generate-all",
    data
  );

  return response.data;
};
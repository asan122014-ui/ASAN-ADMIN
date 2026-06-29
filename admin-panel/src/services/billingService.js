import axios from "axios";

const API = "https://asan-driverapp.onrender.com/api/admin/billing";

/* ================= GET TOKEN ================= */

const getAuthConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

/* ================= GET BILLING SETTINGS ================= */

export const getBillingSettings = async (token) => {
  return await axios.get(
    API,
    getAuthConfig(token)
  );
};

/* ================= UPDATE BILLING SETTINGS ================= */

export const updateBillingSettings = async (
  data,
  token
) => {
  return await axios.put(
    API,
    data,
    getAuthConfig(token)
  );
};

/* ================= GENERATE MONTHLY INVOICES ================= */

export const generateMonthlyInvoices = async (
  data,
  token
) => {
  return await axios.post(
    "https://asan-driverapp.onrender.com/api/invoices/generate-all",
    data,
    getAuthConfig(token)
  );
};
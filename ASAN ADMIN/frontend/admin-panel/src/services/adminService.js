import adminApi from "./adminApi";

/* =========================================================
   DASHBOARD
========================================================= */

export const getDashboardStats = async () => {
  const response = await adminApi.get(
    "/admin/dashboard"
  );

  return response.data;
};

/* =========================================================
   ANALYTICS
========================================================= */

export const getAdminAnalytics = async () => {
  const response = await adminApi.get(
    "/admin/analytics"
  );

  return response.data;
};

/* =========================================================
   GET DRIVERS
========================================================= */

export const getDrivers = async ({
  status = "",
  search = "",
} = {}) => {
  const params = {};

  if (status) {
    params.status = status;
  }

  const normalizedSearch = String(
    search || ""
  ).trim();

  if (normalizedSearch) {
    params.search = normalizedSearch;
  }

  const response = await adminApi.get(
    "/admin/drivers",
    {
      params,
    }
  );

  return response.data;
};

/* =========================================================
   DRIVER DETAILS
========================================================= */

export const getDriverById = async (
  driverMongoId
) => {
  const response = await adminApi.get(
    `/admin/drivers/${driverMongoId}`
  );

  return response.data;
};

/* =========================================================
   APPROVE DRIVER
========================================================= */

export const approveDriver = async (
  driverMongoId
) => {
  const response = await adminApi.put(
    `/admin/drivers/${driverMongoId}/approve`
  );

  return response.data;
};

/* =========================================================
   REJECT DRIVER
========================================================= */

export const rejectDriver = async (
  driverMongoId,
  reason
) => {
  const response = await adminApi.put(
    `/admin/drivers/${driverMongoId}/reject`,
    {
      reason,
    }
  );

  return response.data;
};

/* =========================================================
   ADMIN LOGS
========================================================= */

export const getAdminLogs = async () => {
  const response = await adminApi.get(
    "/admin/logs"
  );

  return response.data;
};
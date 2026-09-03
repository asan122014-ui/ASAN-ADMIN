import axios from "axios";

/* =========================================================
   API BASE URL
========================================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://asan-driverapp.onrender.com";

/* =========================================================
   ADMIN AXIOS INSTANCE
========================================================= */

const adminApi = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================================================
   REQUEST INTERCEPTOR
========================================================= */

adminApi.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("adminToken");

    if (token) {
      config.headers =
        config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    if (
      typeof FormData !== "undefined" &&
      config.data instanceof FormData
    ) {
      delete config.headers["Content-Type"];
    }

    return config;
  },

  (error) => Promise.reject(error)
);

/* =========================================================
   RESPONSE INTERCEPTOR
========================================================= */

adminApi.interceptors.response.use(
  (response) => response,

  (error) => {
    const status =
      error?.response?.status;

    if (status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("admin");
      localStorage.removeItem("adminRole");

      const currentPath =
        window.location.pathname;

      if (
        currentPath !== "/" &&
        currentPath !== "/login"
      ) {
        window.location.replace("/");
      }
    }

    return Promise.reject(error);
  }
);

/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default adminApi;
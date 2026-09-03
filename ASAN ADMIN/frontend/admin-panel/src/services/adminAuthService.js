import adminApi from "./adminApi";

/* =========================================================
   ADMIN LOGIN
========================================================= */

export const loginAdmin = async (
  email,
  password
) => {
  const response = await adminApi.post(
    "/admin-auth/login",
    {
      email,
      password,
    }
  );

  return response.data;
};

/* =========================================================
   CURRENT ADMIN
========================================================= */

export const getCurrentAdmin =
  async () => {
    const response =
      await adminApi.get(
        "/admin-auth/me"
      );

    return response.data;
  };

/* =========================================================
   ADMIN LOGOUT
========================================================= */

export const logoutAdmin =
  async () => {
    const response =
      await adminApi.post(
        "/admin-auth/logout"
      );

    return response.data;
  };

/* =========================================================
   CREATE ADMIN
   SUPERADMIN ONLY
========================================================= */

export const createAdmin =
  async ({
    email,
    password,
    role,
  }) => {
    const response =
      await adminApi.post(
        "/admin-auth/create",
        {
          email,
          password,
          role,
        }
      );

    return response.data;
  };

/* =========================================================
   SAVE ADMIN SESSION
========================================================= */

export const saveAdminSession = (
  token,
  admin
) => {
  if (token) {
    localStorage.setItem(
      "adminToken",
      token
    );
  }

  if (admin) {
    localStorage.setItem(
      "admin",
      JSON.stringify(admin)
    );

    if (admin.role) {
      localStorage.setItem(
        "adminRole",
        admin.role
      );
    }
  }
};

/* =========================================================
   CLEAR ADMIN SESSION
========================================================= */

export const clearAdminSession =
  () => {
    localStorage.removeItem(
      "adminToken"
    );

    localStorage.removeItem(
      "admin"
    );

    localStorage.removeItem(
      "adminRole"
    );
  };

/* =========================================================
   GET TOKEN
========================================================= */

export const getAdminToken =
  () => {
    return localStorage.getItem(
      "adminToken"
    );
  };

/* =========================================================
   GET STORED ADMIN
========================================================= */

export const getStoredAdmin =
  () => {
    try {
      const admin =
        localStorage.getItem(
          "admin"
        );

      return admin
        ? JSON.parse(admin)
        : null;
    } catch (error) {
      console.error(
        "Failed to parse stored admin:",
        error
      );

      return null;
    }
  };

/* =========================================================
   GET STORED ADMIN ROLE
========================================================= */

export const getStoredAdminRole =
  () => {
    return (
      localStorage.getItem(
        "adminRole"
      ) ||
      getStoredAdmin()?.role ||
      ""
    );
  };
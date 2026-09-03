import adminApi from "./adminApi";

/* =========================================================
   GET DRIVER REQUESTS
========================================================= */

export const getDriverRequests =
  async () => {
    const response =
      await adminApi.get(
        "/driver-request"
      );

    return response.data;
  };

/* =========================================================
   ASSIGN DRIVER
========================================================= */

export const assignDriver =
  async (
    requestId,
    driverId
  ) => {
    if (!requestId) {
      throw new Error(
        "Driver request ID is required."
      );
    }

    if (!driverId) {
      throw new Error(
        "Driver ID is required."
      );
    }

    const response =
      await adminApi.put(
        `/driver-request/${requestId}/assign`,
        {
          driverId,
        }
      );

    return response.data;
  };
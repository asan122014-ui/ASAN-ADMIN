import axios from "axios";

const API = "https://asan-driverapp.onrender.com/api/driver-request";

const getConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getDriverRequests = (token) => {
  return axios.get(API, getConfig(token));
};

export const assignDriver = (
  requestId,
  driverId,
  token
) => {
  return axios.put(
    `${API}/${requestId}/assign`,
    { driverId },
    getConfig(token)
  );
};
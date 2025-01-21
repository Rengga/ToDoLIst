import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://test-fe.sidak.co.id",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;

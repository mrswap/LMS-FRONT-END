import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://lms-backend.netswaptech.com/api/v1/admin",
    withCredentials: false,
});

export default axiosInstance;
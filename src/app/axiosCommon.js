import axios from "axios";

const axiosCommonInstance = axios.create({
    baseURL: "https://lms-backend.netswaptech.com/api/v1",
    withCredentials: false,
});

export default axiosCommonInstance;
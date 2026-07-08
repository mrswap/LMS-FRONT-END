import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost/ns/radhika/LMS-Backend/api/v1/admin",
    withCredentials: false,
});

export default axiosInstance;
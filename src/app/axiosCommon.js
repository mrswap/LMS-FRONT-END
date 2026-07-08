import axios from "axios";

const axiosCommonInstance = axios.create({
    baseURL: "http://localhost/ns/radhika/LMS-Backend/api/v1",
    withCredentials: false,
});

export default axiosCommonInstance;
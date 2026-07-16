// export const getAuthConfig = () => {
//     const token = localStorage.getItem("token");

//     return {
//         headers: {
//             Authorization: `Bearer ${token}`,
//             "Accept-Language": "en",
//             "Content-Type": "application/json",
//             Accept: "application/json",
//         },
//     };
// };

// utils/authConfig.js
let isFileUpload = false;

// Function to set file upload mode (called from interceptor)
export const setFileUploadMode = (mode) => {
    isFileUpload = mode;
};

export const getAuthConfig = () => {
    const token = localStorage.getItem("token");

    const headers = {
        Authorization: `Bearer ${token}`,
        "Accept-Language": "en",
        Accept: "application/json",
    };

    // Only add Content-Type for non-file uploads
    if (!isFileUpload) {
        headers["Content-Type"] = "application/json";
    }

    // Reset the flag after use
    isFileUpload = false;

    return { headers };
};

// Add axios interceptor to detect FormData automatically
import axiosInstance from "../app/axios";

// Request interceptor to detect FormData
axiosInstance.interceptors.request.use(
    (config) => {
        // Check if the request data is FormData
        if (config.data instanceof FormData) {
            setFileUploadMode(true);
            // Remove Content-Type header if present to let browser set it
            if (config.headers['Content-Type']) {
                delete config.headers['Content-Type'];
            }
        } else {
            setFileUploadMode(false);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
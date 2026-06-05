export const getAuthConfig = () => {
    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": "en",
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    };
};
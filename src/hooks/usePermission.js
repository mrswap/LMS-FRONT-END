import { useSelector } from "react-redux";

const usePermission = () => {
    const { profile } = useSelector((state) => state.auth);

    const hasPermission = (permissionName) => {
        if (profile?.role?.name === "superadmin") {
            return true;
        }

        if (!permissionName) {
            return false;
        }

        const permissions = profile?.permissions || [];

        return permissions.some(
            (permission) =>
                permission.name === permissionName &&
                permission.assigned === true,
        );
    };

    return {
        hasPermission,
        permissions: profile?.permissions || [],
    };
};

export default usePermission;
import { useSelector } from "react-redux";

const usePermission = () => {
    const { profile } = useSelector((state) => state.auth);
    console.log("permission", profile?.permissions)

    const hasPermission = (permissionName) => {
        // Super Admin
        if (profile?.role?.name === "superadmin") {
            return true;
        }

        // No permission name
        if (!permissionName) {
            return false;
        }

        // User permissions
        const permissions = profile?.permissions || [];

        // Check assigned permission
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
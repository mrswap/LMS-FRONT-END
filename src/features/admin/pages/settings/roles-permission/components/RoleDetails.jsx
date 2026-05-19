import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput } from "../../../../common/form";
import { PageLayout, PageBody } from "../../../../common/layout";
import { useTranslation } from "react-i18next";
import Breadcrumb from "../../../../common/layout/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../../../../common/toast/ToastContext";
import { showConfirm } from "../../../../../../redux/slice/confirmSlice";
import {
  deleteSingleRole,
  getRoleById,
  updateRoleById,
  getAllPermissions,
} from "../../../../../../redux/slice/rolesSlice";
import usePermission from "../../../../../../hooks/usePermission";

const RoleDetails = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const {
    role,
    permissionsGrouped,
    isLoading: permissionsLoading,
  } = useSelector((state) => state.role);

  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [expandedModules, setExpandedModules] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { hasPermission } = usePermission();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([
        dispatch(getRoleById(id)),
        dispatch(getAllPermissions()),
      ]);
      setIsLoading(false);
    };
    fetchData();
  }, [dispatch, id]);

  useEffect(() => {
    if (role?.permissions && role.permissions.length > 0) {
      const permissionIds = role.permissions.map((p) => p.id);
      setSelectedPermissions(permissionIds);
    }
  }, [role]);

  useEffect(() => {
    if (permissionsGrouped?.length) {
      const initialExpanded = {};
      permissionsGrouped.forEach((module) => {
        initialExpanded[module.module] = true;
      });
      setExpandedModules(initialExpanded);
    }
  }, [permissionsGrouped]);

  const toggleModule = (moduleName) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleName]: !prev[moduleName],
    }));
  };

  const handlePermissionToggle = (permissionId) => {
    setSelectedPermissions((prev) => {
      if (prev.includes(permissionId)) {
        return prev.filter((id) => id !== permissionId);
      } else {
        return [...prev, permissionId];
      }
    });
  };

  const handleSelectAllModule = (modulePermissions) => {
    const allModulePermissionIds = modulePermissions.map((p) => p.id);
    const allSelected = allModulePermissionIds.every((id) =>
      selectedPermissions.includes(id),
    );

    if (allSelected) {
      setSelectedPermissions((prev) =>
        prev.filter((id) => !allModulePermissionIds.includes(id)),
      );
    } else {
      setSelectedPermissions((prev) => [
        ...prev,
        ...allModulePermissionIds.filter((id) => !prev.includes(id)),
      ]);
    }
  };

  const handleGlobalSelectAll = () => {
    const allPermissionIds =
      permissionsGrouped?.flatMap((module) =>
        module.permissions.map((p) => p.id),
      ) || [];

    const allSelected =
      allPermissionIds.length > 0 &&
      allPermissionIds.every((id) => selectedPermissions.includes(id));

    if (allSelected) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions(allPermissionIds);
    }
  };

  const isAllSelected = () => {
    const allPermissionIds =
      permissionsGrouped?.flatMap((module) =>
        module.permissions.map((p) => p.id),
      ) || [];
    return (
      allPermissionIds.length > 0 &&
      allPermissionIds.every((id) => selectedPermissions.includes(id))
    );
  };

  const initialValues = {
    name: role?.name || "",
    label: role?.label || "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(t("role.validation.nameRequired")),
    label: Yup.string().required(t("role.validation.labelRequired")),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = {
        name: values.name,
        label: values.label,
        permissions: selectedPermissions,
      };

      await dispatch(updateRoleById({ id, data: formData })).unwrap();
      toast.success(t("role.success.update"));
      // navigate("/roles-permission");
    } catch (err) {
      toast.error(err?.message || t("role.error.update"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const ok = await dispatch(
      showConfirm({ message: t("role.details.deleteText") }),
    );
    if (!ok) return;

    try {
      await dispatch(deleteSingleRole(id)).unwrap();
      toast.success(t("role.success.delete"));
      navigate("/roles-permission");
    } catch (error) {
      toast.error(error?.message || t("role.error.delete"));
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Breadcrumb
        items={[
          {
            label: t("role.breadcrumb.role"),
            path: "/roles-permission",
          },
          { label: t("role.breadcrumb.viewRole") },
        ]}
      />

      <PageBody>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, handleSubmit }) => (
            <Form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <TextInput
                  name="name"
                  label={t("role.details.name")}
                  placeholder={t("role.details.namePlaceholder")}
                  required
                  maxLength={150}
                  disabled={role?.is_system}
                />
                <TextInput
                  name="label"
                  label={t("role.details.label")}
                  placeholder={t("role.details.labelPlaceholder")}
                  required
                  maxLength={150}
                  disabled={role?.is_system}
                />
              </div>

              {!role?.is_system && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-md font-semibold text-gray-800">
                        {t("role.permissions.title")}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {t("role.permissions.subtitle")}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleGlobalSelectAll}
                      className="px-3 py-1.5 text-sm bg-accent text-white rounded hover:bg-opacity-90 transition flex items-center gap-1"
                    >
                      {isAllSelected() ? (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          {t("role.permissions.deselectAll")}
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {t("role.permissions.selectAll")}
                        </>
                      )}
                    </button>
                  </div>

                  {permissionsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
                      <p className="mt-2 text-gray-500">
                        {t("role.permissions.loading")}
                      </p>
                    </div>
                  ) : (
                    <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                      {permissionsGrouped?.map((moduleGroup) => (
                        <div key={moduleGroup.module} className="bg-white">
                          <div
                            className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                            onClick={() => toggleModule(moduleGroup.module)}
                          >
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                className="text-gray-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleModule(moduleGroup.module);
                                }}
                              >
                                {expandedModules[moduleGroup.module] ? (
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 5l7 7-7 7"
                                    />
                                  </svg>
                                )}
                              </button>
                              <span className="font-medium text-gray-900 capitalize">
                                {moduleGroup.module.replace(/-/g, " ")}
                              </span>
                              <span className="text-xs text-gray-500">
                                ({moduleGroup.permissions.length})
                              </span>
                            </div>

                            <label
                              className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                checked={
                                  moduleGroup.permissions.length > 0 &&
                                  moduleGroup.permissions.every((p) =>
                                    selectedPermissions.includes(p.id),
                                  )
                                }
                                onChange={() =>
                                  handleSelectAllModule(moduleGroup.permissions)
                                }
                                className="rounded border-gray-300 text-accent focus:ring-accent cursor-pointer"
                              />
                              <span>{t("role.permissions.selectAll")}</span>
                            </label>
                          </div>

                          {expandedModules[moduleGroup.module] && (
                            <div className="p-3 bg-gray-50 border-t border-gray-200">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {moduleGroup.permissions.map((permission) => (
                                  <label
                                    key={permission.id}
                                    className="flex items-center gap-2 p-2 rounded hover:bg-white cursor-pointer"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedPermissions.includes(
                                        permission.id,
                                      )}
                                      onChange={() =>
                                        handlePermissionToggle(permission.id)
                                      }
                                      className="rounded border-gray-300 text-accent focus:ring-accent cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-700">
                                      {permission.label}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-3">
                {hasPermission("roles.delete") && !role?.is_system && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-4 py-2 border border-red-500 rounded-md text-sm text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
                  >
                    {t("role.actions.deleteRole")}
                  </button>
                )}
                {hasPermission("roles.edit") && (
                  <button
                    type="submit"
                    disabled={isSubmitting || role?.is_system}
                    className={`bg-accent text-white px-4 py-2 rounded cursor-pointer hover:bg-opacity-90 transition ${
                      role?.is_system ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting
                      ? t("role.actions.updating")
                      : t("role.actions.updateRole")}
                  </button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </PageBody>
    </PageLayout>
  );
};

export default RoleDetails;

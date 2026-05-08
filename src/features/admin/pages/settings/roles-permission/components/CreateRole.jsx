import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput } from "../../../../common/form";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  PageLayout,
  PageHeader,
  PageHeaderLeft,
  PageTitle,
  PageSubtitle,
  PageBody,
} from "../../../../common/layout";
import { useToast } from "../../../../common/toast/ToastContext";
import { useNavigate } from "react-router-dom";
import {
  createRole,
  getAllPermissions,
} from "../../../../../../redux/slice/rolesSlice";

const CreateRole = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();

  const { permissionsGrouped, isLoading: permissionsLoading } = useSelector(
    (state) => state.role,
  );

  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [expandedModules, setExpandedModules] = useState({});

  useEffect(() => {
    if (permissionsGrouped?.length) {
      const initialExpanded = {};
      permissionsGrouped.forEach((module) => {
        initialExpanded[module.module] = true;
      });
      setExpandedModules(initialExpanded);
    }
  }, [permissionsGrouped]);

  useEffect(() => {
    dispatch(getAllPermissions());
  }, [dispatch]);

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
    name: "",
    label: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(t("role.validation.nameRequired")),
    label: Yup.string().required(t("role.validation.labelRequired")),
  });

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = {
        name: values.name,
        label: values.label,
        permissions: selectedPermissions,
      };

      await dispatch(createRole(formData)).unwrap();
      toast.success(t("role.success.create"));
      resetForm();
      setSelectedPermissions([]);
      navigate("/roles-permission");
    } catch (error) {
      toast.error(error?.message || t("role.error.create"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="p-8 rounded-lg border border-gray-300">
        <PageHeader>
          <PageHeaderLeft>
            <PageTitle>{t("role.create.title")}</PageTitle>
            <PageSubtitle>{t("role.create.subtitle")}</PageSubtitle>
          </PageHeaderLeft>
        </PageHeader>

        <PageBody className="mt-4">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting, handleSubmit }) => (
              <Form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-4">
                  <TextInput
                    name="name"
                    label={t("role.details.name")}
                    placeholder={t("role.details.namePlaceholder")}
                    required
                    maxLength={150}
                  />
                  <TextInput
                    name="label"
                    label={t("role.details.label")}
                    placeholder={t("role.details.labelPlaceholder")}
                    required
                    maxLength={150}
                  />
                </div>

                {/* Permissions Section */}
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

                <div className="flex justify-end gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-accent text-white rounded cursor-pointer hover:bg-opacity-90 transition"
                  >
                    {isSubmitting
                      ? t("role.actions.creating")
                      : t("role.actions.createRole")}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </PageBody>
      </div>
    </PageLayout>
  );
};

export default CreateRole;

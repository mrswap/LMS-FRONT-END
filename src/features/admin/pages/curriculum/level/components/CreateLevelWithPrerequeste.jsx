import React, { useState, useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import TextInput from "../../../../common/form/TextInput";
import Checkbox from "../../../../common/form/Checkbox";
import SelectField from "../../../../common/form/SelectField";
import { IoShieldCheckmarkOutline, IoClose } from "react-icons/io5";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { FiUpload, FiX, FiImage, FiPlus, FiEdit2 } from "react-icons/fi";

const CreateLevel = () => {
  // State for thumbnail preview
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const fileInputRef = useRef(null);

  // State for prerequisites
  const [predefinedPrerequisites, setPredefinedPrerequisites] = useState([
    {
      id: "level1",
      name: "Basic Level",
      description: "Introductory Level",
      isCustom: false,
    },
    {
      id: "compliance",
      name: "Core Compliance",
      description: "Required basics",
      isCustom: false,
    },
    {
      id: "softskills",
      name: "Soft Skills",
      description: "Communication",
      isCustom: false,
    },
    {
      id: "ops",
      name: "Operational",
      description: "Field work",
      isCustom: false,
    },
  ]);

  const [customPrerequisites, setCustomPrerequisites] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPrerequisite, setEditingPrerequisite] = useState(null);
  const [newPrerequisite, setNewPrerequisite] = useState({
    name: "",
    description: "",
  });

  const initialValues = {
    fullName: "",
    email: "",
    role: "",
    duration: "",
    description: "",
    prerequisites: [], // Stores IDs of selected prerequisites
    thumbnail: null,
  };

  const validationSchema = Yup.object({
    fullName: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    role: Yup.object().required("Required"),
  });

  const onSubmit = (values) => {
    const formData = {
      ...values,
      thumbnail: thumbnail,
      prerequisites: values.prerequisites,
      allPrerequisites: [...predefinedPrerequisites, ...customPrerequisites],
    };
    console.log(formData);
  };

  // Handle thumbnail upload
  const handleThumbnailUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file (JPEG, PNG, etc.)");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }

      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  // Add custom prerequisite
  const addCustomPrerequisite = () => {
    if (!newPrerequisite.name.trim()) {
      alert("Please enter prerequisite name");
      return;
    }

    const newPrereq = {
      id: `custom_${Date.now()}`,
      name: newPrerequisite.name,
      description: newPrerequisite.description || "Custom prerequisite",
      isCustom: true,
    };

    setCustomPrerequisites([...customPrerequisites, newPrereq]);
    setNewPrerequisite({ name: "", description: "" });
    setIsModalOpen(false);
  };

  // Update prerequisite (both predefined and custom)
  const updatePrerequisite = () => {
    if (!editingPrerequisite.name.trim()) {
      alert("Please enter prerequisite name");
      return;
    }

    if (editingPrerequisite.isCustom) {
      // Update custom prerequisite
      setCustomPrerequisites(
        customPrerequisites.map((prereq) =>
          prereq.id === editingPrerequisite.id
            ? {
                ...prereq,
                name: editingPrerequisite.name,
                description: editingPrerequisite.description,
              }
            : prereq,
        ),
      );
    } else {
      // Update predefined prerequisite
      setPredefinedPrerequisites(
        predefinedPrerequisites.map((prereq) =>
          prereq.id === editingPrerequisite.id
            ? {
                ...prereq,
                name: editingPrerequisite.name,
                description: editingPrerequisite.description,
              }
            : prereq,
        ),
      );
    }

    setIsEditModalOpen(false);
    setEditingPrerequisite(null);
  };

  // Delete prerequisite (both predefined and custom)
  const deletePrerequisite = (
    id,
    isCustom,
    formikSetFieldValue,
    currentValues,
  ) => {
    if (isCustom) {
      // Delete custom prerequisite
      setCustomPrerequisites(
        customPrerequisites.filter((prereq) => prereq.id !== id),
      );
    } else {
      // Delete predefined prerequisite
      setPredefinedPrerequisites(
        predefinedPrerequisites.filter((prereq) => prereq.id !== id),
      );
    }

    // Also remove from selected prerequisites if it was selected
    if (currentValues.prerequisites.includes(id)) {
      formikSetFieldValue(
        "prerequisites",
        currentValues.prerequisites.filter((prereqId) => prereqId !== id),
      );
    }
  };

  // Open edit modal
  const openEditModal = (prereq) => {
    setEditingPrerequisite({ ...prereq });
    setIsEditModalOpen(true);
  };

  // Get total prerequisites count
  const getTotalPrerequisitesCount = (selectedPrerequisites) => {
    return selectedPrerequisites?.length || 0;
  };

  // Get all prerequisites (predefined + custom)
  const getAllPrerequisites = () => {
    return [...predefinedPrerequisites, ...customPrerequisites];
  };

  return (
    <>
      <div className="bg-white w-full max-w-4xl p-8 rounded-lg border border-gray-300">
        {/* Heading */}
        <h1 className="text-2xl font-[700] text-primary">Level Management</h1>
        <p className="text-[#29324C] text-[16px] mb-6">
          Manage and organize training levels to structure the learning journey
          from foundational knowledge to advanced clinical expertise.
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, values, setFieldValue }) => {
            // Debug: Log selected prerequisites
            useEffect(() => {
              console.log("Selected prerequisites:", values.prerequisites);
            }, [values.prerequisites]);

            return (
              <Form className="space-y-8">
                {/* General Details */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <span className="text-[18px] text-primary font-[700]">
                      <AiOutlineExclamationCircle />
                    </span>{" "}
                    General Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label className="text-[14px] text-[#29324C] font-[600] mb-1 block">
                        Level Name
                      </label>
                      <TextInput
                        name="levelName"
                        placeholder="type level name"
                      />
                    </div>
                    <div>
                      <label className="text-[14px] text-[#29324C] font-[600] mb-1 block">
                        Parent Program
                      </label>
                      <SelectField
                        name="region"
                        placeholder="Select a region"
                        options={[
                          { label: "India", value: "india" },
                          { label: "USA", value: "usa" },
                        ]}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[14px] text-[#29324C] font-[600] mb-1 block">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows="4"
                      placeholder="Write user description..."
                      className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:border-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Requirements & Prerequisites */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <span className="text-blue-600">
                        <IoShieldCheckmarkOutline />
                      </span>{" "}
                      Requirements & Prerequisites
                    </h3>
                    <span className="text-xs text-gray-500">
                      {getTotalPrerequisitesCount(values.prerequisites)} / 10
                      selected
                    </span>
                  </div>

                  <p className="text-[14px] text-[#29324C] font-[600] mb-3">
                    Select prerequisites
                  </p>

                  {/* All Prerequisites (Predefined + Custom) with Checkboxes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {getAllPrerequisites().map((prereq) => (
                      <div
                        key={prereq.id}
                        className={`border rounded-lg p-3 flex items-start gap-2 group ${
                          prereq.isCustom
                            ? "border-blue-300 bg-blue-50 hover:bg-blue-100"
                            : "border-gray-300 bg-[#F8FAFC] hover:bg-gray-50"
                        } transition-colors`}
                      >
                        <Checkbox
                          name="prerequisites"
                          value={prereq.id}
                          checked={
                            values.prerequisites?.includes(prereq.id) || false
                          }
                          onChange={(e) => {
                            const currentValues = values.prerequisites || [];
                            let newValues;

                            if (e.target.checked) {
                              // Check if adding would exceed limit
                              if (currentValues.length >= 10) {
                                alert("Maximum 10 prerequisites allowed");
                                return;
                              }
                              newValues = [...currentValues, prereq.id];
                            } else {
                              newValues = currentValues.filter(
                                (val) => val !== prereq.id,
                              );
                            }

                            setFieldValue("prerequisites", newValues);
                          }}
                        />
                        <div className="flex-1">
                          <p className="text-[14px] text-[#29324C] font-[600]">
                            {prereq.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {prereq.description}
                          </p>
                        </div>

                        {/* Edit and Delete buttons for ALL prerequisites */}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => openEditModal(prereq)}
                            className="text-blue-600 hover:text-blue-700 p-1"
                            title="Edit"
                          >
                            <FiEdit2 className="text-sm" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              deletePrerequisite(
                                prereq.id,
                                prereq.isCustom,
                                setFieldValue,
                                values,
                              )
                            }
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Delete"
                          >
                            <FiX className="text-sm" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Custom Prerequisite Button */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      disabled={
                        getTotalPrerequisitesCount(values.prerequisites) >= 10
                      }
                      className={`text-blue-600 text-sm mt-3 flex items-center gap-1 ${
                        getTotalPrerequisitesCount(values.prerequisites) >= 10
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:text-blue-700"
                      }`}
                    >
                      <FiPlus /> Add Custom Prerequisite
                    </button>
                  </div>
                </div>

                {/* Thumbnail Preview Card */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <span className="text-blue-600">
                      <FiImage />
                    </span>{" "}
                    Level Thumbnail
                  </h3>

                  <div className="border border-gray-300 bg-[#F8FAFC] p-6 rounded-lg">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                    />

                    {!thumbnailPreview ? (
                      <div
                        onClick={triggerFileUpload}
                        className="flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-500 transition-colors"
                      >
                        <FiUpload className="text-4xl text-gray-400 mb-3" />
                        <p className="text-sm text-gray-600 mb-1">
                          Click to upload thumbnail
                        </p>
                        <p className="text-xs text-gray-400">
                          PNG, JPG, JPEG up to 5MB
                        </p>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="flex items-start gap-6">
                          <div className="relative group">
                            <img
                              src={thumbnailPreview}
                              alt="Thumbnail Preview"
                              className="w-32 h-32 object-cover rounded-lg border border-gray-300 shadow-sm"
                            />
                            <button
                              type="button"
                              onClick={removeThumbnail}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
                            >
                              <FiX className="text-xs" />
                            </button>
                          </div>

                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-700 mb-1">
                              {thumbnail.name}
                            </p>
                            <p className="text-xs text-gray-500 mb-3">
                              {(thumbnail.size / 1024).toFixed(2)} KB
                            </p>
                            <button
                              type="button"
                              onClick={triggerFileUpload}
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                            >
                              <FiUpload className="text-sm" />
                              Change Image
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-gray-400 mt-4 pt-3 border-t border-gray-200">
                          This thumbnail will be displayed as the level preview
                          image
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end items-center pt-4">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="px-4 py-2 border border-[#184994] rounded-md text-sm text-[#184994]"
                    >
                      Save as Draft
                    </button>

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-md text-sm text-white bg-accent"
                    >
                      Save & Continue
                    </button>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>

      {/* Modal for adding custom prerequisite */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Add Custom Prerequisite
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <IoClose className="text-xl" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Prerequisite Name *
                </label>
                <input
                  type="text"
                  value={newPrerequisite.name}
                  onChange={(e) =>
                    setNewPrerequisite({
                      ...newPrerequisite,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g., Advanced JavaScript"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Description
                </label>
                <textarea
                  value={newPrerequisite.description}
                  onChange={(e) =>
                    setNewPrerequisite({
                      ...newPrerequisite,
                      description: e.target.value,
                    })
                  }
                  placeholder="Brief description of this prerequisite"
                  rows="3"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addCustomPrerequisite}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
              >
                Add Prerequisite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for editing prerequisite (both predefined and custom) */}
      {isEditModalOpen && editingPrerequisite && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingPrerequisite.isCustom
                  ? "Edit Custom Prerequisite"
                  : "Edit Prerequisite"}
              </h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingPrerequisite(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <IoClose className="text-xl" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Prerequisite Name *
                </label>
                <input
                  type="text"
                  value={editingPrerequisite.name}
                  onChange={(e) =>
                    setEditingPrerequisite({
                      ...editingPrerequisite,
                      name: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Description
                </label>
                <textarea
                  value={editingPrerequisite.description}
                  onChange={(e) =>
                    setEditingPrerequisite({
                      ...editingPrerequisite,
                      description: e.target.value,
                    })
                  }
                  rows="3"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingPrerequisite(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={updatePrerequisite}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
              >
                Update Prerequisite
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateLevel;

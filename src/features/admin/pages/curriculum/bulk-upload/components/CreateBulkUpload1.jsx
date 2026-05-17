import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { SelectField } from "../../../../common/form";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import {
  PageLayout,
  PageHeader,
  PageHeaderLeft,
  PageTitle,
  PageSubtitle,
  PageBody,
} from "../../../../common/layout";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../../../common/toast/ToastContext";
import { useNavigate } from "react-router-dom";
import { getAllPrograms } from "../../../../../../redux/slice/programSlice";
import { getAllLevels } from "../../../../../../redux/slice/levelSlice";
import CustomEditor from "../../../../common/CustomEditor";
import { createBulkUpload } from "../../../../../../redux/slice/bulkUploadSlicer";

const CreateBulkUpload1 = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();

  const { programs } = useSelector((state) => state.program);
  const { levels, isLoading: isLevelLoading } = useSelector(
    (state) => state.level,
  );

  const [isProgramsLoaded, setIsProgramsLoaded] = useState(false);
  const [isLevelsLoaded, setIsLevelsLoaded] = useState(false);

  const [selectedProgram, setSelectedProgram] = useState(null);
  const [filteredLevels, setFilteredLevels] = useState([]);
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    const loadPrograms = async () => {
      await dispatch(getAllPrograms());
      setIsProgramsLoaded(true);
    };
    loadPrograms();
  }, [dispatch]);

  useEffect(() => {
    if (isProgramsLoaded && selectedProgram) {
      const loadLevels = async () => {
        await dispatch(getAllLevels());
        setIsLevelsLoaded(true);
      };
      loadLevels();
    }
  }, [selectedProgram, isProgramsLoaded, dispatch]);

  useEffect(() => {
    if (selectedProgram && levels?.data && isLevelsLoaded) {
      const programLevels = levels.data.filter((level) => {
        return (
          level.program_id === selectedProgram.value ||
          level.programId === selectedProgram.value ||
          level.program?.id === selectedProgram.value
        );
      });
      setFilteredLevels(programLevels);
    } else {
      setFilteredLevels([]);
    }
  }, [selectedProgram, levels, isLevelsLoaded]);

  const programOptions =
    programs?.data?.map((prog) => ({
      label: prog.title,
      value: prog.id,
    })) || [];

  const levelOptions =
    filteredLevels.map((lev) => ({
      label: lev.title,
      value: lev.id,
    })) || [];

  const initialValues = {
    programName: null,
    levelName: null,
  };

  const validationSchema = Yup.object({
    programName: Yup.object()
      .nullable()
      .required(t("learningUnitBuilder.validation.programRequired")),
    levelName: Yup.object()
      .nullable()
      .required(t("learningUnitBuilder.validation.levelRequired")),
  });

  const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
    try {
      const payload = {
        program_id: values.programName.value,
        level_id: values.levelName.value,
        html: JSON.stringify(htmlContent).slice(1, -1),
      };

      const res = await dispatch(createBulkUpload(payload)).unwrap();

      toast.success(res.message || t("learningUnitBuilder.success.create"));

      resetForm();
      setSelectedProgram(null);
      setFilteredLevels([]);
      setHtmlContent("");
      setIsLevelsLoaded(false);
      //   navigate("/bulk-upload");
    } catch (error) {
      setErrors({ submit: error.message });
      toast.error(error?.message || t("learningUnitBuilder.error.create"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="p-8 rounded-lg border border-gray-300">
        <PageHeader>
          <PageHeaderLeft>
            <PageTitle>Purana wala</PageTitle>
            <PageSubtitle>
              {t("learningUnitBuilder.create.subtitle")}
            </PageSubtitle>
          </PageHeaderLeft>
        </PageHeader>

        <PageBody className="mt-4">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize={true}
          >
            {({ isSubmitting, values, setFieldValue, handleSubmit }) => {
              return (
                <Form onSubmit={handleSubmit} className="space-y-8">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <span className="text-[18px] text-primary font-[700]">
                        <AiOutlineExclamationCircle />
                      </span>
                      {t("learningUnitBuilder.details.generalDetails")}
                    </h3>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                        <div>
                          <SelectField
                            name="programName"
                            label={t(
                              "learningUnitBuilder.details.parentProgram",
                            )}
                            placeholder={t(
                              "learningUnitBuilder.details.parentProgramPlaceholder",
                            )}
                            required={true}
                            options={programOptions || []}
                            onChange={(option) => {
                              setFieldValue("programName", option);
                              setFieldValue("levelName", null);
                              setSelectedProgram(option);
                              setIsLevelsLoaded(false);
                            }}
                          />
                        </div>

                        <div>
                          <SelectField
                            name="levelName"
                            label={t("learningUnitBuilder.details.parentLevel")}
                            placeholder={t(
                              "learningUnitBuilder.details.parentLevelPlaceholder",
                            )}
                            required={true}
                            options={levelOptions || []}
                            disabled={!values.programName}
                            isLoading={isLevelLoading}
                            onChange={(option) => {
                              setFieldValue("levelName", option);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <span className="text-[18px] text-primary font-[700]">
                        <AiOutlineExclamationCircle />
                      </span>
                      {t("learningUnitBuilder.details.content.contentSection")}
                    </h3>

                    <div className="mb-4">
                      <CustomEditor
                        value={htmlContent}
                        onChange={setHtmlContent}
                        placeholder={t(
                          "learningUnitBuilder.details.content.editorPlaceholder",
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end items-center pt-4">
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={
                          isSubmitting || !values.levelName || !htmlContent
                        }
                        className="px-4 py-2 rounded-md text-sm text-white bg-accent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90"
                      >
                        {isSubmitting
                          ? t("learningUnitBuilder.actions.creating")
                          : t("learningUnitBuilder.actions.createContent")}
                      </button>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </PageBody>
      </div>
    </PageLayout>
  );
};

export default CreateBulkUpload1;

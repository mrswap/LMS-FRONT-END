// import { useEffect, useState } from "react";
// import {
//   FaUser,
//   FaEnvelope,
//   FaCheckCircle,
//   FaRegCircle,
//   FaReply,
//   FaCalendarAlt,
//   FaClock,
//   FaArrowLeft,
//   FaTag,
//   FaPhone,
//   FaBuilding,
// } from "react-icons/fa";
// import { MdMarkEmailRead, MdMarkEmailUnread } from "react-icons/md";
// import { PageLayout, PageBody } from "../../../../common/layout";
// import { useDispatch, useSelector } from "react-redux";
// import Loader from "../../../../common/Loader";
// import Error from "../../../../common/Error";
// import {
//   getSingleContact,
//   markAsSeen,
//   markAsUnseen,
// } from "../../../../../../redux/slice/contactSlice";
// import { useTranslation } from "react-i18next";
// import { useParams, useNavigate } from "react-router-dom";
// import Breadcrumb from "../../../../common/layout/Breadcrumb";
// import { useToast } from "../../../../common/toast/ToastContext";

// const ContactDetails = () => {
//   const { t } = useTranslation();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const toast = useToast();
//   const { contact, isLoading, isError, message } = useSelector(
//     (state) => state.contact,
//   );

//   const [isUpdating, setIsUpdating] = useState(false);
//   const contactData = contact?.data || contact;

//   useEffect(() => {
//     dispatch(getSingleContact(id));
//   }, [dispatch, id]);

//   const handleMarkAsSeen = async () => {
//     setIsUpdating(true);
//     try {
//       const result = await dispatch(markAsSeen(id)).unwrap();
//       toast.success(result?.message || t("contact.success.markAsSeen"));
//       await dispatch(getSingleContact(id));
//     } catch (error) {
//       toast.error(error?.message || t("contact.error.markAsSeen"));
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   const handleMarkAsUnseen = async () => {
//     setIsUpdating(true);
//     try {
//       const result = await dispatch(markAsUnseen(id)).unwrap();
//       toast.success(result?.message || t("contact.success.markAsUnseen"));
//       await dispatch(getSingleContact(id));
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   if (isLoading) return <Loader />;
//   if (isError) return <Error message={message} />;

//   return (
//     <PageLayout>
//       <Breadcrumb
//         items={[
//           { label: "Contact Management", path: "/contact-us" },
//           { label: "View Contact" },
//         ]}
//       />

//       <PageBody>
//         {contactData && (
//           <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
//             {/* Header */}
//             <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h1 className="text-2xl font-semibold text-gray-900">
//                     {contactData.name}
//                   </h1>
//                   <p className="text-gray-600 mt-1">{contactData.email}</p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   {contactData.is_seen === 1 ? (
//                     <>
//                       <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-sm bg-green-50 text-green-700 border border-green-200">
//                         <FaCheckCircle size={12} />
//                         Seen
//                       </span>
//                       <button
//                         onClick={handleMarkAsUnseen}
//                         disabled={isUpdating}
//                         className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
//                       >
//                         <MdMarkEmailUnread size={16} className="inline mr-1" />
//                         Mark as Unseen
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-sm bg-amber-50 text-amber-700 border border-amber-200">
//                         <FaRegCircle size={12} />
//                         Unseen
//                       </span>
//                       <button
//                         onClick={handleMarkAsSeen}
//                         disabled={isUpdating}
//                         className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
//                       >
//                         <MdMarkEmailRead size={16} className="inline mr-1" />
//                         Mark as Seen
//                       </button>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Content */}
//             <div className="p-6">
//               {/* Subject */}
//               <div className="mb-6">
//                 <div className="flex items-center gap-2 mb-2">
//                   <FaTag size={14} className="text-gray-400" />
//                   <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Subject
//                   </span>
//                 </div>
//                 <div className="bg-gray-50 px-4 py-3 rounded border border-gray-200">
//                   <p className="text-gray-800 font-medium">
//                     {contactData.subject}
//                   </p>
//                 </div>
//               </div>

//               {/* Message */}
//               <div className="mb-6">
//                 <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Message
//                 </span>
//                 <div className="mt-2 bg-gray-50 px-4 py-4 rounded border border-gray-200">
//                   <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
//                     {contactData.message}
//                   </p>
//                 </div>
//               </div>

//               {/* Meta Information */}
//               <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
//                 <div className="flex items-start gap-3">
//                   <FaCalendarAlt size={14} className="text-gray-400 mt-0.5" />
//                   <div>
//                     <p className="text-xs text-gray-500">Created</p>
//                     <p className="text-sm text-gray-700">
//                       {new Date(contactData.created_at).toLocaleDateString()}
//                     </p>
//                     <p className="text-xs text-gray-400">
//                       {new Date(contactData.created_at).toLocaleTimeString()}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-3">
//                   <FaClock size={14} className="text-gray-400 mt-0.5" />
//                   <div>
//                     <p className="text-xs text-gray-500">Last Updated</p>
//                     <p className="text-sm text-gray-700">
//                       {new Date(contactData.updated_at).toLocaleDateString()}
//                     </p>
//                     <p className="text-xs text-gray-400">
//                       {new Date(contactData.updated_at).toLocaleTimeString()}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
//                 <button
//                   onClick={() => {
//                     window.location.href = `mailto:${contactData.email}?subject=Re: ${contactData.subject}`;
//                   }}
//                   className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm rounded  transition-colors cursor-pointer"
//                 >
//                   <FaReply size={14} />
//                   Reply via Email
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </PageBody>
//     </PageLayout>
//   );
// };

// export default ContactDetails;

import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaRegCircle,
  FaReply,
  FaCalendarAlt,
  FaClock,
  FaTag,
} from "react-icons/fa";
import { MdMarkEmailRead, MdMarkEmailUnread } from "react-icons/md";
import { PageLayout, PageBody } from "../../../../common/layout";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../../common/Loader";
import Error from "../../../../common/Error";
import {
  getSingleContact,
  markAsSeen,
  markAsUnseen,
} from "../../../../../../redux/slice/contactSlice";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrumb from "../../../../common/layout/Breadcrumb";
import { useToast } from "../../../../common/toast/ToastContext";

const ContactDetails = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const { contact, isLoading, isError, message } = useSelector(
    (state) => state.contact,
  );

  const [isUpdating, setIsUpdating] = useState(false);
  const contactData = contact?.data || contact;

  useEffect(() => {
    dispatch(getSingleContact(id));
  }, [dispatch, id]);

  const handleMarkAsSeen = async () => {
    setIsUpdating(true);
    try {
      const result = await dispatch(markAsSeen(id)).unwrap();
      toast.success(result?.message || t("contact.success.markAsSeen"));
      await dispatch(getSingleContact(id));
    } catch (error) {
      toast.error(error?.message || t("contact.error.markAsSeen"));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkAsUnseen = async () => {
    setIsUpdating(true);
    try {
      const result = await dispatch(markAsUnseen(id)).unwrap();
      toast.success(result?.message || t("contact.success.markAsUnseen"));
      await dispatch(getSingleContact(id));
    } catch (error) {
      toast.error(error?.message || t("contact.error.markAsUnseen"));
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <Loader />;
  if (isError) return <Error message={message} />;

  return (
    <PageLayout>
      <Breadcrumb
        items={[
          {
            label: t("contact.breadcrumb.contactManagement"),
            path: "/contact-us-report",
          },
          { label: t("contact.breadcrumb.viewContact") },
        ]}
      />

      <PageBody>
        {contactData && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            {/* Header */}
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {contactData.name}
                  </h1>
                  <p className="text-gray-600 mt-1">{contactData.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  {contactData.is_seen === 1 ? (
                    <>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-sm bg-green-50 text-green-700 border border-green-200">
                        <FaCheckCircle size={12} />
                        {t("contact.status.seen")}
                      </span>
                      <button
                        onClick={handleMarkAsUnseen}
                        disabled={isUpdating}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <MdMarkEmailUnread size={16} className="inline mr-1" />
                        {t("contact.details.markAsUnseen")}
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-sm bg-amber-50 text-amber-700 border border-amber-200">
                        <FaRegCircle size={12} />
                        {t("contact.status.unseen")}
                      </span>
                      <button
                        onClick={handleMarkAsSeen}
                        disabled={isUpdating}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <MdMarkEmailRead size={16} className="inline mr-1" />
                        {t("contact.details.markAsSeen")}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Subject */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <FaTag size={14} className="text-gray-400" />
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("contact.details.subject")}
                  </span>
                </div>
                <div className="bg-gray-50 px-4 py-3 rounded border border-gray-200">
                  <p className="text-gray-800 font-medium">
                    {contactData.subject}
                  </p>
                </div>
              </div>

              {/* Message */}
              <div className="mb-6">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("contact.details.message")}
                </span>
                <div className="mt-2 bg-gray-50 px-4 py-4 rounded border border-gray-200">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {contactData.message}
                  </p>
                </div>
              </div>

              {/* Meta Information */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-start gap-3">
                  <FaCalendarAlt size={14} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">
                      {t("contact.details.created")}
                    </p>
                    <p className="text-sm text-gray-700">
                      {new Date(contactData.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(contactData.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaClock size={14} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">
                      {t("contact.details.lastUpdated")}
                    </p>
                    <p className="text-sm text-gray-700">
                      {new Date(contactData.updated_at).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(contactData.updated_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => {
                    window.location.href = `mailto:${contactData.email}?subject=Re: ${contactData.subject}`;
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm rounded transition-colors cursor-pointer"
                >
                  <FaReply size={14} />
                  {t("contact.details.replyViaEmail")}
                </button>
              </div>
            </div>
          </div>
        )}
      </PageBody>
    </PageLayout>
  );
};

export default ContactDetails;

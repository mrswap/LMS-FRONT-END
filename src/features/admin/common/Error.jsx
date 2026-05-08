import React, { useState } from "react";

const Error = ({
  type = "error",
  title,
  message,
  onRetry,
  onDismiss,
  fullScreen = false,
  showIcon = true,
  showRetry = true,
  showDismiss = true,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  const handleRetry = () => {
    if (onRetry) onRetry();
  };

  if (!isVisible) return null;

  const alertConfig = {
    error: {
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-800",
      iconColor: "text-red-500",
      title: "Error",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    warning: {
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-800",
      iconColor: "text-yellow-500",
      title: "Warning",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
    },
    info: {
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-800",
      iconColor: "text-blue-500",
      title: "Information",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    success: {
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-800",
      iconColor: "text-green-500",
      title: "Success",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  };

  const config = alertConfig[type] || alertConfig.error;
  const displayTitle = title || config.title;

  const containerClasses = fullScreen
    ? "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    : "w-full";

  const alertClasses = `
    ${config.bgColor}
    ${config.borderColor}
    border-l-4
    rounded-lg
    shadow-lg
    ${fullScreen ? "max-w-md w-full" : "w-full"}
  `;

  return (
    <div className={containerClasses}>
      <div className={alertClasses} role="alert">
        <div className="p-4">
          <div className="flex items-start">
            {/* Icon Section */}
            {showIcon && (
              <div className={`flex-shrink-0 ${config.iconColor}`}>
                {config.icon}
              </div>
            )}

            {/* Content Section */}
            <div className={`flex-1 ${showIcon ? "ml-3" : ""}`}>
              <h3 className={`text-sm font-semibold ${config.textColor} mb-1`}>
                {displayTitle}
              </h3>

              <div className={`text-sm ${config.textColor} opacity-90`}>
                {message}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex gap-3">
                {showRetry && onRetry && (
                  <button
                    onClick={handleRetry}
                    className={`
                      inline-flex items-center px-3 py-1.5 text-sm font-medium
                      rounded-md transition-all duration-200
                      ${config.textColor}
                      ${config.bgColor}
                      hover:bg-opacity-80
                      focus:outline-none focus:ring-2 focus:ring-offset-2
                      focus:ring-${type === "error" ? "red" : type === "warning" ? "yellow" : "blue"}-500
                    `}
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Try Again
                  </button>
                )}

                {showDismiss && (
                  <button
                    onClick={handleDismiss}
                    className={`
                      inline-flex items-center px-3 py-1.5 text-sm font-medium
                      rounded-md transition-all duration-200
                      text-gray-600 hover:text-gray-800
                      hover:bg-gray-100
                      focus:outline-none focus:ring-2 focus:ring-gray-500
                    `}
                  >
                    <svg
                      className="w-4 h-4 mr-1"
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
                    Dismiss
                  </button>
                )}
              </div>
            </div>

            {/* Close Button for FullScreen */}
            {fullScreen && showDismiss && (
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-5 h-5"
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
              </button>
            )}
          </div>
        </div>

        {/* Medical Pulse Animation for Error */}
        {type === "error" && (
          <div className="h-1 w-full bg-red-100 rounded-b-lg overflow-hidden">
            <div
              className="h-full bg-red-500 animate-pulse"
              style={{ width: "100%" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Error;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { FiAlertCircle, FiRefreshCw, FiX, FiHome } from "react-icons/fi";
// import { useDispatch } from "react-redux";
// import { logout } from "../../../redux/slice/authSlice";

// const Error = ({
//   type = "error",
//   title,
//   message,
//   onRetry,
//   onDismiss,
//   fullScreen = false,
//   showIcon = true,
//   showRetry = true,
//   showDismiss = true,
//   showHome = true,
//   autoReload = false,
//   reloadDelay = 5000,
// }) => {
//   const [isVisible, setIsVisible] = useState(true);
//   const [countdown, setCountdown] = useState(reloadDelay / 1000);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // Function to check token from localStorage
//   const getToken = () => {
//     return localStorage.getItem("token"); // Adjust key name if different (e.g., "authToken", "userToken")
//   };

//   // Function to remove token from localStorage and dispatch logout action
//   const handleLogout = () => {
//     const token = getToken();
//     if (token) {
//       dispatch(logout());
//     }
//   };

//   // Function to cleanup and redirect to login
//   const cleanupAndRedirect = () => {
//     handleLogout(); // Remove token if exists
//     navigate("/login", { replace: true });
//   };

//   useEffect(() => {
//     let intervalId;
//     let timeoutId;

//     if (isVisible) {
//       // Countdown timer
//       intervalId = setInterval(() => {
//         setCountdown((prev) => {
//           if (prev <= 1) {
//             clearInterval(intervalId);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);

//       // Navigate to login after delay
//       timeoutId = setTimeout(() => {
//         cleanupAndRedirect();
//       }, reloadDelay);
//     }

//     // Cleanup timers
//     return () => {
//       if (intervalId) clearInterval(intervalId);
//       if (timeoutId) clearTimeout(timeoutId);
//     };
//   }, [isVisible, reloadDelay]);

//   const handleDismiss = () => {
//     setIsVisible(false);
//     cleanupAndRedirect();
//     if (onDismiss) onDismiss();
//   };

//   const handleRetry = () => {
//     if (onRetry) {
//       onRetry();
//     } else {
//       cleanupAndRedirect();
//     }
//   };

//   const handleHome = () => {
//     // Optional: clear token when going home
//     // handleLogout();
//     navigate("/");
//   };

//   if (!isVisible) return null;

//   const alertConfig = {
//     error: {
//       bgColor: "bg-red-50",
//       borderColor: "border-red-200",
//       textColor: "text-red-800",
//       iconColor: "text-red-500",
//       title: "Error",
//       icon: <FiAlertCircle />,
//     },
//     warning: {
//       bgColor: "bg-yellow-50",
//       borderColor: "border-yellow-200",
//       textColor: "text-yellow-800",
//       iconColor: "text-yellow-500",
//       title: "Warning",
//       icon: <FiAlertCircle />,
//     },
//     info: {
//       bgColor: "bg-blue-50",
//       borderColor: "border-blue-200",
//       textColor: "text-blue-800",
//       iconColor: "text-blue-500",
//       title: "Info",
//       icon: <FiAlertCircle />,
//     },
//   };

//   const config = alertConfig[type] || alertConfig.error;
//   const displayTitle = title || config.title;

//   return (
//     <div
//       className={
//         fullScreen
//           ? "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//           : "w-full"
//       }
//     >
//       <div
//         className={`border-l-4 rounded-lg shadow-lg p-5 w-full max-w-md mx-auto
//         ${config.bgColor} ${config.borderColor}`}
//       >
//         <div className="flex items-start gap-3">
//           {/* Icon */}
//           {showIcon && (
//             <div className={`text-xl ${config.iconColor}`}>{config.icon}</div>
//           )}

//           <div className="flex-1">
//             {/* Title */}
//             <h3 className={`text-lg font-semibold ${config.textColor}`}>
//               {displayTitle}
//             </h3>

//             {/* Message - Always shows "Something went wrong" */}
//             <p className={`mt-1 text-sm ${config.textColor}`}>
//               Something went wrong. Please try again some time.
//             </p>

//             {/* Auto navigation countdown */}
//             {countdown > 0 && (
//               <p className={`mt-2 text-xs ${config.textColor} opacity-75`}>
//                 Redirecting to login page in {countdown} second
//                 {countdown !== 1 ? "s" : ""}...
//               </p>
//             )}

//             {/* Buttons */}
//             <div className="mt-4 flex flex-wrap gap-2">
//               {/* Dismiss button */}
//               {showDismiss && (
//                 <button
//                   onClick={handleDismiss}
//                   className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
//                 >
//                   <FiX className="text-sm" />
//                   Dismiss
//                 </button>
//               )}

//               {/* Retry button - now navigates to login */}
//               {showRetry && (
//                 <button
//                   onClick={handleRetry}
//                   className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
//                 >
//                   <FiRefreshCw className="text-sm" />
//                   Try Again
//                 </button>
//               )}

//               {/* Home button - navigates to home */}
//               {showHome && (
//                 <button
//                   onClick={handleHome}
//                   className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md text-white bg-accent hover:opacity-90 transition-opacity"
//                 >
//                   <FiHome className="text-sm" />
//                   Home
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Error;

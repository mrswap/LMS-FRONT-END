import React from "react";
import { useNavigate } from "react-router-dom";

const WorkInProgress = () => {
  const navigate = useNavigate();

  return (
    <div className=" flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-2xl w-full">
        {/* Construction Image */}
        <div className="flex justify-center mb-8">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1946/1946488.png"
            alt="Under Construction"
            className="w-48 h-48 object-contain"
          />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-3">
          Under Construction
        </h2>

        {/* Divider */}
        <div className="w-20 h-1 bg-amber-400 mx-auto my-4"></div>

        {/* Message */}
        <p className="text-gray-600 text-center text-lg leading-relaxed mb-8">
          This module is currently being built. We're working hard to bring you
          something amazing!
        </p>

        {/* Home Button */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
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
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Return to Home
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-sm text-gray-400 text-center mt-8">
          🚧 We'll notify you when it's ready 🚧
        </p>
      </div>
    </div>
  );
};

export default WorkInProgress;

import React from "react";
import { useNavigate } from "react-router-dom";

const BulkUpload2 = () => {
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate("/bulk-upload2/create");
  };

  const handleDetails = () => {
    navigate("/bulk-upload2/details");
  };

  return (
    <div className="p-8">
      <div className="flex gap-4">
        <button
          onClick={handleCreate}
          className="px-6 py-3 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          Payload maker
        </button>

        <button
          onClick={handleDetails}
          className="px-6 py-3 rounded-md text-white bg-gray-600 hover:bg-gray-700 transition-colors"
        >
          Details
        </button>
      </div>
    </div>
  );
};

export default BulkUpload2;

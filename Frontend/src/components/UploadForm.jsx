import { useState } from "react";
import axios from "axios";
import { years, subjectsByYear } from "../util/data";

function UploadForm({ onUploadSuccess, onClose }) {
  const [files, setFiles] = useState([]);
  const [type, setType] = useState("");
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const types = [
    { value: "Class Notes", label: "Class Notes" },
    { value: "Term Test Papers", label: "Term Test Papers" },
    { value: "Final Papers", label: "Final Papers" },
  ];

  // Get subjects based on selected year
  const getSubjectsForYear = (selectedYear) => {
    return subjectsByYear[selectedYear] || [];
  };

  const handleYearChange = (selectedYear) => {
    setYear(selectedYear);
    setSubject(""); // Reset subject when year changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!files.length || !type || !subject || !year) {
      setMessage("Please fill all fields and select at least one file");
      return;
    }

    if (files.length > 10) {
      setMessage("Maximum 10 files allowed per upload");
      return;
    }

    setUploading(true);
    setMessage("");
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    try {
      const formData = new FormData();

      // Append all files
      files.forEach((file) => {
        formData.append("files", file);
      });

      formData.append("type", type);
      formData.append("subject", subject);
      formData.append("year", year);

      const response = await axios.post(`${apiUrl}/api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000, // 1 minute timeout for file uploads
      });

      setMessage(
        `${response.data.totalUploaded} file(s) uploaded successfully!`
      );

      // Reset form
      setFiles([]);
      setType("");
      setSubject("");
      setYear("");

      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage(
        "Upload failed: " + (error.response?.data?.error || error.message)
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Upload Resource
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Add a new study material to the collection
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-400 hover:text-gray-600 cursor-pointer"
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
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Files (Max 10)
            </label>
            <div className="relative">
              <input
                type="file"
                multiple
                onChange={(e) => {
                  const selectedFiles = Array.from(e.target.files);

                  if (selectedFiles.length > 10) {
                    setMessage("Maximum 10 files allowed");
                    e.target.value = "";
                    return;
                  }

                  // Validate all files are PDFs
                  const invalidFiles = selectedFiles.filter(
                    (file) => file.type !== "application/pdf"
                  );
                  if (invalidFiles.length > 0) {
                    setMessage("Only PDF files are allowed");
                    setFiles([]);
                    e.target.value = "";
                    return;
                  }

                  setFiles(selectedFiles);
                  setMessage("");
                }}
                accept=".pdf"
                required
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-900 file:text-white file:font-medium hover:file:bg-gray-800 file:cursor-pointer"
              />
            </div>
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-green-800">
                      {files.length} file(s) selected
                    </h4>
                    <span className="text-xs text-green-600">
                      Total:{" "}
                      {(
                        files.reduce((acc, file) => acc + file.size, 0) /
                        (1024 * 1024)
                      ).toFixed(2)}{" "}
                      MB
                    </span>
                  </div>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="text-green-800 truncate flex-1 mr-2">
                          {file.name}
                        </span>
                        <span className="text-green-600 flex-shrink-0">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Select up to 10 PDF files. Only PDF files are allowed.
            </p>
          </div>

          {/* Type/Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Type/Category
            </label>
            <div className="grid grid-cols-1 gap-3">
              {types.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-300 text-left cursor-pointer
                    ${
                      type === t.value
                        ? "bg-blue-50 border-blue-500 text-blue-700 shadow-sm"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-100"
                    }
                  `}
                >
                  <span className="font-medium">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Year Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Year <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {years.map((y) => (
                <button
                  key={y.value}
                  type="button"
                  onClick={() => handleYearChange(y.value)}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-300 text-center cursor-pointer
                    ${
                      year === y.value
                        ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-100"
                    }
                  `}
                >
                  <span className="font-medium">{y.label}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Select year first to see available subjects
            </p>
          </div>
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Subject
            </label>
            {!year ? (
              <div className="p-4 bg-gray-100 border-2 border-gray-200 rounded-xl text-center">
                <p className="text-gray-500 text-sm">
                  Please select a year first to see available subjects
                </p>
              </div>
            ) : getSubjectsForYear(year).length === 0 ? (
              <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl text-center">
                <p className="text-yellow-600 text-sm">
                  No subjects available for this year yet
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {getSubjectsForYear(year).map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setSubject(s.value)}
                    className={`
                      p-3 rounded-xl border-2 transition-all duration-300 text-center cursor-pointer
                      ${
                        subject === s.value
                          ? `${s.color} text-white border-transparent shadow-sm`
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-100"
                      }
                    `}
                  >
                    <span className="font-medium text-sm">{s.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Message */}
          {message && (
            <div
              className={`
              p-4 rounded-xl flex items-center space-x-3
              ${
                message.includes("success")
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }
            `}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  message.includes("success") ? "bg-green-500" : "bg-red-500"
                }`}
              >
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d={
                      message.includes("success")
                        ? "M5 13l4 4L19 7"
                        : "M6 18L18 6M6 6l12 12"
                    }
                  />
                </svg>
              </div>
              <span className="font-medium text-sm">{message}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2 cursor-pointer"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Uploading...</span>
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
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span>Upload</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadForm;

import { useState } from "react";
import axios from "axios";

function UploadForm({ onUploadSuccess, onClose }) {
  const [file, setFile] = useState(null);
  const [type, setType] = useState("");
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const years = [
    { value: "1", label: "1st Year" },
    { value: "2", label: "2nd Year" },
    { value: "3", label: "3rd Year" },
    { value: "4", label: "4th Year" },
  ];

  const types = [
    { value: "Class Notes", label: "Class Notes" },
    { value: "Term Test Papers", label: "Term Test Papers" },
    { value: "Final Papers", label: "Final Papers" },
  ];

  const subjects = [
    { value: "IOT-POA", label: "IOT-POA", color: "bg-blue-500" },
    { value: "AI", label: "AI", color: "bg-emerald-500" },
    { value: "DWM", label: "DWM", color: "bg-violet-500" },
    { value: "ATCD", label: "ATCD", color: "bg-rose-500" },
    { value: "ADMS", label: "ADMS", color: "bg-amber-500" },
    { value: "AA", label: "AA", color: "bg-cyan-500" },
    { value: "CG", label: "CG", color: "bg-orange-500" },
    { value: "HONOURS", label: "HONOURS", color: "bg-teal-500" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !type || !subject || !year) {
      setMessage("Please fill all fields and select a file");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);
      formData.append("subject", subject);
      formData.append("year", year);

      const response = await axios.post(
        "https://djsce-resources.onrender.com/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setMessage("File uploaded successfully!");
        setFile(null);
        setType("");
        setSubject("");
        setYear("");
        onUploadSuccess && onUploadSuccess(response.data.file);
        setTimeout(() => {
          onClose && onClose();
        }, 2000);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage(
        error.response?.data?.error || "Upload failed: " + error.message
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
              File
            </label>
            <div className="relative">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                required
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-900 file:text-white file:font-medium hover:file:bg-gray-800 file:cursor-pointer"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: PDF, DOC, PPT, TXT, Images
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
                    ${type === t.value
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

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Subject
            </label>
            <div className="grid grid-cols-2 gap-3">
              {subjects.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSubject(s.value)}
                  className={`
                    p-3 rounded-xl border-2 transition-all duration-300 text-center cursor-pointer
                    ${subject === s.value
                      ? `${s.color} text-white border-transparent shadow-sm`
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-100"
                    }
                  `}
                >
                  <span className="font-medium text-sm">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Year Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Year
            </label>
            <div className="grid grid-cols-2 gap-3">
              {years.map((y) => (
                <button
                  key={y.value}
                  type="button"
                  onClick={() => setYear(y.value)}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-300 text-center cursor-pointer
                    ${year === y.value
                      ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-100"
                    }
                  `}
                >
                  <span className="font-medium">{y.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`
              p-4 rounded-xl flex items-center space-x-3
              ${message.includes("success")
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
                }
            `}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${message.includes("success") ? "bg-green-500" : "bg-red-500"
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

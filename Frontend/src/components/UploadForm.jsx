import { useState } from "react";
import axios from "axios";
import { years, types, subjectsByYear } from "../util/data";

function UploadForm({ onClose, onUploadSuccess }) {
  const [files, setFiles] = useState([]);
  const [type, setType] = useState("");
  const [year, setYear] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const getApiUrl = () =>
    import.meta.env.VITE_API_URL || "https://djsce-resources.onrender.com";

  const getSubjectsForYear = (selectedYear) => {
    return subjectsByYear[selectedYear] || [];
  };

  const handleYearChange = (selectedYear) => {
    setYear(selectedYear);
    setSubject("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      setMessage("Please select at least one file");
      return;
    }

    if (!type || !year || !subject) {
      setMessage("Please fill in all fields");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("type", type);
      formData.append("year", year);
      formData.append("subject", subject);

      const response = await axios.post(`${getApiUrl()}/api/file/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (response.status === 201) {
        onUploadSuccess && onUploadSuccess(response.data);
        onClose();
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Upload failed: " + (error.response?.data?.error || error.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-line animate-[fadeIn_0.3s_ease-in-out]">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-line">
          <div>
            <h2 className="text-xl font-bold text-ink font-['Sora']">
              Upload Resource
            </h2>
            <p className="text-xs text-ink-dim mt-1">
              Add verified study material for your batchmates
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-bg text-ink-dim hover:text-ink transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-ink mb-2">
              Files (Max 10 PDFs) <span className="text-rose-500">*</span>
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
                className="w-full p-3.5 border-2 border-dashed border-line hover:border-violet rounded-2xl bg-bg focus:outline-none transition-colors duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-white file:text-violet file:font-semibold file:shadow-sm hover:file:bg-line file:cursor-pointer text-xs text-ink-dim"
              />
            </div>

            {files.length > 0 && (
              <div className="mt-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-emerald-800">
                    {files.length} file(s) selected
                  </h4>
                  <span className="text-xs text-emerald-600 font-medium">
                    Total: {(files.reduce((acc, f) => acc + f.size, 0) / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
                <div className="max-h-28 overflow-y-auto space-y-1">
                  {files.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs text-emerald-700">
                      <span className="truncate flex-1 mr-2">{file.name}</span>
                      <span className="flex-none font-mono">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Type/Category */}
          <div>
            <label className="block text-sm font-semibold text-ink mb-2">
              Category / Resource Type <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {types.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className={`py-3 px-3 rounded-xl border text-center text-sm font-semibold transition-all cursor-pointer ${
                    type === t.value
                      ? "border-violet bg-[#EFEAFF] text-violet shadow-sm font-bold"
                      : "bg-white text-ink border-line hover:border-gray-300"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Year Selection */}
          <div>
            <label className="block text-sm font-semibold text-ink mb-2">
              Academic Year <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {years.map((y) => (
                <button
                  key={y.value}
                  type="button"
                  onClick={() => handleYearChange(y.value)}
                  className={`py-3 px-2 rounded-xl border text-center text-sm font-semibold transition-all cursor-pointer ${
                    year === y.value
                      ? "bg-gradient-to-r from-violet via-blue to-cyan text-white border-transparent shadow-sm font-bold"
                      : "bg-white text-ink border-line hover:border-gray-300"
                  }`}
                >
                  {y.code || y.value} ({y.label})
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-semibold text-ink mb-2">
              Subject <span className="text-rose-500">*</span>
            </label>
            {!year ? (
              <div className="p-4 bg-bg border border-line rounded-xl text-center">
                <p className="text-sm font-medium text-ink-dim">
                  Please select an academic year first
                </p>
              </div>
            ) : getSubjectsForYear(year).length === 0 ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter subject name (e.g. Applied Physics, Chemistry...)"
                  className="w-full p-3 bg-white border border-line rounded-xl text-sm text-ink focus:outline-none focus:border-violet"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {getSubjectsForYear(year).map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setSubject(s.value)}
                    className={`py-2.5 px-3 rounded-xl border text-center text-sm font-semibold transition-all cursor-pointer ${
                      subject === s.value
                        ? "bg-ink text-white border-ink shadow-sm"
                        : "bg-white text-ink border-line hover:border-gray-300"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Message Alert */}
          {message && (
            <div
              className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                message.includes("success")
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-rose-50 text-rose-800 border border-rose-200"
              }`}
            >
              <span>{message}</span>
            </div>
          )}

          {/* Submit / Cancel Actions */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="flex-1 py-3.5 px-5 rounded-xl border border-line text-sm font-semibold text-ink hover:bg-bg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 py-3.5 px-5 rounded-xl bg-gradient-to-r from-violet via-blue to-cyan text-white text-sm font-semibold hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <span>Submit Resource</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadForm;

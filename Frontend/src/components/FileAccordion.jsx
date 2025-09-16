import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  GrDocumentPdf,
  GrDocumentWord,
  GrDocument,
  GrDocumentExcel,
  GrDocumentText,
  GrDocumentImage,
  GrDocumentZip,
} from "react-icons/gr";

function FileAccordion({
  files,
  subjectColors,
  getFileIcon,
  getFileName,
  onFileUpdate,
}) {
  const [expandedSubjects, setExpandedSubjects] = useState(new Set());
  const [editingFile, setEditingFile] = useState(null);
  const [editForm, setEditForm] = useState({ name: "" });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const { isAdmin } = useAuth();

  // Group files by subject
  const groupFilesBySubject = (files) => {
    return files.reduce((groups, file) => {
      const subject = file.subject || "Other";
      if (!groups[subject]) {
        groups[subject] = [];
      }
      groups[subject].push(file);
      return groups;
    }, {});
  };

  // Toggle accordion section
  const toggleSubject = (subject) => {
    const newExpanded = new Set(expandedSubjects);
    if (newExpanded.has(subject)) {
      newExpanded.delete(subject);
    } else {
      newExpanded.add(subject);
    }
    setExpandedSubjects(newExpanded);
  };

  const getSubjectColor = (subject) => {
    return subjectColors[subject] || subjectColors.default;
  };

  // Admin functions for file management
  const handleEditClick = (file) => {
    setEditingFile(file._id);
    setEditForm({
      name: file.name,
    });
  };

  const handleEditCancel = () => {
    setEditingFile(null);
    setEditForm({ name: "" });
  };

  const handleEditSave = async (fileId) => {
    const apiUrl =
      import.meta.env.VITE_API_URL || "https://djsce-resources.onrender.com";
    try {
      const response = await axios.put(
        `${apiUrl}/api/file/${fileId}`,
        editForm
      );

      if (response.status === 200) {
        // Update the file in the parent component
        onFileUpdate && onFileUpdate(response.data.file);
        setEditingFile(null);
        setEditForm({ name: "" });
      }
    } catch (error) {
      console.error("Edit error:", error);
      alert(
        "Failed to update file: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  const handleDeleteClick = (file) => {
    setDeleteConfirm(file);
  };

  const handleDeleteConfirm = async (fileId) => {
    const apiUrl =
      import.meta.env.VITE_API_URL || "https://djsce-resources.onrender.com";
    try {
      const response = await axios.delete(`${apiUrl}/api/file/${fileId}`);

      if (response.status === 200) {
        // Update the file list in the parent component
        onFileUpdate && onFileUpdate(null, fileId, "delete");
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert(
        "Failed to delete file: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  if (!files || files.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-300 mb-2">
          No resources yet
        </h3>
        <p className="text-gray-500 text-sm">
          Resources for this year will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(groupFilesBySubject(files)).map(
        ([subject, subjectFiles]) => {
          const colors = getSubjectColor(subject);
          const isExpanded = expandedSubjects.has(subject);

          return (
            <div
              key={subject}
              className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden backdrop-blur-sm"
            >
              {/* Subject Header */}
              <button
                onClick={() => toggleSubject(subject)}
                className={`w-full p-5 flex items-center justify-between hover:bg-gray-800/50 transition-all duration-300 group ${colors.border} border-l-4 cursor-pointer`}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.bg} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white text-left">
                      {subject}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {subjectFiles.length} resource
                      {subjectFiles.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div
                  className={`transform transition-transform duration-300 ${isExpanded ? "rotate-180" : ""
                    }`}
                >
                  <svg
                    className="w-5 h-5 text-gray-400"
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
                </div>
              </button>

              {/* Subject Files */}
              {isExpanded && (
                <div className="p-6 border-t border-gray-800 bg-gray-950/30">
                  <div className="">
                    {subjectFiles.map((file, index) => (
                      <div
                        key={index}
                        className={`bg-gray-900/50 border ${colors.border} rounded-lg p-5 hover:border-gray-600 hover:bg-gray-800/50 transition-all duration-300 group backdrop-blur-sm `}
                      >
                        <div className="text-center flex justify-between items-center">
                          <div className="ml-4 flex items-center gap-5 flex-1">
                            {(() => {
                              const iconName = getFileIcon(file.fileUrl);
                              const IconComponent =
                                {
                                  GrDocumentPdf,
                                  GrDocumentWord,
                                  GrDocument,
                                  GrDocumentExcel,
                                  GrDocumentText,
                                  GrDocumentImage,
                                  GrDocumentZip,
                                }[iconName] || GrDocument;

                              return <IconComponent color="white" size={35} />;
                            })()}

                            <div className="text-left">
                              {editingFile === file._id ? (
                                <div className="space-y-2">
                                  <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) =>
                                      setEditForm({
                                        ...editForm,
                                        name: e.target.value,
                                      })
                                    }
                                    className="w-full p-2 text-sm bg-gray-800 text-white border border-gray-600 rounded focus:border-blue-500"
                                    placeholder="File name"
                                  />
                                  <p className="text-xs text-gray-400">
                                    Subject: {file.subject} | Type: {file.type}
                                  </p>
                                </div>
                              ) : (
                                <>
                                  <h5 className="text-sm font-medium text-white leading-tight">
                                    {getFileName(file)}
                                  </h5>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {file.type}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {editingFile === file._id ? (
                              <>
                                <button
                                  onClick={() => handleEditSave(file._id)}
                                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={handleEditCancel}
                                  className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <a
                                  href={file.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`inline-flex items-center space-x-2 ${colors.bg} ${colors.text} px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all duration-300 text-sm`}
                                  onClick={(e) => {
                                    if (file.fileUrl.includes(".pdf")) {
                                      e.preventDefault();
                                      window.open(
                                        file.fileUrl +
                                          "#toolbar=1&navpanes=1&scrollbar=1",
                                        "_blank"
                                      );
                                    }
                                  }}
                                >
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
                                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                  </svg>
                                  <span>View</span>
                                </a>

                                {/* Admin Controls */}
                                {isAdmin() && (
                                  <>
                                    <button
                                      onClick={() => handleEditClick(file)}
                                      className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                      title="Edit file"
                                    >
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
                                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                        />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => handleDeleteClick(file)}
                                      className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                      title="Delete file"
                                    >
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
                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                      </svg>
                                    </button>
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        }
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete File
                  </h3>
                  <p className="text-sm text-gray-500">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                Are you sure you want to delete{" "}
                <strong>"{deleteConfirm.name}"</strong>?
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteCancel}
                  className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteConfirm(deleteConfirm._id)}
                  className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileAccordion;

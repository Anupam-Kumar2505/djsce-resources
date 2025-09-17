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

function FilesView({
  files,
  pendingFiles,
  subjectColors,
  getFileIcon,
  getFileName,
  onFileUpdate,
  onPendingFileUpdate,
}) {
  const [expandedSubjects, setExpandedSubjects] = useState(new Set());
  const [expandedPendingSubjects, setExpandedPendingSubjects] = useState(
    new Set()
  );
  const [editingFile, setEditingFile] = useState(null);
  const [editForm, setEditForm] = useState({ name: "" });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const { isAdmin } = useAuth();

  // Group files by subject and sort by name within each subject
  const groupFilesBySubject = (files) => {
    const groups = files.reduce((groups, file) => {
      const subject = file.subject || "Other";
      if (!groups[subject]) {
        groups[subject] = [];
      }
      groups[subject].push(file);
      return groups;
    }, {});

    // Sort files within each subject by name (case-insensitive)
    Object.keys(groups).forEach((subject) => {
      groups[subject].sort((a, b) => {
        const nameA = getFileName(a).toLowerCase();
        const nameB = getFileName(b).toLowerCase();
        return nameA.localeCompare(nameB);
      });
    });

    return groups;
  };

  // Toggle accordion section
  const toggleSubject = (subject, isPending = false) => {
    const targetSet = isPending ? expandedPendingSubjects : expandedSubjects;
    const setterFunction = isPending
      ? setExpandedPendingSubjects
      : setExpandedSubjects;

    const newExpanded = new Set(targetSet);
    if (newExpanded.has(subject)) {
      newExpanded.delete(subject);
    } else {
      newExpanded.add(subject);
    }
    setterFunction(newExpanded);
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
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    try {
      const response = await axios.put(
        `${apiUrl}/api/file/${fileId}`,
        editForm
      );

      if (response.status === 200) {
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
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    try {
      const response = await axios.delete(`${apiUrl}/api/file/${fileId}`);

      if (response.status === 200) {
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

  // Pending file approval/rejection handlers
  const handleApprove = async (fileId) => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    try {
      const response = await axios.patch(
        `${apiUrl}/api/file/${fileId}/approve`
      );

      if (response.status === 200) {
        onPendingFileUpdate &&
          onPendingFileUpdate(response.data.file, fileId, "approve");
      }
    } catch (error) {
      console.error("Approval error:", error);
      alert(
        "Failed to approve file: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  const handleReject = async (fileId) => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    try {
      const response = await axios.delete(`${apiUrl}/api/file/${fileId}`);

      if (response.status === 200) {
        onPendingFileUpdate && onPendingFileUpdate(null, fileId, "reject");
      }
    } catch (error) {
      console.error("Rejection error:", error);
      alert(
        "Failed to reject file: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  const renderFileItem = (file, isPending = false) => {
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

    const colors = getSubjectColor(file.subject);

    return (
      <div
        key={file._id}
        className={`bg-gray-900/50 border ${colors.border} rounded-lg p-5 hover:border-gray-600 hover:bg-gray-800/50 transition-all duration-300 group backdrop-blur-sm`}
      >
        <div className="text-center flex justify-between items-center">
          <div className="ml-4 flex items-center gap-5 flex-1">
            <IconComponent color="white" size={35} />
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
                  <p className="text-xs text-gray-400 mt-1">{file.type}</p>
                  {isPending && (
                    <p className="text-xs text-orange-400 mt-1">
                      Pending Approval
                    </p>
                  )}
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
                        file.fileUrl + "#toolbar=1&navpanes=1&scrollbar=1",
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
                    {isPending ? (
                      // Approval controls for pending files
                      <>
                        <button
                          onClick={() => handleApprove(file._id)}
                          className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center space-x-1"
                          title="Approve file"
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-xs">Approve</span>
                        </button>
                        <button
                          onClick={() => handleReject(file._id)}
                          className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center space-x-1"
                          title="Reject file"
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
                          <span className="text-xs">Reject</span>
                        </button>
                      </>
                    ) : (
                      // Edit/Delete controls for approved files
                      <>
                        <button
                          onClick={() => handleEditClick(file)}
                          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          title="Edit file cursor-pointer"
                        >
                          <svg
                            className="w-4 h-4 cursor-pointer"
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
                          title="Delete file cursor-pointer"
                        >
                          <svg
                            className="w-4 h-4 cursor-pointer"
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
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderFileSection = (fileGroups, isPending = false, title = "") => {
    const expandedSet = isPending ? expandedPendingSubjects : expandedSubjects;

    if (Object.keys(fileGroups).length === 0) {
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
            {isPending ? "No pending files" : "No resources yet"}
          </h3>
          <p className="text-gray-500 text-sm">
            {isPending
              ? "All files have been approved"
              : "Resources for this year will appear here"}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {title && (
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            {title}
            {isPending && (
              <span className="ml-2 px-2 py-1 bg-orange-600 text-white text-xs rounded-full">
                {Object.values(fileGroups).reduce(
                  (total, files) => total + files.length,
                  0
                )}
              </span>
            )}
          </h3>
        )}
        {Object.entries(fileGroups).map(([subject, subjectFiles]) => {
          const colors = getSubjectColor(subject);
          const isExpanded = expandedSet.has(subject);

          return (
            <div
              key={subject}
              className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden backdrop-blur-sm"
            >
              {/* Subject Header */}
              <button
                onClick={() => toggleSubject(subject, isPending)}
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
                      {isPending && (
                        <span className="ml-2 text-orange-400 text-sm">
                          (Pending)
                        </span>
                      )}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {subjectFiles.length} resource
                      {subjectFiles.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div
                  className={`transform transition-transform duration-300 ${
                    isExpanded ? "rotate-180" : ""
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
                  <div className="space-y-4">
                    {subjectFiles.map((file) =>
                      renderFileItem(file, isPending)
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const approvedFileGroups = groupFilesBySubject(files);
  const pendingFileGroups = groupFilesBySubject(pendingFiles);

  return (
    <div className="flex gap-8">
      {/* Approved Files Column */}
      <div className="flex-1">
        {renderFileSection(approvedFileGroups, false)}
      </div>

      {/* Pending Files Column (only visible to admins) */}
      {isAdmin() && (
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <svg
              className="w-6 h-6 mr-2 text-orange-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            Pending Approval
            <span className="ml-2 px-2 py-1 bg-orange-600 text-white text-xs rounded-full">
              {pendingFiles.length}
            </span>
          </h2>
          {renderFileSection(pendingFileGroups, true)}
        </div>
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
                  className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteConfirm(deleteConfirm._id)}
                  className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors cursor-pointer"
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

export default FilesView;

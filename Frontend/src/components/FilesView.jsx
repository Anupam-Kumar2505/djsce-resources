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
  selectedDepartment,
}) {
  const [expandedSubjects, setExpandedSubjects] = useState(new Set());
  const [expandedPendingSubjects, setExpandedPendingSubjects] = useState(new Set());
  const [editingFile, setEditingFile] = useState(null);
  const [editForm, setEditForm] = useState({ name: "" });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [sortBy, setSortBy] = useState("date"); // "name" or "date"
  const [searchQuery, setSearchQuery] = useState("");
  const { isAdmin } = useAuth();

  const getApiUrl = () =>
    import.meta.env.VITE_API_URL || "https://djsce-resources.onrender.com";

  // Filter files by department (if selected) and search query
  const filterFileList = (list) => {
    return list.filter((file) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        (file.name && file.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (file.subject && file.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (file.type && file.type.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDept =
        !selectedDepartment ||
        (file.department &&
          file.department.toLowerCase() === selectedDepartment.code.toLowerCase()) ||
        (file.name &&
          file.name.toLowerCase().includes(selectedDepartment.code.toLowerCase())) ||
        (file.subject &&
          file.subject.toLowerCase().includes(selectedDepartment.code.toLowerCase()));

      return matchesSearch && matchesDept;
    });
  };

  // Group files by subject and sort within each subject
  const groupFilesBySubject = (filesToGroup) => {
    const filtered = filterFileList(filesToGroup);
    const groups = filtered.reduce((acc, file) => {
      const subject = file.subject || "General / Other";
      if (!acc[subject]) {
        acc[subject] = [];
      }
      acc[subject].push(file);
      return acc;
    }, {});

    Object.keys(groups).forEach((subject) => {
      groups[subject].sort((a, b) => {
        if (sortBy === "name") {
          const nameA = getFileName(a).toLowerCase();
          const nameB = getFileName(b).toLowerCase();
          return nameA.localeCompare(nameB);
        } else {
          const dateA = new Date(a.updatedAt || a.createdAt || 0);
          const dateB = new Date(b.updatedAt || b.createdAt || 0);
          return dateB - dateA;
        }
      });
    });

    return groups;
  };

  const toggleSubject = (subject, isPending = false) => {
    const targetSet = isPending ? expandedPendingSubjects : expandedSubjects;
    const setterFunction = isPending ? setExpandedPendingSubjects : setExpandedSubjects;

    const newExpanded = new Set(targetSet);
    if (newExpanded.has(subject)) {
      newExpanded.delete(subject);
    } else {
      newExpanded.add(subject);
    }
    setterFunction(newExpanded);
  };

  const getSubjectColor = (subject) => {
    return subjectColors[subject] || subjectColors.default || {
      bg: "bg-indigo-500",
      border: "border-indigo-200",
      text: "text-indigo-700",
    };
  };

  // Admin handlers
  const handleEditClick = (file) => {
    setEditingFile(file._id);
    setEditForm({ name: file.name });
  };

  const handleEditCancel = () => {
    setEditingFile(null);
    setEditForm({ name: "" });
  };

  const handleEditSave = async (fileId) => {
    try {
      const response = await axios.put(`${getApiUrl()}/api/file/${fileId}`, editForm);
      if (response.status === 200) {
        onFileUpdate && onFileUpdate(response.data.file);
        setEditingFile(null);
        setEditForm({ name: "" });
      }
    } catch (error) {
      console.error("Edit error:", error);
      alert("Failed to update file: " + (error.response?.data?.error || error.message));
    }
  };

  const handleDeleteClick = (file) => {
    setDeleteConfirm(file);
  };

  const handleDeleteConfirm = async (fileId) => {
    try {
      const response = await axios.delete(`${getApiUrl()}/api/file/${fileId}`);
      if (response.status === 200) {
        onFileUpdate && onFileUpdate(null, fileId, "delete");
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete file: " + (error.response?.data?.error || error.message));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  const handleApprove = async (fileId) => {
    const apiUrl = import.meta.env.VITE_API_URL || "https://djsce-resources.onrender.com";
    try {
      const response = await axios.patch(`${getApiUrl()}/api/file/${fileId}/approve`);
      if (response.status === 200) {
        onPendingFileUpdate && onPendingFileUpdate(response.data.file, fileId, "approve");
      }
    } catch (error) {
      console.error("Approval error:", error);
      alert("Failed to approve file: " + (error.response?.data?.error || error.message));
    }
  };

  const handleReject = async (fileId) => {
    const apiUrl = import.meta.env.VITE_API_URL || "https://djsce-resources.onrender.com";
    try {
      const response = await axios.delete(`${getApiUrl()}/api/file/${fileId}`);
      if (response.status === 200) {
        onPendingFileUpdate && onPendingFileUpdate(null, fileId, "reject");
      }
    } catch (error) {
      console.error("Rejection error:", error);
      alert("Failed to reject file: " + (error.response?.data?.error || error.message));
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

    const isPdf = file.fileUrl && file.fileUrl.toLowerCase().includes(".pdf");

    return (
      <div
        key={file._id}
        className="bg-white border border-line rounded-xl p-4 sm:p-5 hover:border-blue hover:shadow-md transition-all duration-200"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-none shadow-sm ${
              isPdf ? "bg-rose-50 text-rose-500" : "bg-blue-50 text-blue-500"
            }`}>
              <IconComponent size={24} />
            </div>

            <div className="flex-1 min-w-0">
              {editingFile === file._id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full p-2 text-sm bg-white text-ink border border-line rounded-lg focus:outline-none focus:border-violet"
                    placeholder="File name"
                  />
                  <p className="text-xs text-ink-dim">
                    Subject: {file.subject} | Type: {file.type}
                  </p>
                </div>
              ) : (
                <>
                  <h4 className="text-[14.5px] font-semibold text-ink truncate" title={getFileName(file)}>
                    {getFileName(file)}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-medium text-ink-dim">
                      {file.type}
                    </span>
                    {isPending && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        Pending Approval
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
            {editingFile === file._id ? (
              <>
                <button
                  onClick={() => handleEditSave(file._id)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
                >
                  Save
                </button>
                <button
                  onClick={handleEditCancel}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors cursor-pointer"
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
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-bg text-ink border border-line hover:border-violet hover:text-violet hover:bg-[#EFEAFF]/40 shadow-xs transition-all cursor-pointer"
                  onClick={(e) => {
                    if (isPdf) {
                      e.preventDefault();
                      window.open(
                        file.fileUrl + "#toolbar=1&navpanes=1&scrollbar=1",
                        "_blank"
                      );
                    }
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>View</span>
                </a>

                {/* Admin Controls */}
                {isAdmin() && (
                  <>
                    {isPending ? (
                      <>
                        <button
                          onClick={() => handleApprove(file._id)}
                          className="px-4.5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                          title="Approve file"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleReject(file._id)}
                          className="px-4.5 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                          title="Reject file"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span>Reject</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditClick(file)}
                          className="p-2.5 text-gray-500 hover:text-violet rounded-xl border border-line hover:border-violet hover:bg-white transition-all cursor-pointer"
                          title="Edit file name"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(file)}
                          className="p-2.5 text-gray-500 hover:text-rose-600 rounded-xl border border-line hover:border-rose-300 hover:bg-rose-50 transition-all cursor-pointer"
                          title="Delete file"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
    const subjects = Object.keys(fileGroups);

    if (subjects.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-white border border-line rounded-2xl shadow-sm">
          <div className="w-16 h-16 bg-[#EFEAFF] text-violet rounded-2xl flex items-center justify-center mb-4 shadow-sm">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-ink font-['Sora']">
            {isPending ? "No pending files" : "No resources found"}
          </h3>
          <p className="text-sm text-ink-dim mt-1.5 max-w-sm">
            {isPending
              ? "All submissions have been approved"
              : searchQuery
              ? "No files match your search criteria"
              : "Resources for this selection will appear here once uploaded."}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {title && (
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-base font-bold text-ink">{title}</h3>
            {isPending && (
              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                {Object.values(fileGroups).reduce((total, f) => total + f.length, 0)}
              </span>
            )}
          </div>
        )}

        {Object.entries(fileGroups).map(([subject, subjectFiles]) => {
          const isExpanded = expandedSet.has(subject);

          return (
            <div
              key={subject}
              className="bg-white border border-line rounded-2xl overflow-hidden shadow-sm transition-all"
            >
              {/* Subject Accordion Header */}
              <button
                onClick={() => toggleSubject(subject, isPending)}
                className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-bg/50 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-xl ${getSubjectColor(subject)?.bg || "bg-gradient-to-r from-violet via-blue to-cyan"} text-white flex items-center justify-center font-bold text-sm shadow-sm`}>
                    {subject.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-ink">
                      {subject}
                      {isPending && (
                        <span className="ml-2 text-xs font-semibold text-amber-600">
                          (Pending)
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-ink-dim font-medium">
                      {subjectFiles.length} file{subjectFiles.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className={`transform transition-transform duration-200 text-ink-dim ${isExpanded ? "rotate-180" : ""}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Subject Files Content */}
              {isExpanded && (
                <div className="p-4 sm:p-5 border-t border-line bg-bg/30 space-y-3">
                  {subjectFiles.map((file) => renderFileItem(file, isPending))}
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
    <div className="space-y-6" id="resources-archive">
      {/* Controls Bar: Search & Sort */}
      <div className="bg-white border border-line rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subjects, topics, or notes..."
            className="w-full pl-11 pr-4 py-3 bg-bg border border-line rounded-xl text-sm text-ink placeholder:text-ink-dim focus:outline-none focus:border-violet focus:bg-white transition-all"
          />
          <svg className="w-5 h-5 text-ink-dim absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <span className="text-sm font-semibold text-ink-dim">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-bg border border-line text-ink text-sm font-semibold rounded-xl px-4 py-2.5 focus:outline-none focus:border-violet cursor-pointer"
          >
            <option value="date">Most Recent</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Main Files Display */}
      <div className={`grid grid-cols-1 ${isAdmin() && pendingFiles.length > 0 ? "lg:grid-cols-2" : ""} gap-6`}>
        {/* Approved Files */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-['Sora'] text-lg font-bold text-ink flex items-center gap-2">
              <span>Approved Resources</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EFEAFF] text-violet">
                {files.length}
              </span>
            </h3>
          </div>
          {renderFileSection(approvedFileGroups, false)}
        </div>

        {/* Pending Files (Admin Only) */}
        {isAdmin() && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-['Sora'] text-lg font-bold text-amber-700 flex items-center gap-2">
                <span>Pending Approval</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  {pendingFiles.length}
                </span>
              </h3>
            </div>
            {renderFileSection(pendingFileGroups, true)}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-line p-6 sm:p-7 animate-[fadeIn_0.3s_ease-in-out]">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-ink font-['Sora']">
              Delete Resource?
            </h3>
            <p className="text-sm text-ink-dim mt-1.5 leading-relaxed">
              Are you sure you want to permanently delete <strong>"{deleteConfirm.name}"</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleDeleteCancel}
                className="flex-1 py-3 px-5 rounded-xl border border-line text-sm font-semibold text-ink hover:bg-bg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteConfirm(deleteConfirm._id)}
                className="flex-1 py-3 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition-colors cursor-pointer shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FilesView;

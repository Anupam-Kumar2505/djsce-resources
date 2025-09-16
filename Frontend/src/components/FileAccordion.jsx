import { useState } from "react";
import {
  GrDocumentPdf,
  GrDocumentWord,
  GrDocument,
  GrDocumentExcel,
  GrDocumentText,
  GrDocumentImage,
  GrDocumentZip,
} from "react-icons/gr";

function FileAccordion({ files, subjectColors, getFileIcon, getFileName }) {
  const [expandedSubjects, setExpandedSubjects] = useState(new Set());

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
                  <div className="">
                    {subjectFiles.map((file, index) => (
                      <div
                        key={index}
                        className={`bg-gray-900/50 border ${colors.border} rounded-lg p-5 hover:border-gray-600 hover:bg-gray-800/50 transition-all duration-300 group backdrop-blur-sm `}
                      >
                        <div className="text-center flex justify-between items-center">
                          <div className="ml-4 flex items-center gap-5">
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
                              <h5 className="text-sm font-medium text-white leading-tight">
                                {getFileName(file)}
                              </h5>
                              <p className="text-xs text-gray-400 mt-1">
                                {file.type}
                              </p>
                            </div>
                          </div>
                          <div>
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
    </div>
  );
}

export default FileAccordion;

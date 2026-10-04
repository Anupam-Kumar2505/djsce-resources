import { useEffect } from "react";
import FilesView from "./FilesView";
import { years, departments, subjectColors } from "../util/data";

const yearGradients = {
  "1": "bg-gradient-to-br from-[#7C5CFC] to-[#4F8CFF]",
  "2": "bg-gradient-to-br from-[#4F8CFF] to-[#33D8D0]",
  "3": "bg-gradient-to-br from-[#2FC9BE] to-[#33D8D0]",
  "4": "bg-gradient-to-br from-[#FF7AC6] to-[#7C5CFC]",
};

function ResourcesExplorer({
  selectedYear,
  onYearChange,
  selectedDept,
  onDeptChange,
  files,
  pendingFiles,
  loading,
  onFileUpdate,
  onPendingFileUpdate,
  getFileName,
  getFileIcon,
  onBackToHome,
  onUploadClick,
}) {
  // If no year is selected when entering resources, default to Year 1 (FE)
  useEffect(() => {
    if (!selectedYear) {
      onYearChange("1");
    }
  }, [selectedYear, onYearChange]);

  const currentYearObj = years.find((y) => y.value === selectedYear) || years[0];

  return (
    <div className="py-8 sm:py-12">
      <div className="wrap space-y-8">
        {/* Top Navigation & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-ink bg-white border border-line hover:border-violet hover:text-violet shadow-xs transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Home</span>
            </button>
            <div className="hidden sm:flex items-center text-xs text-ink-dim font-medium gap-1.5">
              <span>Home</span>
              <span>/</span>
              <span className="text-ink font-semibold">Resources Archive</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onUploadClick}
              className="btn-grad text-sm !px-5.5 !py-2.5 !rounded-xl font-semibold shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Upload File</span>
            </button>
          </div>
        </div>

        {/* Header Title */}
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-violet bg-[#EFEAFF] px-3.5 py-1.5 rounded-full mb-2.5">
            <span>DJSCE Archive</span>
            <span>•</span>
            <span>All Departments</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-ink font-['Sora']">
            Academic Resources Explorer
          </h1>
          <p className="text-sm text-ink-dim mt-1.5 max-w-xl">
            Select your year and department to view semester class notes, question papers, and verified answer keys.
          </p>
        </div>

        {/* Year Selector Tabs */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-dim mb-3">
            1. Select Academic Year
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {years.map((year) => {
              const isSelected = selectedYear === year.value;
              return (
                <button
                  key={year.value}
                  onClick={() => onYearChange(year.value)}
                  className={`rounded-[22px] p-5 relative overflow-hidden text-white min-h-[120px] flex flex-col justify-between shadow-[0_18px_34px_-18px_rgba(22,27,51,0.35)] cursor-pointer text-left border-2 transition-all duration-250 hover:-translate-y-1 hover:shadow-[0_24px_44px_-18px_rgba(22,27,51,0.45)] after:content-[''] after:absolute after:w-[120px] after:h-[120px] after:rounded-full after:bg-white/15 after:-top-10 after:-right-10 ${
                    yearGradients[year.value] || "bg-gradient-to-br from-[#7C5CFC] to-[#4F8CFF]"
                  } ${
                    isSelected
                      ? "border-white ring-4 ring-offset-2 ring-violet shadow-[0_24px_44px_-18px_rgba(22,27,51,0.45)]"
                      : "border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between w-full relative z-10">
                    <h3 className="text-2xl font-bold font-['Sora'] text-white">{year.code}</h3>
                    {isSelected && (
                      <span className="bg-white text-ink font-bold text-xs px-2.5 py-1 rounded-full shadow-sm">
                        Active
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium opacity-95 mt-1 relative z-10">{year.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Department Filter Bar */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-dim">
              2. Filter by Department (Optional)
            </label>
            {selectedDept && (
              <button
                onClick={() => onDeptChange(null)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-violet bg-[#EFEAFF] hover:bg-[#E3DCFF] transition-colors cursor-pointer"
              >
                Clear filter ({selectedDept.code}) ✕
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2.5 pt-1 pb-1">
            <button
              onClick={() => onDeptChange(null)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                !selectedDept
                  ? "bg-ink text-white shadow-sm"
                  : "bg-white text-ink border border-line hover:border-gray-400 hover:bg-gray-50 shadow-xs"
              }`}
            >
              All Departments
            </button>
            {departments.map((dept) => {
              const isSelected = selectedDept?.code === dept.code;
              return (
                <button
                  key={dept.code}
                  onClick={() => onDeptChange(isSelected ? null : dept)}
                  title={dept.name}
                  className={`px-4.5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "btn-grad !text-white shadow-md !px-5 !py-2.5 !rounded-xl"
                      : "bg-white text-ink border border-line hover:border-violet hover:text-violet shadow-xs"
                  }`}
                >
                  <span className="font-bold">{dept.code}</span>
                  <span className={`text-xs ${isSelected ? "text-white/80" : "text-ink-dim"} hidden md:inline font-normal`}>
                    · {dept.name.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Archive Indicator */}
        <div className="bg-white border border-line rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div>
            <span className="text-xs font-semibold text-ink-dim">Currently viewing:</span>
            <div className="text-base sm:text-lg font-bold text-ink font-['Sora'] mt-0.5">
              {currentYearObj.label} ({currentYearObj.code}) — {selectedDept ? selectedDept.name : "All Branches"}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full bg-[#EFEAFF] text-violet">
              {files.length} Approved Resource{files.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        {/* Files View or Loading */}
        {loading ? (
          <div className="text-center py-20 bg-white border border-line rounded-2xl">
            <div className="w-10 h-10 border-3 border-violet border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm font-semibold text-ink-dim">
              Fetching resources from archive...
            </p>
          </div>
        ) : (
          <FilesView
            files={files}
            pendingFiles={pendingFiles}
            subjectColors={subjectColors}
            getFileIcon={getFileIcon}
            getFileName={getFileName}
            onFileUpdate={onFileUpdate}
            onPendingFileUpdate={onPendingFileUpdate}
            selectedDepartment={selectedDept}
          />
        )}
      </div>
    </div>
  );
}

export default ResourcesExplorer;

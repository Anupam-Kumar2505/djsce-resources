import { useState, useEffect } from "react";
import axios from "axios";
import UploadForm from "./components/UploadForm";
import Header from "./components/Header";
import YearSelector from "./components/YearSelector";
import FileAccordion from "./components/FileAccordion";
import { years, subjectColors } from "./util/data";

function App() {
  const [selectedYear, setSelectedYear] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  const fetchFiles = async (year) => {
    setLoading(true);
    console.log("Fetching files for year:", year);
    try {
      const response = await axios.get(
        `https://djsce-resources.onrender.com/year/${year}`
      );
      console.log("API Response:", response.data);
      setFiles(response.data.files || []);
    } catch (error) {
      console.error("Error fetching files:", error);
      console.error("Error response:", error.response?.data);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    if (year) {
      fetchFiles(year);
    } else {
      setFiles([]);
    }
  };

  const handleUploadSuccess = (newFile) => {
    // If the uploaded file is for the currently selected year, add it to the list
    if (selectedYear === newFile.year) {
      setFiles((prevFiles) => [newFile, ...prevFiles]);
    }
  };

  const getFileName = (file) => {
    // Use the name field from database if available, otherwise extract from URL
    return file.name || getFileNameFromUrl(file.fileUrl);
  };

  const getFileNameFromUrl = (fileUrl) => {
    if (!fileUrl) return "Unknown File";

    // Extract filename from URL
    const urlParts = fileUrl.split("/");
    const fileNameWithExtension = urlParts[urlParts.length - 1];

    // Remove query parameters if any
    const fileName = fileNameWithExtension.split("?")[0];

    // If filename starts with timestamp (format: timestamp-filename), extract original filename
    const timestampMatch = fileName.match(/^\d+-(.+)$/);
    if (timestampMatch) {
      return timestampMatch[1];
    }

    return fileName;
  };

  const getFileIcon = (fileUrl) => {
    if (!fileUrl) return "�";

    const extension = fileUrl.split(".").pop().toLowerCase();

    switch (extension) {
      case "pdf":
        return "GrDocumentPdf";
      case "doc":
      case "docx":
        return "GrDocumentWord";
      case "ppt":
      case "pptx":
        return "GrDocument";
      case "xls":
      case "xlsx":
        return "GrDocumentExcel";
      case "txt":
        return "GrDocumentText";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "webp":
        return "GrDocumentImage";
      case "zip":
      case "rar":
        return "GrDocumentZip";
      default:
        return "GrDocument";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Header */}
      <Header onUploadClick={() => setShowUploadForm(true)} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* Description */}

        {/* Year Selector */}
        <YearSelector
          years={years}
          selectedYear={selectedYear}
          onYearChange={handleYearChange}
        />

        {/* Files Section */}
        {selectedYear && (
          <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-white mb-2">
                Resources for{" "}
                {years.find((y) => y.value === selectedYear)?.label}
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto"></div>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Loading resources...</p>
              </div>
            ) : (
              <FileAccordion
                files={files}
                subjectColors={subjectColors}
                getFileIcon={getFileIcon}
                getFileName={getFileName}
              />
            )}
          </div>
        )}
      </div>

      {showUploadForm && (
        <UploadForm
          onUploadSuccess={handleUploadSuccess}
          onClose={() => setShowUploadForm(false)}
        />
      )}
    </div>
  );
}

export default App;

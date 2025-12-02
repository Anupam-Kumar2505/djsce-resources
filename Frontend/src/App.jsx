import { useState, useEffect } from "react";
import axios from "axios";
import UploadForm from "./components/UploadForm";
import AdminLogin from "./components/AdminLogin";
import Header from "./components/Header";
import YearSelector from "./components/YearSelector";
import FilesView from "./components/FilesView";
import Notification from "./components/Notification";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { years, subjectColors } from "./util/data";

function App() {
  const [selectedYear, setSelectedYear] = useState("");
  const [files, setFiles] = useState([]);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [notification, setNotification] = useState(null);
  const { login } = useAuth();

  const fetchFiles = async (year) => {
    setLoading(true);

    const url =
      import.meta.env.VITE_API_URL || "https://djsce-resources.onrender.com";

    console.log("Environment VITE_API_URL:", import.meta.env.VITE_API_URL);
    console.log(`Fetching files from: ${url}/year/${year}`);

    try {
      const response = await axios.get(`${url}/year/${year}`, {
        withCredentials: true,
      });

      console.log("Files response:", response.data);
      // Set both approved and pending files
      setFiles(response.data.files || []);
      setPendingFiles(response.data.pendingFiles || []);
    } catch (error) {
      console.error("Error fetching files:", error);
      console.error("Error response:", error.response?.data);
      setFiles([]);
      setPendingFiles([]);
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
      setPendingFiles([]);
    }
  };

  const handleUploadSuccess = (uploadData) => {
    // Since files are now pending approval by default,
    // don't add them to the main view immediately

    const fileCount = uploadData.totalUploaded || 1;
    const message =
      fileCount === 1
        ? "File uploaded successfully! It will appear after admin approval."
        : `${fileCount} files uploaded successfully! They will appear after admin approval.`;

    // Show notification about approval process
    setNotification({
      type: "info",
      message: message,
    });
  };

  const handleFileUpdate = (updatedFile, fileId, action) => {
    if (action === "delete") {
      // Remove file from list
      setFiles((prevFiles) => prevFiles.filter((file) => file._id !== fileId));
    } else if (updatedFile) {
      // Update file in list
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file._id === updatedFile.id ? { ...file, ...updatedFile } : file
        )
      );
    }
  };

  const handlePendingFileUpdate = (updatedFile, fileId, action) => {
    if (action === "approve") {
      // Remove from pending and add to approved
      setPendingFiles((prev) => prev.filter((file) => file._id !== fileId));
      if (updatedFile) {
        setFiles((prev) => [updatedFile, ...prev]);
      }
    } else if (action === "reject") {
      // Remove from pending files
      setPendingFiles((prev) => prev.filter((file) => file._id !== fileId));
    }
  };

  const handleAdminLoginSuccess = (userData, token) => {
    login(userData, token);
    setShowAdminLogin(false);
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
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Header */}
      <Header
        onUploadClick={() => setShowUploadForm(true)}
        onAdminClick={() => setShowAdminLogin(true)}
      />

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
              <FilesView
                files={files}
                pendingFiles={pendingFiles}
                subjectColors={subjectColors}
                getFileIcon={getFileIcon}
                getFileName={getFileName}
                onFileUpdate={handleFileUpdate}
                onPendingFileUpdate={handlePendingFileUpdate}
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

      {showAdminLogin && (
        <AdminLogin
          onLoginSuccess={handleAdminLoginSuccess}
          onClose={() => setShowAdminLogin(false)}
        />
      )}

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

// Wrap App with AuthProvider
function AppWithAuth() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AppWithAuth;

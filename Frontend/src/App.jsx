import { useState, useEffect } from "react";
import axios from "axios";
import UploadForm from "./components/UploadForm";
import AdminLogin from "./components/AdminLogin";
import UserAuth from "./components/UserAuth";
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
  const [showUserAuth, setShowUserAuth] = useState(false);
  const [notification, setNotification] = useState(null);
  const { login } = useAuth();

  const fetchFiles = async (year) => {
    setLoading(true);

    const url = import.meta.env.VITE_API_URL || "http://localhost:5000";

    try {
      console.log(`Fetching files from: ${url}/year/${year}`);
      const response = await axios.get(`${url}/year/${year}`, {
        withCredentials: true,
      });

      console.log("Files response:", response.data);
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
    const fileCount = uploadData.totalUploaded || 1;
    const message =
      fileCount === 1
        ? "File uploaded successfully! It will appear after admin approval."
        : `${fileCount} files uploaded successfully! They will appear after admin approval.`;

    setNotification({
      type: "info",
      message: message,
    });
  };

  const handleFileUpdate = (updatedFile, fileId, action) => {
    if (action === "delete") {
      setFiles((prevFiles) => prevFiles.filter((file) => file._id !== fileId));
    } else if (updatedFile) {
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file._id === updatedFile.id ? { ...file, ...updatedFile } : file
        )
      );
    }
  };

  const handlePendingFileUpdate = (updatedFile, fileId, action) => {
    if (action === "approve") {
      setPendingFiles((prev) => prev.filter((file) => file._id !== fileId));
      if (updatedFile) {
        setFiles((prev) => [updatedFile, ...prev]);
      }
    } else if (action === "reject") {
      setPendingFiles((prev) => prev.filter((file) => file._id !== fileId));
    }
  };

  const handleAdminLoginSuccess = (userData, token) => {
    login(userData, token);
    setShowAdminLogin(false);
  };

  const handleUserAuthSuccess = (userData, token) => {
    login(userData, token);
    setShowUserAuth(false);
  };

  const getFileName = (file) => {
    return file.name || getFileNameFromUrl(file.fileUrl);
  };

  const getFileNameFromUrl = (fileUrl) => {
    if (!fileUrl) return "Unknown File";

    const urlParts = fileUrl.split("/");
    const fileNameWithExtension = urlParts[urlParts.length - 1];

    const fileName = fileNameWithExtension.split("?")[0];

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
    <div className="min-h-screen bg-black text-white">
      <Header
        onUploadClick={() => setShowUploadForm(true)}
        onAdminClick={() => setShowAdminLogin(true)}
        onUserAuthClick={() => setShowUserAuth(true)}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <YearSelector
          years={years}
          selectedYear={selectedYear}
          onYearChange={handleYearChange}
        />

        {selectedYear && (
          <div className="bg-black border border-gray-800 p-6">
            <div className="text-center mb-6">
              <h3 className="text-lg text-white">
                Resources for{" "}
                {years.find((y) => y.value === selectedYear)?.label}
              </h3>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-400">Loading...</p>
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

      {showUserAuth && (
        <UserAuth
          onAuthSuccess={handleUserAuthSuccess}
          onClose={() => setShowUserAuth(false)}
        />
      )}

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

function AppWithAuth() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AppWithAuth;

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import UploadForm from "./components/UploadForm";
import AdminLogin from "./components/AdminLogin";
import Header from "./components/Header";
import Hero from "./components/Hero";
import FlipStack from "./components/FlipStack";
import Departments from "./components/Departments";
import YearSelector from "./components/YearSelector";
import ResourcesExplorer from "./components/ResourcesExplorer";
import RecentUploads from "./components/RecentUploads";
import HowItWorks from "./components/HowItWorks";
import Features from "./components/Features";
import Testimonial from "./components/Testimonial";
import CtaBand from "./components/CtaBand";
import Footer from "./components/Footer";
import GhostPet from "./components/GhostPet";
import WavyBackground from "./components/WavyBackground";
import Notification from "./components/Notification";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { years } from "./util/data";

function App() {
  const [currentView, setCurrentView] = useState("landing"); // "landing" or "resources"
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedDept, setSelectedDept] = useState(null);
  const [files, setFiles] = useState([]);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [notification, setNotification] = useState(null);
  const { login } = useAuth();

  const fetchFiles = useCallback(async (year) => {
    if (!year) {
      setFiles([]);
      setPendingFiles([]);
      return;
    }

    setLoading(true);
    const url =
      import.meta.env.VITE_API_URL || "https://djsce-resources.onrender.com";

    try {
      const response = await axios.get(`${url}/year/${year}`, {
        withCredentials: true,
      });

      setFiles(response.data.files || []);
      setPendingFiles(response.data.pendingFiles || []);
    } catch (error) {
      console.error("Error fetching files:", error);
      setFiles([]);
      setPendingFiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync with browser back/forward buttons and hash
  useEffect(() => {
    const handleLocationChange = () => {
      if (window.location.hash.startsWith("#resources")) {
        setCurrentView("resources");
        if (!selectedYear) {
          setSelectedYear("1");
          fetchFiles("1");
        }
      } else {
        setCurrentView("landing");
      }
    };

    handleLocationChange();
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, [fetchFiles, selectedYear]);

  // Navigation handlers
  const navigateToResources = (options = {}) => {
    const targetYear = options.year || selectedYear || "1";
    setSelectedYear(targetYear);
    fetchFiles(targetYear);

    if (options.dept !== undefined) {
      setSelectedDept(options.dept);
    }

    setCurrentView("resources");
    window.history.pushState({ view: "resources" }, "", "#resources");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToLanding = () => {
    setCurrentView("landing");
    window.history.pushState({ view: "landing" }, "", window.location.pathname);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    fetchFiles(year);
  };

  const handleDeptSelectFromLanding = (dept) => {
    navigateToResources({ dept: dept, year: selectedYear || "1" });
  };

  const handleYearSelectFromLanding = (yearValue) => {
    navigateToResources({ year: yearValue });
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
    if (!fileUrl) return "GrDocument";
    const extension = fileUrl.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return "GrDocumentPdf";
      case "doc":
      case "docx":
        return "GrDocumentWord";
      case "xls":
      case "xlsx":
        return "GrDocumentExcel";
      case "zip":
      case "rar":
        return "GrDocumentZip";
      case "png":
      case "jpg":
      case "jpeg":
        return "GrDocumentImage";
      default:
        return "GrDocumentText";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg text-ink antialiased">
      {/* Sticky Header with View Awareness */}
      <Header
        onUploadClick={() => setShowUploadForm(true)}
        onAdminClick={() => setShowAdminLogin(true)}
        currentView={currentView}
        onNavigateToResources={() => navigateToResources()}
        onNavigateToLanding={navigateToLanding}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === "landing" ? (
          /* COMPLETELY SEPARATE LANDING PAGE (matching DJSCE Resources.html) */
          <>
            {/* Watery jiggly animated background */}
            <WavyBackground />

            {/* Hero Section */}
            <Hero
              onUploadClick={() => setShowUploadForm(true)}
              onBrowseClick={() => navigateToResources()}
            />

            {/* 3D Paper Flip Stack */}
            <FlipStack />

            {/* Departments Grid (clicking opens Resources Explorer with that department) */}
            <Departments
              selectedDept={selectedDept}
              onSelectDept={handleDeptSelectFromLanding}
            />

            {/* Year Selector (clicking opens Resources Explorer with that year) */}
            <YearSelector
              years={years}
              selectedYear=""
              onYearChange={handleYearSelectFromLanding}
            />

            {/* Freshly Added / Recent Uploads */}
            <RecentUploads onBrowseClick={() => navigateToResources()} />

            {/* How it works */}
            <HowItWorks />

            {/* Features / Why Students Keep Coming Back */}
            <Features />

            {/* Testimonial Quote */}
            <Testimonial />

            {/* Contribute CTA Band */}
            <CtaBand onUploadClick={() => setShowUploadForm(true)} />
          </>
        ) : (
          /* DEDICATED RESOURCES EXPLORER VIEW */
          <ResourcesExplorer
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
            selectedDept={selectedDept}
            onDeptChange={setSelectedDept}
            files={files}
            pendingFiles={pendingFiles}
            loading={loading}
            onFileUpdate={handleFileUpdate}
            onPendingFileUpdate={handlePendingFileUpdate}
            getFileName={getFileName}
            getFileIcon={getFileIcon}
            onBackToHome={navigateToLanding}
            onUploadClick={() => setShowUploadForm(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Ghost mascot easter egg — landing page only */}
      {currentView === "landing" && <GhostPet />}

      {/* Modals & Notifications */}
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

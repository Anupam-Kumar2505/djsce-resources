import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Header({
  onUploadClick,
  onAdminClick,
  currentView = "landing",
  onNavigateToResources,
  onNavigateToLanding,
}) {
  const { user, isAdmin, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[rgba(246,247,251,0.85)] backdrop-blur-md border-b border-line">
      <div className="wrap flex items-center justify-between h-[74px]">
        {/* Brand */}
        <button
          onClick={onNavigateToLanding}
          className="flex items-center gap-2.5 font-bold text-[19px] text-ink tracking-tight cursor-pointer font-['Sora']"
        >
          <span className="brand-mark"></span>
          <span>DJSCE Resources</span>
        </button>

        {/* Desktop Nav Links */}
        {currentView === "landing" ? (
          <nav className="hidden md:flex items-center gap-8 text-[14.5px] text-ink-dim font-medium">
            <a href="#departments" className="hover:text-ink transition-colors">
              Departments
            </a>
            <a href="#years" className="hover:text-ink transition-colors">
              Years
            </a>
            <a href="#how" className="hover:text-ink transition-colors">
              How it works
            </a>
            <a href="#contribute" className="hover:text-ink transition-colors">
              Contribute
            </a>
          </nav>
        ) : (
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm font-semibold text-ink-dim">
              Exploring Archive
            </span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Back to Home CTA (when in resources view) */}
          {currentView === "resources" && (
            <button
              onClick={onNavigateToLanding}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-ink bg-white border border-line hover:border-violet hover:text-violet shadow-xs transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Home</span>
            </button>
          )}

          {/* Upload Button */}
          <button
            onClick={onUploadClick}
            className={`hidden sm:inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              currentView === "resources"
                ? "btn-grad text-white shadow-md !px-5 !py-2.5 !rounded-xl"
                : "text-ink bg-white border border-line hover:border-violet hover:text-violet shadow-xs"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Upload</span>
          </button>

          {/* Admin Controls */}
          {isAuthenticated() && isAdmin() ? (
            <div className="flex items-center gap-2">
              <span className="hidden lg:inline text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800">
                Admin: {user.username}
              </span>
              <button
                onClick={logout}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                title="Log out"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onAdminClick}
              className="text-sm font-semibold text-ink-dim hover:text-ink px-3.5 py-2 rounded-xl hover:bg-white transition-colors cursor-pointer"
            >
              Admin
            </button>
          )}

          {/* Browse Notes CTA (Only in landing view) */}
          {currentView === "landing" && (
            <button
              onClick={() => onNavigateToResources()}
              className="btn-grad text-sm !py-2.5 !px-5.5 !rounded-full cursor-pointer shadow-md"
            >
              Browse notes
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-ink-dim hover:text-ink focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-b border-line px-6 py-4 space-y-3 animate-[fadeIn_0.3s_ease-in-out]">
          {currentView === "landing" ? (
            <>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateToResources();
                }}
                className="w-full text-left font-bold text-sm text-violet py-1"
              >
                Browse All Resources →
              </button>
              <a
                href="#departments"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-ink py-1"
              >
                Departments
              </a>
              <a
                href="#years"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-ink py-1"
              >
                Years
              </a>
              <a
                href="#how"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-ink py-1"
              >
                How it works
              </a>
              <a
                href="#contribute"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-ink py-1"
              >
                Contribute
              </a>
            </>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateToLanding();
              }}
              className="w-full text-left font-bold text-sm text-ink py-1"
            >
              ← Back to Home
            </button>
          )}

          <div className="pt-2 border-t border-line flex gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onUploadClick();
              }}
              className="flex-1 text-center py-2 px-3 rounded-lg text-sm font-semibold bg-bg text-ink border border-line"
            >
              Upload Notes
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;

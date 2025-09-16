function Header({ onUploadClick }) {
  return (
    <div className="border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">
                DJSCE Resources
              </h1>
              <p className="text-xs text-gray-400">Academic Materials Hub</p>
            </div>
          </div>
          <button
            onClick={onUploadClick}
            className="flex items-center space-x-2 bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200 text-sm"
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>Upload</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;

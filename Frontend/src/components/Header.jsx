import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Header({ onUploadClick, onAdminClick, onUserAuthClick }) {
  const { user, isAdmin, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };
  return (
    <div className="border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">
                DJSCE Resources
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {isAuthenticated() && (
              <button
                onClick={onUploadClick}
                className="bg-white text-gray-900 px-4 py-2 text-sm"
              >
                Upload
              </button>
            )}

            {isAuthenticated() ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-green-400 font-medium">
                  {user.role === "admin" ? "Admin" : "User"}: {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onUserAuthClick}
                className="bg-blue-600 text-white px-4 py-2 text-sm"
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;

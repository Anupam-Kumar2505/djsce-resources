/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// Configure axios to send cookies with all requests
axios.defaults.withCredentials = true;

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on initial load
  useEffect(() => {
    const savedToken = localStorage.getItem("adminToken");
    const savedUser = localStorage.getItem("adminUser");

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(parsedUser);
        axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
      } catch (error) {
        console.error("Error parsing saved admin user:", error);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
      }
    }

    // Optional background cookie session check
    const checkCookieAuth = async () => {
      try {
        const url = import.meta.env.VITE_API_URL || "https://djsce-resources.onrender.com";
        const response = await axios.get(`${url}/auth/verify`, {
          withCredentials: true,
        });

        if (response.data.user) {
          setUser(response.data.user);
          if (response.data.token) {
            setToken(response.data.token);
            localStorage.setItem("adminToken", response.data.token);
            localStorage.setItem("adminUser", JSON.stringify(response.data.user));
            axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
          }
        }
      } catch {
        // No cookie session found, which is expected for JWT Bearer token flow
      } finally {
        setLoading(false);
      }
    };

    checkCookieAuth();
  }, []);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);

    if (userToken) {
      localStorage.setItem("adminToken", userToken);
      localStorage.setItem("adminUser", JSON.stringify(userData));
      axios.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
    }
  };

  const logout = async () => {
    try {
      const url = import.meta.env.VITE_API_URL || "https://djsce-resources.onrender.com";
      await axios.post(
        `${url}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  const isAdmin = () => {
    return user?.role === "admin";
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAdmin,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

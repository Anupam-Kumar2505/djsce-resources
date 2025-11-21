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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const url =
          import.meta.env.VITE_API_URL ||
          "https://djsce-resources.onrender.com";
        const response = await axios.get(`${url}/auth/verify`, {
          withCredentials: true,
        });

        if (response.data.user) {
          setUser(response.data.user);
          setToken(response.data.token);
        }
      } catch (error) {
        console.log("No valid session found");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
  };

  const logout = async () => {
    try {
      const url =
        import.meta.env.VITE_API_URL || "https://djsce-resources.onrender.com";
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

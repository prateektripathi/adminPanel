import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

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
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5000/api/auth"; // ✅ Backend route

  // Mock users for frontend-only mode
  const mockUsers = [
    { id: 1, name: "Admin User", email: "admin@example.com", password: "password", role: "admin" },
    { id: 2, name: "Staff Member", email: "staff@example.com", password: "password", role: "staff" },
    { id: 3, name: "Normal User", email: "user@example.com", password: "password", role: "user" },
  ];

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // ✅ Login function (backend + mock support)
  const login = async (email, password) => {
    try {
      // Try backend first
      const res = await axios.post(`₹{API_URL}/login`, { email, password });
      const userData = res.data.user;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      console.warn("Backend login failed, switching to mock:", error.message);

      // Fallback: check mock users
      const foundUser = mockUsers.find(
        (u) => u.email === email && u.password === password
      );
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem("user", JSON.stringify(foundUser));
        return { success: true };
      }

      return {
        success: false,
        message:
          error.response?.data?.message || "Invalid email or password (mock)",
      };
    }
  };

  // ✅ Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

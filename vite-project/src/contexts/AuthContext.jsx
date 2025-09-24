

// import React, { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // ✅ Use environment variable (falls back to hardcoded URL)
//   const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

//   // Mock users (frontend-only mode)
//   const mockUsers = [
//     { id: 1, name: "Admin User", email: "admin@example.com", password: "password", role: "admin" },
//     { id: 2, name: "Staff Member", email: "staff@example.com", password: "password", role: "staff" },
//     { id: 3, name: "Normal User", email: "user@example.com", password: "password", role: "user" },
//   ];

//   // Load user from localStorage on mount
//   useEffect(() => {
//     const savedUser = localStorage.getItem("user");
//     if (savedUser) {
//       setUser(JSON.parse(savedUser));
//     }
//     setLoading(false);
//   }, []);

//   // ✅ Login function (backend + mock support)
//   const login = async (email, password) => {
//     try {
//       console.log('Attempting login to:', `${API_URL}/login`); // Debug log
      
//       // Try backend first
//       const res = await axios.post(`${API_URL}/login`, { email, password });
//       const userData = res.data.user;
//       setUser(userData);
//       localStorage.setItem("user", JSON.stringify(userData));
//       return { success: true };
//     } catch (error) {
//       console.warn("Backend login failed, switching to mock:", error.message);

//       // Fallback: check mock users
//       const foundUser = mockUsers.find(
//         (u) => u.email === email && u.password === password
//       );
//       if (foundUser) {
//         setUser(foundUser);
//         localStorage.setItem("user", JSON.stringify(foundUser));
//         return { success: true };
//       }

//       return {
//         success: false,
//         message:
//           error.response?.data?.message || "Invalid email or password (mock)",
//       };
//     }
//   };

//   // ✅ Register function (optional - for completeness)
//   const register = async (userData) => {
//     try {
//       const res = await axios.post(`${API_URL}/register`, userData);
//       const newUser = res.data.user;
//       setUser(newUser);
//       localStorage.setItem("user", JSON.stringify(newUser));
//       return { success: true };
//     } catch (error) {
//       return {
//         success: false,
//         message: error.response?.data?.message || "Registration failed",
//       };
//     }
//   };

//   // ✅ Logout function
//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, register, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Add this import
import { authService } from "../services/api";

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
  const navigate = useNavigate(); // ✅ Add navigate hook

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData.user);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authService.login({ email, password });
      setUser(response.user);
      
      // ✅ Navigate to dashboard after successful login
      navigate('/dashboard');
      
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      setUser(response.user);
      
      // ✅ Navigate to dashboard after successful registration
      navigate('/dashboard');
      
      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    authService.logout();
    // ✅ Navigate to login after logout
    navigate('/login');
  };

  const value = {
    user,
    login,
    logout,
    register,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
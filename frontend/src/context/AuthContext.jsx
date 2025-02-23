import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { loginurl, registerurl } from "../utls";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUserDetails(); // Fetch user details when token is available
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const fetchUserDetails = async () => {
    try {
      const { data } = await axios.get(loginurl); // Make sure this route exists in your backend
      setUser(data);
    } catch (error) {
      console.error("Failed to fetch user details:", error.response?.data?.message || error);
      setUser(null);
      setToken("");
      localStorage.removeItem("token");
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(loginurl, { email, password });
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser({ name: data.name, email: data.email });
    } catch (error) {
      console.error(error.response?.data?.message || "Login failed");
    }
  };

  const register = async (name, email, password) => {
    try {
      await axios.post(registerurl, { name, email, password });
      await login(email, password);
    } catch (error) {
      console.error(error.response?.data?.message || "Registration failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

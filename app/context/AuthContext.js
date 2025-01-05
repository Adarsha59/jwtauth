"use client";
import { createContext, useState, useEffect, useContext } from "react";
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";
import axios from "axios";

const AuthContext = createContext();

const secretKey = "myscret_kxa";

export const AuthProvider = ({ children }) => {
  const [Text, setText] = useState("Default Text");
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState({});
  const login = async (name, password) => {
    const response = await axios.post("/api/login", { name, password });
    console.log("kam vayo");
    if (response.data.status === "success") {
      // Save the token in cookies
      Cookies.set("hami", response.data.token, { path: "/" });
      setIsAuth(true);
      setUser(response.data.user);
      return true;
    }
    return false;
  };
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = Cookies.get("hami");
        if (token) {
          const response = await axios.post("/api/verify", { token });
          if (response.data.status === "success") {
            console.log("hami yeta xam");
            setIsAuth(true);
            setUser(response.data.user);
          }
        }
      } catch (error) {
        console.error("Token verification error:", error);
        setIsAuth(false);
        setUser(null);
      }
    };
    verifyToken();
  }, []);
  const logout = () => {
    Cookies.remove("hami", { path: "/" });
    setIsAuth(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ Text, isAuth, user, setUser, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

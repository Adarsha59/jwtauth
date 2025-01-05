"use client";
import { createContext, useState, useEffect, useContext } from "react";
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";

const AuthContext = createContext();

const secretKey = "myscret_kxa";

export const AuthProvider = ({ children }) => {
  const [Text, setText] = useState("Default Text");
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    const token = Cookies.get("token");
    console.log("token", token);
    if (token) {
      try {
        const decoded = jwt.verify(token, secretKey);
        setIsAuth(true);
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token", err);
        setIsAuth(false);
        setUser({});
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ Text, setText, isAuth, setIsAuth, user, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

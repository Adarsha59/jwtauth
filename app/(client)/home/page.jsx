"use client";
import { useAuth } from "@/app/context/AuthContext";

import React from "react";

export default function page() {
  const { Text, user, isAuth, logout } = useAuth();
  console.log("data", user);
  console.log("auth", isAuth);
  if (!isAuth) {
    return (
      <>
        <h1>NO Authorize </h1>
      </>
    );
  }

  return (
    <div>
      <button onClick={logout}>Logout</button>
      <hr />
      This is a home page where both auth and non auth user can access{" "}
      {JSON.stringify(user)}
    </div>
  );
}

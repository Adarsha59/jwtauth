"use client";
import { useAuth } from "@/app/context/AuthContext";

import React from "react";

export default function page() {
  const { Text, user, isAuth } = useAuth();
  console.log("data", user);
  if (!isAuth) {
    return (
      <>
        <h1>NO Authorize </h1>
      </>
    );
  }

  return (
    <div>
      This is a home page where both auth and non auth user can access {user}
    </div>
  );
}

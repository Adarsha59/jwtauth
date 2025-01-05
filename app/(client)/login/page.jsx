"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { login, logout } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    login(name, password);
    router.push("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 rounded shadow-md w-full max-w-md ">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-black border rounded"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block">Password</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-black px-3 py-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full  py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

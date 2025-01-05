"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
export default function LoginPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/login", { name, password });
      if (response.data.status === "success") {
        router.push("/dashboard"); // Redirect to dashboard or another protected route
      }
    } catch (err) {
      setError(err.response.data.message);
      setError(""); // Clear error message on successful login or server error response
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className=" p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4 text-black">
            <label className="block ">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 text-black py-2 border rounded"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-black">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500  py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

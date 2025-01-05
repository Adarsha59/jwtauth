# Next.js JWT Authentication

This project demonstrates how to implement authentication in a Next.js application using JWT, cookies, middleware, and an AuthProvider.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication Setup](#authentication-setup)
   - [AuthContext](#authcontext)
   - [API Routes](#api-routes)
     - [Login Route](#login-route)
     - [Verify Route](#verify-route)
   - [Root Layout](#root-layout)
   - [Home Page](#home-page)
   - [Database Connection](#database-connection)
3. [Learn More](#learn-more)
4. [Deploy on Vercel](#deploy-on-vercel)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Authentication Setup

This project demonstrates how to implement authentication in a Next.js application using JWT, cookies, middleware, and an AuthProvider.

### AuthContext

Create an `AuthContext` to manage authentication state.

```javascript
// filepath: /home/adarsha/Documents/code/Nextjs/ONLY-BACKEND/jwtauth/app/context/AuthContext.js
"use client"; // Enable client-side rendering
import { createContext, useState, useEffect, useContext } from "react";
import jwt from "jsonwebtoken"; // Import JWT for token handling
import Cookies from "js-cookie"; // Import js-cookie for cookie handling
import axios from "axios"; // Import axios for HTTP requests

const AuthContext = createContext(); // Create a context for authentication

const secretKey = "myscret_kxa"; // Define a secret key for JWT

export const AuthProvider = ({ children }) => {
  const [Text, setText] = useState("Default Text"); // State for some text
  const [isAuth, setIsAuth] = useState(false); // State to track authentication status
  const [user, setUser] = useState({}); // State to store user information

  // Function to handle user login
  const login = async (name, password) => {
    const response = await axios.post("/api/login", { name, password });
    if (response.data.status === "success") {
      Cookies.set("hami", response.data.token, { path: "/" }); // Save the token in cookies
      setIsAuth(true); // Set authentication status to true
      setUser(response.data.user); // Set user information
      return true;
    }
    return false;
  };

  // Effect to verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = Cookies.get("hami");
        if (token) {
          const response = await axios.post("/api/verify", { token });
          if (response.data.status === "success") {
            setIsAuth(true); // Set authentication status to true
            setUser(response.data.user); // Set user information
          }
        }
      } catch (error) {
        setIsAuth(false); // Set authentication status to false
        setUser(null); // Clear user information
      }
    };
    verifyToken();
  }, []);

  // Function to handle user logout
  const logout = () => {
    Cookies.remove("hami", { path: "/" }); // Remove the token from cookies
    setIsAuth(false); // Set authentication status to false
    setUser(null); // Clear user information
  };

  return (
    <AuthContext.Provider
      value={{ Text, isAuth, user, setUser, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); // Custom hook to use AuthContext
```

### API Routes

#### Login Route

Create an API route for user login.

```javascript
// filepath: /home/adarsha/Documents/code/Nextjs/ONLY-BACKEND/jwtauth/app/api/login/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"; // Import bcrypt for password hashing
import jwt from "jsonwebtoken"; // Import JWT for token handling
import connectDB from "@/app/libs/connectDb"; // Import database connection
import User from "@/app/utils/user"; // Import User model

const secretKey = "myscret_kxa"; // Define a secret key for JWT

export async function POST(req) {
  try {
    await connectDB(); // Connect to the database
    const { name, password } = await req.json(); // Get name and password from request body

    if (!name || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ name }); // Find user by name
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password); // Compare passwords
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign({ id: user._id, name: user.name }, secretKey, {
      expiresIn: "1h",
    }); // Generate JWT token

    return NextResponse.json({
      message: "User logged in successfully",
      status: "success",
      token: token,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
```

#### Verify Route

Create an API route to verify the JWT token.

```javascript
// filepath: /home/adarsha/Documents/code/Nextjs/ONLY-BACKEND/jwtauth/app/api/verify/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken"; // Import JWT for token handling

const secretKey = "myscret_kxa"; // Define a secret key for JWT

export async function POST(req) {
  try {
    const { token } = await req.json(); // Get token from request body

    if (!token) {
      return NextResponse.json(
        { status: "error", message: "Token is required" },
        { status: 400 }
      );
    }

    const verifiedUser = jwt.verify(token, secretKey); // Verify JWT token
    return NextResponse.json({
      status: "success",
      user: verifiedUser,
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Invalid token" },
      { status: 401 }
    );
  }
}
```

### Root Layout

Wrap your application with the `AuthProvider`.

```javascript
// filepath: /home/adarsha/Documents/code/Nextjs/ONLY-BACKEND/jwtauth/app/layout.js
import { Geist, Geist_Mono } from "next/font/google"; // Import fonts
import "./globals.css"; // Import global styles
import { AuthProvider } from "@/app/context/AuthContext"; // Import AuthProvider

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </AuthProvider>
  );
}
```

### Home Page

Create a home page that displays user information if authenticated.

```jsx
// filepath: /home/adarsha/Documents/code/Nextjs/ONLY-BACKEND/jwtauth/app/(client)/home/page.jsx
"use client"; // Enable client-side rendering
import { useAuth } from "@/app/context/AuthContext"; // Import useAuth hook
import React from "react";

export default function page() {
  const { Text, user, isAuth, logout } = useAuth(); // Destructure values from useAuth
  if (!isAuth) {
    return (
      <>
        <h1>NO Authorize </h1>
      </>
    );
  }

  return (
    <div>
      <button onClick={logout}>Logout</button> {/* Logout button */}
      <hr />
      This is a home page where both auth and non auth user can access{" "}
      {JSON.stringify(user)} {/* Display user information */}
    </div>
  );
}
```

### Database Connection

Create a function to connect to the MongoDB database.

```javascript
// filepath: /home/adarsha/Documents/code/Nextjs/ONLY-BACKEND/jwtauth/app/libs/connectDb.js
import mongoose from "mongoose";

const connection = {};

async function connectDB() {
  // Check if we have a connection to the database or if it's currently connecting
  if (connection.isConnected) {
    console.log("Already connected to the database");
    return;
  }

  try {
    // Attempt to connect to the database
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {
      dbName: process.env.MONGODB_DB, // Fixed typo: dbName
      useNewUrlParser: true, // Recommended for parsing MongoDB connection strings
      useUnifiedTopology: true,
    });

    connection.isConnected = db.connections[0].readyState;

    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);

    // Graceful exit in case of a connection error
    process.exit(1);
  }
}

export default connectDB;
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

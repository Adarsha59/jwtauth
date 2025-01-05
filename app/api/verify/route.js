import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const secretKey = "myscret_kxa";

export async function POST(req) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { status: "error", message: "Token is required" },
        { status: 400 }
      );
    }

    const verifiedUser = jwt.verify(token, secretKey);
    return NextResponse.json({
      status: "success",
      user: verifiedUser,
    });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { status: "error", message: "Invalid token" },
      { status: 401 }
    );
  }
}

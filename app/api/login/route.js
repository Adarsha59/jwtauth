import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectDB from "@/app/libs/connectDb";
import User from "@/app/utils/user";

const secretKey = "myscret_kxa";

export async function POST(req) {
  try {
    await connectDB();
    const { name, password } = await req.json();

    if (!name || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ name });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign({ id: user._id, name: user.name }, secretKey, {
      expiresIn: "1h",
    });

    const res = NextResponse.json({
      message: "User logged in successfully",
      status: "success",
      token: token,
    });
    return res;
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

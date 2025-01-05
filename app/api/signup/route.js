import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import connectDB from "@/app/libs/connectDb";
import User from "@/app/utils/user";
const myscret = "myscret_kxa";
export async function POST(req) {
  try {
    await connectDB();
    const { name, password } = await req.json();
    // Check if the request body is missing any required fields
    if (!name || !password) {
      return NextResponse.error(new Error("Missing required fields"));
    }
    // Validate the input fields here
    if (name.length < 3 || password.length < 6) {
      return NextResponse.error(new Error("Invalid input"));
    }
    //hash pasword
    const hashpassword = await bcrypt.hash(password, 10);
    console.log("object", hashpassword);
    // Perform database operations here

    // Create a new user
    const NewUser = new User({
      name: name,
      password: hashpassword,
    });
    const respond = await NewUser.save();

    return NextResponse.json({
      message: "User created successfully",
      status: "success",
      data: respond,
      token: token,
    }); // Return the response
    // Return the response
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Failed to create new post" },
      { status: 500 }
    );
  }
}

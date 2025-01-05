import mongoose from "mongoose";

// Define the user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  // email: {
  //   type: String,
  //   unique: true, // Ensure the email is unique
  //   lowercase: true, // Store email in lowercase
  //   match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"], // Email format validation
  // },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the model
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  prn: {
    type: String,
    required: [true, "Please provide a PRN"],
    unique: true,
    trim: true,
  },
  batch: {
    type: String,
    required: [true, "Please provide a batch"],
    trim: true,
  },
  mobile: {
    type: String,
    required: [true, "Please provide a mobile number"],
    unique: true,
    trim: true,
  },
  github: {
    type: String,
    default: "",
    trim: true,
  },
  linkedin: {
    type: String,
    default: "",
    trim: true,
  },
  skills: {
    type: [String],
    default: [],
  },
  profileComplete: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: "Student",
  },
  points: {
    type: Number,
    default: 0,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
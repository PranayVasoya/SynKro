import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  prn: string;
  batch: string;
  mobile: string;
  github: string;
  linkedin: string;
  skills: string[];
  profileComplete: boolean;
  role: string;
  points: number;
  forgotPasswordToken?: string;
  forgotPasswordTokenExpiry?: Date;
}

const userSchema: Schema = new mongoose.Schema({
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
  forgotPasswordToken: {
    type: String,
  },
  forgotPasswordTokenExpiry: {
    type: Date,
  },
});

export default mongoose.models.User || mongoose.model<IUser>("User", userSchema);
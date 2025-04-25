import mongoose from "mongoose"
import { PassThrough } from "stream"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: false,
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false, 
    },
    role: {
        type: String,
        enum: ["Student", "Mentor", "Admin"],
        default: "Student",
        required: true,
    },
    prn: {
        type: String,
        required:[true, "Please provide a PRN"],
        unique: true,
    },
    mobile: {
        type: String,
        required: [true, "Please provide a mobile number"],
        unique: true,   
    },
    github: {
        type: String,
        required: false,
    },
    linkedin: {
        type: String,
        required: false,    
    },
    skills: {
        programmingLanguages: [String],
        frontendDevelopment: [String],
        backendDevelopment: [String],
        mobileAppDevelopment: [String],
        aiml: [String],
        database: [String],
        dataVisualization: [String],
        devops: [String],
        baas: [String],
        frameworks: [String],
        testing: [String],
        software: [String],
        staticSiteGenerators: [String],
        gameEngines: [String],
        automation: [String],
        cloudComputing: [String],
        other: [String],
    },
    points: {
        type: Number,
        default: 0
    },
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Projects"
    }],
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date
}, { timestamps: true })

const User = mongoose.models.users || mongoose.model("users", userSchema)
export default User
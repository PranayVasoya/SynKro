import mongoose from "mongoose";
import { assign } from "nodemailer/lib/shared";

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    techStack: [String],
    repoLink: String,
    liveLink: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    teamMembers: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        },
    }],
    mentors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    }],
    islookingForMembers: {
        type: Boolean,
        default: false
    },
    points: {
        type: Number,
        default: 10 // or assign based on rules
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    chatRoomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatRoom",
    },
    tokenBoard: [{
        tokenTitle: String, 
        status: {
            type: String,
            enum: ["Completed", "In-progress", "closed"],
            default: "open"
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
    }]
}, {
    timestamps: true,
});

const Project = mongoose.models.projects || mongoose.model("projects", projectSchema);
export default Project;





import mongoose from "mongoose";

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
        role: String, // 'student', 'faculty', 'mentor', etc.
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    lookingForMembers: {
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
    }
});

const Project = mongoose.models.projects || mongoose.model("projects", projectSchema);
export default Project;





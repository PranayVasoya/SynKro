import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    name: String,
    description: String,
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }],
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: false,
    },
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "projects"
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Team = mongoose.models.teams || mongoose.model("teams", teamSchema);
export default Team;



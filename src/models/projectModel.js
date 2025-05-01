const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a project title"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
    trim: true,
  },
  techStack: {
    type: [String],
    default: [],
  },
  repoLink: {
    type: String,
    default: "",
    trim: true,
  },
  liveLink: {
    type: String,
    default: "",
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  teamMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  lookingForMembers: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["active", "completed"],
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Project || mongoose.model("Project", projectSchema);
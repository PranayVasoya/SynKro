const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  forumId: {
    type: String,
    required: [true, "Please provide a forum ID"],
  },
  title: {
    type: String,
    required: [true, "Please provide a post title"],
    trim: true,
  },
  content: {
    type: String,
    required: [true, "Please provide post content"],
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Post || mongoose.model("Post", postSchema);
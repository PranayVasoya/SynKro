const mongoose = require("mongoose");

const chatroomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a chatroom title"],
    trim: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    text: String,
    time: {
      type: Date,
      default: Date.now,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Chatroom || mongoose.model("Chatroom", chatroomSchema);
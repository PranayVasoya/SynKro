import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const chatroomSchema = new Schema({
  title: {
    type: String,
    required: [true, "Please provide a chatroom title"],
    trim: true,
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: "User",
  }],
  messages: [{
    sender: {
      type: Schema.Types.ObjectId,
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

const Chatroom = models.Chatroom || model("Chatroom", chatroomSchema);
export default Chatroom;

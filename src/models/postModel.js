import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const postSchema = new Schema({
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
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = models.Post || model("Post", postSchema);
export default Post;

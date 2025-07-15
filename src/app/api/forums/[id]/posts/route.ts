import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/dbConfig/dbConfig";
import Post from "@/models/postModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import mongoose from "mongoose";

interface PostType {
  _id: mongoose.Types.ObjectId;
  title: string;
  content: string;
  createdBy: { username: string };
  createdAt: Date;
}

function extractForumId(request: NextRequest): string | null {
  const segments = request.nextUrl.pathname.split("/");
  // Adjust index according to your route structure
  // Example: /api/forums/{id}/posts -> index 3 is id
  if (segments.length > 3) return segments[3];
  return null;
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const forumId = extractForumId(request);
    if (!forumId) {
      return NextResponse.json({ error: "Forum ID missing" }, { status: 400 });
    }

    let userId: string;
    try {
      userId = await getDataFromToken(request);
      console.log("User ID from token:", userId);
    } catch (error) {
      console.error("Fetch Posts: Error:", error);
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const posts = await Post.find({ forumId })
      .populate("createdBy", "username")
      .sort({ createdAt: -1 });

    const formattedPosts = posts.map((post: PostType) => ({
      _id: post._id.toString(),
      title: post.title,
      content: post.content,
      createdBy: { username: post.createdBy.username },
      createdAt: post.createdAt,
    }));

    return NextResponse.json({
      message: "Posts fetched successfully",
      success: true,
      data: formattedPosts,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const forumId = extractForumId(request);
    if (!forumId) {
      return NextResponse.json({ error: "Forum ID missing" }, { status: 400 });
    }

    let userId: string;
    try {
      userId = await getDataFromToken(request);
    } catch (error) {
      console.error("Create Post: Error:", error);
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const { content } = await request.json();
    if (!content?.trim()) {
      return NextResponse.json({ error: "Post content is required" }, { status: 400 });
    }

    const post = new Post({
      forumId,
      title: content.trim().substring(0, 50) + (content.length > 50 ? "..." : ""),
      content: content.trim(),
      createdBy: userId,
    });

    await post.save();

    const populatedPost = await Post.findById(post._id).populate("createdBy", "username");
    if (!populatedPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Post created successfully",
      success: true,
      data: {
        _id: populatedPost._id.toString(),
        title: populatedPost.title,
        content: populatedPost.content,
        createdBy: {
          username: populatedPost.createdBy.username,
        },
        createdAt: populatedPost.createdAt,
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/dbConfig/dbConfig";
import Post from "@/models/postModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    let userId: string;
    try {
      userId = await getDataFromToken(request);
    } catch (error) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const { id } = await params; // Await params to access id
    const posts = await Post.find({ forumId: id })
      .populate("createdBy", "username")
      .sort({ createdAt: -1 });

    const formattedPosts = posts.map((post) => ({
      _id: post._id.toString(),
      forumId: post.forumId,
      title: post.title,
      content: post.content,
      createdBy: {
        username: post.createdBy.username,
      },
      project: post.project ? post.project.toString() : null,
      createdAt: post.createdAt,
    }));

    return NextResponse.json({
      message: "Posts fetched successfully",
      success: true,
      data: formattedPosts,
    });
  } catch (error: unknown) {
    console.error("Fetch Posts: Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    let userId: string;
    try {
      userId = await getDataFromToken(request);
    } catch (error) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const { id } = await params; // Await params to access id
    const { title, content } = await request.json();

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const post = new Post({
      forumId: id,
      title: title.trim(),
      content: content.trim(),
      createdBy: userId,
    });

    await post.save();

    const populatedPost = await Post.findById(post._id).populate("createdBy", "username");
    if (!populatedPost) {
      return NextResponse.json({ error: "Post not found after creation" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Post created successfully",
      success: true,
      data: {
        _id: populatedPost._id.toString(),
        forumId: populatedPost.forumId,
        title: populatedPost.title,
        content: populatedPost.content,
        createdBy: {
          username: populatedPost.createdBy.username,
        },
        project: populatedPost.project ? populatedPost.project.toString() : null,
        createdAt: populatedPost.createdAt,
      },
    });
  } catch (error: unknown) {
    console.error("Create Post: Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
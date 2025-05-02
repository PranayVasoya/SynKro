import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/dbConfig/dbConfig";
import Chatroom from "@/models/chatroomModel";
import Notification from "@/models/notificationModel";
import User from "@/models/userModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import mongoose from "mongoose";

interface Message {
  _id: mongoose.Types.ObjectId;
  text: string;
  sender: { _id: mongoose.Types.ObjectId; username: string };
  time: Date;
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    let userId: string;
    try {
      userId = await getDataFromToken(request);
    } catch (error) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
    const chatroom = await Chatroom.findOne({ _id: params.id, members: userId })
      .populate("messages.sender", "username");
    if (!chatroom) {
      return NextResponse.json({ error: "Chatroom not found or access denied" }, { status: 404 });
    }
    const messages = chatroom.messages.map((msg: Message) => ({
      id: msg._id.toString(),
      text: msg.text,
      sender: msg.sender._id.toString() === userId ? "me" : msg.sender.username,
      time: msg.time,
    }));
    return NextResponse.json({
      message: "Messages fetched successfully",
      success: true,
      data: messages,
    });
  } catch (error: unknown) {
    console.error("Fetch Messages: Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    let userId: string;
    try {
      userId = await getDataFromToken(request);
    } catch (error) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
    const { text } = await request.json();
    if (!text?.trim()) {
      return NextResponse.json({ error: "Message text is required" }, { status: 400 });
    }
    const chatroom = await Chatroom.findOne({ _id: params.id, members: userId });
    if (!chatroom) {
      return NextResponse.json({ error: "Chatroom not found or access denied" }, { status: 404 });
    }
    
    const newMessage = {
      sender: userId,
      text: text.trim(),
      time: new Date(),
    };
    
    chatroom.messages.push(newMessage);
    await chatroom.save();
    
    // Populate sender for notification
    const populatedChatroom = await Chatroom.findById(params.id)
      .populate("messages.sender", "username");
    const savedMessage = populatedChatroom.messages[populatedChatroom.messages.length - 1];
    
    // Create notifications for other chatroom members
    const sender = await User.findById(userId).select("username");
    const notificationPromises = chatroom.members
      .filter((memberId: mongoose.Types.ObjectId) => memberId.toString() !== userId)
      .map((memberId: mongoose.Types.ObjectId) =>
        new Notification({
          recipient: memberId,
          message: `${sender.username} sent a message in "${chatroom.title}"`,
          link: "/chat",
          read: false,
          type: "message",
        }).save()
      );
    await Promise.all(notificationPromises);

    return NextResponse.json({
      message: "Message sent successfully",
      success: true,
      data: {
        id: savedMessage._id.toString(),
        text: savedMessage.text,
        sender: "me",
        time: savedMessage.time,
      },
    });
  } catch (error: unknown) {
    console.error("Send Message: Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
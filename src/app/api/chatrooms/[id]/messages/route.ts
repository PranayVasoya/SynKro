import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/dbConfig/dbConfig";
import Chatroom from "@/models/chatroomModel";
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
    const chatroom = await Chatroom.findOneAndUpdate(
      { _id: params.id, members: userId },
      {
        $push: {
          messages: {
            sender: userId,
            text: text.trim(),
            time: new Date(),
          },
        },
      },
      { new: true }
    ).populate("messages.sender", "username");
    if (!chatroom) {
      return NextResponse.json({ error: "Chatroom not found or access denied" }, { status: 404 });
    }
    const newMessage = chatroom.messages[chatroom.messages.length - 1];
    return NextResponse.json({
      message: "Message sent successfully",
      success: true,
      data: {
        id: newMessage._id.toString(),
        text: newMessage.text,
        sender: "me",
        time: newMessage.time,
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
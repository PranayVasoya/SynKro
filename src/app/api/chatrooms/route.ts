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

interface Chatroom {
  _id: mongoose.Types.ObjectId;
  title: string;
  messages: Message[];
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    let userId: string;
    try {
      userId = await getDataFromToken(request);
    } catch (error) {
      console.error("Fetch Chatrooms: Error:", error);
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
    const chatrooms = await Chatroom.find({ members: userId })
      .populate("messages.sender", "username");
    const formattedChatrooms = chatrooms.map((chatroom: Chatroom) => ({
      _id: chatroom._id.toString(),
      title: chatroom.title,
      lastMessage: chatroom.messages.length > 0 ? chatroom.messages[chatroom.messages.length - 1].text : "",
      time: chatroom.messages.length > 0 ? new Date(chatroom.messages[chatroom.messages.length - 1].time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "",
    }));
    return NextResponse.json({
      message: "Chatrooms fetched successfully",
      success: true,
      data: formattedChatrooms,
    });
  } catch (error: unknown) {
    console.error("Fetch Chatrooms: Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
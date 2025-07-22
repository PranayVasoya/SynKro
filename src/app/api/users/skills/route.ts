// app/api/skills/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

export async function GET(request: NextRequest) {
  await connectToDatabase();
  const userId = request.nextUrl.searchParams.get("userId");
  const user = await User.findById(userId).select("skills");
  return NextResponse.json({ skills: user?.skills || [] });
}

export async function POST(request: NextRequest) {
  await connectToDatabase();
  const { userId, skills } = await request.json();
  await User.findByIdAndUpdate(userId, { skills });
  return NextResponse.json({ message: "Skills updated" });
}
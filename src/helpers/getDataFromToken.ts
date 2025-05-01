import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function getDataFromToken(request: NextRequest): Promise<string> {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      throw new Error("No token found");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as {
      id: string;
    };
    return decoded.id;
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
}
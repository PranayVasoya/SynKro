import { connectToDatabase } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";

connectToDatabase();

export async function GET(request: NextRequest) {
    try {
         const response = NextResponse.json({
            message: "Logout Successfully",
            success: true,
         });

         response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0),
            path: '/',
         });

         return response;

    } catch (error: unknown) {
        console.error("Logout API Error:", error);

        let errorMessage = "An unexpected error occurred during logout.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
import { ChatRequest, ChatResponse } from "@/interfaces/chatbot";

// Reads the API URL from environment variables, with a fallback for local dev
const API_URL = process.env.NEXT_PUBLIC_CHATBOT_API_URL || 'http://localhost:8000/api/v1';

/**
 * Sends a message to the chatbot backend and returns the response.
 * @param request - The chat request object containing the user's query and ID.
 * @returns A promise that resolves to the chatbot's response.
 */
export const sendMessageToBot = async (request: ChatRequest): Promise<ChatResponse> => {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      // Gracefully handle server-side errors
      console.error("API Error:", response.status, response.statusText);
      throw new Error(`API error: ${response.statusText}`);
    }

    const data: ChatResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to send message to bot:", error);
    // Return a standard error message if the fetch fails (e.g., network error)
    return {
      answer: "Sorry, I'm unable to connect to my brain right now. Please try again later.",
      source: "Connection Error",
    };
  }
};
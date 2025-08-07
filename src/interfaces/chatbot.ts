// Defines the shape of a single chat message
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

// Defines the request payload sent to the backend
export interface ChatRequest {
  query: string;
  user_id: string; // This should come from your auth context/session
}

// Defines the response payload received from the backend
export interface ChatResponse {
  answer: string;
  source: string;
}
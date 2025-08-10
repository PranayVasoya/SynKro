import os
import json
import numpy as np
import faiss
from groq import Groq
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
from datetime import datetime


class ChatEngine:
    def __init__(self, kb_path="knowledge_base/knowledge_base.json"):
        load_dotenv()

        print("Loading Sentence Transformer model...")
        self.embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
        print("Model loaded.")

        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY not found in environment variables.")
        self.llm_client = Groq(api_key=api_key)
        self.llm_model = "llama3-8b-8192"

        self.kb = self._load_knowledge_base(kb_path)
        self.index = self._build_faiss_index()

        mongo_uri = os.getenv("MONGO_URI")
        db_name = os.getenv("MONGO_DB_NAME")
        collection_name = os.getenv("MONGO_COLLECTION_NAME")
        if not all([mongo_uri, db_name, collection_name]):
            raise ValueError("MongoDB connection details missing in .env")

        print("Connecting to MongoDB...")
        self.mongo_client = MongoClient(mongo_uri)
        self.db = self.mongo_client[db_name]
        self.collection = self.db[collection_name]
        print("MongoDB connection successful.")

    def _load_knowledge_base(self, kb_path):
        print(f"Loading knowledge base from {kb_path}...")
        try:
            with open(kb_path, "r", encoding="utf-8") as f:
                kb_data = json.load(f)
            print(f"Knowledge base loaded with {len(kb_data)} entries.")
            return kb_data
        except FileNotFoundError:
            print(f"Error: Knowledge base file not found at {kb_path}")
            return []

    def _build_faiss_index(self):
        if not self.kb:
            return None
        print("Building FAISS index...")
        questions = [entry["question"] for entry in self.kb]
        embeddings = self.embedding_model.encode(questions, convert_to_tensor=False)

        dimension = embeddings.shape[1]
        index = faiss.IndexFlatL2(dimension)
        index.add(np.array(embeddings, dtype=np.float32))
        print("FAISS index built successfully.")
        return index

    # [FIX & TUNING] - Threshold lowered and debug print added
    def _search_kb(self, query: str, threshold=0.65):  # <-- THRESHOLD LOWERED
        if not self.index:
            return None, 0.0

        query_embedding = self.embedding_model.encode([query])
        distances, indices = self.index.search(
            np.array(query_embedding, dtype=np.float32), 1
        )

        best_match_index = indices[0][0]
        distance = distances[0][0]

        similarity = 1 / (1 + distance)

        # This debug line is your most important tool for tuning
        print(
            f"DEBUG: Query: '{query}' | Best Match: '{self.kb[best_match_index]['question']}' | Similarity: {similarity:.4f}"
        )

        if similarity >= threshold:
            return self.kb[best_match_index], similarity
        return None, similarity

    def _log_to_mongo(self, user_id, query, response, source, topic=None):
        if user_id == "guest":
            return

        log_entry = {
            "user_id": user_id,
            "query": query,
            "response": response,
            "source": source,
            "topic": topic,
            "timestamp": datetime.utcnow(),
        }
        self.collection.insert_one(log_entry)

    def _is_creative_request(self, query: str) -> bool:
        print("Classifying intent for query using Groq...")
        try:
            chat_completion = self.llm_client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "Analyze the user's query. Is it a request for project ideas, brainstorming help, or creative suggestions for academic work? Respond with only 'YES' or 'NO'.",
                    },
                    {
                        "role": "user",
                        "content": query,
                    },
                ],
                model=self.llm_model,
                temperature=0,
            )
            decision = chat_completion.choices[0].message.content.strip().upper()
            print(f"Intent classification result: {decision}")
            return "YES" in decision
        except Exception as e:
            print(f"Error during intent classification with Groq: {e}")
            return False

    # [FIX] - Corrected logic flow for authentication and fallbacks
    def generate_response(self, query: str, user_id: str):
        # 1. Search in local knowledge base first.
        kb_match, similarity = self._search_kb(query)

        if kb_match:
            print(f"KB Match found with similarity: {similarity:.2f}")
            response_text = kb_match["answer"]
            topic = kb_match.get("category", "Unknown")
            self._log_to_mongo(user_id, query, response_text, "KB", topic)
            return {"answer": response_text, "source": "Knowledge Base"}

        # 2. If no KB match, classify the user's intent BEFORE checking if they are a guest.
        print("No suitable KB entry found. Checking for creative intent...")
        is_creative = self._is_creative_request(query)

        # 3. Now, handle the logic based on intent.
        if is_creative:
            # The question is creative, NOW check if the user is allowed to use the LLM.
            if user_id == "guest":
                print("User is a guest. Creative LLM access is denied.")
                guest_fallback_message = "This question requires advanced help. Please sign in or sign up to get a detailed answer from our AI assistant."
                return {"answer": guest_fallback_message, "source": "Auth Wall"}

            # If we reach here, the user is logged in and the request is creative.
            print("Creative intent detected for logged-in user. Calling Groq...")
            try:
                chat_completion = self.llm_client.chat.completions.create(
                    messages=[
                        {
                            "role": "system",
                            "content": "You are SynKro Assist, a creative AI partner for a project platform. A user is asking for project ideas or brainstorming. Provide a few creative and helpful suggestions based on their query.",
                        },
                        {
                            "role": "user",
                            "content": query,
                        },
                    ],
                    model=self.llm_model,
                )
                response_text = chat_completion.choices[0].message.content
                self._log_to_mongo(
                    user_id,
                    query,
                    response_text,
                    "LLM (Groq)",
                    topic="Creative Request",
                )
                return {"answer": response_text, "source": "LLM (Groq)"}

            except Exception as e:
                print(f"Error calling Groq API for creative task: {e}")
                error_message = "I'm having trouble brainstorming right now. Please try again in a moment."
                self._log_to_mongo(user_id, query, error_message, "Error")
                return {"answer": error_message, "source": "Error"}

        else:
            # 4. The request was not creative, so it's out of scope for all users (guests and logged-in).
            print("Query is out of scope (not in KB and not a creative request).")
            fallback_message = "I can only answer questions about how to use the SynKro platform or help with brainstorming project ideas. Could you please rephrase your question?"
            self._log_to_mongo(
                user_id, query, fallback_message, "OOS", topic="Out of Scope"
            )
            return {"answer": fallback_message, "source": "Out of Scope"}

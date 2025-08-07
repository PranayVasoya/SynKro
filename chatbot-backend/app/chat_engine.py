import os
import json
import numpy as np
import faiss

# import google.generativeai as genai <-- REMOVE
from groq import Groq  # <-- ADD
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

        # Configure Groq API Client
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY not found in environment variables.")
        self.llm_client = Groq(api_key=api_key)  # <-- MODIFIED
        self.llm_model = "llama3-8b-8192"  # We will use Llama 3 8B model

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

    # ... (The _load_knowledge_base, _build_faiss_index, and _search_kb methods remain exactly the same) ...
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

    def _search_kb(self, query: str, threshold=0.75):
        if not self.index:
            return None, 0.0
        query_embedding = self.embedding_model.encode([query])
        distances, indices = self.index.search(
            np.array(query_embedding, dtype=np.float32), 1
        )
        best_match_index = indices[0][0]
        distance = distances[0][0]
        similarity = 1 / (1 + distance)
        if similarity >= threshold:
            return self.kb[best_match_index], similarity
        return None, similarity

    def _log_to_mongo(self, user_id, query, response, source, topic=None):
        log_entry = {
            "user_id": user_id,
            "query": query,
            "response": response,
            "source": source,
            "topic": topic,
            "timestamp": datetime.utcnow(),
        }
        self.collection.insert_one(log_entry)

    # MODIFIED: This function now calls the Groq API
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
                temperature=0,  # Low temperature for classification
            )
            decision = chat_completion.choices[0].message.content.strip().upper()
            print(f"Intent classification result: {decision}")
            return "YES" in decision
        except Exception as e:
            print(f"Error during intent classification with Groq: {e}")
            return False

    # MODIFIED: This function now calls the Groq API for generation
    def generate_response(self, query: str, user_id: str):
        kb_match, similarity = self._search_kb(query)

        if kb_match:
            print(f"KB Match found with similarity: {similarity:.2f}")
            response_text = kb_match["answer"]
            topic = kb_match.get("category", "Unknown")
            self._log_to_mongo(user_id, query, response_text, "KB", topic)
            return {"answer": response_text, "source": "Knowledge Base"}

        print("No suitable KB entry found. Checking for creative intent...")
        if self._is_creative_request(query):
            print("Creative intent detected. Calling Groq for a generative response.")
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
            print("Query is out of scope (not in KB and not a creative request).")
            fallback_message = "I can only answer questions about how to use the SynKro platform or help with brainstorming project ideas. Could you please rephrase your question?"
            self._log_to_mongo(
                user_id, query, fallback_message, "OOS", topic="Out of Scope"
            )
            return {"answer": fallback_message, "source": "Out of Scope"}

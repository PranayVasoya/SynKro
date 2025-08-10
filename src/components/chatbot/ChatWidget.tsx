'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage as ChatMessageType } from '@/interfaces/chatbot';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { sendMessageToBot } from '@/lib/chatbot.api';
import { clsx } from 'clsx';

// SVG Icons
const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageType[]>([
    { id: 'initial', text: 'Hello! I am SynKro Assist. How can I help you today with the platform or with project ideas?', sender: 'bot' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // [AUTH & DEBUG FIX]
  // This logic now correctly checks for user data and defaults to 'guest'.
  const [userId, setUserId] = useState<string>('guest');

  useEffect(() => {
    // This effect runs on the client and checks for user data.
    // YOU MUST ensure your login process saves user data to localStorage.
    const userDataString = localStorage.getItem('user');
    
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        // IMPORTANT: Check if the user object has an 'id' or '_id' property.
        // MongoDB often uses '_id'. Adjust this line if necessary.
        if (userData && userData.id) {
          setUserId(userData.id);
        } else if (userData && userData._id) {
          setUserId(userData._id);
        }
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
      }
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(scrollToBottom, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    const userMessage: ChatMessageType = { id: Date.now().toString(), text, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // [DEBUGGING] - Check your browser console to see what ID is being sent.
    console.log(`Sending message to bot. Query: "${text}", UserID: "${userId}"`);

    const response = await sendMessageToBot({ query: text, user_id: userId });
    
    const botMessage: ChatMessageType = {
      id: (Date.now() + 1).toString(),
      text: response.answer,
      sender: 'bot'
    };
    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div
        className={clsx(
          "w-80 sm:w-96 h-[32rem] bg-white rounded-lg shadow-2xl flex flex-col transition-all duration-300 ease-in-out dark:bg-gray-800",
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        )}
      >
        <div className="bg-primary text-white p-4 rounded-t-lg flex justify-between items-center">
          <h3 className="font-bold text-lg">SynKro Assist</h3>
        </div>
        <div className="flex-grow p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-col space-y-2">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && <ChatMessage message={{id: 'loading', sender: 'bot', text: '...'}}/>}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center mt-4 float-right hover:bg-blue-700 active:bg-blue-800 transition-all duration-200"
        aria-label="Toggle Chat Window"
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </button>
    </div>
  );
};
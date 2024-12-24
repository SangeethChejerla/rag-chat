'use client';

import { useChat } from 'ai/react';
import { Bot, Send, User } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

interface ChatWrapperProps {
  sessionId: string;
  initialMessages: Message[];
}

export const ChatWrapper: React.FC<ChatWrapperProps> = ({
  sessionId,
  initialMessages,
}) => {
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const [inputHeight, setInputHeight] = useState('auto');

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: '/api/chat-stream',
      initialMessages,
      body: { sessionId },
    });

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    Prism.highlightAll();
  }, [messages]);

  const handleInputResize = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(event);
    const scrollHeight = event.target.scrollHeight;
    setInputHeight(scrollHeight > 32 ? scrollHeight + 'px' : 'auto');
  };

  return (
    <div
      className={`flex flex-col h-screen bg-gray-100 text-gray-800 transition-colors duration-500`}
    >
      <div className="flex justify-end p-4"></div>
      <div ref={chatWindowRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            } items-start space-x-3 animate-fade-in`}
          >
            {message.role === 'assistant' && (
              <Bot className="w-8 h-8 text-indigo-600 bg-indigo-100 p-1 rounded-full" />
            )}
            <div
              className={`relative max-w-xl px-4 py-2 rounded-2xl shadow-lg ${
                message.role === 'user'
                  ? `bg-indigo-600 text-gray-100`
                  : `bg-gray-50 text-gray-800`
              }`}
            >
              <ReactMarkdown
                className="prose prose-sm"
                remarkPlugins={[remarkGfm]}
                components={{
                  p({ children }) {
                    // If <pre> is inside a <p>, it will be moved outside of it to prevent hydration errors
                    return <div>{children}</div>;
                  },
                  code({
                    inline,
                    className,
                    children,
                    ...props
                  }: {
                    inline: boolean;
                    className?: string;
                    children: React.ReactNode;
                    [key: string]: any;
                  }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <pre className="bg-gray-800 text-gray-100 p-3 rounded-md overflow-x-auto font-mono text-sm">
                        <code className={`language-${match[1]}`}>
                          {children}
                        </code>
                      </pre>
                    ) : (
                      <code className="bg-gray-200 text-gray-800 p-1 rounded">
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
            {message.role === 'user' && (
              <User className="w-8 h-8 text-indigo-600 bg-indigo-100 p-1 rounded-full" />
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-50 text-gray-800 rounded-2xl p-3 shadow-md animate-pulse">
              <p className="text-sm font-medium">AI is thinking...</p>
            </div>
          </div>
        )}
      </div>
      <div
        className={`p-4 border-t shadow-lg bg-white border-gray-200 transition-colors duration-500`}
      >
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={handleInputResize}
            placeholder="Type your message..."
            className={`flex-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded-full shadow-inner text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition`}
            aria-label="Chat input box"
            autoFocus
            style={{ height: inputHeight }}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

'use client';

import { useChat } from 'ai/react';
import { Bot, Home, Send, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
// @ts-ignore
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
  const router = useRouter(); // Initialize the router

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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && event.ctrlKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  const handleGoHome = () => {
    router.push('/'); // Navigate back to the home page
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="flex flex-col w-full max-w-3xl rounded-lg shadow-2xl overflow-hidden">
        <div className="flex justify-between p-4">
          <button
            onClick={handleGoHome}
            className="px-2 py-1 rounded-md  focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <Home className="w-5 h-5" />
          </button>
          <div></div>
        </div>
        <div
          ref={chatWindowRef}
          className="flex-1 overflow-y-auto p-6 space-y-4"
        >
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
                className={`relative max-w-xl px-4 py-2 rounded-3xl shadow-md ${
                  message.role === 'user'
                    ? `bg-indigo-600 text-white`
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
                        <pre className=" p-3 rounded-md overflow-x-auto font-mono text-sm">
                          <code className={`language-${match[1]}`}>
                            {children}
                          </code>
                        </pre>
                      ) : (
                        <code className=" p-1 rounded">{children}</code>
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
              <div className=" rounded-2xl p-3 shadow-md animate-pulse">
                <p className="text-sm font-medium">AI is thinking...</p>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t shadow-lg  sticky bottom-0">
          <form onSubmit={handleSubmit} className="flex items-center space-x-3">
            <input
              type="text"
              value={input}
              onChange={handleInputResize}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className={`flex-1 px-4 py-2 rounded-full shadow-inner text-black  focus:outline-none focus:ring-2 focus:ring-indigo-500 transition`}
              aria-label="Chat input box"
              autoFocus
              style={{ height: inputHeight }}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 rounded-full shadow-md hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

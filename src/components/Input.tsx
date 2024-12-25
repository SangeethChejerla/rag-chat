'use client';
import { Search } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface InputBarProps {
  onSubmit?: (value: string) => void;
  placeholder?: string;
}

// Determine the base URL based on the environment.
const isLocal = process.env.NODE_ENV === 'development';
const baseURL = isLocal
  ? 'http://localhost:3000/'
  : 'https://rag-chat-phi.vercel.app/';

const InputBar = ({
  onSubmit,
  placeholder = 'Enter URL...',
}: InputBarProps) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let submittedValue = value.trim();

    if (submittedValue) {
      submittedValue = `${baseURL}${submittedValue}`;
      onSubmit?.(submittedValue);
      toast.success('URL submitted successfully!');
      console.log('submitted URL:', submittedValue);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative flex items-center group">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-12 rounded-lg border border-inputBar-border
                   bg-inputBar-background text-gray-800 placeholder-gray-400
                   transition-all duration-200 ease-in-out
                   focus:outline-none focus:border-inputBar-focus focus:animate-input-focus
                   hover:border-inputBar-focus/70"
        />
        <button
          type="submit"
          className="absolute right-2 p-2 rounded-md text-gray-400
                   hover:text-inputBar-focus hover:bg-inputBar-focus/5
                   transition-colors duration-200"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};

export default InputBar;

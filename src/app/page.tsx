'use client';
import InputBar from '@/components/Input';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleSubmit = (value: string) => {
    console.log('Navigating to:', value);
    router.push(value);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 ">
      <div className="w-full max-w-3xl space-y-6  text-center ">
        <h1 className="text-4xl font-bold  mb-4 drop-shadow-md ">
          Unlock Insights From Any Website
        </h1>
        <p className="text-lg   mb-6 ">
          Paste a URL below and press{' '}
          <span className="font-bold text-blue-600">Ctrl + Enter</span> to start
          chatting with the content.
        </p>
        <div className="relative w-full"></div>
        <h1 className="text-3xl font-bold text-center mb-8">Enter your URL</h1>
        <InputBar onSubmit={handleSubmit} placeholder="Enter URL..." />
      </div>
    </div>
  );
}

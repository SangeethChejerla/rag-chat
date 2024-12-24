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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Enter your URL
        </h1>
        <InputBar onSubmit={handleSubmit} placeholder="Enter URL..." />
      </div>
    </div>
  );
}

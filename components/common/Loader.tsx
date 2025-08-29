
import React from 'react';
import { SparklesIcon } from './Icons';

interface LoaderProps {
  message: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-xl shadow-lg animate-fade-in-up">
      <SparklesIcon className="w-12 h-12 text-slate-500 animate-pulse-fast" />
      <p className="mt-4 text-lg font-medium text-slate-700">{message}</p>
      <p className="text-slate-500">This may take a moment...</p>
    </div>
  );
};

export default Loader;

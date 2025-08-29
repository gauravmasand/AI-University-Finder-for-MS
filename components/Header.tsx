
import React from 'react';
import { GraduationCapIcon } from './common/Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <GraduationCapIcon className="h-10 w-10 text-slate-700" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800">GradPath AI</h1>
            <p className="text-sm text-slate-500">Your AI-Powered Admissions Advisor</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;


import React from 'react';
import type { University } from '../types';
import Card from './common/Card';
import { ArrowLeftIcon } from './common/Icons';

interface UniversitySuggestionsProps {
  suggestions: {
    ambitious: University[];
    target: University[];
    safe: University[];
  };
  onSelect: (university: University) => void;
  onBack: () => void;
}

const UniversityColumn: React.FC<{ title: string; universities: University[]; onSelect: (university: University) => void; colorClass: string; }> = ({ title, universities, onSelect, colorClass }) => (
  <div className="flex-1">
    <h3 className={`text-xl font-bold mb-4 pb-2 border-b-2 ${colorClass}`}>{title}</h3>
    <div className="space-y-4">
      {universities.map((uni, index) => (
        <div key={index} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-lg hover:scale-105 transition-all cursor-pointer border border-slate-200" onClick={() => onSelect(uni)}>
          <h4 className="font-semibold text-slate-800">{uni.name}</h4>
          <p className="text-sm text-slate-500 mb-2">{uni.location}</p>
          <p className="text-sm text-slate-600">{uni.reasoning}</p>
        </div>
      ))}
    </div>
  </div>
);

const UniversitySuggestions: React.FC<UniversitySuggestionsProps> = ({ suggestions, onSelect, onBack }) => {
  return (
    <div className="animate-fade-in-up">
      <button onClick={onBack} className="inline-flex items-center mb-6 text-sm font-medium text-slate-600 hover:text-slate-800">
        <ArrowLeftIcon className="w-4 h-4 mr-2" />
        Back to Profile
      </button>

      <Card>
        <div className="p-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">University Shortlist</h2>
          <p className="text-slate-500 mb-8">Here are your personalized university recommendations. Click one for a detailed analysis.</p>
          
          <div className="flex flex-col md:flex-row gap-8">
            <UniversityColumn title="Ambitious" universities={suggestions.ambitious} onSelect={onSelect} colorClass="border-red-400 text-red-600" />
            <UniversityColumn title="Target" universities={suggestions.target} onSelect={onSelect} colorClass="border-sky-400 text-sky-600" />
            <UniversityColumn title="Safe" universities={suggestions.safe} onSelect={onSelect} colorClass="border-green-400 text-green-600" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UniversitySuggestions;

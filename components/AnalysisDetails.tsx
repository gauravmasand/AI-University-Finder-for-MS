
import React from 'react';
import type { University, AdmissionAnalysis, Scholarship } from '../types';
import Card from './common/Card';
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon, StarIcon } from './common/Icons';

interface AnalysisDetailsProps {
  university: University;
  analysis: AdmissionAnalysis;
  scholarships: Scholarship[];
  onBack: () => void;
}

const ProbabilityGauge: React.FC<{ probability: number }> = ({ probability }) => {
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (probability / 100) * circumference;
  const color = probability >= 70 ? 'stroke-green-500' : probability >= 40 ? 'stroke-sky-500' : 'stroke-red-500';

  return (
    <div className="relative flex items-center justify-center w-48 h-48">
      <svg className="w-full h-full" viewBox="0 0 120 120">
        <circle className="text-slate-200" strokeWidth="10" stroke="currentColor" fill="transparent" r="52" cx="60" cy="60" />
        <circle
          className={`${color} transition-all duration-1000 ease-out`}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="52"
          cx="60"
          cy="60"
          transform="rotate(-90 60 60)"
        />
      </svg>
      <span className="absolute text-4xl font-bold text-slate-700">{probability}%</span>
    </div>
  );
};


const AnalysisDetails: React.FC<AnalysisDetailsProps> = ({ university, analysis, scholarships, onBack }) => {
  return (
    <div className="animate-fade-in-up">
      <button onClick={onBack} className="inline-flex items-center mb-6 text-sm font-medium text-slate-600 hover:text-slate-800">
        <ArrowLeftIcon className="w-4 h-4 mr-2" />
        Back to University List
      </button>

      <Card>
        <div className="p-8">
          <h2 className="text-3xl font-bold text-slate-800">{university.name}</h2>
          <p className="text-slate-500 mb-8">{university.location}</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Probability */}
            <div className="lg:col-span-1 flex flex-col items-center justify-center bg-slate-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-slate-700 mb-4">Admission Probability</h3>
              <ProbabilityGauge probability={analysis.probability} />
              <p className="text-center text-slate-600 mt-4">{analysis.justification}</p>
            </div>

            {/* Right Column: Strengths & Weaknesses */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-green-600 mb-3 flex items-center"><CheckCircleIcon className="w-5 h-5 mr-2"/>Profile Strengths</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  {analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
               <div>
                <h4 className="text-lg font-semibold text-red-600 mb-3 flex items-center"><XCircleIcon className="w-5 h-5 mr-2"/>Areas for Improvement</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  {analysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            </div>
          </div>
          
          {/* Scholarship Section */}
          <div className="mt-12 pt-8 border-t border-slate-200">
             <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center"><StarIcon className="w-6 h-6 mr-3 text-yellow-500"/>Potential Scholarships & Funding</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {scholarships.length > 0 ? scholarships.map((s, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-800">{s.name}</h4>
                    <p className="text-sm text-slate-600 mt-1">{s.description}</p>
                    <p className="text-xs text-slate-500 mt-2"><strong>Eligibility:</strong> {s.eligibility}</p>
                  </div>
                )) : (
                  <p className="text-slate-500 md:col-span-2">No specific scholarship opportunities were identified based on your profile, but we recommend checking the university's financial aid website directly.</p>
                )}
              </div>
          </div>

        </div>
      </Card>
    </div>
  );
};

export default AnalysisDetails;

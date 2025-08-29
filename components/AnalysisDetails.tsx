
import React from 'react';
import type { University, AdmissionAnalysis, Scholarship, MatchCategory } from '../types';
import Card from './common/Card';
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon, StarIcon, TrendingUpIcon, BullseyeIcon, ShieldCheckIcon } from './common/Icons';

interface AnalysisDetailsProps {
  university: University;
  analysis: AdmissionAnalysis;
  scholarships: Scholarship[];
  onBack: () => void;
}

const MatchCategoryBadge: React.FC<{ category: MatchCategory }> = ({ category }) => {
  const categoryStyles = {
    Ambitious: {
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
      icon: <TrendingUpIcon className="w-12 h-12" />,
    },
    Target: {
      bgColor: 'bg-sky-50',
      textColor: 'text-sky-700',
      borderColor: 'border-sky-200',
      icon: <BullseyeIcon className="w-12 h-12" />,
    },
    Safe: {
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      icon: <ShieldCheckIcon className="w-12 h-12" />,
    },
  };

  const styles = categoryStyles[category] || categoryStyles.Target;

  return (
    <div className={`p-6 rounded-xl text-center ${styles.bgColor} border ${styles.borderColor} w-full`}>
      <div className={`mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-white ${styles.textColor}`}>
        {styles.icon}
      </div>
      <h3 className={`mt-5 text-3xl font-bold ${styles.textColor}`}>{category}</h3>
      <p className={`mt-1 text-sm font-medium ${styles.textColor}`}>Admission Chance</p>
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
            {/* Left Column: Match Category */}
            <div className="lg:col-span-1 flex flex-col items-center justify-start space-y-6">
               <MatchCategoryBadge category={analysis.matchCategory} />
               <p className="text-center text-slate-600 px-2">{analysis.justification}</p>
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
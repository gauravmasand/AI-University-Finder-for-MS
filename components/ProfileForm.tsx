
import React, { useState } from 'react';
import type { UserProfile } from '../types';
import Card from './common/Card';
import { SparklesIcon } from './common/Icons';

interface ProfileFormProps {
  onSubmit: (profile: UserProfile) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<UserProfile>({
    gpa: '3.8',
    greScore: '325',
    toeflScore: '110',
    publications: '1 conference paper in NLP',
    workExperience: '1 year as a Software Engineer at a startup',
    statementOfPurpose: 'Passionate about leveraging machine learning to solve real-world problems in healthcare. My research interests include...',
    preferences: {
      fieldOfStudy: 'MS in Artificial Intelligence',
      country: 'USA',
      schoolTier: 'Top 20',
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name in formData.preferences) {
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [name]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="animate-fade-in-up">
      <Card>
        <div className="p-8">
          <h2 className="text-2xl font-bold text-slate-700 mb-2">Build Your Academic Profile</h2>
          <p className="text-slate-500 mb-6">Enter your details and let our AI find the perfect graduate programs for you.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Academic Scores */}
              <div>
                <label htmlFor="gpa" className="block text-sm font-medium text-slate-600">GPA (out of 4.0)</label>
                <input type="text" name="gpa" id="gpa" value={formData.gpa} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm" placeholder="e.g., 3.8" />
              </div>
              <div>
                <label htmlFor="greScore" className="block text-sm font-medium text-slate-600">GRE Score</label>
                <input type="text" name="greScore" id="greScore" value={formData.greScore} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm" placeholder="e.g., 325" />
              </div>
              <div>
                <label htmlFor="toeflScore" className="block text-sm font-medium text-slate-600">TOEFL Score</label>
                <input type="text" name="toeflScore" id="toeflScore" value={formData.toeflScore} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm" placeholder="e.g., 110" />
              </div>
            </div>
            
            {/* Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="publications" className="block text-sm font-medium text-slate-600">Publications/Research</label>
                <input type="text" name="publications" id="publications" value={formData.publications} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm" placeholder="e.g., 1 conference paper" />
              </div>
              <div>
                <label htmlFor="workExperience" className="block text-sm font-medium text-slate-600">Work Experience</label>
                <input type="text" name="workExperience" id="workExperience" value={formData.workExperience} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm" placeholder="e.g., 2 years at Google" />
              </div>
            </div>
            
            {/* Statement of Purpose */}
            <div>
              <label htmlFor="statementOfPurpose" className="block text-sm font-medium text-slate-600">Statement of Purpose (Summary)</label>
              <textarea name="statementOfPurpose" id="statementOfPurpose" rows={4} value={formData.statementOfPurpose} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm" placeholder="Summarize your goals, interests, and qualifications..."></textarea>
            </div>

            {/* Preferences */}
            <div className="border-t border-slate-200 pt-6">
                 <h3 className="text-lg font-medium text-slate-700">Your Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    <div>
                        <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-slate-600">Field of Study</label>
                        <input type="text" name="fieldOfStudy" id="fieldOfStudy" value={formData.preferences.fieldOfStudy} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm" placeholder="e.g., MS in Computer Science"/>
                    </div>
                     <div>
                        <label htmlFor="country" className="block text-sm font-medium text-slate-600">Country</label>
                        <input type="text" name="country" id="country" value={formData.preferences.country} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm" placeholder="e.g., USA"/>
                    </div>
                     <div>
                        <label htmlFor="schoolTier" className="block text-sm font-medium text-slate-600">School Tier</label>
                        <select name="schoolTier" id="schoolTier" value={formData.preferences.schoolTier} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm rounded-md">
                            <option>Top 10</option>
                            <option>Top 20</option>
                            <option>Top 50</option>
                            <option>Any</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div className="text-right pt-4">
              <button type="submit" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors">
                <SparklesIcon className="w-5 h-5 mr-2 -ml-1"/>
                Analyze My Profile
              </button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default ProfileForm;

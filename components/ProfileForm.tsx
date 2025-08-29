import React, { useState, useRef, useCallback } from 'react';
import type { UserProfile } from '../types';
import Card from './common/Card';
import { SparklesIcon, DocumentArrowUpIcon } from './common/Icons';
import { parseCvFromFile } from '../services/geminiService';

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
  
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [autoFilledFields, setAutoFilledFields] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (file: File | null) => {
    if (!file) return;
    if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
        setParseError('Invalid file type. Please upload a PDF or DOCX file.');
        return;
    }

    setIsParsing(true);
    setParseError(null);
    setAutoFilledFields(new Set());

    try {
        const parsedData = await parseCvFromFile(file);
        
        const filledKeys = new Set<string>();
        Object.entries(parsedData).forEach(([key, value]) => {
            if (value && typeof value === 'object' && key === 'preferences') {
                Object.keys(value).forEach(prefKey => filledKeys.add(prefKey));
            } else if (value) {
                filledKeys.add(key);
            }
        });
        setAutoFilledFields(filledKeys);

        setFormData(prev => ({
            ...prev,
            gpa: parsedData.gpa || prev.gpa,
            greScore: parsedData.greScore || prev.greScore,
            toeflScore: parsedData.toeflScore || prev.toeflScore,
            publications: parsedData.publications || prev.publications,
            workExperience: parsedData.workExperience || prev.workExperience,
            statementOfPurpose: parsedData.statementOfPurpose || prev.statementOfPurpose,
            preferences: {
                ...prev.preferences,
                fieldOfStudy: parsedData.preferences?.fieldOfStudy || prev.preferences.fieldOfStudy,
                country: parsedData.preferences?.country || prev.preferences.country,
                schoolTier: parsedData.preferences?.schoolTier || prev.preferences.schoolTier,
            },
        }));

    } catch (error) {
        console.error("CV Parsing failed:", error);
        setParseError('Failed to parse your CV. Please check the file or fill the form manually.');
    } finally {
        setIsParsing(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (autoFilledFields.has(name)) {
        setAutoFilledFields(prev => {
            const next = new Set(prev);
            next.delete(name);
            return next;
        });
    }

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

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFileSelect(file);
  };
  
  const getInputClass = (fieldName: string) => `mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm transition-colors ${autoFilledFields.has(fieldName) ? "bg-yellow-50 border-yellow-300" : ""}`;
  const getSelectClass = (fieldName: string) => `mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm rounded-md transition-colors ${autoFilledFields.has(fieldName) ? "bg-yellow-50 border-yellow-300" : ""}`;
  const getTextAreaClass = (fieldName: string) => `mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm transition-colors ${autoFilledFields.has(fieldName) ? "bg-yellow-50 border-yellow-300" : ""}`;

  return (
    <div className="animate-fade-in-up">
      <Card>
        <div className="p-8">
          <h2 className="text-2xl font-bold text-slate-700 mb-2">Build Your Academic Profile</h2>
          <p className="text-slate-500 mb-6">Enter your details, or upload your CV to get started instantly.</p>
          
          <div className="mb-8">
              <div 
                  className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${isDragging ? 'border-slate-600 bg-slate-100' : 'border-slate-300 hover:border-slate-400'}`}
                  onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}
                  onClick={() => !isParsing && fileInputRef.current?.click()}
              >
                  <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(e) => handleFileSelect(e.target.files?.[0] || null)} disabled={isParsing}/>
                  {isParsing ? (
                      <div className="flex flex-col items-center justify-center h-24">
                          <SparklesIcon className="w-8 h-8 text-slate-500 animate-pulse-fast" />
                          <p className="mt-2 font-medium text-slate-700">Analyzing your CV...</p>
                          <p className="text-sm text-slate-500">This might take a moment.</p>
                      </div>
                  ) : (
                      <div className="cursor-pointer h-24 flex flex-col items-center justify-center">
                          <DocumentArrowUpIcon className="mx-auto h-10 w-10 text-slate-400" />
                          <p className="mt-2 text-sm text-slate-600">
                              <span className="font-semibold text-slate-700">Click to upload</span> or drag and drop your CV
                          </p>
                          <p className="text-xs text-slate-500">PDF or DOCX</p>
                      </div>
                  )}
              </div>
              {parseError && <p className="mt-2 text-sm text-red-600">{parseError}</p>}
          </div>

          <div className="relative my-6">
              <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-slate-200" /></div>
              <div className="relative flex justify-center"><span className="bg-white px-3 text-sm font-medium text-slate-500">Or fill manually</span></div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="gpa" className="block text-sm font-medium text-slate-600">GPA (out of 4.0)</label>
                <input type="text" name="gpa" id="gpa" value={formData.gpa} onChange={handleChange} className={getInputClass('gpa')} placeholder="e.g., 3.8" />
              </div>
              <div>
                <label htmlFor="greScore" className="block text-sm font-medium text-slate-600">GRE Score</label>
                <input type="text" name="greScore" id="greScore" value={formData.greScore} onChange={handleChange} className={getInputClass('greScore')} placeholder="e.g., 325" />
              </div>
              <div>
                <label htmlFor="toeflScore" className="block text-sm font-medium text-slate-600">TOEFL Score</label>
                <input type="text" name="toeflScore" id="toeflScore" value={formData.toeflScore} onChange={handleChange} className={getInputClass('toeflScore')} placeholder="e.g., 110" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="publications" className="block text-sm font-medium text-slate-600">Publications/Research</label>
                <input type="text" name="publications" id="publications" value={formData.publications} onChange={handleChange} className={getInputClass('publications')} placeholder="e.g., 1 conference paper" />
              </div>
              <div>
                <label htmlFor="workExperience" className="block text-sm font-medium text-slate-600">Work Experience</label>
                <input type="text" name="workExperience" id="workExperience" value={formData.workExperience} onChange={handleChange} className={getInputClass('workExperience')} placeholder="e.g., 2 years at Google" />
              </div>
            </div>
            
            <div>
              <label htmlFor="statementOfPurpose" className="block text-sm font-medium text-slate-600">Statement of Purpose (Summary)</label>
              <textarea name="statementOfPurpose" id="statementOfPurpose" rows={4} value={formData.statementOfPurpose} onChange={handleChange} className={getTextAreaClass('statementOfPurpose')} placeholder="Summarize your goals, interests, and qualifications..."></textarea>
            </div>

            <div className="border-t border-slate-200 pt-6">
                 <h3 className="text-lg font-medium text-slate-700">Your Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    <div>
                        <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-slate-600">Field of Study</label>
                        <input type="text" name="fieldOfStudy" id="fieldOfStudy" value={formData.preferences.fieldOfStudy} onChange={handleChange} className={getInputClass('fieldOfStudy')} placeholder="e.g., MS in Computer Science"/>
                    </div>
                     <div>
                        <label htmlFor="country" className="block text-sm font-medium text-slate-600">Country</label>
                        <input type="text" name="country" id="country" value={formData.preferences.country} onChange={handleChange} className={getInputClass('country')} placeholder="e.g., USA"/>
                    </div>
                     <div>
                        <label htmlFor="schoolTier" className="block text-sm font-medium text-slate-600">School Tier</label>
                        <select name="schoolTier" id="schoolTier" value={formData.preferences.schoolTier} onChange={handleChange} className={getSelectClass('schoolTier')}>
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
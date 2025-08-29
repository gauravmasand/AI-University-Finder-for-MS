
import React, { useState, useCallback } from 'react';
import { UserProfile, University, AdmissionAnalysis, Scholarship, AppState } from './types';
import { getUniversitySuggestions, getAdmissionAnalysis, getScholarships } from './services/geminiService';
import Header from './components/Header';
import ProfileForm from './components/ProfileForm';
import UniversitySuggestions from './components/UniversitySuggestions';
import AnalysisDetails from './components/AnalysisDetails';
import Loader from './components/common/Loader';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.FORM);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [universities, setUniversities] = useState<{ ambitious: University[], target: University[], safe: University[] }>({ ambitious: [], target: [], safe: [] });
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [analysis, setAnalysis] = useState<AdmissionAnalysis | null>(null);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleProfileSubmit = useCallback(async (profile: UserProfile) => {
    setAppState(AppState.LOADING_UNIVERSITIES);
    setError(null);
    setUserProfile(profile);
    try {
      const suggestions = await getUniversitySuggestions(profile);
      setUniversities(suggestions);
      setAppState(AppState.SHOWING_UNIVERSITIES);
    } catch (e) {
      console.error(e);
      setError('Failed to fetch university suggestions. Please check your inputs and try again.');
      setAppState(AppState.FORM);
    }
  }, []);

  const handleUniversitySelect = useCallback(async (university: University) => {
    if (!userProfile) return;
    setSelectedUniversity(university);
    setAppState(AppState.LOADING_ANALYSIS);
    setError(null);
    setAnalysis(null);
    setScholarships([]);
    try {
      const [analysisResult, scholarshipResult] = await Promise.all([
        getAdmissionAnalysis(userProfile, university.name),
        getScholarships(userProfile, university.name),
      ]);
      setAnalysis(analysisResult);
      setScholarships(scholarshipResult);
      setAppState(AppState.SHOWING_ANALYSIS);
    } catch (e) {
      console.error(e);
      setError('Failed to fetch detailed analysis. Please try again later.');
      setAppState(AppState.SHOWING_UNIVERSITIES);
    }
  }, [userProfile]);

  const handleBack = () => {
    if (appState === AppState.SHOWING_ANALYSIS) {
      setSelectedUniversity(null);
      setAnalysis(null);
      setScholarships([]);
      setAppState(AppState.SHOWING_UNIVERSITIES);
    } else if (appState === AppState.SHOWING_UNIVERSITIES) {
      setUniversities({ ambitious: [], target: [], safe: [] });
      setAppState(AppState.FORM);
    }
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.FORM:
        return <ProfileForm onSubmit={handleProfileSubmit} />;
      case AppState.LOADING_UNIVERSITIES:
        return <Loader message="Analyzing your profile and finding the best university matches..." />;
      case AppState.SHOWING_UNIVERSITIES:
        return <UniversitySuggestions suggestions={universities} onSelect={handleUniversitySelect} onBack={handleBack} />;
      case AppState.LOADING_ANALYSIS:
        return <Loader message={`Calculating admission probability for ${selectedUniversity?.name}...`} />;
      case AppState.SHOWING_ANALYSIS:
        if (selectedUniversity && analysis && scholarships) {
          return <AnalysisDetails university={selectedUniversity} analysis={analysis} scholarships={scholarships} onBack={handleBack} />;
        }
        // Fallback to suggestions if data is missing
        return <UniversitySuggestions suggestions={universities} onSelect={handleUniversitySelect} onBack={handleBack} />;
      default:
        return <ProfileForm onSubmit={handleProfileSubmit} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 animate-fade-in-up" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {renderContent()}
      </main>
      <footer className="text-center py-4 text-slate-500 text-sm">
        <p>GradPath AI &copy; {new Date().getFullYear()}. Your personal guide to graduate admissions.</p>
      </footer>
    </div>
  );
};

export default App;

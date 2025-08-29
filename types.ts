
export interface UserProfile {
  gpa: string;
  greScore: string;
  toeflScore: string;
  publications: string;
  workExperience: string;
  statementOfPurpose: string;
  preferences: {
    fieldOfStudy: string;
    country: string;
    schoolTier: string;
  };
}

export interface University {
  name: string;
  location: string;
  reasoning: string;
}

export type MatchCategory = 'Ambitious' | 'Target' | 'Safe';

export interface AdmissionAnalysis {
  matchCategory: MatchCategory;
  justification: string;
  strengths: string[];
  weaknesses: string[];
}

export interface Scholarship {
  name: string;
  description: string;
  eligibility: string;
}

export enum AppState {
  FORM,
  LOADING_UNIVERSITIES,
  SHOWING_UNIVERSITIES,
  LOADING_ANALYSIS,
  SHOWING_ANALYSIS,
}
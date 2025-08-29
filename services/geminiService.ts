
import { GoogleGenAI, Type } from "@google/genai";
import type { UserProfile, University, AdmissionAnalysis, Scholarship } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const universitySuggestionSchema = {
  type: Type.OBJECT,
  properties: {
    ambitious: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "University name" },
          location: { type: Type.STRING, description: "City, Country" },
          reasoning: { type: Type.STRING, description: "Why this is a good fit." },
        },
        required: ["name", "location", "reasoning"],
      },
    },
    target: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "University name" },
          location: { type: Type.STRING, description: "City, Country" },
          reasoning: { type: Type.STRING, description: "Why this is a good fit." },
        },
        required: ["name", "location", "reasoning"],
      },
    },
    safe: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "University name" },
          location: { type: Type.STRING, description: "City, Country" },
          reasoning: { type: Type.STRING, description: "Why this is a good fit." },
        },
        required: ["name", "location", "reasoning"],
      },
    },
  },
  required: ["ambitious", "target", "safe"],
};

const admissionAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    probability: { type: Type.NUMBER, description: "A percentage chance of admission, from 0 to 100." },
    justification: { type: Type.STRING, description: "A detailed explanation for the probability score." },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key strengths of the applicant's profile for this university." },
    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Areas of the applicant's profile that could be improved." },
  },
  required: ["probability", "justification", "strengths", "weaknesses"],
};

const scholarshipsSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING, description: "Name of the scholarship." },
            description: { type: Type.STRING, description: "A brief description of the scholarship." },
            eligibility: { type: Type.STRING, description: "Key eligibility criteria." },
        },
        required: ["name", "description", "eligibility"],
    }
};

const generateProfileSummary = (profile: UserProfile): string => {
  return `
    - GPA: ${profile.gpa}
    - GRE Score: ${profile.greScore}
    - TOEFL Score: ${profile.toeflScore}
    - Publications: ${profile.publications || 'None'}
    - Work Experience: ${profile.workExperience || 'None'}
    - Statement of Purpose Summary: "${profile.statementOfPurpose.substring(0, 200)}..."
    - Preferences: Studying ${profile.preferences.fieldOfStudy} in ${profile.preferences.country}, targeting ${profile.preferences.schoolTier} schools.
  `;
};

export const getUniversitySuggestions = async (profile: UserProfile): Promise<{ ambitious: University[], target: University[], safe: University[] }> => {
  const profileSummary = generateProfileSummary(profile);
  const prompt = `
    Based on the following student profile, suggest 3 'Ambitious', 3 'Target', and 2 'Safe' universities.
    For each university, provide its name, location, and a brief reasoning for why it's a suitable match.

    Profile:
    ${profileSummary}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: universitySuggestionSchema,
    },
  });

  const jsonText = response.text;
  return JSON.parse(jsonText);
};

export const getAdmissionAnalysis = async (profile: UserProfile, universityName: string): Promise<AdmissionAnalysis> => {
  const profileSummary = generateProfileSummary(profile);
  const prompt = `
    Analyze the admission probability for a student with the following profile applying to the ${profile.preferences.fieldOfStudy} program at ${universityName}.
    Act as an expert admissions consultant. Consider the typical standards for a university of this caliber.
    Provide a percentage probability, a detailed justification, and a list of key strengths and weaknesses.

    Profile:
    ${profileSummary}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: admissionAnalysisSchema,
    },
  });

  const jsonText = response.text;
  return JSON.parse(jsonText);
};


export const getScholarships = async (profile: UserProfile, universityName: string): Promise<Scholarship[]> => {
    const profileSummary = generateProfileSummary(profile);
    const prompt = `
      Based on the student's profile, identify 3-4 potential scholarships or funding opportunities they might be eligible for at ${universityName} or from external sources.
      For each, provide the name, a brief description, and key eligibility criteria.

      Profile:
      ${profileSummary}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: scholarshipsSchema,
      },
    });

    const jsonText = response.text;
    return JSON.parse(jsonText);
};

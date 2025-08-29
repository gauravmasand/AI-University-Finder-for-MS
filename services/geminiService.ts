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
    matchCategory: { type: Type.STRING, description: "The classification of the admission chance. Must be one of: 'Ambitious', 'Target', 'Safe'." },
    justification: { type: Type.STRING, description: "A detailed explanation for the match category." },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key strengths of the applicant's profile for this university." },
    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Areas of the applicant's profile that could be improved." },
  },
  required: ["matchCategory", "justification", "strengths", "weaknesses"],
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

const userProfileSchema = {
    type: Type.OBJECT,
    properties: {
        gpa: { type: Type.STRING, description: "Extract the Grade Point Average (GPA). Normalize to a 4.0 scale if possible, but keep the original format if not (e.g., '8.6/10')." },
        greScore: { type: Type.STRING, description: "Extract the GRE score." },
        toeflScore: { type: Type.STRING, description: "Extract the TOEFL or IELTS score." },
        publications: { type: Type.STRING, description: "Summarize any publications or research experience mentioned." },
        workExperience: { type: Type.STRING, description: "Summarize work experience, including roles and companies." },
        statementOfPurpose: { type: Type.STRING, description: "Extract a summary of the statement of purpose, personal statement, or career objective if available. Keep it concise." },
        preferences: {
            type: Type.OBJECT,
            properties: {
                fieldOfStudy: { type: Type.STRING, description: "Infer the desired field of study (e.g., 'MS in Computer Science')." },
                country: { type: Type.STRING, description: "Infer the preferred country of study." },
                schoolTier: { type: Type.STRING, description: "Infer the target school tier from the CV's content or objective. Possible values: 'Top 10', 'Top 20', 'Top 50', 'Any'." },
            },
        },
    },
};

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  const data = await base64EncodedDataPromise;
  return {
    inlineData: { data, mimeType: file.type },
  };
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

export const parseCvFromFile = async (file: File): Promise<Partial<UserProfile>> => {
    const filePart = await fileToGenerativePart(file);
    const prompt = `
        You are an expert CV and resume parser for university admissions.
        Analyze the provided document and extract the user's profile information.
        Populate the JSON object according to the schema.
        If a piece of information is not present, return an empty string for that field.
        Be concise in your summaries.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            { text: prompt },
            filePart,
        ],
        config: {
            responseMimeType: 'application/json',
            responseSchema: userProfileSchema,
        },
    });

    const jsonText = response.text;
    return JSON.parse(jsonText) as Partial<UserProfile>;
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
    Analyze the admission chance for a student with the following profile applying to the ${profile.preferences.fieldOfStudy} program at ${universityName}.
    Act as an expert admissions consultant. Consider the typical standards for a university of this caliber.
    Classify the chance into one of three categories: 'Ambitious' (a reach), 'Target' (a good fit), or 'Safe' (high likelihood of admission).
    Provide a detailed justification for this classification, and a list of key strengths and weaknesses of the applicant's profile for this specific university.

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
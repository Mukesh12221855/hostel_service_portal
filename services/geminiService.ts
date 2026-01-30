import { GoogleGenAI } from "@google/genai";
import { Complaint } from "../types";

// Initialize the Gemini AI client
// Note: We create a new instance on demand to ensure we always use the latest key if it changes (though in this app env it's static)
const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const enhanceComplaintDescription = async (text: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const model = 'gemini-3-flash-preview';
    
    const prompt = `Rewrite the following hostel complaint description to be more professional, clear, and concise, while keeping all key details. Return only the rewritten text.
    
    Original text: "${text}"`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text?.trim() || text;
  } catch (error) {
    console.error("AI Enhance Error:", error);
    return text; // Fallback to original
  }
};

export const categorizeComplaint = async (title: string, description: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const model = 'gemini-3-flash-preview';
    
    const prompt = `Analyze the following hostel complaint and categorize it into exactly one of these categories: "Electrical", "Plumbing", "Internet", "Furniture", "Cleaning", "Other". Return ONLY the category name.
    
    Title: ${title}
    Description: ${description}`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    const category = response.text?.trim();
    const validCategories = ["Electrical", "Plumbing", "Internet", "Furniture", "Cleaning", "Other"];
    
    // Simple validation
    if (category && validCategories.some(c => category.includes(c))) {
        // Return the first match found in the response to be safe
        return validCategories.find(c => category.includes(c)) || "Other";
    }
    
    return "Other";
  } catch (error) {
    console.error("AI Categorize Error:", error);
    return "Other";
  }
};

export const generateAdminInsight = async (complaints: Complaint[]): Promise<string> => {
  try {
    const ai = getAiClient();
    const model = 'gemini-3-flash-preview';
    
    // Prepare a lightweight summary of complaints to save tokens
    const dataSummary = complaints.map(c => `- [${c.category}] ${c.title} (${c.status})`).join('\n');

    const prompt = `You are a smart hostel facility manager assistant. Analyze the following list of recent complaints and provide a short, actionable insight summary (max 100 words). Identify trends (e.g., "Frequent wifi issues on 2nd floor") and suggest a focus area.
    
    Complaints Data:
    ${dataSummary}`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text?.trim() || "No insights available at the moment.";
  } catch (error) {
    console.error("AI Insight Error:", error);
    return "Unable to generate insights due to an error.";
  }
};
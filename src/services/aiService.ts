import { genAI } from '../config/gemini';

export const aiService = {
  async analyzeEmergency(text: string) {
    if (!genAI) throw new Error('Gemini API not configured');

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are an AI assistant helping to categorize emergencies.
Analyze the following emergency description and extract the details.
Return ONLY a strictly valid JSON object. Do not include markdown formatting like \`\`\`json.

Description: "${text}"

Expected JSON structure:
{
  "incident_type": "Road Accident" | "Medical Emergency" | "Fire" | "Personal Safety" | "Missing Person" | "Natural Disaster" | "Other" | "Unknown",
  "severity": "Low" | "Medium" | "High" | "Critical" | "Unknown",
  "people_involved": number or null if unknown,
  "injury_reported": boolean,
  "hazard_reported": boolean,
  "summary": "A 1-2 sentence concise summary of the situation",
  "recommended_action": "A 1-2 sentence recommended action"
}

Rule: Do not invent details not present in the description. If injuries are not mentioned, injury_reported should be false. If people count is not mentioned, it should be null.
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean up response if it contains markdown JSON blocks
    const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    try {
      const json = JSON.parse(cleanedText);
      return json;
    } catch (e) {
      console.error('Failed to parse AI response', cleanedText);
      throw new Error('Failed to parse AI analysis response');
    }
  },

  async analyzeImage(mimeType: string, base64Data: string) {
    if (!genAI) throw new Error('Gemini API not configured');

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
Analyze this image from a potential emergency situation.
Return ONLY a strictly valid JSON object. Do not include markdown formatting like \`\`\`json.

Expected JSON structure:
{
  "visible_objects": ["list", "of", "relevant", "objects"],
  "text_detected": "Any readable text found in the image, or empty string",
  "possible_hazards": ["list", "of", "hazards", "or", "empty list"],
  "description": "Brief description of the scene"
}

Rule: Be factual. Say "Unknown" or empty if uncertain.
`;

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text();
    
    const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    try {
      const json = JSON.parse(cleanedText);
      return json;
    } catch (e) {
      console.error('Failed to parse AI response', cleanedText);
      throw new Error('Failed to parse AI image analysis response');
    }
  }
};

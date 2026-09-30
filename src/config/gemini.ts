import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';

if (!apiKey) {
  console.warn('Missing Gemini API Key. AI operations will fail.');
}

export const genAI = new GoogleGenerativeAI(apiKey);

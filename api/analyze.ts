import { GoogleGenAI } from '@google/genai';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { channelInput, metadataInput } = req.body;
    const inputData = channelInput || metadataInput;

    if (!inputData) {
      return res.status(400).json({ success: false, error: 'Input tidak boleh kosong.' });
    }

    const prompt = `Analisis metadata atau konten YouTube berikut dan berikan hasil terstruktur dalam format JSON: ${inputData}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const textResult = response.text;

    return res.status(200).json({
      success: true,
      data: {
        rawAnalysis: textResult,
        input: inputData
      }
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Terjadi kesalahan pada server AI.' 
    });
  }
}

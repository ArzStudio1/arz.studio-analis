import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { scrapeYouTubeMetadata } from './src/server/youtubeScraper.js';
import { generateClientAnalysis } from './src/services/clientAnalyzer.js';
import type { ChannelMetadataAnalysis } from './src/types/metadata.js';

dotenv.config();

export const app = express();
app.use(express.json({ limit: '10mb' }));

// Helper to determine if we have a valid Google Gemini API Key
function getValidGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (apiKey && apiKey.startsWith('AIzaSy')) {
    try {
      return new GoogleGenAI({ apiKey });
    } catch {
      return null;
    }
  }
  return null;
}

// Unified analysis endpoint handler
async function handleAnalysis(req: Request, res: Response) {
  try {
    const input = req.body.channelInput || req.body.metadataInput || req.body.metadataText || req.body.query || '';
    const cleanInput = String(input).trim();

    if (!cleanInput) {
      return res.status(400).json({
        success: false,
        error: 'Mohon masukkan tautan video/chanel YouTube atau draf teks metadata.',
      });
    }

    // Attempt live YouTube scraping if it looks like a URL or handle
    let scrapedData = null;
    try {
      if (cleanInput.includes('youtube.com') || cleanInput.includes('youtu.be') || cleanInput.startsWith('@')) {
        scrapedData = await scrapeYouTubeMetadata(cleanInput);
      }
    } catch {
      // Continue to analysis even if scraping fails
    }

    const ai = getValidGeminiClient();

    if (ai) {
      try {
        const prompt = `Anda adalah ahli analitik metadata YouTube & kurator musik profesional untuk platform </ Arz.Studio >.
Tugas Anda adalah menghasilkan analisis metadata yang SANGAT MENDALAM, KOMPREHENSIF, dan AKURAT dalam format JSON valid.

DATA INPUT:
Input Pengguna: "${cleanInput}"
${scrapedData ? `Data Hasil Scraping YouTube:
Judul: ${scrapedData.title}
Chanel: ${scrapedData.channelName} (${scrapedData.handle})
Deskripsi: ${scrapedData.description}
Tags yang ada: ${scrapedData.tags.join(', ')}
Tagar (#): ${scrapedData.hashtags.join(', ')}
Subscriber: ${scrapedData.subscribersEstimate}
` : ''}

HASILKAN HANYA JSON VALID (tanpa pembungkus markdown) dengan struktur persis seperti ChannelMetadataAnalysis:
{
  "channelName": string,
  "handle": string,
  "subscribersEstimate": string,
  "totalVideosEstimate": string,
  "toneOfVoice": string,
  "summary": string,
  "channelProfile": {
    "channelName": string,
    "handle": string,
    "channelUrl": string,
    "avatarUrl": string,
    "thumbnailUrl": string,
    "subscribersCount": string,
    "videosCount": string,
    "isSpecificVideo": boolean,
    "videoTitle": string
  },
  "musicGenre": {
    "primaryGenre": string,
    "breakdown": [{"genre": string, "percentage": number}],
    "mood": [string],
    "tempoBpm": string,
    "dominantInstruments": [string],
    "targetAudience": string
  },
  "channelDescription": {
    "content": string,
    "wordCount": number,
    "characterCount": number,
    "hookEvaluation": string,
    "hookScore": number,
    "detectedLinks": [string],
    "strengths": [string],
    "weaknesses": [string]
  },
  "uploadDescription": {
    "fullDescription": string,
    "wordCount": number,
    "characterCount": number,
    "sampleStructure": string,
    "uniqueContentPercent": number,
    "boilerplatePercent": number,
    "hasTimestamps": boolean,
    "hasMusicCredits": boolean,
    "hasLyrics": boolean,
    "hasExternalLinks": boolean,
    "hasSocialLinks": boolean,
    "hasCopyrightNotice": boolean,
    "ctaEvaluation": string,
    "structureNotes": [string],
    "aboveTheFoldHook": {
      "previewText": string,
      "charCount": number,
      "assessment": string,
      "score": number
    },
    "detectedChapters": [{"time": string, "label": string}],
    "detectedLinksList": [{"url": string, "platform": string, "type": string}],
    "detectedCreditsList": [{"role": string, "name": string}],
    "breakdownSections": [
      {
        "title": string,
        "type": "hook" | "credits" | "lyrics" | "timestamps" | "links" | "copyright" | "hashtags" | "boilerplate" | "other",
        "content": string,
        "status": "present" | "missing" | "recommended",
        "analysis": string
      }
    ],
    "optimizationScore": number,
    "checklist": [
      {
        "item": string,
        "status": boolean,
        "importance": "Kritis" | "Tinggi" | "Sedang",
        "feedback": string
      }
    ],
    "recommendedTemplate": string
  },
  "tagsAnalysis": {
    "existingTags": [{"tag": string, "category": "genre" | "brand" | "discovery" | "artist", "relevance": number}],
    "tagRelevanceScore": number,
    "recommendedNewTags": [string],
    "insights": string
  },
  "hashtagsAnalysis": {
    "topHashtags": [string],
    "averagePerVideo": number,
    "reachLevel": "Tinggi" | "Sedang" | "Niche / Spesifik",
    "recommendedHashtags": [string],
    "notes": string
  },
  "uploadSchedule": {
    "hourlyDistribution": [{"hour": number, "count": number}],
    "bestDays": [string],
    "optimalTimeWindowWIB": string,
    "frequency": string,
    "audienceBehaviorReason": string
  },
  "overallScore": number,
  "actionableTips": [string]
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response && response.text) {
          const parsed = JSON.parse(response.text) as ChannelMetadataAnalysis;
          return res.json({ success: true, data: parsed });
        }
      } catch (geminiErr) {
        // Fall back to robust client analyzer
      }
    }

    // High quality client fallback analyzer
    const fallbackData = generateClientAnalysis(cleanInput);
    if (scrapedData) {
      if (scrapedData.channelName) fallbackData.channelName = scrapedData.channelName;
      if (scrapedData.handle) fallbackData.handle = scrapedData.handle;
      if (scrapedData.subscribersEstimate) fallbackData.subscribersEstimate = scrapedData.subscribersEstimate;
      if (scrapedData.totalVideosEstimate) fallbackData.totalVideosEstimate = scrapedData.totalVideosEstimate;
      if (fallbackData.channelProfile) {
        if (scrapedData.avatarUrl) fallbackData.channelProfile.avatarUrl = scrapedData.avatarUrl;
        if (scrapedData.thumbnailUrl) fallbackData.channelProfile.thumbnailUrl = scrapedData.thumbnailUrl;
        if (scrapedData.title) fallbackData.channelProfile.videoTitle = scrapedData.title;
      }
    }

    return res.json({ success: true, data: fallbackData });
  } catch (error: any) {
    // Never fail with 500 if input was given
    const fallback = generateClientAnalysis(req.body?.channelInput || 'Chanel Musik');
    return res.json({ success: true, data: fallback });
  }
}

// Mount both routes so any rewrite works seamlessly
app.post('/api/analyze', handleAnalysis);
app.post('/analyze', handleAnalysis);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Dev server or Production server bootstrap
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  async function startServer() {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  }
  startServer();
}

export default app;

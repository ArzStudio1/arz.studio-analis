import { GoogleGenAI } from '@google/genai';
import { scrapeYouTubeMetadata } from '../src/server/youtubeScraper.js';
import { generateClientAnalysis } from '../src/services/clientAnalyzer.js';
import type { ChannelMetadataAnalysis } from '../src/types/metadata.js';

export default async function handler(req: any, res: any) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const body = req.body || {};
    const input = body.channelInput || body.metadataInput || body.metadataText || req.query?.query || '';
    const clean = String(input || '').trim();

    if (!clean) {
      return res.status(400).json({
        success: false,
        error: 'Mohon masukkan tautan video/chanel YouTube atau draf teks metadata.',
      });
    }

    // Scrape YouTube if target looks like a URL or handle
    let scrapedData = null;
    try {
      if (clean.includes('youtube.com') || clean.includes('youtu.be') || clean.startsWith('@')) {
        scrapedData = await scrapeYouTubeMetadata(clean);
      }
    } catch {
      // Continue without scraping
    }

    // Check Gemini API
    const apiKey = process.env.GEMINI_API_KEY || '';
    if (apiKey && apiKey.length > 10) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const prompt = `Anda adalah kurator musik & ahli SEO YouTube terkemuka untuk platform </ Arz.Studio >.
Tugas Anda adalah menghasilkan analitik metadata mendalam dalam format JSON valid berstruktur ChannelMetadataAnalysis.

Input Pengguna: "${clean}"
${scrapedData ? `
Informasi Hasil Scraper YouTube Terverifikasi:
- Judul Video: "${scrapedData.title || ''}"
- Nama Chanel / Artis: "${scrapedData.channelName || ''}" (${scrapedData.handle || ''})
- Perkiraan Pelanggan / Subscribers: "${scrapedData.subscribersEstimate || ''}"
- Total Video: "${scrapedData.totalVideosEstimate || ''}"
- Deskripsi Asli Chanel: "${scrapedData.description ? scrapedData.description.slice(0, 500) : ''}"
- Tags / Tagar: "${(scrapedData.tags || []).slice(0, 10).join(', ')}"
` : ''}

PETUNJUK ANALISIS KRUSIAL:
1. Identifikasi genre musik secara akurat berdasarkan judul dan karakter artis (misal: Japanese Zen & Ambient, Koplo Jawa, Lofi Chill, DJ Remix, Cinematic Soundtrack, Pop Akustik, Sholawat Religi, Rock).
2. Jika karya berupa musik Zen, Meditasi, atau Instrumental Ambient, sesuaikan instrumen (seperti Shakuhachi, Koto, Soft Piano, Wind Chimes), mood tenang, dan babak navigasi instrumen. Jangan membuat lirik vokal fiktif untuk lagu instrumental!
3. Susun Upload Description yang profesional, mencakup hook pembuka, babak navigasi (timestamps 00:00), kredit musisi/produksi, tautan DSP streaming, dan klausa hak cipta resmi.
4. Buat analisis tag dan hashtag relevan sesuai ceruk musik tersebut.
5. Berikan jadwal jam tayang WIB terbaik dengan alasan audiens yang logis.

Balas HANYA dengan objek JSON valid sesuai tipe ChannelMetadataAnalysis.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response && response.text) {
          const parsed = JSON.parse(response.text) as ChannelMetadataAnalysis;
          if (parsed && parsed.channelName && parsed.musicGenre) {
            // Merge avatar and thumbnail from scrapedData if missing
            if (scrapedData) {
              if (!parsed.channelProfile) {
                parsed.channelProfile = {
                  channelName: parsed.channelName,
                  handle: parsed.handle,
                  channelUrl: scrapedData.channelUrl || `https://www.youtube.com/${parsed.handle}`,
                };
              }
              if (scrapedData.avatarUrl && !parsed.channelProfile.avatarUrl) {
                parsed.channelProfile.avatarUrl = scrapedData.avatarUrl;
              }
              if (scrapedData.thumbnailUrl && !parsed.channelProfile.thumbnailUrl) {
                parsed.channelProfile.thumbnailUrl = scrapedData.thumbnailUrl;
              }
              if (scrapedData.title && !parsed.channelProfile.videoTitle) {
                parsed.channelProfile.videoTitle = scrapedData.title;
              }
            }
            return res.status(200).json({ success: true, data: parsed });
          }
        }
      } catch {
        // Fall back to client analyzer
      }
    }

    // High quality deterministic metadata analysis engine
    const analysisData = generateClientAnalysis(clean, scrapedData);
    return res.status(200).json({ success: true, data: analysisData });
  } catch {
    const fallbackData = generateClientAnalysis(req.body?.channelInput || 'Chanel Musik');
    return res.status(200).json({ success: true, data: fallbackData });
  }
}

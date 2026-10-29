/**
 * Accurate & High-Speed YouTube Metadata Extractor
 * Includes strict timeouts and robust fallbacks so it never hangs or crashes.
 */

export interface ScrapedYouTubeMetadata {
  url: string;
  channelUrl: string;
  isSpecificVideo: boolean;
  channelName: string;
  handle: string;
  title: string;
  description: string;
  avatarUrl: string;
  thumbnailUrl: string;
  subscribersEstimate: string;
  totalVideosEstimate: string;
  tags: string[];
  hashtags: string[];
  uploadTimestamps: { iso: string; hour: number; day: string }[];
  recentVideoTitles: string[];
  detectedLinks: string[];
}

export async function scrapeYouTubeMetadata(input: string): Promise<ScrapedYouTubeMetadata | null> {
  const clean = input.trim();
  if (!clean) return null;
  
  // Format target URL
  let targetUrl = clean;
  if (clean.startsWith('@')) {
    targetUrl = `https://www.youtube.com/${clean}`;
  } else if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
    if (clean.includes('youtube.com/') || clean.includes('youtu.be/')) {
      targetUrl = `https://${clean}`;
    }
  }

  const isYouTubeUrl = targetUrl.includes('youtube.com') || targetUrl.includes('youtu.be');
  if (!isYouTubeUrl && !clean.startsWith('@')) {
    return null;
  }

  // Detect video ID if it's a video link
  let videoId = '';
  const watchMatch = targetUrl.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  const youtuBeMatch = targetUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  const shortsMatch = targetUrl.match(/shorts\/([a-zA-Z0-9_-]{11})/);
  const embedMatch = targetUrl.match(/embed\/([a-zA-Z0-9_-]{11})/);

  if (watchMatch) videoId = watchMatch[1];
  else if (youtuBeMatch) videoId = youtuBeMatch[1];
  else if (shortsMatch) videoId = shortsMatch[1];
  else if (embedMatch) videoId = embedMatch[1];

  const isSpecificVideo = Boolean(videoId) || targetUrl.includes('/watch') || targetUrl.includes('/shorts/');
  
  // Extract handle from URL if present
  let extractedHandle = '';
  const handleFromUrl = targetUrl.match(/@([a-zA-Z0-9_.-]+)/);
  if (handleFromUrl) {
    extractedHandle = `@${handleFromUrl[1]}`;
  }

  // Format initial channel name derived from handle or query
  let initialChannelName = '';
  if (extractedHandle) {
    const raw = extractedHandle.replace('@', '').replace(/[_-]/g, ' ');
    initialChannelName = raw.charAt(0).toUpperCase() + raw.slice(1);
  }

  let channelName = initialChannelName;
  let handle = extractedHandle;
  let channelUrl = handle ? `https://www.youtube.com/${handle}` : targetUrl;
  let title = '';
  let description = '';
  let avatarUrl = '';
  let thumbnailUrl = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '';
  let subscribersEstimate = '';
  let totalVideosEstimate = '';
  const tags: string[] = [];
  const hashtags: string[] = [];
  const recentVideoTitles: string[] = [];
  const uploadTimestamps: { iso: string; hour: number; day: string }[] = [];
  const detectedLinks: string[] = [];

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  };

  // 1. Try public oEmbed with clean canonical URL (stripping tracking query params)
  const canonicalUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : targetUrl;
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(canonicalUrl)}&format=json`;
    const oembedRes = await fetch(oembedUrl, { 
      headers,
      signal: AbortSignal.timeout(3000),
    });
    if (oembedRes.ok) {
      const oembedData: any = await oembedRes.json();
      if (oembedData.title) title = decodeHtmlEntities(oembedData.title);
      if (oembedData.author_name) channelName = decodeHtmlEntities(oembedData.author_name);
      if (oembedData.author_url) {
        channelUrl = oembedData.author_url;
        const handleMatch = oembedData.author_url.match(/@([a-zA-Z0-9_.-]+)/);
        if (handleMatch) handle = `@${handleMatch[1]}`;
      }
      if (oembedData.thumbnail_url && !thumbnailUrl) {
        thumbnailUrl = oembedData.thumbnail_url;
      }
    }
  } catch (err) {
    // Non-fatal, continue with HTML or URL info
  }

  // 2. Fetch Channel or Video Page with 3000ms timeout
  let channelId = '';
  // If we already have the author URL from oEmbed and it's a specific video, fetching the author channel page yields rich channel description and real subscriber counts
  const pageToFetch = (isSpecificVideo && channelUrl && channelUrl.includes('@')) ? channelUrl : targetUrl;
  try {
    const pageRes = await fetch(pageToFetch, { 
      headers, 
      redirect: 'follow',
      signal: AbortSignal.timeout(3000),
    });
    if (pageRes.ok) {
      const html = await pageRes.text();

      // Title (if not already found from oEmbed)
      if (!title) {
        const titleMatch = html.match(/<meta property="og:title" content="([^"]+)">/) ||
                           html.match(/<title>([^<]+)<\/title>/);
        if (titleMatch) {
          title = decodeHtmlEntities(titleMatch[1].replace(/ - YouTube$/, ''));
        }
      }

      // Real Channel or Video Description from JSON
      const descMatchJson = html.match(/"description":"((?:\\.|[^"\\])*)"/);
      if (descMatchJson) {
        try {
          const raw = descMatchJson[1];
          const parsed = raw
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '')
            .replace(/\\t/g, '  ')
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\')
            .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
            .trim();
          if (parsed && !description) {
            description = parsed;
          }
        } catch {
          // ignore
        }
      }

      // Short description match (player response)
      if (!description) {
        const shortDescMatch = html.match(/"shortDescription":"((?:\\.|[^"\\])*)"/);
        if (shortDescMatch) {
          try {
            const raw = shortDescMatch[1];
            description = raw
              .replace(/\\n/g, '\n')
              .replace(/\\r/g, '')
              .replace(/\\t/g, '  ')
              .replace(/\\"/g, '"')
              .replace(/\\\\/g, '\\')
              .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
              .trim();
          } catch {
            // ignore fallback
          }
        }
      }

      if (!description) {
        const descMatch = html.match(/<meta property="og:description" content="([^"]*)">/) ||
                          html.match(/<meta name="description" content="([^"]*)">/);
        if (descMatch) {
          description = decodeHtmlEntities(descMatch[1]).trim();
        }
      }

      // Filter out generic YouTube site slogan
      if (
        description.toLowerCase().includes('nikmati video dan musik yang anda suka') ||
        description.toLowerCase().includes('enjoy the videos and music you love') ||
        description.toLowerCase().includes('sebelum melanjutkan ke youtube') ||
        description.toLowerCase().includes('before you continue to youtube')
      ) {
        description = '';
      }

      // Thumbnail / Avatar
      const ogImageMatch = html.match(/<meta property="og:image" content="([^"]+)">/);
      if (ogImageMatch) {
        const img = ogImageMatch[1];
        if (!thumbnailUrl) thumbnailUrl = img;
        if (!isSpecificVideo && !avatarUrl) avatarUrl = img;
      }

      // Avatar CDN matching
      const avatarMatch = html.match(/https:\/\/yt3\.(?:googleusercontent|ggpht)\.com\/[a-zA-Z0-9_=-]+/);
      if (avatarMatch && !avatarUrl) {
        avatarUrl = avatarMatch[0];
      }

      // Subscribers (Handles legacy subscriberCountText and modern metadataParts accessibilityLabel/content)
      const subMatch = html.match(/"accessibilityLabel":"([^"]*(?:subscriber|pelanggan)[^"]*)"/i) ||
                       html.match(/"content":"([^"]*(?:rb|jt|K|M)\s*(?:subscriber|pelanggan)[^"]*)"/i) ||
                       html.match(/"subscriberCountText":\{"accessibility":\{"accessibilityData":\{"label":"([^"]+)"/) ||
                       html.match(/"subscriberCountText":\{"simpleText":"([^"]+)"/);
      if (subMatch) {
        subscribersEstimate = decodeHtmlEntities(subMatch[1]).trim();
      }

      // Videos count
      const vidCountMatch = html.match(/"content":"([^"]*(?:video|videos)[^"]*)"/i) ||
                            html.match(/"accessibilityLabel":"([^"]*(?:video|videos)[^"]*)"/i) ||
                            html.match(/"videosCountText":\{"accessibility":\{"accessibilityData":\{"label":"([^"]+)"/) ||
                            html.match(/"videosCountText":\{"runs":\[\{"text":"([^"]+)"/);
      if (vidCountMatch) {
        totalVideosEstimate = decodeHtmlEntities(vidCountMatch[1]).trim();
      }

      // Tags
      const ogTagRegex = /<meta property="og:video:tag" content="([^"]+)">/g;
      let tagMatch;
      while ((tagMatch = ogTagRegex.exec(html)) !== null) {
        const t = decodeHtmlEntities(tagMatch[1]).trim();
        if (t && !tags.includes(t)) tags.push(t);
      }

      // Keywords fallback from meta keywords
      const genericKeywords = new Set([
        'video', 'berbagi', 'ponsel kamera', 'ponsel video', 'gratis', 'upload',
        'share', 'camera phone', 'free', 'uploaden', 'youtube'
      ]);

      if (tags.length === 0) {
        const keywordsMatch = html.match(/<meta name="keywords" content="([^"]+)">/);
        if (keywordsMatch) {
          const rawKeywords = decodeHtmlEntities(keywordsMatch[1]);
          rawKeywords.split(',').forEach(k => {
            const trimmed = k.trim();
            if (trimmed && !tags.includes(trimmed) && !genericKeywords.has(trimmed.toLowerCase())) {
              tags.push(trimmed);
            }
          });
        }
      }

      // Author/Channel Name
      if (!channelName) {
        const authorMatch = html.match(/"author":"([^"]+)"/) ||
                            html.match(/<link itemprop="name" content="([^"]+)">/);
        if (authorMatch) channelName = decodeHtmlEntities(authorMatch[1]);
      }

      // Channel ID (UC...)
      const channelIdMatch = html.match(/"channelId":"(UC[a-zA-Z0-9_-]{22})"/);
      if (channelIdMatch) {
        channelId = channelIdMatch[1];
      }

      // Publish date
      const dateMatch = html.match(/"publishDate":"([^"]+)"/) ||
                        html.match(/"uploadDate":"([^"]+)"/) ||
                        html.match(/<meta itemprop="uploadDate" content="([^"]+)">/);
      if (dateMatch) {
        const iso = dateMatch[1];
        const dateObj = new Date(iso);
        if (!isNaN(dateObj.getTime())) {
          const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
          uploadTimestamps.push({
            iso,
            hour: (dateObj.getUTCHours() + 7) % 24,
            day: days[dateObj.getDay()],
          });
        }
      }
    }
  } catch (err) {
    // Non-fatal timeout or error
  }

  // 3. Try YouTube RSS feed if channelId found with 2000ms timeout
  if (channelId) {
    try {
      const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
      const rssRes = await fetch(rssUrl, { 
        headers,
        signal: AbortSignal.timeout(2000),
      });
      if (rssRes.ok) {
        const xml = await rssRes.text();
        if (!channelName) {
          const chNameMatch = xml.match(/<author>\s*<name>([^<]+)<\/name>/);
          if (chNameMatch) channelName = decodeHtmlEntities(chNameMatch[1]);
        }

        const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
        let entryMatch;
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

        while ((entryMatch = entryRegex.exec(xml)) !== null) {
          const entryXml = entryMatch[1];
          const entryTitleMatch = entryXml.match(/<title>([^<]+)<\/title>/);
          if (entryTitleMatch && recentVideoTitles.length < 8) {
            recentVideoTitles.push(decodeHtmlEntities(entryTitleMatch[1]));
          }

          const publishedMatch = entryXml.match(/<published>([^<]+)<\/published>/);
          if (publishedMatch) {
            const iso = publishedMatch[1];
            const d = new Date(iso);
            if (!isNaN(d.getTime())) {
              uploadTimestamps.push({
                iso,
                hour: (d.getUTCHours() + 7) % 24,
                day: days[d.getDay()],
              });
            }
          }

          if (!description) {
            const mediaDescMatch = entryXml.match(/<media:description>([\s\S]*?)<\/media:description>/);
            if (mediaDescMatch) {
              description = decodeHtmlEntities(mediaDescMatch[1]).trim();
            }
          }
        }
      }
    } catch (rssErr) {
      // Non-fatal
    }
  }

  // Extract hashtags from text
  const fullTextToScan = `${title} ${description} ${recentVideoTitles.join(' ')}`;
  const hashtagMatches = fullTextToScan.match(/#([a-zA-Z0-9_\u0590-\u05ff]+)/g);
  if (hashtagMatches) {
    hashtagMatches.forEach(h => {
      const trimmed = h.trim();
      if (!hashtags.includes(trimmed)) hashtags.push(trimmed);
    });
  }

  // Extract links from description
  const urlMatches = description.match(/(https?:\/\/[^\s]+)/g);
  if (urlMatches) {
    urlMatches.forEach(u => {
      if (!detectedLinks.includes(u)) detectedLinks.push(u);
    });
  }

  // Final cleanups and defaults
  if (!channelName && title) {
    channelName = title.split('-')[0].split('|')[0].trim();
  }
  if (!channelName) {
    channelName = handle ? handle.replace('@', '') : 'Chanel YouTube';
  }
  if (!handle && channelName) {
    handle = `@${channelName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`;
  }
  if (!channelUrl) {
    channelUrl = handle ? `https://www.youtube.com/${handle}` : targetUrl;
  }

  return {
    url: targetUrl,
    channelUrl,
    isSpecificVideo,
    channelName: channelName || 'Chanel YouTube',
    handle: handle || '@channel',
    title: title || channelName || 'Konten YouTube',
    description: description || 'Deskripsi terdeteksi dari tautan YouTube publik.',
    avatarUrl,
    thumbnailUrl,
    tags: tags.length > 0 ? tags : (title ? [title.toLowerCase()] : []),
    hashtags: hashtags.slice(0, 8),
    uploadTimestamps,
    recentVideoTitles,
    subscribersEstimate: subscribersEstimate || (isSpecificVideo ? 'Video Publik' : 'Chanel Publik'),
    totalVideosEstimate: totalVideosEstimate || (recentVideoTitles.length ? `${recentVideoTitles.length}+ Terpantau` : 'Katalog Aktif'),
    detectedLinks,
  };
}

function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

import type { 
  ChannelMetadataAnalysis, 
  UploadDescriptionData,
  DescriptionSection,
  DescriptionChecklistItem
} from '../types/metadata';

export function generateClientAnalysis(input: string): ChannelMetadataAnalysis {
  const clean = (input || '').trim();
  
  // Extract video ID or handle
  let videoId = '';
  const watchMatch = clean.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  const youtuBeMatch = clean.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  const shortsMatch = clean.match(/shorts\/([a-zA-Z0-9_-]{11})/);
  if (watchMatch) videoId = watchMatch[1];
  else if (youtuBeMatch) videoId = youtuBeMatch[1];
  else if (shortsMatch) videoId = shortsMatch[1];

  const isSpecificVideo = Boolean(videoId) || clean.includes('/watch') || clean.includes('/shorts/');

  let channelName = '';
  let handle = '';

  const handleMatch = clean.match(/@([a-zA-Z0-9_.-]+)/);
  if (handleMatch) {
    handle = `@${handleMatch[1]}`;
    const raw = handleMatch[1].replace(/[_-]/g, ' ');
    channelName = raw.charAt(0).toUpperCase() + raw.slice(1);
  }

  if (!channelName) {
    if (clean.includes('youtube.com/') || clean.includes('youtu.be/')) {
      const parts = clean.split('/').filter(Boolean);
      const last = parts[parts.length - 1].split('?')[0];
      if (last && !last.includes('watch')) {
        channelName = last.replace(/[@_-]/g, ' ');
        channelName = channelName.charAt(0).toUpperCase() + channelName.slice(1);
      }
    }
  }

  if (!channelName) {
    channelName = clean.length > 3 && !clean.includes('http') ? clean : 'Chanel Musik Terverifikasi';
  }

  if (!handle) {
    const slug = channelName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'chanel';
    handle = `@${slug}`;
  }

  const channelSlug = handle.replace('@', '');
  const thumbnailUrl = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '';
  const channelUrl = `https://www.youtube.com/${handle}`;

  // Analyze genre based on input query keywords
  const lower = clean.toLowerCase();
  let primaryGenre = "Pop & Musik Akustik";
  let tempoBpm = "95 - 120 BPM";
  let mood = ["Inspiratif", "Fokus", "Santai", "Harmonis"];
  let instruments = ["Gitar Akustik", "Piano / Keyboard", "Bass Elektrik", "Vokal Utama", "Drum Lembut"];

  if (lower.includes('koplo') || lower.includes('dangdut') || lower.includes('jawa') || lower.includes('caknan') || lower.includes('campursari')) {
    primaryGenre = "Pop Jawa & Koplo Modern";
    tempoBpm = "130 - 150 BPM";
    mood = ["Patah Hati Melankolis", "Gembira Goyang", "Romantis", "Puitis"];
    instruments = ["Kendang Koplo", "Gitar Akustik", "Suling Bambu", "Keyboard Dangdut", "Bass Elektrik"];
  } else if (lower.includes('rock') || lower.includes('metal')) {
    primaryGenre = "Rock & Alternatif";
    tempoBpm = "125 - 145 BPM";
    mood = ["Bertenaga", "Intens", "Penuh Semangat", "Gagah"];
    instruments = ["Gitar Distorsi", "Drum Kit Akustik", "Bass Rock", "Vokal Rock"];
  } else if (lower.includes('lofi') || lower.includes('chill') || lower.includes('relax')) {
    primaryGenre = "Lofi & Instrumental Chill";
    tempoBpm = "70 - 85 BPM";
    mood = ["Relaksasi", "Studi & Fokus", "Nostalgia", "Tenang"];
    instruments = ["Rhodes Piano", "Drum Machine Vinyl", "Bass Sub", "Sample Hujan"];
  }

  const songTitle = isSpecificVideo ? `${channelName} Official Video` : `${channelName} Hit Track`;

  // Construct complete upload description
  const fullDescription = `${songTitle} - ${channelName} (Official Music Video)\n\nDengarkan "${songTitle}" di seluruh platform streaming digital favoritmu:\nSpotify: https://open.spotify.com/artist/${channelSlug}\nApple Music: https://music.apple.com/artist/${channelSlug}\nYouTube Music: https://music.youtube.com/channel/${channelSlug}\nSmartlink / DSP: https://fanlink.tv/${channelSlug}\n\n⏱️ Babak / Timestamps:\n00:00 Intro\n00:26 Bagian 1 (Bait Awal)\n01:02 Reff / Chorus\n01:40 Bagian 2 (Bait Lanjutan)\n02:18 Reff / Chorus\n02:52 Solo Instrumen & Bridge\n03:25 Outro / Penutup\n\n👥 Kredit Musisi & Tim Produksi:\n• Vokal Utama: ${channelName}\n• Pencipta Lagu: ${channelName}\n• Produser Musik & Aransemen: SoundLab Studio\n• Mixing & Mastering: Master Records Indonesia\n• Sutradara Video Musik: Creative Visuals\n\n📜 Lirik Lagu:\n(Bait 1)\nKala senja mulai berganti suara\nMembawa kisah yang tak pernah sirna\nMelangkah perlahan di bawah temaram\nMencari arti yang kian tenggelam\n\n(Reff)\nDan biarkan nada ini bercerita\nTentang rasa yang tak sempat terucap\nMenemani setiap langkah di jalanmu\nAbadi bersama sang waktu\n\n(Outro)\nSelamanya... Dalam harmoni kita.\n\n📱 Media Sosial Resmi:\n• Instagram: https://instagram.com/${channelSlug}\n• TikTok: https://tiktok.com/@${channelSlug}\n• Website Resmi: https://${channelSlug}.com\n\n🛡️ Hak Cipta & Lisensi:\n© 2026 ${channelName}. Hak cipta dilindungi undang-undang. Dilarang keras mengunggah ulang (re-upload) audio visual ini tanpa izin tertulis dari pemilik hak cipta.\n\n#${channelSlug} #MusikIndonesia #${primaryGenre.replace(/[^a-zA-Z0-9]/g, '')} #OfficialMusicVideo`;

  const words = fullDescription.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const characterCount = fullDescription.length;
  const previewText = fullDescription.slice(0, 180).trim();

  const detectedChapters = [
    { time: "00:00", label: "Intro" },
    { time: "00:26", label: "Bagian 1 (Bait Awal)" },
    { time: "01:02", label: "Reff / Chorus" },
    { time: "01:40", label: "Bagian 2 (Bait Lanjutan)" },
    { time: "02:18", label: "Reff / Chorus" },
    { time: "02:52", label: "Solo Instrumen & Bridge" },
    { time: "03:25", label: "Outro / Penutup" }
  ];

  const detectedLinksList = [
    { url: `https://open.spotify.com/artist/${channelSlug}`, platform: "Spotify", type: "Streaming Musik (DSP)" },
    { url: `https://music.apple.com/artist/${channelSlug}`, platform: "Apple Music", type: "Streaming Musik (DSP)" },
    { url: `https://music.youtube.com/channel/${channelSlug}`, platform: "YouTube Music", type: "Streaming Musik (DSP)" },
    { url: `https://fanlink.tv/${channelSlug}`, platform: "Smartlink / Multi-DSP", type: "Hub Streaming" },
    { url: `https://instagram.com/${channelSlug}`, platform: "Instagram", type: "Media Sosial" },
    { url: `https://tiktok.com/@${channelSlug}`, platform: "TikTok", type: "Media Sosial" }
  ];

  const detectedCreditsList = [
    { role: "Vokal Utama", name: channelName },
    { role: "Pencipta Lagu", name: channelName },
    { role: "Produser Musik & Aransemen", name: "SoundLab Studio" },
    { role: "Mixing & Mastering", name: "Master Records Indonesia" },
    { role: "Sutradara Video Musik", name: "Creative Visuals" }
  ];

  const breakdownSections: DescriptionSection[] = [
    {
      title: "Hook Pembuka & Sinopsis Karya",
      type: "hook",
      content: previewText,
      status: "present",
      analysis: "Krusial untuk potongan cuplikan pencarian YouTube dan Google sebelum penonton menekan 'Lebih Banyak'."
    },
    {
      title: "Babak Navigasi / Timestamps",
      type: "timestamps",
      content: "00:00 Intro · 00:26 Bagian 1 · 01:02 Reff · 01:40 Bagian 2",
      status: "present",
      analysis: "Format timestamp otomatis menciptakan penanda babak pada scrubber video YouTube dan mengaktifkan fitur Google Search Key Moments."
    },
    {
      title: "Kredit Musisi & Tim Produksi",
      type: "credits",
      content: `Vokal: ${channelName} | Pencipta: ${channelName} | Produser: SoundLab Studio`,
      status: "present",
      analysis: "Menghormati hak cipta para kolaborator, melindungi karya, dan membantu klasifikasi metadata YouTube Music."
    },
    {
      title: "Lirik Lagu Lengkap",
      type: "lyrics",
      content: "Lirik lagu lengkap telah dicantumkan di badan deskripsi.",
      status: "present",
      analysis: "Audiens sering mencari lagu dengan mengetik potongan lirik di mesin pencari. Teks lirik menjaring audiens organik."
    },
    {
      title: "Tautan Streaming (DSP) & Media Sosial",
      type: "links",
      content: "Spotify, Apple Music, YouTube Music, Smartlink Fanlink, Instagram, TikTok",
      status: "present",
      analysis: "Mengonversi penonton YouTube menjadi pendengar setia di Spotify, Apple Music, dan pengikut media sosial."
    },
    {
      title: "Pernyataan Hak Cipta & Lisensi",
      type: "copyright",
      content: `© 2026 ${channelName}. All rights reserved.`,
      status: "present",
      analysis: "Melindungi kekayaan intelektual karya musik dan memperkuat legalitas chanel di ekosistem YouTube."
    }
  ];

  const checklist: DescriptionChecklistItem[] = [
    { item: "Hook Pembuka (< 200 karakter sebelum 'Show more')", status: true, importance: "Kritis", feedback: "Baris pembuka memuat informasi pokok sebelum tombol 'Lebih Banyak'." },
    { item: "Pencantuman Judul Karya di Baris Pertama", status: true, importance: "Kritis", feedback: "Judul lagu selaras dengan intent pencarian pendengar." },
    { item: "Tautan Streaming Musik Multi-platform (Smartlink / DSP)", status: true, importance: "Tinggi", feedback: "Tautan streaming digital dan media sosial telah terpasang." },
    { item: "Atribusi Kredit Musisi & Tim Produksi", status: true, importance: "Tinggi", feedback: "Atribusi musisi, komposer, dan produser tercatat rapi." },
    { item: "Pencantuman Lirik Lagu Lengkap", status: true, importance: "Tinggi", feedback: "Lirik lengkap tersedia untuk menjaring kata kunci pencarian lirik." },
    { item: "Navigasi Babak / Timestamps (Chapters)", status: true, importance: "Sedang", feedback: "Format babak (00:00) aktif dan memandu penonton." },
    { item: "Pernyataan Lisensi & Perlindungan Hak Cipta", status: true, importance: "Sedang", feedback: "Klausul hak cipta melindungi karya dari re-upload ilegal." }
  ];

  const uploadDescription: UploadDescriptionData = {
    fullDescription,
    wordCount,
    characterCount,
    sampleStructure: "[Judul & Sinopsis Karya] -> [Tautan DSP Streaming] -> [Babak / Timestamps] -> [Kredit Musisi] -> [Lirik Lengkap] -> [Hak Cipta & Lisensi]",
    uniqueContentPercent: 65,
    boilerplatePercent: 35,
    hasTimestamps: true,
    hasMusicCredits: true,
    hasLyrics: true,
    hasExternalLinks: true,
    hasSocialLinks: true,
    hasCopyrightNotice: true,
    ctaEvaluation: "Struktur deskripsi menempatkan tautan streaming dengan konversi tinggi di baris awal serta atribusi lengkap di badan teks.",
    structureNotes: [
      "Menyertakan lirik lengkap di deskripsi video meningkatkan 30%+ traffic pencarian organik Google Search",
      "Atribusi musisi dan tim produksi rapi menghargai hak cipta dan memudahkan monetisasi karya",
      "Timestamp babak mengaktifkan penanda segmen pemutar YouTube dan indeks Google Key Moments"
    ],
    aboveTheFoldHook: {
      previewText,
      charCount: previewText.length,
      score: 95,
      assessment: "Hook pembuka sebelum garis potong 'Show more' YouTube terstruktur prima. Langsung memuat nama lagu, identitas chanel, dan ajakan streaming utama yang ramah algoritma."
    },
    detectedChapters,
    detectedLinksList,
    detectedCreditsList,
    breakdownSections,
    optimizationScore: 100,
    checklist,
    recommendedTemplate: fullDescription
  };

  return {
    channelName,
    handle,
    subscribersEstimate: isSpecificVideo ? "Video Publik" : "Chanel Aktif",
    totalVideosEstimate: isSpecificVideo ? "1 Rilisan" : "Katalog Aktif",
    toneOfVoice: "Autentik, Profesional, Menarik & Komunikatif",
    summary: `Analisis metadata komprehensif untuk ${channelName} yang berfokus pada kurasi dan rilisan musik ${primaryGenre}.`,
    channelProfile: {
      channelName,
      handle,
      channelUrl,
      thumbnailUrl,
      avatarUrl: thumbnailUrl,
      subscribersCount: isSpecificVideo ? "Video Terverifikasi" : "Chanel Musik",
      videosCount: isSpecificVideo ? "1 Video" : "Aktif",
      isSpecificVideo,
      videoTitle: songTitle
    },
    musicGenre: {
      primaryGenre,
      breakdown: [
        { genre: primaryGenre, percentage: 65 },
        { genre: "Akustik / Live Session", percentage: 25 },
        { genre: "Remix & Alternatif", percentage: 10 }
      ],
      mood,
      tempoBpm,
      dominantInstruments: instruments,
      targetAudience: `Penikmat musik ${primaryGenre} yang aktif mencari audio jernih dan video klip di YouTube.`
    },
    channelDescription: {
      content: `Kanal resmi ${channelName}. Menghadirkan karya musik terbaik, video klip resmi, dan konten audio visual berkualitas tinggi untuk seluruh penikmat musik tanah air.`,
      wordCount: 22,
      characterCount: 168,
      hookEvaluation: "Pembuka deskripsi menyajikan judul/karya utama secara langsung sehingga mudah dikenali mesin pencari.",
      hookScore: 88,
      detectedLinks: ["Spotify Streaming Profile", "Instagram Resmi"],
      strengths: [
        "Kesesuaian nama dan identitas karya terdefinisi jelas",
        "Tersedia informasi pokok konten untuk audiens",
        "Penempatan kata kunci relevan pada bagian pembuka"
      ],
      weaknesses: [
        "Tambahkan tautan multi-platform resmi (Smartlink / Fanlink) untuk mempermudah penonton",
        "Sertakan ajakan berlangganan (Subscribe CTA) dan pengingat lonceng notifikasi"
      ]
    },
    uploadDescription,
    tagsAnalysis: {
      existingTags: [
        { tag: channelName.toLowerCase(), category: "brand", relevance: 98 },
        { tag: `${channelName.toLowerCase()} official`, category: "brand", relevance: 95 },
        { tag: primaryGenre.toLowerCase(), category: "genre", relevance: 92 },
        { tag: "audio jernih lirik", category: "discovery", relevance: 88 },
        { tag: "lagu viral 2026", category: "discovery", relevance: 85 }
      ],
      tagRelevanceScore: 94,
      recommendedNewTags: [
        `${channelName.toLowerCase()} live`,
        `${primaryGenre.toLowerCase()} terbaru`,
        "musik santai indonesia",
        "official music video hd"
      ],
      insights: `Tag yang terpasang berfokus pada nama entitas dan genre ${primaryGenre}. Tambahkan tag penemuan situasional untuk menjaring audiens baru.`
    },
    hashtagsAnalysis: {
      topHashtags: [`#${channelSlug}`, `#${primaryGenre.split(' ')[0]}`, "#MusikIndonesia"],
      averagePerVideo: 3,
      reachLevel: "Tinggi",
      recommendedHashtags: [
        `#${channelSlug}Musik`,
        "#LaguTerbaru2026",
        "#TrendingMusik"
      ],
      notes: "Penggunaan 3-5 hashtag di atas judul video sangat optimal dan mematuhi batas aman algoritma penelusuran YouTube."
    },
    uploadSchedule: {
      hourlyDistribution: [
        { hour: 12, count: 2 },
        { hour: 15, count: 4 },
        { hour: 18, count: 9 },
        { hour: 19, count: 14 },
        { hour: 20, count: 11 },
        { hour: 21, count: 6 }
      ],
      bestDays: ["Jumat", "Sabtu", "Minggu"],
      optimalTimeWindowWIB: "18:00 - 20:30 WIB",
      frequency: "1 - 2 video per minggu",
      audienceBehaviorReason: "Penonton di Indonesia memiliki waktu santai dan konsumsi video musik tertinggi saat petang dan malam hari (18:00 - 20:30 WIB)."
    },
    overallScore: 92,
    actionableTips: [
      "Pastikan 150 karakter pertama deskripsi memuat judul lagu dan nama artis secara gamblang untuk mengunci hasil pencarian Google & YouTube.",
      "Gunakan 3-5 hashtag relevan di setiap video baru untuk membantu pengelompokan topik oleh algoritma.",
      "Jadwalkan rilis pada hari Jumat petang (18:00 - 20:30 WIB) untuk menangkap lonjakan traffic penonton akhir pekan.",
      "Sematkan komentar pin (pinned comment) yang mengarahkan penonton ke video terbaik berikutnya atau playlist diskografi lengkap."
    ],
    sourceInfo: {
      originalUrl: clean,
      isSpecificVideo,
      parsedTitle: songTitle,
      liveScraped: false
    }
  };
}

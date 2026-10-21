export interface GenreItem {
  genre: string;
  percentage: number;
}

export interface MusicGenreData {
  primaryGenre: string;
  breakdown: GenreItem[];
  mood: string[];
  tempoBpm: string;
  dominantInstruments: string[];
  targetAudience: string;
}

export interface ChannelDescriptionData {
  content: string;
  wordCount: number;
  characterCount: number;
  hookEvaluation: string;
  hookScore: number;
  detectedLinks: string[];
  strengths: string[];
  weaknesses: string[];
}

export interface DescriptionSection {
  title: string;
  type: 'hook' | 'credits' | 'lyrics' | 'timestamps' | 'links' | 'copyright' | 'hashtags' | 'boilerplate' | 'other';
  content: string;
  status: 'present' | 'missing' | 'recommended';
  analysis: string;
}

export interface DescriptionChecklistItem {
  item: string;
  status: boolean;
  importance: 'Kritis' | 'Tinggi' | 'Sedang';
  feedback: string;
}

export interface UploadDescriptionData {
  fullDescription: string;
  wordCount: number;
  characterCount: number;
  sampleStructure: string;
  uniqueContentPercent: number;
  boilerplatePercent: number;
  hasTimestamps: boolean;
  hasMusicCredits: boolean;
  hasLyrics?: boolean;
  hasExternalLinks?: boolean;
  hasSocialLinks?: boolean;
  hasCopyrightNotice?: boolean;
  ctaEvaluation: string;
  structureNotes: string[];
  aboveTheFoldHook?: {
    previewText: string;
    charCount: number;
    assessment: string;
    score: number;
  };
  detectedChapters?: { time: string; label: string }[];
  detectedLinksList?: { url: string; platform: string; type: string }[];
  detectedCreditsList?: { role: string; name: string }[];
  breakdownSections?: DescriptionSection[];
  optimizationScore?: number;
  checklist?: DescriptionChecklistItem[];
  recommendedTemplate?: string;
}

export interface TagItem {
  tag: string;
  category: 'genre' | 'brand' | 'discovery' | 'artist';
  relevance: number;
}

export interface TagsAnalysisData {
  existingTags: TagItem[];
  tagRelevanceScore: number;
  recommendedNewTags: string[];
  insights: string;
}

export interface HashtagsAnalysisData {
  topHashtags: string[];
  averagePerVideo: number;
  reachLevel: 'Tinggi' | 'Sedang' | 'Niche / Spesifik';
  recommendedHashtags: string[];
  notes: string;
}

export interface HourlyDistributionItem {
  hour: number;
  count: number;
}

export interface UploadScheduleData {
  hourlyDistribution: HourlyDistributionItem[];
  bestDays: string[];
  optimalTimeWindowWIB: string;
  frequency: string;
  audienceBehaviorReason: string;
}

export interface YouTubeChannelProfile {
  channelName: string;
  handle: string;
  channelUrl: string;
  avatarUrl?: string;
  thumbnailUrl?: string;
  subscribersCount?: string;
  videosCount?: string;
  isSpecificVideo?: boolean;
  videoTitle?: string;
}

export interface ChannelMetadataAnalysis {
  channelName: string;
  handle: string;
  subscribersEstimate: string;
  totalVideosEstimate: string;
  toneOfVoice: string;
  summary: string;
  channelProfile?: YouTubeChannelProfile;
  musicGenre: MusicGenreData;
  channelDescription: ChannelDescriptionData;
  uploadDescription: UploadDescriptionData;
  tagsAnalysis: TagsAnalysisData;
  hashtagsAnalysis: HashtagsAnalysisData;
  uploadSchedule: UploadScheduleData;
  overallScore: number;
  actionableTips: string[];
  sourceInfo?: {
    originalUrl?: string;
    isSpecificVideo?: boolean;
    parsedTitle?: string;
    liveScraped?: boolean;
    realTagsCount?: number;
    realTimestampsFound?: number;
  };
}

import React, { useState } from 'react';
import { YouTubeChannelProfile } from '../types/metadata';
import { 
  ExternalLink, 
  Users, 
  Video, 
  CheckCircle2, 
  PlaySquare 
} from 'lucide-react';
import { YouTubeIcon } from './YouTubeIcon';

interface YouTubeProfileCardProps {
  profile?: YouTubeChannelProfile;
  fallbackName: string;
  fallbackHandle: string;
  subscribersEstimate: string;
  totalVideosEstimate: string;
  overallScore: number;
}

export const YouTubeProfileCard: React.FC<YouTubeProfileCardProps> = ({
  profile,
  fallbackName,
  fallbackHandle,
  subscribersEstimate,
  totalVideosEstimate,
  overallScore,
}) => {
  const [imgError, setImgError] = useState(false);
  const [thumbError, setThumbError] = useState(false);

  const channelName = profile?.channelName || fallbackName;
  const handle = profile?.handle || fallbackHandle;
  const channelUrl = profile?.channelUrl || (handle ? `https://www.youtube.com/${handle}` : 'https://www.youtube.com');
  const avatarUrl = profile?.avatarUrl;
  const thumbnailUrl = profile?.thumbnailUrl;
  const subscribers = profile?.subscribersCount || subscribersEstimate;
  const totalVideos = profile?.videosCount || totalVideosEstimate;
  const isVideo = profile?.isSpecificVideo;
  const videoTitle = profile?.videoTitle;

  // Get initial letters for avatar fallback
  const initials = channelName
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase() || 'YT';

  return (
    <div className="bg-[#1e1f20] border-b border-[#2d2f31] py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Main Channel Profile Info */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            {/* Channel Avatar */}
            <div className="relative shrink-0">
              {avatarUrl && !imgError ? (
                <img
                  src={avatarUrl}
                  alt={channelName}
                  onError={() => setImgError(true)}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[#333537] bg-[#131314] shadow-md"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-700 text-white flex items-center justify-center font-bold text-lg sm:text-xl tracking-tight shadow-md border-2 border-[#333537]">
                  {initials}
                </div>
              )}
              {/* YouTube badge */}
              <div 
                className="absolute -bottom-1 -right-1 bg-[#1e1f20] p-0.5 rounded-full shadow-md border border-[#333537]"
                title="Chanel YouTube Terverifikasi"
              >
                <YouTubeIcon className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Profile Identity Text */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#f0f2f5] leading-tight">
                  {channelName}
                </h1>
                <span title="Profil Terverifikasi" className="inline-flex">
                  <CheckCircle2 className="w-4 h-4 text-neutral-400 shrink-0" />
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-[#9aa0a6] font-mono">
                <span className="font-medium text-[#c4c7c5]">{handle}</span>
                <span aria-hidden="true" className="text-neutral-600">·</span>
                <span className="flex items-center gap-1 font-sans text-[#9aa0a6]">
                  <Users className="w-3.5 h-3.5 text-neutral-500" />
                  {subscribers}
                </span>
                <span aria-hidden="true" className="text-neutral-600">·</span>
                <span className="flex items-center gap-1 font-sans text-[#9aa0a6]">
                  <Video className="w-3.5 h-3.5 text-neutral-500" />
                  {totalVideos}
                </span>
              </div>

              {/* Direct YouTube channel CTA link */}
              <div className="pt-1.5 flex flex-wrap items-center gap-2">
                <a
                  href={channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#131314] hover:bg-[#282a2c] text-[#f0f2f5] border border-[#333537] rounded-md text-xs font-medium transition-colors cursor-pointer"
                >
                  <YouTubeIcon className="w-3.5 h-3.5" />
                  <span>Buka Chanel di YouTube</span>
                  <ExternalLink className="w-3 h-3 text-neutral-500" />
                </a>

                {isVideo && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#9aa0a6] bg-[#131314] border border-[#333537] px-2 py-1 rounded">
                    <PlaySquare className="w-3 h-3 text-neutral-400" />
                    <span>Mode Video Spesifik</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Video Preview or Metadata Health Card */}
          <div className="flex items-center gap-4 bg-[#131314] border border-[#333537] p-3.5 rounded-xl shrink-0 self-start lg:self-auto shadow-sm">
            {/* If video thumbnail is available */}
            {isVideo && thumbnailUrl && !thumbError && (
              <img
                src={thumbnailUrl}
                alt="Thumbnail"
                onError={() => setThumbError(true)}
                className="w-24 h-14 rounded-md object-cover border border-[#333537] shrink-0"
              />
            )}

            <div className="space-y-0.5">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#9aa0a6] block">
                Skor Optimasi Algoritma
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white">
                  {overallScore}
                </span>
                <span className="text-xs font-mono text-neutral-500">/ 100</span>
              </div>
              <p className="text-[11px] text-emerald-400 font-medium">
                ✓ Metadata Siap Bersaing
              </p>
            </div>
          </div>
        </div>

        {/* Video title line if analyzing a specific video */}
        {isVideo && videoTitle && (
          <div className="mt-4 pt-3 border-t border-[#2d2f31] flex items-center gap-2 text-xs text-[#9aa0a6]">
            <span className="font-semibold text-[#f0f2f5] shrink-0">Judul Video:</span>
            <span className="truncate font-medium text-[#e3e3e3]">{videoTitle}</span>
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { ChannelMetadataAnalysis } from '../types/metadata';
import { CheckCircle2, Music2, MessageSquare } from 'lucide-react';

interface ChannelOverviewProps {
  data: ChannelMetadataAnalysis;
}

export const ChannelOverview: React.FC<ChannelOverviewProps> = ({ data }) => {
  return (
    <div className="bg-[#131314] border-b border-[#2d2f31] py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        {/* Verified link source indicator if available */}
        {data.sourceInfo?.originalUrl && (
          <div className="bg-[#1e1f20] rounded-lg px-3.5 py-2.5 border border-[#333537] text-xs flex flex-wrap items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2 text-[#e3e3e3]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold text-white">Link Terverifikasi:</span>
              <span className="text-[#c4c7c5] font-medium truncate max-w-md">
                {data.sourceInfo.parsedTitle || data.channelName}
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#9aa0a6]">
              {data.sourceInfo.realTagsCount !== undefined && data.sourceInfo.realTagsCount > 0 && (
                <>
                  <span>{data.sourceInfo.realTagsCount} Tag Asli</span>
                  <span aria-hidden="true" className="text-neutral-600">·</span>
                </>
              )}
              {data.sourceInfo.realTimestampsFound !== undefined && data.sourceInfo.realTimestampsFound > 0 && (
                <>
                  <span>{data.sourceInfo.realTimestampsFound} Timestamp Publikasi</span>
                  <span aria-hidden="true" className="text-neutral-600">·</span>
                </>
              )}
              <span className="truncate max-w-[240px] text-neutral-500" title={data.sourceInfo.originalUrl}>
                {data.sourceInfo.originalUrl}
              </span>
            </div>
          </div>
        )}

        {/* Concise Context & Tone Line */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#9aa0a6]">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 font-medium text-[#f0f2f5]">
              <Music2 className="w-3.5 h-3.5 text-neutral-400" />
              Genre: {data.musicGenre.primaryGenre}
            </span>
            <span aria-hidden="true" className="text-neutral-700">·</span>
            <span className="flex items-center gap-1 text-[#9aa0a6]">
              <MessageSquare className="w-3.5 h-3.5 text-neutral-500" />
              Gaya Bahasa: {data.toneOfVoice}
            </span>
          </div>
        </div>

        {/* Channel & Video Summary Prose */}
        <p className="text-xs sm:text-sm text-[#c4c7c5] leading-relaxed">
          {data.summary}
        </p>
      </div>
    </div>
  );
};

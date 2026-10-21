import React, { useState } from 'react';
import { ArrowRight, Loader2, Link2, FileText } from 'lucide-react';
import { YouTubeIcon } from './YouTubeIcon';

interface EmptyStateWorkflowProps {
  onSearch: (input: string) => void;
  onOpenRawInputModal: () => void;
  isLoading: boolean;
}

export const EmptyStateWorkflow: React.FC<EmptyStateWorkflowProps> = ({
  onSearch,
  onOpenRawInputModal,
  isLoading,
}) => {
  const [channelInput, setChannelInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (channelInput.trim()) {
      onSearch(channelInput.trim());
    }
  };

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-8 text-center">
        {/* Minimalist Heading */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-[#9aa0a6] bg-[#1e1f20] px-3.5 py-1.5 rounded-full border border-[#333537] shadow-xs">
            <YouTubeIcon className="w-4 h-4" />
            <span className="font-mono text-[#f0f2f5] font-semibold">&lt;/ Arz.Studio &gt;</span>
            <span className="text-neutral-600">·</span>
            <span>Metadata Scanner</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#f0f2f5]">
            Tempel Link Chanel YouTube
          </h1>
          <p className="text-sm text-[#9aa0a6] max-w-md mx-auto leading-relaxed">
            Analisis akurat genre musik, deskripsi bio & unggahan, tag SEO, hashtag, dan jadwal jam tayang.
          </p>
        </div>

        {/* The Link Paste Panel */}
        <div className="bg-[#1e1f20] rounded-2xl border border-[#333537] p-3 sm:p-4 shadow-xl">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 flex items-center">
              <Link2 className="w-4 h-4 text-[#9aa0a6] absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={channelInput}
                onChange={(e) => setChannelInput(e.target.value)}
                placeholder="Tempel link chanel (@handle) atau link video YouTube di sini..."
                className="w-full pl-10 pr-4 py-3.5 bg-[#131314] border border-[#333537] text-sm text-[#f0f2f5] placeholder-[#6b7280] rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 transition-colors"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !channelInput.trim()}
              className="px-6 py-3.5 bg-white hover:bg-neutral-200 disabled:bg-[#282a2c] disabled:text-[#6b7280] text-neutral-900 text-xs font-semibold rounded-xl transition-colors inline-flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-neutral-900" />
                  <span>Menganalisis...</span>
                </>
              ) : (
                <>
                  <span>Analisis Link</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Minimal text-draft option */}
        <div className="text-xs text-[#9aa0a6] flex items-center justify-center gap-1.5">
          <span>Ingin menganalisis draf teks manual?</span>
          <button
            type="button"
            onClick={onOpenRawInputModal}
            className="text-[#f0f2f5] font-medium underline hover:text-white cursor-pointer inline-flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5 text-neutral-400" />
            <span>Tempel Teks Draf</span>
          </button>
        </div>
      </div>
    </div>
  );
};

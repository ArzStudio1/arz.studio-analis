import React from 'react';
import { FileText, Download } from 'lucide-react';
import { YouTubeIcon } from './YouTubeIcon';

interface HeaderProps {
  onOpenRawInputModal: () => void;
  onOpenExportModal: () => void;
  hasData?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenRawInputModal,
  onOpenExportModal,
  hasData = false,
}) => {
  return (
    <header className="border-b border-[#2d2f31] bg-[#131314]/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#1e1f20] border border-[#3c4043] flex items-center justify-center shadow-xs">
            <YouTubeIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#f0f2f5] tracking-tight text-base font-mono">
                &lt;/ Arz.Studio &gt;
              </span>
              <span className="text-xs text-neutral-500 font-normal">·</span>
              <span className="text-xs text-[#9aa0a6] font-normal">
                Analitik Metadata YouTube
              </span>
            </div>
            <p className="text-xs text-[#9aa0a6] hidden sm:block">
              Genre musik, deskripsi bio & video, kata kunci tag, hashtag, dan jam tayang
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenRawInputModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#e3e3e3] bg-[#1e1f20] hover:bg-[#282a2c] border border-[#333537] rounded-md transition-colors cursor-pointer"
            title="Analisis teks atau data deskripsi sendiri"
          >
            <FileText className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden sm:inline">Analisis Teks Bebas</span>
            <span className="sm:hidden">Teks</span>
          </button>

          {hasData && (
            <button
              onClick={onOpenExportModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#f0f2f5] bg-[#1e1f20] border border-[#333537] hover:bg-[#282a2c] rounded-md transition-colors cursor-pointer"
              title="Ekspor laporan metadata"
            >
              <Download className="w-3.5 h-3.5 text-neutral-400" />
              <span className="hidden sm:inline">Ekspor Laporan</span>
              <span className="sm:hidden">Ekspor</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

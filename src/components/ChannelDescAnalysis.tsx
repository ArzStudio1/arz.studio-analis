import React, { useState } from 'react';
import { ChannelDescriptionData } from '../types/metadata';
import { FileText, Link2, Check, AlertCircle, Copy, ExternalLink } from 'lucide-react';

interface ChannelDescAnalysisProps {
  data: ChannelDescriptionData;
}

export const ChannelDescAnalysis: React.FC<ChannelDescAnalysisProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const first150 = data.content.slice(0, 150);
  const remainingText = data.content.slice(150);

  return (
    <div className="bg-[#1e1f20] rounded-xl border border-[#2d2f31] p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#2d2f31] gap-2">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-neutral-300" />
          <h2 className="text-lg font-semibold text-[#f0f2f5] tracking-tight">
            Analisis Deskripsi Chanel (About / Bio)
          </h2>
        </div>
        <div className="flex items-center gap-3 text-xs text-[#9aa0a6] font-mono">
          <span>{data.wordCount} Kata</span>
          <span aria-hidden="true" className="text-neutral-700">·</span>
          <span>{data.characterCount} Karakter</span>
          <span aria-hidden="true" className="text-neutral-700">·</span>
          <button
            onClick={handleCopy}
            className="text-[#f0f2f5] hover:text-white inline-flex items-center gap-1 font-sans cursor-pointer transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-neutral-400" />
                <span>Salin Teks</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hook Inspector: The first 150 characters */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-medium text-[#f0f2f5]">
            <span>Kualitas Hook (150 Karakter Pertama)</span>
            <span className="text-[#9aa0a6] font-normal">· Yang terlihat di hasil pencarian YouTube</span>
          </div>
          <span className="font-mono text-[#9aa0a6]">
            Skor Hook: <strong className="text-white">{data.hookScore}/100</strong>
          </span>
        </div>

        {/* Visualized hook representation */}
        <div className="p-3.5 bg-[#131314] border border-[#333537] rounded-lg text-xs leading-relaxed font-mono">
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold px-1 py-0.5 rounded-xs">
            {first150}
          </span>
          <span className="text-[#9aa0a6]">
            {remainingText}
          </span>
        </div>
        <p className="text-xs text-[#9aa0a6] italic">
          Catatan: Teks yang disorot adalah bagian yang langsung dibaca algoritma & calon penonton sebelum menekan tombol "Lainnya".
        </p>
      </div>

      {/* Hook Evaluation Notes */}
      <div className="p-3.5 bg-[#131314] rounded-lg border border-[#333537] text-xs text-[#c4c7c5] leading-relaxed">
        <span className="font-semibold text-white">Evaluasi Pembuka: </span>
        {data.hookEvaluation}
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Strengths */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Kelebihan Deskripsi</span>
          </div>
          <ul className="space-y-1.5 text-xs text-[#c4c7c5]">
            {data.strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold leading-tight">✓</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses / Opportunities */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>Peluang Optimasi</span>
          </div>
          <ul className="space-y-1.5 text-xs text-[#c4c7c5]">
            {data.weaknesses.map((w, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold leading-tight">•</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Detected Links & Socials */}
      {data.detectedLinks && data.detectedLinks.length > 0 && (
        <div className="pt-3 border-t border-[#2d2f31] space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#c4c7c5]">
            <Link2 className="w-3.5 h-3.5 text-neutral-400" />
            <span>Tautan & Kontak Terdeteksi:</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-[#9aa0a6]">
            {data.detectedLinks.map((link, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 font-mono text-[11px] text-[#e3e3e3] bg-[#131314] border border-[#333537] px-2 py-0.5 rounded">
                <ExternalLink className="w-3 h-3 text-neutral-400" />
                {link}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

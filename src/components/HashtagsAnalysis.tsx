import React, { useState } from 'react';
import { HashtagsAnalysisData } from '../types/metadata';
import { Hash, Check, Copy, TrendingUp } from 'lucide-react';

interface HashtagsAnalysisProps {
  data: HashtagsAnalysisData;
}

export const HashtagsAnalysis: React.FC<HashtagsAnalysisProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyHashtags = () => {
    const text = data.topHashtags.join(' ');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isHealthyDensity = data.averagePerVideo >= 2 && data.averagePerVideo <= 6;

  return (
    <div className="bg-[#1e1f20] rounded-xl border border-[#2d2f31] p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#2d2f31] gap-2">
        <div className="flex items-center gap-2">
          <Hash className="w-5 h-5 text-neutral-300" />
          <h2 className="text-lg font-semibold text-[#f0f2f5] tracking-tight">
            Analisis Tagar (#Hashtag)
          </h2>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-[#9aa0a6]">
            Jangkauan: <strong className="text-white">{data.reachLevel}</strong>
          </span>
          <span aria-hidden="true" className="text-neutral-700">·</span>
          <button
            onClick={handleCopyHashtags}
            className="text-[#f0f2f5] font-medium inline-flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Hashtag Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-neutral-400" />
                <span>Salin Tagar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Density & Health Metric */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-[#131314] rounded-lg border border-[#333537] space-y-1">
          <div className="text-xs text-[#9aa0a6]">Rata-rata Tagar per Video</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">
              {data.averagePerVideo}
            </span>
            <span className="text-xs text-[#9aa0a6]">tagar / unggahan</span>
          </div>
          <p className="text-xs pt-1">
            {isHealthyDensity ? (
              <span className="text-emerald-400 font-medium">
                ✓ Sesuai rekomendasi YouTube (3–5 tagar terfokus di atas judul).
              </span>
            ) : (
              <span className="text-amber-400 font-medium">
                Peringatan: Hindari memakai lebih dari 10 tagar agar tidak dianggap spam.
              </span>
            )}
          </p>
        </div>

        <div className="p-4 bg-[#131314] rounded-lg border border-[#333537] space-y-1">
          <div className="text-xs text-[#9aa0a6]">Tingkat Penetrasi Tagar</div>
          <div className="text-2xl font-bold text-white">
            {data.reachLevel}
          </div>
          <p className="text-xs text-[#9aa0a6] pt-1">
            Keseimbangan antara tagar viral berskala makro dan tagar niche sub-kategori.
          </p>
        </div>
      </div>

      {/* Top Hashtags in use */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-[#f0f2f5]">
          Tagar Aktif yang Sering Dipakai:
        </div>
        <div className="flex flex-wrap gap-2">
          {data.topHashtags.map((tag, idx) => (
            <span
              key={idx}
              className="font-mono text-xs text-[#e3e3e3] bg-[#131314] hover:bg-[#282a2c] border border-[#333537] px-2.5 py-1 rounded transition-colors"
            >
              {tag.startsWith('#') ? tag : `#${tag}`}
            </span>
          ))}
        </div>
      </div>

      {/* Recommended Hashtags */}
      {data.recommendedHashtags && data.recommendedHashtags.length > 0 && (
        <div className="pt-3 border-t border-[#2d2f31] space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Rekomendasi Tagar Tren untuk Video Selanjutnya:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.recommendedHashtags.map((tag, idx) => (
              <span
                key={idx}
                className="font-mono text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-800/60 px-2.5 py-1 rounded"
              >
                {tag.startsWith('#') ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {data.notes && (
        <div className="text-xs text-[#c4c7c5] leading-relaxed bg-[#131314] p-3 rounded-lg border border-[#333537]">
          {data.notes}
        </div>
      )}
    </div>
  );
};

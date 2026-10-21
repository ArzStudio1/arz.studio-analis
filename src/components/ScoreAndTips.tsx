import React from 'react';
import { CheckCircle2, Lightbulb } from 'lucide-react';

interface ScoreAndTipsProps {
  score: number;
  tips: string[];
}

export const ScoreAndTips: React.FC<ScoreAndTipsProps> = ({ score, tips }) => {
  return (
    <div className="bg-[#1e1f20] rounded-xl border border-[#2d2f31] p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#2d2f31]">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-neutral-300" />
          <h2 className="text-lg font-semibold text-[#f0f2f5] tracking-tight">
            Rekomendasi Tindakan & Optimalisasi Algoritma
          </h2>
        </div>
        <div className="text-xs text-[#9aa0a6] font-mono">
          Skor: <strong className="text-white">{score}/100</strong>
        </div>
      </div>

      {/* Actionable List */}
      <div className="space-y-3">
        <div className="text-xs text-[#9aa0a6]">
          Langkah prioritas untuk mendongkrak performa metadata dan rekomendasi video:
        </div>

        <div className="space-y-2.5">
          {tips.map((tip, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3.5 rounded-lg border border-[#333537] bg-[#131314] text-xs text-[#c4c7c5] leading-relaxed"
            >
              <div className="w-5 h-5 rounded-md bg-white text-neutral-900 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <div className="space-y-0.5">
                <span>{tip}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Creator pre-publish checklist */}
      <div className="pt-2 border-t border-[#2d2f31] space-y-2 text-xs">
        <div className="font-semibold text-[#f0f2f5]">
          Daftar Periksa Cepat Sebelum Mengunggah Video Musik Baru:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#9aa0a6]">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Hook 150 karakter pertama memuat kata kunci lagu</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Maksimal 3-5 hashtag utama terpasang</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Timestamp / babak (00:00 Intro, dst.) dicantumkan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Jadwal rilis disesuaikan dengan jam aktif audiens</span>
          </div>
        </div>
      </div>
    </div>
  );
};

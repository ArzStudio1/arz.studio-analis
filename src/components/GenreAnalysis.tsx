import React from 'react';
import { MusicGenreData } from '../types/metadata';
import { Disc3, Activity, Gauge, Headphones } from 'lucide-react';

interface GenreAnalysisProps {
  data: MusicGenreData;
}

export const GenreAnalysis: React.FC<GenreAnalysisProps> = ({ data }) => {
  return (
    <div className="bg-[#1e1f20] rounded-xl border border-[#2d2f31] p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#2d2f31] gap-2">
        <div className="flex items-center gap-2">
          <Disc3 className="w-5 h-5 text-neutral-300" />
          <h2 className="text-lg font-semibold text-[#f0f2f5] tracking-tight">
            Analisis Genre & Karakteristik Musik
          </h2>
        </div>
        <div className="text-xs text-[#9aa0a6] font-normal">
          Genre Dominan: <span className="font-semibold text-white">{data.primaryGenre}</span>
        </div>
      </div>

      {/* Percentage distribution breakdown bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-[#9aa0a6]">
          <span className="font-medium text-[#c4c7c5]">Distribusi Komposisi Genre</span>
          <span className="font-mono">Total 100%</span>
        </div>

        {/* Multi-segment stacked progress bar */}
        <div className="h-3 w-full bg-[#131314] rounded-full overflow-hidden flex border border-[#333537]">
          {data.breakdown.map((item, idx) => {
            const shades = [
              'bg-blue-500',
              'bg-indigo-500',
              'bg-purple-500',
              'bg-teal-500',
              'bg-emerald-500',
            ];
            const color = shades[idx % shades.length];
            return (
              <div
                key={item.genre}
                style={{ width: `${item.percentage}%` }}
                className={`${color} h-full transition-all duration-500`}
                title={`${item.genre}: ${item.percentage}%`}
              />
            );
          })}
        </div>

        {/* Subgenre Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {data.breakdown.map((item, idx) => {
            const dotColors = [
              'bg-blue-400',
              'bg-indigo-400',
              'bg-purple-400',
              'bg-teal-400',
            ];
            return (
              <div key={item.genre} className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs text-[#9aa0a6]">
                  <span className={`w-2 h-2 rounded-full ${dotColors[idx % dotColors.length]}`} />
                  <span className="truncate">{item.genre}</span>
                </div>
                <div className="text-sm font-semibold text-[#f0f2f5] font-mono pl-3.5">
                  {item.percentage}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Audio Attributes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-[#2d2f31]">
        {/* Tempo & BPM */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-[#9aa0a6] font-medium">
            <Gauge className="w-3.5 h-3.5 text-neutral-400" />
            <span>Rentang Tempo (BPM)</span>
          </div>
          <div className="text-base font-semibold text-white font-mono">
            {data.tempoBpm}
          </div>
          <p className="text-xs text-[#9aa0a6] leading-normal">
            Kecepatan ritme rata-rata katalog audio chanel.
          </p>
        </div>

        {/* Mood & Vibe */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-[#9aa0a6] font-medium">
            <Activity className="w-3.5 h-3.5 text-neutral-400" />
            <span>Nuansa & Mood Utama</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#f0f2f5] font-medium">
            {data.mood.map((m, idx) => (
              <React.Fragment key={m}>
                <span>{m}</span>
                {idx < data.mood.length - 1 && (
                  <span aria-hidden="true" className="text-neutral-600">·</span>
                )}
              </React.Fragment>
            ))}
          </div>
          <p className="text-xs text-[#9aa0a6] leading-normal">
            Sentimen emosional yang dirasakan oleh pendengar.
          </p>
        </div>

        {/* Dominant Instruments */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-[#9aa0a6] font-medium">
            <Headphones className="w-3.5 h-3.5 text-neutral-400" />
            <span>Instrumen Paling Menonjol</span>
          </div>
          <div className="text-xs text-[#e3e3e3] leading-relaxed font-medium">
            {data.dominantInstruments.join(', ')}
          </div>
          <p className="text-xs text-[#9aa0a6] leading-normal">
            Elemen suara yang menjadi ciri khas produksi audio.
          </p>
        </div>
      </div>

      {/* Target Audience intent */}
      <div className="bg-[#131314] rounded-lg p-4 border border-[#333537] text-xs space-y-1">
        <span className="font-semibold text-white">Kesesuaian Target Audiens & Situasi:</span>
        <p className="text-[#c4c7c5] leading-relaxed">
          {data.targetAudience}
        </p>
      </div>
    </div>
  );
};

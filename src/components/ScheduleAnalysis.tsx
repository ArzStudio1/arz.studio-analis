import React, { useState } from 'react';
import { UploadScheduleData } from '../types/metadata';
import { Clock, Calendar, SunMedium, Moon } from 'lucide-react';

interface ScheduleAnalysisProps {
  data: UploadScheduleData;
}

export const ScheduleAnalysis: React.FC<ScheduleAnalysisProps> = ({ data }) => {
  const [selectedTz, setSelectedTz] = useState<'WIB' | 'WITA' | 'WIT' | 'UTC'>('WIB');

  // Timezone offsets relative to WIB (UTC+7)
  const tzOffsets = {
    WIB: 0,
    WITA: 1,
    WIT: 2,
    UTC: -7,
  };

  const offset = tzOffsets[selectedTz];

  // Adjust hourly distribution according to selected timezone
  const maxCount = Math.max(...data.hourlyDistribution.map(d => d.count), 1);

  // Build full 24-hour array (0-23)
  const hours24 = Array.from({ length: 24 }, (_, i) => {
    const wibEquivalent = (i - offset + 24) % 24;
    const match = data.hourlyDistribution.find(d => d.hour === wibEquivalent);
    return {
      hour: i,
      count: match ? match.count : 0,
    };
  });

  return (
    <div className="bg-[#1e1f20] rounded-xl border border-[#2d2f31] p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#2d2f31] gap-3">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-neutral-300" />
          <div>
            <h2 className="text-lg font-semibold text-[#f0f2f5] tracking-tight">
              Analisis Jam Tayang & Jadwal Rilis Video
            </h2>
            <p className="text-xs text-[#9aa0a6]">
              Waktu publikasi optimal untuk memaksimalkan retensi 2 jam pertama algoritma
            </p>
          </div>
        </div>

        {/* Timezone Switcher */}
        <div className="flex items-center gap-1 p-1 bg-[#131314] rounded-lg border border-[#333537] self-start sm:self-auto">
          {(['WIB', 'WITA', 'WIT', 'UTC'] as const).map((tz) => (
            <button
              key={tz}
              onClick={() => setSelectedTz(tz)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedTz === tz
                  ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                  : 'text-[#9aa0a6] hover:text-[#f0f2f5]'
              }`}
            >
              {tz}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Highlights: Optimal Window & Days */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-[#131314] rounded-lg border border-[#333537] space-y-1">
          <div className="text-xs text-[#9aa0a6] flex items-center gap-1.5">
            <Moon className="w-3.5 h-3.5 text-neutral-400" />
            <span>Jam Tayang Optimal ({selectedTz})</span>
          </div>
          <div className="text-lg font-bold text-white font-mono">
            {selectedTz === 'WIB' ? data.optimalTimeWindowWIB : `${data.optimalTimeWindowWIB} (Konversi ke ${selectedTz})`}
          </div>
          <div className="text-xs text-[#9aa0a6] pt-0.5">
            Waktu aktif puncak penonton musik
          </div>
        </div>

        <div className="p-4 bg-[#131314] rounded-lg border border-[#333537] space-y-1">
          <div className="text-xs text-[#9aa0a6] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            <span>Hari Rilis Terbaik</span>
          </div>
          <div className="text-lg font-bold text-white">
            {data.bestDays.join(', ')}
          </div>
          <div className="text-xs text-[#9aa0a6] pt-0.5">
            Mendekati akhir pekan & waktu santai
          </div>
        </div>

        <div className="p-4 bg-[#131314] rounded-lg border border-[#333537] space-y-1">
          <div className="text-xs text-[#9aa0a6] flex items-center gap-1.5">
            <SunMedium className="w-3.5 h-3.5 text-neutral-400" />
            <span>Konsistensi Frekuensi</span>
          </div>
          <div className="text-sm font-semibold text-white">
            {data.frequency}
          </div>
          <div className="text-xs text-[#9aa0a6] pt-0.5">
            Irama penayangan konten terjaga
          </div>
        </div>
      </div>

      {/* 24-Hour Activity Chart */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-[#9aa0a6]">
          <span className="font-medium text-[#c4c7c5]">Distribusi Jam Unggahan Sepanjang 24 Jam ({selectedTz})</span>
          <span className="font-mono text-[11px]">Tinggi bar = Intensitas Unggahan</span>
        </div>

        {/* Minimalist 24h bar graph */}
        <div className="h-36 pt-4 flex items-end gap-1 sm:gap-1.5 border-b border-[#2d2f31]">
          {hours24.map((item) => {
            const heightPercent = item.count > 0 ? Math.max((item.count / maxCount) * 100, 10) : 4;
            const isPeak = item.count >= maxCount * 0.7;

            return (
              <div
                key={item.hour}
                className="flex-1 flex flex-col items-center justify-end h-full group relative"
              >
                {/* Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute -top-8 bg-white text-neutral-900 text-[10px] px-2 py-0.5 rounded shadow-sm transition-opacity whitespace-nowrap z-10 font-mono font-medium">
                  {String(item.hour).padStart(2, '0')}:00 {selectedTz} · {item.count} video
                </div>

                {/* Bar */}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-xs transition-all duration-300 ${
                    isPeak
                      ? 'bg-white hover:bg-neutral-200'
                      : item.count > 0
                      ? 'bg-neutral-600 hover:bg-neutral-500'
                      : 'bg-[#282a2c]'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Time labels under chart */}
        <div className="flex justify-between text-[10px] text-[#9aa0a6] font-mono pt-1">
          <span>00:00</span>
          <span>04:00</span>
          <span>08:00</span>
          <span>12:00</span>
          <span>16:00</span>
          <span>20:00</span>
          <span>23:59</span>
        </div>
      </div>

      {/* Audience Behavior Rationale */}
      <div className="p-4 bg-[#131314] rounded-lg border border-[#333537] text-xs space-y-1.5 leading-relaxed">
        <span className="font-semibold text-white">
          Konteks Perilaku Audiens & Mengapa Jam Ini Paling Efektif:
        </span>
        <p className="text-[#c4c7c5]">
          {data.audienceBehaviorReason}
        </p>
      </div>
    </div>
  );
};

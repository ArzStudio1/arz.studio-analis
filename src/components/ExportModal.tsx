import React, { useState } from 'react';
import { ChannelMetadataAnalysis } from '../types/metadata';
import { X, Copy, Check, FileJson, FileText } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ChannelMetadataAnalysis;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, data }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateMarkdownReport = () => {
    return `# Laporan Metadata Chanel: ${data.channelName} (${data.handle})
Aplikasi: </ Arz.Studio >
Tanggal Analisis: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
Skor Keseluruhan: ${data.overallScore}/100

## 1. Identitas & Ikhtisar
- Pelanggan (Estimasi): ${data.subscribersEstimate}
- Total Video: ${data.totalVideosEstimate}
- Tone of Voice: ${data.toneOfVoice}
- Ringkasan: ${data.summary}

## 2. Analisis Genre Musik
- Genre Utama: ${data.musicGenre.primaryGenre}
- Komposisi Sub-Genre:
${data.musicGenre.breakdown.map(b => `  * ${b.genre}: ${b.percentage}%`).join('\n')}
- Tempo: ${data.musicGenre.tempoBpm}
- Mood / Vibe: ${data.musicGenre.mood.join(', ')}
- Instrumen Dominan: ${data.musicGenre.dominantInstruments.join(', ')}
- Target Audiens: ${data.musicGenre.targetAudience}

## 3. Analisis Deskripsi Chanel
- Jumlah Kata: ${data.channelDescription.wordCount} | Karakter: ${data.channelDescription.characterCount}
- Skor Hook 150 Karakter: ${data.channelDescription.hookScore}/100
- Evaluasi Hook: ${data.channelDescription.hookEvaluation}
- Teks Deskripsi:
"${data.channelDescription.content}"
- Kelebihan:
${data.channelDescription.strengths.map(s => `  * ${s}`).join('\n')}
- Peluang Optimasi:
${data.channelDescription.weaknesses.map(w => `  * ${w}`).join('\n')}

## 4. Analisis Deskripsi Upload
- Rasio Konten Unik: ${data.uploadDescription.uniqueContentPercent}% | Boilerplate: ${data.uploadDescription.boilerplatePercent}%
- Karakter & Kata: ${data.uploadDescription.characterCount || 0} karakter (${data.uploadDescription.wordCount || 0} kata)
- Fitur Babak/Timestamps: ${data.uploadDescription.hasTimestamps ? 'Ada' : 'Tidak Ada'}
- Kredit Musik: ${data.uploadDescription.hasMusicCredits ? 'Ada' : 'Tidak Ada'}
- Lirik Lengkap: ${data.uploadDescription.hasLyrics ? 'Ada' : 'Tidak Ada'}
- Evaluasi CTA: ${data.uploadDescription.ctaEvaluation}
- Alur Struktur: ${data.uploadDescription.sampleStructure}
${data.uploadDescription.fullDescription ? `\n### Teks Deskripsi Lengkap Unggahan:\n\`\`\`\n${data.uploadDescription.fullDescription}\n\`\`\`\n` : ''}

## 5. Analisis Tag Video
- Skor Relevansi: ${data.tagsAnalysis.tagRelevanceScore}/100
- Tag Terdeteksi: ${data.tagsAnalysis.existingTags.map(t => t.tag).join(', ')}
- Rekomendasi Tag Baru: ${data.tagsAnalysis.recommendedNewTags.join(', ')}
- Catatan Kata Kunci: ${data.tagsAnalysis.insights}

## 6. Analisis Hashtag (#)
- Tagar Teratas: ${data.hashtagsAnalysis.topHashtags.join(' ')}
- Rata-rata per Video: ${data.hashtagsAnalysis.averagePerVideo}
- Jangkauan: ${data.hashtagsAnalysis.reachLevel}
- Rekomendasi Tagar Baru: ${data.hashtagsAnalysis.recommendedHashtags.join(' ')}

## 7. Analisis Jam Tayang
- Waktu Optimal (WIB): ${data.uploadSchedule.optimalTimeWindowWIB}
- Hari Terbaik: ${data.uploadSchedule.bestDays.join(', ')}
- Frekuensi: ${data.uploadSchedule.frequency}
- Alasan Perilaku Audiens: ${data.uploadSchedule.audienceBehaviorReason}

## 8. Langkah Rekomendasi Prioritas
${data.actionableTips.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}
`;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdownReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `arz-metadata-${data.handle.replace('@', '')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadText = () => {
    const text = generateMarkdownReport();
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `arz-laporan-${data.handle.replace('@', '')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#1e1f20] rounded-xl max-w-xl w-full border border-[#333537] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d2f31]">
          <div>
            <h3 className="font-semibold text-white text-base">
              Ekspor Laporan Analisis Metadata
            </h3>
            <p className="text-xs text-[#9aa0a6]">
              {data.channelName} ({data.handle}) · &lt;/ Arz.Studio &gt;
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#9aa0a6] hover:text-white rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Preview */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#c4c7c5]">
              Pratinjau Ringkasan Dokumen:
            </label>
            <pre className="p-3 bg-[#131314] rounded-lg border border-[#333537] text-[11px] font-mono text-[#c4c7c5] leading-relaxed max-h-56 overflow-y-auto select-all whitespace-pre-wrap">
              {generateMarkdownReport()}
            </pre>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-white text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Semua</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadText}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-[#131314] text-[#f0f2f5] border border-[#333537] rounded-lg hover:bg-[#282a2c] transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-neutral-400" />
              <span>Unduh .MD</span>
            </button>

            <button
              onClick={handleDownloadJson}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-[#131314] text-[#f0f2f5] border border-[#333537] rounded-lg hover:bg-[#282a2c] transition-colors cursor-pointer"
            >
              <FileJson className="w-3.5 h-3.5 text-neutral-400" />
              <span>Unduh JSON</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#131314] border-t border-[#2d2f31] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-[#9aa0a6] hover:text-white transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

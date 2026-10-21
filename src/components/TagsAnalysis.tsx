import React, { useState } from 'react';
import { TagsAnalysisData } from '../types/metadata';
import { Tags, Copy, Check, Plus, Lightbulb } from 'lucide-react';

interface TagsAnalysisProps {
  data: TagsAnalysisData;
}

export const TagsAnalysis: React.FC<TagsAnalysisProps> = ({ data }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  const categories = [
    { id: 'all', label: 'Semua Tag' },
    { id: 'genre', label: 'Genre Musik' },
    { id: 'brand', label: 'Branding Chanel' },
    { id: 'discovery', label: 'Pencarian Luas (SEO)' },
    { id: 'artist', label: 'Artis / Karya' },
  ];

  const filteredTags = selectedCategory === 'all'
    ? data.existingTags
    : data.existingTags.filter(t => t.category === selectedCategory);

  const handleCopyAll = () => {
    const allTagsString = data.existingTags.map(t => t.tag).join(', ');
    navigator.clipboard.writeText(allTagsString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categoryLabelMap: Record<string, string> = {
    genre: 'Genre',
    brand: 'Brand',
    discovery: 'Pencarian',
    artist: 'Artis',
  };

  return (
    <div className="bg-[#1e1f20] rounded-xl border border-[#2d2f31] p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#2d2f31] gap-2">
        <div className="flex items-center gap-2">
          <Tags className="w-5 h-5 text-neutral-300" />
          <h2 className="text-lg font-semibold text-[#f0f2f5] tracking-tight">
            Analisis Tag Video & Kata Kunci SEO
          </h2>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-[#9aa0a6]">
            Skor Relevansi Tag: <strong className="text-white font-mono">{data.tagRelevanceScore}/100</strong>
          </span>
          <span aria-hidden="true" className="text-neutral-700">·</span>
          <button
            onClick={handleCopyAll}
            className="text-[#f0f2f5] font-medium inline-flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors"
            title="Salin semua tag dengan format koma untuk ditempel ke YouTube Studio"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Semua Tag Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-neutral-400" />
                <span>Salin Format YouTube Studio</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Category Filter Segments */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-white text-neutral-900 font-semibold'
                  : 'bg-[#131314] text-[#9aa0a6] hover:text-[#f0f2f5] hover:bg-[#282a2c] border border-[#333537]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Tags List */}
      <div className="space-y-2">
        <div className="text-xs text-[#9aa0a6] flex items-center justify-between">
          <span>Menampilkan {filteredTags.length} kata kunci terdeteksi:</span>
          <span className="text-neutral-500">Relevansi Algoritma</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filteredTags.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-lg border border-[#333537] bg-[#131314] hover:bg-[#282a2c] transition-colors text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-[#f0f2f5] font-medium">{item.tag}</span>
                <span className="text-[#9aa0a6] text-[11px]">
                  ({categoryLabelMap[item.category] || item.category})
                </span>
              </div>
              <div className="flex items-center gap-1 font-mono text-[#9aa0a6] text-[11px]">
                <span>{item.relevance}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended New Opportunity Tags */}
      {data.recommendedNewTags && data.recommendedNewTags.length > 0 && (
        <div className="pt-4 border-t border-[#2d2f31] space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Rekomendasi Tag Tambahan untuk Ekspansi Jangkauan (Opportunity Tags)</span>
          </div>
          <p className="text-xs text-[#9aa0a6]">
            Kata kunci bervolume pencarian tinggi yang belum dimanfaatkan secara optimal oleh chanel ini:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {data.recommendedNewTags.map((tag, idx) => (
              <span
                key={idx}
                className="font-mono text-xs text-[#e3e3e3] bg-[#131314] border border-[#333537] px-2.5 py-1 rounded"
              >
                + {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      {data.insights && (
        <div className="p-3 bg-[#131314] rounded-lg border border-[#333537] flex items-start gap-2 text-xs text-[#c4c7c5]">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>{data.insights}</span>
        </div>
      )}
    </div>
  );
};

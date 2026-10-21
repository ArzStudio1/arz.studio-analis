import React, { useState } from 'react';
import { UploadDescriptionData } from '../types/metadata';
import { 
  FileCode2, 
  Check, 
  X, 
  Layers, 
  Compass, 
  ArrowUpRight, 
  Copy, 
  CheckCheck, 
  Scissors, 
  Clock, 
  Link2, 
  ShieldCheck, 
  FileText, 
  Sparkles, 
  AlertCircle, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  Music2, 
  Users2 
} from 'lucide-react';

interface UploadDescAnalysisProps {
  data: UploadDescriptionData;
}

export const UploadDescAnalysis: React.FC<UploadDescAnalysisProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'viewer' | 'sections' | 'hook' | 'checklist' | 'template'>('viewer');
  const [copiedDescription, setCopiedDescription] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [highlightFilter, setHighlightFilter] = useState<'all' | 'hook' | 'credits' | 'lyrics' | 'timestamps' | 'links'>('all');
  const [isExpanded, setIsExpanded] = useState(false);

  const fullText = data.fullDescription || '';
  const charLimit = 5000; // YouTube description character limit
  const charPercent = Math.min(Math.round((data.characterCount / charLimit) * 100), 100);

  const handleCopyDescription = () => {
    if (!fullText) return;
    navigator.clipboard.writeText(fullText);
    setCopiedDescription(true);
    setTimeout(() => setCopiedDescription(false), 2200);
  };

  const handleCopyTemplate = () => {
    const template = data.recommendedTemplate || fullText;
    if (!template) return;
    navigator.clipboard.writeText(template);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2200);
  };

  // Cut text into Above-the-fold (<180 chars) and Below-the-fold
  const hookThreshold = 180;
  const aboveFoldText = fullText.slice(0, hookThreshold);
  const belowFoldText = fullText.slice(hookThreshold);

  return (
    <div className="bg-[#1e1f20] rounded-xl border border-[#2d2f31] p-5 sm:p-6 space-y-6 shadow-sm">
      {/* Main Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-[#2d2f31] gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2">
              <FileCode2 className="w-5 h-5 text-neutral-300 shrink-0" />
              <h2 className="text-lg font-semibold text-[#f0f2f5] tracking-tight">
                Analisis Deskripsi Unggahan Video (Upload Description)
              </h2>
            </div>
            {data.optimizationScore !== undefined && (
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-medium whitespace-nowrap shadow-sm shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Skor Optimasi: {data.optimizationScore}%
              </span>
            )}
          </div>
          <p className="text-xs text-[#9aa0a6]">
            Pembedahan menyeluruh isi teks unggahan, anatomi hook, lirik, kredit produksi, timestamps, dan tautan streaming.
          </p>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#9aa0a6]">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#131314] border border-[#333537]">
            {data.hasTimestamps ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <X className="w-3.5 h-3.5 text-neutral-500" />
            )}
            Timestamps
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#131314] border border-[#333537]">
            {data.hasMusicCredits ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <X className="w-3.5 h-3.5 text-neutral-500" />
            )}
            Kredit Musik
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#131314] border border-[#333537]">
            {data.hasLyrics ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <X className="w-3.5 h-3.5 text-neutral-500" />
            )}
            Lirik Lengkap
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#131314] border border-[#333537]">
            {data.hasExternalLinks ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <X className="w-3.5 h-3.5 text-neutral-500" />
            )}
            Tautan DSP
          </span>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-[#2d2f31] text-xs font-medium [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <button
          onClick={() => setActiveTab('viewer')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'viewer'
              ? 'bg-[#2d2f31] text-white font-semibold'
              : 'text-[#9aa0a6] hover:text-[#e3e3e3] hover:bg-[#282a2c]'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Deskripsi Lengkap Unggahan</span>
          <span className="ml-1 text-[10px] font-mono opacity-70">({data.characterCount} char)</span>
        </button>

        <button
          onClick={() => setActiveTab('hook')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'hook'
              ? 'bg-[#2d2f31] text-white font-semibold'
              : 'text-[#9aa0a6] hover:text-[#e3e3e3] hover:bg-[#282a2c]'
          }`}
        >
          <Scissors className="w-3.5 h-3.5" />
          <span>Hook 150 Karakter (Above-Fold)</span>
        </button>

        <button
          onClick={() => setActiveTab('sections')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'sections'
              ? 'bg-[#2d2f31] text-white font-semibold'
              : 'text-[#9aa0a6] hover:text-[#e3e3e3] hover:bg-[#282a2c]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Pembedahan Anatomi Bagian</span>
        </button>

        <button
          onClick={() => setActiveTab('checklist')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'checklist'
              ? 'bg-[#2d2f31] text-white font-semibold'
              : 'text-[#9aa0a6] hover:text-[#e3e3e3] hover:bg-[#282a2c]'
          }`}
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Audit Checklist (7 Elemen)</span>
        </button>

        <button
          onClick={() => setActiveTab('template')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'template'
              ? 'bg-[#2d2f31] text-white font-semibold'
              : 'text-[#9aa0a6] hover:text-[#e3e3e3] hover:bg-[#282a2c]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Template Siap Salin</span>
        </button>
      </div>

      {/* TAB 1: DESKRIPSI LENGKAP UNGGAHAN (FULL VIEWER) */}
      {activeTab === 'viewer' && (
        <div className="space-y-4">
          {/* Metrics bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#131314] p-3 rounded-lg border border-[#333537]">
              <span className="text-[11px] text-[#9aa0a6] block">Karakter Terpakai</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base font-bold text-white font-mono">{data.characterCount.toLocaleString('id-ID')}</span>
                <span className="text-[11px] text-neutral-500 font-mono">/ 5.000 max</span>
              </div>
              <div className="w-full h-1.5 bg-[#252729] rounded-full mt-2 overflow-hidden">
                <div
                  style={{ width: `${charPercent}%` }}
                  className={`h-full ${charPercent > 80 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                />
              </div>
            </div>

            <div className="bg-[#131314] p-3 rounded-lg border border-[#333537]">
              <span className="text-[11px] text-[#9aa0a6] block">Total Kata</span>
              <span className="text-base font-bold text-white font-mono mt-0.5 block">
                {data.wordCount.toLocaleString('id-ID')} <span className="text-xs text-[#9aa0a6] font-normal">kata</span>
              </span>
              <span className="text-[10px] text-neutral-500 block mt-1">Ideal: 150 - 400 kata</span>
            </div>

            <div className="bg-[#131314] p-3 rounded-lg border border-[#333537]">
              <span className="text-[11px] text-[#9aa0a6] block">Tautan Terdeteksi</span>
              <span className="text-base font-bold text-white font-mono mt-0.5 block">
                {data.detectedLinksList ? data.detectedLinksList.length : (data.hasExternalLinks ? 'Ada' : '0')} <span className="text-xs text-[#9aa0a6] font-normal">link</span>
              </span>
              <span className="text-[10px] text-neutral-500 block mt-1">DSP, Sosmed & Smartlink</span>
            </div>

            <div className="bg-[#131314] p-3 rounded-lg border border-[#333537]">
              <span className="text-[11px] text-[#9aa0a6] block">Babak / Timestamps</span>
              <span className="text-base font-bold text-white font-mono mt-0.5 block">
                {data.detectedChapters && data.detectedChapters.length > 0 ? `${data.detectedChapters.length} segmen` : (data.hasTimestamps ? 'Terdeteksi' : 'Belum Ada')}
              </span>
              <span className="text-[10px] text-neutral-500 block mt-1">Google Key Moments</span>
            </div>
          </div>

          {/* Action bar above text viewer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-[#9aa0a6]">
              <FileText className="w-4 h-4 text-neutral-400" />
              <span className="font-medium text-[#c4c7c5]">Teks Deskripsi Lengkap Asli Video:</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyDescription}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2d2f31] hover:bg-[#383a3d] text-white text-xs font-medium rounded-lg transition-colors border border-[#3e4042] shadow-sm"
                title="Salin seluruh teks deskripsi ke papan klip"
              >
                {copiedDescription ? (
                  <>
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Tersalin ke Klip!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-neutral-300" />
                    <span>Salin Deskripsi Lengkap</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="px-2.5 py-1.5 bg-[#131314] hover:bg-[#252729] text-[#c4c7c5] hover:text-white text-xs rounded-lg transition-colors border border-[#333537]"
                title={isExpanded ? 'Kecilkan Tampilan' : 'Buka Penuh'}
              >
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Full description display box with line numbers and YouTube Above-The-Fold Divider */}
          <div className={`relative bg-[#131314] rounded-lg border border-[#333537] overflow-hidden transition-all duration-300 ${
            isExpanded ? 'max-h-none' : 'max-h-[500px]'
          } overflow-y-auto`}>
            
            {/* YouTube Above-The-Fold Visual Marker */}
            <div className="bg-[#1b1c1e] px-4 py-2 border-b border-[#2d2f31] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#9aa0a6]">
              <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                <Scissors className="w-3.5 h-3.5" />
                <span>Garis Potong YouTube (~180 karakter pertama terlihat sebelum tombol "Lebih Banyak / Show More")</span>
              </span>
              <span className="font-mono text-[10px] text-neutral-400">
                Above-fold: {aboveFoldText.length} char
              </span>
            </div>

            {/* Split Visual Text Area */}
            <div className="p-4 font-mono text-xs text-[#e3e3e3] leading-relaxed whitespace-pre-wrap selection:bg-neutral-700">
              {/* Highlight Above Fold */}
              <div className="bg-neutral-800/40 p-2.5 rounded border border-neutral-700/60 mb-3 relative group">
                <span className="absolute -top-2.5 right-2 px-1.5 py-0.5 bg-neutral-900 border border-neutral-700 rounded text-[9px] text-neutral-400 font-sans uppercase tracking-wider">
                  Bagian Terlihat Tanpa Klik (Above The Fold)
                </span>
                <span className="text-white font-medium">{aboveFoldText}</span>
              </div>

              {/* Dotted Cutoff separator */}
              <div className="relative my-3 flex items-center justify-center">
                <div className="w-full border-t border-dashed border-amber-500/40" />
                <span className="absolute px-2 bg-[#131314] text-[10px] font-sans text-amber-400/90 flex items-center gap-1 border border-amber-500/20 rounded-full">
                  <Scissors className="w-3 h-3" /> Tombol "Lebih Banyak / Show More" di YouTube
                </span>
              </div>

              {/* Below the fold content */}
              <div className="pt-2 text-neutral-300">
                {belowFoldText || '(Tidak ada teks lanjutan di bawah garis potong)'}
              </div>
            </div>

            {/* Fade overlay when collapsed */}
            {!isExpanded && fullText.length > 800 && (
              <div className="sticky bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#131314] to-transparent pointer-events-none flex items-end justify-center pb-2">
                <button
                  onClick={() => setIsExpanded(true)}
                  className="pointer-events-auto px-3 py-1 bg-[#252729] hover:bg-[#303235] text-white text-xs rounded-full border border-neutral-700 shadow-md flex items-center gap-1"
                >
                  <ChevronDown className="w-3.5 h-3.5" /> Tampilkan Semua Teks Deskripsi ({data.characterCount} Karakter)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ANALISIS HOOK 150-200 KARAKTER (ABOVE-THE-FOLD) */}
      {activeTab === 'hook' && (
        <div className="space-y-4">
          <div className="bg-[#131314] rounded-lg border border-[#333537] p-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#2d2f31] gap-2">
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-[#f0f2f5]">
                  Evaluasi Kalimat Pembuka (Above-the-Fold Hook)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#9aa0a6]">Skor Daya Tarik:</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  {data.aboveTheFoldHook?.score || 88} / 100
                </span>
              </div>
            </div>

            {/* Quoted Hook Text */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-[#9aa0a6] font-medium block">
                Teks yang Terbaca Penonton Sebelum Menekan "Show More" ({data.aboveTheFoldHook?.charCount || aboveFoldText.length} karakter):
              </span>
              <div className="p-3 bg-[#1e1f20] rounded-lg border border-[#333537] font-mono text-xs text-white leading-relaxed italic">
                "{data.aboveTheFoldHook?.previewText || aboveFoldText}"
              </div>
            </div>

            {/* Hook Assessment */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-[#c4c7c5] block">Analisis Dampak Algoritma & Konversi:</span>
              <p className="text-xs text-[#c4c7c5] leading-relaxed bg-[#1b1c1e] p-3 rounded-lg border border-[#2d2f31]">
                {data.aboveTheFoldHook?.assessment || data.ctaEvaluation}
              </p>
            </div>

            {/* Best practice tips for hook */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-2.5 rounded-lg bg-[#18191a] border border-[#2d2f31] space-y-1">
                <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Judul & Artis di Baris 1
                </span>
                <p className="text-[11px] text-[#9aa0a6] leading-snug">
                  Memastikan Google Video Search langsung memunculkan cuplikan relevan di hasil pencarian web.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#18191a] border border-[#2d2f31] space-y-1">
                <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Tautan Smartlink Utama
                </span>
                <p className="text-[11px] text-[#9aa0a6] leading-snug">
                  80%+ klik streaming terjadi di baris awal tanpa menunggu audiens membuka deskripsi penuh.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#18191a] border border-[#2d2f31] space-y-1">
                <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Hindari Spasi Kosong Awal
                </span>
                <p className="text-[11px] text-[#9aa0a6] leading-snug">
                  Jangan buang karakter awal berharga dengan salam pembuka panjang atau enter kosong berlebihan.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PEMBEDAHAN ANATOMI STRUKTUR PER BAGIAN */}
      {activeTab === 'sections' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#9aa0a6]">
            <span>Pemeriksaan 6 Bagian Fundamental Deskripsi Video Musik YouTube:</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {(data.breakdownSections || []).map((sec, idx) => (
              <div 
                key={idx}
                className="bg-[#131314] rounded-lg border border-[#333537] p-3.5 space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#f0f2f5] flex items-center gap-1.5">
                      {sec.type === 'hook' && <Scissors className="w-3.5 h-3.5 text-amber-400" />}
                      {sec.type === 'timestamps' && <Clock className="w-3.5 h-3.5 text-blue-400" />}
                      {sec.type === 'credits' && <Users2 className="w-3.5 h-3.5 text-purple-400" />}
                      {sec.type === 'lyrics' && <Music2 className="w-3.5 h-3.5 text-emerald-400" />}
                      {sec.type === 'links' && <Link2 className="w-3.5 h-3.5 text-cyan-400" />}
                      {sec.type === 'copyright' && <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />}
                      <span>{sec.title}</span>
                    </span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      sec.status === 'present'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {sec.status === 'present' ? 'Terdeteksi' : 'Disarankan'}
                    </span>
                  </div>

                  {/* Content snippet */}
                  <div className="p-2.5 bg-[#1b1c1e] rounded border border-[#2d2f31] font-mono text-[11px] text-[#e3e3e3] leading-relaxed line-clamp-2">
                    {sec.content}
                  </div>
                </div>

                <div className="pt-1 border-t border-[#252729] text-[11px] text-[#9aa0a6] leading-snug">
                  <strong className="text-[#c4c7c5] font-normal">Dampak SEO: </strong>
                  {sec.analysis}
                </div>
              </div>
            ))}
          </div>

          {/* Detected chapters detailed list if available */}
          {data.detectedChapters && data.detectedChapters.length > 0 && (
            <div className="p-4 bg-[#131314] rounded-lg border border-[#333537] space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#f0f2f5]">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>Babak / Timestamps Terdeteksi ({data.detectedChapters.length} Penanda):</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {data.detectedChapters.map((chap, cIdx) => (
                  <div key={cIdx} className="p-2 bg-[#1b1c1e] rounded border border-[#2d2f31] text-xs">
                    <span className="font-mono text-blue-400 font-medium block">{chap.time}</span>
                    <span className="text-[#c4c7c5] truncate block">{chap.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detected links detailed list if available */}
          {data.detectedLinksList && data.detectedLinksList.length > 0 && (
            <div className="p-4 bg-[#131314] rounded-lg border border-[#333537] space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#f0f2f5]">
                <Link2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Tautan Terdeteksi ({data.detectedLinksList.length} Tautan):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {data.detectedLinksList.map((link, lIdx) => (
                  <div key={lIdx} className="p-2.5 bg-[#1b1c1e] rounded border border-[#2d2f31] flex items-center justify-between gap-2 text-xs">
                    <div className="min-w-0">
                      <span className="font-medium text-white block truncate">{link.platform}</span>
                      <span className="text-[10px] text-neutral-400 truncate block font-mono">{link.url}</span>
                    </div>
                    <span className="text-[10px] text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded whitespace-nowrap">
                      {link.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: AUDIT CHECKLIST (7 ELEMEN WAJIB) */}
      {activeTab === 'checklist' && (
        <div className="space-y-4">
          <div className="p-4 bg-[#131314] rounded-lg border border-[#333537] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#2d2f31]">
              <div className="space-y-0.5">
                <h3 className="text-sm font-semibold text-[#f0f2f5] flex items-center gap-2">
                  <CheckCheck className="w-4 h-4 text-emerald-400" />
                  <span>Audit Kualitas 7 Elemen Wajib Deskripsi Video</span>
                </h3>
                <p className="text-xs text-[#9aa0a6]">
                  Standar baku YouTube Creator & Musik Label untuk memaksimalkan retensi dan pencarian organik.
                </p>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-[#9aa0a6]">Lolos Audit:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30">
                  {data.checklist ? data.checklist.filter(c => c.status).length : 6} / {data.checklist ? data.checklist.length : 7}
                </span>
              </div>
            </div>

            <div className="divide-y divide-[#252729]">
              {(data.checklist || []).map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-start gap-3">
                  <div className="mt-0.5">
                    {item.status ? (
                      <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                        <Check className="w-3 h-3" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
                        <AlertCircle className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-white">{item.item}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                        item.importance === 'Kritis' 
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : item.importance === 'Tinggi'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                      }`}>
                        {item.importance}
                      </span>
                    </div>
                    <p className="text-xs text-[#9aa0a6] mt-0.5 leading-snug">{item.feedback}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: TEMPLATE DESKRIPSI SIAP SALIN (BLUEPRINT) */}
      {activeTab === 'template' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-0.5">
              <h3 className="text-sm font-semibold text-[#f0f2f5] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Template Deskripsi Unggahan Profesional Siap Pakai</span>
              </h3>
              <p className="text-xs text-[#9aa0a6]">
                Format terstruktur siap salin langsung ke YouTube Studio untuk video berikutnya.
              </p>
            </div>

            <button
              onClick={handleCopyTemplate}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-semibold rounded-lg transition-colors shadow-sm"
              title="Salin template ini langsung ke clipboard"
            >
              {copiedTemplate ? (
                <>
                  <CheckCheck className="w-3.5 h-3.5 text-neutral-950" />
                  <span>Template Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-neutral-950" />
                  <span>Salin Template Siap Pakai</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 bg-[#131314] rounded-lg border border-[#333537] font-mono text-xs text-[#e3e3e3] leading-relaxed whitespace-pre-wrap selection:bg-neutral-700">
            {data.recommendedTemplate || data.fullDescription}
          </div>
        </div>
      )}

      {/* Unique Content vs Boilerplate Ratio Bar (Preserved & Enhanced) */}
      <div className="space-y-3 pt-3 border-t border-[#2d2f31]">
        <div className="flex items-center justify-between text-xs text-[#9aa0a6]">
          <span className="font-medium text-[#c4c7c5]">Rasio Konten Unik vs Template (Boilerplate)</span>
          <span className="font-mono">
            Unik: <strong className="text-white">{data.uniqueContentPercent}%</strong> · Template: {data.boilerplatePercent}%
          </span>
        </div>

        {/* Ratio bar */}
        <div className="h-2.5 w-full bg-[#131314] rounded-full overflow-hidden flex border border-[#333537]">
          <div
            style={{ width: `${data.uniqueContentPercent}%` }}
            className="bg-white h-full transition-all duration-500"
            title={`Konten Unik: ${data.uniqueContentPercent}%`}
          />
          <div
            style={{ width: `${data.boilerplatePercent}%` }}
            className="bg-neutral-600 h-full transition-all duration-500"
            title={`Boilerplate Template: ${data.boilerplatePercent}%`}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-[#9aa0a6]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span>Konten Spesifik Track / Video (Lirik, sinopsis, kredit unik)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-neutral-600" />
            <span>Template Standar (Socials, disclaimer, outro)</span>
          </div>
        </div>
      </div>

      {/* Sample Structure Blueprint */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-medium text-[#c4c7c5]">
          <Layers className="w-3.5 h-3.5 text-neutral-400" />
          <span>Alur Anatomi Deskripsi Rata-rata:</span>
        </div>
        <div className="p-3 bg-[#131314] rounded-lg border border-[#333537] font-mono text-xs text-[#e3e3e3] leading-relaxed overflow-x-auto">
          {data.sampleStructure}
        </div>
      </div>

      {/* CTA Audit & Structural Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#2d2f31]">
        <div className="space-y-2">
          <div className="text-xs font-semibold text-[#f0f2f5] flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-neutral-400" />
            <span>Audit Call-To-Action (CTA)</span>
          </div>
          <p className="text-xs text-[#c4c7c5] leading-relaxed bg-[#131314] p-3 rounded-lg border border-[#333537]">
            {data.ctaEvaluation}
          </p>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-semibold text-[#f0f2f5] flex items-center gap-1.5">
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
            <span>Praktik Terbaik Teramati</span>
          </div>
          <ul className="space-y-1.5 text-xs text-[#c4c7c5]">
            {data.structureNotes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-neutral-500 font-bold">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

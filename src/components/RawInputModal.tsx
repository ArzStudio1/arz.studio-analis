import React, { useState } from 'react';
import { X, Loader2, ArrowRight } from 'lucide-react';

interface RawInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

export const RawInputModal: React.FC<RawInputModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [text, setText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#1e1f20] rounded-xl max-w-xl w-full border border-[#333537] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d2f31]">
          <div>
            <h3 className="font-semibold text-white text-base">
              Analisis Teks Metadata Bebas
            </h3>
            <p className="text-xs text-[#9aa0a6]">
              Tempel draf deskripsi chanel, deskripsi video, atau daftar tag untuk dianalisis
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#9aa0a6] hover:text-white rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-medium text-[#c4c7c5]">
                Data Metadata Teks:
              </label>
            </div>
            <textarea
              rows={8}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Tempel teks deskripsi chanel, lirik, daftar tag (#tag1, tag2), atau jadwal tayang..."
              className="w-full p-3 bg-[#131314] border border-[#333537] text-xs text-[#f0f2f5] placeholder-[#6b7280] font-mono rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 resize-y leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-[#9aa0a6] font-mono">
              {text.trim().split(/\s+/).filter(Boolean).length} kata
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-medium text-[#9aa0a6] hover:text-white transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading || !text.trim()}
                className="px-4 py-2 bg-white hover:bg-neutral-200 disabled:bg-[#282a2c] disabled:text-[#6b7280] text-neutral-900 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-900" />
                    <span>Menganalisis...</span>
                  </>
                ) : (
                  <>
                    <span>Mulai Analisis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

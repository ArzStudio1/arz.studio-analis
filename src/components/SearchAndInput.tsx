import React, { useState } from 'react';
import { Search, Loader2, ArrowRight, FileText, RotateCcw } from 'lucide-react';

interface SearchAndInputProps {
  onSearch: (input: string) => void;
  onOpenRawInputModal: () => void;
  onReset: () => void;
  hasData: boolean;
  isLoading: boolean;
}

export const SearchAndInput: React.FC<SearchAndInputProps> = ({
  onSearch,
  onOpenRawInputModal,
  onReset,
  hasData,
  isLoading,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  return (
    <div className="bg-[#131314] border-b border-[#2d2f31] pb-5 pt-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Main search input bar */}
          <form onSubmit={handleSubmit} className="relative flex-1 max-w-2xl">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ketik handle chanel (@nama_chanel), link YouTube, atau nama artis..."
                className="w-full pl-10 pr-28 py-2.5 bg-[#1e1f20] border border-[#333537] text-sm text-[#f0f2f5] placeholder-[#6b7280] rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 transition-colors"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="absolute right-1.5 px-3.5 py-1.5 bg-white hover:bg-neutral-200 disabled:bg-[#282a2c] disabled:text-[#6b7280] text-neutral-900 text-xs font-semibold rounded-md transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-900" />
                    <span>Menganalisis...</span>
                  </>
                ) : (
                  <>
                    <span>Analisis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Secondary workflow actions */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={onOpenRawInputModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#e3e3e3] bg-[#1e1f20] hover:bg-[#282a2c] border border-[#333537] rounded-lg transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-neutral-400" />
              <span>Tempel Teks Draf</span>
            </button>

            {hasData && (
              <button
                type="button"
                onClick={() => {
                  setInputValue('');
                  onReset();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#9aa0a6] hover:text-[#f0f2f5] bg-[#1e1f20] border border-[#333537] rounded-lg hover:bg-[#282a2c] transition-colors cursor-pointer"
                title="Bersihkan hasil dan uji chanel baru"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset / Bersihkan</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

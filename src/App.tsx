/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChannelMetadataAnalysis } from './types/metadata';
import { Header } from './components/Header';
import { SearchAndInput } from './components/SearchAndInput';
import { EmptyStateWorkflow } from './components/EmptyStateWorkflow';
import { ChannelOverview } from './components/ChannelOverview';
import { GenreAnalysis } from './components/GenreAnalysis';
import { ChannelDescAnalysis } from './components/ChannelDescAnalysis';
import { UploadDescAnalysis } from './components/UploadDescAnalysis';
import { TagsAnalysis } from './components/TagsAnalysis';
import { HashtagsAnalysis } from './components/HashtagsAnalysis';
import { ScheduleAnalysis } from './components/ScheduleAnalysis';
import { ScoreAndTips } from './components/ScoreAndTips';
import { ExportModal } from './components/ExportModal';
import { RawInputModal } from './components/RawInputModal';
import { YouTubeProfileCard } from './components/YouTubeProfileCard';
import { 
  Disc3, 
  FileText, 
  FileCode2, 
  Tags, 
  Hash, 
  Clock, 
  Lightbulb, 
  LayoutGrid,
  AlertCircle
} from 'lucide-react';

export default function App() {
  // Start with completely clean state (no preloaded dummy data)
  const [currentData, setCurrentData] = useState<ChannelMetadataAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isRawInputOpen, setIsRawInputOpen] = useState(false);

  // Reset to clean empty state
  const handleReset = () => {
    setCurrentData(null);
    setActiveTab('all');
    setErrorMessage(null);
  };

  // Handle Query / Search Analysis
  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelInput: query }),
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi server analitik metadata.');
      }

      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        setCurrentData(resJson.data);
      } else {
        throw new Error(resJson.error || 'Terjadi kesalahan saat memproses metadata.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Gagal memproses data chanel. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Raw Text Modal Submit
  const handleRawTextSubmit = async (text: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setIsRawInputOpen(false);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metadataText: text }),
      });

      if (!response.ok) {
        throw new Error('Gagal memproses teks metadata.');
      }

      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        setCurrentData(resJson.data);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Gagal menganalisis teks.');
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation tabs with clean minimalist style
  const navTabs = [
    { id: 'all', label: 'Semua Ikhtisar', icon: LayoutGrid },
    { id: 'genre', label: 'Genre Musik', icon: Disc3 },
    { id: 'channel-desc', label: 'Deskripsi Chanel', icon: FileText },
    { id: 'upload-desc', label: 'Deskripsi Upload', icon: FileCode2 },
    { id: 'tags', label: 'Tag Video', icon: Tags },
    { id: 'hashtags', label: 'Tagar (#)', icon: Hash },
    { id: 'schedule', label: 'Jam Tayang', icon: Clock },
    { id: 'tips', label: 'Audit & Tips', icon: Lightbulb },
  ];

  return (
    <div className="min-h-screen bg-[#131314] flex flex-col text-[#f0f2f5]">
      {/* Top Navigation */}
      <Header
        onOpenRawInputModal={() => setIsRawInputOpen(true)}
        onOpenExportModal={() => setIsExportOpen(true)}
        hasData={currentData !== null}
      />

      {/* When data is present, show the top quick input bar to analyze another channel */}
      {currentData && (
        <SearchAndInput
          onSearch={handleSearch}
          onOpenRawInputModal={() => setIsRawInputOpen(true)}
          onReset={handleReset}
          hasData={true}
          isLoading={isLoading}
        />
      )}

      {/* Error notification if any */}
      {errorMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 w-full">
          <div className="p-3 bg-red-950/50 border border-red-800/60 rounded-lg text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {currentData ? (
        <>
          {/* YouTube Channel Profile Header Card */}
          <YouTubeProfileCard
            profile={currentData.channelProfile}
            fallbackName={currentData.channelName}
            fallbackHandle={currentData.handle}
            subscribersEstimate={currentData.subscribersEstimate}
            totalVideosEstimate={currentData.totalVideosEstimate}
            overallScore={currentData.overallScore}
          />

          {/* Detailed Overview & Source Verification Banner */}
          <ChannelOverview data={currentData} />

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 space-y-6">
            {/* Section Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#2d2f31]">
              {navTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-md transition-colors cursor-pointer shrink-0 border-b-2 -mb-[2px] ${
                      isActive
                        ? 'border-white text-white bg-[#1e1f20]'
                        : 'border-transparent text-[#9aa0a6] hover:text-[#f0f2f5]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-[#9aa0a6]" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Content Views */}
            {activeTab === 'all' && (
              <div className="space-y-6">
                <GenreAnalysis data={currentData.musicGenre} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ChannelDescAnalysis data={currentData.channelDescription} />
                  <UploadDescAnalysis data={currentData.uploadDescription} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <TagsAnalysis data={currentData.tagsAnalysis} />
                  <HashtagsAnalysis data={currentData.hashtagsAnalysis} />
                </div>
                <ScheduleAnalysis data={currentData.uploadSchedule} />
                <ScoreAndTips score={currentData.overallScore} tips={currentData.actionableTips} />
              </div>
            )}

            {activeTab === 'genre' && (
              <GenreAnalysis data={currentData.musicGenre} />
            )}

            {activeTab === 'channel-desc' && (
              <ChannelDescAnalysis data={currentData.channelDescription} />
            )}

            {activeTab === 'upload-desc' && (
              <UploadDescAnalysis data={currentData.uploadDescription} />
            )}

            {activeTab === 'tags' && (
              <TagsAnalysis data={currentData.tagsAnalysis} />
            )}

            {activeTab === 'hashtags' && (
              <HashtagsAnalysis data={currentData.hashtagsAnalysis} />
            )}

            {activeTab === 'schedule' && (
              <ScheduleAnalysis data={currentData.uploadSchedule} />
            )}

            {activeTab === 'tips' && (
              <ScoreAndTips score={currentData.overallScore} tips={currentData.actionableTips} />
            )}
          </main>
        </>
      ) : (
        /* Empty State / Workflow Introduction */
        <main className="w-full flex-1">
          <EmptyStateWorkflow
            onSearch={handleSearch}
            onOpenRawInputModal={() => setIsRawInputOpen(true)}
            isLoading={isLoading}
          />
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-[#2d2f31] bg-[#131314] py-6 text-xs text-[#9aa0a6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#f0f2f5] font-mono">&lt;/ Arz.Studio &gt;</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span>Platform Analisis Metadata Chanel & Video Musik YouTube</span>
          </div>
          <div className="flex items-center gap-4 text-[#9aa0a6]">
            <span>Standar SEO YouTube & Algoritma Penelusuran</span>
            <span aria-hidden="true" className="text-neutral-700">·</span>
            <span>© 2026</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {currentData && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          data={currentData}
        />
      )}

      <RawInputModal
        isOpen={isRawInputOpen}
        onClose={() => setIsRawInputOpen(false)}
        onSubmit={handleRawTextSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}

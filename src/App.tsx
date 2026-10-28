import { useState } from 'react';
import { 
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
  const [currentData, setCurrentData] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [listInputOpen, setListInputOpen] = useState(false);
  const [listDraftOpen, setListDraftOpen] = useState(false);

  const handleReset = () => {
    setCurrentData(null);
    setActiveTab('all');
    setErrorMessage(null);
  };

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelInput: query }),
      });

      const resJson = await response.json();
      
      if (resJson.success && resJson.data) {
        setCurrentData(resJson.data);
      } else {
        throw new Error(resJson.error || 'Terjadi kesalahan saat memproses metadata.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Gagal memproses data kanal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubtest = async (text: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setListInputOpen(false);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metadataInput: text }),
      });

      const resJson = await response.json();

      if (resJson.success && resJson.data) {
        setCurrentData(resJson.data);
      } else {
        throw new Error(resJson.error || 'Gagal memproses teks metadata.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Gagal memproses teks metadata. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-4">
      <header className="w-full max-w-4xl py-6 flex flex-col items-center border-b border-slate-800 mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-emerald-400">Arz Studio - Analisis Metadata YouTube</h1>
        <p className="text-sm text-slate-400 mt-1">Sistem analisis konten, tag, dan metadata otomatis berbasis Gemini AI</p>
      </header>

      <main className="w-full max-w-4xl flex flex-col gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col gap-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            Masukkan Link atau Data YouTube
          </h2>
          
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Tempel link video atau kanal YouTube di sini..."
              id="channelInput"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = (e.target as HTMLInputElement).value;
                  if (val) handleSearch(val);
                }
              }}
            />
            <button 
              onClick={() => {
                const input = document.getElementById('channelInput') as HTMLInputElement;
                if (input && input.value) handleSearch(input.value);
              }}
              disabled={isLoading}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors"
            >
              {isLoading ? 'Menganalisis...' : 'Analisis'}
            </button>
          </div>

          {errorMessage && (
            <div className="bg-rose-950/50 border border-rose-800/50 rounded-lg p-3 text-rose-300 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {currentData && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h3 className="font-semibold text-emerald-400">Hasil Analisis Metadata</h3>
              <button 
                onClick={handleReset}
                className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-md text-slate-300"
              >
                Reset
              </button>
            </div>
            <pre className="bg-slate-950 p-4 rounded-lg text-xs overflow-x-auto text-slate-300 font-mono">
              {JSON.stringify(currentData, null, 2)}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}

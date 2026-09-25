import React, { useState } from 'react';
import { X, RefreshCw, Check, AlertCircle, FileSpreadsheet, ExternalLink, Upload, ShieldCheck } from 'lucide-react';
import { normalizeGoogleSheetCsvUrl, parseCSVText, mapRowsToProducts } from '../utils/csvParser';
import { Product } from '../types';

interface SheetSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl: string;
  onSaveUrl: (url: string) => Promise<void>;
  onLoadCustomProducts: (products: Product[]) => void;
  onResetDefault: () => void;
  isLoading: boolean;
}

export const SheetSettingsModal: React.FC<SheetSettingsModalProps> = ({
  isOpen,
  onClose,
  currentUrl,
  onSaveUrl,
  onLoadCustomProducts,
  onResetDefault,
  isLoading,
}) => {
  const [urlInput, setUrlInput] = useState<string>(currentUrl);
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [previewCount, setPreviewCount] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      setTestStatus('error');
      setErrorMessage('Please enter a valid Google Sheet CSV URL.');
      return;
    }

    try {
      setTestStatus('idle');
      setErrorMessage('');
      await onSaveUrl(urlInput.trim());
      setTestStatus('success');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setTestStatus('error');
      setErrorMessage(err.message || 'Failed to fetch CSV from this URL. Make sure it is published to web.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) throw new Error('File is empty');
        const rows = parseCSVText(text);
        if (rows.length === 0) throw new Error('No rows found in CSV');
        const products = mapRowsToProducts(rows);
        if (products.length === 0) throw new Error('Could not parse products from CSV');
        onLoadCustomProducts(products);
        setPreviewCount(products.length);
        setTestStatus('success');
        setTimeout(() => {
          onClose();
        }, 1400);
      } catch (err: any) {
        setTestStatus('error');
        setErrorMessage(err.message || 'Invalid CSV format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg bg-[#141414] border border-[#242424] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#0A0A0A] hover:bg-black text-zinc-400 hover:text-white flex items-center justify-center border border-[#242424] transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-lg text-white">
              Google Sheet CSV Sync
            </h3>
            <p className="text-xs text-zinc-400 font-body">
              Connect your published live catalog spreadsheet
            </p>
          </div>
        </div>

        {/* Sync Form */}
        <form onSubmit={handleSync} className="space-y-4">
          <div>
            <label className="block text-xs font-heading font-bold text-zinc-300 mb-1.5">
              Published Google Sheet CSV Link:
            </label>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                setTestStatus('idle');
                setErrorMessage('');
              }}
              placeholder="https://docs.google.com/spreadsheets/d/e/.../pub?output=csv"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0A] border border-[#242424] focus:border-[#D4AF37] text-xs text-white placeholder-zinc-600 focus:outline-none transition font-mono"
            />
          </div>

          {/* Status feedback */}
          {testStatus === 'success' && (
            <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-700/60 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {previewCount
                  ? `Successfully imported ${previewCount} products from CSV!`
                  : 'Connected to Google Sheet and refreshed inventory!'}
              </span>
            </div>
          )}

          {testStatus === 'error' && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2.5 pt-1">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#e5c158] text-black font-heading font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Syncing...' : 'Save & Sync Products'}</span>
            </button>
          </div>
        </form>

        {/* Or direct CSV file upload option */}
        <div className="mt-5 pt-5 border-t border-[#242424]">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
            <span>Or load directly from a local CSV file:</span>
          </div>
          <label className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#0A0A0A] border border-dashed border-[#333] hover:border-[#D4AF37] text-zinc-300 hover:text-white text-xs font-heading font-semibold transition cursor-pointer">
            <Upload className="w-4 h-4 text-[#D4AF37]" />
            <span>Select .CSV File from Device</span>
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Publishing instructions */}
        <div className="mt-5 p-3.5 rounded-2xl bg-[#0A0A0A] border border-[#242424] text-[11px] text-zinc-400 space-y-1.5">
          <div className="font-heading font-bold text-white flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>How to publish your Google Sheet:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-zinc-400 leading-relaxed font-body">
            <li>Open your Google Sheet with headers: <code className="text-zinc-300">ID, NAME, CATEGORY, PRICE, ORIGINAL PRICE, SIZES, STOCK, IMAGE, DESCRIPTION, TAGS</code></li>
            <li>Click <strong>File</strong> → <strong>Share</strong> → <strong>Publish to web</strong>.</li>
            <li>Select <strong>Entire Document</strong> (or Sheet1) and choose <strong>Comma-separated values (.csv)</strong>.</li>
            <li>Click <strong>Publish</strong> and copy the generated link into the box above.</li>
          </ol>
        </div>

        {/* Reset button */}
        <div className="mt-4 flex justify-between items-center text-xs">
          <button
            onClick={() => {
              onResetDefault();
              setUrlInput('');
              setTestStatus('success');
              setTimeout(onClose, 1000);
            }}
            className="text-zinc-500 hover:text-zinc-300 transition text-[11px] cursor-pointer"
          >
            Reset to built-in template catalog
          </button>
        </div>
      </div>
    </div>
  );
};

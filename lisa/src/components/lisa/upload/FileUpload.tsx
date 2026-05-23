"use client";

import React, { useState, useCallback } from 'react';
import { Upload, FileText, X, Table, ExternalLink } from 'lucide-react';
import Papa from 'papaparse';
import { motion, AnimatePresence } from 'framer-motion';

interface Lead {
  name: string;
  phone: string;
  [key: string]: any;
}

export default function FileUpload({ onLeadsLoaded }: { onLeadsLoaded: (leads: Lead[]) => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [sheetUrl, setSheetUrl] = useState('');
  const [preview, setPreview] = useState<Lead[]>([]);

  const handleCsvParse = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        const data = results.data as Lead[];
        setPreview(data.slice(0, 5));
        onLeadsLoaded(data);
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      handleCsvParse(selectedFile);
    }
  };

  const handleSheetFetch = async () => {
    if (!sheetUrl) return;
    // Simple logic: Convert Google Sheet URL to CSV export link
    // Example: https://docs.google.com/spreadsheets/d/ID/edit -> /export?format=csv
    try {
      const match = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (match && match[1]) {
        const csvUrl = `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv`;
        const response = await fetch(csvUrl);
        const csvText = await response.text();
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results: any) => {
            const data = results.data as Lead[];
            setPreview(data.slice(0, 5));
            onLeadsLoaded(data);
          },
        });
      }
    } catch (error) {
      console.error("Failed to fetch sheet", error);
    }
  };

  return (
    <div className="space-y-6">
      <div 
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer
          ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-neutral-800 hover:border-neutral-700 bg-neutral-900/50'}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const droppedFile = e.dataTransfer.files[0];
          if (droppedFile) {
            setFile(droppedFile);
            handleCsvParse(droppedFile);
          }
        }}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <input 
          id="file-upload" 
          type="file" 
          accept=".csv" 
          className="hidden" 
          onChange={handleFileChange} 
        />
        
        <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mb-4">
          <Upload className="text-neutral-400 w-6 h-6" />
        </div>
        
        <h3 className="text-lg font-medium mb-1">Upload Leads (CSV)</h3>
        <p className="text-neutral-500 text-sm">Drag and drop your file here or click to browse</p>
      </div>

      <div className="flex gap-2">
        <input 
          type="text"
          placeholder="Or paste Google Sheet Link..."
          className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          value={sheetUrl}
          onChange={(e) => setSheetUrl(e.target.value)}
        />
        <button 
          onClick={handleSheetFetch}
          className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Fetch
        </button>
      </div>

      <AnimatePresence>
        {preview.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass-effect rounded-2xl overflow-hidden"
          >
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Table className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium">Preview (First 5 leads)</span>
              </div>
              <button onClick={() => { setPreview([]); setFile(null); setSheetUrl(''); }} className="text-neutral-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-800/50 text-neutral-400 font-normal">
                  <tr>
                    {Object.keys(preview[0]).map(key => (
                      <th key={key} className="px-4 py-2 capitalize font-normal">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {preview.map((lead, i) => (
                    <tr key={i} className="hover:bg-neutral-800/30">
                      {Object.values(lead).map((val: any, j) => (
                        <td key={j} className="px-4 py-2 text-neutral-300">{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

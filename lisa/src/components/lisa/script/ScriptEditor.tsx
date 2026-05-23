"use client";

import React, { useState } from 'react';
import { Send, Plus, Mic, Image as ImageIcon, Pencil, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ScriptEditor({ onScriptSave }: { onScriptSave: (script: string) => void }) {
  const [script, setScript] = useState('');

  const handleSend = () => {
    if (!script.trim()) return;
    onScriptSave(script);
    // Logic to update Vapi assistant prompt via API would go here
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="relative group">
        <div className="glass-effect rounded-[28px] p-2 pr-4 pl-3 flex flex-col gap-2 transition-all duration-300 focus-within:ring-1 focus-within:ring-neutral-700">
          
          <textarea 
            rows={1}
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Write your AI script here (e.g., 'Hello, I am Lisa calling from...')"
            className="w-full bg-transparent border-none resize-none px-4 py-3 text-neutral-200 placeholder:text-neutral-500 focus:outline-none min-h-[56px] max-h-[300px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-1">
              <button className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-neutral-400">
                <Plus className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-neutral-400">
                <ImageIcon className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-neutral-400">
                <Globe className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-neutral-400">
                <Mic className="w-5 h-5" />
              </button>
              <button 
                onClick={handleSend}
                disabled={!script.trim()}
                className={`p-2 rounded-full transition-all duration-300 ${script.trim() ? 'bg-white text-black hover:bg-neutral-200' : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'}`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-800 text-xs text-neutral-400 hover:bg-neutral-900 transition-colors">
                <ImageIcon className="w-3.5 h-3.5" />
                Create an image
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-800 text-xs text-neutral-400 hover:bg-neutral-900 transition-colors">
                <Pencil className="w-3.5 h-3.5" />
                Write or edit
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-800 text-xs text-neutral-400 hover:bg-neutral-900 transition-colors">
                <Globe className="w-3.5 h-3.5" />
                Look something up
            </button>
        </div>
      </div>
    </div>
  );
}

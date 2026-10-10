import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2 } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] max-w-sm w-[90%] pointer-events-none transition-all duration-300 animate-in fade-in slide-in-from-top-4">
      <div className="bg-[#1c1c17]/95 text-[#fcf9f1] backdrop-blur-md px-4 py-2.5 rounded-full shadow-lg flex items-center justify-center gap-2 text-center text-sm font-medium border border-[#e5e2da]/20">
        <CheckCircle2 className="w-4 h-4 text-[#cfe9d3] shrink-0" />
        <span className="truncate">{toastMessage}</span>
      </div>
    </div>
  );
};

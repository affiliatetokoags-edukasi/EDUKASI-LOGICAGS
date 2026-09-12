import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Share2, 
  MessageSquare, 
  CheckCircle, 
  ShieldAlert, 
  Lock, 
  FileText, 
  Trash2, 
  HelpCircle 
} from 'lucide-react';
import { ChallengeData } from '../../types';
import { sounds } from '../../utils/audio';

interface DecisionChallengeViewProps {
  challenge: ChallengeData;
  onSubmitAnswer: (selectedId: string) => void;
  disabled?: boolean;
}

export const DecisionChallengeView: React.FC<DecisionChallengeViewProps> = ({
  challenge,
  onSubmitAnswer,
  disabled = false,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const getOptionIcon = (iconName?: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-5 h-5 text-rose-400" />;
      case 'Share2':
        return <Share2 className="w-5 h-5 text-amber-400" />;
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5 text-blue-400" />;
      case 'Trash2':
        return <Trash2 className="w-5 h-5 text-rose-400" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-cyan-400" />;
      default:
        return <HelpCircle className="w-5 h-5 text-cyan-400" />;
    }
  };

  const handleSelect = (optId: string) => {
    if (disabled) return;
    sounds.playClick();
    setSelectedId(optId);
    onSubmitAnswer(optId);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
          <span>CYBER DECISION CHALLENGE</span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-white">
          {challenge.title}
        </h3>
      </div>

      {/* Scenario Dialogue Card */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 shadow-inner space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
          <ShieldAlert className="w-4 h-4" />
          <span>SKENARIO SITUASI DARURAT</span>
        </div>
        <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
          {challenge.instruction}
        </p>
      </div>

      {/* Interactive Options Cards */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          PILIH TINDAKAN PALING TEPAT & AMAN:
        </span>

        <div className="grid grid-cols-1 gap-3">
          {challenge.options?.map((opt) => {
            const isSelected = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                id={`decision-opt-${opt.id}`}
                disabled={disabled}
                onClick={() => handleSelect(opt.id)}
                className={`group flex items-start gap-4 p-4 rounded-xl border text-left transition-all cursor-pointer shadow-sm ${
                  isSelected
                    ? 'bg-blue-900/40 border-blue-500 text-white ring-2 ring-blue-500/40'
                    : 'bg-slate-800/80 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600 text-slate-200'
                } ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                  {getOptionIcon(opt.icon)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-400 group-hover:text-blue-300">
                      [ {opt.label} ]
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-blue-200">
                      {opt.text}
                    </h4>
                  </div>
                  {opt.detail && (
                    <p className="text-xs text-slate-400 mt-1">
                      {opt.detail}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

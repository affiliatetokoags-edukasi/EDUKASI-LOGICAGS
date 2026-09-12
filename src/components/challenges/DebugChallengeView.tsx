import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bug, CheckCircle, AlertTriangle, Code, Terminal } from 'lucide-react';
import { ChallengeData } from '../../types';
import { sounds } from '../../utils/audio';

interface DebugChallengeViewProps {
  challenge: ChallengeData;
  onSubmitStep: (stepId: number) => void;
  disabled?: boolean;
}

export const DebugChallengeView: React.FC<DebugChallengeViewProps> = ({
  challenge,
  onSubmitStep,
  disabled = false,
}) => {
  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);

  const steps = challenge.debugSteps || [];

  const handleSelect = (stepId: number) => {
    if (disabled) return;
    sounds.playClick();
    setSelectedStepId(stepId);
    onSubmitStep(stepId);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider">
          <Bug className="w-3.5 h-3.5" />
          <span>DEBUGGING ENGINE</span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-white">
          {challenge.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300">
          {challenge.instruction}
        </p>
      </div>

      {/* Code Terminal Box */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner font-mono text-xs sm:text-sm">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-slate-400">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold text-[11px] uppercase">ROBOT_NAV_LOGIC.ALG</span>
          </div>
          <span className="text-[10px] text-slate-500">KLIK BARIS YANG BERMASALAH</span>
        </div>

        <div className="p-4 space-y-2">
          {steps.map((step) => {
            const isSelected = selectedStepId === step.id;
            return (
              <button
                key={step.id}
                id={`debug-step-btn-${step.id}`}
                disabled={disabled}
                onClick={() => handleSelect(step.id)}
                className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer font-mono ${
                  isSelected
                    ? 'bg-rose-950/60 border-rose-500 text-white ring-2 ring-rose-500/40'
                    : 'bg-slate-900/80 border-slate-800 hover:bg-slate-850 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                    isSelected ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {step.id}
                </div>

                <div className="flex-1 min-w-0">
                  <span className="font-bold text-white text-xs sm:text-sm block">
                    {step.code}
                  </span>
                  <span className="text-[11px] text-slate-400 font-sans mt-0.5 block">
                    {step.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

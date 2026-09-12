import React from 'react';
import { motion } from 'motion/react';
import { Target, Compass, FileText, Monitor, Lock, Package, Map, Search, Sparkles, Coins, Flame } from 'lucide-react';
import { MissionData, InteractiveObject } from '../types';
import { sounds } from '../utils/audio';

interface MissionBriefProps {
  mission: MissionData;
  difficulty: string;
  xpReward: number;
  coinReward: number;
  comboCount: number;
  onInspectObject: (object: InteractiveObject) => void;
}

export const MissionBrief: React.FC<MissionBriefProps> = ({
  mission,
  difficulty,
  xpReward,
  coinReward,
  comboCount,
  onInspectObject,
}) => {
  const renderObjectIcon = (icon: string) => {
    switch (icon) {
      case 'note':
        return <FileText className="w-4 h-4 text-amber-400" />;
      case 'computer':
        return <Monitor className="w-4 h-4 text-cyan-400" />;
      case 'lock':
        return <Lock className="w-4 h-4 text-rose-400" />;
      case 'box':
        return <Package className="w-4 h-4 text-emerald-400" />;
      case 'map':
        return <Map className="w-4 h-4 text-blue-400" />;
      case 'clue':
        return <Search className="w-4 h-4 text-purple-400" />;
      default:
        return <Search className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      {/* Top badges: Difficulty & Rewards */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            TINGKAT: <span className="text-cyan-400">{difficulty}</span>
          </span>

          {comboCount > 1 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black animate-pulse">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              COMBO x{comboCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            +{xpReward} XP
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Coins className="w-3 h-3 text-amber-400" />
            +{coinReward} COIN
          </span>
        </div>
      </div>

      {/* Brief & Objective */}
      <div className="space-y-2">
        <div className="flex items-start gap-2.5">
          <Target className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400">
              MISSION BRIEF & OBJECTIVE
            </span>
            <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
              {mission.brief}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
              🎯 <strong className="text-cyan-300">Tujuan:</strong> {mission.objective}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Objects to Inspect (Exploration Mechanic) */}
      {mission.interactiveObjects && mission.interactiveObjects.length > 0 && (
        <div className="pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>🔎 EKSPLORASI RUANGAN (KLIK UNTUK MEMERIKSA):</span>
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {mission.interactiveObjects.map((obj) => (
              <button
                key={obj.id}
                id={`inspect-obj-${obj.id}`}
                onClick={() => {
                  sounds.playClick();
                  onInspectObject(obj);
                }}
                className="group flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 text-left transition-all cursor-pointer shadow-sm hover:shadow-cyan-950/40"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {renderObjectIcon(obj.icon)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 truncate">
                    {obj.name}
                  </p>
                  <span className="text-[10px] text-slate-400 group-hover:text-slate-300">
                    Klik untuk periksa
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

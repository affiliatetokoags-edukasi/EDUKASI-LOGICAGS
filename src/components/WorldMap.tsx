import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Lock, 
  Play, 
  Sparkles, 
  Trophy, 
  School, 
  Puzzle, 
  Brain, 
  ListOrdered, 
  Lightbulb, 
  DoorOpen,
  ArrowDown,
  Compass,
  MapPin,
  Layers,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { LEVELS_DATA } from '../data/levels';
import { ROOMS_DATA } from '../data/worldData';
import { PlayerStats, RoomAreaData } from '../types';
import { sounds } from '../utils/audio';

interface WorldMapProps {
  stats: PlayerStats;
  onSelectLevel: (levelId: number) => void;
  onSelectArea: (areaId: string) => void;
  onOpenJournal?: () => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({ 
  stats, 
  onSelectLevel,
  onSelectArea,
  onOpenJournal 
}) => {
  const [activeTab, setActiveTab] = useState<'areas' | 'levels'>('areas');

  const unlockedAreas = stats.unlockedAreas || ['main_gate'];
  const completedAreas = stats.completedAreas || [];

  // Level is unlocked if it's Level 1 OR the previous level is in completedLevels
  const isLevelUnlocked = (levelId: number) => {
    if (levelId === 1) return true;
    return stats.completedLevels.includes(levelId - 1);
  };

  const isLevelCompleted = (levelId: number) => {
    return stats.completedLevels.includes(levelId);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Puzzle':
        return <Puzzle className="w-5 h-5" />;
      case 'Brain':
        return <Brain className="w-5 h-5" />;
      case 'ListOrdered':
        return <ListOrdered className="w-5 h-5" />;
      case 'Lightbulb':
        return <Lightbulb className="w-5 h-5" />;
      case 'DoorOpen':
        return <DoorOpen className="w-5 h-5" />;
      default:
        return <Puzzle className="w-5 h-5" />;
    }
  };

  const areasList = Object.values(ROOMS_DATA);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-bold tracking-widest uppercase mb-2">
          <Compass className="w-3.5 h-3.5" />
          <span>DUNIA LOGIC SCHOOL • V0.3</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          PETA KAMPUS DIGITAL
        </h1>
        <h2 className="text-base sm:text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mt-0.5">
          Jelajahi 8 Area Ruangan & Selesaikan Investigasi Logic Core
        </h2>
      </div>

      {/* Mode Switcher: Area Eksplorasi vs Tantangan Logika */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('areas');
          }}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all shadow-md ${
            activeTab === 'areas'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-cyan-500/25 scale-105'
              : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>8 AREA RUANGAN (EKSPLORASI)</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('levels');
          }}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all shadow-md ${
            activeTab === 'levels'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-cyan-500/25 scale-105'
              : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-white'
          }`}
        >
          <Puzzle className="w-4 h-4" />
          <span>5 TANTANGAN LEVEL (PUZZLE)</span>
        </button>
      </div>

      {/* TAB 1: 8 AREA RUANGAN (V0.3 WORLD MAP) */}
      {activeTab === 'areas' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs sm:text-sm text-cyan-200 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <School className="w-4 h-4 text-cyan-400" />
              <span>Pilih area yang telah terbuka untuk masuk dan berinteraksi dengan objek serta NPC.</span>
            </span>
            {onOpenJournal && (
              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenJournal();
                }}
                className="px-3 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 ml-3"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Buka Jurnal</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {areasList.map((area, index) => {
              const isUnlocked = unlockedAreas.includes(area.id);
              const isCompleted = completedAreas.includes(area.id) || (area.associatedLevelId ? stats.completedLevels.includes(area.associatedLevelId) : false);
              const isCurrent = stats.currentArea === area.id;

              return (
                <motion.div
                  key={area.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    if (isUnlocked) {
                      sounds.playClick();
                      sounds.playRoomEnter();
                      onSelectArea(area.id);
                    } else {
                      sounds.playWrong();
                    }
                  }}
                  className={`group relative overflow-hidden rounded-3xl p-5 border transition-all duration-200 ${
                    isUnlocked
                      ? isCurrent
                        ? 'bg-slate-900/90 border-cyan-400 shadow-xl shadow-cyan-950/70 ring-1 ring-cyan-400/50 cursor-pointer hover:border-cyan-300'
                        : 'bg-slate-900/70 border-slate-700/80 hover:border-cyan-500/50 cursor-pointer hover:bg-slate-900/90'
                      : 'bg-slate-950/60 border-slate-800/80 opacity-60 cursor-not-allowed'
                  }`}
                >
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                      CHAPTER {area.chapter}
                    </span>

                    {isCompleted ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> SELESAI
                      </span>
                    ) : isUnlocked ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 flex items-center gap-1">
                        <Play className="w-2.5 h-2.5 fill-current" /> TERBUKA
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-800 border border-slate-700 text-slate-500 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> TERKUNCI
                      </span>
                    )}
                  </div>

                  {/* Area Details */}
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                      {area.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors">
                        {area.name}
                      </h3>
                      <p className="text-xs text-cyan-400/90 font-medium">
                        {area.tagline}
                      </p>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {area.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">
                      {area.hotspots.length} Objek Interaktif
                    </span>

                    {isUnlocked ? (
                      <span className="text-cyan-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Masuki Ruangan</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="text-slate-600 font-medium flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Butuh progres chapter
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: 5 TANTANGAN LEVEL (V0.1 & V0.2 ENGINE) */}
      {activeTab === 'levels' && (
        <div className="max-w-2xl mx-auto space-y-4 relative">
          <div className="text-center mb-6">
            <span className="text-xs text-slate-400">
              Akses cepat ke 5 gerbang logika utama Logic School
            </span>
          </div>

          {LEVELS_DATA.map((lvl, index) => {
            const unlocked = isLevelUnlocked(lvl.id);
            const completed = isLevelCompleted(lvl.id);
            const isNextTarget = unlocked && !completed;

            return (
              <React.Fragment key={lvl.id}>
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <div
                    id={`level-node-${lvl.id}`}
                    onClick={() => {
                      if (unlocked) {
                        sounds.playClick();
                        onSelectLevel(lvl.id);
                      } else {
                        sounds.playWrong();
                      }
                    }}
                    className={`group relative overflow-hidden rounded-2xl p-4 sm:p-5 border transition-all duration-200 ${
                      unlocked
                        ? isNextTarget
                          ? 'bg-slate-900/90 border-cyan-500 shadow-lg shadow-cyan-950/60 hover:border-cyan-400 cursor-pointer ring-1 ring-cyan-500/50'
                          : 'bg-slate-900/70 border-slate-700 hover:border-cyan-500/50 cursor-pointer'
                        : 'bg-slate-950/60 border-slate-800/80 opacity-65 cursor-not-allowed'
                    }`}
                  >
                    {isNextTarget && (
                      <div className="absolute top-0 right-0 bg-cyan-500 text-slate-950 text-[10px] font-black uppercase px-3 py-0.5 rounded-bl-xl tracking-wider">
                        MISI AKTIF
                      </div>
                    )}

                    <div className="flex items-start sm:items-center justify-between gap-4">
                      {/* Left Icon & Info */}
                      <div className="flex items-start sm:items-center gap-3.5">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 ${
                            completed
                              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                              : unlocked
                              ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400'
                              : 'bg-slate-800 border-slate-700 text-slate-500'
                          }`}
                        >
                          {getIcon(lvl.iconName)}
                        </div>

                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {lvl.title}
                          </h3>

                          <p className="text-xs text-slate-400 mt-0.5 font-medium line-clamp-1">
                            {lvl.subtitle} • {lvl.description}
                          </p>

                          <div className="flex items-center gap-3 mt-2">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400/90 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/20">
                              <Sparkles className="w-3 h-3" />
                              +{lvl.xpReward} XP
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400/90 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/20">
                              <Trophy className="w-3 h-3" />
                              +{lvl.scoreReward} SKOR
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Status Badge */}
                      <div className="shrink-0 flex items-center">
                        {completed ? (
                          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>SELESAI</span>
                          </div>
                        ) : unlocked ? (
                          <button
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-extrabold shadow-md shadow-cyan-600/30 transition-all cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>MAINKAN</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-500 text-xs font-bold">
                            <Lock className="w-3.5 h-3.5" />
                            <span>TERKUNCI</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {index < LEVELS_DATA.length - 1 && (
                  <div className="flex justify-center my-1">
                    <ArrowDown
                      className={`w-4 h-4 ${
                        unlocked ? 'text-cyan-500/50' : 'text-slate-800'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};


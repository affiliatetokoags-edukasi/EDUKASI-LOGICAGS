import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  BookOpen, 
  Map, 
  Backpack, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Unlock, 
  MessageSquare, 
  HelpCircle,
  ChevronRight,
  Shield,
  Layers,
  Key
} from 'lucide-react';
import { RoomAreaData, RoomHotspot, QuestData } from '../../types';
import { NPCS_DATA, ROOMS_DATA } from '../../data/worldData';
import { sounds } from '../../utils/audio';

interface RoomViewProps {
  room: RoomAreaData;
  activeQuest: QuestData;
  completedObjectives: string[];
  unlockedAreas: string[];
  playerHearts: number;
  inventoryKeys: number;
  onSelectHotspot: (hotspot: RoomHotspot) => void;
  onTalkNpc: (npcId: string) => void;
  onChangeArea: (areaId: string) => void;
  onOpenMap: () => void;
  onOpenJournal: () => void;
  onOpenInventory: () => void;
  onLaunchLevel: (levelId: number) => void;
}

export const RoomView: React.FC<RoomViewProps> = ({
  room,
  activeQuest,
  completedObjectives,
  unlockedAreas,
  playerHearts,
  inventoryKeys,
  onSelectHotspot,
  onTalkNpc,
  onChangeArea,
  onOpenMap,
  onOpenJournal,
  onOpenInventory,
  onLaunchLevel,
}) => {
  const [hoveredHotspot, setHoveredHotspot] = useState<RoomHotspot | null>(null);

  // Active Quest percentage
  const totalObjs = activeQuest.objectives.length;
  const doneObjs = activeQuest.objectives.filter(o => completedObjectives.includes(o.id)).length;
  const currentObj = activeQuest.objectives.find(o => !completedObjectives.includes(o.id)) || activeQuest.objectives[0];

  return (
    <div className="relative w-full min-h-[calc(100vh-64px)] flex flex-col justify-between overflow-hidden bg-slate-950">
      {/* 1. TOP ROOM NAVIGATION & QUEST QUICK-PILL */}
      <div className="relative z-20 px-4 sm:px-8 pt-4 pb-2 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md">
        {/* Left: Room Title & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-2xl shadow-inner shrink-0">
            {room.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-white tracking-wide">
                {room.name}
              </h1>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                CHAPTER {room.chapter}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {room.tagline}
            </p>
          </div>
        </div>

        {/* Center: Active Quest Tracker Pill */}
        <button
          onClick={() => {
            sounds.playClick();
            onOpenJournal();
          }}
          className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-cyan-500/30 hover:border-cyan-500/60 transition-all text-left group"
        >
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div className="min-w-0 pr-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                MISI AKTIF ({doneObjs}/{totalObjs})
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-200 truncate max-w-[220px] sm:max-w-[300px]">
              {currentObj.text}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-300 transition-colors shrink-0 ml-auto" />
        </button>

        {/* Right: Quick Action Buttons (Map, Journal, Inventory) */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={() => {
              sounds.playClick();
              onOpenMap();
            }}
            className="px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm active:scale-95"
            title="Buka Peta Sekolah"
          >
            <Map className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Peta</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onOpenJournal();
            }}
            className="px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm active:scale-95"
            title="Buka Jurnal Petualang"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Jurnal</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onOpenInventory();
            }}
            className="px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm active:scale-95"
            title="Buka Tas Perlengkapan"
          >
            <Backpack className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Tas</span>
          </button>
        </div>
      </div>

      {/* 2. 2D INTERACTIVE ROOM EXPLORATION STAGE */}
      <div className="relative flex-1 w-full max-w-6xl mx-auto p-4 sm:p-6 flex flex-col justify-center items-center">
        {/* Visual Room Frame */}
        <div className={`relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[64vh] rounded-3xl overflow-hidden border border-slate-700/80 bg-gradient-to-b ${room.bgGradient} shadow-2xl shadow-cyan-950/60 flex items-center justify-center`}>
          
          {/* Futuristic Room Backdrop Graphics */}
          {/* Cyber Floor Grid Perspective */}
          <div 
            className="absolute inset-x-0 bottom-0 h-2/5 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              transform: 'perspective(300px) rotateX(45deg)',
              transformOrigin: 'bottom',
            }}
          />

          {/* Sci-Fi Wall Lines & Lighting */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          <div className="absolute top-1/4 inset-x-0 h-px bg-slate-700/30" />
          <div className="absolute top-2/3 inset-x-0 h-px bg-slate-700/30" />

          {/* Ambient Room Hologram / Icon Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none select-none text-[12rem]">
            {room.icon}
          </div>

          {/* Interactive Hotspots Rendered Across the Room */}
          {room.hotspots.map((hotspot) => {
            const isHovered = hoveredHotspot?.id === hotspot.id;
            const isPuzzle = hotspot.type === 'puzzle';
            const isNPC = hotspot.type === 'npc';
            const isDoor = hotspot.type === 'unlock' || hotspot.actionText === 'MASUK';

            return (
              <div
                key={hotspot.id}
                style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
              >
                {/* Hotspot Floating Button */}
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => setHoveredHotspot(hotspot)}
                  onMouseLeave={() => setHoveredHotspot(null)}
                  onClick={() => {
                    sounds.playClick();
                    if (isNPC && hotspot.dialogueNpcId) {
                      onTalkNpc(hotspot.dialogueNpcId);
                    } else if (isPuzzle && hotspot.puzzleLevelId) {
                      onLaunchLevel(hotspot.puzzleLevelId);
                    } else {
                      onSelectHotspot(hotspot);
                    }
                  }}
                  className={`relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl shadow-xl transition-all ${
                    isPuzzle
                      ? 'bg-gradient-to-br from-amber-500 to-yellow-600 text-slate-950 shadow-amber-500/30 ring-2 ring-amber-400'
                      : isNPC
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-cyan-500/30 ring-2 ring-cyan-300'
                      : isDoor
                      ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-purple-500/30 ring-2 ring-purple-400'
                      : 'bg-slate-900/90 text-slate-100 border border-slate-600 hover:border-cyan-400 shadow-slate-950/60'
                  }`}
                >
                  {/* Subtle Pulse Rings for Puzzles and NPCs */}
                  {(isPuzzle || isNPC) && (
                    <span className="absolute -inset-1 rounded-2xl bg-cyan-400/20 animate-ping pointer-events-none" />
                  )}

                  <span className="text-xl sm:text-2xl select-none">
                    {hotspot.icon}
                  </span>

                  {/* Tiny Action Badge Beneath Icon */}
                  <span className="absolute -bottom-2.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-950 text-cyan-300 border border-slate-700 shadow-sm whitespace-nowrap">
                    {hotspot.actionText}
                  </span>
                </motion.button>

                {/* Tooltip Label on Hover / Active */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-3 pointer-events-none transition-all duration-200 z-30 whitespace-nowrap ${
                    isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                >
                  <div className="px-3 py-1.5 rounded-xl bg-slate-900/95 border border-slate-700 shadow-xl text-center">
                    <p className="text-xs font-black text-white">{hotspot.name}</p>
                    <p className="text-[10px] text-cyan-400 font-semibold">{hotspot.actionText}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* NPCs standing in room if any */}
          {room.npcs.map((npcId, idx) => {
            const npc = NPCS_DATA[npcId];
            if (!npc) return null;
            return (
              <motion.button
                key={npc.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  sounds.playClick();
                  onTalkNpc(npc.id);
                }}
                className="absolute z-20 flex flex-col items-center group cursor-pointer"
                style={{
                  left: `${65 + idx * 12}%`,
                  bottom: '18%',
                }}
              >
                {/* Speech balloon pulse */}
                <div className="mb-2 px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-[10px] font-bold text-cyan-300 flex items-center gap-1 shadow-md animate-bounce">
                  <MessageSquare className="w-3 h-3" />
                  <span>Bicara dengan {npc.name}</span>
                </div>

                {/* Avatar */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-xl shadow-cyan-500/25">
                  <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-3xl">
                    {npc.avatarIcon}
                  </div>
                </div>
                <span className="text-xs font-black text-white mt-1 bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-800">
                  {npc.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 3. CONNECTED DOORS & EXITS (Fast Travel Between Unlocked Rooms) */}
      <div className="relative z-20 px-4 sm:px-8 py-3 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between overflow-x-auto gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>PINTU AKSES TERBUKA:</span>
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {room.connectedAreas.map((connectedAreaId) => {
            const targetRoom = ROOMS_DATA[connectedAreaId];
            if (!targetRoom) return null;
            const isUnlocked = unlockedAreas.includes(connectedAreaId);

            return (
              <button
                key={connectedAreaId}
                disabled={!isUnlocked}
                onClick={() => {
                  sounds.playClick();
                  sounds.playRoomEnter();
                  onChangeArea(connectedAreaId);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                  isUnlocked
                    ? 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-200 hover:text-white active:scale-95'
                    : 'bg-slate-950/40 border-slate-800 text-slate-600 cursor-not-allowed opacity-60'
                }`}
              >
                <span>{targetRoom.icon}</span>
                <span>{targetRoom.shortName}</span>
                {isUnlocked ? (
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                ) : (
                  <Lock className="w-3 h-3 text-slate-600" />
                )}
              </button>
            );
          })}

          {/* Quick World Map Jump */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenMap();
            }}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Map className="w-3.5 h-3.5" />
            <span>Lihat Semua Area</span>
          </button>
        </div>
      </div>
    </div>
  );
};

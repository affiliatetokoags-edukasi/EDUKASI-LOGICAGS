import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  Compass, 
  CheckCircle2,
  ShieldAlert,
  DoorOpen
} from 'lucide-react';
import { ChallengeData } from '../../types';
import { sounds } from '../../utils/audio';

interface PathFinderChallengeViewProps {
  challenge: ChallengeData;
  onComplete: () => void;
  onObstacleHit: () => void;
  disabled?: boolean;
}

export const PathFinderChallengeView: React.FC<PathFinderChallengeViewProps> = ({
  challenge,
  onComplete,
  onObstacleHit,
  disabled = false,
}) => {
  const rows = challenge.gridSize?.rows || 5;
  const cols = challenge.gridSize?.cols || 5;
  const startPos = challenge.startPos || { x: 0, y: 0 };
  const exitPos = challenge.exitPos || { x: 4, y: 4 };
  const walls = challenge.walls || [];

  const [currentPos, setCurrentPos] = useState<{ x: number; y: number }>(startPos);
  const [visited, setVisited] = useState<{ x: number; y: number }[]>([startPos]);
  const [steps, setSteps] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const isWall = (x: number, y: number) => {
    return walls.some((w) => w.x === x && w.y === y);
  };

  const isVisited = (x: number, y: number) => {
    return visited.some((v) => v.x === x && v.y === y);
  };

  const move = useCallback(
    (dx: number, dy: number) => {
      if (disabled || isSuccess) return;

      const newX = currentPos.x + dx;
      const newY = currentPos.y + dy;

      // Check boundary
      if (newX < 0 || newX >= cols || newY < 0 || newY >= rows) {
        sounds.playWrong();
        return;
      }

      // Check obstacle/wall
      if (isWall(newX, newY)) {
        sounds.playWrong();
        onObstacleHit();
        return;
      }

      // Valid move
      sounds.playClick();
      const nextPos = { x: newX, y: newY };
      setCurrentPos(nextPos);
      setSteps((s) => s + 1);
      setVisited((prev) => [...prev, nextPos]);

      // Check if reached exit
      if (newX === exitPos.x && newY === exitPos.y) {
        setIsSuccess(true);
        sounds.playUnlock();
        onComplete();
      }
    },
    [currentPos, cols, rows, walls, exitPos, disabled, isSuccess, onComplete, onObstacleHit]
  );

  // Desktop keyboard arrow listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled || isSuccess) return;
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        move(0, -1);
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        move(0, 1);
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        move(-1, 0);
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        move(1, 0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move, disabled, isSuccess]);

  const handleReset = () => {
    if (disabled || isSuccess) return;
    sounds.playClick();
    setCurrentPos(startPos);
    setVisited([startPos]);
    setSteps(0);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>PATH FINDER CHALLENGE</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            {challenge.title}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-300 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            LANGKAH: <strong className="text-cyan-400">{steps}</strong>
          </span>
          <button
            onClick={handleReset}
            disabled={disabled || isSuccess}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold border border-slate-700 transition-colors cursor-pointer disabled:opacity-40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ULANG</span>
          </button>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-slate-300">
        {challenge.instruction}
      </p>

      {/* Grid Canvas */}
      <div className="flex justify-center">
        <div className="inline-block p-3 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner">
          <div
            className="grid gap-2 select-none"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: rows }).map((_, rIdx) =>
              Array.from({ length: cols }).map((_, cIdx) => {
                const isPlayer = currentPos.x === cIdx && currentPos.y === rIdx;
                const isExit = exitPos.x === cIdx && exitPos.y === rIdx;
                const isStart = startPos.x === cIdx && startPos.y === rIdx;
                const wall = isWall(cIdx, rIdx);
                const hasVisited = isVisited(cIdx, rIdx);

                let cellBg = 'bg-slate-850 border-slate-750';
                if (wall) {
                  cellBg = 'bg-rose-950/80 border-rose-600/60 shadow-sm shadow-rose-950';
                } else if (isExit) {
                  cellBg = 'bg-amber-950/80 border-amber-500/60';
                } else if (hasVisited) {
                  cellBg = 'bg-emerald-950/40 border-emerald-500/30';
                }

                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className={`w-11 h-11 sm:w-13 sm:h-13 rounded-xl border flex items-center justify-center transition-all ${cellBg}`}
                  >
                    {isPlayer ? (
                      <motion.span
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="text-xl sm:text-2xl drop-shadow-md"
                      >
                        🚀
                      </motion.span>
                    ) : wall ? (
                      <span className="text-xs font-bold text-rose-400">
                        🧱
                      </span>
                    ) : isExit ? (
                      <span className="text-lg sm:text-xl font-black text-amber-300 animate-pulse">
                        🚪
                      </span>
                    ) : isStart ? (
                      <span className="text-[10px] font-bold text-emerald-400 uppercase">
                        START
                      </span>
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-700/60" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Legend & Instructions */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1">🚀 Posisi Kamu</span>
        <span className="flex items-center gap-1">🧱 Firewall (Rintangan)</span>
        <span className="flex items-center gap-1">🚪 Pintu Keluar (EXIT)</span>
      </div>

      {/* On-Screen D-Pad (Touch & Mobile Friendly) */}
      <div className="flex flex-col items-center gap-2 pt-2">
        <button
          id="dpad-up-btn"
          disabled={disabled || isSuccess}
          onClick={() => move(0, -1)}
          className="w-14 h-14 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 active:bg-cyan-600 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer disabled:opacity-40"
          aria-label="Atas"
        >
          <ArrowUp className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3">
          <button
            id="dpad-left-btn"
            disabled={disabled || isSuccess}
            onClick={() => move(-1, 0)}
            className="w-14 h-14 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 active:bg-cyan-600 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer disabled:opacity-40"
            aria-label="Kiri"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <button
            id="dpad-down-btn"
            disabled={disabled || isSuccess}
            onClick={() => move(0, 1)}
            className="w-14 h-14 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 active:bg-cyan-600 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer disabled:opacity-40"
            aria-label="Bawah"
          >
            <ArrowDown className="w-6 h-6" />
          </button>

          <button
            id="dpad-right-btn"
            disabled={disabled || isSuccess}
            onClick={() => move(1, 0)}
            className="w-14 h-14 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 active:bg-cyan-600 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer disabled:opacity-40"
            aria-label="Kanan"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>

        <span className="text-[11px] text-slate-500 font-medium mt-1">
          Dapat menggunakan tombol panah keyboard di komputer
        </span>
      </div>
    </div>
  );
};

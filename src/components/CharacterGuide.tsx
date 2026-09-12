import React from 'react';
import { motion } from 'motion/react';
import { Bot, Sparkles, AlertCircle, Award } from 'lucide-react';

interface CharacterGuideProps {
  mood?: 'normal' | 'happy' | 'thinking' | 'warning' | 'celebrate';
  message: string;
}

export const CharacterGuide: React.FC<CharacterGuideProps> = ({ mood = 'normal', message }) => {
  const getIcon = () => {
    switch (mood) {
      case 'happy':
      case 'celebrate':
        return <Award className="w-5 h-5 text-amber-400 animate-pulse" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-rose-400 animate-bounce" />;
      case 'thinking':
        return <Sparkles className="w-5 h-5 text-cyan-400" />;
      default:
        return <Bot className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getBorderColor = () => {
    switch (mood) {
      case 'celebrate':
      case 'happy':
        return 'border-amber-500/40 bg-amber-950/20';
      case 'warning':
        return 'border-rose-500/40 bg-rose-950/20';
      case 'thinking':
        return 'border-blue-500/40 bg-blue-950/20';
      default:
        return 'border-cyan-500/30 bg-cyan-950/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border backdrop-blur-md shadow-md ${getBorderColor()}`}
    >
      {/* Avatar Icon */}
      <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center shrink-0 shadow-inner">
        {getIcon()}
      </div>

      {/* Message */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase font-black tracking-wider text-cyan-400">
            LOGI • ASISTEN LOGIKA
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 font-medium leading-snug">
          "{message}"
        </p>
      </div>
    </motion.div>
  );
};

import React from 'react';
import { Pause, RotateCcw, Lightbulb, Clock, CheckCircle2, Footprints, Trophy } from 'lucide-react';
import { DifficultyConfig } from '../types/game';
import { soundManager } from '../utils/audio';

interface GameHUDProps {
  config: DifficultyConfig;
  score: number;
  timeRemaining: number;
  moves: number;
  matchedPairs: number;
  hintsRemaining: number;
  canUseHint: boolean;
  onUseHint: () => void;
  onPause: () => void;
  onRestart: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  config,
  score,
  timeRemaining,
  moves,
  matchedPairs,
  hintsRemaining,
  canUseHint,
  onUseHint,
  onPause,
  onRestart,
}) => {
  const isUrgent = timeRemaining <= 10;
  const isWarning = timeRemaining <= 20 && !isUrgent;

  const timerColor = isUrgent
    ? 'text-rose-400 animate-pulse'
    : isWarning
    ? 'text-amber-400'
    : 'text-cyan-300';

  const timerBorder = isUrgent
    ? 'border-rose-500/60 bg-rose-950/30'
    : isWarning
    ? 'border-amber-500/60 bg-amber-950/30'
    : 'border-cyan-500/30 bg-cyan-950/20';

  return (
    <div className="w-full max-w-4xl mx-auto mb-4 sm:mb-6">
      {/* Top Bar with Level Info and Controls */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-950/60 border border-indigo-800/50 text-indigo-200">
            Level {config.levelNumber} · {config.name}
          </span>
          <span className="hidden sm:inline-block text-xs text-slate-400">
            {config.pairsCount} Pairs Total
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Hint Button */}
          <button
            onClick={() => {
              if (canUseHint) {
                onUseHint();
              }
            }}
            disabled={!canUseHint}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
              canUseHint
                ? 'bg-amber-950/40 border-amber-600/50 text-amber-300 hover:bg-amber-900/50 shadow-sm shadow-amber-500/10'
                : 'bg-slate-900/40 border-slate-800 text-slate-500 cursor-not-allowed opacity-60'
            }`}
            title={
              hintsRemaining > 0
                ? `Reveal a matching pair (-25 pts penalty). ${hintsRemaining} left.`
                : 'No hints remaining'
            }
            aria-label={`Use hint, ${hintsRemaining} remaining`}
          >
            <Lightbulb className={`w-3.5 h-3.5 ${hintsRemaining > 0 ? 'text-amber-400 fill-amber-400/20' : 'text-slate-500'}`} />
            <span>Hint</span>
            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-200 font-mono text-[11px]">
              {hintsRemaining}
            </span>
          </button>

          {/* Pause Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onPause();
            }}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-indigo-900/60 bg-indigo-950/40 hover:bg-indigo-900/50 text-slate-200 transition-all text-xs font-medium flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            title="Pause Game (Esc)"
            aria-label="Pause game"
          >
            <Pause className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pause</span>
          </button>

          {/* Restart Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onRestart();
            }}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-300 hover:text-white transition-all text-xs font-medium flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            title="Restart Level"
            aria-label="Restart level"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Restart</span>
          </button>
        </div>
      </div>

      {/* Main HUD Stats Grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {/* Score */}
        <div className="rounded-xl bg-[#0c122e]/80 border border-indigo-900/50 p-2 sm:p-3 flex flex-col items-center justify-center backdrop-blur-sm shadow-md">
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <Trophy className="w-3 h-3 text-amber-400" />
            <span>Score</span>
          </div>
          <div className="font-display font-bold text-lg sm:text-2xl text-white tabular-nums tracking-tight">
            {score}
          </div>
        </div>

        {/* Timer */}
        <div className={`rounded-xl border p-2 sm:p-3 flex flex-col items-center justify-center backdrop-blur-sm shadow-md transition-colors ${timerBorder}`}>
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <Clock className={`w-3 h-3 ${isUrgent ? 'text-rose-400' : 'text-cyan-400'}`} />
            <span>Time</span>
          </div>
          <div className={`font-display font-bold text-lg sm:text-2xl font-mono tabular-nums tracking-tight ${timerColor}`}>
            {timeRemaining}s
          </div>
        </div>

        {/* Moves */}
        <div className="rounded-xl bg-[#0c122e]/80 border border-indigo-900/50 p-2 sm:p-3 flex flex-col items-center justify-center backdrop-blur-sm shadow-md">
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <Footprints className="w-3 h-3 text-indigo-400" />
            <span>Moves</span>
          </div>
          <div className="font-display font-bold text-lg sm:text-2xl text-slate-200 tabular-nums tracking-tight">
            {moves}
          </div>
        </div>

        {/* Pairs Matched */}
        <div className="rounded-xl bg-[#0c122e]/80 border border-indigo-900/50 p-2 sm:p-3 flex flex-col items-center justify-center backdrop-blur-sm shadow-md">
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Matched</span>
          </div>
          <div className="font-display font-bold text-lg sm:text-2xl text-emerald-300 tabular-nums tracking-tight">
            {matchedPairs} <span className="text-xs sm:text-sm font-normal text-slate-400">/ {config.pairsCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

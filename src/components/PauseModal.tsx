import React from 'react';
import { Play, RotateCcw, Home, PauseCircle } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface PauseModalProps {
  score: number;
  timeRemaining: number;
  matchedPairs: number;
  totalPairs: number;
  moves: number;
  onResume: () => void;
  onRestart: () => void;
  onGoHome: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  score,
  timeRemaining,
  matchedPairs,
  totalPairs,
  moves,
  onResume,
  onRestart,
  onGoHome,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pause-modal-title"
    >
      <div className="w-full max-w-sm rounded-2xl border border-indigo-900/80 bg-[#0d122e] p-6 shadow-2xl text-center relative overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-indigo-500/20 blur-2xl rounded-full pointer-events-none" />

        <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-700/50 mx-auto flex items-center justify-center text-cyan-400 mb-3 shadow-inner">
          <PauseCircle className="w-7 h-7" />
        </div>

        <h3 id="pause-modal-title" className="font-display font-bold text-2xl text-white">
          Game Paused
        </h3>
        <p className="text-xs text-slate-400 mt-1 mb-5">
          Take a breath. The clock and your cards are safely on hold.
        </p>

        {/* Interim stats */}
        <div className="grid grid-cols-3 gap-2 py-3 px-2 rounded-xl bg-slate-900/60 border border-indigo-950 mb-6 text-center text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Score</span>
            <span className="font-display font-bold text-white text-base tabular-nums">{score}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Time</span>
            <span className="font-display font-bold text-cyan-300 text-base tabular-nums">{timeRemaining}s</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Matched</span>
            <span className="font-display font-bold text-emerald-300 text-base tabular-nums">{matchedPairs}/{totalPairs}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={() => {
              soundManager.playClick();
              onResume();
            }}
            className="w-full py-3 px-4 rounded-xl font-display font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:via-purple-500 hover:to-cyan-400 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Resume Game</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onRestart();
            }}
            className="w-full py-2.5 px-4 rounded-xl font-medium text-xs text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Restart Level</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onGoHome();
            }}
            className="w-full py-2.5 px-4 rounded-xl font-medium text-xs text-slate-400 hover:text-white hover:bg-slate-900/40 transition-colors flex items-center justify-center gap-2 focus:outline-none focus-visible:underline"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Quit to Main Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};

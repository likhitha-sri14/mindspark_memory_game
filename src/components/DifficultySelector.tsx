import React from 'react';
import { ArrowLeft, Lock, Star, Clock, HelpCircle, Layers, Trophy, Play } from 'lucide-react';
import { Difficulty, PlayerProgress } from '../types/game';
import { DIFFICULTY_CONFIGS } from '../utils/gameLogic';
import { soundManager } from '../utils/audio';

interface DifficultySelectorProps {
  progress: PlayerProgress;
  onSelectDifficulty: (diff: Difficulty) => void;
  onBack: () => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  progress,
  onSelectDifficulty,
  onBack,
}) => {
  const levels: Difficulty[] = ['easy', 'medium', 'hard'];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-8 px-4 sm:px-6 relative">
      <div className="w-full max-w-4xl relative z-10">
        {/* Top header navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => {
              soundManager.playClick();
              onBack();
            }}
            className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-900/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          <div className="text-xs text-slate-400">
            Campaign Progress: <span className="font-semibold text-cyan-300">Level {progress.highestUnlockedLevel} of 3 Unlocked</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            Select Your Challenge
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
            Conquer each stage to unlock higher difficulty tiers and elevate your mental agility.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {levels.map((diff) => {
            const config = DIFFICULTY_CONFIGS[diff];
            const isUnlocked = progress.highestUnlockedLevel >= config.levelNumber;
            const stars = progress.starsByLevel[config.levelNumber] || 0;
            const bestScore = progress.bestScoresByDifficulty[diff] || 0;
            const bestTime = progress.bestTimesByDifficulty[diff] || 0;

            let borderAccent = 'border-slate-800 hover:border-emerald-500/50';
            let badgeBg = 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40';
            let playBtnBg = 'bg-emerald-600 hover:bg-emerald-500 text-white';

            if (diff === 'medium') {
              borderAccent = 'border-slate-800 hover:border-cyan-500/50';
              badgeBg = 'text-cyan-400 bg-cyan-950/40 border-cyan-800/40';
              playBtnBg = 'bg-cyan-600 hover:bg-cyan-500 text-white';
            } else if (diff === 'hard') {
              borderAccent = 'border-slate-800 hover:border-purple-500/50';
              badgeBg = 'text-purple-400 bg-purple-950/40 border-purple-800/40';
              playBtnBg = 'bg-purple-600 hover:bg-purple-500 text-white';
            }

            return (
              <div
                key={diff}
                className={`relative rounded-2xl border p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between backdrop-blur-md ${
                  isUnlocked
                    ? `bg-[#0e132e]/70 shadow-xl ${borderAccent}`
                    : 'bg-[#090c1e]/50 border-slate-900 opacity-60'
                }`}
              >
                <div>
                  {/* Top Level Pill & Stars */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${badgeBg}`}>
                      Level {config.levelNumber} · {config.name}
                    </span>

                    {/* Star Rating Display */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((starIdx) => (
                        <Star
                          key={starIdx}
                          className={`w-4 h-4 ${
                            starIdx <= stars
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Main Header */}
                  <div className="mb-4">
                    <h3 className="font-display font-bold text-2xl text-white">
                      {config.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {config.description}
                    </p>
                  </div>

                  {/* Specification List */}
                  <div className="space-y-2 py-3 border-y border-indigo-950/80 text-xs text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Layers className="w-3.5 h-3.5 text-indigo-400" />
                        Grid Setup
                      </span>
                      <span className="font-mono font-medium text-slate-200">
                        {config.cols} × {config.rows} ({config.pairsCount} Pairs)
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        Time Limit
                      </span>
                      <span className="font-mono font-medium text-slate-200">
                        {config.timerSeconds} Seconds
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                        Assists
                      </span>
                      <span className="font-mono font-medium text-slate-200">
                        {config.hintsCount} {config.hintsCount === 1 ? 'Hint' : 'Hints'}
                      </span>
                    </div>
                  </div>

                  {/* High Scores preview */}
                  <div className="mt-3 pt-2 text-[11px] text-slate-400 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-amber-400" />
                      <span>Best Score:</span>
                      <span className="font-semibold text-slate-200 tabular-nums">
                        {bestScore > 0 ? bestScore : '—'}
                      </span>
                    </div>
                    {bestTime > 0 && (
                      <span className="text-slate-400 tabular-nums font-mono">
                        {bestTime}s left
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="mt-6 pt-2">
                  {isUnlocked ? (
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        onSelectDifficulty(diff);
                      }}
                      className={`w-full py-2.5 px-4 rounded-xl font-display font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${playBtnBg}`}
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>{bestScore > 0 ? 'Play Again' : 'Start Trial'}</span>
                    </button>
                  ) : (
                    <div className="w-full py-2.5 px-4 rounded-xl font-medium text-xs bg-slate-900/60 border border-slate-800 text-slate-500 flex items-center justify-center gap-2 cursor-not-allowed">
                      <Lock className="w-4 h-4 text-slate-600" />
                      <span>Beat Level {config.levelNumber - 1} to Unlock</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

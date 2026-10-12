import React, { useState } from 'react';
import { ArrowLeft, Lock, Star, Clock, HelpCircle, Layers, Trophy, Play, ChevronLeft, ChevronRight, Zap, Coins } from 'lucide-react';
import { PlayerProgress, Difficulty } from '../types/game';
import { getLevelConfig } from '../utils/gameLogic';
import { soundManager } from '../utils/audio';

interface DifficultySelectorProps {
  progress: PlayerProgress;
  onSelectLevel: (levelNumber: number) => void;
  onSelectDifficulty?: (diff: Difficulty) => void;
  onBack: () => void;
}

const LEVELS_PER_PAGE = 6;

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  progress,
  onSelectLevel,
  onBack,
}) => {
  // Initialize page containing current highest unlocked level
  const highestUnlocked = Math.max(1, progress.highestUnlockedLevel);
  const initialPage = Math.floor((highestUnlocked - 1) / LEVELS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Allow browsing up to the page containing the next upcoming level
  const maxPage = Math.max(0, Math.floor((highestUnlocked + 1) / LEVELS_PER_PAGE));
  const startLevel = currentPage * LEVELS_PER_PAGE + 1;
  const currentLevels = Array.from({ length: LEVELS_PER_PAGE }, (_, idx) => startLevel + idx);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-6 px-4 sm:px-6 relative">
      <div className="w-full max-w-5xl relative z-10">
        {/* Top header navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
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

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-950/30 border border-amber-500/30 text-amber-200">
              <Coins className="w-3.5 h-3.5 text-yellow-400" />
              <span>{progress.coins} MindCoins</span>
            </div>
            <div className="px-2.5 py-1 rounded-md bg-indigo-950/40 border border-indigo-900/40">
              <span>Unlocked: </span>
              <span className="font-semibold text-cyan-300">Level 1 – {highestUnlocked}</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            Level Selection
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
            Unlimited campaign trials. Complete each level to earn MindCoins and unlock the next frontier.
          </p>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between gap-2 mb-5 px-1 bg-slate-900/40 p-2 rounded-xl border border-indigo-950/80">
          <button
            onClick={() => {
              if (currentPage > 0) {
                soundManager.playClick();
                setCurrentPage((p) => Math.max(0, p - 1));
              }
            }}
            disabled={currentPage === 0}
            className={`flex items-center gap-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
              currentPage > 0
                ? 'bg-indigo-950/60 text-slate-200 hover:bg-indigo-900/60 border border-indigo-800/40'
                : 'text-slate-600 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="text-xs font-medium text-slate-300 flex items-center gap-2">
            <span>Levels {startLevel} – {startLevel + LEVELS_PER_PAGE - 1}</span>
            <span className="text-slate-500">·</span>
            <span className="text-cyan-400 font-mono">Page {currentPage + 1} of {maxPage + 1}</span>
          </div>

          <button
            onClick={() => {
              if (currentPage < maxPage) {
                soundManager.playClick();
                setCurrentPage((p) => Math.min(maxPage, p + 1));
              }
            }}
            disabled={currentPage >= maxPage}
            className={`flex items-center gap-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
              currentPage < maxPage
                ? 'bg-indigo-950/60 text-slate-200 hover:bg-indigo-900/60 border border-indigo-800/40'
                : 'text-slate-600 cursor-not-allowed'
            }`}
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {currentLevels.map((lvlNum) => {
            const config = getLevelConfig(lvlNum);
            const isUnlocked = progress.highestUnlockedLevel >= lvlNum;
            const stars = progress.starsByLevel[lvlNum] || 0;
            const bestScore = progress.bestScoresByLevel[lvlNum] || (lvlNum === 1 ? progress.bestScoresByDifficulty.easy : lvlNum === 2 ? progress.bestScoresByDifficulty.medium : lvlNum === 3 ? progress.bestScoresByDifficulty.hard : 0);
            const bestTime = progress.bestTimesByLevel[lvlNum] || (lvlNum === 1 ? progress.bestTimesByDifficulty.easy : lvlNum === 2 ? progress.bestTimesByDifficulty.medium : lvlNum === 3 ? progress.bestTimesByDifficulty.hard : 0);

            let borderAccent = 'border-slate-800 hover:border-emerald-500/50';
            let badgeBg = 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40';
            let playBtnBg = 'bg-emerald-600 hover:bg-emerald-500 text-white';

            if (lvlNum === 2 || (lvlNum > 3 && lvlNum % 3 === 2)) {
              borderAccent = 'border-slate-800 hover:border-cyan-500/50';
              badgeBg = 'text-cyan-400 bg-cyan-950/40 border-cyan-800/40';
              playBtnBg = 'bg-cyan-600 hover:bg-cyan-500 text-white';
            } else if (lvlNum === 3 || (lvlNum > 3 && lvlNum % 3 === 0)) {
              borderAccent = 'border-slate-800 hover:border-purple-500/50';
              badgeBg = 'text-purple-400 bg-purple-950/40 border-purple-800/40';
              playBtnBg = 'bg-purple-600 hover:bg-purple-500 text-white';
            }

            return (
              <div
                key={lvlNum}
                className={`relative rounded-2xl border p-5 transition-all duration-300 flex flex-col justify-between backdrop-blur-md ${
                  isUnlocked
                    ? `bg-[#0e132e]/70 shadow-xl ${borderAccent}`
                    : 'bg-[#090c1e]/50 border-slate-900 opacity-60'
                }`}
              >
                <div>
                  {/* Top Level Pill & Stars */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${badgeBg}`}>
                      Level {config.levelNumber} · {config.tierTitle || config.name}
                    </span>

                    {/* Star Rating Display */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((starIdx) => (
                        <Star
                          key={starIdx}
                          className={`w-3.5 h-3.5 ${
                            starIdx <= stars
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Main Header */}
                  <div className="mb-3">
                    <h3 className="font-display font-bold text-xl text-white">
                      {config.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {config.description}
                    </p>
                  </div>

                  {/* Specification List */}
                  <div className="space-y-1.5 py-2.5 border-y border-indigo-950/80 text-xs text-slate-300">
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
                  <div className="mt-2.5 pt-1 text-[11px] text-slate-400 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-amber-400" />
                      <span>Best:</span>
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
                <div className="mt-4 pt-2">
                  {isUnlocked ? (
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        onSelectLevel(lvlNum);
                      }}
                      className={`w-full py-2.5 px-4 rounded-xl font-display font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${playBtnBg}`}
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>{bestScore > 0 ? 'Replay Level' : 'Start Level'}</span>
                    </button>
                  ) : (
                    <div className="w-full py-2.5 px-4 rounded-xl font-medium text-xs bg-slate-900/60 border border-slate-800 text-slate-500 flex items-center justify-center gap-2 cursor-not-allowed">
                      <Lock className="w-4 h-4 text-slate-600" />
                      <span>Beat Level {lvlNum - 1} to Unlock</span>
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

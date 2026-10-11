import React from 'react';
import { Trophy, Star, RotateCcw, ArrowRight, Home, Sparkles, AlertCircle, Clock, Footprints, Target } from 'lucide-react';
import { GameResult } from '../types/game';
import { soundManager } from '../utils/audio';

interface ResultsModalProps {
  result: GameResult;
  onPlayAgain: () => void;
  onNextLevel: () => void;
  onGoHome: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  result,
  onPlayAgain,
  onNextLevel,
  onGoHome,
}) => {
  const {
    isVictory,
    levelNumber,
    score,
    baseScore,
    timeBonus,
    moves,
    matchedPairs,
    totalPairs,
    timeRemaining,
    timeElapsed,
    starsEarned,
    isNewBestScore,
    nextLevelUnlocked,
  } = result;

  const accuracy = moves > 0 ? Math.min(100, Math.round((matchedPairs / moves) * 100)) : 100;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="results-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-indigo-900/80 bg-[#0d122e] p-6 sm:p-7 shadow-2xl text-center relative overflow-hidden">
        {/* Ambient glow accent */}
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-28 blur-3xl rounded-full pointer-events-none ${
            isVictory ? 'bg-cyan-500/25' : 'bg-rose-500/20'
          }`}
        />

        {/* Top Icon Emblem */}
        <div className="relative mb-3">
          <div
            className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg border ${
              isVictory
                ? 'bg-indigo-950/90 border-cyan-400/50 text-cyan-300 shadow-cyan-500/20'
                : 'bg-rose-950/60 border-rose-800/50 text-rose-400 shadow-rose-500/20'
            }`}
          >
            {isVictory ? (
              <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
            ) : (
              <AlertCircle className="w-8 h-8" />
            )}
          </div>

          {/* New Best High Score Badge */}
          {isNewBestScore && isVictory && (
            <div className="inline-flex items-center gap-1 mt-2.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-bold uppercase tracking-wider animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>New Personal Best!</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h2 id="results-title" className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
          {isVictory ? 'Challenge Clear!' : 'Time Expired'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 mb-4">
          {isVictory
            ? `Level ${levelNumber} conquered with flying colors!`
            : 'The clock ran out before all pairs were matched.'}
        </p>

        {/* Star Rating (on Victory) */}
        {isVictory && (
          <div className="flex items-center justify-center gap-2 mb-5">
            {[1, 2, 3].map((starIdx) => {
              const isFilled = starIdx <= starsEarned;
              return (
                <div
                  key={starIdx}
                  className={`transform transition-all duration-300 ${
                    isFilled ? 'scale-110 text-amber-400' : 'text-slate-700'
                  }`}
                >
                  <Star
                    className={`w-7 h-7 sm:w-8 sm:h-8 ${
                      isFilled ? 'fill-amber-400 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' : ''
                    }`}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Unlocked notification banner */}
        {nextLevelUnlocked && isVictory && (
          <div className="mb-4 py-2 px-3 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 text-xs font-semibold flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Next Level Unlocked! (Level {levelNumber + 1})</span>
          </div>
        )}

        {/* Score & Breakdown Card */}
        <div className="rounded-xl bg-slate-900/70 border border-indigo-950/80 p-4 mb-5 text-left space-y-2.5">
          <div className="flex items-center justify-between border-b border-indigo-950/80 pb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Score</span>
            <span className="font-display font-black text-2xl text-white tabular-nums">
              {score}
            </span>
          </div>

          {isVictory && (
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 pt-1">
              <div className="flex justify-between">
                <span>Pair Matches:</span>
                <span className="font-mono text-slate-200 tabular-nums">+{baseScore}</span>
              </div>
              <div className="flex justify-between">
                <span>Time Bonus:</span>
                <span className="font-mono text-cyan-300 tabular-nums">+{timeBonus}</span>
              </div>
            </div>
          )}

          {/* Performance Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-indigo-950/80 text-center text-xs">
            <div className="rounded-lg bg-indigo-950/40 p-2">
              <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mb-0.5">
                <Footprints className="w-3 h-3 text-indigo-400" />
                <span>Moves</span>
              </div>
              <span className="font-bold text-slate-200 font-mono text-sm tabular-nums">{moves}</span>
            </div>

            <div className="rounded-lg bg-indigo-950/40 p-2">
              <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mb-0.5">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>Time</span>
              </div>
              <span className="font-bold text-cyan-300 font-mono text-sm tabular-nums">
                {isVictory ? `${timeRemaining}s left` : `${timeElapsed}s run`}
              </span>
            </div>

            <div className="rounded-lg bg-indigo-950/40 p-2">
              <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mb-0.5">
                <Target className="w-3 h-3 text-emerald-400" />
                <span>Pairs</span>
              </div>
              <span className="font-bold text-emerald-300 font-mono text-sm tabular-nums">
                {matchedPairs}/{totalPairs}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2.5">
          {/* If victorious and next level exists */}
          {isVictory && levelNumber < 3 ? (
            <button
              onClick={() => {
                soundManager.playClick();
                onNextLevel();
              }}
              className="w-full py-3 px-4 rounded-xl font-display font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:via-purple-500 hover:to-cyan-400 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              <span>Next Level (Level {levelNumber + 1})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : null}

          {/* Play Again button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onPlayAgain();
            }}
            className={`w-full py-3 px-4 rounded-xl font-display font-semibold text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${
              isVictory && levelNumber < 3
                ? 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800'
                : 'text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:via-purple-500 hover:to-cyan-400 shadow-lg shadow-indigo-600/30'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isVictory ? 'Play Level Again' : 'Try Again'}</span>
          </button>

          {/* Back to Home / Select Level */}
          <button
            onClick={() => {
              soundManager.playClick();
              onGoHome();
            }}
            className="w-full py-2.5 px-4 rounded-xl font-medium text-xs text-slate-400 hover:text-white hover:bg-slate-900/40 transition-colors flex items-center justify-center gap-2 focus:outline-none focus-visible:underline"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Choose Difficulty / Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};

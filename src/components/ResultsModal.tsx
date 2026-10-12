import React from 'react';
import { Trophy, Star, RotateCcw, ArrowRight, Home, Sparkles, AlertCircle, Clock, Footprints, Target, Coins, Flame, Award } from 'lucide-react';
import { GameResult } from '../types/game';
import { soundManager } from '../utils/audio';

interface ResultsModalProps {
  result: GameResult;
  currentCoinsBalance: number;
  onPlayAgain: () => void;
  onNextLevel: () => void;
  onGoHome: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  result,
  currentCoinsBalance,
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
    coinRewards,
    streakUpdated,
  } = result;

  const totalLevelCoins = coinRewards ? coinRewards.levelTotalCoins : 0;
  const streakBonus = coinRewards ? coinRewards.streakBonusCoins : 0;
  const grandTotalCoins = coinRewards ? coinRewards.totalCoinsAwarded : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="results-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-indigo-900/80 bg-[#0d122e] p-5 sm:p-7 shadow-2xl text-center relative overflow-hidden max-h-[95vh] overflow-y-auto">
        {/* Ambient glow accent */}
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-28 blur-3xl rounded-full pointer-events-none ${
            isVictory ? 'bg-cyan-500/25' : 'bg-rose-500/20'
          }`}
        />

        {/* Top Icon Emblem */}
        <div className="relative mb-2 sm:mb-3">
          <div
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg border ${
              isVictory
                ? 'bg-indigo-950/90 border-cyan-400/50 text-cyan-300 shadow-cyan-500/20'
                : 'bg-rose-950/60 border-rose-800/50 text-rose-400 shadow-rose-500/20'
            }`}
          >
            {isVictory ? (
              <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400 animate-bounce" />
            ) : (
              <AlertCircle className="w-7 h-7 sm:w-8 sm:h-8" />
            )}
          </div>

          {/* New Best High Score Badge */}
          {isNewBestScore && isVictory && (
            <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-bold uppercase tracking-wider animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>New Personal Best!</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h2 id="results-title" className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
          {isVictory ? 'Challenge Clear!' : 'Time Expired'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-0.5 mb-3">
          {isVictory
            ? `Level ${levelNumber} conquered with flying colors!`
            : 'The clock ran out before all pairs were matched.'}
        </p>

        {/* Star Rating (on Victory) */}
        {isVictory && (
          <div className="flex items-center justify-center gap-2 mb-3">
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
                    className={`w-6 h-6 sm:w-7 sm:h-7 ${
                      isFilled ? 'fill-amber-400 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' : ''
                    }`}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* COIN REWARDS PRESENTATION (Section 3 & 4) */}
        {isVictory && coinRewards && (
          <div className="rounded-xl bg-amber-950/20 border border-amber-500/40 p-3.5 mb-3 text-left space-y-2">
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-1.5">
              <div className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="font-display font-bold text-xs uppercase tracking-wider text-amber-200">
                  MindCoins Earned
                </span>
              </div>
              <span className="font-display font-black text-xl text-yellow-300 tabular-nums">
                +{grandTotalCoins}
              </span>
            </div>

            {/* Compact Breakdown */}
            <div className="grid grid-cols-2 gap-1.5 text-[11px] text-amber-200/90 pt-0.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Base Reward:</span>
                <span className="font-mono tabular-nums">+{coinRewards.baseCoins}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Speed Bonus:</span>
                <span className="font-mono tabular-nums">+{coinRewards.timeBonusCoins}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Move Efficiency:</span>
                <span className="font-mono tabular-nums">+{coinRewards.movesBonusCoins}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Hint-Free Bonus:</span>
                <span className="font-mono tabular-nums">+{coinRewards.hintFreeBonusCoins}</span>
              </div>
            </div>

            {/* Streak Bonus Banner if achieved */}
            {streakBonus > 0 && streakUpdated && (
              <div className="mt-1 pt-1.5 border-t border-amber-500/30 flex items-center justify-between text-xs text-orange-300 font-semibold">
                <div className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                  <span>Day {streakUpdated.currentStreak} Streak Bonus:</span>
                </div>
                <span className="font-mono text-amber-300 tabular-nums">+{streakBonus} Coins</span>
              </div>
            )}

            {/* Encouraging summary message & balance */}
            <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 border-t border-amber-500/20">
              <span className="text-amber-300/90 font-medium">
                Excellent performance! You earned {grandTotalCoins} MindCoins!
              </span>
              <span className="font-mono text-slate-300 shrink-0 ml-1">
                Bal: {currentCoinsBalance}
              </span>
            </div>
          </div>
        )}

        {/* Unlocked notification banner */}
        {nextLevelUnlocked && isVictory && (
          <div className="mb-3 py-1.5 px-3 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 text-xs font-semibold flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Next Level Unlocked! (Level {levelNumber + 1})</span>
          </div>
        )}

        {/* Score & Breakdown Card */}
        <div className="rounded-xl bg-slate-900/70 border border-indigo-950/80 p-3 sm:p-4 mb-4 text-left space-y-2">
          <div className="flex items-center justify-between border-b border-indigo-950/80 pb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Score</span>
            <span className="font-display font-black text-xl sm:text-2xl text-white tabular-nums">
              {score}
            </span>
          </div>

          {isVictory && (
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 pt-0.5">
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
            <div className="rounded-lg bg-indigo-950/40 p-1.5">
              <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mb-0.5">
                <Footprints className="w-3 h-3 text-indigo-400" />
                <span>Moves</span>
              </div>
              <span className="font-bold text-slate-200 font-mono text-xs sm:text-sm tabular-nums">{moves}</span>
            </div>

            <div className="rounded-lg bg-indigo-950/40 p-1.5">
              <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mb-0.5">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>Time</span>
              </div>
              <span className="font-bold text-cyan-300 font-mono text-xs sm:text-sm tabular-nums">
                {isVictory ? `${timeRemaining}s left` : `${timeElapsed}s run`}
              </span>
            </div>

            <div className="rounded-lg bg-indigo-950/40 p-1.5">
              <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mb-0.5">
                <Target className="w-3 h-3 text-emerald-400" />
                <span>Pairs</span>
              </div>
              <span className="font-bold text-emerald-300 font-mono text-xs sm:text-sm tabular-nums">
                {matchedPairs}/{totalPairs}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2">
          {/* Unlimited Next Level button on Victory */}
          {isVictory && (
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
          )}

          {/* Play Again button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onPlayAgain();
            }}
            className={`w-full py-2.5 px-4 rounded-xl font-display font-semibold text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${
              isVictory
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
            className="w-full py-2 px-4 rounded-xl font-medium text-xs text-slate-400 hover:text-white hover:bg-slate-900/40 transition-colors flex items-center justify-center gap-2 focus:outline-none focus-visible:underline"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Choose Level / Main Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};

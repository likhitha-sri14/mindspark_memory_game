import React from 'react';
import { X, Flame, Trophy, Calendar, Coins, Sparkles, CheckCircle2 } from 'lucide-react';
import { PlayerProgress } from '../types/game';
import { getNextStreakMilestone } from '../utils/streak';
import { soundManager } from '../utils/audio';

interface StreakModalProps {
  progress: PlayerProgress;
  onClose: () => void;
}

export const StreakModal: React.FC<StreakModalProps> = ({ progress, onClose }) => {
  const nextMilestone = getNextStreakMilestone(progress.currentStreak);

  const milestonesList = [
    { day: 1, reward: 5 },
    { day: 2, reward: 10 },
    { day: 3, reward: 15 },
    { day: 4, reward: 20 },
    { day: 5, reward: 25 },
    { day: 6, reward: 30 },
    { day: 7, reward: 50 },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="streak-modal-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-indigo-900/80 bg-[#0d122e] p-6 shadow-2xl relative text-left">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-indigo-950 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-950/70 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Flame className="w-4 h-4 fill-orange-400" />
            </div>
            <div>
              <h3 id="streak-modal-title" className="font-display font-bold text-lg text-white">
                Daily Play Streak
              </h3>
              <p className="text-[11px] text-slate-400">Play consecutive days to unlock MindCoin bonuses</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            aria-label="Close streak details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Status Highlights */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <div className="p-3 rounded-xl bg-orange-950/30 border border-orange-500/30 text-center">
            <span className="text-[10px] font-semibold text-orange-300 uppercase tracking-wider block mb-0.5">
              Current Streak
            </span>
            <div className="flex items-center justify-center gap-1.5 font-display font-black text-2xl text-white">
              <Flame className="w-5 h-5 text-orange-400 fill-orange-400" />
              <span>{progress.currentStreak} {progress.currentStreak === 1 ? 'Day' : 'Days'}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-indigo-950 text-center">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
              Longest Streak
            </span>
            <div className="flex items-center justify-center gap-1.5 font-display font-bold text-2xl text-slate-200">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>{progress.longestStreak} {progress.longestStreak === 1 ? 'Day' : 'Days'}</span>
            </div>
          </div>
        </div>

        {/* Detailed Stats List */}
        <div className="rounded-xl bg-slate-900/60 border border-indigo-950 p-3.5 space-y-2 mb-4 text-xs text-slate-300">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              Last Qualifying Play:
            </span>
            <span className="font-mono text-slate-200">
              {progress.lastPlayedDate || 'None yet'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Next Milestone:
            </span>
            <span className="font-semibold text-amber-300">
              Day {nextMilestone.nextDay} (+{nextMilestone.nextBonus} Coins)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Coins className="w-3.5 h-3.5 text-yellow-400" />
              Streak Coins Won:
            </span>
            <span className="font-mono font-bold text-yellow-300">
              {progress.streakCoinsEarned} MindCoins
            </span>
          </div>
        </div>

        {/* Weekly Milestone Roadmap */}
        <div className="mb-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            Consecutive Day Rewards (Cycle 1–7)
          </span>
          <div className="grid grid-cols-7 gap-1">
            {milestonesList.map((m) => {
              const isPastOrCurrent = progress.currentStreak >= m.day;
              return (
                <div
                  key={m.day}
                  className={`p-1.5 rounded-lg border text-center transition-all ${
                    isPastOrCurrent
                      ? 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                      : 'bg-slate-900/40 border-slate-800 text-slate-500'
                  }`}
                >
                  <span className="text-[9px] block font-mono text-slate-400">D{m.day}</span>
                  <span className="text-[10px] font-bold block text-amber-300">+{m.reward}</span>
                  {isPastOrCurrent && (
                    <CheckCircle2 className="w-2.5 h-2.5 text-amber-400 mx-auto mt-0.5" />
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
            After Day 7, each subsequent 7-day milestone awards 50 MindCoins!
          </p>
        </div>

        {/* Done Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="w-full py-2.5 px-4 rounded-xl font-display font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          Close
        </button>
      </div>
    </div>
  );
};

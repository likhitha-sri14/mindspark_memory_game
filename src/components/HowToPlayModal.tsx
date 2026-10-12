import React from 'react';
import { X, CheckCircle2, Clock, Lightbulb, Star, Trophy, Coins, Flame, Layers } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-to-play-title"
    >
      <div className="w-full max-w-lg rounded-2xl border border-indigo-900/80 bg-[#0d122e] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-indigo-950 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <h3 id="how-to-play-title" className="font-display font-bold text-xl text-white">
              How to Play MindSpark
            </h3>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            aria-label="Close rules dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content sections */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-300">
          {/* Core Mechanics */}
          <div className="rounded-xl bg-slate-900/60 border border-indigo-950 p-3.5 space-y-2">
            <h4 className="font-display font-semibold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Core Rules</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              All cards start face down. Click or tap any card to reveal its symbol, then select a second card to find its twin.
            </p>
            <ul className="text-xs space-y-1 text-slate-300 list-disc list-inside">
              <li><strong className="text-white">Match:</strong> The pair remains revealed on the board.</li>
              <li><strong className="text-white">Mismatch:</strong> Both cards flip face-down after a brief moment.</li>
              <li><strong className="text-white">Goal:</strong> Discover all matching pairs before the countdown timer reaches zero!</li>
            </ul>
          </div>

          {/* Unlimited Levels */}
          <div className="rounded-xl bg-slate-900/60 border border-indigo-950 p-3.5 space-y-2">
            <h4 className="font-display font-semibold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Unlimited Level Progression</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Conquer each trial to immediately unlock the next level without limit. Replay any unlocked level anytime from the level selector to practice and refine your mental stamina.
            </p>
          </div>

          {/* MindCoins System */}
          <div className="rounded-xl bg-slate-900/60 border border-indigo-950 p-3.5 space-y-2">
            <h4 className="font-display font-semibold text-white flex items-center gap-2">
              <Coins className="w-4 h-4 text-yellow-400" />
              <span>MindCoins Reward System</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every completed level awards between <strong className="text-yellow-300">20 and 50 MindCoins</strong> based on your performance:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded bg-amber-950/30 border border-amber-900/40">
                <span className="text-amber-300 font-bold block">+20 Base Coins</span>
                <span className="text-slate-400">Guaranteed upon level victory</span>
              </div>
              <div className="p-2 rounded bg-amber-950/30 border border-amber-900/40">
                <span className="text-amber-300 font-bold block">Up to +15 Time Bonus</span>
                <span className="text-slate-400">Proportional to time remaining</span>
              </div>
              <div className="p-2 rounded bg-amber-950/30 border border-amber-900/40">
                <span className="text-amber-300 font-bold block">Up to +10 Move Efficiency</span>
                <span className="text-slate-400">Relative to minimum moves</span>
              </div>
              <div className="p-2 rounded bg-amber-950/30 border border-amber-900/40">
                <span className="text-amber-300 font-bold block">+5 Hint-Free Bonus</span>
                <span className="text-slate-400">Win without using assists</span>
              </div>
            </div>
          </div>

          {/* Daily Streak Rewards */}
          <div className="rounded-xl bg-slate-900/60 border border-indigo-950 p-3.5 space-y-2">
            <h4 className="font-display font-semibold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Daily Play Streaks</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Complete at least one level every calendar day to advance your active streak and claim consecutive milestone bonuses:
            </p>
            <div className="flex flex-wrap gap-1.5 text-[11px] pt-1">
              <span className="px-2 py-0.5 rounded bg-orange-950/50 border border-orange-500/40 text-orange-300">Day 1: +5</span>
              <span className="px-2 py-0.5 rounded bg-orange-950/50 border border-orange-500/40 text-orange-300">Day 2: +10</span>
              <span className="px-2 py-0.5 rounded bg-orange-950/50 border border-orange-500/40 text-orange-300">Day 3: +15</span>
              <span className="px-2 py-0.5 rounded bg-orange-950/50 border border-orange-500/40 text-orange-300">Day 4: +20</span>
              <span className="px-2 py-0.5 rounded bg-orange-950/50 border border-orange-500/40 text-orange-300">Day 5: +25</span>
              <span className="px-2 py-0.5 rounded bg-orange-950/50 border border-orange-500/40 text-orange-300">Day 6: +30</span>
              <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/50 text-amber-300 font-bold">Day 7+: +50</span>
            </div>
          </div>

          {/* Scoring System */}
          <div className="rounded-xl bg-slate-900/60 border border-indigo-950 p-3.5 space-y-2">
            <h4 className="font-display font-semibold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>In-Game Score Points</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded bg-indigo-950/40 border border-indigo-900/30">
                <span className="text-emerald-400 font-bold block">+100 Points</span>
                <span className="text-slate-400">For every matched pair</span>
              </div>
              <div className="p-2 rounded bg-indigo-950/40 border border-indigo-900/30">
                <span className="text-rose-400 font-bold block">-10 Points</span>
                <span className="text-slate-400">For each mismatch attempt</span>
              </div>
              <div className="p-2 rounded bg-indigo-950/40 border border-indigo-900/30">
                <span className="text-cyan-300 font-bold block">+10 Pts / Sec</span>
                <span className="text-slate-400">Time bonus on victory</span>
              </div>
              <div className="p-2 rounded bg-indigo-950/40 border border-indigo-900/30">
                <span className="text-amber-400 font-bold block">-25 Points</span>
                <span className="text-slate-400">Per hint reveal used</span>
              </div>
            </div>
          </div>

          {/* Star System */}
          <div className="rounded-xl bg-slate-900/60 border border-indigo-950 p-3.5 space-y-2">
            <h4 className="font-display font-semibold text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400/30" />
              <span>Performance Stars</span>
            </h4>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">⭐⭐⭐ 3 Stars:</span>
                <span>Exceptional memory with minimal moves and healthy time remaining.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">⭐⭐ 2 Stars:</span>
                <span>Good performance with steady moves before the clock runs down.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">⭐ 1 Star:</span>
                <span>Clear the level before timer expires.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Got it button */}
        <div className="mt-5 pt-3 border-t border-indigo-950">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-xl font-display font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            Ready to Play
          </button>
        </div>
      </div>
    </div>
  );
};

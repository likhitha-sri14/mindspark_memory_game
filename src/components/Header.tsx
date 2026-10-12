import React from 'react';
import { Volume2, VolumeX, HelpCircle, Settings as SettingsIcon, Award, Sparkles, Coins, Flame } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHowToPlay: () => void;
  onOpenSettings: () => void;
  onOpenStreakDetails: () => void;
  onGoHome: () => void;
  highScore: number;
  highestLevel: number;
  coins: number;
  currentStreak: number;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  onOpenHowToPlay,
  onOpenSettings,
  onOpenStreakDetails,
  onGoHome,
  highScore,
  highestLevel,
  coins,
  currentStreak,
}) => {
  return (
    <header className="w-full border-b border-indigo-950/60 bg-[#0c1026]/80 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <button
          onClick={() => {
            soundManager.playClick();
            onGoHome();
          }}
          className="flex items-center gap-2 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg py-1 px-1 transition-all shrink-0"
          aria-label="MindSpark Home"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-900/30 group-hover:shadow-cyan-500/20 transition-shadow">
            <div className="w-full h-full bg-[#0c1026] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <span className="font-display font-extrabold text-base sm:text-xl tracking-tight bg-gradient-to-r from-white via-indigo-100 to-cyan-300 bg-clip-text text-transparent">
              MindSpark
            </span>
            <span className="hidden md:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider text-cyan-400/80">
              Memory Challenge
            </span>
          </div>
        </button>

        {/* Global Progress Meta & Economy Indicators */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* MindCoins Balance */}
          <div
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg bg-amber-950/30 border border-amber-500/30 text-xs shadow-sm"
            title={`${coins} MindCoins`}
          >
            <Coins className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400/20" />
            <span className="font-bold text-amber-200 tabular-nums">{coins}</span>
            <span className="hidden sm:inline text-[10px] text-amber-300/70 font-medium">Coins</span>
          </div>

          {/* Daily Streak Badge (Clickable for streak details modal) */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenStreakDetails();
            }}
            className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg border text-xs transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${
              currentStreak > 0
                ? 'bg-orange-950/40 border-orange-500/40 text-orange-300 hover:bg-orange-900/40 shadow-sm shadow-orange-500/10'
                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-300'
            }`}
            title="Click for Daily Streak details"
            aria-label={`${currentStreak} day daily streak`}
          >
            <Flame className={`w-3.5 h-3.5 ${currentStreak > 0 ? 'text-orange-400 fill-orange-400' : 'text-slate-500'}`} />
            <span className="font-bold tabular-nums">{currentStreak}</span>
            <span className="hidden sm:inline text-[10px]">{currentStreak === 1 ? 'Day' : 'Days'}</span>
          </button>

          {/* Highest Unlocked Level meta */}
          <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-950/40 border border-indigo-900/40 text-xs text-slate-400">
            <span>Level:</span>
            <span className="font-semibold text-cyan-300 ml-0.5">L{highestLevel}</span>
          </div>

          {/* Audio toggle button */}
          <button
            onClick={() => {
              onToggleSound();
              soundManager.playClick();
            }}
            className={`p-1.5 sm:p-2 rounded-lg border transition-all text-xs font-medium flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
              soundEnabled
                ? 'bg-indigo-950/60 border-indigo-800/60 text-cyan-300 hover:bg-indigo-900/60'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
            title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* How to Play button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenHowToPlay();
            }}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-indigo-900/60 bg-indigo-950/40 hover:bg-indigo-900/50 text-slate-300 hover:text-white transition-all text-xs font-medium flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            title="How to Play"
            aria-label="How to play instructions"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">Guide</span>
          </button>

          {/* Settings button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenSettings();
            }}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-indigo-900/60 bg-indigo-950/40 hover:bg-indigo-900/50 text-slate-300 hover:text-white transition-all text-xs font-medium flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            title="Game Settings"
            aria-label="Game settings"
          >
            <SettingsIcon className="w-4 h-4 text-purple-400" />
            <span className="hidden md:inline">Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};

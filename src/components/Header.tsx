import React from 'react';
import { Volume2, VolumeX, HelpCircle, Settings as SettingsIcon, Award, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHowToPlay: () => void;
  onOpenSettings: () => void;
  onGoHome: () => void;
  highScore: number;
  highestLevel: number;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  onOpenHowToPlay,
  onOpenSettings,
  onGoHome,
  highScore,
  highestLevel,
}) => {
  return (
    <header className="w-full border-b border-indigo-950/60 bg-[#0c1026]/80 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <button
          onClick={() => {
            soundManager.playClick();
            onGoHome();
          }}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg py-1 px-1.5 transition-all"
          aria-label="MindSpark Home"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-900/30 group-hover:shadow-cyan-500/20 transition-shadow">
            <div className="w-full h-full bg-[#0c1026] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-300 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-indigo-100 to-cyan-300 bg-clip-text text-transparent">
              MindSpark
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider text-cyan-400/80">
              Memory Challenge
            </span>
          </div>
        </button>

        {/* Global Progress Meta & Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* High Score & Level meta */}
          <div className="hidden md:flex items-center gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-950/40 border border-indigo-900/40">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Best:</span>
              <span className="font-semibold text-slate-100 tabular-nums">{highScore}</span>
            </div>
            <div className="px-2.5 py-1 rounded-md bg-indigo-950/40 border border-indigo-900/40">
              <span>Level Unlocked:</span>
              <span className="font-semibold text-cyan-300 ml-1">L{highestLevel}</span>
            </div>
          </div>

          {/* Audio toggle button */}
          <button
            onClick={() => {
              onToggleSound();
              soundManager.playClick();
            }}
            className={`p-2 rounded-lg border transition-all text-xs font-medium flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
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
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg border border-indigo-900/60 bg-indigo-950/40 hover:bg-indigo-900/50 text-slate-300 hover:text-white transition-all text-xs font-medium flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            title="How to Play"
            aria-label="How to play instructions"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Guide</span>
          </button>

          {/* Settings button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenSettings();
            }}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg border border-indigo-900/60 bg-indigo-950/40 hover:bg-indigo-900/50 text-slate-300 hover:text-white transition-all text-xs font-medium flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            title="Game Settings"
            aria-label="Game settings"
          >
            <SettingsIcon className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};

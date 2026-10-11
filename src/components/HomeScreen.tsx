import React from 'react';
import { Play, HelpCircle, Settings as SettingsIcon, Trophy, Star, ShieldCheck, Zap, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { PlayerProgress, Difficulty } from '../types/game';
import { soundManager } from '../utils/audio';
import emblemImg from '../assets/images/mindspark_game_emblem_1791741763792.jpg';

interface HomeScreenProps {
  progress: PlayerProgress;
  onStartGame: (difficulty: Difficulty) => void;
  onOpenDifficultySelect: () => void;
  onOpenHowToPlay: () => void;
  onOpenSettings: () => void;
  onToggleSound: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  progress,
  onStartGame,
  onOpenDifficultySelect,
  onOpenHowToPlay,
  onOpenSettings,
  onToggleSound,
}) => {
  const totalStars = Object.values(progress.starsByLevel).reduce((acc, curr) => acc + curr, 0);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-8 px-4 sm:px-6 relative overflow-hidden">
      {/* Ambient background glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-purple-700/20 via-indigo-600/15 to-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-600/10 blur-[90px] rounded-full pointer-events-none" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-purple-600/10 blur-[90px] rounded-full pointer-events-none" />

      <div className="w-full max-w-3xl relative z-10 flex flex-col items-center text-center">
        {/* Emblem Hero Visual */}
        <div className="relative mb-6 group">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 rounded-3xl blur-md opacity-60 group-hover:opacity-90 transition duration-500" />
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border border-indigo-400/30 bg-[#0d122e] shadow-2xl flex items-center justify-center">
            <img
              src={emblemImg}
              alt="MindSpark Neural Challenge Emblem"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c1026]/70 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-2 mb-8">
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl tracking-tight bg-gradient-to-b from-white via-indigo-100 to-cyan-200 bg-clip-text text-transparent">
            MindSpark
          </h1>
          <p className="text-base sm:text-xl font-medium text-cyan-300/90 tracking-wide">
            Train Your Brain. Beat Your Best.
          </p>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto pt-1">
            Test and sharpen your visual recall, cognitive reflexes, and concentration across 3 progressive memory trials.
          </p>
        </div>

        {/* Stats Strip */}
        <div className="w-full max-w-lg grid grid-cols-3 gap-2.5 sm:gap-4 mb-8">
          {/* Best Score */}
          <div className="rounded-xl bg-slate-900/60 border border-indigo-900/40 p-3 flex flex-col items-center backdrop-blur-sm shadow-md">
            <div className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-amber-400 mb-0.5">
              <Trophy className="w-3.5 h-3.5" />
              <span>Best Score</span>
            </div>
            <div className="font-display font-bold text-xl sm:text-2xl text-white tabular-nums">
              {progress.highScore}
            </div>
          </div>

          {/* Highest Unlocked Level */}
          <div className="rounded-xl bg-slate-900/60 border border-indigo-900/40 p-3 flex flex-col items-center backdrop-blur-sm shadow-md">
            <div className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-cyan-400 mb-0.5">
              <Zap className="w-3.5 h-3.5" />
              <span>Highest Level</span>
            </div>
            <div className="font-display font-bold text-xl sm:text-2xl text-cyan-200">
              Level {progress.highestUnlockedLevel}
            </div>
          </div>

          {/* Total Stars */}
          <div className="rounded-xl bg-slate-900/60 border border-indigo-900/40 p-3 flex flex-col items-center backdrop-blur-sm shadow-md">
            <div className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-purple-400 mb-0.5">
              <Star className="w-3.5 h-3.5 fill-purple-400" />
              <span>Stars Won</span>
            </div>
            <div className="font-display font-bold text-xl sm:text-2xl text-purple-200 tabular-nums">
              {totalStars} / 9
            </div>
          </div>
        </div>

        {/* Primary Interactive CTA Buttons */}
        <div className="w-full max-w-md flex flex-col gap-3 mb-8">
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenDifficultySelect();
            }}
            className="w-full py-4 px-6 rounded-xl font-display font-bold text-lg text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:via-purple-500 hover:to-cyan-400 active:scale-[0.99] shadow-lg shadow-indigo-600/30 hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Play Game</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenHowToPlay();
              }}
              className="py-3 px-4 rounded-xl font-medium text-sm text-slate-200 bg-slate-900/70 hover:bg-indigo-950/70 border border-indigo-800/40 hover:border-indigo-600/60 active:scale-[0.99] transition-all flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>How to Play</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onOpenSettings();
              }}
              className="py-3 px-4 rounded-xl font-medium text-sm text-slate-200 bg-slate-900/70 hover:bg-indigo-950/70 border border-indigo-800/40 hover:border-indigo-600/60 active:scale-[0.99] transition-all flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <SettingsIcon className="w-4 h-4 text-purple-400" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Quick Difficulty Launcher Strip */}
        <div className="w-full max-w-lg border-t border-indigo-950/60 pt-6">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
            <span className="font-semibold uppercase tracking-wider">Quick Start Difficulty</span>
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenDifficultySelect();
              }}
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              View Campaign &rarr;
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {/* Easy */}
            <button
              onClick={() => {
                soundManager.playClick();
                onStartGame('easy');
              }}
              className="p-2.5 rounded-lg border border-indigo-900/40 bg-slate-900/40 hover:bg-indigo-950/60 hover:border-emerald-500/50 transition-all text-left flex flex-col group focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"
            >
              <span className="text-[11px] font-semibold text-emerald-400 group-hover:text-emerald-300 flex items-center justify-between">
                Easy
                <span className="text-[10px] text-slate-500 font-mono">4×3</span>
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">6 Pairs · 90s</span>
            </button>

            {/* Medium */}
            <button
              onClick={() => {
                if (progress.highestUnlockedLevel >= 2) {
                  soundManager.playClick();
                  onStartGame('medium');
                } else {
                  soundManager.playMismatch();
                  onOpenDifficultySelect();
                }
              }}
              className={`p-2.5 rounded-lg border transition-all text-left flex flex-col group focus:outline-none focus-visible:ring-1 ${
                progress.highestUnlockedLevel >= 2
                  ? 'border-indigo-900/40 bg-slate-900/40 hover:bg-indigo-950/60 hover:border-cyan-500/50 focus-visible:ring-cyan-400'
                  : 'border-slate-800/40 bg-slate-950/30 opacity-60 cursor-not-allowed'
              }`}
            >
              <span className={`text-[11px] font-semibold flex items-center justify-between ${
                progress.highestUnlockedLevel >= 2 ? 'text-cyan-400 group-hover:text-cyan-300' : 'text-slate-500'
              }`}>
                Medium
                <span className="text-[10px] text-slate-500 font-mono">{progress.highestUnlockedLevel >= 2 ? '4×4' : '🔒'}</span>
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">8 Pairs · 75s</span>
            </button>

            {/* Hard */}
            <button
              onClick={() => {
                if (progress.highestUnlockedLevel >= 3) {
                  soundManager.playClick();
                  onStartGame('hard');
                } else {
                  soundManager.playMismatch();
                  onOpenDifficultySelect();
                }
              }}
              className={`p-2.5 rounded-lg border transition-all text-left flex flex-col group focus:outline-none focus-visible:ring-1 ${
                progress.highestUnlockedLevel >= 3
                  ? 'border-indigo-900/40 bg-slate-900/40 hover:bg-indigo-950/60 hover:border-purple-500/50 focus-visible:ring-purple-400'
                  : 'border-slate-800/40 bg-slate-950/30 opacity-60 cursor-not-allowed'
              }`}
            >
              <span className={`text-[11px] font-semibold flex items-center justify-between ${
                progress.highestUnlockedLevel >= 3 ? 'text-purple-400 group-hover:text-purple-300' : 'text-slate-500'
              }`}>
                Hard
                <span className="text-[10px] text-slate-500 font-mono">{progress.highestUnlockedLevel >= 3 ? '6×4' : '🔒'}</span>
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">12 Pairs · 60s</span>
            </button>
          </div>
        </div>

        {/* Sound toggle quick control in bottom bar */}
        <div className="mt-8 flex items-center gap-2 text-xs text-slate-500">
          <button
            onClick={() => {
              onToggleSound();
              soundManager.playClick();
            }}
            className="flex items-center gap-1.5 hover:text-slate-300 transition-colors focus:outline-none focus-visible:underline"
          >
            {progress.soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
            <span>Audio SFX: {progress.soundEnabled ? 'Enabled' : 'Muted'}</span>
          </button>
          <span>·</span>
          <span>Keyboard shortcuts enabled</span>
        </div>
      </div>
    </div>
  );
};

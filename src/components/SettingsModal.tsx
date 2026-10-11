import React, { useState } from 'react';
import { X, Volume2, VolumeX, Eye, Palette, Trash2, Check } from 'lucide-react';
import { PlayerProgress } from '../types/game';
import { ConfirmModal } from './ConfirmModal';
import { soundManager } from '../utils/audio';

interface SettingsModalProps {
  progress: PlayerProgress;
  onUpdateProgress: (updated: Partial<PlayerProgress>) => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  progress,
  onUpdateProgress,
  onResetProgress,
  onClose,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
      >
        <div className="w-full max-w-md rounded-2xl border border-indigo-900/80 bg-[#0d122e] p-6 shadow-2xl relative">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-indigo-950 pb-4 mb-4">
            <h3 id="settings-modal-title" className="font-display font-bold text-xl text-white">
              Settings & Preferences
            </h3>
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label="Close settings"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Audio Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-indigo-950">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg ${progress.soundEnabled ? 'bg-cyan-950/60 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
                  {progress.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-semibold text-white block">Sound Effects</span>
                  <span className="text-[11px] text-slate-400">Web Audio card flips, chimes & victory cues</span>
                </div>
              </div>
              <button
                onClick={() => {
                  const next = !progress.soundEnabled;
                  onUpdateProgress({ soundEnabled: next });
                  soundManager.setMuted(!next);
                  if (next) soundManager.playClick();
                }}
                className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  progress.soundEnabled ? 'bg-cyan-600' : 'bg-slate-700'
                }`}
                role="switch"
                aria-checked={progress.soundEnabled}
                aria-label="Toggle sound effects"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 left-0.5 shadow-sm ${
                    progress.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Reduced Motion Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-indigo-950">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg ${progress.reducedMotion ? 'bg-purple-950/60 text-purple-300' : 'bg-slate-800 text-slate-400'}`}>
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-semibold text-white block">Reduced Motion</span>
                  <span className="text-[11px] text-slate-400">Disable 3D card rotation animations</span>
                </div>
              </div>
              <button
                onClick={() => {
                  soundManager.playClick();
                  onUpdateProgress({ reducedMotion: !progress.reducedMotion });
                }}
                className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  progress.reducedMotion ? 'bg-purple-600' : 'bg-slate-700'
                }`}
                role="switch"
                aria-checked={progress.reducedMotion}
                aria-label="Toggle reduced motion"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 left-0.5 shadow-sm ${
                    progress.reducedMotion ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Theme Preference */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-indigo-950 space-y-2">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-cyan-400" />
                <span className="text-xs sm:text-sm font-semibold text-white">Atmosphere Theme</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['midnight', 'neon', 'amethyst'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      soundManager.playClick();
                      onUpdateProgress({ theme: t });
                    }}
                    className={`py-2 px-2.5 rounded-lg border text-xs font-medium capitalize flex items-center justify-center gap-1.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                      progress.theme === t
                        ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200'
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {progress.theme === t && <Check className="w-3 h-3 text-cyan-400" />}
                    <span>{t}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Progress Section */}
            <div className="pt-2 border-t border-indigo-950/80">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowConfirmReset(true);
                }}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-medium text-rose-300 hover:text-white bg-rose-950/30 hover:bg-rose-900/40 border border-rose-900/40 transition-colors flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset All Game Progress</span>
              </button>
            </div>
          </div>

          {/* Close button */}
          <div className="mt-5">
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl font-display font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {showConfirmReset && (
        <ConfirmModal
          title="Reset Saved Progress?"
          message="This will reset your best scores, stars earned, and lock levels 2 & 3 back to Level 1. This action cannot be undone."
          confirmText="Yes, Reset All"
          cancelText="Keep My Records"
          onConfirm={() => {
            onResetProgress();
            setShowConfirmReset(false);
          }}
          onCancel={() => setShowConfirmReset(false)}
        />
      )}
    </>
  );
};

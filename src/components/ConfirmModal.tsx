import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-desc"
    >
      <div className="w-full max-w-sm rounded-2xl border border-rose-900/60 bg-[#0d122e] p-6 shadow-2xl text-center relative overflow-hidden">
        <div className="w-12 h-12 rounded-xl bg-rose-950/60 border border-rose-800/60 mx-auto flex items-center justify-center text-rose-400 mb-3 shadow-inner">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 id="confirm-modal-title" className="font-display font-bold text-lg text-white">
          {title}
        </h3>
        <p id="confirm-modal-desc" className="text-xs text-slate-400 mt-1 mb-5">
          {message}
        </p>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => {
              soundManager.playClick();
              onCancel();
            }}
            className="py-2.5 px-3 rounded-xl font-medium text-xs text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              onConfirm();
            }}
            className="py-2.5 px-3 rounded-xl font-medium text-xs text-white bg-rose-600 hover:bg-rose-500 transition-colors shadow-md shadow-rose-900/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

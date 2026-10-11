import React from 'react';
import { Sparkles, Check } from 'lucide-react';
import { CardItem } from '../types/game';

interface MemoryCardProps {
  card: CardItem;
  index: number;
  onFlip: (card: CardItem) => void;
  disabled: boolean;
  reducedMotion: boolean;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({
  card,
  index,
  onFlip,
  disabled,
  reducedMotion,
}) => {
  const isRevealed = card.isFlipped || card.isMatched;

  const handleClick = () => {
    if (disabled || isRevealed) return;
    onFlip(card);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={`perspective-1000 w-full h-full aspect-[3/4] select-none touch-manipulation cursor-pointer ${
        card.isMatched ? 'cursor-default' : disabled ? 'cursor-not-allowed' : ''
      }`}
      role="button"
      tabIndex={card.isMatched ? -1 : 0}
      aria-label={`Card ${index + 1}: ${
        card.isMatched
          ? `${card.name}, matched`
          : card.isFlipped
          ? `${card.name}, face up`
          : 'face down'
      }`}
      aria-pressed={isRevealed}
      aria-disabled={disabled || card.isMatched}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div
        className={`w-full h-full relative transform-style-3d ${
          reducedMotion ? 'transition-none' : 'transition-transform duration-500 ease-out'
        } ${isRevealed ? 'rotate-y-180' : ''}`}
      >
        {/* FRONT OF TILE (When face-down to player) */}
        <div
          className={`absolute inset-0 w-full h-full rounded-xl sm:rounded-2xl backface-hidden border p-2 flex flex-col items-center justify-center transition-all ${
            card.isHinted
              ? 'border-amber-400 bg-amber-950/40 shadow-[0_0_15px_rgba(251,191,36,0.5)] animate-pulse'
              : 'border-indigo-900/60 bg-[#0d122e] hover:border-cyan-400/60 hover:shadow-[0_0_16px_rgba(6,182,212,0.3)] shadow-md'
          } group focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none`}
        >
          {/* Subtle geometric background grid pattern */}
          <div className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-10 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

          {/* Card Back Center Emblem */}
          <div className="relative z-10 w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-indigo-950/80 border border-indigo-700/50 flex items-center justify-center group-hover:scale-110 group-hover:border-cyan-400/70 transition-all duration-300">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 group-hover:text-cyan-300 transition-colors" />
          </div>

          {/* Hint indicator if active */}
          {card.isHinted && (
            <span className="absolute bottom-1.5 text-[9px] font-bold text-amber-300 tracking-wider uppercase">
              Hint
            </span>
          )}
        </div>

        {/* BACK OF TILE (When revealed face-up) */}
        <div
          className={`absolute inset-0 w-full h-full rounded-xl sm:rounded-2xl backface-hidden rotate-y-180 border p-2 flex flex-col items-center justify-between shadow-lg overflow-hidden ${
            card.isMatched
              ? 'border-emerald-400/80 bg-gradient-to-b from-[#0a2323] via-[#0b1c2b] to-[#0d122e] shadow-[0_0_18px_rgba(52,211,153,0.35)]'
              : 'border-cyan-400/60 bg-[#0d1433] shadow-[0_0_14px_rgba(34,211,238,0.25)]'
          }`}
        >
          {/* Top corner match indicator or category */}
          <div className="w-full flex items-center justify-between px-0.5 sm:px-1">
            {card.isMatched ? (
              <span className="flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
                <span className="hidden xs:inline">Match</span>
              </span>
            ) : (
              <span className="text-[8px] font-medium text-slate-400 tracking-wider uppercase truncate">
                MindSpark
              </span>
            )}
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: card.glowColor }}
            />
          </div>

          {/* Main Visual Symbol: Emoji & Glow Badge */}
          <div className="my-auto flex flex-col items-center justify-center">
            <div
              className={`text-2xl sm:text-3xl md:text-4xl filter drop-shadow-md transform transition-transform ${
                card.isMatched ? 'scale-105' : 'scale-100'
              }`}
            >
              {card.emoji}
            </div>
            <span className="text-[10px] sm:text-xs font-semibold text-slate-200 mt-1 sm:mt-1.5 text-center leading-tight line-clamp-1 max-w-[95%]">
              {card.name}
            </span>
          </div>

          {/* Bottom subtle accent bar */}
          <div
            className={`w-full h-1 rounded-full bg-gradient-to-r ${card.color} opacity-80`}
          />
        </div>
      </div>
    </div>
  );
};

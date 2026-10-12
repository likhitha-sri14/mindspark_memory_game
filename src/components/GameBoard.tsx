import React from 'react';
import { CardItem, DifficultyConfig } from '../types/game';
import { MemoryCard } from './MemoryCard';

interface GameBoardProps {
  cards: CardItem[];
  config: DifficultyConfig;
  onFlipCard: (card: CardItem) => void;
  disabled: boolean;
  reducedMotion: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  cards,
  config,
  onFlipCard,
  disabled,
  reducedMotion,
}) => {
  // Determine dynamic grid columns based on level configuration
  let gridColsClass = 'grid-cols-4';
  if (config.cols === 3) {
    gridColsClass = 'grid-cols-3';
  } else if (config.cols === 4) {
    gridColsClass = 'grid-cols-4';
  } else if (config.cols === 5) {
    gridColsClass = 'grid-cols-4 sm:grid-cols-5';
  } else if (config.cols === 6) {
    gridColsClass = 'grid-cols-4 sm:grid-cols-6';
  } else if (config.cols === 7) {
    gridColsClass = 'grid-cols-4 sm:grid-cols-7';
  } else if (config.cols >= 8) {
    gridColsClass = 'grid-cols-4 sm:grid-cols-8';
  }

  // Adaptive max-width based on column count
  let maxWidthStyle = '680px';
  if (config.cols <= 3) maxWidthStyle = '480px';
  else if (config.cols === 4) maxWidthStyle = '580px';
  else if (config.cols === 5) maxWidthStyle = '720px';
  else if (config.cols === 6) maxWidthStyle = '820px';
  else if (config.cols >= 7) maxWidthStyle = '920px';

  return (
    <div className="w-full max-w-5xl mx-auto flex items-center justify-center p-1 sm:p-2">
      <div
        className={`w-full grid ${gridColsClass} gap-2 sm:gap-3 md:gap-3.5 justify-items-center transition-all`}
        style={{
          maxWidth: maxWidthStyle,
        }}
        role="region"
        aria-label={`Memory game card grid, ${config.name}`}
      >
        {cards.map((card, index) => (
          <MemoryCard
            key={card.id}
            card={card}
            index={index}
            onFlip={onFlipCard}
            disabled={disabled}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>
    </div>
  );
};

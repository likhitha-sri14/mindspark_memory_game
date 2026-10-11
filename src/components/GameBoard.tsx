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
  // Determine dynamic grid columns based on difficulty
  let gridColsClass = 'grid-cols-4';
  if (config.key === 'easy') {
    gridColsClass = 'grid-cols-3 sm:grid-cols-4';
  } else if (config.key === 'medium') {
    gridColsClass = 'grid-cols-4';
  } else if (config.key === 'hard') {
    gridColsClass = 'grid-cols-4 sm:grid-cols-6';
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex items-center justify-center p-1 sm:p-2">
      <div
        className={`w-full grid ${gridColsClass} gap-2 sm:gap-3 md:gap-3.5 justify-items-center transition-all`}
        style={{
          maxWidth: config.key === 'hard' ? '860px' : config.key === 'medium' ? '680px' : '560px',
        }}
        role="region"
        aria-label={`Memory game card grid, ${config.name} difficulty`}
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

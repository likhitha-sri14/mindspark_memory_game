import { CardItem, Difficulty, DifficultyConfig } from '../types/game';
import { SYMBOL_POOL, SymbolDefinition } from './cardsData';

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    key: 'easy',
    levelNumber: 1,
    name: 'Easy',
    description: '4 × 3 Grid · 6 Pairs · Relaxed Pace',
    cols: 4,
    rows: 3,
    totalCards: 12,
    pairsCount: 6,
    timerSeconds: 90,
    hintsCount: 3,
    threeStarMaxMoves: 10,
    twoStarMaxMoves: 15,
    threeStarMinTimeSec: 45,
  },
  medium: {
    key: 'medium',
    levelNumber: 2,
    name: 'Medium',
    description: '4 × 4 Grid · 8 Pairs · Balanced Challenge',
    cols: 4,
    rows: 4,
    totalCards: 16,
    pairsCount: 8,
    timerSeconds: 75,
    hintsCount: 2,
    threeStarMaxMoves: 14,
    twoStarMaxMoves: 21,
    threeStarMinTimeSec: 30,
  },
  hard: {
    key: 'hard',
    levelNumber: 3,
    name: 'Hard',
    description: '6 × 4 Grid · 12 Pairs · Rapid Memory Test',
    cols: 6,
    rows: 4,
    totalCards: 24,
    pairsCount: 12,
    timerSeconds: 60,
    hintsCount: 1,
    threeStarMaxMoves: 22,
    twoStarMaxMoves: 32,
    threeStarMinTimeSec: 15,
  },
};

export const SCORING = {
  MATCH_POINTS: 100,
  MISMATCH_PENALTY: 10,
  HINT_PENALTY: 25,
  TIME_BONUS_PER_SECOND: 10,
};

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateDeck(difficulty: Difficulty): CardItem[] {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const shuffledSymbols = shuffleArray(SYMBOL_POOL);
  const chosenSymbols = shuffledSymbols.slice(0, config.pairsCount);

  const rawCards: CardItem[] = [];

  chosenSymbols.forEach((sym: SymbolDefinition) => {
    // Generate card A
    rawCards.push({
      id: `${sym.id}-card-a-${Math.random().toString(36).substring(2, 7)}`,
      pairId: sym.id,
      name: sym.name,
      emoji: sym.emoji,
      iconName: sym.iconName,
      color: sym.gradient,
      glowColor: sym.glowColor,
      isFlipped: false,
      isMatched: false,
      isHinted: false,
    });

    // Generate card B
    rawCards.push({
      id: `${sym.id}-card-b-${Math.random().toString(36).substring(2, 7)}`,
      pairId: sym.id,
      name: sym.name,
      emoji: sym.emoji,
      iconName: sym.iconName,
      color: sym.gradient,
      glowColor: sym.glowColor,
      isFlipped: false,
      isMatched: false,
      isHinted: false,
    });
  });

  return shuffleArray(rawCards);
}

export function calculateStars(
  difficulty: Difficulty,
  moves: number,
  timeRemaining: number
): number {
  const config = DIFFICULTY_CONFIGS[difficulty];
  if (moves <= config.threeStarMaxMoves && timeRemaining >= config.threeStarMinTimeSec) {
    return 3;
  }
  if (moves <= config.twoStarMaxMoves) {
    return 2;
  }
  return 1;
}

export function calculateAccuracy(matchedPairs: number, moves: number): number {
  if (moves === 0) return 100;
  // If matchedPairs is M, perfect moves is M. Accuracy = (M / moves) * 100
  const ratio = (matchedPairs / moves) * 100;
  return Math.min(100, Math.max(0, Math.round(ratio)));
}

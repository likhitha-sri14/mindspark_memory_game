import { CardItem, Difficulty, DifficultyConfig, CoinRewardBreakdown } from '../types/game';
import { SYMBOL_POOL, SymbolDefinition } from './cardsData';

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    key: 'easy',
    levelNumber: 1,
    name: 'Easy',
    tierTitle: 'Initiate',
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
    tierTitle: 'Initiate',
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
    tierTitle: 'Initiate',
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

// Generates dynamic configuration for ANY level (Levels 1 to Infinity)
export function getLevelConfig(levelNumber: number): DifficultyConfig {
  if (levelNumber <= 1) return { ...DIFFICULTY_CONFIGS.easy };
  if (levelNumber === 2) return { ...DIFFICULTY_CONFIGS.medium };
  if (levelNumber === 3) return { ...DIFFICULTY_CONFIGS.hard };

  let tier = 'Adept';
  if (levelNumber >= 31) tier = 'MindSpark Legend';
  else if (levelNumber >= 21) tier = 'Neural Ascendant';
  else if (levelNumber >= 16) tier = 'Cosmic Sage';
  else if (levelNumber >= 11) tier = 'Grandmaster';
  else if (levelNumber >= 7) tier = 'Master';

  if (levelNumber === 4) {
    return {
      key: 'level-4',
      levelNumber: 4,
      name: 'Level 4',
      tierTitle: 'Adept',
      description: '5 × 4 Grid · 10 Pairs · Focused Agility',
      cols: 5,
      rows: 4,
      totalCards: 20,
      pairsCount: 10,
      timerSeconds: 70,
      hintsCount: 2,
      threeStarMaxMoves: 16,
      twoStarMaxMoves: 23,
      threeStarMinTimeSec: 28,
    };
  }

  if (levelNumber === 5) {
    return {
      key: 'level-5',
      levelNumber: 5,
      name: 'Level 5',
      tierTitle: 'Adept',
      description: '6 × 4 Grid · 12 Pairs · Neural Synapse',
      cols: 6,
      rows: 4,
      totalCards: 24,
      pairsCount: 12,
      timerSeconds: 65,
      hintsCount: 2,
      threeStarMaxMoves: 20,
      twoStarMaxMoves: 28,
      threeStarMinTimeSec: 22,
    };
  }

  if (levelNumber === 6) {
    return {
      key: 'level-6',
      levelNumber: 6,
      name: 'Level 6',
      tierTitle: 'Adept',
      description: '6 × 4 Grid · 12 Pairs · Swift Recall',
      cols: 6,
      rows: 4,
      totalCards: 24,
      pairsCount: 12,
      timerSeconds: 60,
      hintsCount: 1,
      threeStarMaxMoves: 19,
      twoStarMaxMoves: 27,
      threeStarMinTimeSec: 20,
    };
  }

  if (levelNumber === 7) {
    return {
      key: 'level-7',
      levelNumber: 7,
      name: 'Level 7',
      tierTitle: 'Master',
      description: '6 × 4 Grid · 12 Pairs · Precision Tempo',
      cols: 6,
      rows: 4,
      totalCards: 24,
      pairsCount: 12,
      timerSeconds: 55,
      hintsCount: 1,
      threeStarMaxMoves: 19,
      twoStarMaxMoves: 26,
      threeStarMinTimeSec: 18,
    };
  }

  if (levelNumber === 8) {
    return {
      key: 'level-8',
      levelNumber: 8,
      name: 'Level 8',
      tierTitle: 'Master',
      description: '7 × 4 Grid · 14 Pairs · Quantum Memory',
      cols: 7,
      rows: 4,
      totalCards: 28,
      pairsCount: 14,
      timerSeconds: 65,
      hintsCount: 1,
      threeStarMaxMoves: 23,
      twoStarMaxMoves: 32,
      threeStarMinTimeSec: 20,
    };
  }

  if (levelNumber === 9) {
    return {
      key: 'level-9',
      levelNumber: 9,
      name: 'Level 9',
      tierTitle: 'Master',
      description: '7 × 4 Grid · 14 Pairs · Cosmic Matrix',
      cols: 7,
      rows: 4,
      totalCards: 28,
      pairsCount: 14,
      timerSeconds: 60,
      hintsCount: 1,
      threeStarMaxMoves: 22,
      twoStarMaxMoves: 31,
      threeStarMinTimeSec: 18,
    };
  }

  if (levelNumber === 10) {
    return {
      key: 'level-10',
      levelNumber: 10,
      name: 'Level 10',
      tierTitle: 'Master Milestone',
      description: '8 × 4 Grid · 16 Pairs · Master Crucible',
      cols: 8,
      rows: 4,
      totalCards: 32,
      pairsCount: 16,
      timerSeconds: 65,
      hintsCount: 1,
      threeStarMaxMoves: 26,
      twoStarMaxMoves: 36,
      threeStarMinTimeSec: 20,
    };
  }

  // Levels 11+ controlled dynamic progression:
  // Cycle pairs between 12, 14, and 16 to keep viewport ergonomically optimal and responsive on all devices.
  const cycleIndex = levelNumber % 3;
  let cols = 6;
  let pairsCount = 12;

  if (cycleIndex === 1) {
    cols = 6;
    pairsCount = 12;
  } else if (cycleIndex === 2) {
    cols = 7;
    pairsCount = 14;
  } else {
    cols = 8;
    pairsCount = 16;
  }

  const rows = 4;
  const totalCards = cols * rows;

  // Controlled timer: scales with pairs while maintaining challenging yet fair threshold (minimum 50s)
  const timerReduction = Math.min(15, Math.floor((levelNumber - 10) / 4) * 2);
  const baseTime = pairsCount === 16 ? 68 : pairsCount === 14 ? 62 : 56;
  const timerSeconds = Math.max(48, baseTime - timerReduction);

  // Milestone challenge levels (e.g. multiples of 10) give 0 hints for pinnacle test
  const isPinnacle = levelNumber % 10 === 0;
  const hintsCount = isPinnacle ? 0 : 1;

  const threeStarMaxMoves = Math.round(pairsCount * 1.55);
  const twoStarMaxMoves = Math.round(pairsCount * 2.2);
  const threeStarMinTimeSec = Math.max(12, Math.round(timerSeconds * 0.28));

  return {
    key: `level-${levelNumber}`,
    levelNumber,
    name: `Level ${levelNumber}`,
    tierTitle: tier,
    description: `${cols} × ${rows} Grid · ${pairsCount} Pairs · ${tier}`,
    cols,
    rows,
    totalCards,
    pairsCount,
    timerSeconds,
    hintsCount,
    threeStarMaxMoves,
    twoStarMaxMoves,
    threeStarMinTimeSec,
  };
}

// Deterministic Coin Reward calculation
export function calculateCoinRewards(
  totalPairs: number,
  moves: number,
  timeRemaining: number,
  maxTime: number,
  hintsUsed: number,
  streakBonus: number = 0
): CoinRewardBreakdown {
  const baseCoins = 20;

  // 1. Fast completion: up to 15 coins proportional to remaining time
  const timeRatio = maxTime > 0 ? Math.max(0, Math.min(1, timeRemaining / maxTime)) : 0;
  const timeBonusCoins = Math.min(15, Math.round(timeRatio * 15));

  // 2. Efficient matching: up to 10 coins relative to theoretical minimum (1 move per pair)
  const effMoves = Math.max(totalPairs, moves);
  const efficiencyRatio = effMoves > 0 ? totalPairs / effMoves : 1;
  const movesBonusCoins = Math.min(10, Math.round(efficiencyRatio * 10));

  // 3. Hint-free completion: 5 bonus coins if no hints used
  const hintFreeBonusCoins = hintsUsed === 0 ? 5 : 0;

  // Performance bonus capped at 30
  const performanceBonus = Math.min(30, timeBonusCoins + movesBonusCoins + hintFreeBonusCoins);

  // Level total strictly 20 to 50 coins
  const levelTotalCoins = Math.max(20, Math.min(50, baseCoins + performanceBonus));
  const totalCoinsAwarded = levelTotalCoins + streakBonus;

  return {
    baseCoins,
    timeBonusCoins,
    movesBonusCoins,
    hintFreeBonusCoins,
    performanceBonus,
    levelTotalCoins,
    streakBonusCoins: streakBonus,
    totalCoinsAwarded,
  };
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateDeck(levelOrDifficulty: Difficulty | number | DifficultyConfig): CardItem[] {
  let config: DifficultyConfig;
  if (typeof levelOrDifficulty === 'number') {
    config = getLevelConfig(levelOrDifficulty);
  } else if (typeof levelOrDifficulty === 'string') {
    config = DIFFICULTY_CONFIGS[levelOrDifficulty] || getLevelConfig(1);
  } else {
    config = levelOrDifficulty;
  }

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
  levelOrDifficulty: Difficulty | number | DifficultyConfig,
  moves: number,
  timeRemaining: number
): number {
  let config: DifficultyConfig;
  if (typeof levelOrDifficulty === 'number') {
    config = getLevelConfig(levelOrDifficulty);
  } else if (typeof levelOrDifficulty === 'string') {
    config = DIFFICULTY_CONFIGS[levelOrDifficulty] || getLevelConfig(1);
  } else {
    config = levelOrDifficulty;
  }

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
  const ratio = (matchedPairs / moves) * 100;
  return Math.min(100, Math.max(0, Math.round(ratio)));
}

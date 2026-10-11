export type Difficulty = 'easy' | 'medium' | 'hard';

export type GameScreen = 
  | 'HOME' 
  | 'DIFFICULTY_SELECT' 
  | 'PLAYING';

export type GameStatus = 
  | 'IDLE'
  | 'PLAYING'
  | 'PAUSED'
  | 'VICTORY'
  | 'GAME_OVER';

export interface CardItem {
  id: string; // Unique instance id, e.g. "gem-1", "gem-2"
  pairId: string; // Shared pair identifier, e.g. "gem"
  name: string;
  emoji: string;
  iconName: string;
  color: string;
  glowColor: string;
  isFlipped: boolean;
  isMatched: boolean;
  isHinted: boolean;
}

export interface DifficultyConfig {
  key: Difficulty;
  levelNumber: number;
  name: string;
  description: string;
  cols: number;
  rows: number;
  totalCards: number;
  pairsCount: number;
  timerSeconds: number;
  hintsCount: number;
  threeStarMaxMoves: number;
  twoStarMaxMoves: number;
  threeStarMinTimeSec: number;
}

export interface PlayerProgress {
  highScore: number;
  highestUnlockedLevel: number; // 1: easy, 2: medium, 3: hard
  bestScoresByDifficulty: Record<Difficulty, number>;
  bestTimesByDifficulty: Record<Difficulty, number>; // in seconds
  starsByLevel: Record<number, number>; // 1 -> 3, 2 -> 2, etc.
  completedLevels: number[];
  soundEnabled: boolean;
  reducedMotion: boolean;
  theme: 'midnight' | 'neon' | 'amethyst';
}

export interface GameResult {
  isVictory: boolean;
  difficulty: Difficulty;
  levelNumber: number;
  score: number;
  baseScore: number;
  timeBonus: number;
  moves: number;
  matchedPairs: number;
  totalPairs: number;
  timeRemaining: number;
  timeElapsed: number;
  starsEarned: number;
  isNewBestScore: boolean;
  isNewBestTime: boolean;
  nextLevelUnlocked: boolean;
}

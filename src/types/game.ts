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
  key: string;
  levelNumber: number;
  name: string;
  tierTitle?: string;
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

export interface CoinRewardBreakdown {
  baseCoins: number; // 20
  timeBonusCoins: number; // 0 to 15
  movesBonusCoins: number; // 0 to 10
  hintFreeBonusCoins: number; // 0 or 5
  performanceBonus: number; // up to 30
  levelTotalCoins: number; // 20 to 50
  streakBonusCoins: number; // streak milestone bonus
  totalCoinsAwarded: number; // levelTotalCoins + streakBonusCoins
}

export interface PlayerProgress {
  highScore: number;
  highestUnlockedLevel: number; // Unlimited level progression (1, 2, 3, 4, ...)
  bestScoresByDifficulty: Record<Difficulty, number>; // Backward compatibility
  bestTimesByDifficulty: Record<Difficulty, number>; // Backward compatibility
  starsByLevel: Record<number, number>; // Level number -> stars
  bestScoresByLevel: Record<number, number>; // Level number -> score
  bestTimesByLevel: Record<number, number>; // Level number -> best time
  completedLevels: number[];
  soundEnabled: boolean;
  reducedMotion: boolean;
  theme: 'midnight' | 'neon' | 'amethyst';

  // In-Game Currency & Streaks
  coins: number;
  totalCoinsEarned: number;
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: string | null; // Local YYYY-MM-DD
  lastStreakRewardDate: string | null; // Local YYYY-MM-DD
  streakCoinsEarned: number;
  claimedMilestones: number[];
}

export interface GameResult {
  isVictory: boolean;
  difficulty: string;
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
  coinRewards?: CoinRewardBreakdown;
  streakUpdated?: {
    currentStreak: number;
    isNewStreakDay: boolean;
    streakBonus: number;
  };
}

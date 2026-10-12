import { PlayerProgress, Difficulty, CoinRewardBreakdown } from '../types/game';
import { getLocalTodayString, getDaysDifference, getStreakMilestoneReward } from './streak';

const STORAGE_KEY = 'mindspark_player_progress_v1';

export const DEFAULT_PROGRESS: PlayerProgress = {
  highScore: 0,
  highestUnlockedLevel: 1, // Unlimited level progression (starts at 1)
  bestScoresByDifficulty: {
    easy: 0,
    medium: 0,
    hard: 0,
  },
  bestTimesByDifficulty: {
    easy: 0,
    medium: 0,
    hard: 0,
  },
  starsByLevel: {
    1: 0,
    2: 0,
    3: 0,
  },
  bestScoresByLevel: {},
  bestTimesByLevel: {},
  completedLevels: [],
  soundEnabled: true,
  reducedMotion: false,
  theme: 'midnight',

  // In-Game Economy & Streaks
  coins: 0,
  totalCoinsEarned: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastPlayedDate: null,
  lastStreakRewardDate: null,
  streakCoinsEarned: 0,
  claimedMilestones: [],
};

export function loadPlayerProgress(): PlayerProgress {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return { ...DEFAULT_PROGRESS };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };

    const parsed = JSON.parse(raw);

    // Backward-compatible extraction:
    const highestLevel = typeof parsed.highestUnlockedLevel === 'number'
      ? Math.max(1, parsed.highestUnlockedLevel)
      : 1;

    const starsObj: Record<number, number> = {};
    if (parsed.starsByLevel && typeof parsed.starsByLevel === 'object') {
      Object.keys(parsed.starsByLevel).forEach((k) => {
        const num = Number(k);
        if (!isNaN(num)) starsObj[num] = Number(parsed.starsByLevel[k]) || 0;
      });
    }

    const scoresObj: Record<number, number> = {};
    if (parsed.bestScoresByLevel && typeof parsed.bestScoresByLevel === 'object') {
      Object.keys(parsed.bestScoresByLevel).forEach((k) => {
        const num = Number(k);
        if (!isNaN(num)) scoresObj[num] = Number(parsed.bestScoresByLevel[k]) || 0;
      });
    }

    const timesObj: Record<number, number> = {};
    if (parsed.bestTimesByLevel && typeof parsed.bestTimesByLevel === 'object') {
      Object.keys(parsed.bestTimesByLevel).forEach((k) => {
        const num = Number(k);
        if (!isNaN(num)) timesObj[num] = Number(parsed.bestTimesByLevel[k]) || 0;
      });
    }

    return {
      highScore: typeof parsed.highScore === 'number' ? parsed.highScore : 0,
      highestUnlockedLevel: highestLevel,
      bestScoresByDifficulty: {
        easy: typeof parsed.bestScoresByDifficulty?.easy === 'number' ? parsed.bestScoresByDifficulty.easy : 0,
        medium: typeof parsed.bestScoresByDifficulty?.medium === 'number' ? parsed.bestScoresByDifficulty.medium : 0,
        hard: typeof parsed.bestScoresByDifficulty?.hard === 'number' ? parsed.bestScoresByDifficulty.hard : 0,
      },
      bestTimesByDifficulty: {
        easy: typeof parsed.bestTimesByDifficulty?.easy === 'number' ? parsed.bestTimesByDifficulty.easy : 0,
        medium: typeof parsed.bestTimesByDifficulty?.medium === 'number' ? parsed.bestTimesByDifficulty.medium : 0,
        hard: typeof parsed.bestTimesByDifficulty?.hard === 'number' ? parsed.bestTimesByDifficulty.hard : 0,
      },
      starsByLevel: starsObj,
      bestScoresByLevel: scoresObj,
      bestTimesByLevel: timesObj,
      completedLevels: Array.isArray(parsed.completedLevels) ? parsed.completedLevels : [],
      soundEnabled: typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : true,
      reducedMotion: typeof parsed.reducedMotion === 'boolean' ? parsed.reducedMotion : false,
      theme: ['midnight', 'neon', 'amethyst'].includes(parsed.theme) ? parsed.theme : 'midnight',

      // Economy & Streak fields
      coins: typeof parsed.coins === 'number' ? Math.max(0, parsed.coins) : 0,
      totalCoinsEarned: typeof parsed.totalCoinsEarned === 'number' ? Math.max(0, parsed.totalCoinsEarned) : 0,
      currentStreak: typeof parsed.currentStreak === 'number' ? Math.max(0, parsed.currentStreak) : 0,
      longestStreak: typeof parsed.longestStreak === 'number' ? Math.max(0, parsed.longestStreak) : 0,
      lastPlayedDate: typeof parsed.lastPlayedDate === 'string' ? parsed.lastPlayedDate : null,
      lastStreakRewardDate: typeof parsed.lastStreakRewardDate === 'string' ? parsed.lastStreakRewardDate : null,
      streakCoinsEarned: typeof parsed.streakCoinsEarned === 'number' ? Math.max(0, parsed.streakCoinsEarned) : 0,
      claimedMilestones: Array.isArray(parsed.claimedMilestones) ? parsed.claimedMilestones : [],
    };
  } catch (err) {
    console.warn('Failed to load player progress from localStorage', err);
    return { ...DEFAULT_PROGRESS };
  }
}

export function savePlayerProgress(progress: PlayerProgress): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.warn('Failed to save player progress to localStorage', err);
  }
}

export function resetPlayerProgress(): PlayerProgress {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return { ...DEFAULT_PROGRESS };
  }
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear progress from localStorage', err);
  }
  return { ...DEFAULT_PROGRESS };
}

// Checks streak status for today without modifying state
export function checkDailyStreakStatus(progress: PlayerProgress): {
  isNewDay: boolean;
  nextStreakCount: number;
  potentialMilestoneReward: number;
} {
  const todayStr = getLocalTodayString();
  const lastDate = progress.lastPlayedDate;

  if (lastDate === todayStr) {
    return {
      isNewDay: false,
      nextStreakCount: progress.currentStreak,
      potentialMilestoneReward: 0,
    };
  }

  if (!lastDate) {
    return {
      isNewDay: true,
      nextStreakCount: 1,
      potentialMilestoneReward: getStreakMilestoneReward(1),
    };
  }

  const daysDiff = getDaysDifference(lastDate, todayStr);
  if (daysDiff === 1) {
    const nextStreak = progress.currentStreak + 1;
    return {
      isNewDay: true,
      nextStreakCount: nextStreak,
      potentialMilestoneReward: getStreakMilestoneReward(nextStreak),
    };
  }

  // Missed one or more calendar days: resets active streak to 1
  return {
    isNewDay: true,
    nextStreakCount: 1,
    potentialMilestoneReward: getStreakMilestoneReward(1),
  };
}

export function recordGameVictory(
  levelNumber: number,
  score: number,
  timeRemaining: number,
  stars: number,
  coinRewards: CoinRewardBreakdown
): {
  progress: PlayerProgress;
  isNewBestScore: boolean;
  isNewBestTime: boolean;
  nextLevelUnlocked: boolean;
  streakUpdated: {
    currentStreak: number;
    isNewStreakDay: boolean;
    streakBonus: number;
  };
} {
  const current = loadPlayerProgress();
  const todayStr = getLocalTodayString();

  // 1. High Score & Level Records
  const prevBestScore = current.bestScoresByLevel[levelNumber] || 0;
  const isNewBestScore = score > prevBestScore;
  const newBestScore = Math.max(score, prevBestScore);

  const prevBestTime = current.bestTimesByLevel[levelNumber] || 0;
  const isNewBestTime = timeRemaining > prevBestTime;
  const newBestTime = Math.max(timeRemaining, prevBestTime);

  const newHighScore = Math.max(score, current.highScore);

  // 2. Unlimited Level Unlocking:
  // Completing the highest unlocked level unlocks the next level.
  let nextLevelUnlocked = false;
  let nextUnlockedLevel = current.highestUnlockedLevel;
  if (levelNumber >= current.highestUnlockedLevel) {
    nextUnlockedLevel = levelNumber + 1;
    nextLevelUnlocked = true;
  }

  const completed = Array.from(new Set([...current.completedLevels, levelNumber]));
  const currentStars = current.starsByLevel[levelNumber] || 0;
  const newStars = Math.max(currentStars, stars);

  // 3. Daily Streak Evaluation:
  let updatedStreak = current.currentStreak;
  let isNewStreakDay = false;
  let streakMilestoneBonus = 0;

  if (current.lastPlayedDate !== todayStr) {
    isNewStreakDay = true;
    if (!current.lastPlayedDate) {
      updatedStreak = 1;
    } else {
      const daysDiff = getDaysDifference(current.lastPlayedDate, todayStr);
      if (daysDiff === 1) {
        updatedStreak = current.currentStreak + 1;
      } else {
        // Missed at least 1 calendar day
        updatedStreak = 1;
      }
    }

    // Award streak milestone coins if qualifying on this new day
    if (current.lastStreakRewardDate !== todayStr) {
      streakMilestoneBonus = getStreakMilestoneReward(updatedStreak);
    }
  }

  const longestStreak = Math.max(current.longestStreak, updatedStreak);

  // 4. In-Game Currency (MindCoins):
  const totalEarnedInLevel = coinRewards.levelTotalCoins + streakMilestoneBonus;
  const newCoins = (current.coins || 0) + totalEarnedInLevel;
  const newTotalCoins = (current.totalCoinsEarned || 0) + totalEarnedInLevel;
  const newStreakCoins = (current.streakCoinsEarned || 0) + streakMilestoneBonus;

  // Backward compatibility with difficulty mappings for levels 1, 2, 3
  const diffKey = levelNumber === 1 ? 'easy' : levelNumber === 2 ? 'medium' : levelNumber === 3 ? 'hard' : null;
  const updatedDifficultyScores = { ...current.bestScoresByDifficulty };
  const updatedDifficultyTimes = { ...current.bestTimesByDifficulty };
  if (diffKey) {
    updatedDifficultyScores[diffKey as Difficulty] = Math.max(score, updatedDifficultyScores[diffKey as Difficulty] || 0);
    updatedDifficultyTimes[diffKey as Difficulty] = Math.max(timeRemaining, updatedDifficultyTimes[diffKey as Difficulty] || 0);
  }

  const updated: PlayerProgress = {
    ...current,
    highScore: newHighScore,
    highestUnlockedLevel: nextUnlockedLevel,
    completedLevels: completed,
    bestScoresByDifficulty: updatedDifficultyScores,
    bestTimesByDifficulty: updatedDifficultyTimes,
    starsByLevel: {
      ...current.starsByLevel,
      [levelNumber]: newStars,
    },
    bestScoresByLevel: {
      ...current.bestScoresByLevel,
      [levelNumber]: newBestScore,
    },
    bestTimesByLevel: {
      ...current.bestTimesByLevel,
      [levelNumber]: newBestTime,
    },
    coins: newCoins,
    totalCoinsEarned: newTotalCoins,
    currentStreak: updatedStreak,
    longestStreak,
    lastPlayedDate: todayStr,
    lastStreakRewardDate: streakMilestoneBonus > 0 ? todayStr : current.lastStreakRewardDate,
    streakCoinsEarned: newStreakCoins,
  };

  savePlayerProgress(updated);

  return {
    progress: updated,
    isNewBestScore,
    isNewBestTime,
    nextLevelUnlocked,
    streakUpdated: {
      currentStreak: updatedStreak,
      isNewStreakDay,
      streakBonus: streakMilestoneBonus,
    },
  };
}

import { PlayerProgress, Difficulty } from '../types/game';

const STORAGE_KEY = 'mindspark_player_progress_v1';

export const DEFAULT_PROGRESS: PlayerProgress = {
  highScore: 0,
  highestUnlockedLevel: 1,
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
  completedLevels: [],
  soundEnabled: true,
  reducedMotion: false,
  theme: 'midnight',
};

export function loadPlayerProgress(): PlayerProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };

    const parsed = JSON.parse(raw);
    return {
      highScore: typeof parsed.highScore === 'number' ? parsed.highScore : 0,
      highestUnlockedLevel: Math.min(3, Math.max(1, typeof parsed.highestUnlockedLevel === 'number' ? parsed.highestUnlockedLevel : 1)),
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
      starsByLevel: {
        1: typeof parsed.starsByLevel?.[1] === 'number' ? parsed.starsByLevel[1] : 0,
        2: typeof parsed.starsByLevel?.[2] === 'number' ? parsed.starsByLevel[2] : 0,
        3: typeof parsed.starsByLevel?.[3] === 'number' ? parsed.starsByLevel[3] : 0,
      },
      completedLevels: Array.isArray(parsed.completedLevels) ? parsed.completedLevels : [],
      soundEnabled: typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : true,
      reducedMotion: typeof parsed.reducedMotion === 'boolean' ? parsed.reducedMotion : false,
      theme: ['midnight', 'neon', 'amethyst'].includes(parsed.theme) ? parsed.theme : 'midnight',
    };
  } catch (err) {
    console.warn('Failed to load player progress from localStorage', err);
    return { ...DEFAULT_PROGRESS };
  }
}

export function savePlayerProgress(progress: PlayerProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.warn('Failed to save player progress to localStorage', err);
  }
}

export function resetPlayerProgress(): PlayerProgress {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear progress from localStorage', err);
  }
  return { ...DEFAULT_PROGRESS };
}

export function recordGameVictory(
  difficulty: Difficulty,
  levelNumber: number,
  score: number,
  timeRemaining: number,
  stars: number
): { progress: PlayerProgress; isNewBestScore: boolean; isNewBestTime: boolean; nextLevelUnlocked: boolean } {
  const current = loadPlayerProgress();

  const prevBestScore = current.bestScoresByDifficulty[difficulty] || 0;
  const isNewBestScore = score > prevBestScore;
  const newBestScore = Math.max(score, prevBestScore);

  const prevBestTime = current.bestTimesByDifficulty[difficulty] || 0;
  const isNewBestTime = timeRemaining > prevBestTime;
  const newBestTime = Math.max(timeRemaining, prevBestTime);

  const newHighScore = Math.max(score, current.highScore);

  let nextLevelUnlocked = false;
  let nextUnlockedLevel = current.highestUnlockedLevel;
  if (levelNumber < 3 && current.highestUnlockedLevel <= levelNumber) {
    nextUnlockedLevel = levelNumber + 1;
    nextLevelUnlocked = true;
  }

  const completed = Array.from(new Set([...current.completedLevels, levelNumber]));
  const currentStars = current.starsByLevel[levelNumber] || 0;
  const newStars = Math.max(currentStars, stars);

  const updated: PlayerProgress = {
    ...current,
    highScore: newHighScore,
    highestUnlockedLevel: nextUnlockedLevel,
    completedLevels: completed,
    bestScoresByDifficulty: {
      ...current.bestScoresByDifficulty,
      [difficulty]: newBestScore,
    },
    bestTimesByDifficulty: {
      ...current.bestTimesByDifficulty,
      [difficulty]: newBestTime,
    },
    starsByLevel: {
      ...current.starsByLevel,
      [levelNumber]: newStars,
    },
  };

  savePlayerProgress(updated);
  return { progress: updated, isNewBestScore, isNewBestTime, nextLevelUnlocked };
}

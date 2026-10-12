/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Difficulty,
  GameScreen,
  GameStatus,
  CardItem,
  GameResult,
  PlayerProgress,
  DifficultyConfig,
} from './types/game';
import {
  DIFFICULTY_CONFIGS,
  SCORING,
  getLevelConfig,
  generateDeck,
  calculateStars,
  calculateCoinRewards,
} from './utils/gameLogic';
import {
  loadPlayerProgress,
  savePlayerProgress,
  resetPlayerProgress,
  recordGameVictory,
  checkDailyStreakStatus,
} from './utils/storage';
import { soundManager } from './utils/audio';

import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { DifficultySelector } from './components/DifficultySelector';
import { GameHUD } from './components/GameHUD';
import { GameBoard } from './components/GameBoard';
import { PauseModal } from './components/PauseModal';
import { ResultsModal } from './components/ResultsModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { SettingsModal } from './components/SettingsModal';
import { StreakModal } from './components/StreakModal';

export default function App() {
  // Global player progress loaded from localStorage
  const [progress, setProgress] = useState<PlayerProgress>(() => {
    const loaded = loadPlayerProgress();
    soundManager.setMuted(!loaded.soundEnabled);
    return loaded;
  });

  // Current Screen: HOME, DIFFICULTY_SELECT, PLAYING
  const [screen, setScreen] = useState<GameScreen>('HOME');

  // Gameplay state
  const [currentLevelNumber, setCurrentLevelNumber] = useState<number>(1);
  const [activeConfig, setActiveConfig] = useState<DifficultyConfig>(() => getLevelConfig(1));
  const [gameStatus, setGameStatus] = useState<GameStatus>('IDLE');
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<CardItem[]>([]);
  const [isBusy, setIsBusy] = useState<boolean>(false);

  // Stats
  const [score, setScore] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(90);
  const [hintsRemaining, setHintsRemaining] = useState<number>(3);
  const [hintsUsedCount, setHintsUsedCount] = useState<number>(0);

  // Result modal state
  const [activeResult, setActiveResult] = useState<GameResult | null>(null);

  // Auxiliary modals
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showStreakModal, setShowStreakModal] = useState<boolean>(false);

  // Timer reference
  const timerRef = useRef<number | null>(null);

  // Initialize or start game (supports any level number or legacy difficulty string)
  const startNewGame = useCallback((levelOrDifficulty: Difficulty | number) => {
    let targetLevel = 1;
    if (typeof levelOrDifficulty === 'number') {
      targetLevel = levelOrDifficulty;
    } else if (levelOrDifficulty === 'easy') {
      targetLevel = 1;
    } else if (levelOrDifficulty === 'medium') {
      targetLevel = 2;
    } else if (levelOrDifficulty === 'hard') {
      targetLevel = 3;
    }

    const config = getLevelConfig(targetLevel);
    setCurrentLevelNumber(targetLevel);
    setActiveConfig(config);
    setCards(generateDeck(config));
    setFlippedCards([]);
    setIsBusy(false);
    setScore(0);
    setMoves(0);
    setMatchedPairs(0);
    setTimeRemaining(config.timerSeconds);
    setHintsRemaining(config.hintsCount);
    setHintsUsedCount(0);
    setActiveResult(null);
    setGameStatus('PLAYING');
    setScreen('PLAYING');
  }, []);

  // Update progress helper
  const handleUpdateProgress = useCallback((updated: Partial<PlayerProgress>) => {
    setProgress((prev) => {
      const next = { ...prev, ...updated };
      savePlayerProgress(next);
      if (typeof updated.soundEnabled === 'boolean') {
        soundManager.setMuted(!updated.soundEnabled);
      }
      return next;
    });
  }, []);

  // Reset progress helper
  const handleResetProgress = useCallback(() => {
    const fresh = resetPlayerProgress();
    setProgress(fresh);
    soundManager.setMuted(!fresh.soundEnabled);
  }, []);

  // Sound toggle
  const handleToggleSound = useCallback(() => {
    const nextVal = !progress.soundEnabled;
    handleUpdateProgress({ soundEnabled: nextVal });
  }, [progress.soundEnabled, handleUpdateProgress]);

  // Handle Game Timer countdown
  useEffect(() => {
    if (gameStatus === 'PLAYING') {
      timerRef.current = window.setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Time expired! Trigger Game Over
            if (timerRef.current) clearInterval(timerRef.current);
            soundManager.playGameOver();
            setGameStatus('GAME_OVER');

            setActiveResult({
              isVictory: false,
              difficulty: activeConfig.key,
              levelNumber: currentLevelNumber,
              score,
              baseScore: score,
              timeBonus: 0,
              moves,
              matchedPairs,
              totalPairs: activeConfig.pairsCount,
              timeRemaining: 0,
              timeElapsed: activeConfig.timerSeconds,
              starsEarned: 0,
              isNewBestScore: false,
              isNewBestTime: false,
              nextLevelUnlocked: false,
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameStatus, activeConfig, currentLevelNumber, score, moves, matchedPairs]);

  // Flip card handler
  const handleFlipCard = useCallback((clickedCard: CardItem) => {
    if (gameStatus !== 'PLAYING' || isBusy) return;
    if (clickedCard.isFlipped || clickedCard.isMatched) return;

    soundManager.playFlip();

    // Flip the clicked card immediately
    const updatedCards = cards.map((c) =>
      c.id === clickedCard.id ? { ...c, isFlipped: true } : c
    );
    setCards(updatedCards);

    const activeFlipped = [...flippedCards, clickedCard];

    if (activeFlipped.length === 1) {
      setFlippedCards(activeFlipped);
    } else if (activeFlipped.length === 2) {
      // 2 cards flipped: Resolve move
      const [firstCard, secondCard] = activeFlipped;
      const nextMoves = moves + 1;
      setMoves(nextMoves);

      if (firstCard.pairId === secondCard.pairId) {
        // MATCH!
        soundManager.playMatch();
        const nextMatched = matchedPairs + 1;
        setMatchedPairs(nextMatched);

        const earnedPoints = SCORING.MATCH_POINTS;
        const nextScore = score + earnedPoints;
        setScore(nextScore);

        // Mark both cards as matched
        const matchedCards = updatedCards.map((c) =>
          c.id === firstCard.id || c.id === secondCard.id
            ? { ...c, isMatched: true, isFlipped: true }
            : c
        );
        setCards(matchedCards);
        setFlippedCards([]);

        // Check Victory condition
        if (nextMatched === activeConfig.pairsCount) {
          // VICTORY!
          if (timerRef.current) clearInterval(timerRef.current);
          setGameStatus('VICTORY');

          const timeBonus = timeRemaining * SCORING.TIME_BONUS_PER_SECOND;
          const finalScore = nextScore + timeBonus;
          const starsEarned = calculateStars(activeConfig, nextMoves, timeRemaining);

          soundManager.playVictory();

          // Evaluate Daily Streak status for potential milestone bonus
          const streakStatus = checkDailyStreakStatus(progress);

          // Calculate deterministic MindCoins rewards
          const coinRewards = calculateCoinRewards(
            activeConfig.pairsCount,
            nextMoves,
            timeRemaining,
            activeConfig.timerSeconds,
            hintsUsedCount,
            streakStatus.potentialMilestoneReward
          );

          // Commit victory and rewards persistently (executed exactly once)
          const {
            progress: updatedProgress,
            isNewBestScore,
            isNewBestTime,
            nextLevelUnlocked,
            streakUpdated,
          } = recordGameVictory(
            currentLevelNumber,
            finalScore,
            timeRemaining,
            starsEarned,
            coinRewards
          );

          setProgress(updatedProgress);

          setActiveResult({
            isVictory: true,
            difficulty: activeConfig.key,
            levelNumber: currentLevelNumber,
            score: finalScore,
            baseScore: nextScore,
            timeBonus,
            moves: nextMoves,
            matchedPairs: nextMatched,
            totalPairs: activeConfig.pairsCount,
            timeRemaining,
            timeElapsed: activeConfig.timerSeconds - timeRemaining,
            starsEarned,
            isNewBestScore,
            isNewBestTime,
            nextLevelUnlocked,
            coinRewards,
            streakUpdated,
          });
        }
      } else {
        // MISMATCH!
        soundManager.playMismatch();
        setScore((prev) => Math.max(0, prev - SCORING.MISMATCH_PENALTY));
        setIsBusy(true);

        // Keep both open briefly, then turn face down
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstCard.id || c.id === secondCard.id
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
          setIsBusy(false);
        }, 900);
      }
    }
  }, [cards, flippedCards, gameStatus, isBusy, moves, score, matchedPairs, activeConfig, currentLevelNumber, timeRemaining, hintsUsedCount, progress]);

  // Hint logic: find an unmatched pair and briefly reveal it
  const handleUseHint = useCallback(() => {
    if (hintsRemaining <= 0 || gameStatus !== 'PLAYING' || isBusy) return;

    // Find all unmatched cards grouped by pairId
    const unmatchedPairsMap: Record<string, CardItem[]> = {};
    cards.forEach((c) => {
      if (!c.isMatched && !c.isFlipped) {
        if (!unmatchedPairsMap[c.pairId]) unmatchedPairsMap[c.pairId] = [];
        unmatchedPairsMap[c.pairId].push(c);
      }
    });

    const validPairIds = Object.keys(unmatchedPairsMap).filter(
      (pairId) => unmatchedPairsMap[pairId].length === 2
    );

    if (validPairIds.length === 0) return;

    // Pick a random unmatched pair
    const chosenPairId = validPairIds[Math.floor(Math.random() * validPairIds.length)];
    const [card1, card2] = unmatchedPairsMap[chosenPairId];

    soundManager.playHint();
    setHintsRemaining((prev) => Math.max(0, prev - 1));
    setHintsUsedCount((prev) => prev + 1);
    setScore((prev) => Math.max(0, prev - SCORING.HINT_PENALTY));
    setIsBusy(true);

    // Briefly flip and illuminate them
    setCards((prev) =>
      prev.map((c) =>
        c.id === card1.id || c.id === card2.id
          ? { ...c, isFlipped: true, isHinted: true }
          : c
      )
    );

    // Hide them again after 1400ms
    setTimeout(() => {
      setCards((prev) =>
        prev.map((c) =>
          c.id === card1.id || c.id === card2.id
            ? { ...c, isFlipped: false, isHinted: false }
            : c
        )
      );
      setIsBusy(false);
    }, 1400);
  }, [hintsRemaining, gameStatus, isBusy, cards]);

  // Pause / Resume
  const handlePause = useCallback(() => {
    if (gameStatus === 'PLAYING') {
      setGameStatus('PAUSED');
    }
  }, [gameStatus]);

  const handleResume = useCallback(() => {
    if (gameStatus === 'PAUSED') {
      setGameStatus('PLAYING');
    }
  }, [gameStatus]);

  // Global Keyboard listener for Esc to pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showHowToPlay) {
          setShowHowToPlay(false);
        } else if (showSettings) {
          setShowSettings(false);
        } else if (showStreakModal) {
          setShowStreakModal(false);
        } else if (screen === 'PLAYING') {
          if (gameStatus === 'PLAYING') {
            handlePause();
          } else if (gameStatus === 'PAUSED') {
            handleResume();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showHowToPlay, showSettings, showStreakModal, screen, gameStatus, handlePause, handleResume]);

  // Next level navigation (supports unlimited progression: Level 1 -> 2 -> 3 -> 4 -> 5...)
  const handleNextLevel = useCallback(() => {
    startNewGame(currentLevelNumber + 1);
  }, [currentLevelNumber, startNewGame]);

  // Atmosphere theme class
  let themeBackground = 'bg-[#090b16]';
  if (progress.theme === 'neon') {
    themeBackground = 'bg-[#070d1a]';
  } else if (progress.theme === 'amethyst') {
    themeBackground = 'bg-[#0b0819]';
  }

  return (
    <div className={`min-h-screen ${themeBackground} text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200 font-sans`}>
      {/* Top Header */}
      <Header
        soundEnabled={progress.soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenHowToPlay={() => setShowHowToPlay(true)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenStreakDetails={() => setShowStreakModal(true)}
        onGoHome={() => {
          setGameStatus('IDLE');
          setScreen('HOME');
        }}
        highScore={progress.highScore}
        highestLevel={progress.highestUnlockedLevel}
        coins={progress.coins}
        currentStreak={progress.currentStreak}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col justify-center relative">
        {screen === 'HOME' && (
          <HomeScreen
            progress={progress}
            onStartGame={startNewGame}
            onOpenDifficultySelect={() => setScreen('DIFFICULTY_SELECT')}
            onOpenHowToPlay={() => setShowHowToPlay(true)}
            onOpenSettings={() => setShowSettings(true)}
            onOpenStreakDetails={() => setShowStreakModal(true)}
            onToggleSound={handleToggleSound}
          />
        )}

        {screen === 'DIFFICULTY_SELECT' && (
          <DifficultySelector
            progress={progress}
            onSelectLevel={(lvl) => startNewGame(lvl)}
            onSelectDifficulty={(diff) => startNewGame(diff)}
            onBack={() => setScreen('HOME')}
          />
        )}

        {screen === 'PLAYING' && (
          <div className="w-full flex-1 flex flex-col justify-start py-4 px-3 sm:px-6">
            <GameHUD
              config={activeConfig}
              score={score}
              timeRemaining={timeRemaining}
              moves={moves}
              matchedPairs={matchedPairs}
              hintsRemaining={hintsRemaining}
              canUseHint={hintsRemaining > 0 && !isBusy && gameStatus === 'PLAYING'}
              coins={progress.coins}
              onUseHint={handleUseHint}
              onPause={handlePause}
              onRestart={() => startNewGame(currentLevelNumber)}
            />

            <GameBoard
              cards={cards}
              config={activeConfig}
              onFlipCard={handleFlipCard}
              disabled={isBusy || gameStatus !== 'PLAYING'}
              reducedMotion={progress.reducedMotion}
            />
          </div>
        )}
      </main>

      {/* Pause Modal */}
      {gameStatus === 'PAUSED' && (
        <PauseModal
          score={score}
          timeRemaining={timeRemaining}
          matchedPairs={matchedPairs}
          totalPairs={activeConfig.pairsCount}
          moves={moves}
          onResume={handleResume}
          onRestart={() => startNewGame(currentLevelNumber)}
          onGoHome={() => {
            setGameStatus('IDLE');
            setScreen('HOME');
          }}
        />
      )}

      {/* Results Modal (Victory or Game Over) */}
      {activeResult && (gameStatus === 'VICTORY' || gameStatus === 'GAME_OVER') && (
        <ResultsModal
          result={activeResult}
          currentCoinsBalance={progress.coins}
          onPlayAgain={() => startNewGame(currentLevelNumber)}
          onNextLevel={handleNextLevel}
          onGoHome={() => {
            setGameStatus('IDLE');
            setScreen('DIFFICULTY_SELECT');
          }}
        />
      )}

      {/* How to Play Modal */}
      {showHowToPlay && (
        <HowToPlayModal onClose={() => setShowHowToPlay(false)} />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          progress={progress}
          onUpdateProgress={handleUpdateProgress}
          onResetProgress={handleResetProgress}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Daily Streak Details Modal */}
      {showStreakModal && (
        <StreakModal
          progress={progress}
          onClose={() => setShowStreakModal(false)}
        />
      )}
    </div>
  );
}

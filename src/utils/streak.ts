export function getLocalTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDaysDifference(lastDateStr: string, todayStr: string): number {
  if (!lastDateStr || !todayStr) return 999;
  try {
    const [y1, m1, d1] = lastDateStr.split('-').map(Number);
    const [y2, m2, d2] = todayStr.split('-').map(Number);

    // Construct local midnight timestamps to compare calendar dates safely
    const date1 = new Date(y1, m1 - 1, d1);
    const date2 = new Date(y2, m2 - 1, d2);

    const diffMs = date2.getTime() - date1.getTime();
    return Math.round(diffMs / (1000 * 60 * 60 * 24));
  } catch {
    return 999;
  }
}

export function getStreakMilestoneReward(streakDay: number): number {
  if (streakDay === 1) return 5;
  if (streakDay === 2) return 10;
  if (streakDay === 3) return 15;
  if (streakDay === 4) return 20;
  if (streakDay === 5) return 25;
  if (streakDay === 6) return 30;
  if (streakDay === 7) return 50;
  if (streakDay > 7 && streakDay % 7 === 0) return 50;
  return 0;
}

export function getNextStreakMilestone(currentStreak: number): { nextDay: number; nextBonus: number } {
  if (currentStreak < 1) return { nextDay: 1, nextBonus: 5 };
  if (currentStreak < 2) return { nextDay: 2, nextBonus: 10 };
  if (currentStreak < 3) return { nextDay: 3, nextBonus: 15 };
  if (currentStreak < 4) return { nextDay: 4, nextBonus: 20 };
  if (currentStreak < 5) return { nextDay: 5, nextBonus: 25 };
  if (currentStreak < 6) return { nextDay: 6, nextBonus: 30 };
  if (currentStreak < 7) return { nextDay: 7, nextBonus: 50 };

  // After day 7, every 7 days (14, 21, 28...)
  const nextWeekly = (Math.floor(currentStreak / 7) + 1) * 7;
  return { nextDay: nextWeekly, nextBonus: 50 };
}

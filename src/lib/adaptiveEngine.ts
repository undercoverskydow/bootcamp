// src/lib/adaptiveEngine.ts

import type { MarketQuestion, Difficulty } from './questionPool';
import { shuffle } from './shuffle';

// re‑export difficulty so callers can import from this module if they want
export type { Difficulty };

export interface HistoryEntry {
  question: MarketQuestion;
  correct: boolean;
}

export interface Session {
  getNextQuestion: () => MarketQuestion | null;
  answerCurrent: (correct: boolean) => void;
  getHistory: () => HistoryEntry[];
  getScore: () => {
    weightedScore: number;
    percentage: number;
    difficultyBreakdown: Record<Difficulty, number>;
    maxStreak: number;
  };
}

export function createSession(allQuestions: MarketQuestion[]): Session {
  // copy and shuffle difficulty-specific pools
  const easyPool = shuffle(allQuestions.filter((q) => q.difficulty === 'easy'));
  const mediumPool = shuffle(allQuestions.filter((q) => q.difficulty === 'medium'));
  const hardPool = shuffle(allQuestions.filter((q) => q.difficulty === 'hard'));

  let currentDifficulty: Difficulty = 'medium';
  const history: HistoryEntry[] = [];
  let currentQuestion: MarketQuestion | null = null;

  function pickQuestion(difficulty: Difficulty): MarketQuestion {
    let pool: MarketQuestion[];
    if (difficulty === 'easy') pool = easyPool;
    else if (difficulty === 'medium') pool = mediumPool;
    else pool = hardPool;

    if (pool.length > 0) {
      return pool.shift()!;
    }

    // fallback: take any unused question from the main list
    const unused = allQuestions.filter(
      (q) => !history.find((h) => h.question.id === q.id)
    );
    if (unused.length > 0) {
      return shuffle(unused)[0];
    }

    // as last resort return a random question (shouldn't happen)
    return shuffle(allQuestions)[0];
  }

  function updateDifficulty() {
    if (history.length < 3) {
      currentDifficulty = 'medium';
      return;
    }

    const last3 = history.slice(-3);
    const correctCount = last3.filter((h) => h.correct).length;
    const wrongCount = last3.length - correctCount;

    if (correctCount >= 2) {
      if (currentDifficulty === 'easy') currentDifficulty = 'medium';
      else if (currentDifficulty === 'medium') currentDifficulty = 'hard';
    } else if (wrongCount >= 2) {
      if (currentDifficulty === 'hard') currentDifficulty = 'medium';
      else if (currentDifficulty === 'medium') currentDifficulty = 'easy';
    }
  }

  function getNextQuestion(): MarketQuestion | null {
    if (history.length >= 10) {
      return null; // session complete
    }

    updateDifficulty();
    const q = pickQuestion(currentDifficulty);
    currentQuestion = q;
    return q;
  }

  function answerCurrent(correct: boolean) {
    if (currentQuestion) {
      history.push({ question: currentQuestion, correct });
    }
  }

  function getScore() {
    let weighted = 0;
    let possible = 0;
    const breakdown: Record<Difficulty, number> = {
      easy: 0,
      medium: 0,
      hard: 0,
    };
    let currentStreak = 0;
    let maxStreak = 0;

    history.forEach((h) => {
      const w = h.question.difficulty === 'easy' ? 1 : h.question.difficulty === 'medium' ? 2 : 3;
      possible += w;
      if (h.correct) {
        weighted += w;
        currentStreak += 1;
        if (currentStreak > maxStreak) maxStreak = currentStreak;
      } else {
        currentStreak = 0;
      }
      breakdown[h.question.difficulty] += 1;
    });

    const percentage = possible > 0 ? Math.round((weighted / possible) * 100) : 0;
    return { weightedScore: weighted, percentage, difficultyBreakdown: breakdown, maxStreak };
  }

  return { getNextQuestion, answerCurrent, getHistory: () => history.slice(), getScore };
}

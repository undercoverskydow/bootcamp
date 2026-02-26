'use client';

import type { UserProgress, Instructor, Level, LessonProgress } from './types';

const PROGRESS_KEY = 'bootcamp_progress';

/**
 * Get user progress from localStorage
 */
export function getUserProgress(
  instructor: Instructor,
  level: Level
): UserProgress | null {
  try {
    if (typeof window === 'undefined') return null;

    const stored = localStorage.getItem(`${PROGRESS_KEY}_${instructor}_${level}`);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to get user progress:', error);
    return null;
  }
}

/**
 * Save lesson progress
 */
export function saveLessonProgress(
  instructor: Instructor,
  level: Level,
  lessonId: string,
  completed: boolean,
  quizScore?: number
): void {
  try {
    if (typeof window === 'undefined') return;

    const key = `${PROGRESS_KEY}_${instructor}_${level}`;
    let progress = getUserProgress(instructor, level);

    if (!progress) {
      progress = {
        instructor,
        level,
        lessons: [],
        lastAccessed: Date.now(),
      };
    }

    const lessonIndex = progress.lessons.findIndex((l) => l.lessonId === lessonId);
    const lessonProgress: LessonProgress = {
      lessonId,
      completed,
      quizScore,
      timestamp: Date.now(),
    };

    if (lessonIndex >= 0) {
      progress.lessons[lessonIndex] = lessonProgress;
    } else {
      progress.lessons.push(lessonProgress);
    }

    progress.lastAccessed = Date.now();
    localStorage.setItem(key, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save lesson progress:', error);
  }
}

/**
 * Check if bootcamp is completed
 */
export function isBootcampCompleted(
  instructor: Instructor
): boolean {
  try {
    if (typeof window === 'undefined') return false;

    const levels: Level[] = ['beginner', 'intermediate', 'advanced'];

    for (const level of levels) {
      const progress = getUserProgress(instructor, level);
      if (!progress || progress.lessons.length === 0) {
        return false;
      }

      // Check if all lessons are completed
      const allCompleted = progress.lessons.every((l) => l.completed);
      if (!allCompleted) {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Failed to check bootcamp completion:', error);
    return false;
  }
}

/**
 * Get total progress stats
 */
export function getProgressStats(instructor: Instructor) {
  try {
    if (typeof window === 'undefined') return { total: 0, completed: 0, percentage: 0 };

    const levels: Level[] = ['beginner', 'intermediate', 'advanced'];
    let total = 0;
    let completed = 0;

    for (const level of levels) {
      const progress = getUserProgress(instructor, level);
      if (progress) {
        total += progress.lessons.length;
        completed += progress.lessons.filter((l) => l.completed).length;
      }
    }

    return {
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  } catch (error) {
    console.error('Failed to get progress stats:', error);
    return { total: 0, completed: 0, percentage: 0 };
  }
}

/**
 * Mark code as validated
 */
export function validateBootcampCode(instructor: Instructor, code: string): boolean {
  try {
    const validCode = (process.env.NEXT_PUBLIC_FINAL_CODE || 'MASTAN').toString();
    if (!process.env.NEXT_PUBLIC_FINAL_CODE) {
      // Log a friendly warning so production env issues are visible in logs
      try {
        console.warn('Warning: NEXT_PUBLIC_FINAL_CODE is not defined. Falling back to default code.');
      } catch (e) {}
    }
    if (!code || !validCode) return false;
    return code.toString().trim().toUpperCase() === validCode.trim().toUpperCase();
  } catch (error) {
    console.error('Failed to validate code:', error);
    return false;
  }
}

/**
 * Get validated instructors
 */
export function getValidatedInstructors(): Instructor[] {
  try {
    if (typeof window === 'undefined') return [];

    const validated = localStorage.getItem(`${PROGRESS_KEY}_validated`);
    return validated ? JSON.parse(validated) : [];
  } catch (error) {
    console.error('Failed to get validated instructors:', error);
    return [];
  }
}

/**
 * Mark instructor as validated
 */
export function markInstructorValidated(instructor: Instructor): void {
  try {
    if (typeof window === 'undefined') return;

    const validated = getValidatedInstructors();
    if (!validated.includes(instructor)) {
      validated.push(instructor);
      localStorage.setItem(`${PROGRESS_KEY}_validated`, JSON.stringify(validated));
    }
  } catch (error) {
    console.error('Failed to mark instructor as validated:', error);
  }
}

// Stub functions for backward compatibility with legacy code
export function getItem(key: string): any {
  try {
    if (typeof window === 'undefined') return null;
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

export function setItem(key: string, value: any): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function importAll(data?: string): any {
  return null;
}

export function exportAll(): string {
  return '{}';
}


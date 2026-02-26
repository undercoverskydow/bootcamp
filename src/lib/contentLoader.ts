import type { Lesson, Instructor, Level } from './types';
import fs from 'fs';
import path from 'path';

const CONTENT_ROOT = path.join(process.cwd(), 'content');

/**
 * Loads a lesson JSON file from the content folder
 */
export async function getLesson(
  instructor: Instructor,
  level: Level,
  lessonId: string
): Promise<Lesson | null> {
  try {
    const lessonPath = path.join(
      CONTENT_ROOT,
      instructor,
      level,
      `${lessonId}.json`
    );

    if (!fs.existsSync(lessonPath)) {
      return null;
    }

    const content = fs.readFileSync(lessonPath, 'utf-8');
    const lesson = JSON.parse(content);
    return { id: lessonId, ...lesson };
  } catch (error) {
    console.error(`Failed to load lesson ${lessonId}:`, error);
    return null;
  }
}

/**
 * Get all lessons for an instructor level
 */
export async function getLessonsByLevel(
  instructor: Instructor,
  level: Level
): Promise<Lesson[]> {
  try {
    const levelPath = path.join(CONTENT_ROOT, instructor, level);

    if (!fs.existsSync(levelPath)) {
      return [];
    }

    const files = fs.readdirSync(levelPath).filter((f) => f.endsWith('.json'));
    const lessons: Lesson[] = [];

    for (const file of files) {
      const lessonId = file.replace('.json', '');
      const lesson = await getLesson(instructor, level, lessonId);
      if (lesson) lessons.push(lesson);
    }

    // Sort by lesson ID (assuming they're numbered or ordered)
    return lessons.sort((a, b) => a.id.localeCompare(b.id));
  } catch (error) {
    console.error(`Failed to load lessons for ${instructor}/${level}:`, error);
    return [];
  }
}

/**
 * Get all lessons for an instructor across all levels
 */
export async function getAllLessonsByInstructor(
  instructor: Instructor
): Promise<Record<Level, Lesson[]>> {
  const levels: Level[] = ['beginner', 'intermediate', 'advanced'];
  const result: Record<Level, Lesson[]> = {
    beginner: [],
    intermediate: [],
    advanced: [],
  };

  for (const level of levels) {
    result[level] = await getLessonsByLevel(instructor, level);
  }

  return result;
}

import sample from '../data/curriculum.sample.json'
import type { Curriculum, Lesson } from './types'

let _curriculum: Curriculum | null = null

export function loadCurriculum(): Curriculum {
  if (_curriculum) return _curriculum
  // Default to sample; consumers may replace with generated file
  _curriculum = (sample as unknown) as Curriculum
  return _curriculum
}

// Try to load generated curriculum if present (async). Call this on app startup.
export async function tryLoadGeneratedCurriculum() {
  try {
    const mod = await import('../data/curriculum.generated.json')
    const gen = (mod as any).default ?? mod
    if (gen && gen.instructors?.length) {
      _curriculum = gen as Curriculum
      console.log('Loaded generated curriculum')
      return true
    }
  } catch (e) {
    // No generated curriculum available — that's fine
  }
  return false
}

export function findLessonById(id: string): Lesson | undefined {
  const c = loadCurriculum()
  for (const inst of c.instructors) {
    for (const market of inst.markets) {
      for (const strat of market.strategies) {
        for (const phase of strat.phases) {
          const found = phase.lessons.find((l) => l.id === id)
          if (found) return found
        }
      }
    }
  }
  return undefined
}

export function isLessonLocked(lesson: Lesson, completedIds: string[]) {
  // locked if any prerequisite not in completedIds
  if (!lesson.prerequisites || lesson.prerequisites.length === 0) return false
  return lesson.prerequisites.some((p) => !completedIds.includes(p))
}

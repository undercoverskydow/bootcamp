export type MCQ = {
  question: string;
  options: string[];
  correctIndex: number;
};

export type Lesson = {
  id: string;
  title: string;
  videoUrl: string;
  note?: string;
  description?: string;
  duration?: string;
  content?: string;
  mcqs?: MCQ[];
  quiz?: any[];
  isTest?: boolean;
};

export type InstructorLessons = {
  [level: string]: Lesson[];
};

// ============================================================================
// CONTENT REGISTRY SYSTEM
// ============================================================================
// This system safely loads lesson content from:
// 1. content/{instructor}/{level}/lesson-*.json files
// 2. Fallback static data if files not found
// 3. Returns empty arrays instead of crashing on missing content
// ============================================================================

// Helper function for deep cloning
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Helper to create a safe lesson object from any format
function createSafeLesson(data: any, id?: string): Lesson | null {
  if (!data) return null;
  
  try {
    return {
      id: id || data.id || data.lesson_id || `lesson-${Date.now()}`,
      title: data.title || data.lesson_title || "Untitled Lesson",
      videoUrl: data.videoUrl || data.video_url || data.video || "",
      description: data.description || "",
      note: data.note || undefined,
      duration: data.duration || undefined,
      content: data.content || data.lesson_content || undefined,
      mcqs: (data.mcqs || data.quiz || data.questions || [])
        .map((q: any) => ({
          question: q.question || q.title || "",
          options: q.options || q.choices || q.answers || [],
          correctIndex: q.correctIndex ?? q.answer ?? q.correct_index ?? 0
        }))
        .filter((q: any) => q.question && q.options.length > 0),
      isTest: data.isTest ?? data.is_test ?? false
    };
  } catch (error) {
    console.warn("Failed to create safe lesson:", error);
    return null;
  }
}

// Initialize empty structure for all instructors
const lessons: { [instructor: string]: InstructorLessons } = {
  adarsh: {
    beginner: [],
    intermediate: [],
    advanced: [],
    test: []
  },
  ash: {
    beginner: [],
    intermediate: [],
    advanced: [],
    test: []
  },
  "jean-mastan": {
    beginner: [],
    intermediate: [],
    advanced: [],
    test: []
  }
};

// Track if lessons have been loaded from disk
let lessonsInitialized = false;

// ============================================================================
// FALLBACK CONTENT - Used when content files are unavailable
// These are minimal examples to prevent crashes
// ============================================================================

const fallbackLessons: { [key: string]: Lesson[] } = {
  "ash-beginner": [],
  "ash-intermediate": [],
  "ash-advanced": [],
  "adarsh-beginner": [],
  "adarsh-intermediate": [],
  "adarsh-advanced": [],
  "jean-mastan-beginner": [],
  "jean-mastan-intermediate": [],
  "jean-mastan-advanced": []
};

// ============================================================================
// CONTENT LOADING FUNCTIONS
// ============================================================================

/**
 * Load lessons from content directory or fallback
 * This function will NOT crash if content is missing
 */
export async function initializeLessonsFromContent(): Promise<void> {
  // Skip if already initialized
  if (lessonsInitialized) {
    return;
  }

  try {
    // Try to load from content directory if running in Node.js environment
    if (typeof window === "undefined") {
      const fs = await import("fs").catch(() => null);
      const path = await import("path").catch(() => null);

      if (fs && path) {
        const contentRoot = path.join(process.cwd(), "content");
        for (const instructor of ["adarsh", "ash", "jean-mastan"]) {
          for (const level of ["beginner", "intermediate", "advanced"]) {
            try {
              const levelPath = path.join(contentRoot, instructor, level);
              if (fs.existsSync(levelPath)) {
                const files = fs
                  .readdirSync(levelPath)
                  .filter((f: string) => f.endsWith(".json"))
                  .sort((a, b) => {
                    // Sort numerically by lesson number
                    const numA = parseInt(a.match(/\d+/)?.[0] || "0");
                    const numB = parseInt(b.match(/\d+/)?.[0] || "0");
                    return numA - numB;
                  });

                for (const file of files) {
                  try {
                    const filePath = path.join(levelPath, file);
                    const content = fs.readFileSync(filePath, "utf-8");
                    const data = JSON.parse(content);
                    const lesson = createSafeLesson(data);
                    if (lesson) {
                      lessons[instructor][level].push(lesson);
                    }
                  } catch (e) {
                    console.warn(`Failed to load ${file}:`, e);
                  }
                }
              }
            } catch (e) {
              console.warn(`Failed to read ${instructor}/${level}:`, e);
            }
          }
        }
      }
    }
  } catch (error) {
    console.warn("Content initialization completed with fallbacks:", error);
  }

  // If no lessons were loaded from content files, try to load a build-time
  // bundle or the generated curriculum JSON (useful for serverless builds).
  try {
    const totalLessonsLoaded = Object.keys(lessons).reduce((sum, instr) => {
      return (
        sum +
        Object.keys(lessons[instr]).reduce((s2, lvl) => s2 + lessons[instr][lvl].length, 0)
      );
    }, 0);

    if (totalLessonsLoaded === 0 && typeof window === "undefined") {
      const fs = await import("fs").catch(() => null);
      const path = await import("path").catch(() => null);

      if (fs && path) {
        // Prefer a build-time generated bundle if present
        const bundlePath = path.join(process.cwd(), "src", "data", "lessons.bundle.json");
        const generatedPath = path.join(process.cwd(), "src", "data", "curriculum.generated.json");

        let loaded = false;

        try {
          if (fs.existsSync(bundlePath)) {
            const raw = fs.readFileSync(bundlePath, "utf-8");
            const data = JSON.parse(raw);
            for (const instr of Object.keys(data)) {
              if (!lessons[instr]) {
                lessons[instr] = { beginner: [], intermediate: [], advanced: [], test: [] };
              }
              const instrData = data[instr];
              for (const lvl of Object.keys(instrData)) {
                lessons[instr][lvl] = (instrData[lvl] || [])
                  .map((d: any) => createSafeLesson(d))
                  .filter(Boolean) as Lesson[];
              }
            }
            loaded = true;
          }
        } catch (e) {
          console.warn("Failed to load lessons.bundle.json:", e);
        }

        // Fallback to curriculum.generated.json if bundle wasn't present
        if (!loaded) {
          try {
            if (fs.existsSync(generatedPath)) {
              const raw = fs.readFileSync(generatedPath, "utf-8");
              const data = JSON.parse(raw);
              // curriculum.generated.json may have a different structure (nested arrays).
              // Attempt to extract lessons when file contains an `instructors` array
              if (data && Array.isArray(data.instructors)) {
                console.warn("Detected generated curriculum (array format). Extracting lessons by difficulty.");

                const byDifficulty: { [k: string]: Lesson[] } = {
                  beginner: [],
                  intermediate: [],
                  advanced: []
                };

                for (const instrEntry of data.instructors || []) {
                  for (const market of instrEntry.markets || []) {
                    for (const strategy of market.strategies || []) {
                      for (const phase of strategy.phases || []) {
                        for (const l of phase.lessons || []) {
                          try {
                            const safe = createSafeLesson(l);
                            if (!safe) continue;
                            const diff = (l.difficulty || "beginner").toLowerCase();
                            const key = diff.includes("inter") ? "intermediate" : diff.includes("adv") ? "advanced" : "beginner";
                            byDifficulty[key].push(safe);
                          } catch (e) {
                            // ignore single lesson failures
                          }
                        }
                      }
                    }
                  }
                }

                // Apply the extracted lessons to each known instructor slot so pages won't be empty
                for (const instrKey of Object.keys(lessons)) {
                  if (!lessons[instrKey]) {
                    lessons[instrKey] = { beginner: [], intermediate: [], advanced: [], test: [] };
                  }
                  lessons[instrKey].beginner = deepClone(byDifficulty.beginner || []);
                  lessons[instrKey].intermediate = deepClone(byDifficulty.intermediate || []);
                  lessons[instrKey].advanced = deepClone(byDifficulty.advanced || []);
                }

              } else {
                // Best-effort: try to treat top-level keys as instructor buckets
                for (const instr of Object.keys(data)) {
                  const instrData = data[instr];
                  if (!instrData) continue;
                  if (!lessons[instr]) {
                    lessons[instr] = { beginner: [], intermediate: [], advanced: [], test: [] };
                  }
                  for (const lvl of Object.keys(instrData)) {
                    lessons[instr][lvl] = (instrData[lvl] || [])
                      .map((d: any) => createSafeLesson(d))
                      .filter(Boolean) as Lesson[];
                  }
                }
              }
            }
          } catch (e) {
            console.warn("Failed to load curriculum.generated.json:", e);
          }
        }
      }
    }
  } catch (e) {
    console.warn("Bundle/curriculum fallback failed:", e);
  }

  // Apply fallbacks for empty levels
  applyFallbackContent();

  // Mark as initialized
  lessonsInitialized = true;
}

/**
 * Apply fallback content to any empty instructor/level combinations
 */
function applyFallbackContent(): void {
  for (const instructor of Object.keys(lessons)) {
    for (const level of Object.keys(lessons[instructor])) {
      if (lessons[instructor][level].length === 0) {
        const fallbackKey = `${instructor}-${level}`;
        if (fallbackLessons[fallbackKey]) {
          lessons[instructor][level] = deepClone(fallbackLessons[fallbackKey]);
        }
      }
    }
  }
}

/**
 * Get lesson by ID from any instructor/level
 */
export function getLessonById(id: string): Lesson | undefined {
  for (const instructorKey of Object.keys(lessons)) {
    const levels = lessons[instructorKey];
    for (const levelKey of Object.keys(levels)) {
      const found = (levels[levelKey] as Lesson[]).find((l) => l.id === id);
      if (found) return deepClone(found);
    }
  }
  return undefined;
}

/**
 * Get all lessons for a specific instructor and level
 * Returns empty array if not found (never crashes)
 */
export function getLessonsByInstructorAndLevel(
  instructor: string,
  level: string
): Lesson[] {
  try {
    const instructorLessons = lessons[instructor];
    if (!instructorLessons) return [];

    const levelLessons = instructorLessons[level];
    if (!levelLessons) return [];

    return deepClone(levelLessons);
  } catch (error) {
    console.warn(
      `Failed to get lessons for ${instructor}/${level}:`,
      error
    );
    return [];
  }
}

/**
 * Get all lessons for a specific instructor across all levels
 */
export function getLessonsForInstructor(instructor: string): InstructorLessons | undefined {
  const v = lessons[instructor];
  return v ? deepClone(v) : undefined;
}

/**
 * Add or update a lesson at runtime
 * Useful for dynamic content updates
 */
export function setLessonForInstructor(
  instructor: string,
  level: string,
  lesson: Lesson
): void {
  if (!lessons[instructor]) {
    lessons[instructor] = {
      beginner: [],
      intermediate: [],
      advanced: []
    };
  }

  if (!lessons[instructor][level]) {
    lessons[instructor][level] = [];
  }

  const existingIndex = lessons[instructor][level].findIndex(
    (l) => l.id === lesson.id
  );

  if (existingIndex >= 0) {
    lessons[instructor][level][existingIndex] = deepClone(lesson);
  } else {
    lessons[instructor][level].push(deepClone(lesson));
  }
}

/**
 * Register lessons for an instructor programmatically
 */
export function registerInstructorLessons(
  instructor: string,
  data: InstructorLessons
): void {
  if (lessons[instructor]) {
    console.warn(
      `Instructor '${instructor}' already exists. Merging content.`
    );
    for (const level of Object.keys(data)) {
      if (!lessons[instructor][level]) {
        lessons[instructor][level] = [];
      }
      lessons[instructor][level] = [
        ...lessons[instructor][level],
        ...data[level]
      ];
    }
  } else {
    lessons[instructor] = deepClone(data);
  }
}

/**
 * Get all available instructors
 */
export function getAvailableInstructors(): string[] {
  return Object.keys(lessons).filter((key) => {
    const instructorLessons = lessons[key];
    return Object.values(instructorLessons).some((level) => level.length > 0);
  });
}

/**
 * Get statistics about loaded content
 */
export function getContentStats(): {
  instructors: string[];
  totalLessons: number;
  lessonsByInstructor: { [key: string]: number };
} {
  const stats = {
    instructors: [] as string[],
    totalLessons: 0,
    lessonsByInstructor: {} as { [key: string]: number }
  };

  for (const instructor of Object.keys(lessons)) {
    let count = 0;
    for (const level of Object.keys(lessons[instructor])) {
      count += lessons[instructor][level].length;
    }
    if (count > 0) {
      stats.instructors.push(instructor);
      stats.lessonsByInstructor[instructor] = count;
      stats.totalLessons += count;
    }
  }

  return stats;
}

// Auto-initialize when module loads (only in Node.js environment)
if (typeof window === "undefined") {
  initializeLessonsFromContent().catch((e) =>
    console.warn("Auto-initialization failed:", e)
  );
}

export default lessons;

export type Instructor = 'ash' | 'adarsh' | 'jean-mastan';
export type Level = 'beginner' | 'intermediate' | 'advanced';

export interface Quiz {
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
}

export interface MCQ {
  id: string;
  question: string;
  choices: string[];
  correctIndex: number;
  explanation?: string;
  tags?: string[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration?: string;
  quiz?: Quiz[];
  mcqs?: MCQ[];
  content?: string;
  note?: string;
  prerequisites?: string[];
}

export interface Phase {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface InstructorMetadata {
  name: string;
  title: string;
  description: string;
  color: string;
  image?: string;
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  quizScore?: number;
  timestamp?: number;
}

export interface UserProgress {
  instructor: Instructor;
  level: Level;
  lessons: LessonProgress[];
  lastAccessed?: number;
}

// Legacy types for backward compatibility
export interface Curriculum {
  [key: string]: any;
}


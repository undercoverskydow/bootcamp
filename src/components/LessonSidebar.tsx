'use client';

import { motion } from 'framer-motion';
import { Lesson, LessonProgress } from '@/lib/types';
import { CheckCircle2, Circle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface LessonSidebarProps {
  lessons: Lesson[];
  currentLessonId: string;
  progress: LessonProgress[];
  instructor: string;
  level: string;
}

export function LessonSidebar({
  lessons,
  currentLessonId,
  progress,
  instructor,
  level,
}: LessonSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getProgressStatus = (lessonId: string) => {
    return progress.find((p) => p.lessonId === lessonId);
  };

  const content = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-purple-500/30 bg-black/50">
        <h2 className="font-bold text-white">
          {lessons.length} Lessons
        </h2>
        <p className="text-xs text-purple-300 mt-1">
          {progress.filter((p) => p.completed).length} / {lessons.length} completed
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <style>{`
          #lesson-sidebar-content::-webkit-scrollbar {
            width: 6px;
          }
          
          #lesson-sidebar-content::-webkit-scrollbar-track {
            background: transparent;
          }
          
          #lesson-sidebar-content::-webkit-scrollbar-thumb {
            background: #a855f7;
            border-radius: 3px;
          }
          
          #lesson-sidebar-content::-webkit-scrollbar-thumb:hover {
            background: #9333ea;
          }
        `}</style>
        <div id="lesson-sidebar-content" className="p-3 space-y-2 overflow-y-auto h-full">
          {lessons.map((lesson, index) => {
            const status = getProgressStatus(lesson.id);
            const isCurrent = lesson.id === currentLessonId;

            return (
              <Link
                key={lesson.id}
                href={`/instructor/${instructor}/${level}/${lesson.id}`}
              >
                <motion.div
                  whileHover={{ x: 4 }}
                  onClick={() => setIsOpen(false)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-purple-900/40 border-2 border-purple-500'
                      : 'hover:bg-purple-900/20 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {status?.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        Lesson {index + 1}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {lesson.title}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 right-4 z-40 p-2 bg-purple-900/40 border border-purple-500/30 rounded-lg"
        aria-label="Open lessons menu"
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={isOpen ? { x: -280 } : { x: 0 }}
        animate={isOpen ? { x: 0 } : undefined}
        className={`${
          isOpen ? 'fixed' : 'hidden'
        } md:block md:relative w-72 h-screen md:h-full bg-black border-r border-purple-500/30 z-30 flex flex-col`}
        style={{
          scrollbarColor: "rgba(147, 51, 234, 0.6) transparent",
          scrollbarWidth: "thin"
        }}
      >
        <style>{`
          #lesson-sidebar::-webkit-scrollbar {
            width: 6px;
          }
          
          #lesson-sidebar::-webkit-scrollbar-track {
            background: transparent;
          }
          
          #lesson-sidebar::-webkit-scrollbar-thumb {
            background: rgba(147, 51, 234, 0.5);
            border-radius: 3px;
          }
          
          #lesson-sidebar::-webkit-scrollbar-thumb:hover {
            background: rgba(147, 51, 234, 0.7);
          }
        `}</style>
        {content}
      </motion.div>
    </>
  );
}

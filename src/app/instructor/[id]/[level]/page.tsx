'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Level } from '@/lib/types';

export default function LevelPage() {
  const params = useParams();
  const instructorId = params.id as string;
  const levelId = params.level as Level;
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch(`/api/lessons?instructor=${instructorId}`);
        if (response.ok) {
          const data = await response.json();
          // Temporary debug log to verify data returned from API in production
          try {
            console.log('Fetched /api/lessons', { instructorId, levelId, data, NEXT_PUBLIC_FINAL_CODE: process.env.NEXT_PUBLIC_FINAL_CODE });
          } catch (e) {
            // ignore logging failures
          }

          if (data[levelId]) {
            setLessons(data[levelId]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch lessons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [instructorId, levelId]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-purple-500/30 sticky top-0 z-50 backdrop-blur-md bg-black/50">
        <div className="max-w-[1400px] mx-auto px-6 py-6">
          <Link
            href={`/instructor/${instructorId}`}
            className="flex items-center gap-2 text-purple-300 hover:text-purple-200 font-semibold mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Link>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-purple-950/30 backdrop-blur-md p-6 overflow-hidden transition-all duration-300 hover:border-purple-400/60 hover:from-purple-900/40 hover:to-purple-950/50"
          >
            {/* Glow Effect on Hover */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at center, rgba(147, 51, 234, 0.3) 0%, transparent 70%)',
              }}>
            </div>

            <div className="relative z-10">
              <h1 className="text-3xl font-bold text-white capitalize">
                {levelId} Level
              </h1>
              <p className="text-sm text-purple-300 mt-2">
                {lessons.length} lessons to master
              </p>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <section className="px-6 py-12">
        <div className="max-w-[1400px] mx-auto w-full">
          <style>{`
            ::-webkit-scrollbar {
              width: 8px;
            }
            
            ::-webkit-scrollbar-track {
              background: transparent;
            }
            
            ::-webkit-scrollbar-thumb {
              background: #a855f7;
              border-radius: 4px;
            }
            
            ::-webkit-scrollbar-thumb:hover {
              background: #9333ea;
            }
            
            scrollbar-color: #a855f7 transparent;
            scrollbar-width: thin;
          `}</style>
          <h2 className="text-3xl font-bold text-white mb-8">
            Lessons
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lessons.map((lesson, idx) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Link href={`/instructor/${instructorId}/${levelId}/${lesson.id}`}>
                  <div className="group relative h-full cursor-pointer rounded-xl overflow-hidden">
                    {/* Glassmorphism Background */}
                    <div className="absolute inset-0 rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-purple-950/30 backdrop-blur-md transition-all duration-300 group-hover:from-purple-900/40 group-hover:to-purple-950/50 group-hover:border-purple-400/60"></div>

                    {/* Glow Effect on Hover */}
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
                      style={{
                        background: 'radial-gradient(circle at center, rgba(147, 51, 234, 0.3) 0%, transparent 70%)',
                      }}>
                    </div>

                    <div className="relative z-10 p-6 h-full">
                      <div className="text-4xl mb-4">📚</div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        Lesson {idx + 1}
                      </h3>
                      <p className="text-gray-300">{lesson.title}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-500/30 backdrop-blur-md bg-black/50 mt-12">
        <div className="max-w-[1400px] mx-auto px-6 py-6 text-center text-gray-400 text-sm">
          <p>Complete all lessons to progress to the next level</p>
        </div>
      </footer>
    </div>
  );
}

"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { QuizComponent } from '@/components/QuizComponent';
import { LessonSidebar } from '@/components/LessonSidebar';
import { ProgressTracker } from '@/components/ProgressTracker';
import { FinalCodeUnlock } from '@/components/FinalCodeUnlock';
import { Lesson, Level, LessonProgress, Instructor } from '@/lib/types';
import { saveLessonProgress, getUserProgress, getProgressStats, isBootcampCompleted } from '@/lib/storage';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const instructorId = params.id as Instructor;
  const levelId = params.level as Level;
  const lessonId = params.lesson as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [bootcampDone, setBootcampDone] = useState(false);
  const [showFinalCode, setShowFinalCode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        // Fetch all lessons for this instructor and level
        const response = await fetch(`/api/lessons?instructor=${instructorId}`);
        if (response.ok) {
          const data = await response.json();
          const levelLessons = data[levelId] || [];
          setAllLessons(levelLessons);
          
          // Find the current lesson
          const currentLesson = levelLessons.find((l: Lesson) => l.id === lessonId);
          if (currentLesson) {
            setLesson(currentLesson);
          } else {
            console.error('Lesson not found:', lessonId);
          }
        }
      } catch (error) {
        console.error('Failed to fetch lessons:', error);
      } finally {
        setLoading(false);
      }
    };

    // Load progress
    const userProgress = getUserProgress(instructorId, levelId);
    setProgress(userProgress?.lessons || []);

    // Check if bootcamp is complete
    const completed = isBootcampCompleted(instructorId);
    setBootcampDone(completed);

    fetchLessons();
  }, [instructorId, levelId, lessonId]);

  function IframePlayer({ src, title, originalEmbed }: { src: string; title: string; originalEmbed?: string }) {
    const [failed, setFailed] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const raw = (originalEmbed || '').split('/embed/')[1] || '';
    const videoId = raw.split(/[?&]/)[0] || '';
    const watchUrl = videoId ? `https://youtu.be/${videoId}` : (originalEmbed || '');

    // Check oEmbed to detect if the video is embeddable. We use this only for diagnostics;
    // we no longer hide the iframe purely because the oEmbed check failed. That was causing
    // the thumbnail to replace the iframe in some environments where the oEmbed fetch
    // failed or was slow. Attempt the iframe first and fall back to the thumbnail only
    // when the iframe actually errors or times out.
    const [embeddable, setEmbeddable] = useState<boolean | null>(null);
    useEffect(() => {
      if (!videoId) {
        setEmbeddable(false);
        return;
      }

      let cancelled = false;
      const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
      fetch(url)
        .then((res) => {
          if (cancelled) return;
          setEmbeddable(res.ok);
        })
        .catch(() => {
          if (cancelled) return;
          setEmbeddable(false);
        });

      return () => { cancelled = true; };
    }, [videoId]);

    // fallback if iframe doesn't load within a longer timeout (covers blocked embeds)
    useEffect(() => {
      if (loaded) return;
      // Give more time for slower networks or dev environments
      const t = setTimeout(() => setFailed(true), 5000);
      return () => clearTimeout(t);
    }, [loaded]);

    // Build a normalized iframe src on the fly and append safer params suggested (?rel=0&modestbranding=1)
    const buildSrc = (original?: string) => {
      if (!original) return '';
      // switch to nocookie domain
      let s = original.replace('https://www.youtube.com/embed/', 'https://www.youtube-nocookie.com/embed/');
      // separate base and query
      const [base, qs] = s.split('?');
      const params = new URLSearchParams(qs || '');
      // ensure rel=0 and modestbranding=1
      if (!params.has('rel')) params.set('rel', '0');
      if (!params.has('modestbranding')) params.set('modestbranding', '1');
      return `${base}?${params.toString()}`;
    };

    const iframeSrc = buildSrc(originalEmbed || src);

    const thumb = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : undefined;

    // If the iframe failed to load, render the thumbnail fallback. Otherwise render the iframe.
    if (failed) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-xl">
          <div className="text-center text-gray-300 w-full">
            {thumb ? (
              <div className="block relative w-full">
                <div className="w-full rounded-md overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  <img src={thumb} alt="video thumbnail" className="w-full h-full object-contain md:object-cover block" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/60 p-4 rounded-full">
                    <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="mb-4">Video cannot be embedded. <a className="underline text-purple-400" href={watchUrl} target="_blank" rel="noreferrer">Open on YouTube</a></p>
              </div>
            )}
          </div>
        </div>
      );
    }

    // While embeddability is being checked we can still render the iframe; show a small
    // status if desired, but don't block the iframe rendering.
    return (
      <div className="w-full h-full block">
        <iframe
          src={iframeSrc}
          className="w-full h-full block"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          title={title}
          onError={() => setFailed(true)}
          onLoad={() => setLoaded(true)}
        />
      </div>
    );
  }

  const handleQuizComplete = (score: number) => {
    saveLessonProgress(instructorId, levelId, lessonId, true, score);
    setProgress((prev) => {
      const existing = prev.find((p) => p.lessonId === lessonId);
      if (existing) {
        return prev.map((p) =>
          p.lessonId === lessonId ? { ...p, completed: true, quizScore: score } : p
        );
      }
      return [
        ...prev,
        { lessonId, completed: true, quizScore: score, timestamp: Date.now() },
      ];
    });

    // Check if all lessons are complete
    const nextLessonIndex = allLessons.findIndex((l) => l.id === lessonId) + 1;
    if (nextLessonIndex < allLessons.length) {
      // Auto navigate to next lesson
      setTimeout(() => {
        window.location.href = `/instructor/${instructorId}/${levelId}/${allLessons[nextLessonIndex].id}`;
      }, 1000);
    } else {
      // Level complete, show completion message
      // Check if bootcamp complete
      const stats = getProgressStats(instructorId);
      if (stats.percentage === 100) {
        setBootcampDone(true);
        setShowFinalCode(true);
      }
    }

    setShowQuiz(false);
  };

  if (loading || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <motion.div
          animate={{ opacity: [0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-purple-400 text-lg"
        >
          Loading lesson...
        </motion.div>
      </div>
    );
  }

  if (showFinalCode && bootcampDone) {
    return (
      <div className="min-h-screen bg-black py-16">
        <div className="max-w-[1400px] mx-auto px-6">
          <FinalCodeUnlock
            instructor={instructorId}
            onSuccess={() => window.location.href = '/'}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <LessonSidebar
        lessons={allLessons}
        currentLessonId={lessonId}
        progress={progress}
        instructor={instructorId}
        level={levelId}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
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
          
          /* Firefox scrollbar */
          * {
            scrollbar-color: #a855f7 transparent;
            scrollbar-width: thin;
          }
        `}</style>
        <div className="p-8 pt-20 md:pt-8">
          <div className="max-w-5xl mx-auto">
            {/* Back Button */}
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => router.push(`/instructor/${instructorId}/${levelId}`)}
              className="flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors mb-6"
            >
              <ArrowLeft size={20} />
              <span>Back to Level</span>
            </motion.button>

            {/* Video Player - forced iframe */}
            <div className="w-full px-4 sm:px-0">
              <div className="w-full bg-black rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
                {(() => {
                  // Extract video ID from various YouTube URL formats
                  let videoId = '';
                  const url = lesson.videoUrl || '';
                  
                  if (url.includes('youtu.be/')) {
                    // Short URL: https://youtu.be/videoId
                    videoId = url.split('youtu.be/')[1]?.split(/[\?&]/)[0] || '';
                  } else if (url.includes('youtube.com/watch')) {
                    // Long URL: https://www.youtube.com/watch?v=videoId
                    const match = url.match(/v=([a-zA-Z0-9_-]{11})/);
                    videoId = match?.[1] || '';
                  } else if (url.includes('youtube.com/embed/')) {
                    // Already embed URL
                    videoId = url.split('embed/')[1]?.split(/[\?&]/)[0] || '';
                  }
                  
                  const embedUrl = videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1` : '';
                  
                  return (
                    <IframePlayer src={embedUrl} title={lesson.title} originalEmbed={embedUrl} />
                  );
                })()}
              </div>
            </div>

            {/* Lesson info below video (kept styling similar to VideoPlayer) */}
            <div className="mt-8">
              <h1 className="text-4xl font-bold text-white mb-4">{lesson.title}</h1>
              {lesson.note && (
                <p className="text-sm text-gray-400 mb-4">Source: <a className="text-purple-400 hover:text-purple-300 underline" href={lesson.note} target="_blank" rel="noreferrer">watch on YouTube</a></p>
              )}
            </div>

            {/* Progress Tracker */}
            <div className="mt-8 max-w-2xl">
              <ProgressTracker
                total={allLessons.length}
                completed={progress.filter((p) => p.completed).length}
                percentage={Math.round(
                  (progress.filter((p) => p.completed).length / allLessons.length) * 100
                )}
              />
            </div>

            {/* Quiz Section (use mcqs -> quiz adapter, batch mode with exactly 5 questions) */}
            {lesson.mcqs && lesson.mcqs.length > 0 && (
              <motion.div className="mt-12">
                <div className="max-w-2xl">
                  {!showQuiz ? (
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => setShowQuiz(true)}
                      className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold text-lg px-8 py-4 w-full rounded-lg transition-all duration-300"
                    >
                      Take Quiz to Continue
                    </motion.button>
                  ) : (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      <QuizComponent
                        quiz={lesson.mcqs.slice(0, 5).map((q: any) => ({
                          question: q.question,
                          options: q.options,
                          // support both `correctIndex` and `answer` naming
                          answer: (q.correctIndex ?? q.answer) as number,
                        }))}
                        onComplete={handleQuizComplete}
                        batchMode
                      />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

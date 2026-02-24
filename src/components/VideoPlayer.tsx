'use client';

import { Lesson } from '@/lib/types';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

interface VideoPlayerProps {
  lesson: Lesson;
}

export function VideoPlayer({ lesson }: VideoPlayerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="w-full px-4 sm:px-0">
        <div className="relative w-full bg-black rounded-xl overflow-hidden "  style={{ aspectRatio: '16/9' }}>
          {lesson.videoUrl ? (
            <iframe
              src={lesson.videoUrl}
              width="100%"
              height="100%"
              className="block w-full h-full"
              loading="lazy"
              allowFullScreen
              title={lesson.title}
            />
          ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
            <div className="text-center text-gray-50">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mb-4"
              >
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                  <Play className="w-12 h-12 fill-white" />
                </div>
              </motion.div>
              <p className="text-lg font-semibold">{lesson.title}</p>
              {lesson.duration && (
                <p className="text-gray-400 text-sm mt-2">Duration: {lesson.duration}</p>
              )}
            </div>
          </div>
        )}

        {/* Overlay info */}
        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg">
          <p className="text-gray-50 text-sm font-semibold">
            {lesson.duration || 'Video'}
          </p>
        </div>
        </div>
      </div>

      {/* Lesson info below video */}
      <div className="mt-8">
        <h1 className="text-4xl font-bold text-gray-50 mb-4">
          {lesson.title}
        </h1>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="font-semibold text-gray-50 mb-3">
            About this lesson
          </h3>
          <p className="text-gray-400 leading-relaxed">
            {lesson.description}
          </p>

          {lesson.content && (
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-semibold text-gray-50 mb-3">
                Key Points
              </h4>
              <div className="prose prose-sm max-w-none">
                <div className="text-gray-400 whitespace-pre-wrap">
                  {lesson.content}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

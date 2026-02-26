// src/components/market-test/ResultScreen.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { getRandomGif } from '@/lib/gifPool';

export interface ResultData {
  percentage: number;
  weightedScore: number;
  difficultyBreakdown: Record<string, number>;
  maxStreak: number;
  bestScore?: number;
}

interface Props {
  data: ResultData;
  onRetake: () => void;
  onGoCurriculum: () => void;
}

export default function ResultScreen({ data, onRetake, onGoCurriculum }: Props) {
  const [gifUrl, setGifUrl] = useState<string | null>(null);

  const passed = data.percentage >= 70;

  useEffect(() => {
    const url = getRandomGif(passed);
    setGifUrl(url);
  }, [passed]);

  const circlePercentage = data.percentage;

  return (
    <div className="w-full max-w-md mx-auto text-center text-white">
      <h2 className="text-4xl font-bold mb-4">
        You {passed ? 'Passed' : 'Failed'}
      </h2>
      {gifUrl && (
        <div className="mb-4">
          {/* use img for Tenor/generic links; iframe caused placeholders */}
          <img
            src={gifUrl}
            alt="result gif"
            width="100%"
            height="200"
            className="rounded-lg object-cover"
          />
        </div>
      )}
      <div className="relative w-40 h-40 mx-auto mb-4">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            stroke="#444"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            stroke="#a649fa"
            strokeWidth="6"
            fill="none"
            strokeDasharray={100}
            strokeDashoffset={100 - circlePercentage}
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
          {circlePercentage}%
        </span>
      </div>

      <div className="mb-4 text-left">
        {data.bestScore != null && (
          <p>Best Score: {data.bestScore}%</p>
        )}
        <p>Weighted Score: {data.weightedScore}</p>
        <p>Max Streak: {data.maxStreak}</p>
        <p>Difficulty breakdown:</p>
        <ul className="list-disc list-inside">
          <li>Easy: {data.difficultyBreakdown.easy || 0}</li>
          <li>Medium: {data.difficultyBreakdown.medium || 0}</li>
          <li>Hard: {data.difficultyBreakdown.hard || 0}</li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
        <button
          onClick={onRetake}
          className="button-secondary-glow px-8 py-3"
        >
          Retake Test
        </button>
        <button
          onClick={onGoCurriculum}
          className="button-primary-glow px-8 py-3"
        >
          Go to Curriculum
        </button>
      </div>
    </div>
  );
}

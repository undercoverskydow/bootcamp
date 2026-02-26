// src/components/market-test/TimerCircle.tsx

'use client';

import React, { useEffect, useState } from 'react';

interface Props {
  duration?: number; // seconds
  onExpire: () => void;
  resetKey?: any; // when this value changes timer restarts
}

export default function TimerCircle({
  duration = 30,
  onExpire,
  resetKey,
}: Props) {
  const [timeLeft, setTimeLeft] = useState(duration);

  // restart timer when resetKey changes
  useEffect(() => {
    setTimeLeft(duration);
  }, [resetKey, duration]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onExpire]);

  const percentage = (timeLeft / duration) * 100;

  return (
    <div className="relative w-12 h-12">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r="45%"
          stroke="#444"
          strokeWidth="4"
          fill="none"
        />
        <circle
          cx="50%"
          cy="50%"
          r="45%"
          stroke="#a649fa"
          strokeWidth="4"
          fill="none"
          strokeDasharray={100}
          strokeDashoffset={100 - percentage}
          style={{ transition: 'stroke-dashoffset 0.5s linear' }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm text-white">
        {timeLeft}
      </span>
    </div>
  );
}

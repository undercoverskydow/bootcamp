// src/components/market-test/SwipeCard.tsx

'use client';

import React, { useState } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { MarketQuestion } from '@/lib/questionPool';

interface Props {
  question: MarketQuestion;
  onAnswer: (answer: boolean) => void;
}

export default function SwipeCard({ question, onAnswer }: Props) {
  const [rotation, setRotation] = useState(0);

  const handleDrag = (_: any, info: PanInfo) => {
    setRotation(info.offset.x / 20);
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      onAnswer(true);
    } else if (info.offset.x < -threshold) {
      onAnswer(false);
    }
    setRotation(0);
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      style={{ rotate: rotation }}
      className="relative w-80 max-w-full bg-white/5 border border-white/10 rounded-xl p-8 cursor-grab shadow-lg"
      whileTap={{ cursor: 'grabbing' }}
    >
      <p className="text-lg font-semibold text-white">{question.question}</p>

      {/* desktop buttons */}
      <div className="hidden md:flex justify-between mt-8">
        <button
          onClick={() => onAnswer(false)}
          className="button-secondary-glow px-6 py-2"
        >
          No
        </button>
        <button
          onClick={() => onAnswer(true)}
          className="button-primary-glow px-6 py-2"
        >
          Yes
        </button>
      </div>
    </motion.div>
  );
}

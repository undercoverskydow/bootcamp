// src/app/market-test/page.tsx

'use client';

import React, { useEffect, useRef, useState } from 'react';
import SwipeCard from '@/components/market-test/SwipeCard';
import TimerCircle from '@/components/market-test/TimerCircle';
import ResultScreen, { ResultData } from '@/components/market-test/ResultScreen';
import Leaderboard from '@/components/market-test/Leaderboard';

import { createSession, Session } from '@/lib/adaptiveEngine';
import { questionPool, MarketQuestion } from '@/lib/questionPool';

export default function MarketTestPage() {
  const sessionRef = useRef<Session | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<MarketQuestion | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [timerKey, setTimerKey] = useState(0);
  const [result, setResult] = useState<ResultData | null>(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [streakText, setStreakText] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [bestScore, setBestScore] = useState<number>(0);

  const startNewSession = () => {
    const s = createSession(questionPool);
    sessionRef.current = s;
    const first = s.getNextQuestion();
    setCurrentQuestion(first);
    setQIndex(1);
    setResult(null);
    setCurrentStreak(0);
    setShake(false);
    setTimerKey((k) => k + 1);
  };

  useEffect(() => {
    startNewSession();
  }, []);

  const finishSession = () => {
    if (!sessionRef.current) return;
    const score = sessionRef.current.getScore();
    // load persisted best score
    const stored = typeof window !== 'undefined' ? localStorage.getItem('marketTest_best') : null;
    const prevBest = stored ? parseInt(stored, 10) || 0 : 0;
    const newBest = Math.max(prevBest, score.percentage);
    if (newBest !== prevBest && typeof window !== 'undefined') {
      localStorage.setItem('marketTest_best', newBest.toString());
    }
    setBestScore(newBest);
    setResult({ ...score, bestScore: newBest });
  };

  const handleAnswer = (answer: boolean) => {
    if (!sessionRef.current || !currentQuestion) return;
    const correct = answer === currentQuestion.correctAnswer;
    sessionRef.current.answerCurrent(correct);

    let newStreak = currentStreak;
    if (correct) {
      newStreak = currentStreak + 1;
    } else {
      newStreak = 0;
      // trigger shake animation
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    setCurrentStreak(newStreak);

    // update streak text message
    if (newStreak >= 3 && correct) {
      const messages = [
        'Heat building up',
        'Streak mode on',
        'Market whisperer',
        'Calm assassin',
        'Edge detected',
        'Sniper focus',
        'Locked in',
        'On fire now',
        'Risk respected',
        'Ice in veins',
      ];
      const idx = Math.floor(Math.random() * messages.length);
      setStreakText(messages[idx]);
    } else if (newStreak < 3) {
      setStreakText(null);
    }

    const next = sessionRef.current.getNextQuestion();
    if (!next) {
      finishSession();
    } else {
      setCurrentQuestion(next);
      setQIndex(sessionRef.current.getHistory().length + 1);
      setTimerKey((k) => k + 1);
    }
  };

  const handleTimeout = () => {
    handleAnswer(false);
  };

  const onRetake = () => {
    startNewSession();
  };

  const onGoCurriculum = () => {
    window.location.href = '/instructor/adarsh/beginner/adarsh-beginner-1';
  };

  return (
    <div
      className={`min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 ${
        currentStreak >= 3 ? 'pulse-bg' : ''
      } ${shake ? 'shake' : ''}`}
    >
      {!result && currentQuestion && (
        <div className="flex flex-col items-center gap-6 w-full">
          {/* instruction / heading */}
          <h3 className="text-xl font-semibold mb-2">
            Swipe instinctively – yes or no.
          </h3>

          <div className="flex items-center gap-4">
            <TimerCircle
              key={timerKey}
              duration={30}
              onExpire={handleTimeout}
              resetKey={timerKey}
            />
            <span className="text-sm">
              {qIndex}/10{' '}
              {streakText && (
                <span className="text-purple-300 ml-2">{streakText}</span>
              )}
            </span>
          </div>

          <SwipeCard question={currentQuestion} onAnswer={handleAnswer} />
        </div>
      )}

      {result && (
        <div className="w-full max-w-xl">
          <ResultScreen
            data={result}
            onRetake={onRetake}
            onGoCurriculum={onGoCurriculum}
          />
          <Leaderboard
            currentScore={result.percentage}
            difficultyAverage={
              // compute average difficulty label from breakdown
              (() => {
                const bd = result.difficultyBreakdown;
                const total = bd.easy + bd.medium + bd.hard;
                if (total === 0) return '';
                const avg = (bd.easy * 1 + bd.medium * 2 + bd.hard * 3) / total;
                if (avg < 1.7) return 'Easy';
                if (avg < 2.3) return 'Medium';
                return 'Hard';
              })()
            }
          />
        </div>
      )}

      {/* persistent back button */}
      <div className="mt-10">
        <a
          href="/"
          className="text-purple-300 underline text-sm"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}

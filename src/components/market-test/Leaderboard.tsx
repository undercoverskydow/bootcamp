// src/components/market-test/Leaderboard.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { setItem, getItem } from '@/lib/storage';

export interface LeaderEntry {
  score: number;
  date: string; // ISO string
  difficultyAverage: string;
}

interface Props {
  currentScore?: number;
  difficultyAverage?: string;
}

const STORAGE_KEY = 'marketTest_leaderboard';

function loadLeaderboard(): LeaderEntry[] {
  try {
    const raw = getItem(STORAGE_KEY);
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function saveLeaderboard(entries: LeaderEntry[]) {
  setItem(STORAGE_KEY, entries);
}

export default function Leaderboard({ currentScore, difficultyAverage }: Props) {
  const [entries, setEntries] = useState<LeaderEntry[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setEntries(loadLeaderboard());
  }, []);

  // if a new score comes in, add it
  useEffect(() => {
    if (currentScore != null) {
      const now = new Date().toISOString();
      const diffAvg = typeof difficultyAverage === 'string' ? difficultyAverage : '';
      const updated = [...entries, { score: currentScore, date: now, difficultyAverage: diffAvg }];
      updated.sort((a, b) => b.score - a.score);
      const top = updated.slice(0, 10);
      setEntries(top);
      saveLeaderboard(top);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScore, difficultyAverage]);

  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="mt-4 underline text-purple-300"
      >
        View Leaderboard
      </button>
    );
  }

  return (
    <div className="mt-4 text-white">
      <button
        onClick={() => setVisible(false)}
        className="mb-2 underline text-purple-300"
      >
        Hide Leaderboard
      </button>
      <table className="w-full text-left text-sm">
        <thead>
          <tr>
            <th className="px-2 py-1">#</th>
            <th className="px-2 py-1">Score%</th>
            <th className="px-2 py-1">Avg. Diff</th>
            <th className="px-2 py-1">Date</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e, idx) => (
            <tr
              key={idx}
              className={
                currentScore === e.score ? 'bg-purple-600/30' : ''
              }
            >
              <td className="px-2 py-1">{idx + 1}</td>
              <td className="px-2 py-1">{e.score}%</td>
              <td className="px-2 py-1">{e.difficultyAverage || '-'}</td>
              <td className="px-2 py-1">
                {new Date(e.date).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

"use client";

import React from 'react';

const games = [
  'Pip Snake',
  'Chart Runner',
  'Candle Dash',
  'Risk Dodge',
  'Equity Escape',
  'Breakout Tap',
  'Trend Rider',
  'Spread Sprint',
  'Liquidity Hunt',
  'Stop Loss Survival',
  'Flash Scalper',
  'Volatility Rush',
  'Market Maze',
  'Trade Tetris',
  'Calm the Charts',
];

export default function ChillZone() {
  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Chill Zone</h1>
        <p className="text-gray-400 mb-8">Choose a mini-game to unwind and sharpen instincts.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {games.map((g) => {
            const slug = g.toLowerCase().replace(/\s+/g, '-');
            return (
              <a
                key={slug}
                href={`/chill-zone/${slug}`}
                className="block p-6 rounded-xl border border-white/10 bg-white/5 hover:border-purple-400/50 hover:bg-white/10 transition"
              >
                <h3 className="text-xl font-semibold mb-2">{g}</h3>
                <p className="text-sm text-gray-300">Quick playable mini-experience.</p>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

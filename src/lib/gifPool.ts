// src/lib/gifPool.ts

export const passGifs = [
  'https://media.giphy.com/media/TP4I3f4KN4tXy/giphy.gif',
  'https://media.giphy.com/media/xT9IgEx8SbQ0teblvC/giphy.gif',
  'https://media.giphy.com/media/NEvPzZ8bd1V4Y/giphy.gif',
  'https://media.giphy.com/media/3o7TKU8RPUd7b8F2a0/giphy.gif',
];

export const failGifs = [
  'https://media.giphy.com/media/3o6Zt6KHxJTbXCTAyQ/giphy.gif',
  'https://media.giphy.com/media/lybNY84qbaB9K/giphy.gif',
  'https://media.giphy.com/media/jLeyMePVxwVCJOvVWx/giphy.gif',
  'https://media.giphy.com/media/ISOckM7t1hKvDYYypf/giphy.gif',
];

/**
 * Pick a random gif from the appropriate pool based on pass/fail boolean. Does not preload the entire pool.
 */
export function getRandomGif(passed: boolean): string {
  const pool = passed ? passGifs : failGifs;
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

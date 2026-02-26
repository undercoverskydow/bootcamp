// src/lib/questionPool.ts

import { shuffle } from './shuffle';
import { MarketQuestion, Difficulty } from './types';

// re-export for convenience
export { MarketQuestion, Difficulty };

// Example dataset compiled from the 100-question bank provided by user.
// Difficulties are assigned using a simple rotating pattern (easy/medium/hard)
// to ensure a mix; you can fine‑tune these later.

const rawQuestions: { text: string; answer: boolean }[] = [
  { text: 'The Forex market is the largest financial market in the world.', answer: true },
  { text: 'A stock represents ownership in a company.', answer: true },
  { text: 'Crypto markets close on weekends.', answer: false },
  { text: 'Indices measure the performance of a group of stocks.', answer: true },
  { text: 'Leverage increases both potential profit and risk.', answer: true },
  { text: 'TradingView is a broker where you can directly hold your money.', answer: false },
  { text: 'A broker guarantees you profits if you follow their signals.', answer: false },
  { text: 'Risk management is more important than finding perfect entries.', answer: true },
  { text: 'A stop loss limits potential losses on a trade.', answer: true },
  { text: 'Market orders guarantee a specific entry price.', answer: false },
  { text: 'Liquidity refers to how easily an asset can be bought or sold.', answer: true },
  { text: 'Bitcoin is controlled by a central bank.', answer: false },
  { text: 'Forex pairs are traded in base/quote format.', answer: true },
  { text: 'A pip is a unit of measurement in Forex trading.', answer: true },
  { text: 'Scalping involves holding trades for weeks.', answer: false },
  { text: 'Swing trading typically lasts days to weeks.', answer: true },
  { text: 'Overtrading can damage trading performance.', answer: true },
  { text: 'Emotions do not affect trading decisions.', answer: false },
  { text: 'Higher timeframe trends are generally stronger than lower timeframe noise.', answer: true },
  { text: 'A margin call happens when your account equity falls too low.', answer: true },
  { text: 'Fundamental analysis focuses on economic data and news.', answer: true },
  { text: 'Technical analysis ignores price charts.', answer: false },
  { text: 'Support levels act as potential price floors.', answer: true },
  { text: 'Resistance levels act as potential price ceilings.', answer: true },
  { text: 'Breakouts always result in strong trends.', answer: false },
  { text: 'Diversification reduces overall portfolio risk.', answer: true },
  { text: 'Cryptocurrency markets are less volatile than Forex.', answer: false },
  { text: 'Lot size determines trade exposure.', answer: true },
  { text: 'Risking 50% of your account per trade is good risk management.', answer: false },
  { text: 'A bullish market means prices are rising.', answer: true },
  { text: 'A bearish market means prices are falling.', answer: true },
  { text: 'Slippage can occur during high volatility.', answer: true },
  { text: 'A demo account uses real money.', answer: false },
  { text: 'Compound growth can significantly increase long-term returns.', answer: true },
  { text: 'Revenge trading often leads to losses.', answer: true },
  { text: 'Indices like the S&P 500 represent multiple companies.', answer: true },
  { text: 'Forex is traded over-the-counter (OTC).', answer: true },
  { text: 'Crypto wallets store actual coins physically inside your device.', answer: false },
  { text: 'High leverage reduces trading risk.', answer: false },
  { text: 'A take profit order locks in gains automatically.', answer: true },
  { text: 'News events can increase market volatility.', answer: true },
  { text: 'Risk-to-reward ratio measures potential profit versus risk.', answer: true },
  { text: 'Trading without a plan improves discipline.', answer: false },
  { text: 'The spread is the difference between bid and ask price.', answer: true },
  { text: 'Broker regulation increases trader protection.', answer: true },
  { text: 'Day trading requires quick decision-making.', answer: true },
  { text: 'Long-term investing ignores market fundamentals.', answer: false },
  { text: 'Stablecoins are designed to reduce volatility.', answer: true },
  { text: 'Inflation can impact currency value.', answer: true },
  { text: 'Volume measures the number of shares or contracts traded.', answer: true },
  { text: 'You can trade Forex 24 hours a day during weekdays.', answer: true },
  { text: 'Fear and greed are major market drivers.', answer: true },
  { text: 'A downtrend consists of lower highs and lower lows.', answer: true },
  { text: 'A trading journal helps improve performance.', answer: true },
  { text: 'Crypto exchanges never get hacked.', answer: false },
  { text: 'Position sizing controls trade risk.', answer: true },
  { text: 'The NASDAQ is a cryptocurrency exchange.', answer: false },
  { text: 'Interest rates influence currency prices.', answer: true },
  { text: 'Backtesting guarantees future profits.', answer: false },
  { text: 'Trendlines help identify market direction.', answer: true },
  { text: 'A sideways market has no clear trend.', answer: true },
  { text: 'Funded accounts eliminate all trading risk.', answer: false },
  { text: 'Stop hunting can occur around key levels.', answer: true },
  { text: 'Risking 1-2% per trade is common risk management practice.', answer: true },
  { text: 'Markets move purely randomly with no structure.', answer: false },
  { text: 'A broker can widen spreads during volatility.', answer: true },
  { text: 'Liquidity is usually higher during major trading session overlaps.', answer: true },
  { text: 'Overleveraging can wipe out an account quickly.', answer: true },
  { text: 'Patience is an important trading skill.', answer: true },
  { text: 'Crypto trading requires a stock exchange account.', answer: false },
  { text: 'Economic calendars help traders prepare for news.', answer: true },
  { text: 'A gap in price usually happens due to strong imbalance.', answer: true },
  { text: 'Trading with no stop loss increases risk exposure.', answer: true },
  { text: 'All brokers manipulate the market.', answer: false },
  { text: 'You must predict every move correctly to be profitable.', answer: false },
  { text: 'Losing trades are part of trading.', answer: true },
  { text: 'The London session impacts Forex volatility.', answer: true },
  { text: 'Correlation means two assets move exactly the same at all times.', answer: false },
  { text: 'A higher win rate always guarantees profitability.', answer: false },
  { text: 'Risk-to-reward ratio can compensate for lower win rate.', answer: true },
  { text: 'Trading is a guaranteed way to become rich quickly.', answer: false },
  { text: 'If you double your lot size after every loss, you eliminate risk.', answer: false },
  { text: 'TradingView provides charting tools and analysis features.', answer: true },
  { text: 'Halal or haram classification of trading depends on structure and intent.', answer: true },
  { text: 'Using 1:1000 leverage automatically makes you a professional trader.', answer: false },
  { text: 'If a YouTuber shows profits, it means it’s risk-free.', answer: false },
  { text: 'A red candle always means the market will crash.', answer: false },
  { text: 'You can blow an account in one bad trade.', answer: true },
  { text: 'Copy trading removes the need to understand risk.', answer: false },
  { text: 'Brokers earn money from spreads or commissions.', answer: true },
  { text: 'Holding a losing trade forever guarantees recovery.', answer: false },
  { text: 'A strong trend can continue longer than expected.', answer: true },
  { text: 'Crypto markets operate 24/7.', answer: true },
  { text: 'The US Dollar impacts many global markets.', answer: true },
  { text: 'Indicators alone guarantee profitable entries.', answer: false },
  { text: 'Trading without emotions is completely humanly possible.', answer: false },
  { text: 'A stop loss can protect capital.', answer: true },
  { text: 'Making 5% monthly consistently is extremely easy.', answer: false },
  { text: 'Risk management is what keeps traders in the game long term.', answer: true },
  { text: 'Blaming the broker for every loss improves performance.', answer: false },
];

export const questionPool: MarketQuestion[] = shuffle(
  rawQuestions.map((q, idx) => ({
    id: `q${idx + 1}`,
    question: q.text,
    correctAnswer: q.answer,
    difficulty:
      idx % 3 === 0 ? 'hard' : idx % 3 === 1 ? 'medium' : 'easy',
  }))
);

/**
 * Helper to pull a random subset of questions. Uses a fresh shuffle so the original array is unaffected.
 */
export function getRandomQuestions(count: number = 10): MarketQuestion[] {
  return shuffle(questionPool).slice(0, count);
}

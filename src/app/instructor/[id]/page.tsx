'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const instructorData = {
  ash: {
    name: 'Ash',
    title: 'Professional CRT Strategist | 15+ Years of Experience',
    description: 'With over 15 years mastering CRT and market structure, Ash has helped traders decode price action with precision and confidence. Learn how to read the market like a professional — identify high-probability setups, understand liquidity movements, and trade with clarity instead of emotion.',
  },
  adarsh: {
    name: 'Adarsh',
    title: 'SMC & ICT Expert',
    description: 'Adarsh specializes in Smart Money Concepts (SMC), teaching traders how institutions truly move the market. Discover liquidity sweeps, order blocks, mitigation, and advanced market manipulation models used by professionals to stay ahead of retail traders.',
  },
  'jean-mastan': {
    name: 'Jean-Mastan',
    title: 'Stock Market Investor & Risk Strategist',
    description: 'Jean brings real-world investing experience from the stock market, focusing on long-term growth, capital preservation, and disciplined execution. Learn how to think like an investor, manage risk intelligently, and build sustainable wealth over time.',
  },
};

const levelConfig = {
  beginner: {
    description: 'Master the fundamentals of trading and technical analysis',
    tips: [
      'Learn price action basics',
      'Understand market structure',
      'Master support and resistance',
    ],
  },
  intermediate: {
    description: 'Build advanced trading strategies and skills',
    tips: [
      'Study supply and demand zones',
      'Learn confluence techniques',
      'Understand market psychology',
    ],
  },
  advanced: {
    description: 'Master professional trading at the highest level',
    tips: [
      'Institutional trading tactics',
      'Advanced order flow analysis',
      'Build profitable trading systems',
    ],
  },
};

export default function InstructorPage() {
  const params = useParams();
  const instructorId = params.id as string;
  const instructor = instructorData[instructorId as keyof typeof instructorData];
  const [lessonCounts, setLessonCounts] = useState({ beginner: 0, intermediate: 0, advanced: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!instructorId) return;

    const fetchLessons = async () => {
      try {
        const response = await fetch(`/api/lessons?instructor=${instructorId}`);
        if (response.ok) {
          const data = await response.json();
          setLessonCounts({
            beginner: data.beginner?.length || 0,
            intermediate: data.intermediate?.length || 0,
            advanced: data.advanced?.length || 0,
          });
        }
      } catch (error) {
        console.error('Failed to fetch lessons:', error);
        setLessonCounts({ beginner: 0, intermediate: 0, advanced: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [instructorId]);

  if (!instructor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Instructor not found</p>
          <Link href="/" className="button-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
        <div className="container-max section-padding">
          <Link href="/" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold mb-4">
            <ChevronLeft className="w-4 h-4" />
            Back
          </Link>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-gray-50">
              {instructor.name}'s Bootcamp
            </h1>
            <p className="text-gray-400 mt-2">{instructor.title}</p>
            <p className="text-gray-500 mt-1">{instructor.description}</p>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-max">
          <h2 className="text-3xl font-bold text-gray-50 mb-12">
            Choose Your Level
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {(['beginner', 'intermediate', 'advanced'] as const).map((level, idx) => (
              <motion.div
                key={level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Link href={`/instructor/${instructorId}/${level}`}>
                  <div className="card-base p-8 h-full cursor-pointer hover:shadow-xl transition-all dark:bg-gray-800 dark:border-gray-700">
                    <div className="text-5xl mb-4">
                      {level === 'beginner' ? '🌱' : level === 'intermediate' ? '📈' : '🚀'}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-50 mb-3 capitalize">
                      {level}
                    </h3>
                    <p className="text-gray-400 mb-4">{levelConfig[level].description}</p>
                    <p className="text-sm text-gray-500">{lessonCounts[level]} lessons</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-gray-900 rounded-xl p-8 border border-gray-800"
          >
            <h3 className="text-2xl font-bold text-gray-50 mb-6">
              About This Bootcamp
            </h3>
            <p className="text-gray-400 mb-6">
              This comprehensive bootcamp is designed to take you from beginner to advanced trader.
              Each level builds upon the previous one, so make sure to progress through them in order.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                <div key={level}>
                  <h4 className="font-bold text-gray-50 mb-2 capitalize">
                    {level}
                  </h4>
                  <ul className="space-y-1">
                    {levelConfig[level].tips.map((tip) => (
                      <li key={tip} className="text-sm text-gray-400">
                        • {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900 mt-12">
        <div className="container-max section-padding text-center text-gray-400 text-sm">
          <p>Progress through all three levels to unlock your bootcamp certificate</p>
        </div>
      </footer>
    </div>
  );
}

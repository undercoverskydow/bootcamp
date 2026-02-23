'use client';

import { motion } from 'framer-motion';
import { InstructorCard } from '@/components/InstructorCard';
import { CheckCircle2 } from 'lucide-react';

const instructors = [
  {
    id: 'ash',
    name: 'Ash',
    title: 'Professional CRT Strategist | 15+ Years of Experience',
    description: 'With over 15 years mastering CRT and market structure, Ash has helped traders decode price action with precision and confidence. Learn how to read the market like a professional — identify high-probability setups, understand liquidity movements, and trade with clarity instead of emotion.',
  },
  {
    id: 'adarsh',
    name: 'Adarsh',
    title: 'SMC & ICT Expert',
    description: 'Adarsh specializes in Smart Money Concepts (SMC), teaching traders how institutions truly move the market. Discover liquidity sweeps, order blocks, mitigation, and advanced market manipulation models used by professionals to stay ahead of retail traders.',
  },
  {
    id: 'jean-mastan',
    name: 'Jean-Mastan',
    title: 'Stock Market Investor & Risk Strategist',
    description: 'Jean brings real-world investing experience from the stock market, focusing on long-term growth, capital preservation, and disciplined execution. Learn how to think like an investor, manage risk intelligently, and build sustainable wealth over time.',
  },
];

const features = [
  {
    icon: '📚',
    title: 'Structured Curriculum',
    description: 'Beginner to Advanced - Learn in the right order',
  },
  {
    icon: '✅',
    title: 'Quiz Validation',
    description: 'Test yourself after each lesson to ensure understanding',
  },
  {
    icon: '📊',
    title: 'Trading Charts',
    description: 'Real market examples and interactive visualizations',
  },
  {
    icon: '🏆',
    title: 'Final Certificate',
    description: 'Unlock your bootcamp completion certificate',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header removed to show hero on entry */}

      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-gray-950 to-gray-900">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-5xl font-bold text-gray-50 mb-6">
              Master Trading The Structured Way
            </h2>
            <p className="text-xl text-gray-400 mb-4">
              Learn from industry experts. Progress through Beginner, Intermediate, and Advanced levels. Unlock your bootcamp completion certificate.
            </p>
            <p className="text-gray-400 mb-8">
              No registration required. No database. No BS. Pure education.
            </p>

            <a
              href="#learn-from-experts"
              className="button-primary text-lg px-8 py-4 inline-block"
            >
              Choose Your Instructor
            </a>
          </motion.div>
        </div>
      </section>

      {/* Instructor Cards Section */}
      <section id="learn-from-experts" className="section-padding bg-gray-900">
        <div className="container-max">
          <h3 className="text-3xl font-bold text-gray-50 mb-12 text-center">
            Learn from Expert Traders
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {instructors.map((instructor, idx) => (
              <motion.div
                key={instructor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <InstructorCard {...instructor} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Structure Section */}
      <section className="section-padding bg-gray-950">
        <div className="container-max">
          <h3 className="text-3xl font-bold text-gray-50 mb-12 text-center">
            Your Learning Path
          </h3>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[
                {
                  level: 'Beginner',
                  icon: '🌱',
                  description: 'Start with the fundamentals',
                  points: ['Basic concepts', 'Price action', 'Setup identification'],
                },
                {
                  level: 'Intermediate',
                  icon: '📈',
                  description: 'Build your trading skills',
                  points: ['Advanced strategies', 'Market dynamics', 'Risk management'],
                },
                {
                  level: 'Advanced',
                  icon: '🚀',
                  description: 'Master professional trading',
                  points: ['Institutional tactics', 'Confluence', 'Psychology'],
                },
              ].map((item, idx) => (
                <motion.div
                  key={item.level}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-900 rounded-xl p-8 border border-gray-800"
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h4 className="text-xl font-bold text-gray-50 mb-2">
                    {item.level}
                  </h4>
                  <p className="text-gray-400 text-sm mb-4">
                    {item.description}
                  </p>
                  <ul className="space-y-2">
                    {item.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-center gap-2 text-sm text-gray-400"
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="section-padding bg-gray-900">
        <div className="container-max">
          <h3 className="text-3xl font-bold text-gray-50 mb-12 text-center">
            Platform Features
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="font-bold text-gray-50 mb-2">
                  {feature.title}
                </h4>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section (replaced) */}
      <section className="section-padding bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-gray-50 mb-4">
              Ready to Start Learning?
            </h3>
            <p className="text-gray-400 mb-8 text-lg">
              Join our community to get support, updates, and connect with fellow traders.
            </p>

            <a
              href="https://discord.com/invite/mauritius"
              target="_blank"
              rel="noopener noreferrer"
              className="button-primary inline-block px-6 py-3 text-lg"
            >
              Join Our Community
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900">
        <div className="container-max section-padding text-center text-gray-400 text-sm">
          <p>
            © 2024 Trading Bootcamp. All rights reserved. | No registration. No database. Pure learning.
          </p>
        </div>
      </footer>
    </div>
  );
}

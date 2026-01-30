'use client';

import Link from 'next/link';
import { Target, Zap, GraduationCap, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const pathOptions = [
  {
    id: 'shooting',
    icon: <Target className="w-8 h-8" />,
    title: 'Fix My Shooting',
    subtitle: 'BB Shooting Evaluation',
    description: 'I mainly want to calibrate my shot. Get your personalized shooting profile with test protocols.',
    price: '$250',
    href: '/start/shooting',
    highlight: true,
  },
  {
    id: 'full-assessment',
    icon: <Zap className="w-8 h-8" />,
    title: 'Transform My Entire Game',
    subtitle: 'BB Full Assessment',
    description: 'I want help with movement, deception, and shooting. Apply for 3-month BB Mentorship.',
    price: 'Application',
    href: '/start/full-assessment',
    highlight: false,
  },
  {
    id: 'coach',
    icon: <GraduationCap className="w-8 h-8" />,
    title: 'Coach / Trainer',
    subtitle: 'BB Certification',
    description: "I want to learn the BB lens and get certified to use it with my players.",
    price: 'Application',
    href: '/start/coach',
    highlight: false,
  },
  {
    id: 'organization',
    icon: <Users className="w-8 h-8" />,
    title: 'Team / Organization',
    subtitle: 'Program Integration',
    description: "I'm inquiring for a program, academy, or team that wants BB installed.",
    price: 'Inquiry',
    href: '/start/organization',
    highlight: false,
  },
];

export default function StartPage() {
  return (
    <main className="min-h-screen bg-bb-black">
      {/* Header */}
      <header className="border-b border-bb-border bg-bb-dark/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-gold-500 font-bold tracking-wider text-sm">
            BASKETBALL BIOMECHANICS
          </Link>
          <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
            Back to Home
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What best describes you?
          </h1>
          <p className="text-gray-400 text-lg">
            Choose your path to get started with Basketball Biomechanics.
          </p>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {pathOptions.map((option) => (
            <Link key={option.id} href={option.href}>
              <Card
                className={`cursor-pointer transition-all hover:border-gold-500/50 ${
                  option.highlight
                    ? 'border-gold-500/30 bg-gradient-to-r from-gold-500/10 to-transparent'
                    : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
                      option.highlight
                        ? 'bg-gold-500 text-black'
                        : 'bg-bb-card text-gold-500'
                    }`}>
                      {option.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-white">
                          {option.title}
                        </h3>
                        {option.highlight && (
                          <span className="px-2 py-0.5 bg-gold-500 text-black text-xs font-bold rounded">
                            POPULAR
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gold-500 mb-2">{option.subtitle}</p>
                      <p className="text-sm text-gray-400">{option.description}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-lg font-bold text-white">{option.price}</span>
                      <ArrowRight className="w-5 h-5 text-gray-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Help text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Not sure which is right for you?{' '}
            <Link href="/start/shooting" className="text-gold-500 hover:underline">
              Start with the Shooting Evaluation
            </Link>
            {' '}— you can always upgrade later.
          </p>
        </div>
      </div>
    </main>
  );
}

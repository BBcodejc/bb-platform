'use client';

import { CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function TobiasPreGamePage() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const sections = [
    {
      id: 'calibration',
      title: '+3 CALIBRATION',
      subtitle: '5 Sections',
      items: [
        { id: 'cal-1', text: 'Catch & Shoot' },
        { id: 'cal-2', text: 'Jab into Shot' },
        { id: 'cal-3', text: 'One Dribble Step Back' },
        { id: 'cal-4', text: 'Pump Fake → Slide Dribble' },
        { id: 'cal-5', text: 'Pump Fake → Fly By' },
      ],
      rules: [
        'Left / Right miss = 0',
        'Back rim miss = Neutral',
        'Make = +1',
      ],
      note: null,
    },
    {
      id: 'velocity',
      title: 'VELOCITY RESET',
      subtitle: 'Coming Back Around — All 5 Sections',
      items: [
        { id: 'vel-1', text: 'Fast' },
        { id: 'vel-2', text: 'Moderate' },
        { id: 'vel-3', text: 'Slower Controlled' },
      ],
      passer: [
        'Change pass height',
        'Change pass location',
      ],
      variations: ['Dip', 'No Dip', 'Large Dip', 'Single Arm Catch'],
      note: null,
    },
    {
      id: 'post',
      title: 'POST FADE SERIES',
      subtitle: 'Above Block',
      items: [
        { id: 'post-1', text: 'Right Shoulder Fades' },
        { id: 'post-2', text: 'Left Shoulder Fades' },
      ],
      variations: ['Post Fade', 'Step Back → Fade', 'Pump Fake → Post Fade'],
      note: null,
    },
  ];

  const totalItems = sections.reduce((sum, s) => sum + s.items.length, 0);
  const completedCount = completed.size;
  const progressPercent = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#141414] to-[#0A0A0A] border-b border-[#1A1A1A]">
        <div className="max-w-2xl mx-auto px-5 pt-6 pb-8">
          <Link
            href="/elite/tobias-harris"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm mb-6 transition-colors"
          >
            ← Back to Profile
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-[#1A1A1A] border-2 border-gold-500/30 overflow-hidden">
              <Image
                src="/players/tobiasharrislandingpage.webp"
                alt="Tobias Harris"
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Tobias Harris</h1>
              <p className="text-gold-500 text-sm font-medium tracking-wide">PRE-GAME ROUTINE</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-400">February 19, 2026</span>
            <span className="text-[#2A2A2A]">|</span>
            <span className="text-white font-medium">vs Knicks</span>
            <span className="text-[#2A2A2A]">|</span>
            <span className="text-gray-500">Calibration + Rhythm</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="sticky top-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-[#1A1A1A]">
        <div className="max-w-2xl mx-auto px-5 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 uppercase tracking-wider">Session Progress</span>
            <span className="text-sm font-bold text-white">{completedCount}/{totalItems}</span>
          </div>
          <div className="w-full h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-2xl mx-auto px-5 py-8 space-y-8">

        {sections.map((section, sectionIdx) => {
          const sectionCompleted = section.items.every(item => completed.has(item.id));

          return (
            <div
              key={section.id}
              className={cn(
                'rounded-2xl border transition-all',
                sectionCompleted
                  ? 'bg-green-500/5 border-green-500/20'
                  : 'bg-[#111111] border-[#1E1E1E]'
              )}
            >
              {/* Section Header */}
              <div className="px-6 py-5 border-b border-[#1E1E1E]">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gold-500 bg-gold-500/10 px-2.5 py-1 rounded">
                    {sectionIdx + 1}
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">{section.title}</h2>
                    <p className="text-sm text-gray-500">{section.subtitle}</p>
                  </div>
                  {sectionCompleted && (
                    <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
                  )}
                </div>
              </div>

              <div className="px-6 py-5 space-y-5">
                {/* Rules */}
                {'rules' in section && section.rules && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Rules</p>
                    {section.rules.map((rule, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold-500/50" />
                        <span className="text-sm text-gray-300">{rule}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Checklist Items */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Shot Types
                  </p>
                  {section.items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => toggle(item.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left',
                        completed.has(item.id)
                          ? 'bg-green-500/10'
                          : 'bg-[#0A0A0A] hover:bg-[#161616]'
                      )}
                    >
                      {completed.has(item.id) ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      )}
                      <span className={cn(
                        'font-medium text-sm',
                        completed.has(item.id) ? 'text-green-400 line-through' : 'text-white'
                      )}>
                        {item.text}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Passer Instructions */}
                {'passer' in section && section.passer && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Passer</p>
                    {section.passer.map((p, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <ChevronRight className="w-3 h-3 text-gold-500/50" />
                        <span className="text-sm text-gray-400">{p}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Variations */}
                {'variations' in section && section.variations && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Variations</p>
                    <div className="flex flex-wrap gap-2">
                      {section.variations.map((v, i) => (
                        <span
                          key={i}
                          className="text-xs text-gray-400 bg-[#1A1A1A] border border-[#2A2A2A] px-3 py-1.5 rounded-lg"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Note */}
                {section.note && (
                  <div className="pt-2 border-t border-[#1E1E1E]">
                    <p className="text-sm text-gold-500/80 italic">{section.note}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Completion */}
        {progressPercent === 100 && (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-2xl px-8 py-4">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              <span className="text-green-400 font-semibold text-lg">Pre-Game Complete</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-[#1A1A1A] py-6 mt-8">
        <div className="max-w-2xl mx-auto px-5">
          <span className="text-gray-600 text-xs">Basketball Biomechanics</span>
        </div>
      </footer>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { BBHeader } from '@/components/bb-header';
import { BBFooter } from '@/components/bb-footer';

// ─── Scroll Animation Hook ───
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05, rootMargin: '50px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-[600ms] ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ─── System Data ───
const SYSTEMS = [
  {
    id: 'vision',
    label: 'VISION',
    title: 'Where You Look Determines How You Move',
    body: 'The vision system governs everything. Central vs peripheral processing, dorsal visual pathway engagement, and how visual information drives motor decisions in real-time.',
    assess: ['Gaze behavior', 'Visual search strategy', 'Response time patterns', 'Peripheral awareness automation'],
    train: ['Strobe integration', 'Peripheral processing tasks', 'Numbers-based decision systems', 'Reception time/location optimization'],
    hotspot: { cx: 200, cy: 62 },
  },
  {
    id: 'shooting',
    label: 'SHOOTING',
    title: 'Calibration, Not Repetition',
    stat: { from: '18%', to: '47%', note: 'Tobias Harris — In-season. NBA.' },
    body: "We don't fix shooting form. We calibrate the energy transfer system. Miss profile analysis, ball-flight spectrum mapping, deep-distance impulse training, and stress-condition shooting.",
    assess: ['Miss profile (direction + distance)', 'Ball flight spectrum', 'Energy transfer patterns', 'Stress-condition shooting performance'],
    train: ['Back-rim protocol', 'Deep distance calibration line', 'Ball flight spectrum training', 'Oversized ball integration', 'Constraint stacking', 'Pre-game calibration routines'],
    hotspot: { cx: 130, cy: 105 },
  },
  {
    id: 'ball',
    label: 'BALL MANIPULATION',
    title: 'Three Numbers That Control Everything',
    body: "Reception Time (RT), Reception Location (RL), and Dribble Tempo (DT) — these three variables define elite ball handling. It's not about flashy moves. It's about controlling when you receive the ball, where you receive it, and the rhythm you impose on the defense.",
    assess: ['RT/RL/DT baselines', 'Ball height modulation', 'Ball force modulation', 'Ball width modulation', 'Same-side mastery'],
    train: ['5x3x4 exploration matrix', 'Balloon-based coordination', 'Same-side dominance protocols', 'Cadence change drills'],
    hotspot: { cx: 290, cy: 235 },
  },
  {
    id: 'movement',
    label: 'MOVEMENT',
    title: 'The Foundation Everything Else Is Built On',
    body: "Full foot contact is the #1 attractor in the BB system. When players land midfoot, they create injury risk and limit fluidity. When they land full foot, everything opens up — deceleration, direction change, explosion.",
    assess: ['Foot contact patterns', 'Trunk rotation quality', 'Deceleration mechanics', 'Dorsiflexion range', 'Hip internal/external rotation', 'Postural bandwidth', 'Stance width transitions'],
    train: ['Dowel corrections', 'Full-foot pattern drills', 'Movement progressions (base → ball → hill → overhead → shoulder)', 'Hip band protocols', 'Balloon breathing', 'Constraint-based movement tasks'],
    hotspot: { cx: 230, cy: 395 },
  },
];

const CASCADE_STEPS = [
  'Poor Trunk Rotation',
  'Bad Reception Location',
  'Eyes Down',
  'Visual Processing Destroyed',
  'Bad Decisions',
];

// ─── Page Component ───
export default function SystemPage() {
  const [activeSystem, setActiveSystem] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedPath, setExpandedPath] = useState<number | null>(null);
  const [leadForm, setLeadForm] = useState({ name: '', email: '', role: '' });
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadSubmitting, setLeadSubmitting] = useState(false);

  // Cascade animation
  const cascadeRef = useRef<HTMLDivElement>(null);
  const [cascadeVisible, setCascadeVisible] = useState(false);

  useEffect(() => {
    const el = cascadeRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setCascadeVisible(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleSystemClick = useCallback((id: string) => {
    if (activeSystem === id) {
      setActiveSystem(null);
      setDrawerOpen(false);
    } else {
      setActiveSystem(id);
      setDrawerOpen(true);
    }
  }, [activeSystem]);

  const closeDrawer = () => {
    setDrawerOpen(false);
    setActiveSystem(null);
  };

  const activeData = SYSTEMS.find((s) => s.id === activeSystem);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.email) return;
    setLeadSubmitting(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...leadForm, source: 'system-page-pdf' }),
      });
      setLeadSubmitted(true);
    } catch {
      setLeadSubmitted(true);
    }
    setLeadSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#0A1628]">
      <BBHeader />

      {/* ═══ SECTION 1: HERO ═══ */}
      <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        {/* Gold top line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4A843] to-transparent" />

        <div className="max-w-[1200px] mx-auto text-center pt-20">
          <p className="text-[#D4A843] text-[11px] sm:text-[13px] font-bold tracking-[0.3em] uppercase mb-6 animate-fade-in">
            THE BB OPERATING SYSTEM
          </p>

          <h1 className="text-[40px] sm:text-[56px] md:text-[72px] font-black text-[#F9FAFB] leading-[0.95] tracking-tight mb-6 animate-slide-up" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
            We Don&apos;t Fix Players.<br />
            <span className="text-[#D4A843]">We Calibrate Systems.</span>
          </h1>

          <p className="text-[#9CA3AF] text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.35s', animationFillMode: 'both' }}>
            Four integrated systems. 20+ years of research. A method built on how the body actually learns — not how coaches think it should look.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.55s', animationFillMode: 'both' }}>
            <Link
              href="/inquiry"
              className="px-8 py-3.5 bg-[#D4A843] text-[#0A1628] font-bold text-sm tracking-wider rounded-md hover:bg-[#E8C65A] transition-colors"
            >
              I&apos;M A PLAYER
            </Link>
            <Link
              href="/inquiry"
              className="px-8 py-3.5 border-2 border-[#D4A843] text-[#D4A843] font-bold text-sm tracking-wider rounded-md hover:bg-[#D4A843]/10 transition-colors"
            >
              I&apos;M AN ORGANIZATION
            </Link>
          </div>
        </div>

        {/* Scroll chevron */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ═══ SECTION 2: INTERACTIVE SILHOUETTE ═══ */}
      <section id="systems" className="relative bg-[#111827] py-20 sm:py-[120px] px-4 overflow-hidden">
        <div className="max-w-[1200px] mx-auto">
          <Reveal>
            <p className="text-[#D4A843] text-[11px] sm:text-[13px] font-bold tracking-[0.3em] uppercase mb-4 text-center">
              THE BB LENS
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="text-[36px] sm:text-[48px] md:text-[56px] font-black text-[#F9FAFB] text-center tracking-tight mb-12 sm:mb-16">
              Four Integrated Systems.
            </h2>
          </Reveal>

          <div className="relative flex flex-col lg:flex-row items-center justify-center gap-8">
            {/* SVG Silhouette */}
            <div className="relative w-full max-w-[400px] mx-auto lg:mx-0">
              <svg viewBox="0 0 400 460" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
                {/* Player silhouette - mid-crossover stance */}
                <g
                  className="transition-opacity duration-300"
                  style={{ opacity: activeSystem ? 0.15 : 1 }}
                >
                  {/* Head */}
                  <ellipse cx="200" cy="52" rx="28" ry="32" fill="#1F2937" stroke="#374151" strokeWidth="1" />
                  {/* Neck */}
                  <rect x="190" y="82" width="20" height="16" rx="4" fill="#1F2937" />
                  {/* Torso */}
                  <path d="M160 98 L240 98 L245 200 L155 200 Z" fill="#1F2937" stroke="#374151" strokeWidth="1" />
                  {/* Left arm (reaching for ball) */}
                  <path d="M160 105 L110 140 L90 180 L100 230 L115 240" fill="none" stroke="#1F2937" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Right arm (above, shooting/guide) */}
                  <path d="M240 105 L270 90 L280 60 L270 45" fill="none" stroke="#1F2937" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Right hand */}
                  <circle cx="268" cy="42" r="10" fill="#1F2937" />
                  {/* Left hand near ball */}
                  <circle cx="118" cy="245" r="10" fill="#1F2937" />
                  {/* Ball */}
                  <circle cx="120" cy="260" r="22" fill="none" stroke="#374151" strokeWidth="1.5" strokeDasharray="4 3" />
                  {/* Hips */}
                  <path d="M165 200 L235 200 L240 220 L160 220 Z" fill="#1F2937" />
                  {/* Left leg (crossing over) */}
                  <path d="M175 220 L150 290 L140 360 L160 400 L175 420" fill="none" stroke="#1F2937" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Right leg (planted) */}
                  <path d="M215 220 L240 300 L250 370 L260 400 L275 420" fill="none" stroke="#1F2937" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Feet */}
                  <ellipse cx="175" cy="428" rx="22" ry="8" fill="#1F2937" />
                  <ellipse cx="278" cy="428" rx="22" ry="8" fill="#1F2937" />
                </g>

                {/* Active region highlights */}
                {activeSystem === 'vision' && (
                  <ellipse cx="200" cy="52" rx="38" ry="42" fill="#D4A843" fillOpacity="0.15" stroke="#D4A843" strokeWidth="1.5" className="animate-pulse" />
                )}
                {activeSystem === 'shooting' && (
                  <circle cx="268" cy="42" r="35" fill="#D4A843" fillOpacity="0.15" stroke="#D4A843" strokeWidth="1.5" className="animate-pulse" />
                )}
                {activeSystem === 'ball' && (
                  <circle cx="120" cy="255" r="40" fill="#D4A843" fillOpacity="0.15" stroke="#D4A843" strokeWidth="1.5" className="animate-pulse" />
                )}
                {activeSystem === 'movement' && (
                  <ellipse cx="225" cy="400" rx="80" ry="50" fill="#D4A843" fillOpacity="0.12" stroke="#D4A843" strokeWidth="1.5" className="animate-pulse" />
                )}

                {/* Hotspot dots */}
                {SYSTEMS.map((sys) => (
                  <g key={sys.id} className="cursor-pointer" onClick={() => handleSystemClick(sys.id)}>
                    {/* Pulse ring */}
                    <circle
                      cx={sys.hotspot.cx}
                      cy={sys.hotspot.cy}
                      r="14"
                      fill="none"
                      stroke="#D4A843"
                      strokeWidth="1.5"
                      opacity={activeSystem === sys.id ? 1 : 0.6}
                      className={activeSystem === sys.id ? '' : 'animate-ping'}
                      style={{ transformOrigin: `${sys.hotspot.cx}px ${sys.hotspot.cy}px`, animationDuration: '2s' }}
                    />
                    {/* Center dot */}
                    <circle
                      cx={sys.hotspot.cx}
                      cy={sys.hotspot.cy}
                      r="6"
                      fill={activeSystem === sys.id ? '#D4A843' : '#D4A843'}
                      fillOpacity={activeSystem === sys.id ? 1 : 0.8}
                      className="transition-all duration-300"
                    />
                    {/* Label */}
                    <text
                      x={sys.hotspot.cx}
                      y={sys.hotspot.cy - 22}
                      textAnchor="middle"
                      fill={activeSystem === sys.id ? '#D4A843' : '#9CA3AF'}
                      fontSize="9"
                      fontWeight="700"
                      letterSpacing="0.1em"
                      className="transition-colors duration-300 select-none"
                    >
                      {sys.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Mobile Accordion (below silhouette) */}
            <div className="w-full lg:hidden space-y-3">
              {SYSTEMS.map((sys) => (
                <div key={sys.id} className="border border-[#374151] rounded-xl overflow-hidden">
                  <button
                    onClick={() => handleSystemClick(sys.id)}
                    className={`w-full px-5 py-4 flex items-center justify-between text-left transition-colors ${activeSystem === sys.id ? 'bg-[#D4A843]/10 border-[#D4A843]' : 'bg-[#1F2937]'}`}
                  >
                    <span className={`text-sm font-bold tracking-wider ${activeSystem === sys.id ? 'text-[#D4A843]' : 'text-[#9CA3AF]'}`}>
                      {sys.label}
                    </span>
                    <svg className={`w-4 h-4 transition-transform duration-300 ${activeSystem === sys.id ? 'rotate-180 text-[#D4A843]' : 'text-[#9CA3AF]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div
                    className="transition-all duration-300 ease-in-out overflow-hidden"
                    style={{ maxHeight: activeSystem === sys.id ? '600px' : '0' }}
                  >
                    <SystemPanel data={sys} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Drawer */}
        <div
          className={`hidden lg:block fixed top-0 right-0 h-full w-[450px] bg-[#111827] border-l border-[#374151] z-50 transition-transform duration-300 ease-in-out shadow-2xl ${drawerOpen && activeData ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {activeData && (
            <div className="h-full overflow-y-auto">
              <div className="sticky top-0 bg-[#111827] border-b border-[#374151] px-6 py-4 flex items-center justify-between z-10">
                <p className="text-[#D4A843] text-[11px] font-bold tracking-[0.3em]">{activeData.label} SYSTEM</p>
                <button onClick={closeDrawer} className="text-[#9CA3AF] hover:text-white p-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <SystemPanel data={activeData} />
            </div>
          )}
        </div>

        {/* Drawer backdrop */}
        {drawerOpen && (
          <div className="hidden lg:block fixed inset-0 z-40" onClick={closeDrawer} />
        )}
      </section>

      {/* ═══ SECTION 3: THE CASCADE ═══ */}
      <section id="cascade" className="bg-[#0A1628] py-20 sm:py-[120px] px-4">
        <div className="max-w-[1200px] mx-auto">
          <Reveal>
            <p className="text-[#D4A843] text-[11px] sm:text-[13px] font-bold tracking-[0.3em] uppercase mb-4 text-center">
              THE BB DIFFERENCE
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="text-[36px] sm:text-[48px] font-black text-[#F9FAFB] text-center tracking-tight mb-16">
              We Fix the Root. Not the Symptom.
            </h2>
          </Reveal>

          {/* Cascade flow */}
          <div ref={cascadeRef} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-0 mb-12">
            {CASCADE_STEPS.map((step, i) => (
              <div
                key={step}
                className="flex items-center transition-all duration-500"
                style={{
                  opacity: cascadeVisible ? 1 : 0,
                  transform: cascadeVisible ? 'translateX(0)' : 'translateX(-30px)',
                  transitionDelay: `${i * 200}ms`,
                }}
              >
                <div className={`px-4 py-3 rounded-lg border text-center min-w-[140px] ${
                  i === CASCADE_STEPS.length - 1
                    ? 'bg-red-500/10 border-red-500/40 text-red-400'
                    : i === 0
                    ? 'bg-[#D4A843]/10 border-[#D4A843]/40 text-[#D4A843]'
                    : 'bg-[#1F2937] border-[#374151] text-[#9CA3AF]'
                }`}>
                  <p className="text-xs sm:text-sm font-semibold">{step}</p>
                </div>
                {i < CASCADE_STEPS.length - 1 && (
                  <svg className="w-6 h-6 text-[#374151] shrink-0 hidden sm:block mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
                {i < CASCADE_STEPS.length - 1 && (
                  <svg className="w-5 h-5 text-[#374151] shrink-0 sm:hidden rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>

          <Reveal delay={200}>
            <p className="text-center text-[#9CA3AF] text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
              Traditional coaching sees a <span className="text-white font-semibold">shooting problem</span>. BB sees a <span className="text-[#D4A843] font-semibold">movement cascade</span> that started at the trunk.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ SECTION 4: CASE STUDIES ═══ */}
      <section id="proof" className="bg-[#111827] py-20 sm:py-[120px] px-4">
        <div className="max-w-[1200px] mx-auto">
          <Reveal>
            <p className="text-[#D4A843] text-[11px] sm:text-[13px] font-bold tracking-[0.3em] uppercase mb-4 text-center">
              PROOF OF CONCEPT
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="text-[36px] sm:text-[48px] font-black text-[#F9FAFB] text-center tracking-tight mb-12 sm:mb-16">
              In-Season Transformations
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Tobias Harris */}
            <Reveal delay={150}>
              <div className="bg-[#1F2937] border border-[#374151] rounded-2xl p-8 sm:p-10">
                <p className="text-[11px] font-bold tracking-[0.3em] text-[#9CA3AF] uppercase mb-6">Tobias Harris</p>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-[56px] sm:text-[72px] font-black text-white leading-none">18%</span>
                  <span className="text-[#D4A843] text-2xl font-bold">→</span>
                  <span className="text-[56px] sm:text-[72px] font-black text-[#22C55E] leading-none">47%</span>
                </div>
                <p className="text-[#9CA3AF] text-sm mb-6">+29 points &middot; In-Season &middot; NBA</p>
                <div className="border-t border-[#374151] pt-5">
                  <p className="text-[#9CA3AF] text-base italic leading-relaxed">
                    &ldquo;Coach Tempesta&apos;s brain is like AI.&rdquo;
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Paul Reed */}
            <Reveal delay={250}>
              <div className="bg-[#1F2937] border border-[#374151] rounded-2xl p-8 sm:p-10">
                <p className="text-[11px] font-bold tracking-[0.3em] text-[#9CA3AF] uppercase mb-6">Paul Reed</p>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-[56px] sm:text-[72px] font-black text-white leading-none">15%</span>
                  <span className="text-[#D4A843] text-2xl font-bold">→</span>
                  <span className="text-[56px] sm:text-[72px] font-black text-[#22C55E] leading-none">40%</span>
                </div>
                <p className="text-[#9CA3AF] text-sm mb-6">+25 points &middot; 5 Months</p>
                <div className="border-t border-[#374151] pt-5">
                  <p className="text-[#9CA3AF] text-base italic leading-relaxed">
                    &ldquo;Nothing wrong with your shot — we just calibrated the system.&rdquo;
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Lowry testimonial */}
          <Reveal delay={350}>
            <div className="bg-[#0A1628] border border-[#374151] rounded-xl px-8 py-6 text-center">
              <p className="text-[#9CA3AF] text-base italic mb-2">
                &ldquo;Coach Tommy is the smartest basketball coach I&apos;ve ever been around.&rdquo;
              </p>
              <p className="text-[#D4A843] text-xs font-bold tracking-[0.2em]">KYLE LOWRY</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ SECTION 5: THREE PATHS ═══ */}
      <section id="paths" className="bg-[#0A1628] py-20 sm:py-[120px] px-4">
        <div className="max-w-[1200px] mx-auto">
          <Reveal>
            <p className="text-[#D4A843] text-[11px] sm:text-[13px] font-bold tracking-[0.3em] uppercase mb-4 text-center">
              HOW WE WORK
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="text-[36px] sm:text-[48px] font-black text-[#F9FAFB] text-center tracking-tight mb-12 sm:mb-16">
              Three Ways In.
            </h2>
          </Reveal>

          <div className="max-w-3xl mx-auto space-y-4">
            {/* Path 1: Players */}
            <Reveal delay={150}>
              <PathCard
                number="01"
                title="FOR PLAYERS"
                expanded={expandedPath === 0}
                onToggle={() => setExpandedPath(expandedPath === 0 ? null : 0)}
              >
                <p className="text-[#9CA3AF] text-base mb-6 leading-relaxed">
                  Film Analysis → Full Assessment → Custom Programming → Weekly Testing
                </p>
                <Link
                  href="/inquiry"
                  className="inline-block px-6 py-2.5 bg-[#D4A843] text-[#0A1628] font-bold text-sm rounded-md hover:bg-[#E8C65A] transition-colors"
                >
                  Start Your Assessment
                </Link>
              </PathCard>
            </Reveal>

            {/* Path 2: Coaches */}
            <Reveal delay={200}>
              <PathCard
                number="02"
                title="FOR COACHES"
                expanded={expandedPath === 1}
                onToggle={() => setExpandedPath(expandedPath === 1 ? null : 1)}
              >
                <p className="text-[#9CA3AF] text-base mb-6 leading-relaxed">
                  Learn the BB Lens. Constraints-based cueing. Assessment-driven programming.
                </p>
                <Link
                  href="/inquiry"
                  className="inline-block px-6 py-2.5 border-2 border-[#D4A843] text-[#D4A843] font-bold text-sm rounded-md hover:bg-[#D4A843]/10 transition-colors"
                >
                  Learn More
                </Link>
              </PathCard>
            </Reveal>

            {/* Path 3: Organizations */}
            <Reveal delay={250}>
              <PathCard
                number="03"
                title="FOR ORGANIZATIONS"
                expanded={expandedPath === 2}
                onToggle={() => setExpandedPath(expandedPath === 2 ? null : 2)}
              >
                <div className="space-y-3 mb-6">
                  {[
                    ['Shooting Calibration Sprint', '2-4 weeks'],
                    ['Movement System Integration', '4-6 weeks'],
                    ['Coaching Workshop', '2-3 days'],
                    ['Full System Implementation', 'Season-long'],
                  ].map(([name, duration]) => (
                    <div key={name} className="flex items-center justify-between py-2 border-b border-[#374151]/50">
                      <span className="text-[#F9FAFB] text-sm font-medium">{name}</span>
                      <span className="text-[#9CA3AF] text-xs">{duration}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/inquiry"
                  className="inline-block px-6 py-2.5 border-2 border-[#D4A843] text-[#D4A843] font-bold text-sm rounded-md hover:bg-[#D4A843]/10 transition-colors"
                >
                  Request Info
                </Link>
              </PathCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 6: THE SCIENCE ═══ */}
      <section id="science" className="bg-[#111827] py-20 sm:py-[120px] px-4">
        <div className="max-w-[1200px] mx-auto text-center">
          <Reveal>
            <p className="text-[#D4A843] text-[11px] sm:text-[13px] font-bold tracking-[0.3em] uppercase mb-4">
              BUILT ON SCIENCE
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="text-[36px] sm:text-[48px] font-black text-[#F9FAFB] tracking-tight mb-12">
              Not Opinions.
            </h2>
          </Reveal>

          <Reveal delay={200}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-16">
              {[
                "Bernstein's Degrees of Freedom",
                "Gibson's Ecological Dynamics",
                "Bosch's Movement Science",
              ].map((pillar) => (
                <div key={pillar} className="px-5 py-3 bg-[#1F2937] border border-[#374151] rounded-lg">
                  <p className="text-[#F9FAFB] text-sm font-semibold">{pillar}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={300}>
            <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
              {[
                ['20+', 'Years Research'],
                ['6', 'NBA Players'],
                ['4', 'Integrated Systems'],
              ].map(([num, label]) => (
                <div key={label}>
                  <p className="text-[48px] sm:text-[64px] font-black text-[#F9FAFB] leading-none">{num}</p>
                  <p className="text-[#9CA3AF] text-xs sm:text-sm mt-1">{label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ SECTION 7: LEAD MAGNET ═══ */}
      <section id="download" className="bg-[#0A1628] py-20 sm:py-[120px] px-4">
        <div className="max-w-xl mx-auto text-center">
          <Reveal>
            <h2 className="text-[32px] sm:text-[40px] font-black text-[#F9FAFB] tracking-tight mb-4">
              Download the BB System Overview
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-[#9CA3AF] text-base mb-10 leading-relaxed">
              A breakdown of the four systems, how they connect, and why traditional player development is broken.
            </p>
          </Reveal>

          {leadSubmitted ? (
            <Reveal>
              <div className="bg-[#22C55E]/10 border border-[#22C55E]/40 rounded-xl p-8">
                <p className="text-[#22C55E] text-lg font-bold mb-2">You&apos;re in.</p>
                <p className="text-[#9CA3AF] text-sm">Check your email for the BB System Overview PDF.</p>
              </div>
            </Reveal>
          ) : (
            <Reveal delay={200}>
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={leadForm.name}
                  onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                  required
                  className="w-full h-12 px-5 rounded-lg border border-[#374151] bg-[#1F2937] text-white placeholder:text-[#6B7280] focus:outline-none focus:border-[#D4A843] transition-colors"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={leadForm.email}
                  onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                  required
                  className="w-full h-12 px-5 rounded-lg border border-[#374151] bg-[#1F2937] text-white placeholder:text-[#6B7280] focus:outline-none focus:border-[#D4A843] transition-colors"
                />
                <select
                  value={leadForm.role}
                  onChange={(e) => setLeadForm({ ...leadForm, role: e.target.value })}
                  className="w-full h-12 px-5 rounded-lg border border-[#374151] bg-[#1F2937] text-white focus:outline-none focus:border-[#D4A843] transition-colors"
                >
                  <option value="">I am a...</option>
                  <option value="player">Player</option>
                  <option value="coach">Coach</option>
                  <option value="organization">Organization</option>
                  <option value="other">Other</option>
                </select>
                <button
                  type="submit"
                  disabled={leadSubmitting}
                  className="w-full h-12 bg-[#D4A843] text-[#0A1628] font-bold text-sm tracking-wider rounded-lg hover:bg-[#E8C65A] transition-colors disabled:opacity-50"
                >
                  {leadSubmitting ? 'SENDING...' : 'SEND ME THE PDF'}
                </button>
              </form>
            </Reveal>
          )}
        </div>
      </section>

      {/* ═══ SECTION 8: PRE-FOOTER + FOOTER ═══ */}
      <section className="bg-[#0A1628] border-t border-[#374151] py-16 px-4">
        <div className="max-w-[1200px] mx-auto text-center">
          <Reveal>
            <h3 className="text-[28px] sm:text-[36px] font-black text-[#F9FAFB] tracking-tight mb-4">
              LET&apos;S BUILD SOMETHING.
            </h3>
          </Reveal>
          <Reveal delay={100}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-[#9CA3AF] text-sm mb-8">
              <span>@basketballbiomechanics</span>
              <span className="hidden sm:inline">&middot;</span>
              <span>bbcodejc@gmail.com</span>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              {['Methods over Drills.', 'Assessment over Hope.', 'Adaptation over Repetition.'].map((p) => (
                <p key={p} className="text-[#D4A843] text-xs sm:text-sm font-bold tracking-wider">{p}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <BBFooter />
    </div>
  );
}

// ─── System Panel Content ───
function SystemPanel({ data }: { data: typeof SYSTEMS[number] }) {
  return (
    <div className="px-6 py-6 space-y-6">
      <h3 className="text-xl sm:text-2xl font-black text-[#F9FAFB] leading-tight">{data.title}</h3>

      {data.stat && (
        <div className="bg-[#0A1628] rounded-lg p-4 border border-[#374151]">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{data.stat.from}</span>
            <span className="text-[#D4A843] font-bold">→</span>
            <span className="text-3xl font-black text-[#22C55E]">{data.stat.to}</span>
          </div>
          <p className="text-[#9CA3AF] text-xs mt-1">{data.stat.note}</p>
        </div>
      )}

      <p className="text-[#9CA3AF] text-[15px] leading-relaxed">{data.body}</p>

      <div>
        <p className="text-[#D4A843] text-[11px] font-bold tracking-[0.2em] uppercase mb-3">What We Assess</p>
        <ul className="space-y-2">
          {data.assess.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-[#D4A843] mt-1.5 text-[8px]">●</span>
              <span className="text-[#F9FAFB] text-sm">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-[#D4A843] text-[11px] font-bold tracking-[0.2em] uppercase mb-3">How We Train</p>
        <ul className="space-y-2">
          {data.train.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-[#22C55E] mt-1.5 text-[8px]">●</span>
              <span className="text-[#F9FAFB] text-sm">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Video placeholder */}
      <div className="bg-[#0A1628] border border-dashed border-[#374151] rounded-lg p-8 text-center">
        <svg className="w-8 h-8 text-[#374151] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-[#374151] text-xs">Video Coming Soon</p>
      </div>
    </div>
  );
}

// ─── Path Accordion Card ───
function PathCard({ number, title, expanded, onToggle, children }: {
  number: string;
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={`border rounded-xl overflow-hidden transition-colors duration-300 ${expanded ? 'border-[#D4A843]/50 bg-[#1F2937]' : 'border-[#374151] bg-[#1F2937]/50'}`}>
      <button
        onClick={onToggle}
        className="w-full px-6 sm:px-8 py-5 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-4">
          <span className="text-[#D4A843] text-xs font-bold">{number}</span>
          <span className={`text-sm sm:text-base font-bold tracking-wider transition-colors ${expanded ? 'text-[#F9FAFB]' : 'text-[#9CA3AF]'}`}>
            {title}
          </span>
        </div>
        <svg className={`w-5 h-5 transition-transform duration-300 ${expanded ? 'rotate-180 text-[#D4A843]' : 'text-[#9CA3AF]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className="transition-all duration-300 ease-in-out overflow-hidden"
        style={{ maxHeight: expanded ? '500px' : '0' }}
      >
        <div className="px-6 sm:px-8 pb-6">{children}</div>
      </div>
    </div>
  );
}

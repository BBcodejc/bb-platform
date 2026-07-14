'use client';

import { useEffect, useRef, useState } from 'react';

const ENROLL_URL = 'https://bbcode.thinkific.com/enroll/3585033';

// ─── Motion helpers ──────────────────────────────────────────────────────────

/** Scroll reveal. The hidden state is applied by JS only, so content is fully
    visible with JavaScript disabled. Animates once. */
function Reveal({
  children,
  delay = 0,
  group = false,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  group?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce && !group) el.classList.add('mc-reveal');
    if (group) el.classList.add('mc-reveal-group');
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          el.classList.add('is-in');
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [group]);
  return (
    <div ref={ref} className={className} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}

/** Count-up stat. Server-renders the final value so numbers are visible
    statically with JavaScript disabled; animates once on first view. */
function CountUp({ from = 0, to, suffix = '%' }: { from?: number; to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const duration = 1200;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = `${Math.round(from + (to - from) * eased)}${suffix}`;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [from, to, suffix]);
  return (
    <span ref={ref}>
      {to}
      {suffix}
    </span>
  );
}

// ─── Top bar ─────────────────────────────────────────────────────────────────

function TopBar() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.55);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={`mc-topbar${solid ? ' is-solid' : ''}`}>
      <a href="#hero" className="mc-wordmark">
        BASKETBALL <span>BIOMECHANICS</span>
      </a>
      <a href={ENROLL_URL} className="mc-topbar-cta">
        Start Calibrating
      </a>
    </header>
  );
}

// ─── Shared bits ─────────────────────────────────────────────────────────────

function Kicker({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return <p className={`mc-kicker${center ? ' mc-kicker--center' : ''}`}>{children}</p>;
}

function CtaBlock({ label }: { label: string }) {
  return (
    <div className="mc-cta-block">
      <a href={ENROLL_URL} className="mc-cta">
        {label}
      </a>
      <p className="mc-microcopy">$297. Lifetime access. Day 14 guarantee.</p>
    </div>
  );
}

// ─── Lens diagram ────────────────────────────────────────────────────────────

const LENS_NODES = ['Perception', 'Rhythm', 'Timing', 'Energy', 'Adaptability'];

function LensDiagram() {
  return (
    <svg
      className="mc-diagram"
      viewBox="0 0 440 340"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Diagram of the shooting system: Perception, Rhythm, Timing, Energy, and Adaptability converging into The Shot"
    >
      {LENS_NODES.map((label, i) => {
        const y = 42 + i * 64;
        return (
          <g key={label}>
            <line x1={130} y1={y} x2={344} y2={170} />
            <circle cx={118} cy={y} r={5} />
            <text x={104} y={y + 4} textAnchor="end">
              {label}
            </text>
          </g>
        );
      })}
      <circle className="shot-node" cx={352} cy={170} r={7} />
      <text className="shot-label" x={368} y={175}>
        The Shot
      </text>
    </svg>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────

const READOUT = [
  {
    name: 'Tyler Burton',
    badge: 'GRIZZLIES',
    stat: '29% to 44% in under two weeks',
    quote: '“My shot never has felt better.”',
  },
  { name: 'Tyler Perkins', badge: 'VILLANOVA', stat: '20% to 40%, in season', quote: '' },
  { name: 'Dominick Stewart', badge: 'PENN STATE', stat: '32% to 42% in three weeks', quote: '' },
  {
    name: 'Matisse Thybulle',
    badge: 'TRAIL BLAZERS',
    stat: 'finished the 2026 season shooting 40%',
    quote: '',
  },
  {
    name: 'Trey Drexler',
    badge: 'HS PG, D1 COMMIT',
    stat: '47% from three, 26.5 PPG, 90% FT',
    quote: '“Calibration changed my game.”',
  },
];

const PROBLEMS = [
  {
    num: '01',
    title: 'They chase volume.',
    body: 'Five hundred makes from a spot proves you can make that shot, from that spot, at that speed, with nobody near you. The game never asks for that shot. Volume without variation grooves a shot the game will never let you take.',
  },
  {
    num: '02',
    title: 'They obsess over form.',
    body: 'Look at the best shooters alive. Elbows in, elbows out, high releases, low releases. Elite form varies enormously. What does not vary is calibration. And the moment you start thinking about your body mid shot, your timing degrades. That is not a character flaw. That is how the motor system works under conscious interference.',
  },
  {
    num: '03',
    title: 'They train in sterile environments.',
    body: 'Same ball. Same arc. Same rhythm. Same spot. Nothing challenges perception, timing, or distance control, so nothing adapts. The gym gets easier while the game stays hard.',
  },
  {
    num: '04',
    title: 'They never identify what is actually limiting the shot.',
    body: 'Random drills are prescription without diagnosis. If you do not know whether the limit is distance control, timing, visual calibration, or energy management, you are guessing. Most careers plateau on a guess.',
  },
];

const PHASES = [
  {
    days: 'Days 1 to 3',
    title: 'Deep Distance Calibration',
    body: 'Your system learns distance control from ranges that force adaptation. By day three, the three point line starts to feel like a free throw.',
  },
  {
    days: 'Days 4 to 6',
    title: 'Movement Integration',
    body: 'Calibration meets motion. Off the hop, off the one two, on the move, so the adaptation transfers to game conditions instead of staying on a spot.',
  },
  {
    days: 'Days 7 to 10',
    title: 'Precision From Deep',
    body: 'Precision targeting beyond the arc. Range stops being a limit and becomes a comfort zone.',
  },
  {
    days: 'Days 11 to 14',
    title: 'The Test',
    body: 'You test your new calibration against your Day 1 baseline. Your system has adapted, and the numbers show it.',
  },
];

const KEEPS = [
  'The calibration protocols: distance, ball flight, and energy control work you can return to for the rest of your career',
  'Constraint based shooting methods that keep your system adapting instead of plateauing',
  'Visual calibration methods that sharpen target acquisition',
  'Oversized ball and contrast concepts that magnify feedback and remove room for error',
  'Rhythm and timing work so your shot survives changing speeds and windows',
  'The miss profile framework: learn to read your own misses the way a BB coach reads film',
  'Pre game protocols to lock in calibration on game day, and off day modules to maintain it',
  'Implementation guidance for players, parents, and coaches, including how to scale everything by age and level',
];

const BEFORE = [
  'Endless reps with inconsistent results',
  'Guessing at what is wrong after every cold night',
  'A shot that works in the gym and disappears in games',
  'Form tips from every direction, none of them sticking',
  'Confidence that depends on the last make',
];

const AFTER = [
  'A clear process: you know what to run, why, and what your misses mean',
  'A calibrated feel for the target from anywhere in your range',
  'A shot that adapts to distance, rhythm, fatigue, and pressure',
  'A framework that scales with you for the rest of your career',
  'Confidence built on measurement, not mood',
];

const QUOTES = [
  { quote: '“My shot feels effortless.”', who: 'PAUL REED · NBA' },
  { quote: '“My shot never has felt better.”', who: 'TYLER BURTON · GRIZZLIES' },
  { quote: '“Calibration changed my game.”', who: 'TREY DREXLER · HS PG, D1 COMMIT' },
  {
    quote: '“Applying BB methods was the best basketball session of my life.”',
    who: 'DYLAN CARDWELL · KINGS',
  },
  {
    quote: '“Calibration has evolved our program and we shot the best in years on the methods.”',
    who: 'HIGH SCHOOL COACH',
  },
];

/* PENDING NAME-USE CLEARANCE, do not render:
   - "His brain is like AI." Tobias Harris
   - "No one's ever broken down film this way in the NBA." OG Anunoby
   - "No one's ever broken down or analyzed film like this for me." Kyle Lowry
   - "You're the smartest basketball coach I've ever been around." Tyler Burton */

const MASTERCLASS_QUOTES = [
  {
    quote:
      '“Even after the first day of calibration my shot felt like a laser at team practice.”',
    who: 'JALEN E. · PLAYER',
    note: '',
  },
  {
    quote:
      '“Range is definitely increasing. Misses are more consistent. We are completely bought in.”',
    who: 'TONY B. · ATHLETIC DIRECTOR / HS GIRLS BASKETBALL COACH',
    note: '“I know it has already helped.” · After first weekend',
  },
  {
    quote: '“Really loved this product.”',
    who: 'BENEDICT P. · PLAYER',
    note: '',
  },
  {
    quote:
      '“I’m currently on day 6 as a coach. So far we have had great results with ball flights to increase power and accuracy.”',
    who: 'BEN M. · COACH',
    note: '',
  },
  {
    quote:
      '“I did the full protocol over the Christmas break, and I did feel differences when it came to the smoothness of my shot.”',
    who: 'KYLE O. · SEMI-PRO COACH',
    note: '',
  },
];

const FAQS = [
  {
    q: 'Is this for young players?',
    a: 'Yes. Every protocol includes scaling guidance: smaller ball, lower rim, shorter distances. Calibration is built on how the nervous system learns, which is the same at every age. Parents routinely run the protocols with their kids.',
  },
  {
    q: 'Is this for pros?',
    a: 'It was built on pros. The protocols in the masterclass are the same calibration methods BB consults to NBA players in season. The masterclass is the self paced version of that work.',
  },
  {
    q: 'Do I need special equipment?',
    a: 'You need a ball and a hoop. An oversized ball is recommended to run the full protocol stack and is inexpensive. Everything else in the BB toolkit is an optional layer, not a requirement.',
  },
  {
    q: 'How quickly can I use it?',
    a: 'The same day you get access. The protocols are designed to produce a felt difference in the first session and a measured difference by Day 14. They are also in season friendly. Most of our NBA results happened during the season, not the offseason.',
  },
  {
    q: 'What if I am already a good shooter?',
    a: 'Then you are exactly who calibration was built for. Good shooters plateau when practice stops transferring. Calibration raises the ceiling by training adaptability: deeper range, faster windows, unfamiliar rhythms. The pros in our proof stack were already professional shooters. The numbers still moved.',
  },
  {
    q: 'Is this just form shooting?',
    a: 'No. You will never be asked to think about your form. Calibration changes the demands on your system and lets your body reorganize the shot itself. That is the opposite of form shooting, and it is why it works under pressure when form cues fall apart.',
  },
  {
    q: 'How is this different from a normal shooting course?',
    a: 'A normal course gives you drills and opinions about the perfect shot. This gives you protocols: each one has a beginning, a progression, and a test, and each one calibrates a specific part of the system that aims and delivers your shot. It is the difference between collecting drills and owning a method. The proof is in the box scores above.',
  },
];

// ─── FAQ accordion ───────────────────────────────────────────────────────────

function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="mc-faq">
      {FAQS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className={`mc-faq-item${isOpen ? ' is-open' : ''}`}>
            <button
              type="button"
              className="mc-faq-q"
              aria-expanded={isOpen}
              aria-controls={`mc-faq-panel-${i}`}
              id={`mc-faq-button-${i}`}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              {item.q}
              <span className="mc-faq-icon" aria-hidden="true" />
            </button>
            <div
              id={`mc-faq-panel-${i}`}
              role="region"
              aria-labelledby={`mc-faq-button-${i}`}
              hidden={!isOpen}
            >
              <p className="mc-faq-a">{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function MasterclassPage() {
  return (
    <main className="mc-page">
      <TopBar />

      {/* ── 1. Hero ── */}
      <section id="hero" className="mc-hero mc-bg-white">
        <div className="mc-container">
          <Reveal>
            <Kicker center>The Shooting Calibration Masterclass</Kicker>
            <h1 className="mc-h1">
              Nothing is wrong with your shot. It has never been calibrated.
            </h1>
            <p className="mc-hero-sub">
              The exact calibration protocols Basketball Biomechanics runs with NBA players in
              season, when the shots count and the percentages are public. Now self paced, for any
              player, in any gym.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <p className="mc-video-caption">
              Watch this first. Why more reps will not save your shot, and what calibration
              changes.
            </p>
            <div className="mc-video-frame">
              <video controls playsInline preload="metadata" src="/vsl.mp4" />
            </div>
          </Reveal>
          <Reveal delay={200}>
            <a href={ENROLL_URL} className="mc-cta mc-cta--large">
              Start Calibrating Your Shot
            </a>
            <p className="mc-microcopy">$297. Lifetime access. Backed by the Day 14 guarantee.</p>
            <p className="mc-proof-strip">
              <span>OG Anunoby, 2026 NBA Champion</span>
              <span className="tick">·</span>
              <span>Tobias Harris 18% to 47%</span>
              <span className="tick">·</span>
              <span>Paul Reed 15% to 40%</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── 2. Proof ── */}
      <section id="proof" className="mc-section mc-bg-warm" style={{ paddingBottom: 0 }}>
        <div className="mc-container">
          <Reveal>
            <Kicker>Proven In Season</Kicker>
            <h2 className="mc-h2">The results happened in season, on film, in public box scores.</h2>
            <p className="mc-lead">
              Anyone can look good in an empty gym. BB results are measured where they are hardest
              to fake: live NBA seasons, real percentages, real stakes.
            </p>
          </Reveal>
        </div>

        <Reveal>
          <div className="mc-og-panel">
            <div className="mc-container">
              <p className="mc-og-stat">
                <CountUp to={50} />
              </p>
              <p className="mc-og-caps">From Three · 2026 NBA Finals · Champion</p>
              <p className="mc-og-name">OG Anunoby. New York Knicks. 2026 NBA Champion.</p>
              <p className="mc-og-body">
                Shot 50% from three in the NBA Finals while being consulted by BB on shooting
                calibration throughout the season. A career year, finished on the biggest stage in
                basketball.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mc-container" style={{ paddingBottom: '7rem' }}>
          <div className="mc-featured-grid">
            <Reveal>
              <div className="mc-featured-card">
                <p className="mc-featured-stat">
                  18% to{' '}
                  <span className="to">
                    <CountUp from={18} to={47} />
                  </span>
                </p>
                <p className="mc-featured-name">
                  Tobias Harris <span className="mc-badge">NBA</span>
                </p>
                <p className="mc-featured-body">
                  In season. In under 100 days. Without rebuilding his mechanics. The flagship
                  proof that calibration changes shooting while the games are still being played.
                </p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="mc-featured-card">
                <p className="mc-featured-stat">
                  15% to{' '}
                  <span className="to">
                    <CountUp from={15} to={40} />
                  </span>
                </p>
                <p className="mc-featured-name">
                  Paul Reed <span className="mc-badge">NBA</span>
                </p>
                <p className="mc-featured-body">In season. Seven times the makes.</p>
                <p className="mc-featured-quote">{'“My shot feels effortless.”'}</p>
              </div>
            </Reveal>
          </div>

          <Reveal>
            <div className="mc-readout">
              {READOUT.map((row) => (
                <div key={row.name} className="mc-readout-row">
                  <span className="mc-readout-name">{row.name}</span>
                  <span className="mc-badge">{row.badge}</span>
                  <span className="mc-readout-stat">{row.stat}</span>
                  {row.quote ? <span className="mc-readout-quote">{row.quote}</span> : <span />}
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <p className="mc-closer">
              Different levels. Different ages. The same protocols. The same lens you are about to
              learn.
            </p>
            <CtaBlock label="Start Calibrating Your Shot" />
          </Reveal>

          <Reveal>
            <div className="mc-mcquotes-head">
              <Kicker>From The Masterclass</Kicker>
              <h3 className="mc-keep-title">Players and coaches already running the protocols.</h3>
            </div>
            <div className="mc-mcquotes-grid">
              {MASTERCLASS_QUOTES.map((q) => (
                <figure key={q.who} className="mc-mcq">
                  <blockquote>
                    <p>{q.quote}</p>
                  </blockquote>
                  <figcaption>
                    <cite>{q.who}</cite>
                    {q.note ? <span className="mc-mcq-note">{q.note}</span> : null}
                  </figcaption>
                </figure>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 3. Problem ── */}
      <section id="problem" className="mc-section mc-bg-white">
        <div className="mc-container">
          <Reveal>
            <Kicker>Why Shooters Plateau</Kicker>
            <h2 className="mc-h2">You do not have a rep problem. You have a calibration problem.</h2>
            <p className="mc-lead">
              Most players who are stuck are not lazy. They are doing more of the wrong work,
              harder. There are four reasons the industry keeps producing practice shooters who
              disappear in games.
            </p>
          </Reveal>
          <div className="mc-problems">
            {PROBLEMS.map((p, i) => (
              <Reveal key={p.num} delay={i * 80}>
                <div className="mc-problem">
                  <p className="mc-problem-num mc-mono">{p.num}</p>
                  <h3 className="mc-h3">{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mc-closer">
              More reps of the same shot make you better at practice. Calibration makes you better
              at basketball.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── 4. The BB Lens ── */}
      <section id="lens" className="mc-section mc-bg-warm">
        <div className="mc-container">
          <Reveal>
            <Kicker>The BB Lens</Kicker>
            <h2 className="mc-h2">Shooting is not a pose. It is a moving calculation.</h2>
          </Reveal>
          <div className="mc-lens-grid">
            <div>
              <Reveal>
                <p className="mc-body">
                  Every shot is a target acquisition problem solved under pressure. Your eyes find
                  the rim. Your system reads the distance, selects the energy, and times the
                  delivery, all in fractions of a second, while the game changes around you.
                </p>
                <p className="mc-body">
                  That means shooting is not just mechanics. It is perception. Rhythm. Timing.
                  Coordination. Distance control. Adaptability. When any one of those is
                  uncalibrated, no amount of form work can compensate, because form was never the
                  problem.
                </p>
              </Reveal>
              <Reveal>
                <blockquote className="mc-pullquote">
                  {'“Shooting is about energy. When you can’t control the energy, you will not be a highly adaptable shooter.”'}
                  <cite>Tommy Tempesta</cite>
                </blockquote>
              </Reveal>
              <Reveal>
                <p className="mc-body">
                  BB calibrates that system directly. The protocols manipulate the exact variables
                  your shot must cope with: distance, ball flight, airspace, and the ball itself.
                  Each protocol places your system in conditions it cannot solve on autopilot, and
                  your body recalibrates. No cues about your elbow. No slow-motion checklists. The
                  demands change, and the shot that emerges is one that survives changing
                  conditions.
                </p>
                <p className="mc-body">
                  That is why the same lens works on an NBA champion in the Finals and a high
                  school guard in a driveway. It is not built on someone&rsquo;s opinion of what a
                  shot should look like. It is built on how shooting is actually controlled.
                </p>
              </Reveal>
            </div>
            <Reveal group>
              <LensDiagram />
            </Reveal>
          </div>
          <Reveal>
            <p className="mc-closer">
              This is the lens behind every result above. The masterclass hands it to you.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── 5. Inside the Masterclass ── */}
      <section id="masterclass" className="mc-section mc-bg-white">
        <div className="mc-container">
          <Reveal>
            <Kicker>Inside The Masterclass</Kicker>
            <h2 className="mc-h2">A 14 day calibration. Then a system for life.</h2>
            <p className="mc-lead">
              The masterclass is delivered as a 14 day protocol arc with full video demonstrations.
              You run it in a normal gym. Every protocol tells you what to do, why it works, and
              what your misses are telling you.
            </p>
          </Reveal>

          <Reveal group>
            <div className="mc-timeline">
              {PHASES.map((phase) => (
                <div key={phase.days} className="mc-phase">
                  <p className="mc-phase-days">{phase.days}</p>
                  <p className="mc-phase-title">{phase.title}</p>
                  <p>{phase.body}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <h3 className="mc-keep-title">What you keep after the 14 days</h3>
            <ul className="mc-checklist">
              {KEEPS.map((item) => (
                <li key={item}>
                  <span className="mc-tick" aria-hidden="true">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mc-format-line">
              Video demonstrations for every protocol. Lifetime access. Every future update
              included.
            </p>
          </Reveal>

          <Reveal>
            <div className="mc-guarantee">
              <p className="mc-guarantee-title">The Day 14 Guarantee.</p>
              <p>
                Run the 14 day protocol as designed. Test out on Day 14. Your score will be higher
                than your Day 1 baseline. These protocols were built with players whose percentages
                are public. That is the standard they are held to.
              </p>
            </div>
            <CtaBlock label="Start Calibrating Your Shot" />
          </Reveal>
        </div>
      </section>

      {/* ── 6. Transformation ── */}
      <section id="transformation" className="mc-section mc-bg-white">
        <div className="mc-container">
          <Reveal>
            <Kicker>Before And After Calibration</Kicker>
            <h2 className="mc-h2">The difference is not more effort. It is a different system.</h2>
          </Reveal>
          <Reveal group>
            <div className="mc-transform-grid">
              <div className="mc-transform-col mc-before">
                <h3>Before calibration</h3>
                <ul>
                  {BEFORE.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="mc-transform-divider" aria-hidden="true" />
              <div className="mc-transform-col mc-after mc-after-col">
                <h3>After calibration</h3>
                <ul>
                  {AFTER.map((item) => (
                    <li key={item}>
                      <span className="mc-tick" aria-hidden="true">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 9. Testimonials ── */}
      <section id="testimonials" className="mc-section mc-bg-warm">
        <div className="mc-container">
          <Reveal>
            <Kicker>From The Players</Kicker>
            <h2 className="mc-h2">In their words.</h2>
          </Reveal>
          <div className="mc-quotes">
            {QUOTES.map((q, i) => (
              <Reveal key={q.who} delay={i * 80}>
                <blockquote className="mc-quote">
                  <p>{q.quote}</p>
                  <cite>{q.who}</cite>
                </blockquote>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. The Coach ── */}
      <section id="coach" className="mc-section mc-bg-white">
        <div className="mc-container">
          <Reveal>
            <Kicker>The Coach Behind Calibration</Kicker>
            <h2 className="mc-h2">
              Tommy Tempesta. NBA shooting consultant. Biomechanics specialist.
            </h2>
          </Reveal>
          <div className="mc-coach-grid">
            <Reveal>
              <div className="mc-coach-photo-frame">
                <img
                  src="/players/tommy-coach.jpg"
                  alt="Coach Tommy Tempesta"
                  className="mc-coach-photo"
                  loading="lazy"
                />
              </div>
            </Reveal>
            <Reveal delay={100}>
              <p className="mc-body">
                Twenty five years of research and application at the highest levels of basketball.
                Tommy built the calibration system now used in season by NBA players, and has
                consulted for NBA and NCAA programs on player development and shooting calibration.
                His work includes coaching and consulting with Tobias Harris, OG Anunoby, Paul
                Reed, Matisse Thybulle, Moses Brown, and Tyler Burton. The methodology was not
                designed to sound good online. It was tested on film, in season, for years, and
                only what survived the evidence made it into the masterclass.
              </p>
            </Reveal>
          </div>
          <Reveal>
            <p className="mc-video-caption">Watch a full calibration session with an NBA player.</p>
            <div className="mc-video-frame" style={{ margin: '0 auto' }}>
              <iframe
                src="https://www.youtube.com/embed/Bpm-jAX8c38"
                title="Full calibration session with an NBA player"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 11. FAQ ── */}
      <section id="faq" className="mc-section mc-bg-warm">
        <div className="mc-container">
          <Reveal>
            <Kicker>Questions, Answered</Kicker>
            <Faq />
          </Reveal>
        </div>
      </section>

      {/* ── 12. Final CTA ── */}
      <section id="start" className="mc-final">
        <div className="mc-container">
          <Reveal>
            <h2 className="mc-h2">
              Your next 14 days can change how you shoot for the rest of your career.
            </h2>
            <p className="mc-final-body">
              You have seen the results, the lens, and the system. The only thing left is the part
              BB cannot do for you.
            </p>
            <a href={ENROLL_URL} className="mc-cta mc-cta--large">
              Start The Shooting Calibration Masterclass
            </a>
            <p className="mc-microcopy">$297. Lifetime access. Day 14 guarantee.</p>
            <p className="mc-final-line">Proven In Season</p>
          </Reveal>
        </div>
        <footer className="mc-footer">
          Basketball Biomechanics · Coach Tommy Tempesta · Trusted by NBA, D1, and high school
          players worldwide.
        </footer>
      </section>
    </main>
  );
}

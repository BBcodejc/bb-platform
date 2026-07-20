'use client';

// Basketball Biomechanics — ecosystem home.
// Premium dark waitlist experience. The previous product-style home page
// is preserved in git history.
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Space_Grotesk, IBM_Plex_Mono } from 'next/font/google';
import { bbTrack } from '../lib/analytics';
import './home.css';

const display = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--hb-font-display',
  display: 'swap',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--hb-font-mono',
  display: 'swap',
});

/* Kit destination: form "BB Community Waitlist" (created 2026-07-19 in the
   Basketball Biomechanics Kit account, form id 9703176). */
const KIT_FORM_ID = '9703176';
const KIT_FORM_ACTION = `https://app.kit.com/forms/${KIT_FORM_ID}/subscriptions`;

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Scroll reveal wrapper ───────────────────────────────────────────────────

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

// ─── Gold particle field ─────────────────────────────────────────────────────

function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const size = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
    };
    size();
    window.addEventListener('resize', size);

    const N = 70;
    const dots = Array.from({ length: N }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.6,
      s: 0.00016 + Math.random() * 0.00042,
      drift: (Math.random() - 0.5) * 0.00022,
      a: 0.08 + Math.random() * 0.3,
      p: Math.random() * Math.PI * 2,
    }));

    const tick = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.y -= d.s;
        d.x += d.drift + Math.sin(d.p + d.y * 14) * 0.00012;
        d.p += 0.002;
        if (d.y < -0.02) {
          d.y = 1.02;
          d.x = Math.random();
        }
        ctx.beginPath();
        ctx.arc(d.x * w, d.y * h, d.r * dpr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 169, 97, ${d.a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', size);
    };
  }, []);
  return <canvas ref={ref} className="hb-hero-canvas" aria-hidden="true" />;
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.5);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={`hb-nav${solid ? ' is-solid' : ''}`}>
      <a href="#top" className="hb-nav-logo" aria-label="Basketball Biomechanics">
        <img src="/bb-logo-registered.png" alt="Basketball Biomechanics" />
      </a>
      <a href="#waitlist" className="hb-nav-cta" data-bb-cta="hero">
        Join the Waitlist
      </a>
    </header>
  );
}

// ─── Waitlist form (Kit + BB OS CRM) ─────────────────────────────────────────

function WaitlistForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'submitting') return;
    setStatus('submitting');
    bbTrack('community_waitlist_submit', { product: 'BB Community' });
    const kit = fetch(KIT_FORM_ACTION, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        email_address: email.trim(),
        first_name: name.trim(),
        fields: { first_name: name.trim() },
      }),
    });
    const crm = fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), email: email.trim(), source: 'community' }),
    });
    const results = await Promise.allSettled([kit, crm]);
    const ok = results.some((r) => r.status === 'fulfilled' && (r.value as Response).ok);
    if (ok) {
      bbTrack('community_waitlist_success', { product: 'BB Community' });
      setStatus('success');
    } else {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="hb-success" role="status">
        <span className="hb-check" aria-hidden="true">
          ✓
        </span>
        <h3>You are in.</h3>
        <p>
          You are on the waitlist for the BB Community. You will be the first to know when the
          doors open.
        </p>
      </div>
    );
  }

  return (
    <form className="hb-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="First name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="given-name"
        aria-label="First name"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
        aria-label="Email"
      />
      <button className="hb-cta" type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Joining...' : 'Join Waitlist'}
      </button>
      {status === 'error' && (
        <p className="hb-form-error" role="alert">
          Something went wrong. Please try again, or email trainwjc@gmail.com and we will add
          you.
        </p>
      )}
      <p className="hb-form-note">First access. No spam, ever.</p>
    </form>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────

const PILLARS = [
  {
    num: '01',
    title: 'Movement',
    body: 'Develop movement solutions through pattern exploration, environmental interaction, timing, coordination, and adaptability.',
  },
  {
    num: '02',
    title: 'Ball Manipulation',
    body: 'Build command over the basketball through intentional patterning and live application.',
  },
  {
    num: '03',
    title: 'Shooting Calibration',
    body: 'Learn how elite shooters develop precision, adaptability, and control without rebuilding their natural movement solutions.',
  },
  {
    num: '04',
    title: 'Vision & Visual Stress',
    body: 'Train the visual system to improve perception, anticipation, tracking, awareness, and decision-making.',
  },
];

const ROADMAP = [
  {
    title: 'BB Movement Protocols',
    items: ['Dowel', 'Jump Rope', 'Court Patterning', 'Hill Work', 'Beach Work', 'Environmental Constraints'],
  },
  {
    title: 'Shooting Calibration System',
    items: ['Precision Development', 'Miss Pattern Analysis', 'Constraint Training', 'Distance Exploration'],
  },
  {
    title: 'Vision Training',
    items: ['Central Vision', 'Peripheral Vision', 'Visual Stress', 'Tracking', 'Reaction', 'Decision Making'],
  },
  {
    title: 'Live Play Library',
    note: 'Real athletes. Real movement. Real problem solving.',
    items: ['No staged drills'],
  },
  {
    title: 'BB Community',
    note: 'Access the entire ecosystem. One environment.',
    items: ['Players', 'Coaches', 'Professionals'],
  },
];

const TRADITIONAL = ['Cone drills', 'Preset movements', 'Isolated techniques', 'Scripted outcomes'];
const BB_WAY = ['Live interaction', 'Adaptability', 'Perception-action coupling', 'Real transfer'];

const FEATURED = [
  {
    name: 'Tobias Harris',
    title: 'NBA Veteran',
    sub: 'Trusted implementation and performance support.',
    img: '/players/tobiasharrislandingpage.webp',
  },
  {
    name: 'OG Anunoby',
    title: 'NBA Champion',
    sub: 'Used throughout championship-level preparation and in-season development.',
    img: '/players/og-featured.jpg',
  },
];

const TICKER = [
  'Paul Reed',
  'Matisse Thybulle',
  'Kyle Lowry',
  'Tyler Burton',
  'Auburn Men’s Basketball',
  'Dallas Mavericks',
  'Los Angeles Lakers',
  'NBA Players',
  'Professional Athletes',
  'International Professionals',
];

const TEAM = [
  {
    name: 'Coach Tommy Tempesta',
    title: 'Founder & Chief Methodologist',
    img: '/players/tommy-team.jpg',
    paras: [
      'Inventor of the Basketball Biomechanics methodology.',
      'Specializing in motor learning, movement systems, perception-action coupling, shooting development, and elite performance environments.',
      'Years of work with professional athletes, championship-level performers, and high-level organizations have helped shape the Basketball Biomechanics framework used today.',
    ],
  },
  {
    name: 'Coach Jake Cioe',
    title: 'Implementation Coach & Performance Consultant',
    img: '/players/jake-team.jpg',
    paras: [
      'Former NCAA Division I guard.',
      'Responsible for athlete implementation, coaching integration, remote consultation, content development, and assisting in the continued evolution and application of the Basketball Biomechanics system.',
      'Works directly with athletes to bridge the gap between theory and real-world performance.',
    ],
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const logoScale = useTransform(scrollYProgress, [0, 1], [1, 0.7]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.1]);
  const logoY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  useEffect(() => {
    bbTrack('community_waitlist_view', { product: 'BB Community' });
  }, []);

  return (
    <div id="top" className={`hb ${display.variable} ${mono.variable}`}>
      <Nav />

      {/* ── Hero ── */}
      <section ref={heroRef} className="hb-hero" data-bb-hero>
        <Particles />
        <div className="hb-hero-glow" aria-hidden="true" />

        <motion.div
          className="hb-hero-logo"
          style={reduce ? undefined : { scale: logoScale, opacity: logoOpacity, y: logoY }}
          initial={reduce ? false : { opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: EASE }}
        >
          <motion.img
            src="/bb-logo-registered.png"
            alt="Basketball Biomechanics"
            animate={reduce ? undefined : { rotateY: [0, 10, 0, -10, 0], y: [0, -12, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        <div className="hb-hero-content">
          <motion.h1
            className="hb-h1"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: EASE }}
          >
            Basketball Biomechanics
          </motion.h1>

          <motion.p
            className="hb-hero-sub"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
          >
            Bridging the gap between:
          </motion.p>

          <ul className="hb-hero-words">
            {['Movement', 'Ball Manipulation', 'Shooting', 'Vision'].map((w, i) => (
              <motion.li
                key={w}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1.05 + i * 0.15, ease: EASE }}
              >
                {w}
                <span>.</span>
              </motion.li>
            ))}
          </ul>

          <motion.p
            className="hb-hero-desc"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.8, ease: EASE }}
          >
            A complete player development ecosystem built from real-world application, elite
            performance, and modern motor learning principles.
          </motion.p>

          <motion.div
            className="hb-hero-ctas"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2, ease: EASE }}
          >
            <a href="#waitlist" className="hb-cta" data-bb-cta="hero">
              Join the Waitlist
            </a>
            <a href="#system" className="hb-cta hb-cta--ghost">
              Explore the System
            </a>
          </motion.div>
        </div>

        <div className="hb-scroll-hint" aria-hidden="true">
          Scroll
        </div>
      </section>

      {/* ── What is BB ── */}
      <section id="system" className="hb-section">
        <div className="hb-container">
          <Reveal>
            <p className="hb-kicker">The System</p>
            <h2 className="hb-h2">What Is Basketball Biomechanics?</h2>
            <p className="hb-lead">
              Basketball Biomechanics is not a collection of drills. It is a system. A framework
              built around how players:
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="hb-verbs">
              {['Move', 'See', 'Adapt', 'Solve movement problems', 'Perform under pressure'].map(
                (v) => (
                  <li key={v}>{v}</li>
                )
              )}
            </ul>
            <p className="hb-lead">
              Instead of teaching isolated techniques, Basketball Biomechanics focuses on creating
              adaptable athletes capable of performing in live environments.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Four pillars ── */}
      <section className="hb-section">
        <div className="hb-container">
          <Reveal>
            <p className="hb-kicker">The Four Pillars</p>
            <h2 className="hb-h2">One ecosystem. Four disciplines.</h2>
          </Reveal>
          <div className="hb-pillars">
            {PILLARS.map((p, i) => (
              <Reveal key={p.num} delay={i * 0.08}>
                <motion.div
                  className="hb-pillar"
                  whileHover={{ y: -6, scale: 1.015 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <p className="hb-pillar-num">{p.num}</p>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Roadmap ── */}
      <section className="hb-section">
        <div className="hb-container">
          <Reveal>
            <p className="hb-kicker">Coming Soon</p>
            <h2 className="hb-h2">The future ecosystem.</h2>
          </Reveal>
          <div className="hb-roadmap">
            {ROADMAP.map((r, i) => (
              <Reveal key={r.title} delay={i * 0.06}>
                <div className="hb-road-item">
                  <h3>{r.title}</h3>
                  {r.note && <p className="hb-road-note">{r.note}</p>}
                  <ul className="hb-road-tags">
                    {r.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why BB ── */}
      <section className="hb-section">
        <div className="hb-container">
          <Reveal>
            <p className="hb-kicker">Why Basketball Biomechanics?</p>
            <h2 className="hb-h2">Training that transfers.</h2>
          </Reveal>
          <div className="hb-compare">
            <Reveal>
              <div className="hb-compare-card is-old">
                <h3>Traditional Training</h3>
                <ul>
                  {TRADITIONAL.map((t) => (
                    <li key={t}>
                      <span className="hb-mark" aria-hidden="true">
                        ×
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="hb-compare-card is-bb">
                <h3 className="hb-gold">Basketball Biomechanics</h3>
                <ul>
                  {BB_WAY.map((t) => (
                    <li key={t}>
                      <span className="hb-mark" aria-hidden="true">
                        ✓
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Who we work with ── */}
      <section className="hb-section">
        <div className="hb-container">
          <Reveal>
            <p className="hb-kicker">Trusted At Every Level</p>
            <h2 className="hb-h2">Who We Work With</h2>
            <p className="hb-lead">
              From NBA champions and professionals to youth athletes, Basketball Biomechanics has
              influenced players and organizations across every level of the game.
            </p>
          </Reveal>
          <div className="hb-featured">
            {FEATURED.map((f, i) => (
              <Reveal key={f.name} delay={i * 0.12}>
                <motion.div
                  className="hb-featured-card"
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <div className="hb-featured-media">
                    <img src={f.img} alt={f.name} loading="lazy" />
                  </div>
                  <div className="hb-featured-body">
                    <h3>{f.name}</h3>
                    <p className="hb-featured-title">{f.title}</p>
                    <p className="hb-featured-sub">{f.sub}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal>
          <div className="hb-ticker" aria-label="Players and organizations Basketball Biomechanics has worked with">
            <div className="hb-ticker-track">
              {[...TICKER, ...TICKER].map((t, i) => (
                <span key={`${t}-${i}`} className="hb-ticker-item" aria-hidden={i >= TICKER.length}>
                  {t}
                  <span className="hb-ticker-dot" aria-hidden="true">
                    ·
                  </span>
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── The team ── */}
      <section className="hb-section">
        <div className="hb-container">
          <Reveal>
            <p className="hb-kicker">The Team</p>
            <h2 className="hb-h2">The Team Behind Basketball Biomechanics</h2>
            <p className="hb-lead">
              Combining decades of research, practical application, and elite-level
              implementation.
            </p>
          </Reveal>
          <div className="hb-team">
            {TEAM.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.12}>
                <motion.div
                  className="hb-team-card"
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <div className="hb-team-media">
                    <img src={m.img} alt={m.name} loading="lazy" />
                  </div>
                  <div className="hb-team-body">
                    <h3>{m.name}</h3>
                    <p className="hb-team-title">{m.title}</p>
                    {m.paras.map((p) => (
                      <p key={p.slice(0, 24)} className="hb-team-para">
                        {p}
                      </p>
                    ))}
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="hb-section hb-mission">
        <div className="hb-container">
          <Reveal>
            <p className="hb-kicker hb-kicker--center">The Mission</p>
            <p className="hb-mission-quote">
              &ldquo;We are building the most complete player development system in
              basketball.&rdquo;
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="hb-mission-words">
              {['Movement', 'Shooting', 'Vision', 'Decision Making', 'Performance'].map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
            <p className="hb-lead">
              The goal is to bridge the gap between every layer of performance while making these
              concepts accessible to athletes all over the world.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section id="waitlist" className="hb-section hb-waitlist">
        <div className="hb-container">
          <Reveal>
            <h2 className="hb-h2">Become One of the First Members.</h2>
            <p className="hb-lead" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
              The next evolution of Basketball Biomechanics is coming. Join the waitlist.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <WaitlistForm />
          </Reveal>
        </div>
      </section>

      <footer className="hb-footer">
        Basketball Biomechanics · Coach Tommy Tempesta · Trusted by NBA, D1, and high school
        players worldwide.
      </footer>
    </div>
  );
}

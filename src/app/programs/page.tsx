'use client';

export default function ProgramsPage() {
  return (
    <>
      {/* URGENCY BAR */}
      <div className="urgency-bar">
        Accepting applications for offseason engagements. Limited spots available.
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-badge">For Programs &amp; Organizations</div>
        <h1>
          Bridge the gap.<br />
          Protect your <span className="gold">players.</span><br />
          Maximize <span className="gold">output.</span>
        </h1>
        <p className="hero-sub">
          The same system that took NBA players from career lows to career bests. Now available for your program. A 12-week implementation that transforms how your players move, see, handle, and shoot under game stress.
        </p>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="number">25+</div>
            <div className="label">Years of Research</div>
          </div>
          <div className="hero-stat">
            <div className="number">4</div>
            <div className="label">Systems Assessed</div>
          </div>
          <div className="hero-stat">
            <div className="number">12</div>
            <div className="label">Week Minimum</div>
          </div>
        </div>
        <a href="#apply" className="cta-btn">Apply Now</a>
      </section>

      {/* THE GAP */}
      <section className="gap-section">
        <div className="container">
          <div className="section-label">The Problem</div>
          <div className="section-title">Five departments.<br />Zero communication.</div>
          <div className="section-body">
            Every program has specialists. None of them are connected. The player is stuck in the middle trying to piece it together on their own. This is where performance leaks, injuries happen, and potential goes unrealized.
          </div>
          <div className="gap-grid">
            <div className="gap-card">
              <div className="dept">S&amp;C</div>
              <div className="issue">Builds strength in isolation. No connection to on-court movement demands.</div>
            </div>
            <div className="gap-card">
              <div className="dept">Athletic Training</div>
              <div className="issue">Manages injuries after they happen. Not preventing them through movement quality.</div>
            </div>
            <div className="gap-card">
              <div className="dept">Player Development</div>
              <div className="issue">Runs drills without assessment. No limiting factor identification. No test retest.</div>
            </div>
            <div className="gap-card">
              <div className="dept">Coaching Staff</div>
              <div className="issue">Focuses on scheme and strategy. Can&rsquo;t diagnose why individual players fail to execute.</div>
            </div>
            <div className="gap-card">
              <div className="dept">Game Performance</div>
              <div className="issue">The only place that matters. And nothing upstream is specifically preparing players for it.</div>
            </div>
          </div>
          <div className="gap-result">The result: players are underprepared, unprotected, and underperforming.</div>
        </div>
      </section>

      {/* THE BRIDGE */}
      <section>
        <div className="container">
          <div className="section-label">The Solution</div>
          <div className="section-title">We bridge the gap<br />with <span style={{ color: 'var(--gold)' }}>one lens.</span></div>
          <div className="section-body">
            We assess four systems that are always connected. When one breaks down, everything breaks down. We find the limiting factor and address it through constraint-based methods that transfer to live play.
          </div>
          <div className="bridge-grid">
            <div className="bridge-card">
              <div className="system-number">01</div>
              <div className="system-name">Vision</div>
              <div className="system-desc">Peripheral processing. Visual search strategy. Gaze location under stress. If your players can&rsquo;t see the game while they&rsquo;re playing it, nothing else matters.</div>
            </div>
            <div className="bridge-card">
              <div className="system-number">02</div>
              <div className="system-name">Movement</div>
              <div className="system-desc">Full foot contact. Trunk rotation at acceleration. Lead leg deceleration with trunk hinge. Movement bandwidth that protects the body and creates advantages.</div>
            </div>
            <div className="bridge-card">
              <div className="system-number">03</div>
              <div className="system-name">Ball Manipulation</div>
              <div className="system-desc">Reception time. Reception location. Dribble time. Cadence variation. The ball&rsquo;s relationship to the body is the skill, not the combo.</div>
            </div>
            <div className="bridge-card">
              <div className="system-number">04</div>
              <div className="system-name">Shooting</div>
              <div className="system-desc">Calibration, not form correction. Ball flight control. Distance precision. Exit speed under stress. Built to hold up when the game gets chaotic.</div>
            </div>
          </div>
        </div>
      </section>

      {/* MEASURABLE IMPACT */}
      <section className="stats-section">
        <div className="container">
          <div className="section-label">Measurable Impact</div>
          <div className="section-title">What bridging the gap<br />actually <span style={{ color: 'var(--gold)' }}>improves.</span></div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">3PT Percentage</div>
              <div className="stat-value">+25%</div>
              <div className="stat-context">Average improvement across NBA and D1 clients</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Turnover Rate</div>
              <div className="stat-value">DOWN</div>
              <div className="stat-context">Better visual processing = better decisions under pressure</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Injury Risk</div>
              <div className="stat-value">DOWN</div>
              <div className="stat-context">Proper deceleration protects knees, ankles, and hamstrings</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Offensive Efficiency</div>
              <div className="stat-value">UP</div>
              <div className="stat-context">Players who create advantages = better possessions</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Player Value</div>
              <div className="stat-value">UP</div>
              <div className="stat-context">Better stats = more minutes, scholarships, and contracts</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Ast/TO Ratio</div>
              <div className="stat-value">UP</div>
              <div className="stat-context">See the pass before the defense sees you</div>
            </div>
          </div>
          <p className="stats-tagline">Measured. Not promised.</p>
        </div>
      </section>

      {/* PROOF */}
      <section>
        <div className="container">
          <div className="section-label">The Proof</div>
          <div className="section-title">Results that speak<br />for <span style={{ color: 'var(--gold)' }}>themselves.</span></div>
          <div className="section-body">All in-season. All short windows. Zero form corrections. Zero mechanical overhauls. Calibration only.</div>
          <div className="proof-grid">
            <div className="proof-card">
              <div className="proof-player">NBA Veteran</div>
              <div className="proof-numbers">18% &rarr; 47%</div>
              <div className="proof-context">From three. In-season. Under 100 days.</div>
            </div>
            <div className="proof-card">
              <div className="proof-player">NBA Big Man</div>
              <div className="proof-numbers">15% &rarr; 40%</div>
              <div className="proof-context">From three. In-season. 4 months. Wouldn&rsquo;t even look at the rim before.</div>
            </div>
            <div className="proof-card">
              <div className="proof-player">D1 Guard</div>
              <div className="proof-numbers">29% &rarr; 44%</div>
              <div className="proof-context">From three. In-season. 2 weeks.</div>
            </div>
            <div className="proof-card">
              <div className="proof-player">D1 Player</div>
              <div className="proof-numbers">20% &rarr; 40%</div>
              <div className="proof-context">In-season improvement. Same protocols.</div>
            </div>
            <div className="proof-card">
              <div className="proof-player">D1 Player</div>
              <div className="proof-numbers">32% &rarr; 42%</div>
              <div className="proof-context">In-season. 3 weeks.</div>
            </div>
            <div className="proof-card">
              <div className="proof-player">High School Guard</div>
              <div className="proof-numbers">47% from 3</div>
              <div className="proof-context">87% FT. 26+ PPG. D1 commit.</div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="founder-section">
        <div className="container">
          <div className="section-label">The Process</div>
          <div className="section-title">How we implement<br />with your <span style={{ color: 'var(--gold)' }}>program.</span></div>
          <div className="section-body">12 weeks minimum. That is the standard for meaningful adaptation. This is not a weekend clinic. This is a full integration of the BB system into your player development pipeline.</div>
          <div className="process-steps">
            <div className="process-step">
              <div className="step-marker">01</div>
              <div className="step-content">
                <h3>Assessment</h3>
                <p>We assess 5-8 key players on your roster through the BB Lens. Vision, movement, ball manipulation, and shooting. We identify the specific limiting factors for each player and how their systems are constraining each other.</p>
              </div>
            </div>
            <div className="process-step">
              <div className="step-marker">02</div>
              <div className="step-content">
                <h3>Custom Implementation Plan</h3>
                <p>Based on the assessment, we build a program-specific plan. Shooting calibration protocols. Movement bandwidth progressions. Ball manipulation methods. Visual processing development. All connected. All tailored to your roster&rsquo;s needs.</p>
              </div>
            </div>
            <div className="process-step">
              <div className="step-marker">03</div>
              <div className="step-content">
                <h3>Coach Education</h3>
                <p>We equip your coaching staff with the knowledge of what to look for in live play. How to assess movement quality. How to identify visual processing breakdowns. How to use external cueing instead of internal cueing. Your staff becomes an extension of the system.</p>
              </div>
            </div>
            <div className="process-step">
              <div className="step-marker">04</div>
              <div className="step-content">
                <h3>Ongoing Support</h3>
                <p>Weekly or bi-weekly check-ins. Film review of sessions and games. Protocol adjustments based on what we see. We are embedded in your program remotely for the full 12 weeks to ensure the methods are being applied correctly and adaptation is occurring.</p>
              </div>
            </div>
            <div className="process-step">
              <div className="step-marker">05</div>
              <div className="step-content">
                <h3>Test Retest</h3>
                <p>Everything gets validated under live conditions. We don&rsquo;t guess whether it&rsquo;s working. We prove it. Game film review. Statistical tracking. Visual evidence of transfer. If it doesn&rsquo;t show up in the game, we adjust until it does.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section>
        <div className="container">
          <div className="section-label">Who Built This</div>
          <div className="section-title">Coach Tommy <span style={{ color: 'var(--gold)' }}>Tempesta</span></div>
          <div className="founder-grid">
            <div className="founder-info">
              <div className="gold-line"></div>
              <ul className="founder-creds">
                <li>25+ years of research in physical therapy, strength &amp; conditioning, and motor learning</li>
                <li>Creator of assessment-based systems utilized by NBA players, high-major programs, and coaches worldwide</li>
                <li>The BB Lens: an evidence-based assessment that determines real limiting factors across Movement, Vision, and Energy Transfer</li>
                <li>Trusted by NBA organizations, D1 programs, and professional players internationally</li>
                <li>Methods, not drills. We engineer highly specific methods to force self-organization and adaptability</li>
                <li>Over two decades spent assessing, stressing, and calibrating thousands of players in live-game contexts</li>
              </ul>
              <p className="founder-tagline">We rely on visual evidence and live application.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="stats-section">
        <div className="container">
          <div className="section-label">What Your Program Gets</div>
          <div className="section-title">The complete <span style={{ color: 'var(--gold)' }}>implementation.</span></div>
          <div className="bridge-grid" style={{ marginTop: 48, textAlign: 'left' }}>
            <div className="bridge-card">
              <div className="system-name">Player Assessments</div>
              <div className="system-desc">Full BB Lens assessment for 5-8 key players. Written reports identifying limiting factors across all four systems with prioritized recommendations.</div>
            </div>
            <div className="bridge-card">
              <div className="system-name">Custom Protocols</div>
              <div className="system-desc">Shooting calibration, movement bandwidth, ball manipulation, and visual processing protocols built specifically for your roster&rsquo;s needs.</div>
            </div>
            <div className="bridge-card">
              <div className="system-name">Staff Education</div>
              <div className="system-desc">Your coaching staff learns the BB assessment lens. What to look for. How to cue externally. How to identify limiting factors in real time during practice and games.</div>
            </div>
            <div className="bridge-card">
              <div className="system-name">12 Weeks of Support</div>
              <div className="system-desc">Ongoing check-ins, film review, protocol adjustments, and direct access to BB throughout the engagement. We are embedded in your program.</div>
            </div>
            <div className="bridge-card">
              <div className="system-name">Equipment Guidance</div>
              <div className="system-desc">Exactly what to purchase. Where to get it. How to use it. Oversized balls, blockers, constraint tools. Full equipment implementation plan.</div>
            </div>
            <div className="bridge-card">
              <div className="system-name">Test Retest Reports</div>
              <div className="system-desc">Monthly progress reports with visual evidence and statistical tracking showing exactly how your players are adapting and where to go next.</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="apply">
        <div className="container">
          <div className="section-label">Get Started</div>
          <div className="section-title">Accepting applications for<br /><span style={{ color: 'var(--gold)' }}>offseason engagements.</span></div>
          <div className="gold-line-center"></div>
          <div className="section-body" style={{ margin: '0 auto 48px', textAlign: 'center' }}>
            This is a 12-week minimum commitment. Pricing is based on scope, roster size, and level of implementation. We work with a limited number of programs at a time to ensure quality.
          </div>
          <div className="cta-spots">Limited spots remaining for this offseason</div>
          <a href="mailto:bbcodejc@gmail.com?subject=Program%20Implementation%20Inquiry" className="cta-btn" style={{ animation: 'none' }}>Apply Now</a>
          <p className="cta-footnote">Or DM @basketballbiomechanics with &ldquo;PLAN&rdquo; to start the conversation.</p>
        </div>
      </section>

      {/* FOOTER */}
      <div className="footer">
        Basketball Biomechanics &bull; BB Code LLC &bull; Las Vegas, NV<br />
        <span style={{ color: 'var(--gold)' }}>Methods, not drills. Assessment, not guesswork.</span>
      </div>

      {/* STYLES */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@300;400;500;600&display=swap');

        :root {
          --gold: #D4A843;
          --gold-light: #E8C96A;
          --dark: #0a0a0a;
          --dark-surface: #111111;
          --dark-card: #1a1a1a;
          --white: #ffffff;
          --gray: #888888;
          --gray-light: #aaaaaa;
          --red: #FF0000;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        html, body {
          background: var(--dark) !important;
          color: var(--white);
        }

        body {
          font-family: 'Barlow', sans-serif;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }

        .container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* HERO */
        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 80px 24px;
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(ellipse at 50% 30%, rgba(212,168,67,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-badge {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 600;
          font-size: 13px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 32px;
          padding: 8px 20px;
          border: 1px solid rgba(212,168,67,0.3);
          display: inline-block;
          animation: fadeIn 1s ease;
        }

        .hero h1 {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-size: clamp(42px, 8vw, 80px);
          line-height: 0.95;
          text-transform: uppercase;
          letter-spacing: -1px;
          margin-bottom: 24px;
          animation: fadeUp 1s ease;
        }

        .hero h1 .gold { color: var(--gold); }

        .hero-sub {
          font-size: clamp(16px, 2.5vw, 20px);
          font-weight: 300;
          color: var(--gray-light);
          max-width: 680px;
          line-height: 1.6;
          margin-bottom: 40px;
          animation: fadeUp 1s ease 0.2s both;
        }

        .hero-stats {
          display: flex;
          gap: 48px;
          margin-bottom: 48px;
          flex-wrap: wrap;
          justify-content: center;
          animation: fadeUp 1s ease 0.4s both;
        }

        .hero-stat { text-align: center; }

        .hero-stat .number {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-size: 48px;
          color: var(--gold);
          line-height: 1;
        }

        .hero-stat .label {
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--gray);
          margin-top: 4px;
        }

        .cta-btn {
          display: inline-block;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 16px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--dark);
          background: var(--gold);
          padding: 16px 48px;
          text-decoration: none;
          transition: all 0.3s ease;
          animation: fadeUp 1s ease 0.6s both;
        }

        .cta-btn:hover {
          background: var(--gold-light);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(212,168,67,0.3);
        }

        /* URGENCY BAR */
        .urgency-bar {
          background: var(--gold);
          color: var(--dark);
          text-align: center;
          padding: 14px 24px;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: 2px;
          text-transform: uppercase;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        /* SECTIONS */
        section { padding: 100px 24px; }

        .section-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 600;
          font-size: 12px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 16px;
        }

        .section-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-size: clamp(32px, 5vw, 52px);
          text-transform: uppercase;
          line-height: 1;
          margin-bottom: 24px;
        }

        .section-body {
          font-size: 17px;
          font-weight: 300;
          color: var(--gray-light);
          line-height: 1.7;
          max-width: 720px;
        }

        /* GAP SECTION */
        .gap-section { background: var(--dark-surface); }

        .gap-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 48px;
          margin-bottom: 32px;
        }

        .gap-card {
          background: var(--dark-card);
          padding: 28px 24px;
          text-align: center;
          border: 1px solid #222;
          position: relative;
        }

        .gap-card .dept {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 15px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--white);
          margin-bottom: 8px;
        }

        .gap-card .issue {
          font-size: 13px;
          color: var(--gray);
          line-height: 1.5;
        }

        .gap-card::after {
          content: '///';
          position: absolute;
          top: -12px;
          right: -12px;
          color: var(--red);
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-size: 16px;
          opacity: 0.6;
        }

        .gap-result {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 20px;
          color: var(--red);
          text-transform: uppercase;
          letter-spacing: 1px;
          text-align: center;
          margin-top: 24px;
          opacity: 0.8;
        }

        /* BRIDGE */
        .bridge-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
          margin-top: 48px;
        }

        .bridge-card {
          background: var(--dark-surface);
          border: 1px solid rgba(212,168,67,0.15);
          padding: 36px 28px;
          position: relative;
          transition: border-color 0.3s ease;
        }

        .bridge-card:hover { border-color: rgba(212,168,67,0.4); }

        .bridge-card .system-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-size: 22px;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 12px;
          letter-spacing: 1px;
        }

        .bridge-card .system-desc {
          font-size: 15px;
          color: var(--gray-light);
          line-height: 1.6;
        }

        .bridge-card .system-number {
          position: absolute;
          top: 16px;
          right: 20px;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-size: 48px;
          color: rgba(212,168,67,0.08);
          line-height: 1;
        }

        /* STATS */
        .stats-section {
          background: var(--dark-surface);
          text-align: center;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 32px;
          margin-top: 48px;
        }

        .stat-card {
          padding: 32px 24px;
          border: 1px solid #222;
          background: var(--dark-card);
        }

        .stat-card .stat-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 600;
          font-size: 13px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--gray);
          margin-bottom: 8px;
        }

        .stat-card .stat-value {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-size: 42px;
          color: var(--gold);
          line-height: 1;
          margin-bottom: 4px;
        }

        .stat-card .stat-context {
          font-size: 14px;
          color: var(--gray-light);
        }

        .stats-tagline {
          margin-top: 32px;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 16px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--gold);
        }

        /* PROOF */
        .proof-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-top: 48px;
        }

        .proof-card {
          background: var(--dark-surface);
          padding: 32px 28px;
          border-left: 3px solid var(--gold);
        }

        .proof-card .proof-player {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 18px;
          text-transform: uppercase;
          color: var(--white);
          margin-bottom: 4px;
        }

        .proof-card .proof-numbers {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-size: 28px;
          color: var(--gold);
          margin-bottom: 4px;
        }

        .proof-card .proof-context {
          font-size: 14px;
          color: var(--gray);
        }

        /* PROCESS */
        .process-steps {
          margin-top: 48px;
          position: relative;
        }

        .process-steps::before {
          content: '';
          position: absolute;
          left: 24px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, var(--gold), rgba(212,168,67,0.1));
        }

        .process-step {
          display: flex;
          gap: 32px;
          margin-bottom: 40px;
          position: relative;
          align-items: flex-start;
        }

        .step-marker {
          width: 50px;
          height: 50px;
          min-width: 50px;
          background: var(--dark-card);
          border: 2px solid var(--gold);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-size: 20px;
          color: var(--gold);
          z-index: 1;
        }

        .step-content h3 {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 20px;
          text-transform: uppercase;
          margin-bottom: 8px;
          letter-spacing: 1px;
        }

        .step-content p {
          font-size: 15px;
          color: var(--gray-light);
          line-height: 1.6;
        }

        /* FOUNDER */
        .founder-section { background: var(--dark-surface); }

        .founder-grid {
          display: flex;
          gap: 48px;
          align-items: center;
          margin-top: 40px;
          flex-wrap: wrap;
        }

        .founder-info { flex: 1; min-width: 300px; }

        .founder-creds {
          list-style: none;
          padding: 0;
        }

        .founder-creds li {
          font-size: 15px;
          color: var(--gray-light);
          line-height: 1.6;
          padding: 6px 0;
          padding-left: 20px;
          position: relative;
        }

        .founder-creds li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 14px;
          width: 8px;
          height: 8px;
          background: var(--gold);
        }

        .founder-tagline {
          margin-top: 24px;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 16px;
          color: var(--gold);
          letter-spacing: 1px;
        }

        /* CTA */
        .cta-section {
          text-align: center;
          padding: 120px 24px;
          position: relative;
        }

        .cta-section::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(ellipse at 50% 50%, rgba(212,168,67,0.04) 0%, transparent 60%);
          pointer-events: none;
        }

        .cta-section .section-title { margin-bottom: 16px; }

        .cta-spots {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 32px;
          opacity: 0.8;
        }

        .cta-footnote {
          margin-top: 24px;
          font-size: 14px;
          color: var(--gray);
        }

        /* FOOTER */
        .footer {
          text-align: center;
          padding: 40px 24px;
          border-top: 1px solid #1a1a1a;
          font-size: 13px;
          color: var(--gray);
          letter-spacing: 1px;
        }

        /* DIVIDER */
        .gold-line {
          width: 60px;
          height: 2px;
          background: var(--gold);
          margin: 24px 0;
        }

        .gold-line-center {
          width: 60px;
          height: 2px;
          background: var(--gold);
          margin: 24px auto;
        }

        /* ANIMATIONS */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .hero { padding: 60px 20px; min-height: auto; }
          .hero-stats { gap: 24px; }
          .hero-stat .number { font-size: 36px; }
          section { padding: 64px 20px; }
          .gap-grid { grid-template-columns: 1fr 1fr; }
          .process-steps::before { left: 24px; }
          .founder-grid { flex-direction: column; }
        }

        @media (max-width: 480px) {
          .gap-grid { grid-template-columns: 1fr; }
          .hero-stats { flex-direction: column; gap: 16px; }
        }
      `}</style>
    </>
  );
}

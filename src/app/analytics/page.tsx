import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const metadata: Metadata = {
  title: 'BB Analytics',
  robots: { index: false, follow: false },
};

const SUPA_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xtpbpznvvgthhelslrqn.supabase.co';
const SUPA_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0cGJwem52dmd0aGhlbHNscnFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NjgwMzksImV4cCI6MjA5ODE0NDAzOX0.g0KooWgrPbB9xtbDIjcK5UT6w7ZQH-68_9d3Cuv23kM';

interface Ev {
  event: string;
  page: string;
  session_id: string;
  visitor_id: string;
  product: string;
  price: number | null;
  revenue: number | null;
  video_id: string;
  utm_campaign: string;
  utm_content: string;
  traffic_source: string;
  landing_page: string;
  created_at: string;
}

async function fetchEvents(days: number): Promise<Ev[]> {
  const since = new Date(Date.now() - days * 864e5).toISOString();
  const cols =
    'event,page,session_id,visitor_id,product,price,revenue,video_id,utm_campaign,utm_content,traffic_source,landing_page,created_at';
  const all: Ev[] = [];
  for (let page = 0; page < 50; page++) {
    const from = page * 1000;
    const res = await fetch(
      `${SUPA_URL}/rest/v1/bb_events?select=${cols}&created_at=gte.${since}&order=id.asc`,
      {
        headers: {
          apikey: SUPA_KEY,
          Authorization: `Bearer ${SUPA_KEY}`,
          Range: `${from}-${from + 999}`,
        },
        cache: 'no-store',
      }
    );
    if (!res.ok) break;
    const batch: Ev[] = await res.json();
    all.push(...batch);
    if (batch.length < 1000) break;
  }
  return all;
}

function uniqSessions(evs: Ev[], match: (e: Ev) => boolean): Set<string> {
  const s = new Set<string>();
  for (const e of evs) if (match(e) && e.session_id) s.add(e.session_id);
  return s;
}

function pct(part: number, whole: number): string {
  if (!whole) return '0%';
  return `${((part / whole) * 100).toFixed(1)}%`;
}

function money(n: number): string {
  return `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

const S = {
  page: {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    background: '#0b0b0c',
    color: '#e8e8e4',
    minHeight: '100vh',
    padding: '2.5rem 1.5rem',
  } as const,
  wrap: { maxWidth: 1040, margin: '0 auto' } as const,
  h1: { fontSize: '1.4rem', margin: '0 0 0.25rem', color: '#d4b45a' } as const,
  sub: { color: '#8a8a84', fontSize: '0.8rem', margin: '0 0 2rem' } as const,
  h2: {
    fontSize: '0.78rem',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: '#d4b45a',
    margin: '2.5rem 0 0.75rem',
  } as const,
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' } as const,
  th: {
    textAlign: 'left',
    padding: '0.5rem 0.75rem',
    borderBottom: '1px solid rgba(255,255,255,0.25)',
    color: '#8a8a84',
    fontWeight: 400 as const,
  } as const,
  td: {
    padding: '0.5rem 0.75rem',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  } as const,
  big: { fontSize: '1.5rem', color: '#fff' } as const,
};

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: { pin?: string; days?: string };
}) {
  const pin = process.env.CRM_PIN || '';
  const authorized =
    process.env.NODE_ENV === 'development' || (pin !== '' && searchParams.pin === pin);
  if (!authorized) {
    return (
      <main style={S.page}>
        <div style={S.wrap}>
          <h1 style={S.h1}>BB Analytics</h1>
          <p style={S.sub}>Locked. Append ?pin=YOUR_CRM_PIN to the URL.</p>
        </div>
      </main>
    );
  }

  const days = Math.min(365, Math.max(1, parseInt(searchParams.days || '30', 10) || 30));
  const evs = await fetchEvents(days);

  // ── Funnel (unique sessions) ──
  const viewed = uniqSessions(evs, (e) => e.event === 'page_view');
  const watched = uniqSessions(evs, (e) => e.event === 'video_started');
  const clicked = uniqSessions(evs, (e) => e.event.endsWith('_cta_clicked'));
  const checkout = uniqSessions(evs, (e) => e.event === 'checkout_started');
  const purchased = uniqSessions(evs, (e) => e.event === 'purchase_completed');
  const purchases = evs.filter((e) => e.event === 'purchase_completed');
  const revenue = purchases.reduce((sum, e) => sum + (e.revenue ?? e.price ?? 0), 0);
  const visitors = new Set(evs.filter((e) => e.visitor_id).map((e) => e.visitor_id)).size;

  const funnel: Array<[string, number]> = [
    ['Viewed page', viewed.size],
    ['Watched VSL', watched.size],
    ['Clicked CTA', clicked.size],
    ['Started checkout', checkout.size],
    ['Purchased', purchased.size],
  ];

  // ── VSL performance per video ──
  const videoIds = Array.from(new Set(evs.filter((e) => e.video_id).map((e) => e.video_id)));
  const videoRows = videoIds.map((vid) => {
    const of = (name: string) =>
      uniqSessions(evs, (e) => e.event === name && e.video_id === vid).size;
    const starts = of('video_started');
    const done = of('video_completed');
    return { vid, starts, q25: of('video_25_percent'), q50: of('video_50_percent'), q75: of('video_75_percent'), done, rate: pct(done, starts) };
  });

  // ── CTA clicks by position ──
  const ctaRows = ['hero', 'midpage', 'bottom'].map((pos) => ({
    pos,
    clicks: evs.filter((e) => e.event === `${pos}_cta_clicked`).length,
    sessions: uniqSessions(evs, (e) => e.event === `${pos}_cta_clicked`).size,
  }));

  // ── Grouped breakdowns ──
  function breakdown(keyFn: (e: Ev) => string) {
    const groups = new Map<string, { views: Set<string>; buys: Set<string>; revenue: number }>();
    for (const e of evs) {
      const key = keyFn(e) || '(none)';
      if (!groups.has(key)) groups.set(key, { views: new Set(), buys: new Set(), revenue: 0 });
      const g = groups.get(key)!;
      if (e.event === 'page_view' && e.session_id) g.views.add(e.session_id);
      if (e.event === 'purchase_completed') {
        if (e.session_id) g.buys.add(e.session_id);
        g.revenue += e.revenue ?? e.price ?? 0;
      }
    }
    return Array.from(groups.entries())
      .map(([key, g]) => ({ key, views: g.views.size, buys: g.buys.size, revenue: g.revenue }))
      .filter((r) => r.views > 0 || r.buys > 0)
      .sort((a, b) => b.revenue - a.revenue || b.buys - a.buys || b.views - a.views)
      .slice(0, 20);
  }

  const bySource = breakdown((e) => e.traffic_source);
  const byPage = breakdown((e) => e.landing_page);
  const byReel = breakdown((e) => e.utm_content || e.utm_campaign);

  const waitlists = ['movement', 'calibration', 'community'].map((w) => ({
    name: w === 'movement' ? 'Movement' : w === 'calibration' ? 'Calibration relaunch' : 'BB Community',
    views: uniqSessions(evs, (e) => e.event === `${w}_waitlist_view`).size,
    submits: uniqSessions(evs, (e) => e.event === `${w}_waitlist_submit`).size,
    success: uniqSessions(evs, (e) => e.event === `${w}_waitlist_success`).size,
  }));

  return (
    <main style={S.page}>
      <div style={S.wrap}>
        <h1 style={S.h1}>BB Analytics</h1>
        <p style={S.sub}>
          Last {days} days · {evs.length.toLocaleString()} events · change range with ?days=7
        </p>

        <h2 style={S.h2}>Overview</h2>
        <table style={S.table}>
          <tbody>
            <tr>
              <td style={S.td}>Visitors</td>
              <td style={{ ...S.td, ...S.big }}>{visitors.toLocaleString()}</td>
              <td style={S.td}>Purchases</td>
              <td style={{ ...S.td, ...S.big }}>{purchased.size.toLocaleString()}</td>
              <td style={S.td}>Revenue</td>
              <td style={{ ...S.td, ...S.big }}>{money(revenue)}</td>
              <td style={S.td}>Overall conversion</td>
              <td style={{ ...S.td, ...S.big }}>{pct(purchased.size, viewed.size)}</td>
            </tr>
          </tbody>
        </table>

        <h2 style={S.h2}>Full Funnel (unique sessions)</h2>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Step</th>
              <th style={S.th}>Sessions</th>
              <th style={S.th}>% of previous</th>
              <th style={S.th}>% of top</th>
            </tr>
          </thead>
          <tbody>
            {funnel.map(([label, n], i) => (
              <tr key={label}>
                <td style={S.td}>{label}</td>
                <td style={S.td}>{n.toLocaleString()}</td>
                <td style={S.td}>{i === 0 ? '100%' : pct(n, funnel[i - 1][1])}</td>
                <td style={S.td}>{pct(n, funnel[0][1])}</td>
              </tr>
            ))}
            <tr>
              <td style={S.td}>Checkout abandoned (started, no purchase)</td>
              <td style={S.td}>{Math.max(0, checkout.size - purchased.size).toLocaleString()}</td>
              <td style={S.td} colSpan={2}>
                {pct(Math.max(0, checkout.size - purchased.size), checkout.size)} of checkouts
              </td>
            </tr>
          </tbody>
        </table>

        <h2 style={S.h2}>VSL Performance</h2>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Video</th>
              <th style={S.th}>Starts</th>
              <th style={S.th}>25%</th>
              <th style={S.th}>50%</th>
              <th style={S.th}>75%</th>
              <th style={S.th}>Completed</th>
              <th style={S.th}>Completion rate</th>
            </tr>
          </thead>
          <tbody>
            {videoRows.length === 0 && (
              <tr>
                <td style={S.td} colSpan={7}>
                  No video events yet.
                </td>
              </tr>
            )}
            {videoRows.map((r) => (
              <tr key={r.vid}>
                <td style={S.td}>{r.vid}</td>
                <td style={S.td}>{r.starts}</td>
                <td style={S.td}>{r.q25}</td>
                <td style={S.td}>{r.q50}</td>
                <td style={S.td}>{r.q75}</td>
                <td style={S.td}>{r.done}</td>
                <td style={S.td}>{r.rate}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 style={S.h2}>CTA Clicks</h2>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Position</th>
              <th style={S.th}>Clicks</th>
              <th style={S.th}>Unique sessions</th>
            </tr>
          </thead>
          <tbody>
            {ctaRows.map((r) => (
              <tr key={r.pos}>
                <td style={S.td}>{r.pos}</td>
                <td style={S.td}>{r.clicks}</td>
                <td style={S.td}>{r.sessions}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 style={S.h2}>Revenue by Traffic Source</h2>
        <BreakdownTable rows={bySource} label="Source" />

        <h2 style={S.h2}>Best Converting Pages (by landing page)</h2>
        <BreakdownTable rows={byPage} label="Landing page" />

        <h2 style={S.h2}>Best Converting Reels (utm_content / utm_campaign)</h2>
        <BreakdownTable rows={byReel} label="Reel / campaign" />

        <h2 style={S.h2}>Waitlists</h2>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Waitlist</th>
              <th style={S.th}>Views</th>
              <th style={S.th}>Submits</th>
              <th style={S.th}>Confirmed</th>
              <th style={S.th}>View → submit</th>
            </tr>
          </thead>
          <tbody>
            {waitlists.map((w) => (
              <tr key={w.name}>
                <td style={S.td}>{w.name}</td>
                <td style={S.td}>{w.views}</td>
                <td style={S.td}>{w.submits}</td>
                <td style={S.td}>{w.success}</td>
                <td style={S.td}>{pct(w.submits, w.views)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function BreakdownTable({
  rows,
  label,
}: {
  rows: Array<{ key: string; views: number; buys: number; revenue: number }>;
  label: string;
}) {
  return (
    <table style={S.table}>
      <thead>
        <tr>
          <th style={S.th}>{label}</th>
          <th style={S.th}>Sessions</th>
          <th style={S.th}>Purchases</th>
          <th style={S.th}>Conversion</th>
          <th style={S.th}>Revenue</th>
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 && (
          <tr>
            <td style={S.td} colSpan={5}>
              No data yet.
            </td>
          </tr>
        )}
        {rows.map((r) => (
          <tr key={r.key}>
            <td style={S.td}>{r.key}</td>
            <td style={S.td}>{r.views}</td>
            <td style={S.td}>{r.buys}</td>
            <td style={S.td}>{pct(r.buys, r.views)}</td>
            <td style={S.td}>{money(r.revenue)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

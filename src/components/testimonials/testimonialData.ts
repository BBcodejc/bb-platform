export interface CaseStudy {
  id: string;
  playerName: string;
  context: string;
  result: string;
  details: string;
  imageUrl?: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'tobias-harris',
    playerName: 'Tobias Harris',
    context: 'NBA Forward',
    result: '47% from 3 over his next 100 attempts',
    details: 'Less than 6 sessions of 20 minutes each. A 20%+ improvement in only a few weeks.',
    imageUrl: undefined,
  },
  {
    id: 'paul-reed',
    playerName: 'Paul Reed',
    context: 'NBA Center, Philadelphia 76ers',
    result: '15% to 40% from three in-season',
    details: 'Only made 3 threes in 3 seasons before BB. Made 21 in 5 months after.',
    imageUrl: undefined,
  },
  {
    id: 'og-anunoby',
    playerName: 'OG Anunoby',
    context: 'NBA Forward',
    result: '60% from three in one month',
    details: 'Career-best shooting stretch under BB Methods.',
    imageUrl: undefined,
  },
  {
    id: 'tyler-burton',
    playerName: 'Tyler Burton',
    context: 'Villanova Basketball',
    result: '29% to 43% in two weeks',
    details: 'Applied the methods during his last year at Villanova.',
    imageUrl: undefined,
  },
  {
    id: 'tyler-perkins',
    playerName: 'Tyler Perkins',
    context: 'Villanova Guard',
    result: '24% to 40% this season',
    details: 'Applying the BB methods throughout the season.',
    imageUrl: undefined,
  },
  {
    id: 'dominick-stewart',
    playerName: 'Dominick Stewart',
    context: 'Penn State Guard',
    result: '24% to 50% this season',
    details: 'Doubled his percentage on the methods.',
    imageUrl: undefined,
  },
  {
    id: 'trey-drexler',
    playerName: 'Trey Drexler',
    context: 'D1 Commit, High School Point Guard',
    result: 'Over 40% on high volume all season',
    details: 'BB consulting throughout the entire season.',
    imageUrl: undefined,
  },
  {
    id: 'johnny-magna',
    playerName: 'Johnny Magna',
    context: 'Top HS Point Guard (Junior)',
    result: 'One of the best point guards in the country',
    details: 'Applied BB methods throughout his developmental years.',
    imageUrl: undefined,
  },
  {
    id: 'josh-powell',
    playerName: 'Josh Powell',
    context: 'Four-Star HS Prospect',
    result: 'Foundation built with BB',
    details: 'Worked with BB for many years in his development phase.',
    imageUrl: undefined,
  },
];

// Curated selections for different contexts
export const FEATURED_CASE_STUDIES = CASE_STUDIES.filter((t) =>
  ['tobias-harris', 'paul-reed', 'og-anunoby', 'tyler-burton'].includes(t.id)
);

export const PRO_CASE_STUDIES = CASE_STUDIES.filter((t) =>
  ['tobias-harris', 'paul-reed', 'og-anunoby'].includes(t.id)
);

export const COLLEGE_CASE_STUDIES = CASE_STUDIES.filter((t) =>
  ['tyler-burton', 'tyler-perkins', 'dominick-stewart'].includes(t.id)
);

export const HS_CASE_STUDIES = CASE_STUDIES.filter((t) =>
  ['trey-drexler', 'johnny-magna', 'josh-powell'].includes(t.id)
);

// Keep old exports for backwards compatibility but mark as deprecated
export type Testimonial = CaseStudy;
export const TESTIMONIALS = CASE_STUDIES;
export const FEATURED_TESTIMONIALS = FEATURED_CASE_STUDIES;
export const PRO_TESTIMONIALS = PRO_CASE_STUDIES;
export const COLLEGE_TESTIMONIALS = COLLEGE_CASE_STUDIES;
export const HS_TESTIMONIALS = HS_CASE_STUDIES;

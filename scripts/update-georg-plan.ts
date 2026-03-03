/**
 * One-time script: Regenerate Georg Nielsen's 7-day plan with updated defaults
 * - Doubled deep distance reps (20 per block)
 * - Back Rim Intentional Miss Protocol (2 rounds, 28 shots) every session
 *
 * Run: npx tsx scripts/update-georg-plan.ts
 */

import { createClient } from '@supabase/supabase-js';
import { generateStructuredPlan, DEFAULT_KNOBS, DEFAULT_SCHEDULE } from '../src/lib/seven-day-plan';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fnvwaoauxyeaewscbocf.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseServiceKey) {
  // Try loading from .env.local
  const fs = require('fs');
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  const match = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/);
  if (match) {
    process.env.SUPABASE_SERVICE_ROLE_KEY = match[1].trim();
  }
}

const supabase = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseServiceKey
);

const GEORG_PROSPECT_ID = '448c8302-ddbc-4e07-b985-3fd41d681e7c';

async function main() {
  console.log('Generating new plan with updated defaults...');
  console.log('  - Deep distance reps per block:', DEFAULT_KNOBS.deepDistanceRepsPerBlock);
  console.log('  - Deep distance step-in reps:', DEFAULT_KNOBS.deepDistanceStepInReps);
  console.log('  - Back Rim Intentional Miss Protocol:', DEFAULT_KNOBS.backRimIntentionalMissEnabled);

  // Generate the new plan
  const newPlan = generateStructuredPlan(DEFAULT_KNOBS, DEFAULT_SCHEDULE, true);

  console.log('\nSession A:', newPlan.sessions.A.name, '—', newPlan.sessions.A.totalVolume);
  console.log('Session B:', newPlan.sessions.B.name, '—', newPlan.sessions.B.totalVolume);
  console.log('Session C:', newPlan.sessions.C.name, '—', newPlan.sessions.C.totalVolume);

  // Check Session A parts
  console.log('\nSession A parts:');
  newPlan.sessions.A.parts.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.title} — ${p.totalShots} shots`);
  });

  console.log('\nSession B parts:');
  newPlan.sessions.B.parts.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.title} — ${p.totalShots} shots`);
  });

  console.log('\nSession C parts:');
  newPlan.sessions.C.parts.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.title} — ${p.totalShots} shots`);
  });

  // Update Georg's evaluation in the database
  console.log(`\nUpdating Georg Nielsen's evaluation (prospect: ${GEORG_PROSPECT_ID})...`);

  const { error } = await supabase
    .from('shooting_evaluations')
    .update({
      structured_seven_day_plan: newPlan,
      updated_at: new Date().toISOString(),
    })
    .eq('prospect_id', GEORG_PROSPECT_ID);

  if (error) {
    console.error('ERROR updating evaluation:', error);
    process.exit(1);
  }

  console.log('✅ Georg\'s plan updated successfully!');
  console.log(`\nView at: https://bb-platform-virid.vercel.app/portal/${GEORG_PROSPECT_ID}/plan`);
}

main().catch(console.error);

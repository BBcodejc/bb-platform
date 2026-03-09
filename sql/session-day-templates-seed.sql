-- =====================================================
-- SESSION DAY TEMPLATES SEED DATA
-- Pre-built day plans from the BB Session Library
-- Idempotent: deletes existing templates first
-- =====================================================

DELETE FROM session_day_templates;

-- SYSTEM DAY (Movement + Calibration + Live)
INSERT INTO session_day_templates (template_id, name, total_duration_display, min_phase, block_ids, block_notes, days_used, description) VALUES
('system-day', 'System Day', '60-70 min', 2,
 ARRAY['MV-01', 'BM-02', 'EV-01', 'SH-02', 'SH-06', 'MV-04', 'LP-04', 'LP-05', 'EV-01'],
 '{"EV-01": "Run at end — goal: higher score than baseline"}'::jsonb,
 'Mon/Wed/Fri',
 'Standard system calibration day — movement foundation, shooting calibration, live progression with contrast finish.'
);

-- MANIPULATION + DEEP DISTANCE DAY
INSERT INTO session_day_templates (template_id, name, total_duration_display, min_phase, block_ids, block_notes, days_used, description) VALUES
('manipulation-day', 'Manipulation + Deep Distance Day', '60-70 min', 2,
 ARRAY['BM-03', 'SH-09', 'SH-11', 'SH-18', 'EV-02'],
 '{}'::jsonb,
 'Tue/Thu',
 'Ball manipulation with balloon protocol, deep distance calibration, ball flight exploration, and stepback series.'
);

-- STRESS TEST DAY (Full Constraint Stack)
INSERT INTO session_day_templates (template_id, name, total_duration_display, min_phase, block_ids, block_notes, days_used, description) VALUES
('stress-test-day', 'Stress Test Day', '65-70 min', 4,
 ARRAY['MV-01', 'SH-04', 'SH-03', 'SH-14', 'SH-15', 'LP-06', 'LP-05', 'EV-01'],
 '{}'::jsonb,
 '1-2x per week',
 'Full constraint stack — strobes, oversized ball, blockers, peripheral vision tasks. Phase 4+ players only.'
);

-- GAME DAY
INSERT INTO session_day_templates (template_id, name, total_duration_display, min_phase, block_ids, block_notes, days_used, description) VALUES
('game-day', 'Game Day', '20 min', 1,
 ARRAY['SH-19'],
 '{}'::jsonb,
 'Game days',
 'Pre-game calibration routine. Oversized ball warm-up, deep distance dosage, movement patterns, contrast test out.'
);

-- IN-SEASON MAINTENANCE A
INSERT INTO session_day_templates (template_id, name, total_duration_display, min_phase, block_ids, block_notes, days_used, description) VALUES
('in-season-a', 'In-Season Maintenance A', '25 min', 1,
 ARRAY['SH-02', 'SH-08'],
 '{}'::jsonb,
 '2x per week',
 'Back rim 14-spot protocol + contrast test out with oversized ball. Quick maintenance session.'
);

-- IN-SEASON MAINTENANCE B
INSERT INTO session_day_templates (template_id, name, total_duration_display, min_phase, block_ids, block_notes, days_used, description) VALUES
('in-season-b', 'In-Season Maintenance B', '25 min', 1,
 ARRAY['SH-09', 'SH-12'],
 '{}'::jsonb,
 '2x per week',
 'Deep distance calibration + peripheral vision shooting. Alternate with Maintenance A.'
);

-- REMOTE PLAYER WEEK — Monday
INSERT INTO session_day_templates (template_id, name, total_duration_display, min_phase, block_ids, block_notes, days_used, description) VALUES
('remote-week-mon', 'Remote Player Week — Monday', '55 min', 1,
 ARRAY['MV-01', 'SH-02', 'SH-09'],
 '{}'::jsonb,
 'Monday',
 'Remote week day 1: Dowel movement + back rim protocol + deep distance calibration.'
);

-- REMOTE PLAYER WEEK — Tuesday
INSERT INTO session_day_templates (template_id, name, total_duration_display, min_phase, block_ids, block_notes, days_used, description) VALUES
('remote-week-tue', 'Remote Player Week — Tuesday', '35 min', 1,
 ARRAY['BM-01', 'SH-11'],
 '{}'::jsonb,
 'Tuesday',
 'Remote week day 2: RT/RL/DT exploration + ball flight spectrum.'
);

-- REMOTE PLAYER WEEK — Wednesday
INSERT INTO session_day_templates (template_id, name, total_duration_display, min_phase, block_ids, block_notes, days_used, description) VALUES
('remote-week-wed', 'Remote Player Week — Wednesday', '45 min', 1,
 ARRAY['MV-01', 'MV-03', 'SH-06'],
 '{}'::jsonb,
 'Wednesday',
 'Remote week day 3: Dowel movement + stop exploration + back rim to make series.'
);

-- REMOTE PLAYER WEEK — Thursday
INSERT INTO session_day_templates (template_id, name, total_duration_display, min_phase, block_ids, block_notes, days_used, description) VALUES
('remote-week-thu', 'Remote Player Week — Thursday', '55 min', 2,
 ARRAY['BM-03', 'SH-18', 'SH-09'],
 '{}'::jsonb,
 'Thursday',
 'Remote week day 4: Balloon protocol + stepback/fade series + deep distance.'
);

-- REMOTE PLAYER WEEK — Friday
INSERT INTO session_day_templates (template_id, name, total_duration_display, min_phase, block_ids, block_notes, days_used, description) VALUES
('remote-week-fri', 'Remote Player Week — Friday', '55 min', 2,
 ARRAY['MV-02', 'SH-02', 'SH-16'],
 '{}'::jsonb,
 'Friday',
 'Remote week day 5: Movement pattern library + back rim protocol + energy pattern exploration.'
);

-- UDAI WEEK 1 (Exact Blueprint)
INSERT INTO session_day_templates (template_id, name, total_duration_display, min_phase, block_ids, block_notes, days_used, description) VALUES
('udai-week-1', 'Udai Week 1', '60 min', 1,
 ARRAY['BM-03', 'MV-03', 'SH-09'],
 '{"BM-03": "Stationary 10 min, moving 10 min", "MV-03": "Smooth 7 min, abrupt 8 min", "SH-09": "Half court down to game line with trail leg step-backs, lateral bounds, misdirection hops"}'::jsonb,
 'Mon-Fri',
 'Exact Udai Week 1 blueprint — balloon, stops, deep distance progression.'
);

-- UDAI WEEK 3 MWF (System Day variant)
INSERT INTO session_day_templates (template_id, name, total_duration_display, min_phase, block_ids, block_notes, days_used, description) VALUES
('udai-week-3-mwf', 'Udai Week 3 — System Day', '65-70 min', 2,
 ARRAY['MV-01', 'EV-01', 'SH-02', 'SH-06', 'LP-01', 'LP-02'],
 '{"MV-01": "20-25 min extended dowel work", "EV-01": "Baseline test before shooting"}'::jsonb,
 'Mon/Wed/Fri',
 'Udai Week 3 constraints added — dowel protocol, shooting calibration block, movement to live blockers.'
);

-- UDAI WEEK 3 TuTh (Manipulation + Deep Distance)
INSERT INTO session_day_templates (template_id, name, total_duration_display, min_phase, block_ids, block_notes, days_used, description) VALUES
('udai-week-3-tuth', 'Udai Week 3 — Manipulation Day', '45-50 min', 2,
 ARRAY['BM-03', 'BM-04', 'SH-09', 'SH-10'],
 '{"BM-03": "Balloon with strobes progression", "SH-09": "Deep distance with contrast"}'::jsonb,
 'Tue/Thu',
 'Udai Week 3 manipulation + deep distance day with strobes added.'
);

-- UDAI WEEK 4 MWF (Stress Proof + Transfer)
INSERT INTO session_day_templates (template_id, name, total_duration_display, min_phase, block_ids, block_notes, days_used, description) VALUES
('udai-week-4-mwf', 'Udai Week 4 — System Day', '70-80 min', 3,
 ARRAY['MV-01', 'BM-02', 'EV-01', 'SH-02', 'SH-06', 'MV-04', 'LP-04', 'LP-05', 'EV-01'],
 '{"LP-04": "No blockers, blockers, blockers + strobes L1-3", "EV-01": "End proof 14-spot test"}'::jsonb,
 'Mon/Wed/Fri',
 'Udai Week 4 stress proof — full system day with live 1v1 progression through constraint stack.'
);

-- UDAI WEEK 4 TuTh (Calibration + Release Variability)
INSERT INTO session_day_templates (template_id, name, total_duration_display, min_phase, block_ids, block_notes, days_used, description) VALUES
('udai-week-4-tuth', 'Udai Week 4 — Calibration Day', '50-55 min', 2,
 ARRAY['BM-03', 'SH-09', 'SH-11', 'SH-18', 'EV-02'],
 '{"BM-03": "8 min quick balloon", "SH-18": "Stepback constraint series"}'::jsonb,
 'Tue/Thu',
 'Udai Week 4 calibration + release variability — balloon, deep distance, ball flight, stepbacks, quick test.'
);

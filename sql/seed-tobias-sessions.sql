-- =====================================================
-- SEED: Today's Pre-Game + Detroit Pistons 2025-26 Schedule
-- for Tobias Harris
-- =====================================================

-- 1. Seed today's pre-game routine
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, duration_minutes, focus_areas, link, created_by)
SELECT id, '2026-02-19', 'pre-game', 'Pre-Game Routine — vs Knicks', 'Knicks', 45,
  ARRAY['calibration', 'velocity-reset', 'post-fades'],
  '/elite/tobias-harris/pregame', 'Coach Jake'
FROM elite_players WHERE slug = 'tobias-harris'
ON CONFLICT DO NOTHING;

-- 2. Detroit Pistons 2025-26 Game Schedule
-- October 2025
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2025-10-22', 'game', '@ Chicago Bulls', 'Bulls', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2025-10-24', 'game', '@ Houston Rockets', 'Rockets', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2025-10-26', 'game', 'vs Boston Celtics', 'Celtics', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2025-10-27', 'game', 'vs Cleveland Cavaliers', 'Cavaliers', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2025-10-29', 'game', 'vs Orlando Magic', 'Magic', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';

-- November 2025
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2025-11-01', 'game', 'vs Dallas Mavericks', 'Mavericks', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2025-11-03', 'game', '@ Memphis Grizzlies', 'Grizzlies', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2025-11-05', 'game', 'vs Utah Jazz', 'Jazz', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2025-11-07', 'game', '@ Brooklyn Nets', 'Nets', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2025-11-09', 'game', '@ Philadelphia 76ers', '76ers', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2025-11-10', 'game', 'vs Washington Wizards', 'Wizards', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2025-11-12', 'game', 'vs Chicago Bulls', 'Bulls', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2025-11-14', 'game', 'vs Philadelphia 76ers', '76ers', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2025-11-17', 'game', 'vs Indiana Pacers', 'Pacers', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2025-11-18', 'game', '@ Atlanta Hawks', 'Hawks', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2025-11-22', 'game', '@ Milwaukee Bucks', 'Bucks', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2025-11-24', 'game', '@ Indiana Pacers', 'Pacers', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2025-11-26', 'game', '@ Boston Celtics', 'Celtics', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2025-11-28', 'game', 'vs Orlando Magic', 'Magic', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2025-11-29', 'game', '@ Miami Heat', 'Heat', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';

-- December 2025
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2025-12-01', 'game', 'vs Atlanta Hawks', 'Hawks', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2025-12-03', 'game', '@ Milwaukee Bucks', 'Bucks', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2025-12-05', 'game', 'vs Portland Trail Blazers', 'Trail Blazers', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2025-12-06', 'game', 'vs Milwaukee Bucks', 'Bucks', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2025-12-12', 'game', 'vs Atlanta Hawks', 'Hawks', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2025-12-15', 'game', '@ Boston Celtics', 'Celtics', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2025-12-18', 'game', '@ Dallas Mavericks', 'Mavericks', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2025-12-20', 'game', 'vs Charlotte Hornets', 'Hornets', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2025-12-22', 'game', '@ Portland Trail Blazers', 'Trail Blazers', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2025-12-23', 'game', '@ Sacramento Kings', 'Kings', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2025-12-26', 'game', '@ Utah Jazz', 'Jazz', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2025-12-28', 'game', '@ Los Angeles Clippers', 'Clippers', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2025-12-30', 'game', '@ Los Angeles Lakers', 'Lakers', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';

-- January 2026
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-01-01', 'game', 'vs Miami Heat', 'Heat', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-01-04', 'game', '@ Cleveland Cavaliers', 'Cavaliers', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-01-05', 'game', 'vs New York Knicks', 'Knicks', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-01-07', 'game', 'vs Chicago Bulls', 'Bulls', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-01-10', 'game', 'vs Los Angeles Clippers', 'Clippers', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-01-15', 'game', 'vs Phoenix Suns', 'Suns', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-01-17', 'game', 'vs Indiana Pacers', 'Pacers', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-01-19', 'game', 'vs Boston Celtics', 'Celtics', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-01-21', 'game', '@ New Orleans Pelicans', 'Pelicans', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-01-23', 'game', 'vs Houston Rockets', 'Rockets', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-01-25', 'game', 'vs Sacramento Kings', 'Kings', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-01-27', 'game', '@ Denver Nuggets', 'Nuggets', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-01-29', 'game', '@ Phoenix Suns', 'Suns', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-01-30', 'game', '@ Golden State Warriors', 'Warriors', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';

-- February 2026
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-02-01', 'game', 'vs Brooklyn Nets', 'Nets', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-02-03', 'game', 'vs Denver Nuggets', 'Nuggets', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-02-05', 'game', 'vs Washington Wizards', 'Wizards', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-02-06', 'game', 'vs New York Knicks', 'Knicks', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-02-09', 'game', '@ Charlotte Hornets', 'Hornets', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-02-11', 'game', '@ Toronto Raptors', 'Raptors', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-02-19', 'game', '@ New York Knicks', 'Knicks', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-02-21', 'game', '@ Chicago Bulls', 'Bulls', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-02-23', 'game', 'vs San Antonio Spurs', 'Spurs', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-02-25', 'game', 'vs Oklahoma City Thunder', 'Thunder', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-02-27', 'game', 'vs Cleveland Cavaliers', 'Cavaliers', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';

-- March 2026
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-03-01', 'game', '@ Orlando Magic', 'Magic', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-03-03', 'game', '@ Cleveland Cavaliers', 'Cavaliers', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-03-05', 'game', '@ San Antonio Spurs', 'Spurs', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-03-07', 'game', 'vs Brooklyn Nets', 'Nets', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-03-08', 'game', '@ Miami Heat', 'Heat', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-03-10', 'game', '@ Brooklyn Nets', 'Nets', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-03-12', 'game', 'vs Philadelphia 76ers', '76ers', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-03-13', 'game', 'vs Memphis Grizzlies', 'Grizzlies', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-03-15', 'game', '@ Toronto Raptors', 'Raptors', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-03-17', 'game', '@ Washington Wizards', 'Wizards', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-03-19', 'game', '@ Washington Wizards', 'Wizards', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-03-20', 'game', 'vs Golden State Warriors', 'Warriors', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-03-23', 'game', 'vs Los Angeles Lakers', 'Lakers', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-03-25', 'game', 'vs Atlanta Hawks', 'Hawks', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-03-26', 'game', 'vs New Orleans Pelicans', 'Pelicans', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-03-28', 'game', '@ Minnesota Timberwolves', 'Timberwolves', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-03-30', 'game', '@ Oklahoma City Thunder', 'Thunder', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-03-31', 'game', 'vs Toronto Raptors', 'Raptors', 'Schedule' FROM elite_players WHERE slug = 'tobias-harris';

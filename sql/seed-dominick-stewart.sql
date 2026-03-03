-- =====================================================
-- SEED: Dominick Stewart - Penn State Nittany Lions
-- Guard | #7 | 6'5" 195 lbs | Sophomore
-- 2025-26 Season (28 games played + 3 upcoming)
-- =====================================================

-- 1. Create Player Record
INSERT INTO elite_players (
  slug, first_name, last_name, position, team,
  bb_level, season_status, access_token, is_active
) VALUES (
  'dominick-stewart', 'Dominick', 'Stewart', 'Guard', 'Penn State Nittany Lions',
  1, 'in-season', 'ds-bb-2025', true
) ON CONFLICT (slug) DO NOTHING;

-- 2. Game Reports (elite_game_reports) - All 28 games with 3PT stats
-- Season totals: 61-153 FG (39.9%), 35-101 3PT (34.7%), 31-40 FT (77.5%), 6.7 PPG

INSERT INTO elite_game_reports (player_id, opponent, game_date, is_home, minutes_played, three_point_attempts, three_point_makes, three_point_percentage, points, field_goal_attempts, field_goal_makes)
SELECT id, 'Fairfield',         '2025-11-03', true,  12, 1, 1, 100.00, 7,  3, 3 FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_game_reports (player_id, opponent, game_date, is_home, minutes_played, three_point_attempts, three_point_makes, three_point_percentage, points, field_goal_attempts, field_goal_makes)
SELECT id, 'New Haven',         '2025-11-08', false, 22, 8, 6, 75.00,  18, 8, 6 FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_game_reports (player_id, opponent, game_date, is_home, minutes_played, three_point_attempts, three_point_makes, three_point_percentage, points, field_goal_attempts, field_goal_makes)
SELECT id, 'Navy',              '2025-11-11', true,  20, 4, 2, 50.00,  8,  5, 3 FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_game_reports (player_id, opponent, game_date, is_home, minutes_played, three_point_attempts, three_point_makes, three_point_percentage, points, field_goal_attempts, field_goal_makes)
SELECT id, 'La Salle',          '2025-11-15', true,  17, 4, 2, 50.00,  9,  7, 3 FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_game_reports (player_id, opponent, game_date, is_home, minutes_played, three_point_attempts, three_point_makes, three_point_percentage, points, field_goal_attempts, field_goal_makes)
SELECT id, 'Harvard',           '2025-11-19', true,  18, 5, 1, 20.00,  3,  5, 1 FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_game_reports (player_id, opponent, game_date, is_home, minutes_played, three_point_attempts, three_point_makes, three_point_percentage, points, field_goal_attempts, field_goal_makes)
SELECT id, 'Providence',        '2025-11-22', true,  18, 1, 0, 0.00,   3,  5, 1 FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_game_reports (player_id, opponent, game_date, is_home, minutes_played, three_point_attempts, three_point_makes, three_point_percentage, points, field_goal_attempts, field_goal_makes)
SELECT id, 'Boston University', '2025-11-25', true,  18, 3, 1, 33.33,  8,  5, 3 FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_game_reports (player_id, opponent, game_date, is_home, minutes_played, three_point_attempts, three_point_makes, three_point_percentage, points, field_goal_attempts, field_goal_makes)
SELECT id, 'Sacred Heart',      '2025-11-29', true,  26, 6, 2, 33.33,  9,  9, 2 FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_game_reports (player_id, opponent, game_date, is_home, minutes_played, three_point_attempts, three_point_makes, three_point_percentage, points, field_goal_attempts, field_goal_makes)
SELECT id, 'Campbell',          '2025-12-02', true,  26, 3, 1, 33.33,  3,  6, 1 FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_game_reports (player_id, opponent, game_date, is_home, minutes_played, three_point_attempts, three_point_makes, three_point_percentage, points, field_goal_attempts, field_goal_makes)
SELECT id, 'Indiana',           '2025-12-09', false, 16, 1, 0, 0.00,   4,  2, 1 FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_game_reports (player_id, opponent, game_date, is_home, minutes_played, three_point_attempts, three_point_makes, three_point_percentage, points, field_goal_attempts, field_goal_makes)
SELECT id, 'Michigan State',    '2025-12-13', true,  8,  2, 0, 0.00,   0,  2, 0 FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_game_reports (player_id, opponent, game_date, is_home, minutes_played, three_point_attempts, three_point_makes, three_point_percentage, points, field_goal_attempts, field_goal_makes)
SELECT id, 'Pittsburgh',        '2025-12-21', true,  10, 3, 0, 0.00,   0,  3, 0 FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_game_reports (player_id, opponent, game_date, is_home, minutes_played, three_point_attempts, three_point_makes, three_point_percentage, points, field_goal_attempts, field_goal_makes)
SELECT id, 'NC Central',        '2025-12-29', true,  15, 5, 3, 60.00,  11, 5, 3 FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_game_reports (player_id, opponent, game_date, is_home, minutes_played, three_point_attempts, three_point_makes, three_point_percentage, points, field_goal_attempts, field_goal_makes)
SELECT id, 'Illinois',          '2026-01-03', true,  26, 5, 1, 20.00,  3,  6, 1 FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_game_reports (player_id, opponent, game_date, is_home, minutes_played, three_point_attempts, three_point_makes, three_point_percentage, points, field_goal_attempts, field_goal_makes)
SELECT id, 'Michigan',          '2026-01-06', true,  26, 7, 1, 14.29,  3,  8, 1 FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_game_reports (player_id, opponent, game_date, is_home, minutes_played, three_point_attempts, three_point_makes, three_point_percentage, points, field_goal_attempts, field_goal_makes)
SELECT id, 'Purdue',            '2026-01-10', false, 21, 2, 0, 0.00,   3,  4, 0 FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_game_reports (player_id, opponent, game_date, is_home, minutes_played, three_point_attempts, three_point_makes, three_point_percentage, points, field_goal_attempts, field_goal_makes)
SELECT id, 'UCLA',              '2026-01-14', true,  37, 7, 1, 14.29,  16, 12, 5 FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_game_reports (player_id, opponent, game_date, is_home, minutes_played, three_point_attempts, three_point_makes, three_point_percentage, points, field_goal_attempts, field_goal_makes)
SELECT id, 'Maryland',          '2026-01-18', false, 32, 6, 3, 50.00,  17, 12, 7 FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_game_reports (player_id, opponent, game_date, is_home, minutes_played, three_point_attempts, three_point_makes, three_point_percentage, points, field_goal_attempts, field_goal_makes)
SELECT id, 'Wisconsin',         '2026-01-22', true,  21, 2, 0, 0.00,   6,  4, 2 FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_game_reports (player_id, opponent, game_date, is_home, minutes_played, three_point_attempts, three_point_makes, three_point_percentage, points, field_goal_attempts, field_goal_makes)
SELECT id, 'Ohio State',        '2026-01-26', false, 20, 3, 2, 66.67,  6,  3, 2 FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_game_reports (player_id, opponent, game_date, is_home, minutes_played, three_point_attempts, three_point_makes, three_point_percentage, points, field_goal_attempts, field_goal_makes)
SELECT id, 'Northwestern',      '2026-01-29', false, 26, 3, 2, 66.67,  6,  3, 2 FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_game_reports (player_id, opponent, game_date, is_home, minutes_played, three_point_attempts, three_point_makes, three_point_percentage, points, field_goal_attempts, field_goal_makes)
SELECT id, 'Minnesota',         '2026-02-01', true,  29, 3, 1, 33.33,  12, 9, 4 FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_game_reports (player_id, opponent, game_date, is_home, minutes_played, three_point_attempts, three_point_makes, three_point_percentage, points, field_goal_attempts, field_goal_makes)
SELECT id, 'Michigan',          '2026-02-05', false, 10, 1, 0, 0.00,   3,  2, 1 FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_game_reports (player_id, opponent, game_date, is_home, minutes_played, three_point_attempts, three_point_makes, three_point_percentage, points, field_goal_attempts, field_goal_makes)
SELECT id, 'USC',               '2026-02-08', true,  34, 3, 2, 66.67,  11, 5, 4 FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_game_reports (player_id, opponent, game_date, is_home, minutes_played, three_point_attempts, three_point_makes, three_point_percentage, points, field_goal_attempts, field_goal_makes)
SELECT id, 'Washington',        '2026-02-11', false, 8,  2, 1, 50.00,  3,  3, 1 FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_game_reports (player_id, opponent, game_date, is_home, minutes_played, three_point_attempts, three_point_makes, three_point_percentage, points, field_goal_attempts, field_goal_makes)
SELECT id, 'Oregon',            '2026-02-14', false, 27, 5, 2, 40.00,  8,  8, 3 FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_game_reports (player_id, opponent, game_date, is_home, minutes_played, three_point_attempts, three_point_makes, three_point_percentage, points, field_goal_attempts, field_goal_makes)
SELECT id, 'Rutgers',           '2026-02-18', true,  28, 3, 0, 0.00,   6,  3, 0 FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_game_reports (player_id, opponent, game_date, is_home, minutes_played, three_point_attempts, three_point_makes, three_point_percentage, points, field_goal_attempts, field_goal_makes)
SELECT id, 'Nebraska',          '2026-02-21', false, 22, 3, 0, 0.00,   2,  6, 1 FROM elite_players WHERE slug = 'dominick-stewart';

-- 3. Training Sessions (game calendar + upcoming)
-- Past 28 games with 3PT notes
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, notes, created_by)
SELECT id, '2025-11-03', 'game', 'vs Fairfield',         'Fairfield',         '3PT: 1/1 | PTS: 7',  'Schedule' FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, notes, created_by)
SELECT id, '2025-11-08', 'game', '@ New Haven',          'New Haven',         '3PT: 6/8 | PTS: 18', 'Schedule' FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, notes, created_by)
SELECT id, '2025-11-11', 'game', 'vs Navy',              'Navy',              '3PT: 2/4 | PTS: 8',  'Schedule' FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, notes, created_by)
SELECT id, '2025-11-15', 'game', 'vs La Salle',          'La Salle',          '3PT: 2/4 | PTS: 9',  'Schedule' FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, notes, created_by)
SELECT id, '2025-11-19', 'game', 'vs Harvard',           'Harvard',           '3PT: 1/5 | PTS: 3',  'Schedule' FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, notes, created_by)
SELECT id, '2025-11-22', 'game', 'vs Providence',        'Providence',        '3PT: 0/1 | PTS: 3',  'Schedule' FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, notes, created_by)
SELECT id, '2025-11-25', 'game', 'vs Boston University', 'Boston University', '3PT: 1/3 | PTS: 8',  'Schedule' FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, notes, created_by)
SELECT id, '2025-11-29', 'game', 'vs Sacred Heart',      'Sacred Heart',      '3PT: 2/6 | PTS: 9',  'Schedule' FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, notes, created_by)
SELECT id, '2025-12-02', 'game', 'vs Campbell',          'Campbell',          '3PT: 1/3 | PTS: 3',  'Schedule' FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, notes, created_by)
SELECT id, '2025-12-09', 'game', '@ Indiana',            'Indiana',           '3PT: 0/1 | PTS: 4',  'Schedule' FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, notes, created_by)
SELECT id, '2025-12-13', 'game', 'vs Michigan State',    'Michigan State',    '3PT: 0/2 | PTS: 0',  'Schedule' FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, notes, created_by)
SELECT id, '2025-12-21', 'game', 'vs Pittsburgh',        'Pittsburgh',        '3PT: 0/3 | PTS: 0',  'Schedule' FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, notes, created_by)
SELECT id, '2025-12-29', 'game', 'vs NC Central',        'NC Central',        '3PT: 3/5 | PTS: 11', 'Schedule' FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, notes, created_by)
SELECT id, '2026-01-03', 'game', 'vs Illinois',          'Illinois',          '3PT: 1/5 | PTS: 3',  'Schedule' FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, notes, created_by)
SELECT id, '2026-01-06', 'game', 'vs Michigan',          'Michigan',          '3PT: 1/7 | PTS: 3',  'Schedule' FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, notes, created_by)
SELECT id, '2026-01-10', 'game', '@ Purdue',             'Purdue',            '3PT: 0/2 | PTS: 3',  'Schedule' FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, notes, created_by)
SELECT id, '2026-01-14', 'game', 'vs UCLA',              'UCLA',              '3PT: 1/7 | PTS: 16', 'Schedule' FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, notes, created_by)
SELECT id, '2026-01-18', 'game', '@ Maryland',           'Maryland',          '3PT: 3/6 | PTS: 17', 'Schedule' FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, notes, created_by)
SELECT id, '2026-01-22', 'game', 'vs Wisconsin',         'Wisconsin',         '3PT: 0/2 | PTS: 6',  'Schedule' FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, notes, created_by)
SELECT id, '2026-01-26', 'game', '@ Ohio State',         'Ohio State',        '3PT: 2/3 | PTS: 6',  'Schedule' FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, notes, created_by)
SELECT id, '2026-01-29', 'game', '@ Northwestern',       'Northwestern',      '3PT: 2/3 | PTS: 6',  'Schedule' FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, notes, created_by)
SELECT id, '2026-02-01', 'game', 'vs Minnesota',         'Minnesota',         '3PT: 1/3 | PTS: 12', 'Schedule' FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, notes, created_by)
SELECT id, '2026-02-05', 'game', '@ Michigan',           'Michigan',          '3PT: 0/1 | PTS: 3',  'Schedule' FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, notes, created_by)
SELECT id, '2026-02-08', 'game', 'vs USC',               'USC',               '3PT: 2/3 | PTS: 11', 'Schedule' FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, notes, created_by)
SELECT id, '2026-02-11', 'game', '@ Washington',         'Washington',        '3PT: 1/2 | PTS: 3',  'Schedule' FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, notes, created_by)
SELECT id, '2026-02-14', 'game', '@ Oregon',             'Oregon',            '3PT: 2/5 | PTS: 8',  'Schedule' FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, notes, created_by)
SELECT id, '2026-02-18', 'game', 'vs Rutgers',           'Rutgers',           '3PT: 0/3 | PTS: 6',  'Schedule' FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, notes, created_by)
SELECT id, '2026-02-21', 'game', '@ Nebraska',           'Nebraska',          '3PT: 0/3 | PTS: 2',  'Schedule' FROM elite_players WHERE slug = 'dominick-stewart';

-- Upcoming 3 games
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-02-28', 'game', 'vs Iowa',       'Iowa',       'Schedule' FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-03-04', 'game', 'vs Ohio State',  'Ohio State', 'Schedule' FROM elite_players WHERE slug = 'dominick-stewart';
INSERT INTO elite_training_sessions (player_id, date, session_type, title, opponent, created_by)
SELECT id, '2026-03-08', 'game', '@ Rutgers',      'Rutgers',    'Schedule' FROM elite_players WHERE slug = 'dominick-stewart';

-- 4. Rolling Player Stats
INSERT INTO elite_player_stats (player_id, rolling_3_game_3pt, rolling_5_game_3pt, avg_shot_volume, current_streak, streak_games)
SELECT id, 18.18, 31.25, 3.6, 'cold', 2
FROM elite_players WHERE slug = 'dominick-stewart'
ON CONFLICT (player_id) DO UPDATE SET
  rolling_3_game_3pt = 18.18,
  rolling_5_game_3pt = 31.25,
  avg_shot_volume = 3.6,
  current_streak = 'cold',
  streak_games = 2,
  last_updated = NOW();

-- =====================================================
-- PLAYER ACCESS INFO:
-- Portal URL: /elite/dominick-stewart
-- Access Token: ds-bb-2025
-- Login: /elite/login -> token: ds-bb-2025
-- =====================================================

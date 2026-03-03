-- =====================================================
-- TOBIAS HARRIS 2025-26 GAME STATS (3PM/3PA/PTS)
-- Update existing game sessions on calendar with shooting data
-- =====================================================

-- Update each game session with 3PT stats in the notes field
-- Format: "3PT: X/Y | PTS: Z"

UPDATE elite_training_sessions
SET notes = '3PT: 1/3 | PTS: 10'
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2025-10-22' AND session_type = 'game';

UPDATE elite_training_sessions
SET notes = '3PT: 1/4 | PTS: 9'
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2025-10-24' AND session_type = 'game';

UPDATE elite_training_sessions
SET notes = '3PT: 2/7 | PTS: 18'
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2025-10-26' AND session_type = 'game';

UPDATE elite_training_sessions
SET notes = '3PT: 2/5 | PTS: 10'
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2025-10-27' AND session_type = 'game';

UPDATE elite_training_sessions
SET notes = '3PT: 1/4 | PTS: 23'
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2025-10-29' AND session_type = 'game';

UPDATE elite_training_sessions
SET notes = '3PT: 1/5 | PTS: 11'
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2025-11-01' AND session_type = 'game';

UPDATE elite_training_sessions
SET notes = '3PT: 3/5 | PTS: 18'
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2025-11-22' AND session_type = 'game';

UPDATE elite_training_sessions
SET notes = '3PT: 1/2 | PTS: 12'
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2025-11-24' AND session_type = 'game';

UPDATE elite_training_sessions
SET notes = '3PT: 1/5 | PTS: 12'
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2025-11-26' AND session_type = 'game';

UPDATE elite_training_sessions
SET notes = '3PT: 1/4 | PTS: 18'
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2025-11-28' AND session_type = 'game';

UPDATE elite_training_sessions
SET notes = '3PT: 4/6 | PTS: 26'
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2025-11-29' AND session_type = 'game';

UPDATE elite_training_sessions
SET notes = '3PT: 1/5 | PTS: 9'
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2025-12-01' AND session_type = 'game';

UPDATE elite_training_sessions
SET notes = '3PT: 5/8 | PTS: 20'
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2025-12-03' AND session_type = 'game';

UPDATE elite_training_sessions
SET notes = '3PT: 1/3 | PTS: 10'
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2025-12-05' AND session_type = 'game';

UPDATE elite_training_sessions
SET notes = '3PT: 1/2 | PTS: 9'
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2025-12-12' AND session_type = 'game';

UPDATE elite_training_sessions
SET notes = '3PT: 0/5 | PTS: 13'
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2025-12-15' AND session_type = 'game';

UPDATE elite_training_sessions
SET notes = '3PT: 0/2 | PTS: 0'
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2025-12-18' AND session_type = 'game';

UPDATE elite_training_sessions
SET notes = '3PT: 0/1 | PTS: 16'
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2025-12-20' AND session_type = 'game';

UPDATE elite_training_sessions
SET notes = '3PT: 0/3 | PTS: 12'
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2025-12-22' AND session_type = 'game';

UPDATE elite_training_sessions
SET notes = '3PT: 3/6 | PTS: 24'
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2025-12-23' AND session_type = 'game';

UPDATE elite_training_sessions
SET notes = '3PT: 1/5 | PTS: 16'
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2025-12-26' AND session_type = 'game';

UPDATE elite_training_sessions
SET notes = '3PT: 0/2 | PTS: 6'
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2025-12-28' AND session_type = 'game';

UPDATE elite_training_sessions
SET notes = '3PT: 1/1 | PTS: 7'
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2025-12-30' AND session_type = 'game';

UPDATE elite_training_sessions
SET notes = '3PT: 0/2 | PTS: 16'
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2026-01-15' AND session_type = 'game';

UPDATE elite_training_sessions
SET notes = '3PT: 1/1 | PTS: 7'
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2026-01-17' AND session_type = 'game';

UPDATE elite_training_sessions
SET notes = '3PT: 3/8 | PTS: 25'
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2026-01-19' AND session_type = 'game';

UPDATE elite_training_sessions
SET notes = '3PT: 2/6 | PTS: 10'
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2026-01-21' AND session_type = 'game';

UPDATE elite_training_sessions
SET notes = '3PT: 0/3 | PTS: 4'
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2026-01-23' AND session_type = 'game';

UPDATE elite_training_sessions
SET notes = '3PT: 4/6 | PTS: 16'
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2026-01-25' AND session_type = 'game';

UPDATE elite_training_sessions
SET notes = '3PT: 0/2 | PTS: 22'
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2026-01-27' AND session_type = 'game';

UPDATE elite_training_sessions
SET notes = '3PT: 3/4 | PTS: 13'
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2026-01-29' AND session_type = 'game';

UPDATE elite_training_sessions
SET notes = '3PT: 0/2 | PTS: 15'
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2026-01-30' AND session_type = 'game';

UPDATE elite_training_sessions
SET notes = '3PT: 2/4 | PTS: 11'
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2026-02-03' AND session_type = 'game';

UPDATE elite_training_sessions
SET notes = '3PT: 3/6 | PTS: 15'
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2026-02-06' AND session_type = 'game';

UPDATE elite_training_sessions
SET notes = '3PT: 1/4 | PTS: 11'
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2026-02-09' AND session_type = 'game';

UPDATE elite_training_sessions
SET notes = '3PT: 1/4 | PTS: 12'
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2026-02-11' AND session_type = 'game';

UPDATE elite_training_sessions
SET notes = '3PT: 1/5 | PTS: 11'
WHERE player_id = (SELECT id FROM elite_players WHERE slug = 'tobias-harris')
  AND date = '2026-02-19' AND session_type = 'game';

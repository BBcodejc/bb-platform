'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowLeft,
  Trophy,
  Target,
  Flame,
  Shield,
  Zap,
  Brain,
  Eye,
  Medal,
  Crown,
  Star,
  TrendingUp,
  ChevronUp,
} from 'lucide-react';

// Skill categories with icons
const SKILL_CATEGORIES = {
  shooting: { name: 'Shooting', icon: Target, color: 'text-gold-500' },
  finishing: { name: 'Finishing', icon: Flame, color: 'text-orange-500' },
  defense: { name: 'Defense', icon: Shield, color: 'text-blue-500' },
  movement: { name: 'Movement', icon: Zap, color: 'text-green-500' },
  passing: { name: 'Passing', icon: Eye, color: 'text-purple-500' },
  iq: { name: 'Basketball IQ', icon: Brain, color: 'text-pink-500' },
};

// Badge definitions
const BADGES = {
  // Limiting factors overcome
  energy_master: {
    id: 'energy_master',
    name: 'Energy Master',
    description: 'Overcame energy transfer limitations',
    icon: '⚡',
    category: 'limiting_factor',
    rarity: 'gold',
  },
  arc_architect: {
    id: 'arc_architect',
    name: 'Arc Architect',
    description: 'Mastered ball flight trajectory control',
    icon: '🌈',
    category: 'limiting_factor',
    rarity: 'gold',
  },
  deep_distance: {
    id: 'deep_distance',
    name: 'Deep Distance',
    description: 'Calibrated for extended range',
    icon: '🎯',
    category: 'limiting_factor',
    rarity: 'silver',
  },
  back_rim_specialist: {
    id: 'back_rim_specialist',
    name: 'Back Rim Specialist',
    description: 'Mastered back rim calibration',
    icon: '🔙',
    category: 'limiting_factor',
    rarity: 'silver',
  },
  fade_master: {
    id: 'fade_master',
    name: 'Fade Master',
    description: 'Conquered directional fades',
    icon: '↗️',
    category: 'limiting_factor',
    rarity: 'silver',
  },
  miss_profile_fixed: {
    id: 'miss_profile_fixed',
    name: 'Miss Profile Fixed',
    description: 'Eliminated consistent miss pattern',
    icon: '🔧',
    category: 'limiting_factor',
    rarity: 'bronze',
  },
  // BB Level badges
  bb_level_1: {
    id: 'bb_level_1',
    name: 'BB Level 1',
    description: 'Foundation - Energy Awareness',
    icon: '1️⃣',
    category: 'bb_level',
    rarity: 'bronze',
  },
  bb_level_2: {
    id: 'bb_level_2',
    name: 'BB Level 2',
    description: 'Calibrated - Impulse & Precision',
    icon: '2️⃣',
    category: 'bb_level',
    rarity: 'silver',
  },
  bb_level_3: {
    id: 'bb_level_3',
    name: 'BB Level 3',
    description: 'Adaptive - Constraint Integration',
    icon: '3️⃣',
    category: 'bb_level',
    rarity: 'gold',
  },
  bb_level_4: {
    id: 'bb_level_4',
    name: 'BB Level 4',
    description: 'Master - Reflexive Dominance',
    icon: '4️⃣',
    category: 'bb_level',
    rarity: 'legendary',
  },
  // Achievement badges
  first_eval: {
    id: 'first_eval',
    name: 'First Steps',
    description: 'Completed first evaluation',
    icon: '👣',
    category: 'achievement',
    rarity: 'bronze',
  },
  mentorship_enrolled: {
    id: 'mentorship_enrolled',
    name: 'Committed',
    description: 'Enrolled in 3-month mentorship',
    icon: '🤝',
    category: 'achievement',
    rarity: 'gold',
  },
  week_streak: {
    id: 'week_streak',
    name: '7-Day Warrior',
    description: 'Trained 7 days in a row',
    icon: '🔥',
    category: 'achievement',
    rarity: 'silver',
  },
  month_streak: {
    id: 'month_streak',
    name: 'Monthly Monster',
    description: 'Trained 30 days in a row',
    icon: '💪',
    category: 'achievement',
    rarity: 'gold',
  },
};

// Mock leaderboard data (would come from database)
const MOCK_LEADERBOARD = [
  {
    id: '1',
    name: 'Player A',
    initials: 'PA',
    photo: null,
    level: 'College',
    bb_level: 3,
    total_points: 2450,
    rank_change: 2,
    skills: {
      shooting: 85,
      finishing: 72,
      defense: 68,
      movement: 78,
      passing: 65,
      iq: 82,
    },
    badges: ['bb_level_3', 'energy_master', 'deep_distance', 'mentorship_enrolled', 'month_streak'],
    enrolled_since: '2024-10-15',
  },
  {
    id: '2',
    name: 'Player B',
    initials: 'PB',
    photo: null,
    level: 'High School',
    bb_level: 2,
    total_points: 1890,
    rank_change: 0,
    skills: {
      shooting: 75,
      finishing: 80,
      defense: 70,
      movement: 85,
      passing: 72,
      iq: 70,
    },
    badges: ['bb_level_2', 'arc_architect', 'back_rim_specialist', 'week_streak'],
    enrolled_since: '2024-11-01',
  },
  {
    id: '3',
    name: 'Player C',
    initials: 'PC',
    photo: null,
    level: 'NBA',
    bb_level: 4,
    total_points: 3200,
    rank_change: 1,
    skills: {
      shooting: 95,
      finishing: 88,
      defense: 75,
      movement: 90,
      passing: 82,
      iq: 92,
    },
    badges: ['bb_level_4', 'energy_master', 'arc_architect', 'deep_distance', 'fade_master', 'mentorship_enrolled', 'month_streak'],
    enrolled_since: '2024-08-01',
  },
  {
    id: '4',
    name: 'Player D',
    initials: 'PD',
    photo: null,
    level: 'G-League',
    bb_level: 3,
    total_points: 2100,
    rank_change: -1,
    skills: {
      shooting: 80,
      finishing: 75,
      defense: 82,
      movement: 78,
      passing: 70,
      iq: 75,
    },
    badges: ['bb_level_3', 'back_rim_specialist', 'miss_profile_fixed', 'mentorship_enrolled'],
    enrolled_since: '2024-09-15',
  },
  {
    id: '5',
    name: 'Player E',
    initials: 'PE',
    photo: null,
    level: 'College',
    bb_level: 2,
    total_points: 1650,
    rank_change: 3,
    skills: {
      shooting: 70,
      finishing: 68,
      defense: 72,
      movement: 75,
      passing: 80,
      iq: 78,
    },
    badges: ['bb_level_2', 'deep_distance', 'first_eval', 'week_streak'],
    enrolled_since: '2024-12-01',
  },
];

// Badge rarity colors
const RARITY_COLORS = {
  bronze: 'from-amber-700 to-amber-900 border-amber-600',
  silver: 'from-gray-300 to-gray-500 border-gray-400',
  gold: 'from-yellow-400 to-yellow-600 border-yellow-500',
  legendary: 'from-purple-500 to-pink-500 border-purple-400',
};

const RARITY_GLOW = {
  bronze: '',
  silver: 'shadow-gray-400/30',
  gold: 'shadow-yellow-500/30',
  legendary: 'shadow-purple-500/50 animate-pulse',
};

function BadgeDisplay({ badgeId, size = 'sm' }: { badgeId: string; size?: 'sm' | 'md' | 'lg' }) {
  const badge = BADGES[badgeId as keyof typeof BADGES];
  if (!badge) return null;

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl',
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${RARITY_COLORS[badge.rarity as keyof typeof RARITY_COLORS]} border-2 flex items-center justify-center shadow-lg ${RARITY_GLOW[badge.rarity as keyof typeof RARITY_GLOW]}`}
      title={`${badge.name}: ${badge.description}`}
    >
      <span>{badge.icon}</span>
    </div>
  );
}

function SkillBar({ skill, value, icon: Icon, color }: { skill: string; value: number; icon: any; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className={`w-4 h-4 ${color}`} />
      <div className="flex-1">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-400">{skill}</span>
          <span className="text-white font-medium">{value}</span>
        </div>
        <div className="h-1.5 bg-bb-border rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              value >= 90 ? 'bg-gradient-to-r from-gold-500 to-yellow-400' :
              value >= 75 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
              value >= 60 ? 'bg-gradient-to-r from-blue-500 to-cyan-400' :
              'bg-gradient-to-r from-gray-500 to-gray-400'
            }`}
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function LeaderboardCard({ player, rank }: { player: typeof MOCK_LEADERBOARD[0]; rank: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      variant={rank <= 3 ? 'gold' : 'glass'}
      className={`overflow-hidden transition-all duration-300 ${expanded ? 'ring-2 ring-gold-500/50' : ''}`}
    >
      <CardContent className="p-0">
        {/* Main row */}
        <div
          className="p-4 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => setExpanded(!expanded)}
        >
          {/* Rank */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
            rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black' :
            rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' :
            rank === 3 ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white' :
            'bg-bb-card text-gray-400 border border-bb-border'
          }`}>
            {rank <= 3 ? (
              rank === 1 ? <Crown className="w-5 h-5" /> :
              rank === 2 ? <Medal className="w-5 h-5" /> :
              <Star className="w-5 h-5" />
            ) : rank}
          </div>

          {/* Player info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500/30 to-gold-500/10 border border-gold-500/40 flex items-center justify-center">
                {player.photo ? (
                  <Image src={player.photo} alt={player.name} width={40} height={40} className="rounded-full" />
                ) : (
                  <span className="text-sm font-bold text-gold-500">{player.initials}</span>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-white">{player.name}</h3>
                <p className="text-xs text-gray-400">{player.level}</p>
              </div>
            </div>
          </div>

          {/* BB Level */}
          <div className="text-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              player.bb_level === 4 ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' :
              player.bb_level === 3 ? 'bg-gradient-to-br from-gold-500 to-yellow-600 text-black' :
              player.bb_level === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' :
              'bg-gradient-to-br from-amber-600 to-amber-800 text-white'
            }`}>
              {player.bb_level}
            </div>
            <p className="text-xs text-gray-500 mt-1">BB Level</p>
          </div>

          {/* Points & rank change */}
          <div className="text-right">
            <p className="text-lg font-bold text-white">{player.total_points.toLocaleString()}</p>
            <div className="flex items-center justify-end gap-1 text-xs">
              {player.rank_change > 0 ? (
                <>
                  <ChevronUp className="w-3 h-3 text-green-500" />
                  <span className="text-green-500">+{player.rank_change}</span>
                </>
              ) : player.rank_change < 0 ? (
                <>
                  <ChevronUp className="w-3 h-3 text-red-500 rotate-180" />
                  <span className="text-red-500">{player.rank_change}</span>
                </>
              ) : (
                <span className="text-gray-500">—</span>
              )}
            </div>
          </div>

          {/* Badges preview */}
          <div className="hidden md:flex items-center gap-1">
            {player.badges.slice(0, 4).map((badgeId) => (
              <BadgeDisplay key={badgeId} badgeId={badgeId} size="sm" />
            ))}
            {player.badges.length > 4 && (
              <span className="text-xs text-gray-500 ml-1">+{player.badges.length - 4}</span>
            )}
          </div>
        </div>

        {/* Expanded content */}
        {expanded && (
          <div className="px-4 pb-4 border-t border-bb-border pt-4 space-y-4 animate-fade-in">
            {/* Skills */}
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-3">Skill Proficiency</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(player.skills).map(([key, value]) => {
                  const category = SKILL_CATEGORIES[key as keyof typeof SKILL_CATEGORIES];
                  return (
                    <SkillBar
                      key={key}
                      skill={category.name}
                      value={value}
                      icon={category.icon}
                      color={category.color}
                    />
                  );
                })}
              </div>
            </div>

            {/* All badges */}
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-3">Badges Earned ({player.badges.length})</h4>
              <div className="flex flex-wrap gap-2">
                {player.badges.map((badgeId) => {
                  const badge = BADGES[badgeId as keyof typeof BADGES];
                  return (
                    <div key={badgeId} className="flex items-center gap-2 bg-bb-card rounded-full px-3 py-1.5 border border-bb-border">
                      <BadgeDisplay badgeId={badgeId} size="sm" />
                      <span className="text-sm text-gray-300">{badge?.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Enrolled since */}
            <p className="text-xs text-gray-500">
              Enrolled since {new Date(player.enrolled_since).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState(MOCK_LEADERBOARD);
  const [filter, setFilter] = useState<'all' | 'nba' | 'college' | 'high_school'>('all');

  // Sort by total points
  const sortedLeaderboard = [...leaderboard]
    .filter(p => {
      if (filter === 'all') return true;
      if (filter === 'nba') return p.level === 'NBA' || p.level === 'G-League';
      if (filter === 'college') return p.level === 'College';
      if (filter === 'high_school') return p.level === 'High School';
      return true;
    })
    .sort((a, b) => b.total_points - a.total_points);

  return (
    <main className="min-h-screen bg-bb-black">
      {/* Header */}
      <header className="border-b border-bb-border bg-bb-dark/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Trophy className="w-6 h-6 text-gold-500" />
                BB Leaderboard
              </h1>
              <p className="text-sm text-gray-400">Enrolled players ranked by proficiency</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card variant="glass">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-gold-500">{leaderboard.length}</p>
              <p className="text-sm text-gray-400">Enrolled Players</p>
            </CardContent>
          </Card>
          <Card variant="glass">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-purple-500">
                {leaderboard.filter(p => p.bb_level >= 3).length}
              </p>
              <p className="text-sm text-gray-400">Level 3+ Players</p>
            </CardContent>
          </Card>
          <Card variant="glass">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-green-500">
                {leaderboard.reduce((acc, p) => acc + p.badges.length, 0)}
              </p>
              <p className="text-sm text-gray-400">Total Badges Earned</p>
            </CardContent>
          </Card>
          <Card variant="glass">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-blue-500">
                {Math.round(leaderboard.reduce((acc, p) => acc + p.skills.shooting, 0) / leaderboard.length)}
              </p>
              <p className="text-sm text-gray-400">Avg Shooting Score</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { key: 'all', label: 'All Players' },
            { key: 'nba', label: 'NBA / G-League' },
            { key: 'college', label: 'College' },
            { key: 'high_school', label: 'High School' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                filter === tab.key
                  ? 'bg-gold-500 text-black'
                  : 'bg-bb-card text-gray-400 hover:text-white border border-bb-border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Leaderboard */}
        <div className="space-y-3">
          {sortedLeaderboard.map((player, index) => (
            <LeaderboardCard key={player.id} player={player} rank={index + 1} />
          ))}
        </div>

        {sortedLeaderboard.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No players found for this filter</p>
          </div>
        )}

        {/* Badge legend */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-white mb-6">Badge Legend</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(BADGES).map((badge) => (
              <div key={badge.id} className="flex items-center gap-3 p-3 bg-bb-card rounded-lg border border-bb-border">
                <BadgeDisplay badgeId={badge.id} size="md" />
                <div>
                  <p className="font-medium text-white">{badge.name}</p>
                  <p className="text-xs text-gray-400">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

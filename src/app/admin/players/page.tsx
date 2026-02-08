'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Users,
  Search,
  RefreshCw,
  Zap,
  BarChart3,
  Target,
  Calendar,
  CheckCircle2,
  Circle,
  ChevronRight,
  Mail,
  Phone,
  ArrowUpRight,
  Trophy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, formatLevel, timeAgo } from '@/lib/utils';

interface PlanLog {
  day: number;
  completed: boolean;
  completedAt?: string;
  notes?: string;
  fourteenSpotScore?: number;
  deepDistanceLineUsed?: number;
  backRimStreakAchieved?: number;
}

interface BBPlayer {
  id: string;
  evaluationId: string;
  name: string;
  email: string;
  phone: string;
  level: string;
  bbLevel: number;
  deliveredAt: string;
  planProgress: {
    completedDays: number;
    totalDays: number;
    percentage: number;
    logs: PlanLog[];
  };
  fourteenSpotScore: string;
  deepDistanceLine: string;
  hasPlan: boolean;
}

export default function BBPlayersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [players, setPlayers] = useState<BBPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/players');
      if (!res.ok) throw new Error('Failed to fetch players');
      const data = await res.json();
      setPlayers(data.players || []);
    } catch (err) {
      console.error('Error fetching players:', err);
      setError('Failed to load players');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  // Filter players by search
  const filteredPlayers = players.filter((p) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      p.name?.toLowerCase().includes(query) ||
      p.email?.toLowerCase().includes(query)
    );
  });

  // Stats
  const totalPlayers = players.length;
  const activePlayers = players.filter(p => p.planProgress.completedDays > 0).length;
  const completedPlayers = players.filter(p => p.planProgress.completedDays === 7).length;
  const avgProgress = players.length > 0
    ? Math.round(players.reduce((sum, p) => sum + p.planProgress.percentage, 0) / players.length)
    : 0;

  const getBBLevelColor = (level: number) => {
    if (level >= 4) return 'text-green-400 bg-green-500/20';
    if (level >= 3) return 'text-blue-400 bg-blue-500/20';
    if (level >= 2) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  return (
    <main className="min-h-screen bg-bb-black">
      {/* Header */}
      <header className="border-b border-bb-border bg-bb-dark/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/players/bb-logo.png"
                alt="BB"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-gold-500 font-bold tracking-wider text-sm">
                BB ADMIN
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-4">
              <Link
                href="/admin"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/evaluations"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Evaluations
              </Link>
              <Link
                href="/admin/prospects"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Prospects
              </Link>
              <Link
                href="/admin/players"
                className="text-sm text-white font-medium flex items-center gap-1"
              >
                <Trophy className="w-3.5 h-3.5 text-gold-500" />
                BB Players
              </Link>
              <Link
                href="/admin/analytics"
                className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Analytics
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchPlayers}
              disabled={loading}
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
              Refresh
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Trophy className="w-7 h-7 text-gold-500" />
            BB Players
          </h1>
          <p className="text-gray-400 mt-1">
            Track progress on delivered evaluations and 7-day implementation plans
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total BB Players</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {loading ? '...' : totalPlayers}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-gold-500/20 text-gold-500">
                  <Users className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active This Week</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {loading ? '...' : activePlayers}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400">
                  <Zap className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Completed 7-Day Plan</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {loading ? '...' : completedPlayers}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-500/20 text-green-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Avg Plan Progress</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {loading ? '...' : `${avgProgress}%`}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/20 text-purple-400">
                  <Target className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400">
            {error}
          </div>
        )}

        {/* Players Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-gold-500" />
              All BB Players
              <span className="text-sm font-normal text-gray-400">
                ({filteredPlayers.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-12 text-center text-gray-400">
                <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin opacity-50" />
                Loading players...
              </div>
            ) : filteredPlayers.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No BB players yet</p>
                <p className="text-sm mt-1">Players will appear here after you deliver evaluations</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-bb-border text-left">
                      <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Player
                      </th>
                      <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        BB Level
                      </th>
                      <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        14-Spot
                      </th>
                      <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        7-Day Progress
                      </th>
                      <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Delivered
                      </th>
                      <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-bb-border/50">
                    {filteredPlayers.map((player) => (
                      <tr
                        key={player.id}
                        className="hover:bg-bb-card/30 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-500 font-semibold">
                              {player.name?.[0] || '?'}
                            </div>
                            <div>
                              <p className="font-medium text-white">{player.name}</p>
                              <p className="text-xs text-gray-500">
                                {player.level ? formatLevel(player.level) : 'N/A'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={cn(
                            'px-2.5 py-1 rounded-full text-sm font-bold',
                            getBBLevelColor(player.bbLevel)
                          )}>
                            BB {player.bbLevel}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-white font-medium">
                            {player.fourteenSpotScore}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {/* Day dots */}
                            <div className="flex gap-1">
                              {Array.from({ length: 7 }, (_, i) => {
                                const log = player.planProgress.logs.find(l => l.day === i + 1);
                                const isCompleted = log?.completed;
                                return (
                                  <div
                                    key={i}
                                    className={cn(
                                      'w-5 h-5 rounded-full flex items-center justify-center text-xs',
                                      isCompleted
                                        ? 'bg-green-500/30 text-green-400'
                                        : 'bg-gray-700/50 text-gray-500'
                                    )}
                                  >
                                    {isCompleted ? (
                                      <CheckCircle2 className="w-3 h-3" />
                                    ) : (
                                      i + 1
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                            <span className="text-sm text-gray-400">
                              {player.planProgress.completedDays}/7
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 text-sm text-gray-400">
                            <Calendar className="w-3.5 h-3.5" />
                            {timeAgo(player.deliveredAt)}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Link href={`/admin/evaluations/${player.id}`}>
                              <Button variant="ghost" size="sm">
                                View
                                <ChevronRight className="w-4 h-4 ml-1" />
                              </Button>
                            </Link>
                            {player.email && (
                              <a
                                href={`mailto:${player.email}`}
                                className="p-2 text-gray-400 hover:text-white transition-colors"
                                title="Send email"
                              >
                                <Mail className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

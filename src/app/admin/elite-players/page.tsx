'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Plus,
  ExternalLink,
  Edit3,
  Eye,
  ChevronRight,
  User,
  Target,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ElitePlayerSummary {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  position: string;
  team: string;
  bbLevel: number;
  seasonStatus: string;
  isActive: boolean;
}

export default function ElitePlayersAdminPage() {
  const [players, setPlayers] = useState<ElitePlayerSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayers();
  }, []);

  async function fetchPlayers() {
    try {
      const res = await fetch('/api/elite-players');
      if (res.ok) {
        const data = await res.json();
        setPlayers(data.players || []);
      }
    } catch (err) {
      console.error('Failed to fetch players:', err);
    } finally {
      setLoading(false);
    }
  }

  const levelNames: Record<number, string> = {
    1: 'Foundation',
    2: 'Calibrated',
    3: 'Adaptive',
    4: 'Master',
  };

  const statusColors: Record<string, string> = {
    'in-season': 'bg-green-500/20 text-green-400',
    'off-season': 'bg-gray-500/20 text-gray-400',
    playoffs: 'bg-gold-500/20 text-gold-400',
    'pre-season': 'bg-blue-500/20 text-blue-400',
  };

  return (
    <div className="min-h-screen bg-bb-black">
      <header className="border-b border-bb-border">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-gold-500" />
              <div>
                <h1 className="text-2xl font-bold text-white">BB Players</h1>
                <p className="text-gray-400">Manage NBA, Pro & College Players</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin/elite-players/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Player
                </Button>
              </Link>
              <Link href="/admin">
                <Button variant="ghost" className="text-gray-400 hover:text-white">
                  Back to Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : players.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No BB Players Yet</h3>
              <p className="text-gray-400 mb-6">
                Add your first player to get started with BB profiles.
              </p>
              <Link href="/admin/elite-players/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Player
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {players.map((player) => (
              <Card key={player.id} hover className="overflow-hidden">
                <div className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold-500/20 to-gold-600/10 border-2 border-gold-500/30 flex items-center justify-center">
                      <User className="w-7 h-7 text-gold-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {player.firstName} {player.lastName}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>{player.position}</span>
                        <span>·</span>
                        <span>{player.team}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* BB Level */}
                    <div className="text-center">
                      <div className="flex gap-0.5 justify-center mb-1">
                        {[1, 2, 3, 4].map((l) => (
                          <div
                            key={l}
                            className={cn(
                              'w-1.5 h-4 rounded-sm',
                              l <= player.bbLevel ? 'bg-gold-500' : 'bg-gray-700'
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">
                        BB {player.bbLevel}
                      </p>
                    </div>

                    {/* Status */}
                    <span
                      className={cn(
                        'px-3 py-1 rounded-full text-xs font-medium',
                        statusColors[player.seasonStatus] || 'bg-gray-500/20 text-gray-400'
                      )}
                    >
                      {player.seasonStatus.replace('-', ' ')}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/players/${player.slug}`}>
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                          <Edit3 className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Link href={`/admin/players/${player.slug}/sessions`}>
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                          <Calendar className="w-4 h-4 mr-1" />
                          Sessions
                        </Button>
                      </Link>
                      <Link href={`/elite/${player.slug}`} target="_blank">
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

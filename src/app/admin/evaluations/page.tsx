'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { cn, timeAgo, formatLevel } from '@/lib/utils';

interface ShootingEvaluation {
  id: string;
  prospect_id: string;
  status: string;
  player_full_name: string;
  player_level: string;
  player_age: number;
  fourteen_spot_round_1_score: number;
  fourteen_spot_round_2_score: number;
  fourteen_spot_round_3_score: number;
  total_fourteen_spot_average: number;
  created_at: string;
  updated_at: string;
  prospects?: {
    first_name: string;
    last_name: string;
    email: string;
    high_ticket_prospect: boolean;
    pipeline_status: string;
  } | null;
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Evaluations' },
  { value: 'pending_review', label: 'Pending Review' },
  { value: 'review_in_progress', label: 'In Progress' },
  { value: 'approved', label: 'Approved' },
  { value: 'delivered', label: 'Delivered' },
];

function EvaluationsPageContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') || 'all';

  const [evaluations, setEvaluations] = useState<ShootingEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [totalCount, setTotalCount] = useState(0);

  const fetchEvaluations = useCallback(async () => {
    setLoading(true);
    try {
      const url = new URL('/api/admin/evaluations', window.location.origin);
      if (statusFilter && statusFilter !== 'all') {
        url.searchParams.set('status', statusFilter);
      }

      const response = await fetch(url.toString());
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setEvaluations(data.evaluations || []);
      setTotalCount(data.count || 0);
    } catch (error) {
      console.error('Error fetching evaluations:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchEvaluations();
  }, [fetchEvaluations]);

  // Filter by search
  const filteredEvaluations = evaluations.filter((e) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const name = e.player_full_name || `${e.prospects?.first_name} ${e.prospects?.last_name}`;
    return (
      name?.toLowerCase().includes(query) ||
      e.prospects?.email?.toLowerCase().includes(query)
    );
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending_review':
        return <Clock className="w-4 h-4 text-orange-400" />;
      case 'review_in_progress':
        return <AlertCircle className="w-4 h-4 text-blue-400" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-gold-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending_review':
        return 'bg-orange-500/20 text-orange-400';
      case 'review_in_progress':
        return 'bg-blue-500/20 text-blue-400';
      case 'approved':
        return 'bg-green-500/20 text-green-400';
      case 'rejected':
        return 'bg-red-500/20 text-red-400';
      case 'delivered':
        return 'bg-gold-500/20 text-gold-500';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <main className="min-h-screen bg-bb-black">
      {/* Header */}
      <header className="border-b border-bb-border bg-bb-dark/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <span className="text-white font-semibold">Evaluations</span>
            <span className="text-gray-500 text-sm">({totalCount} total)</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchEvaluations}
            disabled={loading}
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Filter className="w-4 h-4 text-gray-500 self-center" />
            {STATUS_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant={statusFilter === option.value ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter(option.value)}
                className={cn(
                  statusFilter === option.value && 'bg-gold-500 text-black'
                )}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Evaluations List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 animate-spin text-gray-500" />
          </div>
        ) : filteredEvaluations.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Clock className="w-12 h-12 mx-auto mb-4 text-gray-500 opacity-50" />
              <h3 className="text-lg font-semibold text-white mb-2">No evaluations found</h3>
              <p className="text-gray-400">
                {statusFilter !== 'all'
                  ? `No evaluations with status "${statusFilter.replace('_', ' ')}"`
                  : 'Evaluations will appear here after prospects submit their tests'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredEvaluations.map((evaluation) => {
              const name = evaluation.player_full_name ||
                `${evaluation.prospects?.first_name} ${evaluation.prospects?.last_name}`;
              const avgScore = evaluation.total_fourteen_spot_average ||
                (evaluation.fourteen_spot_round_1_score !== null &&
                 evaluation.fourteen_spot_round_2_score !== null &&
                 evaluation.fourteen_spot_round_3_score !== null
                  ? ((evaluation.fourteen_spot_round_1_score +
                      evaluation.fourteen_spot_round_2_score +
                      evaluation.fourteen_spot_round_3_score) / 3).toFixed(1)
                  : null);

              return (
                <Card key={evaluation.id} hover>
                  <CardContent className="p-0">
                    <Link
                      href={`/admin/evaluations/${evaluation.prospect_id}`}
                      className="flex items-center gap-4 p-4"
                    >
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-500 font-semibold shrink-0">
                        {name?.[0] || '?'}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white truncate">{name}</h3>
                          {evaluation.prospects?.high_ticket_prospect && (
                            <span className="flex items-center gap-1 text-xs text-gold-500">
                              <TrendingUp className="w-3 h-3" />
                              High-Ticket
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400">
                          {evaluation.player_level ? formatLevel(evaluation.player_level) : 'N/A'}
                          {evaluation.player_age && ` • Age ${evaluation.player_age}`}
                          {evaluation.prospects?.email && ` • ${evaluation.prospects.email}`}
                        </p>
                      </div>

                      {/* Score */}
                      {avgScore && (
                        <div className="text-center px-4">
                          <p className="text-2xl font-bold text-white">{avgScore}</p>
                          <p className="text-xs text-gray-500">14-Spot Avg</p>
                        </div>
                      )}

                      {/* Status */}
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className={cn(
                            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                            getStatusBadgeClass(evaluation.status)
                          )}>
                            {getStatusIcon(evaluation.status)}
                            {evaluation.status.replace(/_/g, ' ')}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {timeAgo(evaluation.created_at)}
                          </p>
                        </div>
                        <Eye className="w-4 h-4 text-gray-500" />
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

// Wrap with Suspense for useSearchParams
export default function EvaluationsPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-bb-black flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </main>
    }>
      <EvaluationsPageContent />
    </Suspense>
  );
}

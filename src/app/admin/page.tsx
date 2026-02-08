'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Users,
  ClipboardCheck,
  DollarSign,
  TrendingUp,
  Clock,
  AlertCircle,
  ArrowRight,
  Search,
  ExternalLink,
  Database,
  CreditCard,
  RefreshCw,
  Zap,
  CheckCircle,
  Calendar,
  BarChart3,
  Trophy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, timeAgo, formatLevel, formatPipelineStatus, getStatusColor, formatCurrency } from '@/lib/utils';
import { getSupabase } from '@/lib/supabase';

interface Stats {
  totalProspects: number;
  pendingReviews: number;
  highTicketProspects: number;
  totalRevenue: number;
  thisMonthRevenue: number;
  conversionRate: number;
}

interface Prospect {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  player_level: string;
  player_position: string;
  pipeline_status: string;
  updated_at: string;
  created_at: string;
  high_ticket_prospect: boolean;
  value_estimate: number;
}

interface ShootingEvaluation {
  id: string;
  prospect_id: string;
  status: string;
  player_full_name: string;
  player_level: string;
  created_at: string;
  prospects?: {
    first_name: string;
    last_name: string;
    high_ticket_prospect: boolean;
  };
}

interface ActivityItem {
  id: string;
  action: string;
  description: string;
  created_at: string;
  prospect_id: string;
}

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<Stats>({
    totalProspects: 0,
    pendingReviews: 0,
    highTicketProspects: 0,
    totalRevenue: 0,
    thisMonthRevenue: 0,
    conversionRate: 0,
  });
  const [pendingEvaluations, setPendingEvaluations] = useState<ShootingEvaluation[]>([]);
  const [recentProspects, setRecentProspects] = useState<Prospect[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/stats');
      if (!res.ok) {
        throw new Error('Failed to fetch admin stats');
      }
      const data = await res.json();
      setStats(data.stats);
      setPendingEvaluations(data.pendingEvaluations || []);
      setRecentProspects(data.recentProspects || []);
      setRecentActivity(data.recentActivity || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError('Failed to load dashboard data. Check your Supabase connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Setup Realtime subscriptions
  useEffect(() => {
    fetchData();

    const supabase = getSupabase();

    // Subscribe to prospects changes
    const prospectsChannel = supabase
      .channel('admin-prospects')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'prospects' },
        (payload) => {
          console.log('Prospect change:', payload);
          // Refresh data on any change
          fetchData();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsRealtimeConnected(true);
        }
      });

    // Subscribe to payments changes
    const paymentsChannel = supabase
      .channel('admin-payments')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'payments' },
        (payload) => {
          console.log('Payment change:', payload);
          fetchData();
        }
      )
      .subscribe();

    // Subscribe to shooting evaluations changes
    const evaluationsChannel = supabase
      .channel('admin-evaluations')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'shooting_evaluations' },
        (payload) => {
          console.log('Evaluation change:', payload);
          fetchData();
        }
      )
      .subscribe();

    // Subscribe to activity log
    const activityChannel = supabase
      .channel('admin-activity')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'activity_log' },
        (payload) => {
          console.log('New activity:', payload);
          // Add to recent activity
          if (payload.new) {
            setRecentActivity((prev) => [payload.new as ActivityItem, ...prev.slice(0, 9)]);
          }
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(prospectsChannel);
      supabase.removeChannel(paymentsChannel);
      supabase.removeChannel(evaluationsChannel);
      supabase.removeChannel(activityChannel);
      setIsRealtimeConnected(false);
    };
  }, [fetchData]);

  // Filter prospects by search
  const filteredProspects = recentProspects.filter((p) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      p.first_name?.toLowerCase().includes(query) ||
      p.last_name?.toLowerCase().includes(query) ||
      p.email?.toLowerCase().includes(query)
    );
  });

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
                className="text-sm text-white font-medium"
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
                className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
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
            {/* Realtime indicator */}
            <div
              className={cn(
                'flex items-center gap-1.5 px-2 py-1 rounded-full text-xs',
                isRealtimeConnected
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-gray-500/20 text-gray-400'
              )}
            >
              <Zap className="w-3 h-3" />
              {isRealtimeConnected ? 'Live' : 'Connecting...'}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchData}
              disabled={loading}
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
              Refresh
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search prospects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Links Banner */}
        <div className="mb-8 p-4 bg-bb-card border border-bb-border rounded-xl">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm text-gray-400 font-medium">Quick Links:</span>
            <a
              href={process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('.supabase.co', '.supabase.com/project/') || 'https://supabase.com/dashboard'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm hover:bg-emerald-500/30 transition-colors"
            >
              <Database className="w-4 h-4" />
              Supabase Dashboard
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://dashboard.stripe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg text-sm hover:bg-purple-500/30 transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              Stripe Dashboard
              <ExternalLink className="w-3 h-3" />
            </a>
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-1.5 bg-gold-500/20 text-gold-500 rounded-lg text-sm hover:bg-gold-500/30 transition-colors"
            >
              View Live Site
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400">
            <p className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </p>
          </div>
        )}

        {/* Stats row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[
            {
              label: 'Total Prospects',
              value: loading ? '...' : stats.totalProspects,
              icon: <Users className="w-5 h-5" />,
              color: 'text-blue-500',
              bgColor: 'bg-blue-500/20',
            },
            {
              label: 'Pending Review',
              value: loading ? '...' : stats.pendingReviews,
              icon: <Clock className="w-5 h-5" />,
              color: 'text-orange-500',
              bgColor: 'bg-orange-500/20',
              highlight: stats.pendingReviews > 0,
            },
            {
              label: 'High-Ticket Prospects',
              value: loading ? '...' : stats.highTicketProspects,
              icon: <TrendingUp className="w-5 h-5" />,
              color: 'text-gold-500',
              bgColor: 'bg-gold-500/20',
            },
            {
              label: 'Monthly Revenue',
              value: loading ? '...' : formatCurrency(stats.totalRevenue * 100),
              subValue: loading ? '' : new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
              icon: <DollarSign className="w-5 h-5" />,
              color: 'text-green-500',
              bgColor: 'bg-green-500/20',
            },
          ].map((stat) => (
            <div key={stat.label} className="animate-fade-in">
              <Card className={cn(stat.highlight && 'border-orange-500/50')}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">{stat.label}</p>
                      <p className="text-2xl font-bold text-white mt-1">
                        {stat.value}
                      </p>
                      {stat.subValue && (
                        <p className="text-xs text-gray-500 mt-0.5">{stat.subValue}</p>
                      )}
                    </div>
                    <div className={cn('p-3 rounded-lg', stat.bgColor, stat.color)}>
                      {stat.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Pending evaluations */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">Pending Evaluations</CardTitle>
                  {stats.pendingReviews > 0 && (
                    <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                      {stats.pendingReviews} waiting
                    </span>
                  )}
                </div>
                <Link href="/admin/evaluations">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-8 text-center text-gray-400">
                    Loading...
                  </div>
                ) : pendingEvaluations.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <ClipboardCheck className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No pending evaluations</p>
                    <p className="text-sm mt-1">New evaluations will appear here after prospects submit tests</p>
                  </div>
                ) : (
                  <div className="divide-y divide-bb-border">
                    {pendingEvaluations.map((evaluation) => (
                      <Link
                        key={evaluation.id}
                        href={`/admin/evaluations/${evaluation.prospect_id}`}
                        className="flex items-center justify-between p-4 hover:bg-bb-card/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-500 font-semibold">
                            {evaluation.player_full_name?.[0] || evaluation.prospects?.first_name?.[0] || '?'}
                          </div>
                          <div>
                            <p className="font-medium text-white">
                              {evaluation.player_full_name || `${evaluation.prospects?.first_name} ${evaluation.prospects?.last_name}`}
                            </p>
                            <p className="text-sm text-gray-400">
                              {evaluation.player_level ? formatLevel(evaluation.player_level) : 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-gray-400">
                              {timeAgo(evaluation.created_at)}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {evaluation.prospects?.high_ticket_prospect && (
                                <span className="flex items-center gap-1 text-xs text-gold-500">
                                  <TrendingUp className="w-3 h-3" />
                                  High-Ticket
                                </span>
                              )}
                              <span
                                className={cn(
                                  'text-xs px-2 py-0.5 rounded-full',
                                  evaluation.status === 'pending_review'
                                    ? 'bg-orange-500/20 text-orange-400'
                                    : evaluation.status === 'review_in_progress'
                                    ? 'bg-blue-500/20 text-blue-400'
                                    : 'bg-gray-500/20 text-gray-400'
                                )}
                              >
                                {evaluation.status.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-500" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent prospects */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Recent Prospects</CardTitle>
                <Link href="/admin/prospects">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-8 text-center text-gray-400">
                    Loading...
                  </div>
                ) : filteredProspects.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No prospects found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-bb-border">
                    {filteredProspects.slice(0, 5).map((prospect) => (
                      <Link
                        key={prospect.id}
                        href={`/admin/prospects/${prospect.id}`}
                        className="flex items-center gap-3 p-4 hover:bg-bb-card/50 transition-colors"
                      >
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full shrink-0',
                            prospect.pipeline_status === 'paid'
                              ? 'bg-green-500'
                              : prospect.pipeline_status === 'evaluation_submitted' ||
                                prospect.pipeline_status === 'tests_submitted'
                              ? 'bg-blue-500'
                              : prospect.pipeline_status === 'profile_delivered'
                              ? 'bg-gold-500'
                              : prospect.pipeline_status === 'in_pipeline' ||
                                prospect.pipeline_status === 'enrolled_mentorship'
                              ? 'bg-purple-500'
                              : 'bg-gray-500'
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">
                            {prospect.first_name} {prospect.last_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatPipelineStatus(prospect.pipeline_status)} • {timeAgo(prospect.created_at)}
                          </p>
                        </div>
                        {prospect.high_ticket_prospect && (
                          <TrendingUp className="w-3 h-3 text-gold-500 shrink-0" />
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {recentActivity.length === 0 ? (
                  <div className="p-6 text-center text-gray-400">
                    <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No recent activity</p>
                  </div>
                ) : (
                  <div className="divide-y divide-bb-border">
                    {recentActivity.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="p-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              'w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                              activity.action === 'payment_completed'
                                ? 'bg-green-500/20 text-green-400'
                                : activity.action === 'evaluation_approved'
                                ? 'bg-blue-500/20 text-blue-400'
                                : activity.action === 'status_changed'
                                ? 'bg-purple-500/20 text-purple-400'
                                : 'bg-gray-500/20 text-gray-400'
                            )}
                          >
                            {activity.action === 'payment_completed' ? (
                              <DollarSign className="w-3 h-3" />
                            ) : activity.action === 'evaluation_approved' ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <ArrowRight className="w-3 h-3" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-white line-clamp-2">
                              {activity.description}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {timeAgo(activity.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Card hover>
            <CardContent className="p-4">
              <Link
                href="/admin/evaluations?status=pending_review"
                className="flex items-center gap-4"
              >
                <div className="p-3 rounded-lg bg-orange-500/20 text-orange-500">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium text-white">Review Pending</p>
                  <p className="text-sm text-gray-400">
                    {stats.pendingReviews} evaluations waiting
                  </p>
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="p-4">
              <Link
                href="/admin/prospects?high_ticket=true"
                className="flex items-center gap-4"
              >
                <div className="p-3 rounded-lg bg-gold-500/20 text-gold-500">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium text-white">High-Ticket Pipeline</p>
                  <p className="text-sm text-gray-400">
                    {stats.highTicketProspects} prospects ready
                  </p>
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="p-4">
              <Link href="/admin/prospects" className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-500/20 text-blue-500">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium text-white">All Prospects</p>
                  <p className="text-sm text-gray-400">
                    {stats.totalProspects} in database
                  </p>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

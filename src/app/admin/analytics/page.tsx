'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  RefreshCw,
  Users,
  Eye,
  MousePointer,
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
  Target,
  ArrowRight,
  ExternalLink,
  Activity,
  BarChart3,
  Globe,
  Smartphone,
  Monitor,
} from 'lucide-react';

interface AnalyticsData {
  pageViews: PageView[];
  events: AnalyticsEvent[];
  funnelData: FunnelStep[];
  topPages: TopPage[];
  realtimeVisitors: number;
  todayStats: {
    visitors: number;
    pageViews: number;
    avgSessionDuration: number;
    bounceRate: number;
  };
  weeklyStats: {
    visitors: number;
    pageViews: number;
    conversions: number;
    revenue: number;
  };
  trafficSources: TrafficSource[];
  deviceBreakdown: DeviceData[];
}

interface PageView {
  page: string;
  views: number;
  uniqueVisitors: number;
  avgTime: number;
  bounceRate: number;
}

interface AnalyticsEvent {
  name: string;
  count: number;
  lastTriggered: string;
}

interface FunnelStep {
  step: string;
  visitors: number;
  dropoffRate: number;
}

interface TopPage {
  path: string;
  views: number;
  avgTime: number;
}

interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
}

interface DeviceData {
  device: string;
  visitors: number;
  percentage: number;
}

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days'>('7days');

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`);
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAnalytics();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-bb-black p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 text-gold-500 animate-spin" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bb-black">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-bb-dark/95 backdrop-blur-lg border-b border-bb-border">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/players/bb-logo.png"
                  alt="BB"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
              </Link>
              <Link href="/admin" className="flex items-center text-gray-400 hover:text-white transition-colors text-sm">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Dashboard
              </Link>
              <div className="h-5 w-px bg-bb-border" />
              <h1 className="text-lg font-bold text-white">Analytics</h1>
            </div>
            <div className="flex items-center gap-3">
              {/* Time Range Selector */}
              <div className="flex bg-bb-card rounded-lg p-1">
                {(['today', '7days', '30days'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                      timeRange === range
                        ? 'bg-gold-500 text-bb-black font-medium'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {range === 'today' ? 'Today' : range === '7days' ? '7 Days' : '30 Days'}
                  </button>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Real-time Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-400 font-medium">
              {analytics?.realtimeVisitors || 0} active now
            </span>
          </div>
          <span className="text-gray-500 text-sm">Auto-updates every 30s</span>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-bb-card border-bb-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Visitors</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {analytics?.weeklyStats.visitors.toLocaleString() || 0}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-bb-card border-bb-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Page Views</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {analytics?.weeklyStats.pageViews.toLocaleString() || 0}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-bb-card border-bb-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Conversions</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {analytics?.weeklyStats.conversions || 0}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-bb-card border-bb-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Revenue</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {formatCurrency(analytics?.weeklyStats.revenue || 0)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gold-500/20 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-gold-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conversion Funnel */}
        <Card className="bg-bb-card border-bb-border">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gold-500" />
              Conversion Funnel
            </h2>
            <div className="space-y-4">
              {(analytics?.funnelData || []).map((step, index) => (
                <div key={step.step}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-500 text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="text-white font-medium">{step.step}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-white font-bold">{step.visitors.toLocaleString()}</span>
                      {step.dropoffRate > 0 && (
                        <span className="text-red-400 text-sm flex items-center">
                          <TrendingDown className="w-3 h-3 mr-1" />
                          {step.dropoffRate}% drop
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="h-3 bg-bb-dark rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gold-500 to-gold-600 rounded-full transition-all duration-500"
                      style={{
                        width: `${(step.visitors / (analytics?.funnelData[0]?.visitors || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Top Pages */}
          <Card className="bg-bb-card border-bb-border">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-400" />
                Top Pages
              </h2>
              <div className="space-y-3">
                {(analytics?.topPages || []).map((page, index) => (
                  <div
                    key={page.path}
                    className="flex items-center justify-between p-3 bg-bb-dark rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 text-sm w-4">{index + 1}</span>
                      <span className="text-white text-sm truncate max-w-[200px]">
                        {page.path}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400 text-sm">{formatDuration(page.avgTime)}</span>
                      <span className="text-white font-medium">{page.views.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Traffic Sources */}
          <Card className="bg-bb-card border-bb-border">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                Traffic Sources
              </h2>
              <div className="space-y-3">
                {(analytics?.trafficSources || []).map((source) => (
                  <div key={source.source}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white text-sm">{source.source}</span>
                      <span className="text-gray-400 text-sm">
                        {source.visitors.toLocaleString()} ({source.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-bb-dark rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Device Breakdown & Session Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Device Breakdown */}
          <Card className="bg-bb-card border-bb-border">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Devices</h2>
              <div className="space-y-4">
                {(analytics?.deviceBreakdown || []).map((device) => (
                  <div key={device.device} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {device.device === 'Mobile' ? (
                        <Smartphone className="w-5 h-5 text-blue-400" />
                      ) : (
                        <Monitor className="w-5 h-5 text-green-400" />
                      )}
                      <span className="text-white">{device.device}</span>
                    </div>
                    <span className="text-gray-400">{device.percentage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Today's Stats */}
          <Card className="bg-bb-card border-bb-border md:col-span-2">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Today&apos;s Performance</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-bb-dark rounded-lg">
                  <p className="text-2xl font-bold text-white">
                    {analytics?.todayStats.visitors || 0}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Visitors</p>
                </div>
                <div className="text-center p-4 bg-bb-dark rounded-lg">
                  <p className="text-2xl font-bold text-white">
                    {analytics?.todayStats.pageViews || 0}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Page Views</p>
                </div>
                <div className="text-center p-4 bg-bb-dark rounded-lg">
                  <p className="text-2xl font-bold text-white">
                    {formatDuration(analytics?.todayStats.avgSessionDuration || 0)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Avg Session</p>
                </div>
                <div className="text-center p-4 bg-bb-dark rounded-lg">
                  <p className="text-2xl font-bold text-white">
                    {analytics?.todayStats.bounceRate || 0}%
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Bounce Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Events */}
        <Card className="bg-bb-card border-bb-border">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <MousePointer className="w-5 h-5 text-green-400" />
              Key Events Tracked
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {(analytics?.events || []).map((event) => (
                <div
                  key={event.name}
                  className="p-4 bg-bb-dark rounded-lg"
                >
                  <p className="text-white font-medium">{event.name}</p>
                  <p className="text-2xl font-bold text-gold-500 mt-1">{event.count}</p>
                  <p className="text-xs text-gray-500 mt-1">Last: {event.lastTriggered}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* External Links */}
        <div className="flex flex-wrap gap-4">
          <a
            href="https://vercel.com/bb-codes-projects/bb-platform/analytics"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-bb-card border border-bb-border rounded-lg text-gray-400 hover:text-white hover:border-gold-500 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Vercel Analytics
          </a>
          <a
            href="https://analytics.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-bb-card border border-bb-border rounded-lg text-gray-400 hover:text-white hover:border-gold-500 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Google Analytics
          </a>
          <a
            href="https://dashboard.stripe.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-bb-card border border-bb-border rounded-lg text-gray-400 hover:text-white hover:border-gold-500 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Stripe Dashboard
          </a>
        </div>
      </div>
    </main>
  );
}

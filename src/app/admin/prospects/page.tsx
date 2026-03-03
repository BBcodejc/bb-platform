'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Search,
  Filter,
  Users,
  TrendingUp,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Send,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { cn, timeAgo, formatLevel, formatPipelineStatus, getStatusColor, formatCurrency } from '@/lib/utils';

interface Prospect {
  id: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  role: string;
  player_level: string;
  pipeline_status: string;
  high_ticket_prospect: boolean;
  value_estimate: number;
  created_at: string;
  updated_at: string;
}

interface EmailSequence {
  id: string;
  email: string;
  first_name: string;
  application_type: string;
  status: string;
  email_1_sent_at: string | null;
  email_1_error: string | null;
  email_2_scheduled_for: string | null;
  email_2_sent_at: string | null;
  email_2_error: string | null;
  email_3_scheduled_for: string | null;
  email_3_sent_at: string | null;
  email_3_error: string | null;
  retry_count: number;
  created_at: string;
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'call_booked', label: 'Call Booked' },
  { value: 'intake_completed', label: 'Intake Done' },
  { value: 'payment_pending', label: 'Payment Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'evaluation_submitted', label: 'Eval Submitted' },
  { value: 'in_pipeline', label: 'In Pipeline' },
  { value: 'profile_delivered', label: 'Delivered' },
  { value: 'enrolled_mentorship', label: 'Mentorship' },
  { value: 'closed_won', label: 'Won' },
  { value: 'closed_lost', label: 'Lost' },
];

const ROLE_OPTIONS = [
  { value: 'all', label: 'All Roles' },
  { value: 'player', label: 'Players' },
  { value: 'parent', label: 'Parents' },
  { value: 'coach', label: 'Coaches' },
  { value: 'organization', label: 'Organizations' },
];

const PAGE_SIZE = 20;

function ProspectsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialStatus = searchParams.get('status') || 'all';
  const initialHighTicket = searchParams.get('high_ticket') === 'true';
  const initialPage = parseInt(searchParams.get('page') || '1');
  const initialTab = searchParams.get('tab') || 'prospects';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [sequences, setSequences] = useState<EmailSequence[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [roleFilter, setRoleFilter] = useState('all');
  const [highTicketOnly, setHighTicketOnly] = useState(initialHighTicket);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalCount, setTotalCount] = useState(0);
  const [seqFilter, setSeqFilter] = useState('all');

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const fetchProspects = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (roleFilter !== 'all') params.set('role', roleFilter);
      if (highTicketOnly) params.set('high_ticket', 'true');
      if (searchQuery) params.set('search', searchQuery);
      params.set('page', currentPage.toString());

      const response = await fetch(`/api/admin/prospects?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setProspects(data.prospects || []);
      setTotalCount(data.total || 0);
    } catch (error) {
      console.error('Error fetching prospects:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, roleFilter, highTicketOnly, searchQuery, currentPage]);

  const fetchSequences = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/email-sequences');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setSequences(data.sequences || []);
    } catch (error) {
      console.error('Error fetching sequences:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'prospects') {
      fetchProspects();
    } else {
      fetchSequences();
    }
  }, [activeTab, fetchProspects, fetchSequences]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeTab !== 'prospects') params.set('tab', activeTab);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (highTicketOnly) params.set('high_ticket', 'true');
    if (currentPage > 1) params.set('page', currentPage.toString());

    const newUrl = params.toString() ? `?${params.toString()}` : '/admin/prospects';
    router.replace(newUrl, { scroll: false });
  }, [statusFilter, highTicketOnly, currentPage, activeTab, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProspects();
  };

  const filteredSequences = sequences.filter((s) => {
    if (seqFilter === 'all') return true;
    return s.status === seqFilter;
  });

  function formatScheduledDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.round(diff / (1000 * 60 * 60));
    if (hours <= 0) return 'Due now';
    if (hours < 24) return `in ${hours}h`;
    const days = Math.round(hours / 24);
    return `in ${days}d`;
  }

  function formatAppType(type: string): string {
    switch (type) {
      case 'full_assessment_application': return 'Player';
      case 'coach_cert_application': return 'Coach';
      case 'organization_inquiry': return 'Organization';
      default: return type;
    }
  }

  function getEmailStepStatus(seq: EmailSequence, step: 1 | 2 | 3) {
    const sentKey = `email_${step}_sent_at` as keyof EmailSequence;
    const errorKey = `email_${step}_error` as keyof EmailSequence;
    const scheduledKey = `email_${step}_scheduled_for` as keyof EmailSequence;

    if (seq.status === 'unsubscribed' && !seq[sentKey]) return 'skipped';
    if (seq[sentKey]) return 'sent';
    if (seq[errorKey]) return 'error';
    if (seq[scheduledKey]) return 'scheduled';
    return 'pending';
  }

  function renderEmailBadge(status: string, label: string) {
    switch (status) {
      case 'sent':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-500/10 text-green-400 border border-green-500/20">
            <CheckCircle2 className="w-3 h-3" />
            {label}
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Clock className="w-3 h-3" />
            {label}
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-red-500/10 text-red-400 border border-red-500/20">
            <XCircle className="w-3 h-3" />
            {label}
          </span>
        );
      case 'skipped':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-500/10 text-gray-500 border border-gray-500/20">
            {label}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-500/10 text-gray-600 border border-gray-500/20">
            {label}
          </span>
        );
    }
  }

  function getSeqStatusBadge(status: string) {
    switch (status) {
      case 'active':
        return <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20">Active</span>;
      case 'completed':
        return <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/10 text-green-400 border border-green-500/20">Completed</span>;
      case 'unsubscribed':
        return <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">Unsubscribed</span>;
      case 'failed':
        return <span className="px-2 py-0.5 rounded-full text-xs bg-red-500/10 text-red-400 border border-red-500/20">Failed</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-xs bg-gray-500/10 text-gray-400">{status}</span>;
    }
  }

  // Stats for email sequences
  const seqStats = {
    total: sequences.length,
    active: sequences.filter((s) => s.status === 'active').length,
    completed: sequences.filter((s) => s.status === 'completed').length,
    unsubscribed: sequences.filter((s) => s.status === 'unsubscribed').length,
    failed: sequences.filter((s) => s.status === 'failed').length,
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
            <span className="text-white font-semibold">CRM</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => activeTab === 'prospects' ? fetchProspects() : fetchSequences()}
            disabled={loading}
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 -mb-px">
            <button
              onClick={() => { setActiveTab('prospects'); setCurrentPage(1); }}
              className={cn(
                'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors',
                activeTab === 'prospects'
                  ? 'border-gold-500 text-white'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              )}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Prospects ({totalCount})
            </button>
            <button
              onClick={() => { setActiveTab('emails'); }}
              className={cn(
                'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors',
                activeTab === 'emails'
                  ? 'border-gold-500 text-white'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              )}
            >
              <Send className="w-4 h-4 inline mr-2" />
              Email Sequences ({seqStats.total})
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ─── PROSPECTS TAB ──────────────────────────────────── */}
        {activeTab === 'prospects' && (
          <>
            {/* Filters */}
            <div className="space-y-4 mb-6">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    placeholder="Search by name, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit">Search</Button>
              </form>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-400">Status:</span>
                  <div className="flex flex-wrap gap-1">
                    {STATUS_OPTIONS.slice(0, 6).map((option) => (
                      <Button
                        key={option.value}
                        variant={statusFilter === option.value ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => { setStatusFilter(option.value); setCurrentPage(1); }}
                        className={cn('text-xs', statusFilter === option.value && 'bg-gold-500 text-black')}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-400">Role:</span>
                  <div className="flex gap-1">
                    {ROLE_OPTIONS.map((option) => (
                      <Button
                        key={option.value}
                        variant={roleFilter === option.value ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => { setRoleFilter(option.value); setCurrentPage(1); }}
                        className={cn('text-xs', roleFilter === option.value && 'bg-gold-500 text-black')}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  variant={highTicketOnly ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => { setHighTicketOnly(!highTicketOnly); setCurrentPage(1); }}
                  className={cn('text-xs gap-1', highTicketOnly && 'bg-gold-500 text-black')}
                >
                  <TrendingUp className="w-3 h-3" />
                  High-Ticket Only
                </Button>
              </div>
            </div>

            {/* Prospects Table */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <RefreshCw className="w-8 h-8 animate-spin text-gray-500" />
              </div>
            ) : prospects.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-500 opacity-50" />
                  <h3 className="text-lg font-semibold text-white mb-2">No prospects found</h3>
                  <p className="text-gray-400">Try adjusting your filters or search query</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="bg-bb-card border border-bb-border rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-bb-border bg-bb-dark/50">
                          <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3">Prospect</th>
                          <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3">Role</th>
                          <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3">Status</th>
                          <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3">Value</th>
                          <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3">Created</th>
                          <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3">Contact</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-bb-border">
                        {prospects.map((prospect) => (
                          <tr
                            key={prospect.id}
                            className="hover:bg-bb-card/50 transition-colors cursor-pointer"
                            onClick={() => router.push(`/admin/prospects/${prospect.id}`)}
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-500 text-sm font-semibold">
                                  {prospect.first_name?.[0] || '?'}
                                </div>
                                <div>
                                  <p className="font-medium text-white">{prospect.first_name} {prospect.last_name}</p>
                                  <p className="text-xs text-gray-500">{prospect.email}</p>
                                </div>
                                {prospect.high_ticket_prospect && <TrendingUp className="w-4 h-4 text-gold-500" />}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-gray-300 capitalize">{prospect.role || 'N/A'}</span>
                              {prospect.player_level && <p className="text-xs text-gray-500">{formatLevel(prospect.player_level)}</p>}
                            </td>
                            <td className="px-4 py-3">
                              <span className={cn('inline-flex px-2 py-0.5 rounded-full text-xs font-medium', getStatusColor(prospect.pipeline_status), 'text-white')}>
                                {formatPipelineStatus(prospect.pipeline_status)}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {prospect.value_estimate > 0 ? (
                                <span className="flex items-center gap-1 text-sm text-green-400">
                                  <DollarSign className="w-3 h-3" />
                                  {prospect.value_estimate.toLocaleString()}
                                </span>
                              ) : (
                                <span className="text-sm text-gray-500">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1 text-sm text-gray-400">
                                <Calendar className="w-3 h-3" />
                                {timeAgo(prospect.created_at)}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                {prospect.email && (
                                  <a href={`mailto:${prospect.email}`} onClick={(e) => e.stopPropagation()} className="p-1.5 rounded-lg hover:bg-bb-border transition-colors">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                  </a>
                                )}
                                {prospect.phone && (
                                  <a href={`tel:${prospect.phone}`} onClick={(e) => e.stopPropagation()} className="p-1.5 rounded-lg hover:bg-bb-border transition-colors">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                  </a>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-gray-400">
                      Showing {(currentPage - 1) * PAGE_SIZE + 1} to {Math.min(currentPage * PAGE_SIZE, totalCount)} of {totalCount}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                        <ChevronLeft className="w-4 h-4" /> Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum: number;
                          if (totalPages <= 5) pageNum = i + 1;
                          else if (currentPage <= 3) pageNum = i + 1;
                          else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                          else pageNum = currentPage - 2 + i;
                          return (
                            <Button key={pageNum} variant={currentPage === pageNum ? 'default' : 'ghost'} size="sm" onClick={() => setCurrentPage(pageNum)}
                              className={cn('w-8 h-8 p-0', currentPage === pageNum && 'bg-gold-500 text-black')}>
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                        Next <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ─── EMAIL SEQUENCES TAB ────────────────────────────── */}
        {activeTab === 'emails' && (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
              {[
                { label: 'Total', value: seqStats.total, color: 'text-white' },
                { label: 'Active', value: seqStats.active, color: 'text-blue-400' },
                { label: 'Completed', value: seqStats.completed, color: 'text-green-400' },
                { label: 'Unsubscribed', value: seqStats.unsubscribed, color: 'text-yellow-400' },
                { label: 'Failed', value: seqStats.failed, color: 'text-red-400' },
              ].map((stat) => (
                <div key={stat.label} className="bg-bb-card border border-bb-border rounded-lg p-4 text-center">
                  <p className={cn('text-2xl font-bold', stat.color)}>{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-400">Filter:</span>
              {['all', 'active', 'completed', 'unsubscribed', 'failed'].map((f) => (
                <Button
                  key={f}
                  variant={seqFilter === f ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSeqFilter(f)}
                  className={cn('text-xs capitalize', seqFilter === f && 'bg-gold-500 text-black')}
                >
                  {f}
                </Button>
              ))}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <RefreshCw className="w-8 h-8 animate-spin text-gray-500" />
              </div>
            ) : filteredSequences.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Send className="w-12 h-12 mx-auto mb-4 text-gray-500 opacity-50" />
                  <h3 className="text-lg font-semibold text-white mb-2">No email sequences yet</h3>
                  <p className="text-gray-400">Sequences are created when someone submits an application</p>
                </CardContent>
              </Card>
            ) : (
              <div className="bg-bb-card border border-bb-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-bb-border bg-bb-dark/50">
                        <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3">Contact</th>
                        <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3">Type</th>
                        <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3">Status</th>
                        <th className="text-center text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3">Email 1</th>
                        <th className="text-center text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3">Email 2</th>
                        <th className="text-center text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3">Email 3</th>
                        <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3">Applied</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-bb-border">
                      {filteredSequences.map((seq) => (
                        <tr key={seq.id} className="hover:bg-bb-card/50 transition-colors">
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-white">{seq.first_name || 'Unknown'}</p>
                              <p className="text-xs text-gray-500">{seq.email}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-300">{formatAppType(seq.application_type)}</span>
                          </td>
                          <td className="px-4 py-3">
                            {getSeqStatusBadge(seq.status)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {renderEmailBadge(
                              getEmailStepStatus(seq, 1),
                              getEmailStepStatus(seq, 1) === 'sent' ? 'Sent' : getEmailStepStatus(seq, 1) === 'error' ? 'Failed' : '—'
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {renderEmailBadge(
                              getEmailStepStatus(seq, 2),
                              getEmailStepStatus(seq, 2) === 'sent'
                                ? 'Sent'
                                : getEmailStepStatus(seq, 2) === 'scheduled'
                                ? formatScheduledDate(seq.email_2_scheduled_for!)
                                : getEmailStepStatus(seq, 2) === 'error'
                                ? 'Failed'
                                : '—'
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {renderEmailBadge(
                              getEmailStepStatus(seq, 3),
                              getEmailStepStatus(seq, 3) === 'sent'
                                ? 'Sent'
                                : getEmailStepStatus(seq, 3) === 'scheduled'
                                ? formatScheduledDate(seq.email_3_scheduled_for!)
                                : getEmailStepStatus(seq, 3) === 'error'
                                ? 'Failed'
                                : '—'
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 text-sm text-gray-400">
                              <Calendar className="w-3 h-3" />
                              {timeAgo(seq.created_at)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default function ProspectsPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-bb-black flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </main>
    }>
      <ProspectsPageContent />
    </Suspense>
  );
}

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

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
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

  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [roleFilter, setRoleFilter] = useState('all');
  const [highTicketOnly, setHighTicketOnly] = useState(initialHighTicket);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalCount, setTotalCount] = useState(0);

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

  useEffect(() => {
    fetchProspects();
  }, [fetchProspects]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (highTicketOnly) params.set('high_ticket', 'true');
    if (currentPage > 1) params.set('page', currentPage.toString());

    const newUrl = params.toString() ? `?${params.toString()}` : '/admin/prospects';
    router.replace(newUrl, { scroll: false });
  }, [statusFilter, highTicketOnly, currentPage, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProspects();
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
            <span className="text-white font-semibold">Prospects</span>
            <span className="text-gray-500 text-sm">({totalCount} total)</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchProspects}
            disabled={loading}
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="space-y-4 mb-6">
          {/* Search */}
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

          {/* Filter buttons */}
          <div className="flex flex-wrap gap-4">
            {/* Status filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-400">Status:</span>
              <div className="flex flex-wrap gap-1">
                {STATUS_OPTIONS.slice(0, 6).map((option) => (
                  <Button
                    key={option.value}
                    variant={statusFilter === option.value ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => {
                      setStatusFilter(option.value);
                      setCurrentPage(1);
                    }}
                    className={cn(
                      'text-xs',
                      statusFilter === option.value && 'bg-gold-500 text-black'
                    )}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Role filter */}
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-400">Role:</span>
              <div className="flex gap-1">
                {ROLE_OPTIONS.map((option) => (
                  <Button
                    key={option.value}
                    variant={roleFilter === option.value ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => {
                      setRoleFilter(option.value);
                      setCurrentPage(1);
                    }}
                    className={cn(
                      'text-xs',
                      roleFilter === option.value && 'bg-gold-500 text-black'
                    )}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* High-ticket filter */}
            <Button
              variant={highTicketOnly ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                setHighTicketOnly(!highTicketOnly);
                setCurrentPage(1);
              }}
              className={cn(
                'text-xs gap-1',
                highTicketOnly && 'bg-gold-500 text-black'
              )}
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
              <p className="text-gray-400">
                Try adjusting your filters or search query
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Table */}
            <div className="bg-bb-card border border-bb-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-bb-border bg-bb-dark/50">
                      <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3">
                        Prospect
                      </th>
                      <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3">
                        Role
                      </th>
                      <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3">
                        Status
                      </th>
                      <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3">
                        Value
                      </th>
                      <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3">
                        Created
                      </th>
                      <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-4 py-3">
                        Contact
                      </th>
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
                              <p className="font-medium text-white">
                                {prospect.first_name} {prospect.last_name}
                              </p>
                              <p className="text-xs text-gray-500">{prospect.email}</p>
                            </div>
                            {prospect.high_ticket_prospect && (
                              <TrendingUp className="w-4 h-4 text-gold-500" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-300 capitalize">
                            {prospect.role || 'N/A'}
                          </span>
                          {prospect.player_level && (
                            <p className="text-xs text-gray-500">
                              {formatLevel(prospect.player_level)}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              'inline-flex px-2 py-0.5 rounded-full text-xs font-medium',
                              getStatusColor(prospect.pipeline_status),
                              'text-white'
                            )}
                          >
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
                              <a
                                href={`mailto:${prospect.email}`}
                                onClick={(e) => e.stopPropagation()}
                                className="p-1.5 rounded-lg hover:bg-bb-border transition-colors"
                              >
                                <Mail className="w-4 h-4 text-gray-400" />
                              </a>
                            )}
                            {prospect.phone && (
                              <a
                                href={`tel:${prospect.phone}`}
                                onClick={(e) => e.stopPropagation()}
                                className="p-1.5 rounded-lg hover:bg-bb-border transition-colors"
                              >
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
                  Showing {(currentPage - 1) * PAGE_SIZE + 1} to{' '}
                  {Math.min(currentPage * PAGE_SIZE, totalCount)} of {totalCount} prospects
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className={cn(
                            'w-8 h-8 p-0',
                            currentPage === pageNum && 'bg-gold-500 text-black'
                          )}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

// Wrap with Suspense for useSearchParams
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

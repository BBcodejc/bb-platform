'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  TrendingUp,
  User,
  ClipboardList,
  Save,
  Trash2,
  ExternalLink,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, timeAgo, formatLevel, formatPipelineStatus, getStatusColor, formatCurrency } from '@/lib/utils';
import { getSupabase } from '@/lib/supabase';

interface Prospect {
  id: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  role: string;
  player_level: string;
  player_main_goal: string;
  player_problem: string;
  player_age: string;
  player_location: string;
  player_instagram: string;
  pipeline_status: string;
  high_ticket_prospect: boolean;
  value_estimate: number;
  notes: string;
  internal_notes: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  routing_recommendation: string;
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  product_type: string;
  created_at: string;
  completed_at: string;
}

interface ActivityItem {
  id: string;
  action: string;
  description: string;
  created_at: string;
}

const PIPELINE_STATUSES = [
  'new',
  'intake_completed',
  'payment_pending',
  'paid',
  'evaluation_submitted',
  'tests_submitted',
  'review_in_progress',
  'in_pipeline',
  'profile_delivered',
  'enrolled_mentorship',
  'closed_won',
  'closed_lost',
];

export default function ProspectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const prospectId = params.id as string;

  const [prospect, setProspect] = useState<Prospect | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editedNotes, setEditedNotes] = useState('');
  const [editedStatus, setEditedStatus] = useState('');

  useEffect(() => {
    const fetchProspect = async () => {
      setLoading(true);
      try {
        // Use server-side API to bypass RLS
        const response = await fetch(`/api/admin/prospects/${prospectId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch prospect');
        }

        const data = await response.json();

        if (data.prospect) {
          setProspect(data.prospect);
          setEditedNotes(data.prospect.internal_notes || '');
          setEditedStatus(data.prospect.pipeline_status || 'new');
        }

        setPayments(data.payments || []);
        setActivity([]);
      } catch (error) {
        console.error('Error fetching prospect:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProspect();
  }, [prospectId]);

  const handleSave = async () => {
    if (!prospect) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/prospects/${prospectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          internal_notes: editedNotes,
          pipeline_status: editedStatus,
        }),
      });

      if (!response.ok) throw new Error('Failed to save');

      // Update local state
      setProspect({
        ...prospect,
        internal_notes: editedNotes,
        pipeline_status: editedStatus,
      });

      alert('Saved successfully!');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this prospect? This action cannot be undone.')) {
      return;
    }

    try {
      const supabase = getSupabase();
      const { error } = await supabase.from('prospects').delete().eq('id', prospectId);

      if (error) throw error;

      router.push('/admin/prospects');
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete prospect');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-bb-black flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </main>
    );
  }

  if (!prospect) {
    return (
      <main className="min-h-screen bg-bb-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Prospect not found</h2>
          <Link href="/admin/prospects">
            <Button>Back to Prospects</Button>
          </Link>
        </div>
      </main>
    );
  }

  const totalPaid = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <main className="min-h-screen bg-bb-black">
      {/* Header */}
      <header className="border-b border-bb-border bg-bb-dark/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/prospects">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Prospects
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">
                {prospect.first_name} {prospect.last_name}
              </span>
              {prospect.high_ticket_prospect && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-gold-500/20 text-gold-500 rounded-full text-xs">
                  <TrendingUp className="w-3 h-3" />
                  High-Ticket
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-gold-500" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Email</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <a href={`mailto:${prospect.email}`} className="text-white hover:text-gold-500">
                        {prospect.email}
                      </a>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Phone</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {prospect.phone ? (
                        <a href={`tel:${prospect.phone}`} className="text-white hover:text-gold-500">
                          {prospect.phone}
                        </a>
                      ) : (
                        <span className="text-gray-500">Not provided</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Role</label>
                    <p className="text-white mt-1 capitalize">{prospect.role || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Level</label>
                    <p className="text-white mt-1">{prospect.player_level ? formatLevel(prospect.player_level) : 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Age</label>
                    <p className="text-white mt-1">{prospect.player_age || 'N/A'}</p>
                  </div>
                </div>

                {prospect.player_location && (
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Location</label>
                    <p className="text-white mt-1">{prospect.player_location}</p>
                  </div>
                )}

                {prospect.player_instagram && (
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Instagram</label>
                    <a
                      href={`https://instagram.com/${prospect.player_instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-white hover:text-gold-500 mt-1"
                    >
                      {prospect.player_instagram}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Intake Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-gold-500" />
                  Intake Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {prospect.player_main_goal && (
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Main Goal</label>
                    <p className="text-white mt-1">{prospect.player_main_goal.replace(/_/g, ' ')}</p>
                  </div>
                )}
                {prospect.player_problem && (
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Main Problem</label>
                    <p className="text-white mt-1">{prospect.player_problem.replace(/_/g, ' ')}</p>
                  </div>
                )}
                {prospect.routing_recommendation && (
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Routing Recommendation</label>
                    <p className="text-white mt-1">{prospect.routing_recommendation.replace(/_/g, ' ')}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Admin Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Internal Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={editedNotes}
                  onChange={(e) => setEditedNotes(e.target.value)}
                  placeholder="Add internal notes about this prospect..."
                  className="min-h-[120px]"
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pipeline Status</CardTitle>
              </CardHeader>
              <CardContent>
                <select
                  value={editedStatus}
                  onChange={(e) => setEditedStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-bb-dark border border-bb-border text-white focus:outline-none focus:border-gold-500"
                >
                  {PIPELINE_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {formatPipelineStatus(status)}
                    </option>
                  ))}
                </select>
                <div className="mt-4 flex items-center gap-2">
                  <div
                    className={cn(
                      'w-3 h-3 rounded-full',
                      getStatusColor(editedStatus).replace('bg-', 'bg-')
                    )}
                  />
                  <span className="text-sm text-gray-400">Current Status</span>
                </div>
              </CardContent>
            </Card>

            {/* Value Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Estimated Value</label>
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency((prospect.value_estimate || 0) * 100)}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Total Paid</label>
                    <p className="text-xl font-semibold text-green-400">
                      {formatCurrency(totalPaid)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payments */}
            {payments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payments</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-bb-border">
                    {payments.map((payment) => (
                      <div key={payment.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">
                              {formatCurrency(payment.amount)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {payment.product_type?.replace(/_/g, ' ')}
                            </p>
                          </div>
                          <span
                            className={cn(
                              'text-xs px-2 py-0.5 rounded-full',
                              payment.status === 'completed'
                                ? 'bg-green-500/20 text-green-400'
                                : payment.status === 'pending'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-red-500/20 text-red-400'
                            )}
                          >
                            {payment.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {timeAgo(payment.created_at)}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-gold-500" />
                  Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {activity.length === 0 ? (
                  <div className="p-4 text-center text-gray-400 text-sm">
                    No activity yet
                  </div>
                ) : (
                  <div className="divide-y divide-bb-border">
                    {activity.slice(0, 5).map((item) => (
                      <div key={item.id} className="p-3">
                        <p className="text-xs text-white">{item.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {timeAgo(item.created_at)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Dates */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400">Created:</span>
                    <span className="text-white">{timeAgo(prospect.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400">Updated:</span>
                    <span className="text-white">{timeAgo(prospect.updated_at)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-2">
              <Link href={`/admin/evaluations/${prospect.id}`}>
                <Button variant="secondary" className="w-full">
                  View Evaluation
                </Button>
              </Link>
              <Link href={`/portal/${prospect.id}`} target="_blank">
                <Button variant="ghost" className="w-full">
                  Open Test Portal
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

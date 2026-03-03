'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, ExternalLink, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function CoachingClientDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [client, setClient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/coaching/clients/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setClient(data.client);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bb-black flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-bb-black flex items-center justify-center">
        <p className="text-gray-500">Client not found.</p>
      </div>
    );
  }

  const assessment = client.week0_assessments?.[0];

  return (
    <div className="min-h-screen bg-bb-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <Link
          href="/admin/coaching-clients"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gold-500 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Clients
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gold-500/20 flex items-center justify-center">
              <User className="w-7 h-7 text-gold-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {client.first_name} {client.last_name}
              </h1>
              <p className="text-sm text-gray-400">
                {client.level} · {client.program_type} · Week {client.current_week}
              </p>
            </div>
          </div>
          <Link
            href={`/coaching/assessment/${client.slug}`}
            target="_blank"
          >
            <Button className="gap-2">
              <ExternalLink className="w-4 h-4" />
              Assessment Link
            </Button>
          </Link>
        </div>

        {/* Client Info */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-bb-card border border-bb-border rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-semibold text-gold-500">Contact Info</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="text-white">{client.email || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phone</span>
                <span className="text-white">{client.phone || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Age</span>
                <span className="text-white">{client.age || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Position</span>
                <span className="text-white">{client.position || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Team</span>
                <span className="text-white">{client.team || '—'}</span>
              </div>
            </div>
          </div>

          <div className="bg-bb-card border border-bb-border rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-semibold text-gold-500">Program Status</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Current Week</span>
                <span className="text-white">{client.current_week}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Program Type</span>
                <span className="text-white">{client.program_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Onboarding</span>
                <span className={client.onboarding_complete ? 'text-green-400' : 'text-amber-400'}>
                  {client.onboarding_complete ? 'Complete' : 'In Progress'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Active</span>
                <span className={client.is_active ? 'text-green-400' : 'text-red-400'}>
                  {client.is_active ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Week 0 Assessment Summary */}
        <div className="bg-bb-card border border-bb-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Week 0 Assessment</h2>
            {assessment && (
              <span className={cn(
                'text-xs px-3 py-1 rounded-full font-medium',
                assessment.status === 'submitted' ? 'bg-green-500/20 text-green-400' :
                assessment.status === 'reviewed' ? 'bg-blue-500/20 text-blue-400' :
                assessment.status === 'complete' ? 'bg-emerald-500/20 text-emerald-400' :
                'bg-amber-500/20 text-amber-400'
              )}>
                {assessment.status}
              </span>
            )}
          </div>

          {!assessment ? (
            <p className="text-gray-500 text-sm">No assessment started yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { key: 'player_info', label: 'Player Info' },
                { key: 'fourteen_spot', label: '14-Spot' },
                { key: 'deep_distance', label: 'Deep Distance' },
                { key: 'back_rim', label: 'Back-Rim' },
                { key: 'ball_flight', label: 'Ball Flight' },
                { key: 'fades', label: 'Fades' },
                { key: 'oversize_ball', label: 'Oversize Ball' },
                { key: 'live_video', label: 'Live Video' },
                { key: 'vertical_jump', label: 'Vertical Jump' },
                { key: 'movement_patterns', label: 'Movement Patterns' },
              ].map(({ key, label }) => {
                const sectionData = assessment[key];
                const hasData = sectionData && Object.keys(sectionData).length > 0;
                return (
                  <div key={key} className="flex items-center gap-2">
                    {hasData ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-gray-600 shrink-0" />
                    )}
                    <span className={cn('text-sm', hasData ? 'text-white' : 'text-gray-500')}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {assessment?.submitted_at && (
            <p className="text-xs text-gray-500 mt-4">
              Submitted {new Date(assessment.submitted_at).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Plus, CheckCircle2, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  slug: string;
  level: string;
  program_type: string;
  current_week: number;
  is_active: boolean;
  onboarding_complete: boolean;
  created_at: string;
  week0_assessments?: { id: string; status: string; submitted_at?: string }[];
}

export default function CoachingClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newClient, setNewClient] = useState({ first_name: '', last_name: '', email: '', level: 'high-school' });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetch('/api/coaching/clients')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setClients(data.clients || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!newClient.first_name || !newClient.last_name) return;
    setIsCreating(true);
    try {
      const res = await fetch('/api/coaching/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient),
      });
      const data = await res.json();
      if (data.success) {
        setClients([data.client, ...clients]);
        setShowNewForm(false);
        setNewClient({ first_name: '', last_name: '', email: '', level: 'high-school' });
      }
    } catch (err) {
      console.error(err);
    }
    setIsCreating(false);
  };

  const getAssessmentStatus = (client: Client) => {
    const assessment = client.week0_assessments?.[0];
    if (!assessment) return 'not_started';
    return assessment.status;
  };

  return (
    <div className="min-h-screen bg-bb-black p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/admin" className="text-xs text-gray-500 hover:text-gold-500">Admin</Link>
              <span className="text-xs text-gray-600">/</span>
              <span className="text-xs text-gold-500">Coaching Clients</span>
            </div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Users className="w-6 h-6 text-gold-500" />
              Coaching Clients
            </h1>
          </div>
          <Button onClick={() => setShowNewForm(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            New Client
          </Button>
        </div>

        {/* New Client Form */}
        {showNewForm && (
          <div className="bg-bb-card border border-gold-500/30 rounded-xl p-6 mb-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">Add New Coaching Client</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name *"
                value={newClient.first_name}
                onChange={(e) => setNewClient({ ...newClient, first_name: e.target.value })}
                className="h-10 px-4 rounded-lg border border-bb-border bg-bb-dark text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500"
              />
              <input
                type="text"
                placeholder="Last Name *"
                value={newClient.last_name}
                onChange={(e) => setNewClient({ ...newClient, last_name: e.target.value })}
                className="h-10 px-4 rounded-lg border border-bb-border bg-bb-dark text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                className="h-10 px-4 rounded-lg border border-bb-border bg-bb-dark text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500"
              />
              <select
                value={newClient.level}
                onChange={(e) => setNewClient({ ...newClient, level: e.target.value })}
                className="h-10 px-4 rounded-lg border border-bb-border bg-bb-dark text-white focus:outline-none focus:border-gold-500"
              >
                <option value="youth">Youth</option>
                <option value="high-school">High School</option>
                <option value="college">College</option>
                <option value="pro">Pro</option>
                <option value="recreational">Recreational</option>
              </select>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleCreate} disabled={isCreating || !newClient.first_name || !newClient.last_name}>
                {isCreating ? 'Creating...' : 'Create Client'}
              </Button>
              <Button variant="ghost" onClick={() => setShowNewForm(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {/* Clients List */}
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : clients.length === 0 ? (
          <div className="text-center py-12 bg-bb-card border border-bb-border rounded-xl">
            <Users className="w-8 h-8 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No coaching clients yet.</p>
            <p className="text-xs text-gray-600 mt-1">Create your first client to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {clients.map((client) => {
              const status = getAssessmentStatus(client);
              return (
                <div
                  key={client.id}
                  className="bg-bb-card border border-bb-border rounded-xl p-4 hover:border-bb-border/80 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-sm font-semibold text-white">
                          {client.first_name} {client.last_name}
                        </h3>
                        <span className="text-xs text-gray-500 bg-bb-dark px-2 py-0.5 rounded">
                          {client.level}
                        </span>
                        <span className={cn(
                          'text-xs px-2 py-0.5 rounded',
                          status === 'submitted' || status === 'complete'
                            ? 'bg-green-500/20 text-green-400'
                            : status === 'in_progress'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-gray-500/20 text-gray-500'
                        )}>
                          {status === 'submitted' ? 'Assessment Submitted' :
                           status === 'complete' ? 'Assessment Complete' :
                           status === 'in_progress' ? 'Assessment In Progress' :
                           'Not Started'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {client.email || 'No email'} · Week {client.current_week} · {client.program_type}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/coaching/assessment/${client.slug}`}
                        className="text-xs text-gold-500 hover:text-gold-400 flex items-center gap-1"
                        target="_blank"
                      >
                        Assessment Link <ExternalLink className="w-3 h-3" />
                      </Link>
                      <Link href={`/admin/coaching-clients/${client.slug}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

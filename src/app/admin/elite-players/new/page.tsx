'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Upload,
  User,
  Check,
  Copy,
  ExternalLink,
  Loader2,
  X,
  Camera,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const positions = [
  'PG', 'SG', 'SF', 'PF', 'C',
  'G', 'F', 'Wing', 'Guard', 'Forward',
];

const seasonStatuses = [
  { value: 'in-season', label: 'In-Season' },
  { value: 'off-season', label: 'Off-Season' },
  { value: 'pre-season', label: 'Pre-Season' },
  { value: 'playoffs', label: 'Playoffs' },
];

const bbLevels = [
  { value: 1, label: 'BB 1 — Foundation' },
  { value: 2, label: 'BB 2 — Calibrated' },
  { value: 3, label: 'BB 3 — Adaptive' },
  { value: 4, label: 'BB 4 — Master' },
];

export default function AddPlayerPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [created, setCreated] = useState(false);
  const [copied, setCopied] = useState('');
  const [error, setError] = useState('');

  const [createdPlayer, setCreatedPlayer] = useState<{
    slug: string;
    accessToken: string;
    profileUrl: string;
    loginUrl: string;
  } | null>(null);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    position: '',
    team: '',
    bbLevel: 1,
    seasonStatus: 'in-season',
    headshotUrl: '',
    accessToken: '',
  });

  const [previewUrl, setPreviewUrl] = useState('');

  function update(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setUploading(true);

    try {
      // Generate a temp slug for the upload
      const tempSlug = `${form.firstName || 'player'}-${form.lastName || 'new'}`
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '')
        .replace(/--+/g, '-');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('slug', tempSlug);

      const res = await fetch('/api/upload/player-photo', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        setForm((prev) => ({ ...prev, headshotUrl: data.url }));
      } else {
        // If upload fails (storage bucket not set up), keep preview and let user paste URL
        console.warn('Photo upload failed, using URL input instead:', data.error);
      }
    } catch (err) {
      console.warn('Photo upload error:', err);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError('First and last name are required.');
      return;
    }

    if (!form.team.trim()) {
      setError('Team is required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/elite-players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          position: form.position,
          team: form.team.trim(),
          bbLevel: form.bbLevel,
          seasonStatus: form.seasonStatus,
          headshotUrl: form.headshotUrl || null,
          accessToken: form.accessToken.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create player.');
        return;
      }

      const slug = data.player.slug;
      const token = data.player.accessToken;
      const baseUrl = window.location.origin;

      setCreatedPlayer({
        slug,
        accessToken: token,
        profileUrl: `${baseUrl}/elite/${slug}`,
        loginUrl: `${baseUrl}/elite/${slug}?token=${token}`,
      });
      setCreated(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  }

  // Success state
  if (created && createdPlayer) {
    return (
      <div className="min-h-screen bg-bb-black">
        <header className="border-b border-bb-border">
          <div className="max-w-2xl mx-auto px-4 py-6">
            <Link href="/admin/elite-players">
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Players
              </Button>
            </Link>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Player Created</h1>
            <p className="text-gray-400">
              {form.firstName} {form.lastName} has been added to BB.
            </p>
          </div>

          <div className="space-y-4">
            {/* Profile Link */}
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-gray-400 mb-2">Shareable Profile Link</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm text-gold-400 bg-bb-dark p-3 rounded-lg border border-bb-border break-all">
                    {createdPlayer.profileUrl}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(createdPlayer.profileUrl, 'profile')}
                  >
                    {copied === 'profile' ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Login Token */}
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-gray-400 mb-2">Player Login Token</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm text-gold-400 bg-bb-dark p-3 rounded-lg border border-bb-border">
                    {createdPlayer.accessToken}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(createdPlayer.accessToken, 'token')}
                  >
                    {copied === 'token' ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Share this token with the player to access their profile.
                </p>
              </CardContent>
            </Card>

            {/* Direct Login Link */}
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-gray-400 mb-2">Direct Login Link (includes token)</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm text-gold-400 bg-bb-dark p-3 rounded-lg border border-bb-border break-all">
                    {createdPlayer.loginUrl}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(createdPlayer.loginUrl, 'login')}
                  >
                    {copied === 'login' ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Send this link directly to the player — they'll be logged in automatically.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-8">
            <Link href={`/admin/players/${createdPlayer.slug}`} className="flex-1">
              <Button className="w-full">
                <User className="w-4 h-4 mr-2" />
                Edit Player Profile
              </Button>
            </Link>
            <Link href={`/elite/${createdPlayer.slug}`} target="_blank" className="flex-1">
              <Button variant="secondary" className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Profile
              </Button>
            </Link>
          </div>

          <div className="text-center mt-4">
            <Link href="/admin/elite-players/new">
              <Button
                variant="ghost"
                className="text-gray-400"
                onClick={() => {
                  setCreated(false);
                  setCreatedPlayer(null);
                  setForm({
                    firstName: '',
                    lastName: '',
                    position: '',
                    team: '',
                    bbLevel: 1,
                    seasonStatus: 'in-season',
                    headshotUrl: '',
                    accessToken: '',
                  });
                  setPreviewUrl('');
                }}
              >
                + Add Another Player
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bb-black">
      <header className="border-b border-bb-border">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Add New Player</h1>
              <p className="text-gray-400 text-sm mt-1">Create a BB profile with shareable link and login</p>
            </div>
            <Link href="/admin/elite-players">
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Photo Upload */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Player Photo
            </h3>
            <div className="flex items-center gap-6">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-full bg-bb-card border-2 border-dashed border-bb-border hover:border-gold-500/50 flex items-center justify-center cursor-pointer transition-all overflow-hidden relative group"
              >
                {previewUrl || form.headshotUrl ? (
                  <>
                    <Image
                      src={previewUrl || form.headshotUrl}
                      alt="Player"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </>
                ) : uploading ? (
                  <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
                ) : (
                  <div className="text-center">
                    <Upload className="w-6 h-6 text-gray-500 mx-auto" />
                    <span className="text-xs text-gray-600 mt-1 block">Photo</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <div className="flex-1">
                <Input
                  label="Or paste image URL"
                  placeholder="https://example.com/headshot.jpg"
                  value={form.headshotUrl}
                  onChange={(e) => {
                    update('headshotUrl', e.target.value);
                    setPreviewUrl(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Player Information
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  placeholder="e.g. Tobias"
                  value={form.firstName}
                  onChange={(e) => update('firstName', e.target.value)}
                  required
                />
                <Input
                  label="Last Name"
                  placeholder="e.g. Harris"
                  value={form.lastName}
                  onChange={(e) => update('lastName', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Team"
                  placeholder="e.g. Detroit Pistons"
                  value={form.team}
                  onChange={(e) => update('team', e.target.value)}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Position
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {positions.map((pos) => (
                      <button
                        type="button"
                        key={pos}
                        onClick={() => update('position', pos)}
                        className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${
                          form.position === pos
                            ? 'border-gold-500 bg-gold-500/10 text-white'
                            : 'border-bb-border bg-bb-card text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BB Level & Status */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              BB Level & Status
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  BB Level
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {bbLevels.map((level) => (
                    <button
                      type="button"
                      key={level.value}
                      onClick={() => update('bbLevel', level.value)}
                      className={`px-4 py-3 rounded-lg border text-sm text-left transition-all ${
                        form.bbLevel === level.value
                          ? 'border-gold-500 bg-gold-500/10 text-white'
                          : 'border-bb-border bg-bb-card text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Season Status
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {seasonStatuses.map((s) => (
                    <button
                      type="button"
                      key={s.value}
                      onClick={() => update('seasonStatus', s.value)}
                      className={`px-3 py-2.5 rounded-lg border text-sm text-center transition-all ${
                        form.seasonStatus === s.value
                          ? 'border-gold-500 bg-gold-500/10 text-white'
                          : 'border-bb-border bg-bb-card text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Access & Login */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Access & Login
            </h3>
            <Input
              label="Custom Access Token (optional)"
              placeholder="Auto-generated if left blank (e.g. tharris-bb-2026)"
              value={form.accessToken}
              onChange={(e) => update('accessToken', e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-2">
              Players use this token to log into their profile. A token will be auto-generated from their name if left blank.
            </p>
          </div>

          {/* Generated Slug Preview */}
          {form.firstName && form.lastName && (
            <div className="p-4 rounded-lg bg-bb-dark border border-bb-border">
              <p className="text-xs text-gray-500 mb-1">Profile URL will be:</p>
              <p className="text-sm text-gold-400 font-mono">
                /elite/{`${form.firstName}-${form.lastName}`.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/--+/g, '-')}
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            size="lg"
            className="w-full"
            loading={loading}
            disabled={!form.firstName || !form.lastName || !form.team}
          >
            <User className="w-4 h-4 mr-2" />
            Create Player
          </Button>
        </form>
      </main>
    </div>
  );
}

'use client';

import { Input } from '@/components/ui/input';
import type { IntakeFormData } from '@/types';

interface PlayerContactProps {
  data: Partial<IntakeFormData>;
  onChange: (fields: Partial<IntakeFormData>) => void;
  errors?: Record<string, string>;
}

export function PlayerContact({ data, onChange, errors }: PlayerContactProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">
          Almost done! Let&apos;s get your info.
        </h3>
        <p className="text-sm text-gray-400">
          Age, location, and IG handle (optional but recommended)
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            First Name *
          </label>
          <Input
            value={data.firstName || ''}
            onChange={(e) => onChange({ firstName: e.target.value })}
            placeholder="First name"
            error={errors?.firstName}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Last Name *
          </label>
          <Input
            value={data.lastName || ''}
            onChange={(e) => onChange({ lastName: e.target.value })}
            placeholder="Last name"
            error={errors?.lastName}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Email *
        </label>
        <Input
          type="email"
          value={data.email || ''}
          onChange={(e) => onChange({ email: e.target.value })}
          placeholder="your@email.com"
          error={errors?.email}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Phone (optional)
        </label>
        <Input
          type="tel"
          value={data.phone || ''}
          onChange={(e) => onChange({ phone: e.target.value })}
          placeholder="(555) 123-4567"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Age
          </label>
          <Input
            type="number"
            value={data.playerAge || ''}
            onChange={(e) => onChange({ playerAge: parseInt(e.target.value) || undefined })}
            placeholder="Age"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Location
          </label>
          <Input
            value={data.playerLocation || ''}
            onChange={(e) => onChange({ playerLocation: e.target.value })}
            placeholder="City, State"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Instagram
          </label>
          <Input
            value={data.playerInstagram || ''}
            onChange={(e) => onChange({ playerInstagram: e.target.value })}
            placeholder="@handle"
          />
        </div>
      </div>
    </div>
  );
}

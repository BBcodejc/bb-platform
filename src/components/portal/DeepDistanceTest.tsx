'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { DeepDistanceData } from '@/types';

interface DeepDistanceTestProps {
  onComplete: (data: DeepDistanceData) => void;
  initialData?: Partial<DeepDistanceData>;
}

export function DeepDistanceTest({ onComplete, initialData }: DeepDistanceTestProps) {
  const [distance, setDistance] = useState(initialData?.distanceBehindLine || 3);
  const [shots, setShots] = useState<DeepDistanceData['shots']>(
    initialData?.shots || []
  );
  const [currentShot, setCurrentShot] = useState(1);

  const targetShots = 10; // Minimum shots required

  const addShot = (rimContact: boolean, make: boolean, short: boolean) => {
    setShots([
      ...shots,
      { rimContact, make, short },
    ]);
    setCurrentShot(currentShot + 1);
  };

  const removeLastShot = () => {
    if (shots.length > 0) {
      setShots(shots.slice(0, -1));
      setCurrentShot(currentShot - 1);
    }
  };

  const handleComplete = () => {
    onComplete({
      distanceBehindLine: distance,
      shots,
    });
  };

  // Calculate stats
  const rimContacts = shots.filter((s) => s.rimContact).length;
  const makes = shots.filter((s) => s.make).length;
  const shortMisses = shots.filter((s) => s.short).length;

  const canComplete = shots.length >= targetShots;

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Card variant="gold">
        <CardContent className="p-4">
          <h3 className="font-semibold text-white mb-2">Instructions</h3>
          <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
            <li>Start at the 3-point line</li>
            <li>Walk back until you feel like you&apos;re &quot;chucking&quot;</li>
            <li>That&apos;s your deep test distance</li>
            <li>Shoot {targetShots}+ shots from there</li>
            <li>Log each result below</li>
          </ol>
        </CardContent>
      </Card>

      {/* Distance input */}
      <div className="flex items-center gap-4">
        <Input
          label="How far behind the 3-point line? (feet)"
          type="number"
          value={distance}
          onChange={(e) => setDistance(parseInt(e.target.value) || 3)}
          min={1}
          max={15}
        />
      </div>

      {/* Shot logging */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">
          Shot {currentShot} of {targetShots}+
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => addShot(true, true, false)}
            className="h-20 flex flex-col gap-1"
          >
            <span className="text-green-500 font-bold">MAKE</span>
            <span className="text-xs text-gray-400">Hit the rim & went in</span>
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => addShot(true, false, false)}
            className="h-20 flex flex-col gap-1"
          >
            <span className="text-gold-500 font-bold">RIM CONTACT</span>
            <span className="text-xs text-gray-400">Hit rim, no make (not short)</span>
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => addShot(false, false, true)}
            className="h-20 flex flex-col gap-1"
          >
            <span className="text-red-500 font-bold">SHORT</span>
            <span className="text-xs text-gray-400">Didn&apos;t reach the rim</span>
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => addShot(false, false, false)}
            className="h-20 flex flex-col gap-1"
          >
            <span className="text-gray-400 font-bold">OTHER MISS</span>
            <span className="text-xs text-gray-400">Long, left, or right</span>
          </Button>
        </div>

        {shots.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={removeLastShot}
            className="w-full"
          >
            Undo Last Shot
          </Button>
        )}
      </div>

      {/* Shot history */}
      {shots.length > 0 && (
        <Card variant="glass">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-gray-400 mb-3">Shot History</h4>
            <div className="flex flex-wrap gap-2">
              {shots.map((shot, index) => (
                <div
                  key={index}
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold',
                    shot.make
                      ? 'bg-green-500 text-white'
                      : shot.rimContact
                      ? 'bg-gold-500 text-bb-black'
                      : shot.short
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-600 text-white'
                  )}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="flex justify-center gap-6 text-center">
        <div>
          <p className="text-2xl font-bold text-green-500">{makes}</p>
          <p className="text-xs text-gray-400">Makes</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gold-500">{rimContacts}</p>
          <p className="text-xs text-gray-400">Rim Contacts</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-red-500">{shortMisses}</p>
          <p className="text-xs text-gray-400">Short</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{shots.length}</p>
          <p className="text-xs text-gray-400">Total</p>
        </div>
      </div>

      {/* BB Standard note */}
      <p className="text-center text-sm text-gray-500">
        BB Standard: 8/10 rim contacts (no short misses) to pass Level 2
      </p>

      {/* Complete button */}
      <Button
        onClick={handleComplete}
        disabled={!canComplete}
        className="w-full"
        size="lg"
      >
        {canComplete
          ? 'Complete Deep Distance Test'
          : `${targetShots - shots.length} more shots needed`}
      </Button>
    </div>
  );
}

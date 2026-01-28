'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { BackRimData } from '@/types';

const spots = [
  { id: 'wing_left', name: 'Left Wing' },
  { id: 'top', name: 'Top of Key' },
  { id: 'wing_right', name: 'Right Wing' },
];

interface BackRimTestProps {
  onComplete: (data: BackRimData) => void;
  initialData?: Partial<BackRimData>;
}

export function BackRimTest({ onComplete, initialData }: BackRimTestProps) {
  const [currentSpotIndex, setCurrentSpotIndex] = useState(0);
  const [results, setResults] = useState<BackRimData['spots']>(
    initialData?.spots || spots.map((s) => ({
      spotName: s.name,
      consecutiveHits: 0,
      bestStreak: 0,
    }))
  );

  const currentSpot = spots[currentSpotIndex];
  const currentResult = results[currentSpotIndex];

  const updateConsecutive = (value: number) => {
    const newResults = [...results];
    newResults[currentSpotIndex] = {
      ...currentResult,
      consecutiveHits: value,
      bestStreak: Math.max(value, currentResult.bestStreak),
    };
    setResults(newResults);
  };

  const updateBestStreak = (value: number) => {
    const newResults = [...results];
    newResults[currentSpotIndex] = {
      ...currentResult,
      bestStreak: value,
    };
    setResults(newResults);
  };

  const isLastSpot = currentSpotIndex === spots.length - 1;
  const canProceed = currentResult.bestStreak > 0;

  const handleNext = () => {
    if (isLastSpot && canProceed) {
      onComplete({ spots: results });
    } else if (canProceed) {
      setCurrentSpotIndex(currentSpotIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentSpotIndex > 0) {
      setCurrentSpotIndex(currentSpotIndex - 1);
    }
  };

  // Calculate overall best
  const overallBest = Math.max(...results.map((r) => r.bestStreak));

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Card variant="gold">
        <CardContent className="p-4">
          <h3 className="font-semibold text-white mb-2">The Back-Rim Challenge</h3>
          <p className="text-sm text-gray-300 mb-3">
            From each spot, <strong>intentionally miss back rim</strong>. The ball
            should bounce back toward you or straight down. This proves distance
            control.
          </p>
          <p className="text-sm text-gold-400 italic">
            &quot;If you can hit back rim on command, a swish is just removing 1% of
            force.&quot;
          </p>
        </CardContent>
      </Card>

      {/* Spot navigation */}
      <div className="flex justify-center gap-3">
        {spots.map((spot, index) => (
          <button
            key={spot.id}
            onClick={() => setCurrentSpotIndex(index)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              index === currentSpotIndex
                ? 'bg-gold-500 text-bb-black'
                : results[index].bestStreak >= 3
                ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                : 'bg-bb-card border border-bb-border text-gray-400'
            )}
          >
            {spot.name}
          </button>
        ))}
      </div>

      {/* Current spot input */}
      <div className="animate-fade-in space-y-6">
        <h3 className="text-xl font-semibold text-white text-center">
          {currentSpot.name}
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="p-4">
              <label className="block text-sm text-gray-400 mb-2">
                Consecutive back-rim hits (current attempt)
              </label>
              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => updateConsecutive(Math.max(0, currentResult.consecutiveHits - 1))}
                >
                  -
                </Button>
                <span className="text-3xl font-bold text-white w-16 text-center">
                  {currentResult.consecutiveHits}
                </span>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => updateConsecutive(currentResult.consecutiveHits + 1)}
                >
                  +
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <label className="block text-sm text-gray-400 mb-2">
                Best streak at this spot
              </label>
              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => updateBestStreak(Math.max(0, currentResult.bestStreak - 1))}
                >
                  -
                </Button>
                <span className="text-3xl font-bold text-gold-500 w-16 text-center">
                  {currentResult.bestStreak}
                </span>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => updateBestStreak(currentResult.bestStreak + 1)}
                >
                  +
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick buttons */}
        <div className="flex justify-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              updateConsecutive(0);
            }}
          >
            Reset Current
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              updateConsecutive(currentResult.consecutiveHits + 1);
            }}
          >
            +1 Back Rim Hit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // Save best and reset for new attempt
              const newResults = [...results];
              newResults[currentSpotIndex] = {
                ...currentResult,
                consecutiveHits: 0,
                bestStreak: Math.max(currentResult.consecutiveHits, currentResult.bestStreak),
              };
              setResults(newResults);
            }}
          >
            Miss (Save Best)
          </Button>
        </div>
      </div>

      {/* Progress summary */}
      <Card variant="glass">
        <CardContent className="p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-3">Progress Summary</h4>
          <div className="space-y-2">
            {results.map((result, index) => (
              <div key={spots[index].id} className="flex items-center justify-between">
                <span className="text-sm text-gray-300">{result.spotName}</span>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'text-sm font-bold',
                      result.bestStreak >= 3 ? 'text-green-500' : 'text-gray-400'
                    )}
                  >
                    Best: {result.bestStreak}
                  </span>
                  {result.bestStreak >= 3 && (
                    <span className="text-green-500 text-xs">✓ PASS</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-bb-border">
            <p className="text-center">
              <span className="text-sm text-gray-400">Overall Best Streak: </span>
              <span className="text-2xl font-bold text-gold-500">{overallBest}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* BB Standard note */}
      <p className="text-center text-sm text-gray-500">
        BB Standard: 3 consecutive back-rim hits to pass Level 2
      </p>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button
          variant="ghost"
          onClick={handlePrev}
          disabled={currentSpotIndex === 0}
        >
          Previous Spot
        </Button>
        <Button onClick={handleNext} disabled={!canProceed}>
          {isLastSpot ? 'Complete Test' : 'Next Spot'}
        </Button>
      </div>
    </div>
  );
}

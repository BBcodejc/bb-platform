'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { MissType, FourteenSpotData, SpotResult } from '@/types';

const missTypes: { value: MissType; label: string; color: string }[] = [
  { value: 'make', label: 'Make', color: 'bg-green-500' },
  { value: 'back_rim', label: 'Back Rim', color: 'bg-gold-500' },
  { value: 'front_rim', label: 'Front Rim', color: 'bg-orange-500' },
  { value: 'short', label: 'Short', color: 'bg-red-500' },
  { value: 'long', label: 'Long', color: 'bg-purple-500' },
  { value: 'left', label: 'Left', color: 'bg-blue-500' },
  { value: 'right', label: 'Right', color: 'bg-cyan-500' },
];

const spots = [
  { id: 'spot1', name: 'Left Corner', position: { left: '5%', bottom: '20%' } },
  { id: 'spot2', name: 'Left Wing', position: { left: '15%', bottom: '45%' } },
  { id: 'spot3', name: 'Left Elbow', position: { left: '25%', bottom: '65%' } },
  { id: 'spot4', name: 'Top of Key', position: { left: '50%', bottom: '75%' }, transform: 'translateX(-50%)' },
  { id: 'spot5', name: 'Right Elbow', position: { right: '25%', bottom: '65%' } },
  { id: 'spot6', name: 'Right Wing', position: { right: '15%', bottom: '45%' } },
  { id: 'spot7', name: 'Right Corner', position: { right: '5%', bottom: '20%' } },
];

interface FourteenSpotTestProps {
  onComplete: (data: FourteenSpotData) => void;
  initialData?: Partial<FourteenSpotData>;
}

export function FourteenSpotTest({ onComplete, initialData }: FourteenSpotTestProps) {
  const [currentSpot, setCurrentSpot] = useState(0);
  const [results, setResults] = useState<Partial<FourteenSpotData>>(initialData || {});

  const currentSpotKey = `spot${currentSpot + 1}` as keyof FourteenSpotData;
  const currentSpotData = results[currentSpotKey] || { shot1: undefined, shot2: undefined };

  const updateShot = (shotNum: 1 | 2, missType: MissType) => {
    const newSpotData: SpotResult = {
      ...currentSpotData,
      [`shot${shotNum}`]: missType,
    } as SpotResult;

    setResults({
      ...results,
      [currentSpotKey]: newSpotData,
    });
  };

  const canProceed = currentSpotData.shot1 && currentSpotData.shot2;
  const isLastSpot = currentSpot === 6;

  const handleNext = () => {
    if (isLastSpot && canProceed) {
      onComplete(results as FourteenSpotData);
    } else if (canProceed) {
      setCurrentSpot(currentSpot + 1);
    }
  };

  const handlePrev = () => {
    if (currentSpot > 0) {
      setCurrentSpot(currentSpot - 1);
    }
  };

  // Calculate stats
  const calculateStats = () => {
    let makes = 0;
    let backRims = 0;
    let total = 0;

    Object.values(results).forEach((spot) => {
      if (spot?.shot1) {
        total++;
        if (spot.shot1 === 'make') makes++;
        if (spot.shot1 === 'back_rim') backRims++;
      }
      if (spot?.shot2) {
        total++;
        if (spot.shot2 === 'make') makes++;
        if (spot.shot2 === 'back_rim') backRims++;
      }
    });

    return { makes, backRims, total };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      {/* Court visualization */}
      <Card variant="glass">
        <CardContent className="p-6">
          <div className="relative w-full aspect-[2/1] bg-bb-border/30 rounded-lg overflow-hidden">
            {/* Half court visual */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border-2 border-gold-500/30 rounded-full" />
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-12 border-2 border-t-0 border-gold-500/30" />

            {/* Spot markers */}
            {spots.map((spot, index) => {
              const spotKey = `spot${index + 1}` as keyof FourteenSpotData;
              const spotData = results[spotKey];
              const isComplete = spotData?.shot1 && spotData?.shot2;
              const isActive = index === currentSpot;

              return (
                <button
                  key={spot.id}
                  onClick={() => setCurrentSpot(index)}
                  className={cn(
                    'absolute w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all',
                    isActive
                      ? 'bg-gold-500 text-bb-black scale-125 ring-4 ring-gold-500/30'
                      : isComplete
                      ? 'bg-green-500 text-white'
                      : 'bg-bb-card border-2 border-bb-border text-gray-400'
                  )}
                  style={{
                    ...spot.position,
                    transform: spot.transform,
                  }}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current spot logging */}
      <div className="animate-fade-in space-y-4">
        <h3 className="text-xl font-semibold text-white text-center">
          Spot {currentSpot + 1}: {spots[currentSpot].name}
        </h3>

        {/* Shot 1 */}
        <Card variant={currentSpotData.shot1 ? 'glass' : 'default'}>
          <CardContent className="p-4">
            <p className="text-sm text-gray-400 mb-3">Shot 1</p>
            <div className="flex flex-wrap gap-2">
              {missTypes.map((type) => (
                <button
                  key={`shot1-${type.value}`}
                  onClick={() => updateShot(1, type.value)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    currentSpotData.shot1 === type.value
                      ? `${type.color} text-white`
                      : 'bg-bb-card border border-bb-border text-gray-300 hover:border-gray-500'
                  )}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shot 2 */}
        <Card variant={currentSpotData.shot2 ? 'glass' : 'default'}>
          <CardContent className="p-4">
            <p className="text-sm text-gray-400 mb-3">Shot 2</p>
            <div className="flex flex-wrap gap-2">
              {missTypes.map((type) => (
                <button
                  key={`shot2-${type.value}`}
                  onClick={() => updateShot(2, type.value)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    currentSpotData.shot2 === type.value
                      ? `${type.color} text-white`
                      : 'bg-bb-card border border-bb-border text-gray-300 hover:border-gray-500'
                  )}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-6 text-center">
        <div>
          <p className="text-2xl font-bold text-green-500">{stats.makes}</p>
          <p className="text-xs text-gray-400">Makes</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gold-500">{stats.backRims}</p>
          <p className="text-xs text-gray-400">Back Rim</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{stats.total}/14</p>
          <p className="text-xs text-gray-400">Completed</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button
          variant="ghost"
          onClick={handlePrev}
          disabled={currentSpot === 0}
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

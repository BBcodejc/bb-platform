'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Upload,
  Video,
  CheckCircle2,
  ExternalLink,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoUploadProps {
  prospectId: string;
  driveUrl?: string;
  onComplete: (data: { driveUrl: string; confirmedUploads: string[] }) => void;
}

const requiredVideos = [
  {
    id: 'game_makes',
    label: 'Game Footage - Makes',
    description: 'At least 3 clips of made shots from real games',
    required: true,
  },
  {
    id: 'game_misses',
    label: 'Game Footage - Misses',
    description: 'At least 3 clips of missed shots from real games',
    required: true,
  },
  {
    id: 'test_footage',
    label: 'Test Protocol Footage',
    description: 'Video of yourself completing the test protocols (optional but recommended)',
    required: false,
  },
];

export function VideoUpload({ prospectId, driveUrl: initialDriveUrl, onComplete }: VideoUploadProps) {
  const [driveUrl, setDriveUrl] = useState(initialDriveUrl || '');
  const [confirmedUploads, setConfirmedUploads] = useState<string[]>([]);
  const [showInstructions, setShowInstructions] = useState(true);

  const toggleConfirm = (videoId: string) => {
    if (confirmedUploads.includes(videoId)) {
      setConfirmedUploads(confirmedUploads.filter((id) => id !== videoId));
    } else {
      setConfirmedUploads([...confirmedUploads, videoId]);
    }
  };

  const requiredComplete = requiredVideos
    .filter((v) => v.required)
    .every((v) => confirmedUploads.includes(v.id));

  const handleComplete = () => {
    if (driveUrl && requiredComplete) {
      onComplete({ driveUrl, confirmedUploads });
    }
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      {showInstructions && (
        <div className="animate-fade-in">
          <Card variant="gold">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-white mb-2">
                      How to Upload Videos
                    </h3>
                    <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                      <li>
                        Create a folder in your Google Drive named
                        &quot;BB_Evaluation_[YourName]&quot;
                      </li>
                      <li>Upload your video clips to that folder</li>
                      <li>
                        Right-click the folder → Share → &quot;Anyone with the
                        link can view&quot;
                      </li>
                      <li>Copy the folder link and paste it below</li>
                    </ol>
                  </div>
                </div>
                <button
                  onClick={() => setShowInstructions(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Drive URL input */}
      <Card>
        <CardContent className="p-4">
          <Input
            label="Google Drive Folder URL"
            value={driveUrl}
            onChange={(e) => setDriveUrl(e.target.value)}
            placeholder="https://drive.google.com/drive/folders/..."
            hint="Paste the shared link to your video folder"
          />
          {driveUrl && (
            <a
              href={driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-gold-500 hover:text-gold-400 mt-2"
            >
              Open folder
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </CardContent>
      </Card>

      {/* Video checklist */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">
          Confirm Your Uploads
        </h3>
        <p className="text-sm text-gray-400">
          Check each box once you&apos;ve uploaded the corresponding videos to your
          Drive folder.
        </p>

        {requiredVideos.map((video) => (
          <Card
            key={video.id}
            variant={confirmedUploads.includes(video.id) ? 'glass' : 'default'}
            hover
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={confirmedUploads.includes(video.id)}
                  onChange={() => toggleConfirm(video.id)}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-white">
                      {video.label}
                    </span>
                    {video.required && (
                      <span className="text-xs text-red-400">Required</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {video.description}
                  </p>
                </div>
                {confirmedUploads.includes(video.id) && (
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tips */}
      <Card variant="glass">
        <CardContent className="p-4">
          <h4 className="font-medium text-white mb-2">Video Tips</h4>
          <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
            <li>Film from behind the shooter if possible (shows ball flight)</li>
            <li>Make sure the full shot motion is visible</li>
            <li>Include the result (make/miss) in each clip</li>
            <li>Game footage is more valuable than practice footage</li>
            <li>Multiple angles of the same shot are helpful</li>
          </ul>
        </CardContent>
      </Card>

      {/* Status */}
      <div className="flex items-center justify-center gap-4 py-4">
        <div
          className={cn(
            'flex items-center gap-2 text-sm',
            driveUrl ? 'text-green-500' : 'text-gray-500'
          )}
        >
          {driveUrl ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <div className="w-4 h-4 rounded-full border-2 border-current" />
          )}
          Folder linked
        </div>
        <div
          className={cn(
            'flex items-center gap-2 text-sm',
            requiredComplete ? 'text-green-500' : 'text-gray-500'
          )}
        >
          {requiredComplete ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <div className="w-4 h-4 rounded-full border-2 border-current" />
          )}
          Required videos confirmed
        </div>
      </div>

      {/* Complete button */}
      <Button
        onClick={handleComplete}
        disabled={!driveUrl || !requiredComplete}
        className="w-full"
        size="lg"
      >
        {!driveUrl
          ? 'Enter Google Drive link'
          : !requiredComplete
          ? 'Confirm required videos'
          : 'Complete Video Upload'}
      </Button>
    </div>
  );
}

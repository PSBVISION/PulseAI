'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/ui/spinner';

interface WebcamCaptureProps {
  onCapture: (canvas: HTMLCanvasElement) => void;
  isCapturing?: boolean;
  showCapture?: boolean;
}

export const WebcamCapture: React.FC<WebcamCaptureProps> = ({
  onCapture,
  isCapturing = false,
  showCapture = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreaming(true);
          setError(null);
        }
      } catch (err) {
        setError(
          'Unable to access webcam. Please check permissions.'
        );
        console.error('Webcam error:', err);
      }
    };

    startWebcam();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (
          videoRef.current.srcObject as MediaStream
        ).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        onCapture(canvasRef.current);
      }
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="relative w-full h-72 bg-slate-900 rounded-lg overflow-hidden">
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-900/20 border-2 border-red-500 rounded-lg">
                <p className="text-red-400 text-center px-4">{error}</p>
              </div>
            )}
            {!error && (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
                {streaming && (
                  <div className="absolute top-3 right-3 flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-xs text-white">Live</span>
                  </div>
                )}
              </>
            )}
          </div>

          {showCapture && (
            <Button
              onClick={handleCapture}
              disabled={!streaming || isCapturing}
              className="w-full"
            >
              {isCapturing ? (
                <span className="flex items-center gap-2">
                  <Spinner size="sm" />
                  Analyzing...
                </span>
              ) : (
                'Capture Face'
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

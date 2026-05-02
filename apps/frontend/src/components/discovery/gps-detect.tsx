'use client';

import { useState } from 'react';

export interface ConstituencyResult {
  acId: string | null;
  pcId: string | null;
  state: string | null;
  confidence: number;
  name?: string;
}

interface GpsDetectProps {
  onDetected: (result: ConstituencyResult) => void;
  onError?: (error: string) => void;
}

export function GpsDetect({ onDetected, onError }: GpsDetectProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const requestLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setLoading(false);
      onError?.('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch('/api/geo/map', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat: latitude, lng: longitude }),
          });

          const data: ConstituencyResult = await response.json();

          if (!data.acId && !data.pcId) {
            setError('Could not find a constituency at your location');
            onError?.('No constituency found');
          } else {
            onDetected(data);
          }
        } catch (err) {
          setError('Failed to lookup constituency');
          onError?.('API error');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setPermissionDenied(true);
          setError('Location permission denied');
        } else {
          setError('Failed to get location');
        }
        setLoading(false);
        onError?.(err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  if (permissionDenied) {
    return (
      <div className="p-4 border border-yellow-500 rounded-lg bg-yellow-50">
        <p className="text-yellow-800">
          Location access denied. Please enable location permission in your browser settings,
          or use EPIC search / manual selection instead.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <button
        onClick={requestLocation}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Detecting location...' : '📍 Use My Current Location'}
      </button>
      
      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}
    </div>
  );
}
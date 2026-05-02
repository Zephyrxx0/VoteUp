'use client';

import { useState } from 'react';
import { GpsDetect, type ConstituencyResult } from '@/components/discovery/gps-detect';
import { EpicSearch } from '@/components/discovery/epic-search';
import { ManualDrilldown } from '@/components/discovery/manual-drilldown';
import { validateEPIC } from '@/lib/validation';

type Mode = 'gps' | 'epic' | 'manual';

export default function DiscoveryPage() {
  const [mode, setMode] = useState<Mode>('gps');
  const [constituency, setConstituency] = useState<ConstituencyResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGpsDetected = (result: ConstituencyResult) => {
    setConstituency(result);
    setLoading(false);
  };

  const handleEpicValidated = () => {
    // EPIC validation doesn't give constituency directly
    // would need backend lookup - this is basic UI
  };

  const handleManualSelected = (acId: string, pcId: string) => {
    setConstituency({
      acId,
      pcId,
      state: 'Unknown',
      confidence: 1.0,
      name: `AC: ${acId}, PC: ${pcId}`,
    });
  };

  const mockStates = [
    { id: 'DL', name: 'Delhi', constituencies: [
      { id: 'DL-PC-1', name: 'New Delhi', type: 'PC' as const },
      { id: 'DL-AC-1', name: 'New Delhi', type: 'AC' as const },
    ]},
  ];

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Find Your Constituency</h1>
      
      {/* Mode Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode('gps')}
          className={`px-4 py-2 rounded-lg ${
            mode === 'gps' ? 'bg-blue-600 text-white' : 'bg-gray-100'
          }`}
        >
          📍 GPS
        </button>
        <button
          onClick={() => setMode('epic')}
          className={`px-4 py-2 rounded-lg ${
            mode === 'epic' ? 'bg-blue-600 text-white' : 'bg-gray-100'
          }`}
        >
          🪪 EPIC
        </button>
        <button
          onClick={() => setMode('manual')}
          className={`px-4 py-2 rounded-lg ${
            mode === 'manual' ? 'bg-blue-600 text-white' : 'bg-gray-100'
          }`}
        >
          🔍 Manual
        </button>
      </div>

      {/* Mode Content */}
      <div className="space-y-6">
        {mode === 'gps' && (
          <GpsDetect 
            onDetected={handleGpsDetected}
            onError={(e) => console.error(e)}
          />
        )}

        {mode === 'epic' && (
          <EpicSearch onValidated={handleEpicValidated} />
        )}

        {mode === 'manual' && (
          <ManualDrilldown 
            states={mockStates}
            onSelected={handleManualSelected}
          />
        )}
      </div>

      {/* Result */}
      {constituency && (
        <div className="mt-8 p-6 bg-green-50 border border-green-500 rounded-lg">
          <h2 className="text-xl font-semibold text-green-800 mb-2">
            ✓ Your Constituency Found
          </h2>
          <div className="space-y-1 text-gray-700">
            {constituency.acId && (
              <p>Assembly Constituency: <strong>{constituency.acId}</strong></p>
            )}
            {constituency.pcId && (
              <p>Lok Sabha Constituency: <strong>{constituency.pcId}</strong></p>
            )}
            {constituency.state && (
              <p>State: <strong>{constituency.state}</strong></p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              Confidence: {Math.round(constituency.confidence * 100)}%
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
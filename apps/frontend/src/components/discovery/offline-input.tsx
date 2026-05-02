'use client';

import { useState } from 'react';

interface OfflineInputProps {
  onSubmit: (pollingDate: string, countingDate: string) => void;
}

export function OfflineInput({ onSubmit }: OfflineInputProps) {
  const [pollingDate, setPollingDate] = useState('');
  const [countingDate, setCountingDate] = useState('');

  const handleSubmit = () => {
    if (pollingDate && countingDate) {
      onSubmit(pollingDate, countingDate);
    }
  };

  return (
    <div className="p-4 border border-yellow-500 rounded-lg bg-yellow-50">
      <h3 className="font-medium text-yellow-800 mb-3">
        Missing Data? Help us out
      </h3>
      <p className="text-sm text-yellow-700 mb-4">
        If official data is unavailable, you can enter election dates manually.
      </p>

      <div className="space-y-3">
        <div>
          <label className="block text-sm text-yellow-800 mb-1">
            Polling Date
          </label>
          <input
            type="date"
            value={pollingDate}
            onChange={(e) => setPollingDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm text-yellow-800 mb-1">
            Counting Date
          </label>
          <input
            type="date"
            value={countingDate}
            onChange={(e) => setCountingDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!pollingDate || !countingDate}
          className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
        >
          Save Manual Dates
        </button>
      </div>

      <p className="text-xs text-yellow-600 mt-3">
        Your data helps improve accuracy for everyone in your constituency.
      </p>
    </div>
  );
}
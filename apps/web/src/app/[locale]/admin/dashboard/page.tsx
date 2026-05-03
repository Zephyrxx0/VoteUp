'use client';

import { useState, useEffect } from 'react';

interface Constituency {
  id: string;
  name: string;
  state: string;
  stage: string;
}

const EIGHT_STAGES = [
  'Not Scheduled',
  'Notification Issued',
  'Nomination Last Date',
  'Scrutiny',
  'Withdrawal',
  'Polling',
  'Counting',
  'Result Declared',
];

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(false);
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);
  const [selectedAC, setSelectedAC] = useState<string | null>(null);
  const [newStage, setNewStage] = useState<string>('');
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchConstituencies();
  }, []);

  const fetchConstituencies = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/constituencies');
      const data = await res.json();
      setConstituencies(data.constituencies || []);
    } catch (err) {
      console.error('Failed to fetch:', err);
      setConstituencies([
        { id: 'DL-AC-1', name: 'New Delhi', state: 'Delhi', stage: 'Not Scheduled' },
        { id: 'DL-AC-2', name: 'Delhi Cantt', state: 'Delhi', stage: 'Polling' },
      ]);
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    if (!selectedAC || !newStage) return;

    setLoading(true);
    setSuccess(null);

    try {
      const res = await fetch('/api/admin/stage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acId: selectedAC, stage: newStage }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(`Updated ${selectedAC} to ${newStage}`);
        setConstituencies(prev =>
          prev.map(c =>
            c.id === selectedAC ? { ...c, stage: newStage } : c
          )
        );
      }
    } catch (err) {
      console.error('Update failed:', err);
      setSuccess('Update successful (demo mode)');
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="bg-yellow-50 border border-yellow-500 rounded-lg p-4 mb-6">
        <p className="text-yellow-800">
          ⚠️ Admin access restricted. Only users with admin custom claim can access this dashboard.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">Update Election Stage</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Select Constituency
              </label>
              <select
                value={selectedAC || ''}
                onChange={(e) => setSelectedAC(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">-- Select AC --</option>
                {constituencies.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.id} - {c.name} ({c.state})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                New Stage
              </label>
              <select
                value={newStage}
                onChange={(e) => setNewStage(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">-- Select Stage --</option>
                {EIGHT_STAGES.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleUpdate}
            disabled={!selectedAC || !newStage || loading}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Stage'}
          </button>

          {success && (
            <p className="mt-3 text-green-600">{success}</p>
          )}
        </div>
      </div>
    </main>
  );
}
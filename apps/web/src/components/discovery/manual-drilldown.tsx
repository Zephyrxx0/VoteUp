'use client';

import { useState } from 'react';

interface Constituency {
  id: string;
  name: string;
  type: 'AC' | 'PC';
}

interface State {
  id: string;
  name: string;
  constituencies: Constituency[];
}

interface ManualDrilldownProps {
  states: State[];
  onSelected: (acId: string, pcId: string) => void;
}

export function ManualDrilldown({ states, onSelected }: ManualDrilldownProps) {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedPC, setSelectedPC] = useState<string | null>(null);
  const [selectedAC, setSelectedAC] = useState<string | null>(null);

  const currentState = states.find(s => s.id === selectedState);
  const pcs = currentState?.constituencies.filter(c => c.type === 'PC') || [];
  const acs = currentState?.constituencies.filter(c => c.type === 'AC') || [];

  const handleConfirm = () => {
    if (selectedAC && selectedPC) {
      onSelected(selectedAC, selectedPC);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg">
      <h3 className="text-lg font-medium">Manual Selection</h3>
      
      {/* Step 1: State */}
      <div>
        <label className="block mb-2 text-sm font-medium">1. Select State/UT</label>
        <select
          value={selectedState || ''}
          onChange={(e) => {
            setSelectedState(e.target.value);
            setSelectedPC(null);
            setSelectedAC(null);
          }}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="">-- Select State --</option>
          {states.map(state => (
            <option key={state.id} value={state.id}>{state.name}</option>
          ))}
        </select>
      </div>

      {/* Step 2: Parliamentary Constituency */}
      {selectedState && (
        <div>
          <label className="block mb-2 text-sm font-medium">2. Select Lok Sabha Constituency</label>
          <select
            value={selectedPC || ''}
            onChange={(e) => {
              setSelectedPC(e.target.value);
              setSelectedAC(null);
            }}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">-- Select PC --</option>
            {pcs.map(pc => (
              <option key={pc.id} value={pc.id}>{pc.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Step 3: Assembly Constituency */}
      {selectedPC && (
        <div>
          <label className="block mb-2 text-sm font-medium">3. Select Assembly Constituency</label>
          <select
            value={selectedAC || ''}
            onChange={(e) => setSelectedAC(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">-- Select AC --</option>
            {acs.map(ac => (
              <option key={ac.id} value={ac.id}>{ac.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Confirm */}
      {selectedAC && selectedPC && (
        <button
          onClick={handleConfirm}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Confirm Selection
        </button>
      )}
    </div>
  );
}
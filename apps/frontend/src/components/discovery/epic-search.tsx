'use client';

import { useState } from 'react';
import { validateEPIC, type ValidationResult } from '@/lib/validation';

interface EpicSearchProps {
  onValidated: (result: ValidationResult, epic: string) => void;
}

export function EpicSearch({ onValidated }: EpicSearchProps) {
  const [epic, setEpic] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleValidate = () => {
    if (!epic.trim()) {
      setResult({ valid: false, confidence: 0, type: 'legacy', errors: ['Enter your EPIC number'] });
      return;
    }

    setLoading(true);
    
    const validation = validateEPIC(epic);
    setResult(validation);
    setLoading(false);
    
    onValidated(validation, epic);
  };

  const getStatusColor = () => {
    if (!result) return 'border-gray-300';
    if (result.valid && result.confidence >= 0.9) return 'border-green-500 bg-green-50';
    if (result.valid) return 'border-yellow-500 bg-yellow-50';
    return 'border-red-500 bg-red-50';
  };

  const getStatusText = () => {
    if (!result) return null;
    if (result.valid && result.confidence >= 0.9) return '✓ Valid EPIC number';
    if (result.valid) return '⚠ Valid format, but could not verify';
    return `✗ Invalid: ${result.errors?.[0] || 'Unknown error'}`;
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${getStatusColor()}`}>
      <label className="block mb-2 text-sm font-medium">
        Enter your EPIC (Voter ID) Number
      </label>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={epic}
          onChange={(e) => {
            setEpic(e.target.value.toUpperCase());
            setResult(null);
          }}
          placeholder="ABC1234567"
          className="flex-1 px-4 py-2 border rounded-lg uppercase font-mono text-lg"
          maxLength={10}
          onKeyDown={(e) => e.key === 'Enter' && handleValidate()}
        />
        
        <button
          onClick={handleValidate}
          disabled={loading || epic.length < 3}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '...' : 'Verify'}
        </button>
      </div>
      
      {result && (
        <p className={`mt-2 text-sm ${
          result.valid ? 'text-green-700' : 'text-red-600'
        }`}>
          {getStatusText()}
        </p>
      )}
      
      {result?.type === 'modern' && (
        <p className="mt-1 text-xs text-gray-600">
          Modern format (post-1993)
        </p>
      )}
      {result?.type === 'legacy' && (
        <p className="mt-1 text-xs text-gray-600">
          Legacy format (pre-1993)
        </p>
      )}
    </div>
  );
}
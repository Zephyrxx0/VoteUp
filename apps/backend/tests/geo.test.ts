import { test, mock } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import { getConstituencyByCoords, loadConstituencyData } from '../src/services/geo/mapper.ts';

test('MAP-01: getConstituencyByCoords - GPS to AC mapping', async () => {
  const mockGeoJSON = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          id: 'AC_DEL_01',
          state: 'Delhi',
          type: 'AC'
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [77.0, 28.0],
              [77.1, 28.0],
              [77.1, 28.1],
              [77.0, 28.1],
              [77.0, 28.0]
            ]
          ]
        }
      }
    ]
  };

  // Mock file system
  mock.method(fs, 'existsSync', () => true);
  mock.method(fs, 'readFileSync', () => JSON.stringify(mockGeoJSON));

  await loadConstituencyData();

  // Inside Delhi AC
  const result = getConstituencyByCoords(28.05, 77.05);
  assert.strictEqual(result.acId, 'AC_DEL_01');
  assert.strictEqual(result.state, 'Delhi');
  assert.strictEqual(result.confidence, 0.95);

  // Outside
  const resultOutside = getConstituencyByCoords(30.0, 80.0);
  assert.strictEqual(resultOutside.acId, null);

  mock.reset();
});

test('MAP-01: getConstituencyByCoords - invalid inputs', () => {
  const result = getConstituencyByCoords(91, 181);
  assert.strictEqual(result.acId, null);
  assert.strictEqual(result.confidence, 0);
});

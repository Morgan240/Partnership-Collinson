/**
 * UNIT TESTS — PriModel v.2 Scoring Engine
 *
 * Tests the pure logic functions in isolation:
 * - Lookup tables (VLOOKUP approximate match)
 * - Dimension scoring (Capacity, Fairness, Urgency)
 * - Weighted composition
 * - Hard overrides (MAX_WAIT)
 * - Full ranking pipeline
 * - Auth validation
 */

import { describe, it, expect } from 'vitest';
import { vlookupScore, lookupPartySizeScore, lookupTTDScore, lookupWaitTimeScore, getModeWeights, OCCUPANCY_MODIFIERS } from '../engine/lookupTables';
import { calculateCapacityScore, calculateFairnessScore, calculateUrgencyScore } from '../engine/dimensions';
import { scoreEntry, rankEntries, calculateOccupancyLevel } from '../engine/scorer';
import { validateCredentials } from '../data/auth';
import type { WaitlistEntry, OptimizationMode } from '../engine/types';

// ============================================================
// 1. LOOKUP TABLES — VLOOKUP Approximate Match
// ============================================================

describe('VLOOKUP Approximate Match', () => {
  it('finds exact threshold match', () => {
    // Party size table: threshold 2 → 85
    expect(lookupPartySizeScore(2)).toBe(85);
  });

  it('finds largest threshold ≤ value (between thresholds)', () => {
    // TTD=50: thresholds are 15,30,45,60 → largest ≤ 50 is 45 → score 90
    expect(lookupTTDScore(50)).toBe(90);
  });

  it('returns first entry when value ≤ first threshold', () => {
    expect(lookupPartySizeScore(0)).toBe(100); // ≤ 1 → 100
    expect(lookupPartySizeScore(1)).toBe(100);
  });

  it('returns last entry for very large values', () => {
    expect(lookupTTDScore(9999)).toBe(0);
    expect(lookupWaitTimeScore(9999)).toBe(100);
  });
});

describe('Party Size Lookup', () => {
  it('maps exact values correctly', () => {
    expect(lookupPartySizeScore(1)).toBe(100);
    expect(lookupPartySizeScore(2)).toBe(85);
    expect(lookupPartySizeScore(3)).toBe(70);
    expect(lookupPartySizeScore(4)).toBe(55);
    expect(lookupPartySizeScore(5)).toBe(40);
    expect(lookupPartySizeScore(6)).toBe(25);
  });
});

describe('TTD Lookup (No Taper)', () => {
  it('maps boundary values correctly', () => {
    expect(lookupTTDScore(15)).toBe(100);
    expect(lookupTTDScore(30)).toBe(95);
    expect(lookupTTDScore(45)).toBe(90);
    expect(lookupTTDScore(60)).toBe(80);
    expect(lookupTTDScore(90)).toBe(65);
    expect(lookupTTDScore(120)).toBe(45);
    expect(lookupTTDScore(150)).toBe(25);
    expect(lookupTTDScore(180)).toBe(10);
  });

  it('VLOOKUP: TTD=89 → threshold 60 → score 80', () => {
    expect(lookupTTDScore(89)).toBe(80);
  });

  it('VLOOKUP: TTD=25 → threshold 15 → score 100', () => {
    expect(lookupTTDScore(25)).toBe(100);
  });
});

describe('Wait Time Lookup', () => {
  it('maps boundary values correctly', () => {
    expect(lookupWaitTimeScore(5)).toBe(10);
    expect(lookupWaitTimeScore(10)).toBe(20);
    expect(lookupWaitTimeScore(15)).toBe(30);
    expect(lookupWaitTimeScore(40)).toBe(80);
    expect(lookupWaitTimeScore(60)).toBe(95);
  });

  it('VLOOKUP: wait=35 → threshold 35 → score 70', () => {
    expect(lookupWaitTimeScore(35)).toBe(70);
  });
});

// ============================================================
// 2. DIMENSION SCORING
// ============================================================

describe('Capacity Dimension', () => {
  it('applies occupancy modifier correctly', () => {
    // party_size=1 → lookup 100, low occupancy → ×0.8 = 80
    expect(calculateCapacityScore(1, 'low')).toBe(80);
    // party_size=1, medium → ×1.0 = 100
    expect(calculateCapacityScore(1, 'medium')).toBe(100);
    // party_size=1, high → min(100, 100×1.2) = 100 (capped at 100)
    expect(calculateCapacityScore(1, 'high')).toBe(100);
    // party_size=2, high → min(100, 85×1.2) = 100 (capped)
    expect(calculateCapacityScore(2, 'high')).toBe(100);
    // party_size=3, high → min(100, 70×1.2) = 84
    expect(calculateCapacityScore(3, 'high')).toBe(84);
  });

  it('larger parties get lower scores', () => {
    const solo = calculateCapacityScore(1, 'medium');
    const couple = calculateCapacityScore(2, 'medium');
    const group = calculateCapacityScore(5, 'medium');
    expect(solo).toBeGreaterThan(couple);
    expect(couple).toBeGreaterThan(group);
  });
});

describe('Fairness Dimension', () => {
  it('longer waits get higher scores', () => {
    const short = calculateFairnessScore(5);
    const medium = calculateFairnessScore(30);
    const long = calculateFairnessScore(60);
    expect(long).toBeGreaterThan(medium);
    expect(medium).toBeGreaterThan(short);
  });

  it('matches spreadsheet values', () => {
    expect(calculateFairnessScore(15)).toBe(30);
    expect(calculateFairnessScore(35)).toBe(70);
    expect(calculateFairnessScore(40)).toBe(80);
  });
});

describe('Urgency Dimension', () => {
  it('shorter TTD gets higher urgency', () => {
    const imminent = calculateUrgencyScore(15);
    const medium = calculateUrgencyScore(90);
    const distant = calculateUrgencyScore(180);
    expect(imminent).toBeGreaterThan(medium);
    expect(medium).toBeGreaterThan(distant);
  });
});

// ============================================================
// 3. OCCUPANCY LEVEL CALCULATION
// ============================================================

describe('Occupancy Level', () => {
  it('low when < 50%', () => {
    expect(calculateOccupancyLevel(20, 50)).toBe('low');
  });

  it('medium when 50-80%', () => {
    expect(calculateOccupancyLevel(30, 50)).toBe('medium');
    expect(calculateOccupancyLevel(39, 50)).toBe('medium');
  });

  it('high when >= 80%', () => {
    expect(calculateOccupancyLevel(40, 50)).toBe('high');
    expect(calculateOccupancyLevel(50, 50)).toBe('high');
  });
});

// ============================================================
// 4. SCORING PIPELINE — Spreadsheet v.2 Validation
// ============================================================

const SPREADSHEET_ENTRIES: WaitlistEntry[] = [
  { waitlist_id: 1, party_size: 1, time_to_departure_min: 50,  wait_time_min: 15 },
  { waitlist_id: 2, party_size: 2, time_to_departure_min: 120, wait_time_min: 10 },
  { waitlist_id: 3, party_size: 3, time_to_departure_min: 180, wait_time_min: 5 },
  { waitlist_id: 4, party_size: 4, time_to_departure_min: 89,  wait_time_min: 35 },
  { waitlist_id: 5, party_size: 2, time_to_departure_min: 25,  wait_time_min: 40 },
  { waitlist_id: 6, party_size: 5, time_to_departure_min: 160, wait_time_min: 20 },
];

describe('Spreadsheet v.2 — Balanced Mode', () => {
  it('matches exact scores from the spreadsheet', () => {
    const rankings = rankEntries(SPREADSHEET_ENTRIES, 'medium', 'balanced');
    const byId = (id: number) => rankings.find((r) => r.entry.waitlist_id === id)!;

    expect(byId(5).primodel_score).toBeCloseTo(88.75, 2);
    expect(byId(1).primodel_score).toBeCloseTo(75.5, 2);
    expect(byId(4).primodel_score).toBeCloseTo(68.25, 2);
    expect(byId(2).primodel_score).toBeCloseTo(51.5, 2);
    expect(byId(6).primodel_score).toBeCloseTo(34.75, 2);
    expect(byId(3).primodel_score).toBeCloseTo(31.0, 2);
  });

  it('ranks in correct order', () => {
    const rankings = rankEntries(SPREADSHEET_ENTRIES, 'medium', 'balanced');
    const order = rankings.map((r) => r.entry.waitlist_id);
    expect(order).toEqual([5, 1, 4, 2, 6, 3]);
  });
});

describe('Spreadsheet v.2 — Revenue Focus Mode', () => {
  it('matches exact scores', () => {
    const rankings = rankEntries(SPREADSHEET_ENTRIES, 'medium', 'revenue_focus');
    const byId = (id: number) => rankings.find((r) => r.entry.waitlist_id === id)!;

    // Revenue: Cap=0.20, Fair=0.20, Urg=0.60
    // G5: 0.20×85 + 0.20×80 + 0.60×100 = 93
    expect(byId(5).primodel_score).toBeCloseTo(93.0, 2);
    // G1: 0.20×100 + 0.20×30 + 0.60×90 = 80
    expect(byId(1).primodel_score).toBeCloseTo(80.0, 2);
    // G4: 0.20×55 + 0.20×70 + 0.60×80 = 73
    expect(byId(4).primodel_score).toBeCloseTo(73.0, 2);
  });
});

describe('Spreadsheet v.2 — Fairness First Mode', () => {
  it('matches exact scores', () => {
    const rankings = rankEntries(SPREADSHEET_ENTRIES, 'medium', 'fairness_first');
    const byId = (id: number) => rankings.find((r) => r.entry.waitlist_id === id)!;

    // Fairness First: Cap=0.20, Fair=0.55, Urg=0.25
    // G5: 0.20×85 + 0.55×80 + 0.25×100 = 86
    expect(byId(5).primodel_score).toBeCloseTo(86.0, 2);
    // G4: 0.20×55 + 0.55×70 + 0.25×80 = 69.5
    expect(byId(4).primodel_score).toBeCloseTo(69.5, 2);
  });
});

// ============================================================
// 5. HARD OVERRIDES
// ============================================================

describe('MAX_WAIT Override', () => {
  it('triggers when wait > 60 min', () => {
    const entry: WaitlistEntry = { waitlist_id: 99, party_size: 5, time_to_departure_min: 180, wait_time_min: 61 };
    const result = scoreEntry(entry, 'medium', 'balanced');
    expect(result.primodel_score).toBe(999);
    expect(result.override_applied).toBe('MAX_WAIT');
    expect(result.reasoning_label).toContain('Max wait');
  });

  it('does NOT trigger at exactly 60 min', () => {
    const entry: WaitlistEntry = { waitlist_id: 99, party_size: 5, time_to_departure_min: 180, wait_time_min: 60 };
    const result = scoreEntry(entry, 'medium', 'balanced');
    expect(result.primodel_score).not.toBe(999);
    expect(result.override_applied).toBeNull();
  });

  it('MAX_WAIT entries rank above normal entries', () => {
    const entries: WaitlistEntry[] = [
      { waitlist_id: 1, party_size: 1, time_to_departure_min: 15, wait_time_min: 50 },
      { waitlist_id: 2, party_size: 5, time_to_departure_min: 180, wait_time_min: 65 }, // MAX_WAIT
    ];
    const rankings = rankEntries(entries, 'medium', 'balanced');
    expect(rankings[0].entry.waitlist_id).toBe(2);
    expect(rankings[0].primodel_score).toBe(999);
  });
});

// ============================================================
// 6. MODE WEIGHTS
// ============================================================

describe('Mode Weights', () => {
  const modes: OptimizationMode[] = ['balanced', 'revenue_focus', 'efficiency_focus', 'fairness_first'];

  modes.forEach((mode) => {
    it(`${mode} weights sum to 1.0`, () => {
      const w = getModeWeights(mode);
      const sum = w.w1_capacity + w.w2_fairness + w.w3_urgency;
      expect(sum).toBeCloseTo(1.0, 5);
    });
  });

  it('balanced has equal-ish weights', () => {
    const w = getModeWeights('balanced');
    expect(w.w1_capacity).toBe(0.35);
    expect(w.w2_fairness).toBe(0.30);
    expect(w.w3_urgency).toBe(0.35);
  });

  it('efficiency_focus emphasizes capacity', () => {
    const w = getModeWeights('efficiency_focus');
    expect(w.w1_capacity).toBeGreaterThan(w.w2_fairness);
    expect(w.w1_capacity).toBeGreaterThan(w.w3_urgency);
  });

  it('fairness_first emphasizes fairness', () => {
    const w = getModeWeights('fairness_first');
    expect(w.w2_fairness).toBeGreaterThan(w.w1_capacity);
    expect(w.w2_fairness).toBeGreaterThan(w.w3_urgency);
  });
});

// ============================================================
// 7. AUTHENTICATION
// ============================================================

describe('Auth Validation', () => {
  it('accepts correct credentials', () => {
    expect(validateCredentials('waitlist', 'primodel2026')).toBe(true);
  });

  it('rejects wrong password', () => {
    expect(validateCredentials('waitlist', 'wrong')).toBe(false);
  });

  it('rejects wrong username', () => {
    expect(validateCredentials('admin', 'primodel2026')).toBe(false);
  });

  it('rejects empty credentials', () => {
    expect(validateCredentials('', '')).toBe(false);
  });

  it('is case-sensitive', () => {
    expect(validateCredentials('Waitlist', 'primodel2026')).toBe(false);
    expect(validateCredentials('waitlist', 'Primodel2026')).toBe(false);
  });
});

// ============================================================
// 8. EDGE CASES
// ============================================================

describe('Edge Cases', () => {
  it('handles party_size = 0 gracefully', () => {
    const score = calculateCapacityScore(0, 'medium');
    expect(typeof score).toBe('number');
    expect(score).toBeGreaterThanOrEqual(0);
  });

  it('handles TTD = 0 (departed flight)', () => {
    const score = calculateUrgencyScore(0);
    expect(typeof score).toBe('number');
    expect(score).toBeGreaterThanOrEqual(0);
  });

  it('handles single entry ranking', () => {
    const entries: WaitlistEntry[] = [
      { waitlist_id: 1, party_size: 2, time_to_departure_min: 60, wait_time_min: 20 },
    ];
    const rankings = rankEntries(entries, 'medium', 'balanced');
    expect(rankings).toHaveLength(1);
    expect(rankings[0].rank).toBe(1);
  });

  it('handles empty waitlist', () => {
    const rankings = rankEntries([], 'medium', 'balanced');
    expect(rankings).toHaveLength(0);
  });
});

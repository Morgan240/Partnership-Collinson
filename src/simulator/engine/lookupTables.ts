// PriModel v.2 - Parametrized Lookup Tables
// Source: LMS Waitlist Modelling spreadsheet (Simulation v.2 tab - right-side reference tables)
//
// IMPORTANT: These use VLOOKUP-style approximate match logic.
// Each table has thresholds sorted ascending. For a given input,
// we find the largest threshold <= input and return its score.
// This matches Excel VLOOKUP(value, table, 2, TRUE) behavior exactly.

import type { OccupancyLevel, OptimizationMode, ModeWeights } from './types';

// --- Lookup Table Entry ---
// threshold: the VLOOKUP key (first column in Excel)
// score: the returned value (second column in Excel)

interface LookupEntry {
  threshold: number;
  score: number;
}

// --- Party Size → Capacity Score ---
// Source: Simulation v.2 right-side reference (PartySize | CapScore)

const PARTY_SIZE_TABLE: LookupEntry[] = [
  { threshold: 1, score: 100 },
  { threshold: 2, score: 85 },
  { threshold: 3, score: 70 },
  { threshold: 4, score: 55 },
  { threshold: 5, score: 40 },
  { threshold: 6, score: 25 },
];

// --- Time to Departure → Urgency Score ---
// Source: Simulation v.2 right-side reference (TTD_Max | TTDScore)
// NO TAPER: short visits are optimal. Closer departure = higher score.

const TTD_TABLE: LookupEntry[] = [
  { threshold: 15,   score: 100 },
  { threshold: 30,   score: 95 },
  { threshold: 45,   score: 90 },
  { threshold: 60,   score: 80 },
  { threshold: 90,   score: 65 },
  { threshold: 120,  score: 45 },
  { threshold: 150,  score: 25 },
  { threshold: 180,  score: 10 },
  { threshold: 9999, score: 0 },
];

// --- Wait Time → Fairness Score ---
// Source: Simulation v.2 right-side reference (Wait_Max | WaitScore)
// Longer wait = higher score = higher priority.

const WAIT_TIME_TABLE: LookupEntry[] = [
  { threshold: 5,    score: 10 },
  { threshold: 10,   score: 20 },
  { threshold: 15,   score: 30 },
  { threshold: 20,   score: 40 },
  { threshold: 25,   score: 50 },
  { threshold: 30,   score: 60 },
  { threshold: 35,   score: 70 },
  { threshold: 40,   score: 80 },
  { threshold: 50,   score: 90 },
  { threshold: 60,   score: 95 },
  { threshold: 9999, score: 100 },
];

// --- Occupancy Pressure Modifier ---
// Source: Simulation v.2 (Occupancy | Modifier section)
// High occupancy → capacity matters MORE (small groups get stronger boost)

const OCCUPANCY_MODIFIERS: Record<OccupancyLevel, number> = {
  low: 0.8,
  medium: 1.0,
  high: 1.2,
};

// --- Optimization Mode Weights (v.2 - 3 dimensions) ---
// Source: Simulation v.2 tab (Model Weights Reference section)
// PriorityScore = W1×Capacity + W2×Fairness + W3×Urgency

const MODE_WEIGHTS: Record<OptimizationMode, ModeWeights> = {
  balanced: {
    w1_capacity: 0.35,
    w2_fairness: 0.30,
    w3_urgency: 0.35,
  },
  revenue_focus: {
    w1_capacity: 0.20,
    w2_fairness: 0.20,
    w3_urgency: 0.60,
  },
  efficiency_focus: {
    w1_capacity: 0.50,
    w2_fairness: 0.15,
    w3_urgency: 0.35,
  },
  fairness_first: {
    w1_capacity: 0.20,
    w2_fairness: 0.55,
    w3_urgency: 0.25,
  },
};

// --- VLOOKUP-Style Approximate Match ---
// Replicates Excel VLOOKUP(value, table, 2, TRUE):
// Finds the largest threshold <= value and returns the corresponding score.
// If value < first threshold, returns the first score (graceful handling).
// Table MUST be sorted by threshold ascending.

function vlookupScore(value: number, table: LookupEntry[]): number {
  let result = table[0].score; // fallback: first score if value < first threshold
  for (const entry of table) {
    if (entry.threshold <= value) {
      result = entry.score;
    } else {
      break; // table is sorted, no need to check further
    }
  }
  return result;
}

// --- Public Lookup Functions ---

export function lookupPartySizeScore(partySize: number): number {
  return vlookupScore(Math.max(1, partySize), PARTY_SIZE_TABLE);
}

export function lookupTTDScore(ttdMin: number): number {
  return vlookupScore(Math.max(0, ttdMin), TTD_TABLE);
}

export function lookupWaitTimeScore(waitTimeMin: number): number {
  return vlookupScore(Math.max(0, waitTimeMin), WAIT_TIME_TABLE);
}

export function getOccupancyModifier(level: OccupancyLevel): number {
  return OCCUPANCY_MODIFIERS[level];
}

export function getModeWeights(mode: OptimizationMode): ModeWeights {
  return MODE_WEIGHTS[mode];
}

// Export tables for transparency/debugging
export {
  PARTY_SIZE_TABLE,
  TTD_TABLE,
  WAIT_TIME_TABLE,
  OCCUPANCY_MODIFIERS,
  MODE_WEIGHTS,
};

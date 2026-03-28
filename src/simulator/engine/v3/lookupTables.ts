// PriModel v.3 - Parametrized Lookup Tables (4-Dimension)
// Source: LMS Waitlist Modelling spreadsheet (Simulation v.3 tab)
//
// v.3 additions over v.2:
//   - Revenue lookup (access program monetization tiers)
//   - Estimated Stay lookup (for enhanced capacity scoring)
//   - Consecutive Skips lookup (for enhanced fairness scoring)
//   - 4-weight mode table (Revenue, Capacity, Fairness, Urgency)
//
// Shared tables (PartySize, TTD, WaitTime, Occupancy) are imported from v2.

import type { OptimizationModeV3, ModeWeightsV3 } from './types';

// --- Lookup Table Entry ---

interface LookupEntry {
  threshold: number;
  score: number;
}

// --- Access Program → Revenue Score ---
// Higher-value commercial programs score higher.
// Day Pass scores highest (direct revenue), None scores 0.

const REVENUE_TABLE: Record<string, number> = {
  'Priority Pass': 80,
  'LoungeKey': 60,
  'Amex Platinum': 70,
  'Day Pass': 100,
  'None': 0,
};

// --- Estimated Stay (minutes) → Capacity Score Component ---
// Shorter stays free seats faster = higher score.
// Uses VLOOKUP-style approximate match.

const EST_STAY_TABLE: LookupEntry[] = [
  { threshold: 15,  score: 100 },
  { threshold: 30,  score: 85 },
  { threshold: 45,  score: 70 },
  { threshold: 60,  score: 55 },
  { threshold: 90,  score: 35 },
  { threshold: 120, score: 20 },
];

// --- Consecutive Skips → Fairness Score Component ---
// More skips = higher fairness urgency = higher score.
// Uses VLOOKUP-style approximate match.

const CONSECUTIVE_SKIPS_TABLE: LookupEntry[] = [
  { threshold: 0,  score: 0 },
  { threshold: 1,  score: 15 },
  { threshold: 2,  score: 30 },
  { threshold: 3,  score: 50 },
  { threshold: 5,  score: 70 },
  { threshold: 7,  score: 85 },
  { threshold: 10, score: 100 },
];

// --- v3 Optimization Mode Weights (4 dimensions) ---
// PriorityScore = W1*Revenue + W2*Capacity + W3*Fairness + W4*Urgency

const MODE_WEIGHTS_V3: Record<OptimizationModeV3, ModeWeightsV3> = {
  balanced: {
    w1_revenue: 0.25,
    w2_capacity: 0.25,
    w3_fairness: 0.30,
    w4_urgency: 0.20,
  },
  revenue_focus: {
    w1_revenue: 0.45,
    w2_capacity: 0.25,
    w3_fairness: 0.15,
    w4_urgency: 0.15,
  },
  efficiency_focus: {
    w1_revenue: 0.15,
    w2_capacity: 0.40,
    w3_fairness: 0.20,
    w4_urgency: 0.25,
  },
  fairness_first: {
    w1_revenue: 0.10,
    w2_capacity: 0.20,
    w3_fairness: 0.50,
    w4_urgency: 0.20,
  },
};

// --- VLOOKUP-Style Approximate Match ---
// Replicates Excel VLOOKUP(value, table, 2, TRUE):
// Finds the largest threshold <= value and returns the corresponding score.
// If value < first threshold, returns the first score (graceful handling).
// Table MUST be sorted by threshold ascending.

function vlookupScore(value: number, table: LookupEntry[]): number {
  let result = table[0].score;
  for (const entry of table) {
    if (entry.threshold <= value) {
      result = entry.score;
    } else {
      break;
    }
  }
  return result;
}

// --- Public Lookup Functions ---

/**
 * Look up revenue score by access program name.
 * Returns 0 for unknown programs (treated as 'None').
 */
export function lookupRevenueScore(accessProgram: string): number {
  return REVENUE_TABLE[accessProgram] ?? 0;
}

/**
 * Look up estimated stay score (shorter stays score higher).
 */
export function lookupEstStayScore(estStayMin: number): number {
  return vlookupScore(Math.max(0, estStayMin), EST_STAY_TABLE);
}

/**
 * Look up consecutive skips score (more skips = higher fairness urgency).
 */
export function lookupConsecutiveSkipsScore(skips: number): number {
  return vlookupScore(Math.max(0, skips), CONSECUTIVE_SKIPS_TABLE);
}

/**
 * Get the 4-dimension weight configuration for a given mode.
 */
export function getModeWeightsV3(mode: OptimizationModeV3): ModeWeightsV3 {
  return MODE_WEIGHTS_V3[mode];
}

// Export tables for transparency/debugging
export {
  REVENUE_TABLE,
  EST_STAY_TABLE,
  CONSECUTIVE_SKIPS_TABLE,
  MODE_WEIGHTS_V3,
};

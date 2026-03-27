// PriModel v.2 - Dimension Scoring Functions
// Each dimension produces a score on [0, 100] via parametrized lookup tables.
//
// v.2 Simplified:
//   Capacity  = PartySize score × Occupancy Modifier
//   Fairness  = WaitTime score (no skips in v.2)
//   Urgency   = TTD score (no flight status modifier in v.2)

import type { OccupancyLevel } from './types';
import {
  lookupPartySizeScore,
  lookupWaitTimeScore,
  lookupTTDScore,
  getOccupancyModifier,
} from './lookupTables';

/**
 * Capacity Score (v.2 simplified)
 *
 * In v.2: CapacityScore = VLOOKUP(PartySize) × OccupancyModifier
 * In v.3: CapacityScore = (PartySize×0.4 + EstStay×0.6) × OccupancyModifier
 *
 * Lower party size = higher score = better for throughput.
 * High occupancy amplifies the preference for small groups (×1.2).
 */
export function calculateCapacityScore(
  partySize: number,
  occupancyLevel: OccupancyLevel
): number {
  const baseScore = lookupPartySizeScore(partySize);
  const modifier = getOccupancyModifier(occupancyLevel);
  // Cap at 100 after modifier application
  return Math.min(100, baseScore * modifier);
}

/**
 * Fairness Score (v.2 simplified)
 *
 * In v.2: FairnessScore = VLOOKUP(WaitTime)
 * In v.3: FairnessScore = (WaitScore×0.6) + (SkipScore×0.4)
 *
 * Longer wait = higher score = higher priority.
 * Fairness is the most robust dimension: wait_time is always available.
 */
export function calculateFairnessScore(waitTimeMin: number): number {
  return lookupWaitTimeScore(waitTimeMin);
}

/**
 * Urgency Score (v.2 simplified)
 *
 * In v.2: UrgencyScore = VLOOKUP(TTD)
 * In v.3: UrgencyScore = TTD_Score modified by Flight Status
 *
 * NO TAPER: short visits are optimal.
 * A 10-minute visit collects the fee, frees the seat, maximizes throughput.
 * Closer departure = higher score.
 */
export function calculateUrgencyScore(ttdMin: number): number {
  return lookupTTDScore(ttdMin);
}

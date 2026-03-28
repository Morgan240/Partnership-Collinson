// PriModel v.3 - Dimension Scoring Functions (4 Dimensions)
// Each dimension produces a score on [0, 100].
//
// v.3 Dimensions:
//   Revenue   = Access Program lookup (new in v.3)
//   Capacity  = (PartySizeScore * 0.4 + EstStayScore * 0.6) * OccupancyModifier
//   Fairness  = WaitScore * 0.6 + SkipScore * 0.4
//   Urgency   = TTD score (reused from v.2)

import type { OccupancyLevel } from './types';
import {
  lookupPartySizeScore,
  lookupWaitTimeScore,
  lookupTTDScore,
  getOccupancyModifier,
} from '../lookupTables';
import {
  lookupRevenueScore,
  lookupEstStayScore,
  lookupConsecutiveSkipsScore,
} from './lookupTables';

/**
 * Revenue Score (new in v.3)
 *
 * RevenueScore = LOOKUP(accessProgram)
 *
 * Maps access program to a monetization tier score.
 * Day Pass (direct purchase) scores highest; unknown programs score 0.
 */
export function calculateRevenueScore(accessProgram: string): number {
  return lookupRevenueScore(accessProgram);
}

/**
 * Capacity Score (v.3 enhanced)
 *
 * CapacityScore = (PartySizeScore * 0.4 + EstStayScore * 0.6) * OccupancyModifier
 *
 * v.3 blends party size with estimated stay duration.
 * Shorter stays free seats faster, weighted more heavily than party size.
 * High occupancy amplifies the preference for efficient guests (x1.2).
 * Result capped at 100.
 */
export function calculateCapacityScoreV3(
  partySize: number,
  estStayMin: number,
  occupancyLevel: OccupancyLevel
): number {
  const partySizeScore = lookupPartySizeScore(partySize);
  const estStayScore = lookupEstStayScore(estStayMin);
  const modifier = getOccupancyModifier(occupancyLevel);

  const blended = partySizeScore * 0.4 + estStayScore * 0.6;
  return Math.min(100, blended * modifier);
}

/**
 * Fairness Score (v.3 enhanced)
 *
 * FairnessScore = WaitScore * 0.6 + SkipScore * 0.4
 *
 * v.3 blends wait time with consecutive skips.
 * Being skipped repeatedly increases fairness urgency.
 * Wait time remains the dominant signal (60% weight).
 */
export function calculateFairnessScoreV3(
  waitTimeMin: number,
  consecutiveSkips: number
): number {
  const waitScore = lookupWaitTimeScore(waitTimeMin);
  const skipScore = lookupConsecutiveSkipsScore(consecutiveSkips);
  return waitScore * 0.6 + skipScore * 0.4;
}

/**
 * Urgency Score (same as v.2)
 *
 * UrgencyScore = VLOOKUP(TTD)
 *
 * Closer departure = higher score.
 * No taper: short visits are optimal for throughput.
 * Reuses the v.2 TTD lookup table directly.
 */
export function calculateUrgencyScore(ttdMin: number): number {
  return lookupTTDScore(ttdMin);
}

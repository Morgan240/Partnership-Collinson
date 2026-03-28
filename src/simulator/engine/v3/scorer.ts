// PriModel v.3 - Main Scoring Engine (4 Dimensions)
// PriorityScore = W1*Revenue + W2*Capacity + W3*Fairness + W4*Urgency
//
// Processing pipeline:
// 1. Each entry scored independently across 4 dimensions (lookup tables)
// 2. Dimension scores weighted by active optimization mode
// 3. Hard overrides bypass the weighted score when triggered
// 4. Output: sorted array with ranks and reasoning labels
//
// Hard Overrides (v.3):
//   P1: wait_time > 60 min         → Score = 999 (forced #1)
//   P2: consecutive_skips >= 10    → Score = 998 (forced near-top)

import type { OccupancyLevel } from '../types';
import type {
  WaitlistEntryV3,
  OptimizationModeV3,
  ModeWeightsV3,
  DimensionScoresV3,
  ScoredEntryV3,
  OverrideTypeV3,
  LoungeConfigV3,
} from './types';
import {
  calculateRevenueScore,
  calculateCapacityScoreV3,
  calculateFairnessScoreV3,
  calculateUrgencyScore,
} from './dimensions';
import { getModeWeightsV3 } from './lookupTables';

// --- Default Configuration ---

const DEFAULT_CONFIG_V3: LoungeConfigV3 = {
  max_capacity: 50,
  max_wait_hard_ceiling: 60,
  occupancy_high_threshold: 0.80,
  occupancy_low_threshold: 0.50,
  suggestion_card_count: 3,
  default_mode: 'balanced',
  max_consecutive_skips_ceiling: 10,
};

// --- Occupancy Level Calculation ---

export function calculateOccupancyLevel(
  currentHeadcount: number,
  maxCapacity: number,
  config: LoungeConfigV3 = DEFAULT_CONFIG_V3
): OccupancyLevel {
  const occupancyPct = currentHeadcount / maxCapacity;
  if (occupancyPct >= config.occupancy_high_threshold) return 'high';
  if (occupancyPct >= config.occupancy_low_threshold) return 'medium';
  return 'low';
}

// --- Dimension Scoring ---

function scoreDimensions(
  entry: WaitlistEntryV3,
  occupancyLevel: OccupancyLevel
): DimensionScoresV3 {
  return {
    revenue: calculateRevenueScore(entry.access_program),
    capacity: calculateCapacityScoreV3(
      entry.party_size,
      entry.est_stay_min,
      occupancyLevel
    ),
    fairness: calculateFairnessScoreV3(
      entry.wait_time_min,
      entry.consecutive_skips
    ),
    urgency: calculateUrgencyScore(entry.time_to_departure_min),
  };
}

// --- Weighted Composition ---

function applyWeights(
  scores: DimensionScoresV3,
  weights: ModeWeightsV3
): { weighted: DimensionScoresV3; composite: number } {
  const weighted: DimensionScoresV3 = {
    revenue: scores.revenue * weights.w1_revenue,
    capacity: scores.capacity * weights.w2_capacity,
    fairness: scores.fairness * weights.w3_fairness,
    urgency: scores.urgency * weights.w4_urgency,
  };
  const composite =
    weighted.revenue + weighted.capacity + weighted.fairness + weighted.urgency;
  return { weighted, composite };
}

// --- Hard Override Rules (v.3) ---
// P1: wait_time > max_wait_hard_ceiling (60 min default) → Score = 999
// P2: consecutive_skips >= max_consecutive_skips_ceiling (10 default) → Score = 998
// P1 takes precedence over P2.

function checkHardOverrides(
  entry: WaitlistEntryV3,
  config: LoungeConfigV3 = DEFAULT_CONFIG_V3
): { override: OverrideTypeV3; score: number | null } {
  if (entry.wait_time_min > config.max_wait_hard_ceiling) {
    return { override: 'MAX_WAIT', score: 999 };
  }
  if (entry.consecutive_skips >= config.max_consecutive_skips_ceiling) {
    return { override: 'MAX_SKIPS', score: 998 };
  }
  return { override: null, score: null };
}

// --- Reasoning Label ---
// Determines which dimension contributed most to the final score.

function getReasoningLabel(
  scores: DimensionScoresV3,
  weights: ModeWeightsV3,
  override: OverrideTypeV3
): string {
  if (override === 'MAX_WAIT') {
    return 'Max wait time exceeded \u2014 forced priority';
  }
  if (override === 'MAX_SKIPS') {
    return 'Skipped too many times \u2014 forced priority';
  }

  const contributions = {
    revenue: scores.revenue * weights.w1_revenue,
    capacity: scores.capacity * weights.w2_capacity,
    fairness: scores.fairness * weights.w3_fairness,
    urgency: scores.urgency * weights.w4_urgency,
  };

  const dominant = Object.entries(contributions).reduce((a, b) =>
    a[1] >= b[1] ? a : b
  );

  const labels: Record<string, string> = {
    revenue: 'High-value access program',
    capacity: 'Quick turnover + low seat impact',
    fairness: 'Longest waiting group',
    urgency: 'Flight departing soon',
  };

  return labels[dominant[0]] || 'Balanced profile';
}

// --- Main Scoring Function ---

/**
 * Score a single waitlist entry across all 4 dimensions.
 * Returns the scored result without a rank (rank is assigned during ranking).
 */
export function scoreEntryV3(
  entry: WaitlistEntryV3,
  occupancyLevel: OccupancyLevel,
  mode: OptimizationModeV3,
  config: LoungeConfigV3 = DEFAULT_CONFIG_V3
): Omit<ScoredEntryV3, 'rank'> {
  const weights = getModeWeightsV3(mode);
  const scores = scoreDimensions(entry, occupancyLevel);
  const { weighted, composite } = applyWeights(scores, weights);
  const { override, score: overrideScore } = checkHardOverrides(entry, config);
  const reasoning = getReasoningLabel(scores, weights, override);

  return {
    entry,
    scores,
    weighted_scores: weighted,
    primodel_score: overrideScore ?? composite,
    override_applied: override,
    reasoning_label: reasoning,
  };
}

// --- Rank All Entries ---

/**
 * Score and rank all waitlist entries.
 * Entries are sorted by primodel_score descending and assigned 1-based ranks.
 */
export function rankEntriesV3(
  entries: WaitlistEntryV3[],
  occupancyLevel: OccupancyLevel,
  mode: OptimizationModeV3,
  config: LoungeConfigV3 = DEFAULT_CONFIG_V3
): ScoredEntryV3[] {
  const scored = entries.map((entry) =>
    scoreEntryV3(entry, occupancyLevel, mode, config)
  );

  // Sort by primodel_score descending
  scored.sort((a, b) => b.primodel_score - a.primodel_score);

  // Assign ranks (1-based)
  return scored.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
}

// --- Run Full Simulation ---
// Convenience function that runs scoring for all 4 modes.

export interface SimulationResultV3 {
  mode: OptimizationModeV3;
  rankings: ScoredEntryV3[];
}

/**
 * Run the full v3 simulation across all optimization modes.
 * Returns one ranked list per mode for side-by-side comparison.
 */
export function runFullSimulationV3(
  entries: WaitlistEntryV3[],
  occupancyLevel: OccupancyLevel,
  config: LoungeConfigV3 = DEFAULT_CONFIG_V3
): SimulationResultV3[] {
  const modes: OptimizationModeV3[] = [
    'balanced',
    'revenue_focus',
    'efficiency_focus',
    'fairness_first',
  ];

  return modes.map((mode) => ({
    mode,
    rankings: rankEntriesV3(entries, occupancyLevel, mode, config),
  }));
}

export { DEFAULT_CONFIG_V3 };

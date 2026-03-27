// PriModel v.2 - Main Scoring Engine
// PriorityScore = W1×Capacity + W2×Fairness + W3×Urgency
//
// Processing pipeline:
// 1. Each entry scored independently across 3 dimensions (lookup tables)
// 2. Dimension scores weighted by active optimization mode
// 3. Hard overrides bypass the weighted score when triggered
// 4. Output: sorted array with ranks and reasoning labels

import type {
  WaitlistEntry,
  OccupancyLevel,
  OptimizationMode,
  ModeWeights,
  DimensionScores,
  ScoredEntry,
  OverrideType,
  LoungeConfig,
} from './types';
import {
  calculateCapacityScore,
  calculateFairnessScore,
  calculateUrgencyScore,
} from './dimensions';
import { getModeWeights } from './lookupTables';

// --- Default Configuration ---

const DEFAULT_CONFIG: LoungeConfig = {
  max_capacity: 50,
  max_wait_hard_ceiling: 60,
  occupancy_high_threshold: 0.80,
  occupancy_low_threshold: 0.50,
  suggestion_card_count: 3,
  default_mode: 'balanced',
};

// --- Occupancy Level Calculation ---

export function calculateOccupancyLevel(
  currentHeadcount: number,
  maxCapacity: number,
  config: LoungeConfig = DEFAULT_CONFIG
): OccupancyLevel {
  const occupancyPct = currentHeadcount / maxCapacity;
  if (occupancyPct >= config.occupancy_high_threshold) return 'high';
  if (occupancyPct >= config.occupancy_low_threshold) return 'medium';
  return 'low';
}

// --- Dimension Scoring ---

function scoreDimensions(
  entry: WaitlistEntry,
  occupancyLevel: OccupancyLevel
): DimensionScores {
  return {
    capacity: calculateCapacityScore(entry.party_size, occupancyLevel),
    fairness: calculateFairnessScore(entry.wait_time_min),
    urgency: calculateUrgencyScore(entry.time_to_departure_min),
  };
}

// --- Weighted Composition ---

function applyWeights(
  scores: DimensionScores,
  weights: ModeWeights
): { weighted: DimensionScores; composite: number } {
  const weighted: DimensionScores = {
    capacity: scores.capacity * weights.w1_capacity,
    fairness: scores.fairness * weights.w2_fairness,
    urgency: scores.urgency * weights.w3_urgency,
  };
  const composite = weighted.capacity + weighted.fairness + weighted.urgency;
  return { weighted, composite };
}

// --- Hard Override Rules (v.2) ---
// P1: wait_time > max_wait_hard_ceiling → Score = 999 (forced #1)

function checkHardOverrides(
  entry: WaitlistEntry,
  config: LoungeConfig = DEFAULT_CONFIG
): { override: OverrideType; score: number | null } {
  if (entry.wait_time_min > config.max_wait_hard_ceiling) {
    return { override: 'MAX_WAIT', score: 999 };
  }
  return { override: null, score: null };
}

// --- Reasoning Label ---
// Determines which dimension contributed most to the final score

function getReasoningLabel(
  scores: DimensionScores,
  weights: ModeWeights,
  override: OverrideType
): string {
  if (override === 'MAX_WAIT') {
    return 'Max wait time exceeded — forced priority';
  }

  const contributions = {
    capacity: scores.capacity * weights.w1_capacity,
    fairness: scores.fairness * weights.w2_fairness,
    urgency: scores.urgency * weights.w3_urgency,
  };

  const dominant = Object.entries(contributions).reduce((a, b) =>
    a[1] >= b[1] ? a : b
  );

  const labels: Record<string, string> = {
    capacity: 'Quick turnover + low seat impact',
    fairness: 'Longest waiting group',
    urgency: 'Flight departing soon',
  };

  return labels[dominant[0]] || 'Balanced profile';
}

// --- Main Scoring Function ---

export function scoreEntry(
  entry: WaitlistEntry,
  occupancyLevel: OccupancyLevel,
  mode: OptimizationMode,
  config: LoungeConfig = DEFAULT_CONFIG
): Omit<ScoredEntry, 'rank'> {
  const weights = getModeWeights(mode);
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

export function rankEntries(
  entries: WaitlistEntry[],
  occupancyLevel: OccupancyLevel,
  mode: OptimizationMode,
  config: LoungeConfig = DEFAULT_CONFIG
): ScoredEntry[] {
  const scored = entries.map((entry) =>
    scoreEntry(entry, occupancyLevel, mode, config)
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
// Convenience function that runs scoring for all 4 modes

export interface SimulationResult {
  mode: OptimizationMode;
  rankings: ScoredEntry[];
}

export function runFullSimulation(
  entries: WaitlistEntry[],
  occupancyLevel: OccupancyLevel,
  config: LoungeConfig = DEFAULT_CONFIG
): SimulationResult[] {
  const modes: OptimizationMode[] = [
    'balanced',
    'revenue_focus',
    'efficiency_focus',
    'fairness_first',
  ];

  return modes.map((mode) => ({
    mode,
    rankings: rankEntries(entries, occupancyLevel, mode, config),
  }));
}

export { DEFAULT_CONFIG };

// PriModel v.3 - 4-Dimension Scoring Engine Types
// Based on: LMS Waitlist Modelling - Simulation v.3
// Dimensions: Revenue, Capacity, Fairness, Urgency
//
// v.3 adds:
//   - Revenue dimension (access program monetization)
//   - Enhanced Capacity (party size + estimated stay duration)
//   - Enhanced Fairness (wait time + consecutive skips)

import type {
  WaitlistEntry,
  OccupancyLevel,
  LoungeConfig,
} from '../types';

// --- v3 Waitlist Entry (extends v2 with revenue & fairness fields) ---

export interface WaitlistEntryV3 extends WaitlistEntry {
  /** Access program the guest used (e.g., 'Priority Pass', 'LoungeKey') */
  access_program: string;
  /** Number of times this entry has been skipped in the queue */
  consecutive_skips: number;
  /** Estimated stay duration in minutes */
  est_stay_min: number;
}

// --- v3 Dimension Scores (4 dimensions, each 0-100) ---

export interface DimensionScoresV3 {
  revenue: number;
  capacity: number;
  fairness: number;
  urgency: number;
}

// --- v3 Hard Override Types ---

export type OverrideTypeV3 = 'MAX_WAIT' | 'MAX_SKIPS' | null;

// --- v3 Scored Result ---

export interface ScoredEntryV3 {
  entry: WaitlistEntryV3;
  scores: DimensionScoresV3;
  weighted_scores: DimensionScoresV3;
  primodel_score: number;           // 0-100, or 998/999 (overrides)
  rank: number;
  override_applied: OverrideTypeV3;
  reasoning_label: string;
}

// --- v3 Optimization Modes (same names, 4 weights) ---

export type OptimizationModeV3 =
  | 'balanced'
  | 'revenue_focus'
  | 'efficiency_focus'
  | 'fairness_first';

export interface ModeWeightsV3 {
  w1_revenue: number;
  w2_capacity: number;
  w3_fairness: number;
  w4_urgency: number;
}

// --- v3 Lounge Configuration (extends v2 with skip ceiling) ---

export interface LoungeConfigV3 extends LoungeConfig {
  /** Consecutive skips threshold that triggers a hard override */
  max_consecutive_skips_ceiling: number;
}

// --- v3 Scenario Preset ---

export interface ScenarioV3 {
  id: string;
  name: string;
  description: string;
  lounge_state: {
    available_seats: number;
    max_capacity: number;
    current_headcount: number;
    occupancy_level: OccupancyLevel;
  };
  entries: WaitlistEntryV3[];
  recommended_mode: OptimizationModeV3;
}

// Re-export shared types for convenience
export type { OccupancyLevel } from '../types';

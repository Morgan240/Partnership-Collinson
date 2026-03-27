// PriModel v.2 - Simplified 3-Dimension Scoring Engine
// Based on: LMS Waitlist Modelling - Simulation v.2
// Dimensions: Capacity, Fairness, Urgency (Revenue deferred to v.3)

// --- Front-End Input (3 variables per entry) ---

export interface WaitlistEntry {
  waitlist_id: number;
  party_size: number;            // 1-6+
  time_to_departure_min: number; // minutes until flight departure
  wait_time_min: number;         // minutes waiting in the queue
}

// --- Lounge Global State ---

export type OccupancyLevel = 'low' | 'medium' | 'high';

export interface LoungeState {
  available_seats: number;
  max_capacity: number;
  current_headcount: number;
  occupancy_level: OccupancyLevel; // auto-calculated or manual
}

// --- Dimension Scores (each 0-100) ---

export interface DimensionScores {
  capacity: number;
  fairness: number;
  urgency: number;
}

// --- Hard Override Types ---

export type OverrideType = 'MAX_WAIT' | null;

// --- Scored Result ---

export interface ScoredEntry {
  entry: WaitlistEntry;
  scores: DimensionScores;
  weighted_scores: DimensionScores; // after applying weights
  primodel_score: number;           // 0-100 or 999 (override)
  rank: number;
  override_applied: OverrideType;
  reasoning_label: string;
}

// --- Optimization Modes (v.2 - 3 weights) ---

export type OptimizationMode =
  | 'balanced'
  | 'revenue_focus'
  | 'efficiency_focus'
  | 'fairness_first';

export interface ModeWeights {
  w1_capacity: number;
  w2_fairness: number;
  w3_urgency: number;
}

// --- Lounge Configuration ---

export interface LoungeConfig {
  max_capacity: number;
  max_wait_hard_ceiling: number;     // minutes - triggers Max Wait override
  occupancy_high_threshold: number;  // e.g. 0.80
  occupancy_low_threshold: number;   // e.g. 0.50
  suggestion_card_count: number;     // how many top cards to show (default 3)
  default_mode: OptimizationMode;
}

// --- Scenario Preset ---

export interface Scenario {
  id: string;
  name: string;
  description: string;
  lounge_state: LoungeState;
  entries: WaitlistEntry[];
  recommended_mode: OptimizationMode;
}

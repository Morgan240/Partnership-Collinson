// PriModel v.2 - Lounge Configuration Presets
// Every numerical value is configurable per lounge via admin UI.
// Source: PDF Section 8.3 Configuration Parameters

import type { LoungeConfig, OptimizationMode } from '../engine/types';

// --- Default Configuration ---
// Safe starting point for any lounge

export const DEFAULT_LOUNGE_CONFIG: LoungeConfig = {
  max_capacity: 50,
  max_wait_hard_ceiling: 60,     // minutes — triggers Max Wait override
  occupancy_high_threshold: 0.80,
  occupancy_low_threshold: 0.50,
  suggestion_card_count: 3,
  default_mode: 'balanced',
};

// --- Sample Lounge Presets (Fake Database) ---
// In production, these would be stored per-lounge in the database.

export interface LoungePreset {
  id: string;
  name: string;
  location: string;
  iata_code: string;
  config: LoungeConfig;
}

export const LOUNGE_PRESETS: LoungePreset[] = [
  {
    id: 'gru-star-alliance',
    name: 'Star Alliance Lounge',
    location: 'GRU - São Paulo Guarulhos',
    iata_code: 'GRU',
    config: {
      max_capacity: 120,
      max_wait_hard_ceiling: 60,
      occupancy_high_threshold: 0.80,
      occupancy_low_threshold: 0.50,
      suggestion_card_count: 3,
      default_mode: 'balanced',
    },
  },
  {
    id: 'mia-admiral',
    name: 'Admirals Club',
    location: 'MIA - Miami International',
    iata_code: 'MIA',
    config: {
      max_capacity: 80,
      max_wait_hard_ceiling: 60,
      occupancy_high_threshold: 0.85,
      occupancy_low_threshold: 0.50,
      suggestion_card_count: 3,
      default_mode: 'balanced',
    },
  },
  {
    id: 'lhr-plaza-premium',
    name: 'Plaza Premium Lounge',
    location: 'LHR - London Heathrow T2',
    iata_code: 'LHR',
    config: {
      max_capacity: 200,
      max_wait_hard_ceiling: 45,
      occupancy_high_threshold: 0.75,
      occupancy_low_threshold: 0.40,
      suggestion_card_count: 3,
      default_mode: 'efficiency_focus',
    },
  },
  {
    id: 'eze-vip-lounge',
    name: 'VIP Lounge Ezeiza',
    location: 'EZE - Buenos Aires Ezeiza',
    iata_code: 'EZE',
    config: {
      max_capacity: 60,
      max_wait_hard_ceiling: 60,
      occupancy_high_threshold: 0.80,
      occupancy_low_threshold: 0.50,
      suggestion_card_count: 3,
      default_mode: 'balanced',
    },
  },
];

// --- Mode Display Info ---

export interface ModeInfo {
  mode: OptimizationMode;
  label: string;
  description: string;
  weights_label: string;
}

export const MODE_INFO: ModeInfo[] = [
  {
    mode: 'balanced',
    label: 'Balanced',
    description: 'General purpose. Safe default. Fairness and urgency balanced.',
    weights_label: 'Cap 0.35 | Fair 0.30 | Urg 0.35',
  },
  {
    mode: 'revenue_focus',
    label: 'Revenue Focus',
    description: 'Urgency-dominant. Passengers closest to departure prioritized heavily.',
    weights_label: 'Cap 0.20 | Fair 0.20 | Urg 0.60',
  },
  {
    mode: 'efficiency_focus',
    label: 'Efficiency Focus',
    description: 'Peak hours, long queues. Capacity dominant. Cycles short-stay passengers.',
    weights_label: 'Cap 0.50 | Fair 0.15 | Urg 0.35',
  },
  {
    mode: 'fairness_first',
    label: 'Fairness First',
    description: 'After complaints. Wait time is the overwhelming factor.',
    weights_label: 'Cap 0.20 | Fair 0.55 | Urg 0.25',
  },
];

export function getLoungePresetById(id: string): LoungePreset | undefined {
  return LOUNGE_PRESETS.find((l) => l.id === id);
}

export function getModeInfo(mode: OptimizationMode): ModeInfo | undefined {
  return MODE_INFO.find((m) => m.mode === mode);
}

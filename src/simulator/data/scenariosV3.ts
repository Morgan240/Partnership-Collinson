// PriModel v.3 - 4D Scenario Data
// This file provides v3 scenario data (with access_program, consecutive_skips, est_stay_min)
// Same scenarios as 3D but with additional v3 fields.

import type { ScenarioV3, WaitlistEntryV3 } from '../engine/v3/types';
import {
  SCENARIO_MEX22_TOYSTORY,
  SCENARIO_MEX22_DRAGONBALL,
  SCENARIO_ONEPIECE,
  SCENARIO_SPREADSHEET,
} from './scenarios';

// Access program distribution helper
const PROGRAMS = ['Priority Pass', 'LoungeKey', 'Amex Platinum', 'Day Pass', 'None'] as const;

function toV3Entries(
  entries: { waitlist_id: number; party_size: number; time_to_departure_min: number; wait_time_min: number }[],
  v3Data: { access_program: string; consecutive_skips: number; est_stay_min: number }[]
): WaitlistEntryV3[] {
  return entries.map((e, i) => ({
    ...e,
    access_program: v3Data[i]?.access_program ?? 'None',
    consecutive_skips: v3Data[i]?.consecutive_skips ?? 0,
    est_stay_min: v3Data[i]?.est_stay_min ?? 45,
  }));
}

// ============================================================
// TOY STORY — v3 extra data
// ============================================================
const TOYSTORY_V3_DATA = [
  { access_program: 'Priority Pass', consecutive_skips: 3, est_stay_min: 30 },
  { access_program: 'Amex Platinum', consecutive_skips: 0, est_stay_min: 90 },
  { access_program: 'LoungeKey', consecutive_skips: 0, est_stay_min: 60 },
  { access_program: 'None', consecutive_skips: 1, est_stay_min: 45 },
  { access_program: 'Day Pass', consecutive_skips: 0, est_stay_min: 120 },
  { access_program: 'Priority Pass', consecutive_skips: 0, est_stay_min: 20 },
  { access_program: 'LoungeKey', consecutive_skips: 0, est_stay_min: 40 },
  { access_program: 'None', consecutive_skips: 2, est_stay_min: 50 },
  { access_program: 'Amex Platinum', consecutive_skips: 0, est_stay_min: 80 },
  { access_program: 'Priority Pass', consecutive_skips: 0, est_stay_min: 25 },
  { access_program: 'Day Pass', consecutive_skips: 4, est_stay_min: 60 },
  { access_program: 'LoungeKey', consecutive_skips: 1, est_stay_min: 35 },
  { access_program: 'Priority Pass', consecutive_skips: 0, est_stay_min: 55 },
  { access_program: 'Amex Platinum', consecutive_skips: 0, est_stay_min: 55 },
  { access_program: 'None', consecutive_skips: 2, est_stay_min: 30 },
  { access_program: 'LoungeKey', consecutive_skips: 0, est_stay_min: 90 },
];

export const SCENARIO_TOYSTORY_V3: ScenarioV3 = {
  ...SCENARIO_MEX22_TOYSTORY,
  entries: toV3Entries(SCENARIO_MEX22_TOYSTORY.entries, TOYSTORY_V3_DATA),
};

// ============================================================
// DRAGON BALL — v3 extra data
// ============================================================
const DRAGONBALL_V3_DATA = [
  { access_program: 'Day Pass', consecutive_skips: 7, est_stay_min: 15 },
  { access_program: 'Priority Pass', consecutive_skips: 5, est_stay_min: 30 },
  { access_program: 'Amex Platinum', consecutive_skips: 2, est_stay_min: 90 },
  { access_program: 'Priority Pass', consecutive_skips: 3, est_stay_min: 20 },
  { access_program: 'LoungeKey', consecutive_skips: 1, est_stay_min: 120 },
  { access_program: 'LoungeKey', consecutive_skips: 0, est_stay_min: 60 },
  { access_program: 'Day Pass', consecutive_skips: 0, est_stay_min: 150 },
  { access_program: 'None', consecutive_skips: 0, est_stay_min: 25 },
  { access_program: 'Priority Pass', consecutive_skips: 4, est_stay_min: 40 },
  { access_program: 'Amex Platinum', consecutive_skips: 0, est_stay_min: 100 },
  { access_program: 'Amex Platinum', consecutive_skips: 0, est_stay_min: 100 },
  { access_program: 'Day Pass', consecutive_skips: 2, est_stay_min: 35 },
  { access_program: 'Priority Pass', consecutive_skips: 4, est_stay_min: 45 },
  { access_program: 'LoungeKey', consecutive_skips: 0, est_stay_min: 75 },
  { access_program: 'None', consecutive_skips: 1, est_stay_min: 50 },
  { access_program: 'Priority Pass', consecutive_skips: 0, est_stay_min: 60 },
];

export const SCENARIO_DRAGONBALL_V3: ScenarioV3 = {
  ...SCENARIO_MEX22_DRAGONBALL,
  entries: toV3Entries(SCENARIO_MEX22_DRAGONBALL.entries, DRAGONBALL_V3_DATA),
};

// ============================================================
// ONE PIECE — v3 extra data
// ============================================================
const ONEPIECE_V3_DATA = [
  { access_program: 'Day Pass', consecutive_skips: 6, est_stay_min: 30 },
  { access_program: 'Priority Pass', consecutive_skips: 4, est_stay_min: 25 },
  { access_program: 'Amex Platinum', consecutive_skips: 2, est_stay_min: 60 },
  { access_program: 'Priority Pass', consecutive_skips: 2, est_stay_min: 40 },
  { access_program: 'LoungeKey', consecutive_skips: 1, est_stay_min: 90 },
  { access_program: 'None', consecutive_skips: 0, est_stay_min: 45 },
  { access_program: 'LoungeKey', consecutive_skips: 0, est_stay_min: 50 },
  { access_program: 'Priority Pass', consecutive_skips: 0, est_stay_min: 70 },
  { access_program: 'Day Pass', consecutive_skips: 3, est_stay_min: 35 },
  { access_program: 'Amex Platinum', consecutive_skips: 0, est_stay_min: 80 },
  { access_program: 'Priority Pass', consecutive_skips: 4, est_stay_min: 30 },
  { access_program: 'None', consecutive_skips: 3, est_stay_min: 20 },
  { access_program: 'LoungeKey', consecutive_skips: 0, est_stay_min: 100 },
  { access_program: 'Day Pass', consecutive_skips: 5, est_stay_min: 25 },
  { access_program: 'Amex Platinum', consecutive_skips: 0, est_stay_min: 55 },
  { access_program: 'Priority Pass', consecutive_skips: 0, est_stay_min: 120 },
];

export const SCENARIO_ONEPIECE_V3: ScenarioV3 = {
  ...SCENARIO_ONEPIECE,
  entries: toV3Entries(SCENARIO_ONEPIECE.entries, ONEPIECE_V3_DATA),
};

// ============================================================
// SPREADSHEET VALIDATION — v3 extra data (matches spreadsheet v.3 tab exactly for first 6)
// ============================================================
const SPREADSHEET_V3_DATA = [
  // Matches spreadsheet v.3 exactly for entries 1-6
  { access_program: 'Priority Pass', consecutive_skips: 0, est_stay_min: 20 },
  { access_program: 'Amex Platinum', consecutive_skips: 0, est_stay_min: 90 },
  { access_program: 'LoungeKey', consecutive_skips: 0, est_stay_min: 150 },
  { access_program: 'Day Pass', consecutive_skips: 4, est_stay_min: 60 },
  { access_program: 'Priority Pass', consecutive_skips: 5, est_stay_min: 25 },
  { access_program: 'LoungeKey', consecutive_skips: 2, est_stay_min: 120 },
  // Extended entries 7-15
  { access_program: 'Amex Platinum', consecutive_skips: 1, est_stay_min: 45 },
  { access_program: 'Day Pass', consecutive_skips: 3, est_stay_min: 50 },
  { access_program: 'None', consecutive_skips: 0, est_stay_min: 60 },
  { access_program: 'Priority Pass', consecutive_skips: 6, est_stay_min: 20 },
  { access_program: 'LoungeKey', consecutive_skips: 0, est_stay_min: 75 },
  { access_program: 'Day Pass', consecutive_skips: 2, est_stay_min: 40 },
  { access_program: 'None', consecutive_skips: 0, est_stay_min: 100 },
  { access_program: 'Priority Pass', consecutive_skips: 1, est_stay_min: 35 },
  { access_program: 'Amex Platinum', consecutive_skips: 0, est_stay_min: 55 },
];

export const SCENARIO_SPREADSHEET_V3: ScenarioV3 = {
  ...SCENARIO_SPREADSHEET,
  entries: toV3Entries(SCENARIO_SPREADSHEET.entries, SPREADSHEET_V3_DATA),
};

// ============================================================
// ALL V3 SCENARIOS
// ============================================================

export const SCENARIOS_V3: ScenarioV3[] = [
  SCENARIO_TOYSTORY_V3,
  SCENARIO_DRAGONBALL_V3,
  SCENARIO_ONEPIECE_V3,
  SCENARIO_SPREADSHEET_V3,
];

export function getScenarioV3ById(id: string): ScenarioV3 | undefined {
  return SCENARIOS_V3.find((s) => s.id === id);
}

export function getDefaultScenarioV3(): ScenarioV3 {
  return SCENARIO_TOYSTORY_V3;
}

import { useState, useMemo, useCallback } from 'react';
import type { OptimizationModeV3, ModeWeightsV3, ScoredEntryV3, ScenarioV3, WaitlistEntryV3 } from '../engine/v3/types';
import { rankEntriesV3 } from '../engine/v3/scorer';
import { calculateOccupancyLevel } from '../engine/v3/scorer';
import { getModeWeightsV3 } from '../engine/v3/lookupTables';
import {
  calculateRevenueScore,
  calculateCapacityScoreV3,
  calculateFairnessScoreV3,
  calculateUrgencyScore,
} from '../engine/v3/dimensions';
import { getCharacterName, MEX22_FLIGHTS, DRAGONBALL_FLIGHTS, ONEPIECE_FLIGHTS } from '../data/scenarios';
import { getFlightInfo } from './useSimulator';

// Lazy import scenariosV3 — will be created as a data file
// For now we import dynamically and provide a fallback
let SCENARIOS_V3: ScenarioV3[] = [];
let getDefaultScenarioV3: () => ScenarioV3;
let getScenarioV3ById: (id: string) => ScenarioV3 | undefined;

// This function will be called to set up v3 scenarios
export function initScenariosV3(scenarios: ScenarioV3[]) {
  SCENARIOS_V3 = scenarios;
  getDefaultScenarioV3 = () => scenarios[0];
  getScenarioV3ById = (id: string) => scenarios.find(s => s.id === id);
}

export type CustomWeightsV3 = ModeWeightsV3;

export interface SimulatorV3State {
  scenario: ScenarioV3;
  mode: OptimizationModeV3 | 'custom';
  weights: ModeWeightsV3;
  rankings: ScoredEntryV3[];
  selectedEntryId: number | null;
  scenarios: ScenarioV3[];
}

export function useSimulatorV3(scenariosV3: ScenarioV3[]) {
  const defaultScenario = scenariosV3[0];
  const [scenario, setScenario] = useState<ScenarioV3>(defaultScenario);
  const [mode, setMode] = useState<OptimizationModeV3 | 'custom'>(defaultScenario.recommended_mode);
  const [weights, setWeights] = useState<ModeWeightsV3>(getModeWeightsV3(defaultScenario.recommended_mode));
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);

  const occupancyLevel = useMemo(() => {
    return calculateOccupancyLevel(
      scenario.lounge_state.current_headcount,
      scenario.lounge_state.max_capacity
    );
  }, [scenario]);

  const rankings = useMemo(() => {
    if (mode === 'custom') {
      return rankEntriesV3WithCustomWeights(scenario.entries, occupancyLevel, weights);
    }
    return rankEntriesV3(scenario.entries, occupancyLevel, mode);
  }, [scenario, mode, weights, occupancyLevel]);

  // Dimension rankings (independent sort per dimension)
  const dimensionRankings = useMemo(() => {
    const revSorted = [...rankings].sort((a, b) => b.scores.revenue - a.scores.revenue);
    const capSorted = [...rankings].sort((a, b) => b.scores.capacity - a.scores.capacity);
    const fairSorted = [...rankings].sort((a, b) => b.scores.fairness - a.scores.fairness);
    const urgSorted = [...rankings].sort((a, b) => b.scores.urgency - a.scores.urgency);

    const revRank: Record<number, number> = {};
    const capRank: Record<number, number> = {};
    const fairRank: Record<number, number> = {};
    const urgRank: Record<number, number> = {};

    revSorted.forEach((e, i) => { revRank[e.entry.waitlist_id] = i + 1; });
    capSorted.forEach((e, i) => { capRank[e.entry.waitlist_id] = i + 1; });
    fairSorted.forEach((e, i) => { fairRank[e.entry.waitlist_id] = i + 1; });
    urgSorted.forEach((e, i) => { urgRank[e.entry.waitlist_id] = i + 1; });

    return { revRank, capRank, fairRank, urgRank };
  }, [rankings]);

  const changeScenario = useCallback((id: string) => {
    const s = scenariosV3.find((s) => s.id === id);
    if (s) {
      setScenario(s);
      setMode(s.recommended_mode);
      setWeights(getModeWeightsV3(s.recommended_mode));
      setSelectedEntryId(null);
    }
  }, [scenariosV3]);

  const changeMode = useCallback((newMode: OptimizationModeV3) => {
    setMode(newMode);
    setWeights(getModeWeightsV3(newMode));
  }, []);

  const changeWeight = useCallback((key: keyof ModeWeightsV3, value: number) => {
    setMode('custom');
    setWeights((prev) => ({ ...prev, [key]: value }));
  }, []);

  const getName = useCallback((waitlistId: number) => {
    return getCharacterName(scenario.id, waitlistId);
  }, [scenario.id]);

  const getFlight = useCallback((waitlistId: number) => {
    return getFlightInfo(scenario.id, waitlistId);
  }, [scenario.id]);

  return {
    scenario,
    mode,
    weights,
    rankings,
    dimensionRankings,
    occupancyLevel,
    selectedEntryId,
    setSelectedEntryId,
    scenarios: scenariosV3,
    changeScenario,
    changeMode,
    changeWeight,
    getName,
    getFlight,
  };
}

// Custom weight scoring for v3
import { DEFAULT_CONFIG_V3 } from '../engine/v3/scorer';
import type { OccupancyLevel } from '../engine/types';

function rankEntriesV3WithCustomWeights(
  entries: WaitlistEntryV3[],
  occupancyLevel: OccupancyLevel,
  weights: ModeWeightsV3
): ScoredEntryV3[] {
  const scored = entries.map((entry) => {
    const scores = {
      revenue: calculateRevenueScore(entry.access_program),
      capacity: calculateCapacityScoreV3(entry.party_size, entry.est_stay_min, occupancyLevel),
      fairness: calculateFairnessScoreV3(entry.wait_time_min, entry.consecutive_skips),
      urgency: calculateUrgencyScore(entry.time_to_departure_min),
    };

    const weighted = {
      revenue: scores.revenue * weights.w1_revenue,
      capacity: scores.capacity * weights.w2_capacity,
      fairness: scores.fairness * weights.w3_fairness,
      urgency: scores.urgency * weights.w4_urgency,
    };

    const composite = weighted.revenue + weighted.capacity + weighted.fairness + weighted.urgency;
    const isMaxWait = entry.wait_time_min > DEFAULT_CONFIG_V3.max_wait_hard_ceiling;
    const isMaxSkips = entry.consecutive_skips >= DEFAULT_CONFIG_V3.max_consecutive_skips_ceiling;

    const overrideScore = isMaxWait ? 999 : isMaxSkips ? 998 : null;
    const override = isMaxWait ? 'MAX_WAIT' as const : isMaxSkips ? 'MAX_SKIPS' as const : null;

    const contributions = {
      revenue: weighted.revenue,
      capacity: weighted.capacity,
      fairness: weighted.fairness,
      urgency: weighted.urgency,
    };
    const dominant = Object.entries(contributions).reduce((a, b) => a[1] >= b[1] ? a : b);
    const labels: Record<string, string> = {
      revenue: 'High-value access program',
      capacity: 'Quick turnover + low seat impact',
      fairness: 'Longest waiting group',
      urgency: 'Flight departing soon',
    };

    return {
      entry,
      scores,
      weighted_scores: weighted,
      primodel_score: overrideScore ?? composite,
      rank: 0,
      override_applied: override,
      reasoning_label: override === 'MAX_WAIT' ? 'Max wait time exceeded — forced priority'
        : override === 'MAX_SKIPS' ? 'Skipped too many times — forced priority'
        : (labels[dominant[0]] || 'Balanced profile'),
    };
  });

  scored.sort((a, b) => b.primodel_score - a.primodel_score);
  return scored.map((entry, index) => ({ ...entry, rank: index + 1 }));
}

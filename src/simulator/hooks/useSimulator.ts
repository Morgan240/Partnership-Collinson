import { useState, useMemo, useCallback } from 'react';
import type { OptimizationMode, ModeWeights, ScoredEntry, Scenario } from '../engine/types';
import { rankEntries, calculateOccupancyLevel } from '../engine/scorer';
import { getModeWeights } from '../engine/lookupTables';
import { SCENARIOS, getDefaultScenario, getCharacterName, MEX22_FLIGHTS } from '../data/scenarios';
import type { WaitlistEntry } from '../engine/types';

// Flight info lookup (works for toystory scenario; others get generic data)
const DRAGONBALL_FLIGHTS: Record<number, { flight: string; destination: string; dep_time: string; status: string }> = {
  1: { flight: 'NK0101', destination: 'NMK', dep_time: '14:30', status: 'Scheduled' },
  2: { flight: 'VG0202', destination: 'SAI', dep_time: '14:50', status: 'Scheduled' },
  3: { flight: 'GH0303', destination: 'ORC', dep_time: '15:48', status: 'Scheduled' },
  4: { flight: 'PC0404', destination: 'NAM', dep_time: '14:43', status: 'Delayed' },
  5: { flight: 'KR0505', destination: 'KAM', dep_time: '15:03', status: 'Scheduled' },
  6: { flight: 'TR0606', destination: 'WCC', dep_time: '16:18', status: 'Scheduled' },
  7: { flight: 'BL0707', destination: 'CPC', dep_time: '17:18', status: 'Scheduled' },
  8: { flight: 'FR0808', destination: 'ICE', dep_time: '14:58', status: 'Scheduled' },
};

export function getFlightInfo(scenarioId: string, waitlistId: number) {
  if (scenarioId === 'mex22-toystory') return MEX22_FLIGHTS[waitlistId];
  if (scenarioId === 'mex22-dragonball') return DRAGONBALL_FLIGHTS[waitlistId];
  return { flight: `FL${String(waitlistId).padStart(4, '0')}`, destination: '---', dep_time: '--:--', status: 'Scheduled' };
}

export type CustomWeights = ModeWeights;

export interface SimulatorState {
  scenario: Scenario;
  mode: OptimizationMode | 'custom';
  weights: ModeWeights;
  rankings: ScoredEntry[];
  selectedEntryId: number | null;
  scenarios: Scenario[];
}

export function useSimulator() {
  const [scenario, setScenario] = useState<Scenario>(getDefaultScenario());
  const [mode, setMode] = useState<OptimizationMode | 'custom'>(getDefaultScenario().recommended_mode);
  const [weights, setWeights] = useState<ModeWeights>(getModeWeights(getDefaultScenario().recommended_mode));
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);

  const occupancyLevel = useMemo(() => {
    return calculateOccupancyLevel(
      scenario.lounge_state.current_headcount,
      scenario.lounge_state.max_capacity
    );
  }, [scenario]);

  // Score using custom weights: we build a temporary scorer
  const rankings = useMemo(() => {
    // For custom weights, we need to score manually
    if (mode === 'custom') {
      return rankEntriesWithCustomWeights(scenario.entries, occupancyLevel, weights);
    }
    return rankEntries(scenario.entries, occupancyLevel, mode);
  }, [scenario, mode, weights, occupancyLevel]);

  // Dimension rankings (independent sort per dimension)
  const dimensionRankings = useMemo(() => {
    const capSorted = [...rankings].sort((a, b) => b.scores.capacity - a.scores.capacity);
    const fairSorted = [...rankings].sort((a, b) => b.scores.fairness - a.scores.fairness);
    const urgSorted = [...rankings].sort((a, b) => b.scores.urgency - a.scores.urgency);

    const capRank: Record<number, number> = {};
    const fairRank: Record<number, number> = {};
    const urgRank: Record<number, number> = {};

    capSorted.forEach((e, i) => { capRank[e.entry.waitlist_id] = i + 1; });
    fairSorted.forEach((e, i) => { fairRank[e.entry.waitlist_id] = i + 1; });
    urgSorted.forEach((e, i) => { urgRank[e.entry.waitlist_id] = i + 1; });

    return { capRank, fairRank, urgRank };
  }, [rankings]);

  const changeScenario = useCallback((id: string) => {
    const s = SCENARIOS.find((s) => s.id === id);
    if (s) {
      setScenario(s);
      setMode(s.recommended_mode);
      setWeights(getModeWeights(s.recommended_mode));
      setSelectedEntryId(null);
    }
  }, []);

  const changeMode = useCallback((newMode: OptimizationMode) => {
    setMode(newMode);
    setWeights(getModeWeights(newMode));
  }, []);

  const changeWeight = useCallback((key: keyof ModeWeights, value: number) => {
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
    scenarios: SCENARIOS,
    changeScenario,
    changeMode,
    changeWeight,
    getName,
    getFlight,
  };
}

// Custom weight scoring — reimplements rankEntries but with arbitrary weights
import { calculateCapacityScore, calculateFairnessScore, calculateUrgencyScore } from '../engine/dimensions';
import { DEFAULT_CONFIG } from '../engine/scorer';

function rankEntriesWithCustomWeights(
  entries: WaitlistEntry[],
  occupancyLevel: 'low' | 'medium' | 'high',
  weights: ModeWeights
): ScoredEntry[] {
  const scored = entries.map((entry) => {
    const scores = {
      capacity: calculateCapacityScore(entry.party_size, occupancyLevel),
      fairness: calculateFairnessScore(entry.wait_time_min),
      urgency: calculateUrgencyScore(entry.time_to_departure_min),
    };

    const weighted = {
      capacity: scores.capacity * weights.w1_capacity,
      fairness: scores.fairness * weights.w2_fairness,
      urgency: scores.urgency * weights.w3_urgency,
    };

    const composite = weighted.capacity + weighted.fairness + weighted.urgency;
    const isMaxWait = entry.wait_time_min > DEFAULT_CONFIG.max_wait_hard_ceiling;

    const contributions = {
      capacity: weighted.capacity,
      fairness: weighted.fairness,
      urgency: weighted.urgency,
    };
    const dominant = Object.entries(contributions).reduce((a, b) => a[1] >= b[1] ? a : b);
    const labels: Record<string, string> = {
      capacity: 'Quick turnover + low seat impact',
      fairness: 'Longest waiting group',
      urgency: 'Flight departing soon',
    };

    return {
      entry,
      scores,
      weighted_scores: weighted,
      primodel_score: isMaxWait ? 999 : composite,
      rank: 0,
      override_applied: isMaxWait ? 'MAX_WAIT' as const : null,
      reasoning_label: isMaxWait ? 'Max wait time exceeded — forced priority' : (labels[dominant[0]] || 'Balanced profile'),
    };
  });

  scored.sort((a, b) => b.primodel_score - a.primodel_score);
  return scored.map((entry, index) => ({ ...entry, rank: index + 1 }));
}

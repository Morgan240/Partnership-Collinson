// PriModel v.2 - Scoring Engine
// Unified exports

export type {
  WaitlistEntry,
  LoungeState,
  OccupancyLevel,
  DimensionScores,
  ScoredEntry,
  OverrideType,
  OptimizationMode,
  ModeWeights,
  LoungeConfig,
  Scenario,
} from './types';

export {
  calculateCapacityScore,
  calculateFairnessScore,
  calculateUrgencyScore,
} from './dimensions';

export {
  lookupPartySizeScore,
  lookupTTDScore,
  lookupWaitTimeScore,
  getOccupancyModifier,
  getModeWeights,
  PARTY_SIZE_TABLE,
  TTD_TABLE,
  WAIT_TIME_TABLE,
  OCCUPANCY_MODIFIERS,
  MODE_WEIGHTS,
} from './lookupTables';

export {
  scoreEntry,
  rankEntries,
  runFullSimulation,
  calculateOccupancyLevel,
  DEFAULT_CONFIG,
} from './scorer';
export type { SimulationResult } from './scorer';

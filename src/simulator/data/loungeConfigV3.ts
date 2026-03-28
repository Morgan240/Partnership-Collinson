// PriModel v.3 - Mode Display Info (4 Dimensions)

import type { OptimizationModeV3 } from '../engine/v3/types';

export interface ModeInfoV3 {
  mode: OptimizationModeV3;
  label: string;
  description: string;
  weights_label: string;
}

export const MODE_INFO_V3: ModeInfoV3[] = [
  {
    mode: 'balanced',
    label: 'Balanced',
    description: 'General purpose. Safe default. All 4 dimensions balanced.',
    weights_label: 'Rev 0.25 | Cap 0.25 | Fair 0.30 | Urg 0.20',
  },
  {
    mode: 'revenue_focus',
    label: 'Revenue Focus',
    description: 'Revenue-dominant. High-value access programs prioritized.',
    weights_label: 'Rev 0.45 | Cap 0.25 | Fair 0.15 | Urg 0.15',
  },
  {
    mode: 'efficiency_focus',
    label: 'Efficiency Focus',
    description: 'Peak hours. Capacity dominant. Cycles short-stay small groups.',
    weights_label: 'Rev 0.15 | Cap 0.40 | Fair 0.20 | Urg 0.25',
  },
  {
    mode: 'fairness_first',
    label: 'Fairness First',
    description: 'After complaints. Wait time + skips are the overwhelming factors.',
    weights_label: 'Rev 0.10 | Cap 0.20 | Fair 0.50 | Urg 0.20',
  },
];

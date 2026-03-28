import React from 'react';
import type { OptimizationModeV3, ModeWeightsV3 } from '../engine/v3/types';
import { MODE_INFO_V3 } from '../data/loungeConfigV3';

interface Props {
  activeMode: OptimizationModeV3 | 'custom';
  weights: ModeWeightsV3;
  onModeChange: (mode: OptimizationModeV3) => void;
  onWeightChange: (key: keyof ModeWeightsV3, value: number) => void;
}

export const ModeSelector4D: React.FC<Props> = ({ activeMode, weights, onModeChange, onWeightChange }) => {
  const sum = weights.w1_revenue + weights.w2_capacity + weights.w3_fairness + weights.w4_urgency;
  const sumRounded = Math.round(sum * 100) / 100;
  const isValid = Math.abs(sumRounded - 1) < 0.02;

  return (
    <div>
      <div className="sim-control-panel__label">Optimization Mode</div>
      <div className="sim-mode-selector" style={{ marginBottom: 12 }}>
        {MODE_INFO_V3.map((m) => (
          <button
            key={m.mode}
            className={`sim-mode-btn ${activeMode === m.mode ? 'sim-mode-btn--active' : ''}`}
            onClick={() => onModeChange(m.mode)}
            title={m.description}
          >
            {m.label}
          </button>
        ))}
        {activeMode === 'custom' && (
          <button className="sim-mode-btn sim-mode-btn--custom sim-mode-btn--active">
            Custom
          </button>
        )}
      </div>

      <div className="sim-control-panel__label">Weights</div>
      <div className="sim-weights">
        <WeightSlider label="W1 Rev" value={weights.w1_revenue} onChange={(v) => onWeightChange('w1_revenue', v)} />
        <WeightSlider label="W2 Cap" value={weights.w2_capacity} onChange={(v) => onWeightChange('w2_capacity', v)} />
        <WeightSlider label="W3 Fair" value={weights.w3_fairness} onChange={(v) => onWeightChange('w3_fairness', v)} />
        <WeightSlider label="W4 Urg" value={weights.w4_urgency} onChange={(v) => onWeightChange('w4_urgency', v)} />
        <span className={`sim-weights__sum ${isValid ? 'sim-weights__sum--valid' : 'sim-weights__sum--invalid'}`}>
          &Sigma; = {sumRounded.toFixed(2)} {isValid ? '✓' : '✗'}
        </span>
      </div>
    </div>
  );
};

const WeightSlider: React.FC<{ label: string; value: number; onChange: (v: number) => void }> = ({ label, value, onChange }) => (
  <div className="sim-weight-item">
    <span className="sim-weight-item__label">{label}</span>
    <input
      type="range"
      min={0}
      max={100}
      value={Math.round(value * 100)}
      onChange={(e) => onChange(Number(e.target.value) / 100)}
    />
    <span className="sim-weight-item__value">{value.toFixed(2)}</span>
  </div>
);

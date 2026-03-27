import React from 'react';
import type { OptimizationMode, ModeWeights } from '../engine/types';
import { MODE_INFO } from '../data/loungeConfig';

interface Props {
  activeMode: OptimizationMode | 'custom';
  weights: ModeWeights;
  onModeChange: (mode: OptimizationMode) => void;
  onWeightChange: (key: keyof ModeWeights, value: number) => void;
}

export const ModeSelector: React.FC<Props> = ({ activeMode, weights, onModeChange, onWeightChange }) => {
  const sum = weights.w1_capacity + weights.w2_fairness + weights.w3_urgency;
  const sumRounded = Math.round(sum * 100) / 100;
  const isValid = Math.abs(sumRounded - 1) < 0.02;

  return (
    <div>
      <div className="sim-control-panel__label">Optimization Mode</div>
      <div className="sim-mode-selector" style={{ marginBottom: 12 }}>
        {MODE_INFO.map((m) => (
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
        <WeightSlider label="W1 Cap" value={weights.w1_capacity} onChange={(v) => onWeightChange('w1_capacity', v)} />
        <WeightSlider label="W2 Fair" value={weights.w2_fairness} onChange={(v) => onWeightChange('w2_fairness', v)} />
        <WeightSlider label="W3 Urg" value={weights.w3_urgency} onChange={(v) => onWeightChange('w3_urgency', v)} />
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

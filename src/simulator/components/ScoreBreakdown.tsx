import React from 'react';
import type { ScoredEntry, ModeWeights } from '../engine/types';

interface Props {
  entry: ScoredEntry;
  weights: ModeWeights;
  getName: (id: number) => string;
  getFlight: (id: number) => { flight: string; destination: string; dep_time: string; status: string } | undefined;
}

export const ScoreBreakdown: React.FC<Props> = ({ entry, weights, getName, getFlight }) => {
  const flight = getFlight(entry.entry.waitlist_id);
  const name = getName(entry.entry.waitlist_id);

  const dims = [
    { key: 'capacity', label: 'Capacity', score: entry.scores.capacity, weighted: entry.weighted_scores.capacity, cssClass: 'capacity', color: 'var(--lms-interactive)' },
    { key: 'fairness', label: 'Fairness', score: entry.scores.fairness, weighted: entry.weighted_scores.fairness, cssClass: 'fairness', color: 'var(--lms-teal)' },
    { key: 'urgency', label: 'Urgency', score: entry.scores.urgency, weighted: entry.weighted_scores.urgency, cssClass: 'urgency', color: 'var(--lms-status-delayed-text)' },
  ];

  const composite = entry.weighted_scores.capacity + entry.weighted_scores.fairness + entry.weighted_scores.urgency;

  return (
    <div className="sim-breakdown">
      <div className="sim-breakdown__header">
        <span>★ {name}</span>
        <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--lms-text-light)' }}>
          Party: {entry.entry.party_size} &middot; Wait: {entry.entry.wait_time_min}m &middot; TTD: {entry.entry.time_to_departure_min}m
          {flight && <> &middot; {flight.flight} → {flight.destination}</>}
        </span>
      </div>

      {dims.map((d) => (
        <div className="sim-breakdown__dimension" key={d.key}>
          <span className="sim-breakdown__dim-label">{d.label}</span>
          <div className="sim-breakdown__dim-bar">
            <div
              className={`sim-breakdown__dim-fill sim-breakdown__dim-fill--${d.cssClass}`}
              style={{ width: `${Math.min((d.score / 130) * 100, 100)}%` }}
            />
          </div>
          <span className="sim-breakdown__dim-value">{d.score.toFixed(1)}</span>
          <span style={{ fontSize: 12, color: 'var(--lms-text-light)', minWidth: 60 }}>
            × {d.key === 'capacity' ? weights.w1_capacity : d.key === 'fairness' ? weights.w2_fairness : weights.w3_urgency} = {d.weighted.toFixed(2)}
          </span>
        </div>
      ))}

      <div className="sim-breakdown__formula">
        {weights.w1_capacity}×{entry.scores.capacity.toFixed(1)} + {weights.w2_fairness}×{entry.scores.fairness.toFixed(1)} + {weights.w3_urgency}×{entry.scores.urgency.toFixed(1)} = <strong>{composite.toFixed(2)}</strong>
        {entry.override_applied && (
          <span style={{ marginLeft: 16, color: 'var(--lms-status-departed-text)', fontWeight: 700 }}>
            Override: {entry.override_applied} → Score = {entry.primodel_score}
          </span>
        )}
      </div>
    </div>
  );
};

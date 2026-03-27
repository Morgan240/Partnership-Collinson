import React from 'react';

interface Props {
  value: number;
  maxValue?: number;
  color?: string;
  showValue?: boolean;
}

function getScoreColor(value: number, maxValue: number): string {
  const pct = value / maxValue;
  if (pct >= 0.8) return '#1A9944';
  if (pct >= 0.5) return '#F18F01';
  return '#BF211E';
}

export const ScoreBar: React.FC<Props> = ({ value, maxValue = 100, color, showValue = true }) => {
  const isOverride = value === 999;
  const displayValue = isOverride ? 999 : Math.round(value * 100) / 100;
  const fillPct = isOverride ? 100 : Math.min((value / maxValue) * 100, 100);
  const fillColor = isOverride ? '#BF211E' : (color || getScoreColor(value, maxValue));

  return (
    <div className="sim-score-bar">
      <div className="sim-score-bar__track">
        <div
          className="sim-score-bar__fill"
          style={{ width: `${fillPct}%`, background: fillColor }}
        />
      </div>
      {showValue && (
        <span className="sim-score-bar__value" style={isOverride ? { color: '#BF211E', fontWeight: 700 } : undefined}>
          {displayValue}
        </span>
      )}
    </div>
  );
};

import React from 'react';
import type { Scenario } from '../engine/types';

interface Props {
  scenarios: Scenario[];
  activeId: string;
  onChange: (id: string) => void;
}

export const ScenarioSelector: React.FC<Props> = ({ scenarios, activeId, onChange }) => {
  return (
    <div>
      <div className="sim-control-panel__label">Scenario</div>
      <select
        className="sim-select"
        value={activeId}
        onChange={(e) => onChange(e.target.value)}
      >
        {scenarios.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
    </div>
  );
};

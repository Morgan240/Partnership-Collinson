import React from 'react';
import type { LoungeState } from '../engine/types';

interface Props {
  loungeState: LoungeState;
}

export const OccupancyIndicator: React.FC<Props> = ({ loungeState }) => {
  const { current_headcount, max_capacity, available_seats, occupancy_level } = loungeState;
  const pct = Math.round((current_headcount / max_capacity) * 100);

  return (
    <div className="sim-occupancy">
      <div className="sim-occupancy__bar">
        <div
          className={`sim-occupancy__fill sim-occupancy__fill--${occupancy_level}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <span className="sim-occupancy__label">
        {pct}% <span style={{ textTransform: 'uppercase', fontWeight: 700 }}>{occupancy_level}</span>
      </span>
      <span className="sim-occupancy__detail">
        ({current_headcount}/{max_capacity} pax &middot; {available_seats} seats available)
      </span>
    </div>
  );
};

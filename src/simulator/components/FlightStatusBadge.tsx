import React from 'react';

interface Props {
  status: string;
}

function normalizeStatus(status: string): string {
  const s = status.toLowerCase().trim();
  if (s.includes('departing in') || s === 'scheduled' || s === 'on time') return 'scheduled';
  if (s === 'delayed') return 'delayed';
  if (s === 'departed') return 'departed';
  if (s === 'cancelled' || s === 'canceled') return 'cancelled';
  if (s === 'not found') return 'notfound';
  return 'unknown';
}

export const FlightStatusBadge: React.FC<Props> = ({ status }) => {
  const normalized = normalizeStatus(status);
  const displayText = status.length > 20 ? status.slice(0, 18) + '...' : status;

  return (
    <span className={`sim-badge sim-badge--${normalized}`}>
      {displayText}
    </span>
  );
};

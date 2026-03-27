import React from 'react';
import type { ScoredEntry } from '../engine/types';
import { FlightStatusBadge } from './FlightStatusBadge';
import { ScoreBar } from './ScoreBar';

interface Props {
  rankings: ScoredEntry[];
  selectedEntryId: number | null;
  onSelectEntry: (id: number | null) => void;
  getName: (id: number) => string;
  getFlight: (id: number) => { flight: string; destination: string; dep_time: string; status: string } | undefined;
}

export const WaitlistTable: React.FC<Props> = ({ rankings, selectedEntryId, onSelectEntry, getName, getFlight }) => {
  return (
    <div>
      <div className="sim-section-header">
        <span>📋</span> Waitlist Ranking
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="sim-table">
          <thead>
            <tr>
              <th style={{ width: 80 }}>PriModel Rank</th>
              <th>Passenger</th>
              <th style={{ width: 50 }}>Pax</th>
              <th style={{ width: 70 }}>Wait</th>
              <th style={{ width: 80 }}>Flight #</th>
              <th style={{ width: 110 }}>Status</th>
              <th style={{ width: 70 }}>Dep</th>
              <th style={{ width: 160 }}>PriModel Score</th>
              <th>Reasoning</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((entry) => {
              const flight = getFlight(entry.entry.waitlist_id);
              const isTop = entry.rank === 1;
              const isSelected = selectedEntryId === entry.entry.waitlist_id;

              return (
                <tr
                  key={entry.entry.waitlist_id}
                  className={`sim-table__row--clickable ${isTop ? 'sim-table__row--top' : ''}`}
                  onClick={() => onSelectEntry(isSelected ? null : entry.entry.waitlist_id)}
                  style={isSelected ? { background: '#F0F7FB' } : undefined}
                >
                  <td>
                    <span className={`sim-rank ${isTop ? 'sim-rank--top' : ''}`}>
                      {isTop && '★ '}#{entry.rank}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500 }}>{getName(entry.entry.waitlist_id)}</td>
                  <td>{entry.entry.party_size}</td>
                  <td>{entry.entry.wait_time_min}m</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 13 }}>{flight?.flight || '—'}</td>
                  <td>
                    {flight ? <FlightStatusBadge status={flight.status} /> : '—'}
                  </td>
                  <td style={{ fontSize: 13 }}>{flight?.dep_time || '—'}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <ScoreBar value={entry.primodel_score} />
                      {entry.override_applied && (
                        <span className="sim-badge sim-badge--maxwait">MAX WAIT</span>
                      )}
                    </div>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--lms-text-light)' }}>{entry.reasoning_label}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

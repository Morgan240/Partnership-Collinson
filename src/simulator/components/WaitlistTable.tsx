import React from 'react';
import type { ScoredEntry } from '../engine/types';
import { FlightStatusBadge } from './FlightStatusBadge';
import { ScoreBar } from './ScoreBar';

interface Props {
  rankings: ScoredEntry[];
  selectedEntryId: number | null;
  onSelectEntry: (id: number | null) => void;
  getName: (id: number) => string;
  getFlight: (id: number) => { flight: string; destination: string; dep_time: string; status: string; departure_date?: string } | undefined;
  getNotifiedMin?: (id: number) => number | null;
  getAccessProgram?: (id: number) => string;
}

/* ── Inline SVG icon helpers (16×16) ── */

const CheckInIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="5" r="3" stroke="#007DBA" strokeWidth="1.5" fill="none" />
    <path d="M1.5 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="#007DBA" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <line x1="13" y1="7" x2="13" y2="11" stroke="#007DBA" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="11" y1="9" x2="15" y2="9" stroke="#007DBA" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const EditIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" stroke="#108476" strokeWidth="1.5" fill="none" strokeLinejoin="round" strokeLinecap="round" />
    <line x1="9.5" y1="3.5" x2="12.5" y2="6.5" stroke="#108476" strokeWidth="1.5" />
  </svg>
);

const BellFilledIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="#108476" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 1a1 1 0 0 1 1 1v.3A4.5 4.5 0 0 1 12.5 7v3l1 2H2.5l1-2V7A4.5 4.5 0 0 1 7 2.3V2a1 1 0 0 1 1-1z" />
    <path d="M6.5 13a1.5 1.5 0 0 0 3 0" />
  </svg>
);

const BellOutlineIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 1a1 1 0 0 1 1 1v.3A4.5 4.5 0 0 1 12.5 7v3l1 2H2.5l1-2V7A4.5 4.5 0 0 1 7 2.3V2a1 1 0 0 1 1-1z" stroke="#71757A" strokeWidth="1.2" />
    <path d="M6.5 13a1.5 1.5 0 0 0 3 0" stroke="#71757A" strokeWidth="1.2" />
  </svg>
);

const DeleteIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 4h10l-1 10H4L3 4z" stroke="#BF211E" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
    <line x1="2" y1="4" x2="14" y2="4" stroke="#BF211E" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M6 4V2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V4" stroke="#BF211E" strokeWidth="1.5" />
    <line x1="6.5" y1="6.5" x2="6.5" y2="12" stroke="#BF211E" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="9.5" y1="6.5" x2="9.5" y2="12" stroke="#BF211E" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const iconBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 2,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 4,
};

export const WaitlistTable: React.FC<Props> = ({ rankings, selectedEntryId, onSelectEntry, getName, getFlight, getNotifiedMin, getAccessProgram }) => {
  const entriesByArrival = [...rankings].sort((a, b) => a.entry.waitlist_id - b.entry.waitlist_id);

  return (
    <div>
      <div className="sim-section-header">Waitlist</div>
      <div className="sim-table-wrapper">
        <table className="sim-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>Check-In</th>
              <th style={{ width: 36 }}>Edit</th>
              <th style={{ width: 40 }}>Notify</th>
              <th style={{ width: 70 }}>Notified</th>
              <th style={{ width: 40 }}>Delete</th>
              <th>Passenger Name</th>
              <th style={{ width: 90 }}>Time Elapsed</th>
              <th style={{ width: 105 }}>Access Program</th>
              <th style={{ width: 80 }}>Flight #</th>
              <th style={{ width: 110 }}>Flight Status</th>
              <th style={{ width: 105 }}>Departure Time</th>
              <th style={{ width: 110 }}>Departure Date</th>
              <th style={{ width: 50 }}>Total</th>
              <th style={{ width: 80 }}>Comments</th>
              <th style={{ width: 160 }}>PriModel Score</th>
              <th style={{ width: 100 }}>PriModel Rank</th>
            </tr>
          </thead>
          <tbody>
            {entriesByArrival.map((entry) => {
              const flight = getFlight(entry.entry.waitlist_id);
              const isTop = entry.rank === 1;
              const isSelected = selectedEntryId === entry.entry.waitlist_id;
              const notifiedMin = getNotifiedMin ? getNotifiedMin(entry.entry.waitlist_id) : null;
              const isNotified = notifiedMin !== null && notifiedMin !== undefined;

              return (
                <tr
                  key={entry.entry.waitlist_id}
                  className={`sim-table__row--clickable ${isTop ? 'sim-table__row--top' : ''}`}
                  onClick={() => onSelectEntry(isSelected ? null : entry.entry.waitlist_id)}
                  style={isSelected ? { background: '#F0F7FB' } : undefined}
                >
                  {/* 1. Check-In */}
                  <td style={{ textAlign: 'center' }}>
                    <button style={iconBtnStyle} onClick={(e) => e.stopPropagation()} title="Check In">
                      <CheckInIcon />
                    </button>
                  </td>

                  {/* 2. Edit */}
                  <td style={{ textAlign: 'center' }}>
                    <button style={iconBtnStyle} onClick={(e) => e.stopPropagation()} title="Edit">
                      <EditIcon />
                    </button>
                  </td>

                  {/* 3. Notify */}
                  <td style={{ textAlign: 'center' }}>
                    {isNotified ? <BellFilledIcon /> : <BellOutlineIcon />}
                  </td>

                  {/* 4. Notified */}
                  <td style={{ fontSize: 13 }}>
                    {isNotified ? `${notifiedMin} mins` : '-'}
                  </td>

                  {/* 5. Delete */}
                  <td style={{ textAlign: 'center' }}>
                    <button style={iconBtnStyle} onClick={(e) => e.stopPropagation()} title="Delete">
                      <DeleteIcon />
                    </button>
                  </td>

                  {/* 6. Passenger Name */}
                  <td style={{ fontWeight: 500 }}>{getName(entry.entry.waitlist_id)}</td>

                  {/* 7. Time Elapsed */}
                  <td>{entry.entry.wait_time_min} mins</td>

                  {/* 8. Access Program */}
                  <td style={{ color: 'var(--lms-text-light)', fontSize: 13 }}>
                    {getAccessProgram ? getAccessProgram(entry.entry.waitlist_id) : '-'}
                  </td>

                  {/* 9. Flight # */}
                  <td style={{ fontFamily: 'monospace', fontSize: 13 }}>{flight?.flight || '\u2014'}</td>

                  {/* 10. Flight Status */}
                  <td>{flight ? <FlightStatusBadge status={flight.status} /> : '\u2014'}</td>

                  {/* 11. Departure Time */}
                  <td style={{ fontSize: 13 }}>{flight?.dep_time || '\u2014'}</td>

                  {/* 12. Departure Date */}
                  <td style={{ fontSize: 13 }}>{flight?.departure_date || '\u2014'}</td>

                  {/* 13. Total */}
                  <td>{entry.entry.party_size}</td>

                  {/* 14. Comments */}
                  <td style={{ color: 'var(--lms-text-light)' }}>-</td>

                  {/* 15. PriModel Score */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <ScoreBar value={entry.primodel_score} />
                      {entry.override_applied && (
                        <span className="sim-badge sim-badge--maxwait">MAX WAIT</span>
                      )}
                    </div>
                  </td>

                  {/* 16. PriModel Rank */}
                  <td>
                    <span className={`sim-rank ${isTop ? 'sim-rank--top' : ''}`}>
                      {isTop && '\u2605 '}#{entry.rank}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

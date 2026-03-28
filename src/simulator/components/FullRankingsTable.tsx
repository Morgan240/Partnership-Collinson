import React, { useState, useMemo } from 'react';
import type { ScoredEntry } from '../engine/types';

interface Props {
  rankings: ScoredEntry[];
  dimensionRankings: {
    capRank: Record<number, number>;
    fairRank: Record<number, number>;
    urgRank: Record<number, number>;
  };
  getName: (id: number) => string;
  getFlight: (id: number) => { flight: string; destination: string; dep_time: string; status: string } | undefined;
}

type SortKey = 'name' | 'dep_time' | 'cap_score' | 'cap_rank' | 'fair_score' | 'fair_rank' | 'urg_score' | 'urg_rank' | 'primodel_score' | 'primodel_rank';

export const FullRankingsTable: React.FC<Props> = ({ rankings, dimensionRankings, getName, getFlight }) => {
  const [sortKey, setSortKey] = useState<SortKey>('primodel_rank');
  const [sortAsc, setSortAsc] = useState(true);

  const rows = useMemo(() => {
    return rankings.map((entry) => {
      const flight = getFlight(entry.entry.waitlist_id);
      return {
        id: entry.entry.waitlist_id,
        name: getName(entry.entry.waitlist_id),
        dep_time: flight?.dep_time || '—',
        cap_score: entry.scores.capacity,
        cap_rank: dimensionRankings.capRank[entry.entry.waitlist_id] || 0,
        fair_score: entry.scores.fairness,
        fair_rank: dimensionRankings.fairRank[entry.entry.waitlist_id] || 0,
        urg_score: entry.scores.urgency,
        urg_rank: dimensionRankings.urgRank[entry.entry.waitlist_id] || 0,
        primodel_score: entry.primodel_score,
        primodel_rank: entry.rank,
        override: entry.override_applied,
      };
    });
  }, [rankings, dimensionRankings, getName, getFlight]);

  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      const aNum = typeof aVal === 'number' ? aVal : 0;
      const bNum = typeof bVal === 'number' ? bVal : 0;
      return sortAsc ? aNum - bNum : bNum - aNum;
    });
  }, [rows, sortKey, sortAsc]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(key.includes('rank') ? true : false); // ranks ascending, scores descending
    }
  };

  const SortHeader: React.FC<{ k: SortKey; label: string }> = ({ k, label }) => (
    <th
      className={sortKey === k ? 'sorted' : ''}
      onClick={() => handleSort(k)}
    >
      {label}
      <span className="sort-arrow">{sortKey === k ? (sortAsc ? '▲' : '▼') : '↕'}</span>
    </th>
  );

  return (
    <div>
      <div className="sim-section-header" style={{ marginTop: 24 }}>
        PriModel Full Rankings
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="sim-table">
          <thead>
            <tr>
              <SortHeader k="name" label="Passenger" />
              <SortHeader k="dep_time" label="Dep Time" />
              <SortHeader k="cap_score" label="Cap Score" />
              <SortHeader k="cap_rank" label="Cap Rank" />
              <SortHeader k="fair_score" label="Fair Score" />
              <SortHeader k="fair_rank" label="Fair Rank" />
              <SortHeader k="urg_score" label="Urg Score" />
              <SortHeader k="urg_rank" label="Urg Rank" />
              <SortHeader k="primodel_score" label="PriModel Score" />
              <SortHeader k="primodel_rank" label="PriModel Rank" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr key={row.id} className={row.primodel_rank === 1 ? 'sim-table__row--top' : ''}>
                <td style={{ fontWeight: 500 }}>{row.name}</td>
                <td style={{ fontSize: 13 }}>{row.dep_time}</td>
                <td style={{ fontWeight: 500 }}>{row.cap_score.toFixed(1)}</td>
                <td><RankBadge rank={row.cap_rank} /></td>
                <td style={{ fontWeight: 500 }}>{row.fair_score.toFixed(1)}</td>
                <td><RankBadge rank={row.fair_rank} /></td>
                <td style={{ fontWeight: 500 }}>{row.urg_score.toFixed(1)}</td>
                <td><RankBadge rank={row.urg_rank} /></td>
                <td>
                  <span style={{ fontWeight: 700 }}>
                    {row.primodel_score >= 998 ? row.primodel_score.toString() : row.primodel_score.toFixed(2)}
                  </span>
                  {row.override && (
                    <span className="sim-badge sim-badge--maxwait" style={{ marginLeft: 6, fontSize: 10 }}>MAX</span>
                  )}
                </td>
                <td>
                  <span className={`sim-rank ${row.primodel_rank === 1 ? 'sim-rank--top' : ''}`}>
                    {row.primodel_rank === 1 && '★ '}#{row.primodel_rank}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RankBadge: React.FC<{ rank: number }> = ({ rank }) => {
  const color = rank <= 3 ? 'var(--lms-status-scheduled-text)' : 'var(--lms-text-light)';
  return (
    <span style={{ fontWeight: rank <= 3 ? 700 : 400, color, fontSize: 13 }}>
      #{rank}
    </span>
  );
};

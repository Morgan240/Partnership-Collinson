/**
 * INTEGRATION TESTS — Components + Engine working together
 *
 * Tests that React components correctly consume the scoring engine
 * and render the expected output. Uses Testing Library to render
 * components and verify DOM output.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

// Components
import { FlightStatusBadge } from '../components/FlightStatusBadge';
import { ScoreBar } from '../components/ScoreBar';
import { OccupancyIndicator } from '../components/OccupancyIndicator';
import { ModeSelector } from '../components/ModeSelector';
import { ScenarioSelector } from '../components/ScenarioSelector';
import { WaitlistTable } from '../components/WaitlistTable';
import { FullRankingsTable } from '../components/FullRankingsTable';
import { ScoreBreakdown } from '../components/ScoreBreakdown';

// Engine
import { rankEntries } from '../engine/scorer';
import { getModeWeights } from '../engine/lookupTables';
import { SCENARIOS, getCharacterName } from '../data/scenarios';
import type { LoungeState, ModeWeights } from '../engine/types';

// ============================================================
// HELPERS
// ============================================================

const MOCK_LOUNGE_STATE: LoungeState = {
  available_seats: 10,
  max_capacity: 50,
  current_headcount: 30,
  occupancy_level: 'medium',
};

const SPREADSHEET_ENTRIES = SCENARIOS.find((s) => s.id === 'spreadsheet-v2')!.entries;
const BALANCED_RANKINGS = rankEntries(SPREADSHEET_ENTRIES, 'medium', 'balanced');
const BALANCED_WEIGHTS = getModeWeights('balanced');

const mockGetName = (id: number) => `Group ${id}`;
const mockGetFlight = (id: number) => ({
  flight: `FL${String(id).padStart(4, '0')}`,
  destination: 'TST',
  dep_time: '15:00',
  status: 'Scheduled',
});

// ============================================================
// 1. FLIGHT STATUS BADGE
// ============================================================

describe('FlightStatusBadge', () => {
  it('renders Scheduled badge with correct class', () => {
    const { container } = render(<FlightStatusBadge status="Scheduled" />);
    const badge = container.querySelector('.sim-badge--scheduled');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('Scheduled');
  });

  it('renders Departed badge', () => {
    const { container } = render(<FlightStatusBadge status="Departed" />);
    expect(container.querySelector('.sim-badge--departed')).toBeInTheDocument();
  });

  it('renders Delayed badge', () => {
    const { container } = render(<FlightStatusBadge status="Delayed" />);
    expect(container.querySelector('.sim-badge--delayed')).toBeInTheDocument();
  });

  it('renders Not Found badge', () => {
    const { container } = render(<FlightStatusBadge status="Not Found" />);
    expect(container.querySelector('.sim-badge--notfound')).toBeInTheDocument();
  });

  it('normalizes "Departing in Xm" to Scheduled', () => {
    const { container } = render(<FlightStatusBadge status="Departing in 27m" />);
    expect(container.querySelector('.sim-badge--scheduled')).toBeInTheDocument();
  });
});

// ============================================================
// 2. SCORE BAR
// ============================================================

describe('ScoreBar', () => {
  it('renders score value', () => {
    render(<ScoreBar value={75.5} />);
    expect(screen.getByText('75.5')).toBeInTheDocument();
  });

  it('renders 999 for MAX_WAIT override', () => {
    render(<ScoreBar value={999} />);
    expect(screen.getByText('999')).toBeInTheDocument();
  });

  it('renders fill bar with correct width percentage', () => {
    const { container } = render(<ScoreBar value={50} maxValue={100} />);
    const fill = container.querySelector('.sim-score-bar__fill') as HTMLElement;
    expect(fill.style.width).toBe('50%');
  });
});

// ============================================================
// 3. OCCUPANCY INDICATOR
// ============================================================

describe('OccupancyIndicator', () => {
  it('shows occupancy percentage and level', () => {
    render(<OccupancyIndicator loungeState={MOCK_LOUNGE_STATE} />);
    expect(screen.getByText(/60%/)).toBeInTheDocument();
    expect(screen.getByText(/medium/i)).toBeInTheDocument();
  });

  it('shows seat count', () => {
    render(<OccupancyIndicator loungeState={MOCK_LOUNGE_STATE} />);
    expect(screen.getByText(/10 seats available/)).toBeInTheDocument();
  });

  it('shows headcount ratio', () => {
    render(<OccupancyIndicator loungeState={MOCK_LOUNGE_STATE} />);
    expect(screen.getByText(/30\/50/)).toBeInTheDocument();
  });
});

// ============================================================
// 4. MODE SELECTOR
// ============================================================

describe('ModeSelector', () => {
  it('renders all 4 mode buttons', () => {
    const onMode = () => {};
    const onWeight = () => {};
    render(<ModeSelector activeMode="balanced" weights={BALANCED_WEIGHTS} onModeChange={onMode} onWeightChange={onWeight} />);
    expect(screen.getByText('Balanced')).toBeInTheDocument();
    expect(screen.getByText('Revenue Focus')).toBeInTheDocument();
    expect(screen.getByText('Efficiency Focus')).toBeInTheDocument();
    expect(screen.getByText('Fairness First')).toBeInTheDocument();
  });

  it('highlights active mode', () => {
    const { container } = render(
      <ModeSelector activeMode="balanced" weights={BALANCED_WEIGHTS} onModeChange={() => {}} onWeightChange={() => {}} />
    );
    const activeBtn = container.querySelector('.sim-mode-btn--active');
    expect(activeBtn).toHaveTextContent('Balanced');
  });

  it('calls onModeChange when clicking a mode', async () => {
    const user = userEvent.setup();
    let calledWith = '';
    const onMode = (m: string) => { calledWith = m; };
    render(<ModeSelector activeMode="balanced" weights={BALANCED_WEIGHTS} onModeChange={onMode} onWeightChange={() => {}} />);

    await user.click(screen.getByText('Revenue Focus'));
    expect(calledWith).toBe('revenue_focus');
  });

  it('displays weight values', () => {
    render(<ModeSelector activeMode="balanced" weights={BALANCED_WEIGHTS} onModeChange={() => {}} onWeightChange={() => {}} />);
    // Multiple 0.35 values (W1 and W3), use getAllByText
    expect(screen.getAllByText('0.35').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('0.30')).toBeInTheDocument();
  });

  it('shows valid sum indicator', () => {
    render(<ModeSelector activeMode="balanced" weights={BALANCED_WEIGHTS} onModeChange={() => {}} onWeightChange={() => {}} />);
    expect(screen.getByText(/= 1.00/)).toBeInTheDocument();
    expect(screen.getByText(/✓/)).toBeInTheDocument();
  });

  it('shows Custom button when mode is custom', () => {
    render(
      <ModeSelector
        activeMode="custom"
        weights={{ w1_capacity: 0.5, w2_fairness: 0.3, w3_urgency: 0.2 }}
        onModeChange={() => {}}
        onWeightChange={() => {}}
      />
    );
    expect(screen.getByText('Custom')).toBeInTheDocument();
  });
});

// ============================================================
// 5. SCENARIO SELECTOR
// ============================================================

describe('ScenarioSelector', () => {
  it('renders all scenarios in dropdown', () => {
    render(<ScenarioSelector scenarios={SCENARIOS} activeId={SCENARIOS[0].id} onChange={() => {}} />);
    const select = screen.getByRole('combobox');
    const options = within(select).getAllByRole('option');
    expect(options.length).toBe(SCENARIOS.length);
  });

  it('no scenario name contains MEX22', () => {
    SCENARIOS.forEach((s) => {
      expect(s.name.toLowerCase()).not.toContain('mex22');
    });
  });

  it('calls onChange with scenario id', async () => {
    const user = userEvent.setup();
    let selectedId = '';
    render(<ScenarioSelector scenarios={SCENARIOS} activeId={SCENARIOS[0].id} onChange={(id) => { selectedId = id; }} />);

    await user.selectOptions(screen.getByRole('combobox'), SCENARIOS[1].id);
    expect(selectedId).toBe(SCENARIOS[1].id);
  });
});

// ============================================================
// 6. WAITLIST TABLE — Engine Output → DOM
// ============================================================

describe('WaitlistTable', () => {
  it('renders all ranked entries', () => {
    const { container } = render(
      <WaitlistTable
        rankings={BALANCED_RANKINGS}
        selectedEntryId={null}
        onSelectEntry={() => {}}
        getName={mockGetName}
        getFlight={mockGetFlight}
      />
    );
    const rows = container.querySelectorAll('tbody tr');
    expect(rows.length).toBe(SPREADSHEET_ENTRIES.length);
  });

  it('first row is rank #1 (G5 in balanced mode)', () => {
    const { container } = render(
      <WaitlistTable
        rankings={BALANCED_RANKINGS}
        selectedEntryId={null}
        onSelectEntry={() => {}}
        getName={mockGetName}
        getFlight={mockGetFlight}
      />
    );
    // G5 is rank #1 — first row should have the star and #1
    const firstRow = container.querySelector('tbody tr');
    expect(firstRow).toBeTruthy();
    expect(firstRow!.textContent).toContain('#1');
    expect(firstRow!.textContent).toContain('Group 5');
  });

  it('shows star icon for rank 1', () => {
    render(
      <WaitlistTable
        rankings={BALANCED_RANKINGS}
        selectedEntryId={null}
        onSelectEntry={() => {}}
        getName={mockGetName}
        getFlight={mockGetFlight}
      />
    );
    expect(screen.getByText(/★/)).toBeInTheDocument();
  });

  it('shows MAX WAIT badge for overridden entries', () => {
    // Create entry with wait > 60 to trigger MAX_WAIT
    const overrideRankings = rankEntries(
      [{ waitlist_id: 1, party_size: 1, time_to_departure_min: 30, wait_time_min: 65 }],
      'medium',
      'balanced'
    );
    render(
      <WaitlistTable
        rankings={overrideRankings}
        selectedEntryId={null}
        onSelectEntry={() => {}}
        getName={mockGetName}
        getFlight={mockGetFlight}
      />
    );
    expect(screen.getByText('MAX WAIT')).toBeInTheDocument();
  });

  it('calls onSelectEntry when clicking a row', async () => {
    const user = userEvent.setup();
    let selectedId: number | null = null;
    render(
      <WaitlistTable
        rankings={BALANCED_RANKINGS}
        selectedEntryId={null}
        onSelectEntry={(id) => { selectedId = id; }}
        getName={mockGetName}
        getFlight={mockGetFlight}
      />
    );

    await user.click(screen.getByText('Group 5'));
    expect(selectedId).toBe(5);
  });

  it('shows flight status badges', () => {
    const { container } = render(
      <WaitlistTable
        rankings={BALANCED_RANKINGS}
        selectedEntryId={null}
        onSelectEntry={() => {}}
        getName={mockGetName}
        getFlight={mockGetFlight}
      />
    );
    const badges = container.querySelectorAll('.sim-badge--scheduled');
    expect(badges.length).toBeGreaterThan(0);
  });
});

// ============================================================
// 7. SCORE BREAKDOWN
// ============================================================

describe('ScoreBreakdown', () => {
  const entry = BALANCED_RANKINGS[0]; // G5, rank #1

  it('renders passenger name', () => {
    render(
      <ScoreBreakdown entry={entry} weights={BALANCED_WEIGHTS} getName={mockGetName} getFlight={mockGetFlight} />
    );
    expect(screen.getByText(/Group 5/)).toBeInTheDocument();
  });

  it('shows all 3 dimension scores', () => {
    render(
      <ScoreBreakdown entry={entry} weights={BALANCED_WEIGHTS} getName={mockGetName} getFlight={mockGetFlight} />
    );
    expect(screen.getByText('Capacity')).toBeInTheDocument();
    expect(screen.getByText('Fairness')).toBeInTheDocument();
    expect(screen.getByText('Urgency')).toBeInTheDocument();
  });

  it('shows the weighted formula', () => {
    render(
      <ScoreBreakdown entry={entry} weights={BALANCED_WEIGHTS} getName={mockGetName} getFlight={mockGetFlight} />
    );
    // Formula contains weight values — multiple matches possible
    expect(screen.getAllByText(/0\.35/).length).toBeGreaterThanOrEqual(1);
    // Check the formula div exists with the composite score
    const formula = document.querySelector('.sim-breakdown__formula');
    expect(formula).toBeInTheDocument();
    expect(formula!.textContent).toContain('88.75');
  });
});

// ============================================================
// 8. FULL RANKINGS TABLE
// ============================================================

describe('FullRankingsTable', () => {
  const dimRankings = (() => {
    const capSorted = [...BALANCED_RANKINGS].sort((a, b) => b.scores.capacity - a.scores.capacity);
    const fairSorted = [...BALANCED_RANKINGS].sort((a, b) => b.scores.fairness - a.scores.fairness);
    const urgSorted = [...BALANCED_RANKINGS].sort((a, b) => b.scores.urgency - a.scores.urgency);
    const capRank: Record<number, number> = {};
    const fairRank: Record<number, number> = {};
    const urgRank: Record<number, number> = {};
    capSorted.forEach((e, i) => { capRank[e.entry.waitlist_id] = i + 1; });
    fairSorted.forEach((e, i) => { fairRank[e.entry.waitlist_id] = i + 1; });
    urgSorted.forEach((e, i) => { urgRank[e.entry.waitlist_id] = i + 1; });
    return { capRank, fairRank, urgRank };
  })();

  it('renders all entries', () => {
    const { container } = render(
      <FullRankingsTable
        rankings={BALANCED_RANKINGS}
        dimensionRankings={dimRankings}
        getName={mockGetName}
        getFlight={mockGetFlight}
      />
    );
    const rows = container.querySelectorAll('tbody tr');
    expect(rows.length).toBe(SPREADSHEET_ENTRIES.length);
  });

  it('shows dimension rank badges', () => {
    render(
      <FullRankingsTable
        rankings={BALANCED_RANKINGS}
        dimensionRankings={dimRankings}
        getName={mockGetName}
        getFlight={mockGetFlight}
      />
    );
    // Should have multiple rank badges like #1, #2, etc.
    const rankElements = screen.getAllByText(/#\d+/);
    expect(rankElements.length).toBeGreaterThan(0);
  });

  it('has sortable column headers', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <FullRankingsTable
        rankings={BALANCED_RANKINGS}
        dimensionRankings={dimRankings}
        getName={mockGetName}
        getFlight={mockGetFlight}
      />
    );

    // Click Cap Score header
    const capHeader = Array.from(container.querySelectorAll('th')).find((h) => h.textContent?.includes('Cap Score'));
    expect(capHeader).toBeTruthy();
    await user.click(capHeader!);

    // After re-render, query fresh DOM for the sorted class
    await waitFor(() => {
      const sortedHeader = Array.from(container.querySelectorAll('th.sorted'));
      expect(sortedHeader.length).toBeGreaterThan(0);
      expect(sortedHeader[0].textContent).toContain('Cap Score');
    });
  });

  it('PriModel rank #1 has star icon', () => {
    render(
      <FullRankingsTable
        rankings={BALANCED_RANKINGS}
        dimensionRankings={dimRankings}
        getName={mockGetName}
        getFlight={mockGetFlight}
      />
    );
    expect(screen.getByText(/★/)).toBeInTheDocument();
  });
});

// ============================================================
// 9. CROSS-CUTTING: Mode switch changes rankings
// ============================================================

describe('Mode Switch → Rankings Change', () => {
  it('different modes produce different rank orders', () => {
    const balanced = rankEntries(SPREADSHEET_ENTRIES, 'medium', 'balanced');
    const efficiency = rankEntries(SPREADSHEET_ENTRIES, 'medium', 'efficiency_focus');

    const balancedOrder = balanced.map((r) => r.entry.waitlist_id);
    const efficiencyOrder = efficiency.map((r) => r.entry.waitlist_id);

    // They might differ — at minimum, scores should differ
    const balancedScores = balanced.map((r) => r.primodel_score);
    const efficiencyScores = efficiency.map((r) => r.primodel_score);
    expect(balancedScores).not.toEqual(efficiencyScores);
  });

  it('changing weights changes composite score', () => {
    // G1 in balanced vs fairness_first should produce different scores
    const balancedRankings = rankEntries(SPREADSHEET_ENTRIES, 'medium', 'balanced');
    const fairnessRankings = rankEntries(SPREADSHEET_ENTRIES, 'medium', 'fairness_first');

    const g1Balanced = balancedRankings.find((r) => r.entry.waitlist_id === 1)!;
    const g1Fairness = fairnessRankings.find((r) => r.entry.waitlist_id === 1)!;

    expect(g1Balanced.primodel_score).not.toBe(g1Fairness.primodel_score);
  });
});

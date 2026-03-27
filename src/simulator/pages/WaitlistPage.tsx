import React from 'react';
import { useSimulator } from '../hooks/useSimulator';
import { ScenarioSelector } from '../components/ScenarioSelector';
import { ModeSelector } from '../components/ModeSelector';
import { OccupancyIndicator } from '../components/OccupancyIndicator';
import { WaitlistTable } from '../components/WaitlistTable';
import { ScoreBreakdown } from '../components/ScoreBreakdown';
import { FullRankingsTable } from '../components/FullRankingsTable';

export const WaitlistPage: React.FC = () => {
  const {
    scenario,
    mode,
    weights,
    rankings,
    dimensionRankings,
    selectedEntryId,
    setSelectedEntryId,
    scenarios,
    changeScenario,
    changeMode,
    changeWeight,
    getName,
    getFlight,
  } = useSimulator();

  const selectedEntry = selectedEntryId
    ? rankings.find((r) => r.entry.waitlist_id === selectedEntryId) || null
    : null;

  return (
    <div>
      {/* Control Panel */}
      <div className="sim-control-panel">
        <div className="sim-control-panel__row">
          <ScenarioSelector
            scenarios={scenarios}
            activeId={scenario.id}
            onChange={changeScenario}
          />
          <div style={{ flex: 1 }}>
            <div className="sim-control-panel__label">Occupancy</div>
            <OccupancyIndicator loungeState={scenario.lounge_state} />
          </div>
        </div>

        <div className="sim-control-panel__row">
          <div style={{ flex: 1 }}>
            <ModeSelector
              activeMode={mode}
              weights={weights}
              onModeChange={changeMode}
              onWeightChange={changeWeight}
            />
          </div>
        </div>

        {scenario.description && (
          <div style={{ marginTop: 12, fontSize: 12, color: 'var(--lms-text-light)', fontStyle: 'italic' }}>
            {scenario.description}
          </div>
        )}
      </div>

      {/* Waitlist Table */}
      <WaitlistTable
        rankings={rankings}
        selectedEntryId={selectedEntryId}
        onSelectEntry={setSelectedEntryId}
        getName={getName}
        getFlight={getFlight}
      />

      {/* Score Breakdown (expanded row) */}
      {selectedEntry && (
        <ScoreBreakdown
          entry={selectedEntry}
          weights={weights}
          getName={getName}
          getFlight={getFlight}
        />
      )}

      {/* Full Rankings Table */}
      <FullRankingsTable
        rankings={rankings}
        dimensionRankings={dimensionRankings}
        getName={getName}
        getFlight={getFlight}
      />
    </div>
  );
};

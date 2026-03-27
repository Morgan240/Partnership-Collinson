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
      {/* Control Panel + Formula */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div className="sim-control-panel" style={{ flex: 1 }}>
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

        {/* Formula Card */}
        <div className="sim-formula-card">
          <div className="sim-formula-card__title">PriModel v.2 — 3 Dimensions</div>
          <div className="sim-formula-card__equation">
            <span className="sim-formula-card__label">PriorityScore</span>
            <span className="sim-formula-card__eq">=</span>
            <span className="sim-formula-card__term sim-formula-card__term--cap">
              W1<span className="sim-formula-card__times">×</span>Capacity
            </span>
            <span className="sim-formula-card__plus">+</span>
            <span className="sim-formula-card__term sim-formula-card__term--fair">
              W2<span className="sim-formula-card__times">×</span>Fairness
            </span>
            <span className="sim-formula-card__plus">+</span>
            <span className="sim-formula-card__term sim-formula-card__term--urg">
              W3<span className="sim-formula-card__times">×</span>Urgency
            </span>
          </div>
          <div className="sim-formula-card__weights">
            <div className="sim-formula-card__weight">
              <span className="sim-formula-card__dot sim-formula-card__dot--cap" />
              W1 Cap = {weights.w1_capacity.toFixed(2)}
            </div>
            <div className="sim-formula-card__weight">
              <span className="sim-formula-card__dot sim-formula-card__dot--fair" />
              W2 Fair = {weights.w2_fairness.toFixed(2)}
            </div>
            <div className="sim-formula-card__weight">
              <span className="sim-formula-card__dot sim-formula-card__dot--urg" />
              W3 Urg = {weights.w3_urgency.toFixed(2)}
            </div>
          </div>
          <div className="sim-formula-card__override">
            Override: wait &gt; 60 min → Score = 999
          </div>
        </div>
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

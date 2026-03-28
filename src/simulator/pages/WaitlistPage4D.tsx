import React from 'react';
import { useSimulatorV3 } from '../hooks/useSimulatorV3';
import { ScenarioSelector } from '../components/ScenarioSelector';
import { ModeSelector4D } from '../components/ModeSelector4D';
import { OccupancyIndicator } from '../components/OccupancyIndicator';
import { WaitlistTable } from '../components/WaitlistTable';
import { ScoreBreakdown4D } from '../components/ScoreBreakdown4D';
import { FullRankingsTable4D } from '../components/FullRankingsTable4D';
import { SCENARIOS_V3 } from '../data/scenariosV3';
import { SCENARIO_REFERENCE_TIME } from '../data/scenarios';

export const WaitlistPage4D: React.FC = () => {
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
  } = useSimulatorV3(SCENARIOS_V3);

  const selectedEntry = selectedEntryId
    ? rankings.find((r) => r.entry.waitlist_id === selectedEntryId) || null
    : null;

  // Adapt v3 rankings to the WaitlistTable props (it expects ScoredEntry-like objects)
  const tableRankings = rankings.map((r) => ({
    entry: r.entry,
    scores: { capacity: r.scores.capacity, fairness: r.scores.fairness, urgency: r.scores.urgency },
    weighted_scores: { capacity: r.weighted_scores.capacity, fairness: r.weighted_scores.fairness, urgency: r.weighted_scores.urgency },
    primodel_score: r.primodel_score,
    rank: r.rank,
    override_applied: r.override_applied === 'MAX_WAIT' ? 'MAX_WAIT' as const : null,
    reasoning_label: r.reasoning_label,
  }));

  // Map for override badge labels in 4D (MAX_WAIT or MAX_SKIPS)
  const overrideLabelMap: Record<number, string> = {};
  rankings.forEach((r) => {
    if (r.override_applied) overrideLabelMap[r.entry.waitlist_id] = r.override_applied;
  });

  // For the 4D table, show access program in the "Access Program" column
  const getAccessProgram = (id: number) => {
    const entry = scenario.entries.find(e => e.waitlist_id === id);
    return entry?.access_program || '-';
  };

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
              <ModeSelector4D
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

        {/* Formula Card — 4D */}
        <div className="sim-formula-card">
          <div className="sim-formula-card__title">PriModel v.3 — 4 Dimensions</div>
          <div className="sim-formula-card__equation">
            <span className="sim-formula-card__label">PriorityScore</span>
            <span className="sim-formula-card__eq">=</span>
            <span className="sim-formula-card__term sim-formula-card__term--rev">
              W1<span className="sim-formula-card__times">×</span>Revenue
            </span>
            <span className="sim-formula-card__plus">+</span>
            <span className="sim-formula-card__term sim-formula-card__term--cap">
              W2<span className="sim-formula-card__times">×</span>Capacity
            </span>
            <span className="sim-formula-card__plus">+</span>
            <span className="sim-formula-card__term sim-formula-card__term--fair">
              W3<span className="sim-formula-card__times">×</span>Fairness
            </span>
            <span className="sim-formula-card__plus">+</span>
            <span className="sim-formula-card__term sim-formula-card__term--urg">
              W4<span className="sim-formula-card__times">×</span>Urgency
            </span>
          </div>
          <div className="sim-formula-card__weights">
            <div className="sim-formula-card__weight">
              <span className="sim-formula-card__dot sim-formula-card__dot--rev" />
              W1 Rev = {weights.w1_revenue.toFixed(2)}
            </div>
            <div className="sim-formula-card__weight">
              <span className="sim-formula-card__dot sim-formula-card__dot--cap" />
              W2 Cap = {weights.w2_capacity.toFixed(2)}
            </div>
            <div className="sim-formula-card__weight">
              <span className="sim-formula-card__dot sim-formula-card__dot--fair" />
              W3 Fair = {weights.w3_fairness.toFixed(2)}
            </div>
            <div className="sim-formula-card__weight">
              <span className="sim-formula-card__dot sim-formula-card__dot--urg" />
              W4 Urg = {weights.w4_urgency.toFixed(2)}
            </div>
          </div>
          {SCENARIO_REFERENCE_TIME[scenario.id] && (
            <div style={{ marginTop: 8, padding: '6px 10px', background: 'var(--lms-form-bg)', borderRadius: 'var(--lms-radius)', fontSize: 12, color: 'var(--lms-text-medium)', fontFamily: 'monospace' }}>
              Reference: {SCENARIO_REFERENCE_TIME[scenario.id].date} {SCENARIO_REFERENCE_TIME[scenario.id].time}
            </div>
          )}
          <div className="sim-formula-card__override">
            Override: wait &gt; 60 min → 999 &nbsp;|&nbsp; skips &ge; 10 → 998
          </div>
        </div>
      </div>

      {/* Waitlist Table — reuse 3D table but pass access program */}
      <WaitlistTable
        rankings={tableRankings}
        selectedEntryId={selectedEntryId}
        onSelectEntry={setSelectedEntryId}
        getName={getName}
        getFlight={getFlight}
        getAccessProgram={getAccessProgram}
        overrideLabels={overrideLabelMap}
      />

      {/* Score Breakdown (expanded row) */}
      {selectedEntry && (
        <ScoreBreakdown4D
          entry={selectedEntry}
          weights={weights}
          getName={getName}
          getFlight={getFlight}
        />
      )}

      {/* Full Rankings Table — 4D */}
      <FullRankingsTable4D
        rankings={rankings}
        dimensionRankings={dimensionRankings}
        getName={getName}
        getFlight={getFlight}
      />
    </div>
  );
};

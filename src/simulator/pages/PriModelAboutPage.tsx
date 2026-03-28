import React from 'react';
import { CollapsibleSection } from '../components/about/CollapsibleSection';
import '../components/about/about.css';

/* ── tiny helpers ── */
const Badge: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <span style={{ background: color, color: '#fff', padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>{label}</span>
);

const Pill: React.FC<{ bg: string; text: string }> = ({ bg, text }) => (
  <span className="about-mode-card__w" style={{ background: bg }}>{text}</span>
);

/* ══════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════ */
export const PriModelAboutPage: React.FC = () => {
  return (
    <div className="about-page">

      {/* ─── HERO ─── */}
      <section className="about-hero">
        <p className="about-hero__eyebrow">Collinson Group &bull; LMS Waitlist</p>
        <h1 className="about-hero__title">PriModel &mdash; Recommendation Engine</h1>
        <p className="about-hero__desc">
          A multi-dimensional scoring system that replaces FIFO ordering with intelligent,
          weighted prioritization for airport lounge waitlists.
        </p>
      </section>

      {/* ━━━ PART I — Problem & Framework ━━━ */}
      <div className="about-part"><span className="about-part__label">Part I &mdash; Problem &amp; Framework</span></div>

      {/* 1 — The Question */}
      <CollapsibleSection
        title="The Core Question"
        subtitle="Given 20 groups in queue and only 5 seats — who should enter next?"
        badge="PART I"
      >
        <p>
          Traditional systems use FIFO (first-come, first-served). PriModel asks: can we do better
          by considering revenue tier, lounge capacity, wait fairness, and flight urgency simultaneously?
        </p>
      </CollapsibleSection>

      {/* 2 — Why FIFO Fails */}
      <CollapsibleSection
        title="Why FIFO Is Insufficient"
        subtitle="FIFO ignores 4 critical operational dimensions."
        badge="PART I"
      >
        <div className="about-comparison">
          <div className="about-comparison__side about-comparison__side--fifo">
            <div className="about-comparison__label" style={{ color: '#E65100' }}>FIFO Approach</div>
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              <li>Treats all groups identically</li>
              <li>No lounge capacity awareness</li>
              <li>Starvation of long-waiters possible</li>
              <li>Ignores flight departure times</li>
            </ul>
          </div>
          <div className="about-comparison__vs">VS</div>
          <div className="about-comparison__side about-comparison__side--pri">
            <div className="about-comparison__label" style={{ color: '#2E7D32' }}>PriModel Approach</div>
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              <li>Weighs revenue, capacity, fairness, urgency</li>
              <li>Real-time occupancy integration</li>
              <li>Anti-starvation hard overrides</li>
              <li>Urgency scoring by time-to-departure</li>
            </ul>
          </div>
        </div>
      </CollapsibleSection>

      {/* 3 — Design Constraints */}
      <CollapsibleSection
        title="Design Constraints"
        subtitle="6 non-negotiable rules the system must follow."
        badge="PART I"
      >
        <table className="about-table">
          <thead><tr><th>Constraint</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><strong>No removal from queue</strong></td><td>A group can never lose its place entirely</td></tr>
            <tr><td><strong>Score &ge; 0</strong></td><td>Scores are floored at zero</td></tr>
            <tr><td><strong>Transparent formula</strong></td><td>Every score must be explainable</td></tr>
            <tr><td><strong>Real-time recalc</strong></td><td>Scores update on every state change</td></tr>
            <tr><td><strong>Mode-switchable</strong></td><td>Operators can change optimization mode live</td></tr>
            <tr><td><strong>Override safety nets</strong></td><td>Hard overrides prevent extreme starvation</td></tr>
          </tbody>
        </table>
      </CollapsibleSection>

      {/* 4 — The Four Pillars (always visible) */}
      <div className="about-cards about-cards--4" style={{ marginBottom: 24 }}>
        <div className="about-pillar" style={{ background: '#dc3545' }}>
          <div className="about-pillar__icon">$</div>
          <div className="about-pillar__name">Revenue</div>
          <div className="about-pillar__desc">Program tier, spending history, lounge product purchased</div>
        </div>
        <div className="about-pillar" style={{ background: '#0d6efd' }}>
          <div className="about-pillar__icon">&#9632;</div>
          <div className="about-pillar__name">Capacity</div>
          <div className="about-pillar__desc">Current occupancy %, seats available, projected departures</div>
        </div>
        <div className="about-pillar" style={{ background: '#198754' }}>
          <div className="about-pillar__icon">&#9878;</div>
          <div className="about-pillar__name">Fairness</div>
          <div className="about-pillar__desc">Time waiting in queue, number of times skipped</div>
        </div>
        <div className="about-pillar" style={{ background: '#fd7e14' }}>
          <div className="about-pillar__icon">&#9200;</div>
          <div className="about-pillar__name">Urgency</div>
          <div className="about-pillar__desc">Minutes to flight departure, flight status (delayed/on-time)</div>
        </div>
      </div>

      {/* 5 — System Ontology */}
      <CollapsibleSection
        title="System Ontology — Key Entities"
        subtitle="The data model connecting visitors, flights, lounges, and programs."
        badge="PART I"
      >
        <table className="about-table">
          <thead><tr><th>Entity</th><th>Key Attributes</th></tr></thead>
          <tbody>
            <tr><td><strong>Visitor / Group</strong></td><td>waitlist_id, group_size, check_in_time, program_tier</td></tr>
            <tr><td><strong>Flight</strong></td><td>flight_number, departure_time, status, gate</td></tr>
            <tr><td><strong>Lounge</strong></td><td>capacity, current_occupancy, location</td></tr>
            <tr><td><strong>Program</strong></td><td>tier_name (Priority Pass, LoungeKey, DragonPass), revenue_weight</td></tr>
            <tr><td><strong>Waitlist Entry</strong></td><td>position, score, override_applied, skipped_count</td></tr>
          </tbody>
        </table>
      </CollapsibleSection>

      {/* 6 — Scoring Dimensions */}
      <CollapsibleSection
        title="Scoring Dimensions Overview"
        subtitle="Each dimension produces a normalized 0–100 sub-score."
        badge="PART I"
      >
        <div className="about-cards about-cards--4">
          <div className="about-card" style={{ borderLeftColor: '#dc3545' }}>
            <div className="about-card__title">Revenue (0–100)</div>
            <div className="about-card__text">Based on program tier lookup + spend history</div>
          </div>
          <div className="about-card" style={{ borderLeftColor: '#0d6efd' }}>
            <div className="about-card__title">Capacity (0–100)</div>
            <div className="about-card__text">Based on current_occ / max_capacity ratio</div>
          </div>
          <div className="about-card" style={{ borderLeftColor: '#198754' }}>
            <div className="about-card__title">Fairness (0–100)</div>
            <div className="about-card__text">Based on wait_minutes and times_skipped</div>
          </div>
          <div className="about-card" style={{ borderLeftColor: '#fd7e14' }}>
            <div className="about-card__title">Urgency (0–100)</div>
            <div className="about-card__text">Based on minutes_to_departure and flight_status</div>
          </div>
        </div>
      </CollapsibleSection>

      {/* 7 — The Formula (always visible) */}
      <div style={{
        background: '#fff',
        border: '1px solid #E5E5EA',
        borderLeft: '4px solid #002D51',
        borderRadius: 8,
        padding: '24px 28px',
        marginBottom: 24,
      }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#002D51', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>
          PriModel Scoring Formula
        </div>
        <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 18, lineHeight: 1.8, marginBottom: 16 }}>
          <span style={{ fontWeight: 700, color: '#002D51' }}>PriModelScore</span>
          {' = '}
          W<sub>1</sub>&times;<span style={{ color: '#dc3545', fontWeight: 600 }}>Revenue</span>
          {' + '}
          W<sub>2</sub>&times;<span style={{ color: '#0d6efd', fontWeight: 600 }}>Capacity</span>
          {' + '}
          W<sub>3</sub>&times;<span style={{ color: '#198754', fontWeight: 600 }}>Fairness</span>
          {' + '}
          W<sub>4</sub>&times;<span style={{ color: '#fd7e14', fontWeight: 600 }}>Urgency</span>
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', fontSize: 14, fontFamily: "'Roboto Mono', monospace", color: '#4B4F54', marginBottom: 12 }}>
          {[
            { dot: '#dc3545', label: 'Revenue', w: '0.25' },
            { dot: '#0d6efd', label: 'Capacity', w: '0.25' },
            { dot: '#198754', label: 'Fairness', w: '0.30' },
            { dot: '#fd7e14', label: 'Urgency', w: '0.20' },
          ].map(d => (
            <span key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: d.dot, flexShrink: 0 }} />
              {d.label}: W = {d.w}
            </span>
          ))}
        </div>
        <div style={{ borderTop: '1px solid #E5E5EA', paddingTop: 10, fontSize: 12, color: '#71757A', fontStyle: 'italic' }}>
          Hard overrides: MAX WAIT &gt;60 min &rarr; 999 &nbsp;|&nbsp; STARVATION &gt;10 skips &rarr; 998 &nbsp;|&nbsp; DEPARTED &rarr; 0 &nbsp;|&nbsp; Program Cap &rarr; &times;0.5
        </div>
      </div>

      {/* ━━━ PART II — Operational Scenarios ━━━ */}
      <div className="about-part"><span className="about-part__label">Part II &mdash; Operational Scenarios</span></div>

      {/* TC1–TC5 */}
      {[
        { n: 1, title: 'Baseline', tag: 'OPTIMAL', tagColor: '#198754',
          ctx: 'Standard weekday, 65% occupancy, all scheduled flights, mixed tiers.',
          action: 'Revenue and fairness drive ranking, capacity not stressed.',
          outcome: 'Priority Pass Prestige enters first. FIFO nearly matches PriModel.' },
        { n: 2, title: 'Capacity Crunch', tag: 'HIGH LOAD', tagColor: '#0d6efd',
          ctx: 'Lounge at 95% — only 2 seats. High-tier group (4 pax) vs small group (1 pax).',
          action: 'Capacity dimension dominates. Size penalty applied to large group.',
          outcome: 'Small group enters because 4-person group would exceed capacity.' },
        { n: 3, title: 'Revenue vs Fairness', tag: 'CONFLICT', tagColor: '#fd7e14',
          ctx: 'VIP just arrived vs economy group waiting 55 minutes.',
          action: 'Revenue says VIP first. Fairness says long-waiter first.',
          outcome: 'Balanced mode: fairness wins (W3=0.30 > W1=0.25). Revenue mode: VIP wins.' },
        { n: 4, title: 'Urgency Override', tag: 'OVERRIDE', tagColor: '#dc3545',
          ctx: 'Flight departs in 20 minutes — group still waiting in queue.',
          action: 'Urgency score spikes. If wait >60 min, hard override kicks in.',
          outcome: 'Score forced to 999 — group jumps to #1 regardless of weights.' },
        { n: 5, title: 'Peak Chaos', tag: 'PEAK', tagColor: '#CE0058',
          ctx: 'Holiday rush: 20 groups, 95% full, multiple delays, mixed tiers.',
          action: 'All 4 dimensions active. Multiple hard overrides trigger simultaneously.',
          outcome: 'Anti-starvation (skip>10 → 998) and max-wait override both fire.' },
      ].map(tc => (
        <CollapsibleSection
          key={tc.n}
          title={`TC${tc.n} — ${tc.title}`}
          subtitle={tc.ctx}
          badge="PART II"
          badgeColor="#007DBA"
        >
          <div className="about-tc">
            <div className="about-tc__header">
              <span className="about-tc__num">{tc.n}</span>
              TC{tc.n} — {tc.title}
              <Badge color={tc.tagColor} label={tc.tag} />
            </div>
            <div className="about-tc__body">
              <div className="about-tc__col">
                <div className="about-tc__col-title">Context</div>
                {tc.ctx}
              </div>
              <div className="about-tc__col">
                <div className="about-tc__col-title">PriModel Action</div>
                {tc.action}
              </div>
              <div className="about-tc__col">
                <div className="about-tc__col-title">Expected Outcome</div>
                {tc.outcome}
              </div>
            </div>
          </div>
        </CollapsibleSection>
      ))}

      {/* ━━━ PART III — Algorithm ━━━ */}
      <div className="about-part"><span className="about-part__label">Part III &mdash; Algorithm</span></div>

      {/* 13 — Pipeline */}
      <CollapsibleSection
        title="Processing Pipeline"
        subtitle="5-step scoring pipeline executed on every queue change."
        badge="PART III"
        badgeColor="#108476"
      >
        <div className="about-pipeline">
          {['Load Variables', 'Normalize (0–100)', 'Apply Weights', 'Check Overrides', 'Sort & Rank'].map((step, i) => (
            <React.Fragment key={step}>
              {i > 0 && <span className="about-pipeline__arrow">&rarr;</span>}
              <div
                className="about-pipeline__step"
                style={step === 'Apply Weights' ? { background: '#002D51', color: '#fff', borderColor: '#002D51' } : undefined}
              >
                {step}
              </div>
            </React.Fragment>
          ))}
        </div>
      </CollapsibleSection>

      {/* 14–17 — Score lookup tables (2×2 grid) */}
      <div className="about-cards about-cards--2" style={{ marginBottom: 16 }}>
        {/* Revenue */}
        <CollapsibleSection title="Revenue Score Calculation" subtitle="Lookup table: program tier → base score." badge="REV" badgeColor="#dc3545">
          <table className="about-table">
            <thead><tr><th>Program Tier</th><th>Base Score</th><th>Modifier</th></tr></thead>
            <tbody>
              <tr><td>Priority Pass Prestige</td><td><strong>95</strong></td><td>+5 if spend &gt; $200</td></tr>
              <tr><td>Priority Pass</td><td><strong>75</strong></td><td>+5 if spend &gt; $150</td></tr>
              <tr><td>LoungeKey</td><td><strong>65</strong></td><td>+3 if corporate</td></tr>
              <tr><td>DragonPass</td><td><strong>55</strong></td><td>&mdash;</td></tr>
              <tr><td>Walk-in / Pay-per-use</td><td><strong>30</strong></td><td>&mdash;</td></tr>
              <tr><td>Complimentary / Staff</td><td><strong>10</strong></td><td>&mdash;</td></tr>
            </tbody>
          </table>
        </CollapsibleSection>

        {/* Capacity */}
        <CollapsibleSection title="Capacity Score Calculation" subtitle="Dynamic score based on occupancy and group size." badge="CAP" badgeColor="#0d6efd">
          <p><code className="about-code">CapacityScore = (1 - occ/max) &times; 100 &times; size_penalty</code></p>
          <table className="about-table">
            <thead><tr><th>Condition</th><th>Effect</th></tr></thead>
            <tbody>
              <tr><td>group_size &le; available_seats</td><td>size_penalty = 1.0</td></tr>
              <tr><td>group_size &gt; available_seats</td><td>size_penalty = 0.5</td></tr>
              <tr><td>Occupancy &gt; 90%</td><td>Only groups 1-2 get full score</td></tr>
              <tr><td>Occupancy &gt; 100%</td><td>Score = 0 (hard block)</td></tr>
            </tbody>
          </table>
        </CollapsibleSection>

        {/* Fairness */}
        <CollapsibleSection title="Fairness Score Calculation" subtitle="Prevents starvation — rewards patience." badge="FAIR" badgeColor="#198754">
          <p><code className="about-code">FairnessScore = min(wait_min/60 &times; 50, 100) + skip_count &times; 10</code></p>
          <table className="about-table">
            <thead><tr><th>Example</th><th>Score</th></tr></thead>
            <tbody>
              <tr><td>60 min wait, 0 skips</td><td>50</td></tr>
              <tr><td>30 min wait, 5 skips</td><td>25 + 50 = 75</td></tr>
              <tr><td>120 min wait, 0 skips</td><td>100 (capped)</td></tr>
            </tbody>
          </table>
        </CollapsibleSection>

        {/* Urgency */}
        <CollapsibleSection title="Urgency Score Calculation" subtitle="Flight proximity drives urgency." badge="URG" badgeColor="#fd7e14">
          <table className="about-table">
            <thead><tr><th>Minutes to Departure</th><th>Base Urgency</th></tr></thead>
            <tbody>
              <tr><td>&gt; 180 min</td><td>10</td></tr>
              <tr><td>120–180 min</td><td>25</td></tr>
              <tr><td>60–120 min</td><td>50</td></tr>
              <tr><td>30–60 min</td><td>75</td></tr>
              <tr><td>&lt; 30 min</td><td>95</td></tr>
              <tr><td>Departed</td><td>0 (override)</td></tr>
              <tr><td>Delayed</td><td>&times;0.7 modifier</td></tr>
            </tbody>
          </table>
        </CollapsibleSection>
      </div>

      {/* 18 — Hard Override Rules (always visible) */}
      <div style={{
        background: '#FFF5F8',
        border: '2px solid #CE0058',
        borderRadius: 8,
        padding: '28px 32px',
        marginBottom: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, borderBottom: '1px solid rgba(206,0,88,0.15)', paddingBottom: 16 }}>
          <span style={{ fontSize: 20 }}>&#9888;</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#002D51' }}>Hard Override Rules</span>
          <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, color: '#CE0058', textTransform: 'uppercase', letterSpacing: 1.5 }}>Active System Policy</span>
        </div>
        <div className="about-cards about-cards--2">
          {[
            { score: '999', icon: '&#9200;', title: 'MAX WAIT >60 min', desc: 'Automatic escalation — highest priority bypass.' },
            { score: '998', icon: '&#9940;', title: 'STARVATION >10 skips', desc: 'Force-insertion to prevent indefinite bypassing.' },
            { score: '0', icon: '&#9992;', title: 'DEPARTED flight', desc: 'Immediate removal from scoring calculation.' },
            { score: '×0.5', icon: '&#9660;', title: 'Program Cap reached', desc: 'Score halved when tier allocation limit is hit.' },
          ].map(r => (
            <div key={r.title} style={{ background: 'rgba(255,255,255,0.6)', padding: 16, borderRadius: 8, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{
                width: 56, height: 56, background: r.score === '0' ? '#002D51' : '#CE0058',
                color: '#fff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: r.score.length > 3 ? 16 : 22, flexShrink: 0,
              }}>{r.score}</div>
              <div>
                <div style={{ fontWeight: 700, color: '#002D51', fontSize: 14, textTransform: 'uppercase', letterSpacing: 0.5 }}>{r.title}</div>
                <div style={{ fontSize: 13, color: '#4B4F54', marginTop: 4 }}>{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 19 — Optimization Modes */}
      <CollapsibleSection
        title="Optimization Modes"
        subtitle="4 preset weight configurations for different operational scenarios."
        badge="PART III"
        badgeColor="#108476"
      >
        <div className="about-modes">
          {[
            { name: 'Balanced', rev: 0.25, cap: 0.25, fair: 0.30, urg: 0.20, use: 'Default daily operations' },
            { name: 'Revenue Max', rev: 0.45, cap: 0.25, fair: 0.15, urg: 0.15, use: 'Peak revenue periods' },
            { name: 'Efficiency', rev: 0.15, cap: 0.40, fair: 0.20, urg: 0.25, use: 'High-occupancy management' },
            { name: 'Fairness First', rev: 0.10, cap: 0.20, fair: 0.50, urg: 0.20, use: 'Customer satisfaction focus' },
          ].map(m => (
            <div key={m.name} className="about-mode-card">
              <div className="about-mode-card__name">{m.name}</div>
              <div className="about-mode-card__weights">
                <Pill bg="#dc3545" text={`Rev ${m.rev}`} />
                <Pill bg="#0d6efd" text={`Cap ${m.cap}`} />
                <Pill bg="#198754" text={`Fair ${m.fair}`} />
                <Pill bg="#fd7e14" text={`Urg ${m.urg}`} />
              </div>
              <div style={{ fontSize: 12, color: '#71757A', marginTop: 8 }}>{m.use}</div>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* 20 — Config Parameters */}
      <CollapsibleSection
        title="Configurable Parameters"
        subtitle="All thresholds and weights are operator-adjustable."
        badge="PART III"
        badgeColor="#108476"
      >
        <table className="about-table">
          <thead><tr><th>Parameter</th><th>Default</th><th>Range</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td>max_wait_override_min</td><td>60</td><td>30–120</td><td>Minutes before forced override</td></tr>
            <tr><td>max_skip_override</td><td>10</td><td>5–20</td><td>Skips before starvation override</td></tr>
            <tr><td>capacity_hard_block_pct</td><td>100</td><td>90–110</td><td>Occupancy % that blocks all entry</td></tr>
            <tr><td>weight_sum</td><td>1.00</td><td>fixed</td><td>All 4 weights must sum to 1.0</td></tr>
            <tr><td>departed_score</td><td>0</td><td>fixed</td><td>Score for departed flights</td></tr>
          </tbody>
        </table>
      </CollapsibleSection>

      {/* ━━━ PART IV — Data Degradation ━━━ */}
      <div className="about-part"><span className="about-part__label">Part IV &mdash; Data Degradation</span></div>

      {/* 21 — Degradation overview */}
      <CollapsibleSection
        title="Data Degradation & Resilience"
        subtitle="What happens when data is incomplete or missing."
        badge="PART IV"
        badgeColor="#71757A"
      >
        <div className="about-highlight">
          <strong>Key principle:</strong> The system never crashes on missing data. It degrades gracefully &mdash; no cliff, just reduced precision.
        </div>
        <div className="about-cards about-cards--2" style={{ marginTop: 16 }}>
          <div className="about-card" style={{ borderLeftColor: '#198754' }}>
            <div className="about-card__title" style={{ color: '#198754' }}>Always Available</div>
            <div className="about-card__text">
              waitlist_id, check_in_time, group_size &rarr; Fairness always computable
            </div>
          </div>
          <div className="about-card" style={{ borderLeftColor: '#fd7e14' }}>
            <div className="about-card__title" style={{ color: '#fd7e14' }}>Frequently Missing</div>
            <div className="about-card__text">
              flight_departure_time &rarr; Urgency defaults to 50<br />
              program_tier &rarr; Revenue defaults to 30<br />
              current_occupancy &rarr; Capacity defaults to 75%
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* 22 — Impact Matrix */}
      <CollapsibleSection
        title="Missing Data Impact Matrix"
        subtitle="How each missing field affects scoring accuracy."
        badge="PART IV"
        badgeColor="#71757A"
      >
        {/* Gradient bar */}
        <div style={{
          height: 40, borderRadius: 20, marginBottom: 16,
          background: 'linear-gradient(90deg, #10b981 0%, #f59e0b 50%, #ef4444 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 20px', fontSize: 10, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: 1.5,
        }}>
          <span>Full Data &mdash; Precise</span>
          <span>Partial &mdash; Heuristic</span>
          <span>Minimal &mdash; Defaults</span>
        </div>
        <table className="about-table">
          <thead><tr><th>Missing Field</th><th>Dimension</th><th>Impact</th><th>Fallback</th></tr></thead>
          <tbody>
            {[
              ['flight_time', 'Urgency', 'HIGH', 'Default 50'],
              ['flight_status', 'Urgency', 'MEDIUM', 'Assume "Scheduled"'],
              ['program_tier', 'Revenue', 'HIGH', 'Default score 30'],
              ['spend_history', 'Revenue', 'LOW', 'Ignore modifier'],
              ['current_occupancy', 'Capacity', 'HIGH', 'Assume 75%'],
              ['group_size', 'Capacity', 'MEDIUM', 'Assume 1'],
              ['skip_count', 'Fairness', 'LOW', 'Assume 0'],
            ].map(([field, dim, impact, fallback]) => (
              <tr key={field}>
                <td><code className="about-code">{field}</code></td>
                <td>{dim}</td>
                <td>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '2px 10px', borderRadius: 12, fontSize: 10, fontWeight: 800,
                    textTransform: 'uppercase',
                    background: impact === 'HIGH' ? '#FECDD3' : impact === 'MEDIUM' ? '#FEF3C7' : '#D1FAE5',
                    color: impact === 'HIGH' ? '#BE123C' : impact === 'MEDIUM' ? '#92400E' : '#065F46',
                  }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: impact === 'HIGH' ? '#EF4444' : impact === 'MEDIUM' ? '#F59E0B' : '#10B981',
                    }} />
                    {impact}
                  </span>
                </td>
                <td>{fallback}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CollapsibleSection>

      {/* ─── FOOTER ─── */}
      <div style={{ textAlign: 'center', marginTop: 48 }}>
        <a href="/LMS/waitlist" className="about-footer-link">
          Try the Simulator &rarr;
        </a>
        <div style={{ fontSize: 12, color: '#71757A', marginTop: 16 }}>
          PriModel v4.2 &mdash; Collinson Group LMS
        </div>
      </div>

    </div>
  );
};

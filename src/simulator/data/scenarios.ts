// PriModel v.2 - Preset Scenarios (Fake Database)
// Sources:
//   - Simulation v.2 spreadsheet (validation baseline)
//   - MEX22 LMS real waitlist data (screenshots 27-Mar-2026 ~16:18)
//   - PDF Test Cases
//
// Character sets: Toy Story (MEX22), Dragon Ball (peak hour demo)

import type { Scenario, WaitlistEntry, LoungeState } from '../engine/types';

// ============================================================
// SCENARIO 0: Spreadsheet Default (Simulation v.2 tab)
// ============================================================
// 6 groups, medium occupancy, balanced mode
// Expected rankings (Balanced): G5=#1, G1=#2, G4=#3, G2=#4, G6=#5, G3=#6

export const SCENARIO_SPREADSHEET: Scenario = {
  id: 'spreadsheet-v2',
  name: 'Demo Lounge (Validation)',
  description: '6 grupos, ocupação média, modo Balanced. Usado para validar o engine contra os resultados conhecidos.',
  lounge_state: {
    available_seats: 10,
    max_capacity: 50,
    current_headcount: 30,
    occupancy_level: 'medium',
  },
  entries: [
    { waitlist_id: 1, party_size: 1, time_to_departure_min: 50,  wait_time_min: 15 },
    { waitlist_id: 2, party_size: 2, time_to_departure_min: 120, wait_time_min: 10 },
    { waitlist_id: 3, party_size: 3, time_to_departure_min: 180, wait_time_min: 5 },
    { waitlist_id: 4, party_size: 4, time_to_departure_min: 89,  wait_time_min: 35 },
    { waitlist_id: 5, party_size: 2, time_to_departure_min: 25,  wait_time_min: 40 },
    { waitlist_id: 6, party_size: 5, time_to_departure_min: 160, wait_time_min: 20 },
  ],
  recommended_mode: 'balanced',
};

// ============================================================
// MEX22 REAL DATA — WAITLIST FROM LMS SCREENSHOT
// ============================================================
// Source: LMS Waitlist screenshot, MEX22 lounge, 27-Mar-2026 ~16:18
// 10 unique passengers, deduplicated, names anonymized with Toy Story characters.
//
// --- Passenger → Character Mapping ---
// Miguel Velasco → Woody
// Jesus de Avila → Buzz Lightyear
// Marissa Manzanilla → Jessie
// Leon Garcia Medrano → Rex
// Luis Ochoa → Slinky Dog
// Isvett Verde → Hamm
// Sofia Aganza → Bo Peep
// Vicente → Mr. Potato Head
// Manoela Di Lascio Fernandes → Forky
// Ruben Felix → Bullseye

export interface WaitlistRow {
  id: number;
  passenger_name: string;
  character_name: string;
  notified_min: number;
  time_elapsed_min: number;
  access_program: string;
  flight_number: string;
  flight_status: string;
  departure_time: string;
  departure_date: string;
  party_size: number;
  comments: string;
}

// ============================================================
// MEX22 SIMULATION SCENARIO — Unique passengers for PriModel scoring
// ============================================================
// 10 unique passengers from LMS screenshot ~16:18 on 27-Mar-2026.
// Wait times: 1-46 min (well differentiated, no MAX_WAIT overrides).
// Mix of party sizes (1-5), Scheduled and Not Found flights.

export const SCENARIO_MEX22_TOYSTORY: Scenario = {
  id: 'mex22-toystory',
  name: "Andy's Lounge (Toy Story)",
  description: '10 passageiros na waitlist, esperas de 1 a 46 min. Mix de party sizes e voos. Scores bem diferenciados.',
  lounge_state: {
    available_seats: 5,
    max_capacity: 80,
    current_headcount: 62,
    occupancy_level: 'high',
  },
  entries: [
    // Woody (Miguel Velasco) — party 2, AM0366 Scheduled dep 16:55, wait 46m, TTD≈37m
    { waitlist_id: 1,  party_size: 2, time_to_departure_min: 37,  wait_time_min: 46 },
    // Buzz Lightyear (Jesus de Avila) — party 4, AM0798 Scheduled dep 17:55, wait 13m, TTD≈97m
    { waitlist_id: 2,  party_size: 4, time_to_departure_min: 97,  wait_time_min: 13 },
    // Jessie (Marissa Manzanilla) — party 3, AM2442 Scheduled dep 19:45, wait 12m, TTD≈207m
    { waitlist_id: 3,  party_size: 3, time_to_departure_min: 207, wait_time_min: 12 },
    // Rex (Leon Garcia Medrano) — party 2, AM0497 Not Found, wait 11m, TTD≈60m (estimated)
    { waitlist_id: 4,  party_size: 2, time_to_departure_min: 60,  wait_time_min: 11 },
    // Slinky Dog (Luis Ochoa) — party 5, AM0037 Scheduled dep 17:20, wait 10m, TTD≈62m
    { waitlist_id: 5,  party_size: 5, time_to_departure_min: 62,  wait_time_min: 10 },
    // Hamm (Isvett Verde) — party 2, AM0404 Scheduled dep 16:30, wait 9m, TTD≈12m
    { waitlist_id: 6,  party_size: 2, time_to_departure_min: 12,  wait_time_min: 9 },
    // Bo Peep (Sofia Aganza) — party 2, AM0037 Scheduled dep 17:20, wait 6m, TTD≈62m
    { waitlist_id: 7,  party_size: 2, time_to_departure_min: 62,  wait_time_min: 6 },
    // Mr. Potato Head (Vicente) — party 2, AM352 Not Found, wait 6m, TTD≈60m (estimated)
    { waitlist_id: 8,  party_size: 2, time_to_departure_min: 60,  wait_time_min: 6 },
    // Forky (Manoela Di Lascio) — party 2, AM0014 Scheduled dep 18:40, wait 2m, TTD≈142m
    { waitlist_id: 9,  party_size: 2, time_to_departure_min: 142, wait_time_min: 2 },
    // Bullseye (Ruben Felix) — party 2, AM2132 Scheduled dep 17:05, wait 1m, TTD≈47m
    { waitlist_id: 10, party_size: 2, time_to_departure_min: 47,  wait_time_min: 1 },
  ],
  recommended_mode: 'balanced',
};

// Character name mapping
export const TOYSTORY_NAMES: Record<number, string> = {
  1: 'Woody',
  2: 'Buzz Lightyear',
  3: 'Jessie',
  4: 'Rex',
  5: 'Slinky Dog',
  6: 'Hamm',
  7: 'Bo Peep',
  8: 'Mr. Potato Head',
  9: 'Forky',
  10: 'Bullseye',
};

// Flight info for display
export const MEX22_FLIGHTS: Record<number, { flight: string; destination: string; dep_time: string; status: string }> = {
  1:  { flight: 'AM0366', destination: 'GDL', dep_time: '16:55', status: 'Scheduled' },
  2:  { flight: 'AM0798', destination: 'CUN', dep_time: '17:55', status: 'Scheduled' },
  3:  { flight: 'AM2442', destination: 'MTY', dep_time: '19:45', status: 'Scheduled' },
  4:  { flight: 'AM0497', destination: '???', dep_time: '—',     status: 'Not Found' },
  5:  { flight: 'AM0037', destination: 'MAD', dep_time: '17:20', status: 'Scheduled' },
  6:  { flight: 'AM0404', destination: 'LAX', dep_time: '16:30', status: 'Scheduled' },
  7:  { flight: 'AM0037', destination: 'MAD', dep_time: '17:20', status: 'Scheduled' },
  8:  { flight: 'AM0352', destination: '???', dep_time: '—',     status: 'Not Found' },
  9:  { flight: 'AM0014', destination: 'JFK', dep_time: '18:40', status: 'Scheduled' },
  10: { flight: 'AM2132', destination: 'MIA', dep_time: '17:05', status: 'Scheduled' },
};

// ============================================================
// SCENARIO: MEX22 Peak Hour — Dragon Ball Edition
// ============================================================
// Hypothetical peak hour at MEX22, all flights active.
// Party sizes and patterns inspired by MEX22 real traffic.

export const SCENARIO_MEX22_DRAGONBALL: Scenario = {
  id: 'mex22-dragonball',
  name: 'Capsule Corp Lounge (Dragon Ball)',
  description: 'Hora pico, todos os voos ativos. 8 grupos competindo por 3 assentos. Goku tem MAX WAIT override (62 min).',
  lounge_state: {
    available_seats: 3,
    max_capacity: 80,
    current_headcount: 68,
    occupancy_level: 'high',
  },
  entries: [
    { waitlist_id: 1, party_size: 1, time_to_departure_min: 15,  wait_time_min: 62 },  // Goku — MAX WAIT
    { waitlist_id: 2, party_size: 2, time_to_departure_min: 30,  wait_time_min: 55 },  // Vegeta
    { waitlist_id: 3, party_size: 3, time_to_departure_min: 90,  wait_time_min: 45 },  // Gohan
    { waitlist_id: 4, party_size: 1, time_to_departure_min: 25,  wait_time_min: 40 },  // Piccolo
    { waitlist_id: 5, party_size: 4, time_to_departure_min: 45,  wait_time_min: 35 },  // Krillin
    { waitlist_id: 6, party_size: 2, time_to_departure_min: 120, wait_time_min: 20 },  // Trunks
    { waitlist_id: 7, party_size: 5, time_to_departure_min: 180, wait_time_min: 10 },  // Bulma
    { waitlist_id: 8, party_size: 1, time_to_departure_min: 40,  wait_time_min: 5 },   // Frieza
  ],
  recommended_mode: 'balanced',
};

export const DRAGONBALL_NAMES: Record<number, string> = {
  1: 'Goku',
  2: 'Vegeta',
  3: 'Gohan',
  4: 'Piccolo',
  5: 'Krillin',
  6: 'Trunks',
  7: 'Bulma',
  8: 'Frieza',
};

// ============================================================
// PDF TEST CASES
// ============================================================

export const SCENARIO_TC1_CAPACITY: Scenario = {
  id: 'tc1-capacity',
  name: 'Test Lab — Capacity Efficiency',
  description: '3 assentos, Balanced. Solo vs couple vs grupo de 3. Gap de capacidade de 22x torna receita irrelevante.',
  lounge_state: { available_seats: 3, max_capacity: 50, current_headcount: 35, occupancy_level: 'medium' },
  entries: [
    { waitlist_id: 1, party_size: 1, time_to_departure_min: 50,  wait_time_min: 15 },
    { waitlist_id: 2, party_size: 2, time_to_departure_min: 120, wait_time_min: 10 },
    { waitlist_id: 3, party_size: 3, time_to_departure_min: 180, wait_time_min: 5 },
  ],
  recommended_mode: 'balanced',
};

export const SCENARIO_TC2_FAIRNESS: Scenario = {
  id: 'tc2-fairness',
  name: 'Test Lab — Fairness Multiplier',
  description: '4 assentos, Balanced. Grupos esperando 35-40 min vs 5 min. Gap de 7x em fairness.',
  lounge_state: { available_seats: 4, max_capacity: 50, current_headcount: 30, occupancy_level: 'medium' },
  entries: [
    { waitlist_id: 1, party_size: 2, time_to_departure_min: 60,  wait_time_min: 35 },
    { waitlist_id: 2, party_size: 4, time_to_departure_min: 120, wait_time_min: 5 },
    { waitlist_id: 3, party_size: 1, time_to_departure_min: 180, wait_time_min: 40 },
  ],
  recommended_mode: 'balanced',
};

export const SCENARIO_TC5_GRU: Scenario = {
  id: 'tc5-gru-peak',
  name: 'Test Lab — Peak Throughput',
  description: '95% ocupação, 2 assentos, Efficiency Focus. 4 solos reciclam 2 assentos em 45 min.',
  lounge_state: { available_seats: 2, max_capacity: 50, current_headcount: 48, occupancy_level: 'high' },
  entries: [
    { waitlist_id: 1, party_size: 1, time_to_departure_min: 45,  wait_time_min: 38 },
    { waitlist_id: 2, party_size: 1, time_to_departure_min: 55,  wait_time_min: 30 },
    { waitlist_id: 3, party_size: 1, time_to_departure_min: 50,  wait_time_min: 22 },
    { waitlist_id: 4, party_size: 1, time_to_departure_min: 60,  wait_time_min: 18 },
    { waitlist_id: 5, party_size: 2, time_to_departure_min: 180, wait_time_min: 42 },
    { waitlist_id: 6, party_size: 4, time_to_departure_min: 180, wait_time_min: 15 },
  ],
  recommended_mode: 'efficiency_focus',
};

// ============================================================
// ALL SCENARIOS
// ============================================================

export const SCENARIOS: Scenario[] = [
  SCENARIO_MEX22_TOYSTORY,
  SCENARIO_MEX22_DRAGONBALL,
  SCENARIO_SPREADSHEET,
  SCENARIO_TC1_CAPACITY,
  SCENARIO_TC2_FAIRNESS,
  SCENARIO_TC5_GRU,
];

export function getScenarioById(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}

export function getDefaultScenario(): Scenario {
  return SCENARIO_MEX22_TOYSTORY;
}

export function getCharacterName(scenarioId: string, waitlistId: number): string {
  if (scenarioId === 'mex22-toystory') return TOYSTORY_NAMES[waitlistId] ?? `Group ${waitlistId}`;
  if (scenarioId === 'mex22-dragonball') return DRAGONBALL_NAMES[waitlistId] ?? `Group ${waitlistId}`;
  return `Group ${waitlistId}`;
}

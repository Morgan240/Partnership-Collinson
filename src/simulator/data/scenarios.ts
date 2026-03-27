// PriModel v.2 - Preset Scenarios (Fake Database)
// Sources:
//   - Simulation v.2 spreadsheet (validation baseline)
//   - MEX22 LMS real waitlist data (screenshots 27-Mar-2026 ~14:18)
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
  name: 'Simulation v.2 (Validação)',
  description: '6 grupos da aba Simulation v.2 da planilha. Ocupação média, modo Balanced. Usado para validar o engine contra os resultados conhecidos.',
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
// MEX22 REAL DATA — FULL WAITLIST FROM LMS SCREENSHOT
// ============================================================
// Source: LMS Waitlist screenshot, MEX22 lounge, 27-Mar-2026 ~14:18
// ALL rows from the screenshot included exactly as shown.
// Each passenger appears twice (one for each departure date).
// Names anonymized with Toy Story characters.
//
// Current time estimated: ~14:18 (David Ortiz had "Departing in 27m"
// with dep time 14:45, so 14:45 - 27 = 14:18)

// --- Passenger → Character Mapping ---
// Ann Malenka → Woody
// Heather Greenman → Buzz Lightyear
// Ricardo Lucio Gil → Jessie
// Luis Fernando González Ortega → Rex
// Miguel Ángel Solís → Slinky Dog
// Miguel Solís → Hamm
// Luisa Ordonez → Mr. Potato Head
// David Ortiz Zavala → Bo Peep
// Carlos Verduzco → Forky
// Esmeralda Allen → Lotso
// Eduardo Picazo → Bullseye
// Juan D → Duke Caboom
// Victor Hugo Moreno → Alien

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

// Full MEX22 waitlist data — every row from the screenshot
export const MEX22_WAITLIST_RAW: WaitlistRow[] = [
  // Row 1: Ann Malenka (27-Mar, Departed)
  { id: 1,  passenger_name: 'Ann Malenka',                   character_name: 'Woody',           notified_min: 240, time_elapsed_min: 248, access_program: '-', flight_number: 'AM0640', flight_status: 'Departed',         departure_time: '12:50', departure_date: '27-Mar-2026', party_size: 3, comments: '-' },
  // Row 2: Ann Malenka (28-Mar, Scheduled)
  { id: 2,  passenger_name: 'Ann Malenka',                   character_name: 'Woody',           notified_min: 240, time_elapsed_min: 248, access_program: '-', flight_number: 'AM0640', flight_status: 'Scheduled',        departure_time: '12:35', departure_date: '28-Mar-2026', party_size: 3, comments: '-' },
  // Row 3: Heather Greenman (28-Mar, Scheduled)
  { id: 3,  passenger_name: 'Heather Greenman',              character_name: 'Buzz Lightyear',  notified_min: 240, time_elapsed_min: 247, access_program: '-', flight_number: 'AM0640', flight_status: 'Scheduled',        departure_time: '12:35', departure_date: '28-Mar-2026', party_size: 2, comments: '-' },
  // Row 4: Heather Greenman (27-Mar, Departed)
  { id: 4,  passenger_name: 'Heather Greenman',              character_name: 'Buzz Lightyear',  notified_min: 240, time_elapsed_min: 247, access_program: '-', flight_number: 'AM0640', flight_status: 'Departed',         departure_time: '12:50', departure_date: '27-Mar-2026', party_size: 2, comments: '-' },
  // Row 5: Ricardo Lucio Gil (28-Mar, Scheduled)
  { id: 5,  passenger_name: 'Ricardo Lucio Gil',             character_name: 'Jessie',          notified_min: 240, time_elapsed_min: 245, access_program: '-', flight_number: 'AM1534', flight_status: 'Scheduled',        departure_time: '12:55', departure_date: '28-Mar-2026', party_size: 1, comments: '-' },
  // Row 6: Ricardo Lucio Gil (27-Mar, Departed)
  { id: 6,  passenger_name: 'Ricardo Lucio Gil',             character_name: 'Jessie',          notified_min: 240, time_elapsed_min: 245, access_program: '-', flight_number: 'AM1534', flight_status: 'Departed',         departure_time: '13:05', departure_date: '27-Mar-2026', party_size: 1, comments: '-' },
  // Row 7: Luis Fernando González Ortega (28-Mar, Scheduled)
  { id: 7,  passenger_name: 'Luis Fernando González Ortega', character_name: 'Rex',             notified_min: 208, time_elapsed_min: 244, access_program: '-', flight_number: 'AM0037', flight_status: 'Scheduled',        departure_time: '17:20', departure_date: '28-Mar-2026', party_size: 3, comments: '-' },
  // Row 8: Luis Fernando González Ortega (27-Mar, Scheduled)
  { id: 8,  passenger_name: 'Luis Fernando González Ortega', character_name: 'Rex',             notified_min: 208, time_elapsed_min: 244, access_program: '-', flight_number: 'AM0037', flight_status: 'Scheduled',        departure_time: '17:15', departure_date: '27-Mar-2026', party_size: 3, comments: '-' },
  // Row 9: Miguel Ángel Solís (28-Mar, Scheduled)
  { id: 9,  passenger_name: 'Miguel Ángel Solís',            character_name: 'Slinky Dog',      notified_min: 223, time_elapsed_min: 241, access_program: '-', flight_number: 'AM0640', flight_status: 'Scheduled',        departure_time: '12:35', departure_date: '28-Mar-2026', party_size: 3, comments: '-' },
  // Row 10: Miguel Ángel Solís (27-Mar, Departed)
  { id: 10, passenger_name: 'Miguel Ángel Solís',            character_name: 'Slinky Dog',      notified_min: 223, time_elapsed_min: 241, access_program: '-', flight_number: 'AM0640', flight_status: 'Departed',         departure_time: '12:50', departure_date: '27-Mar-2026', party_size: 3, comments: '-' },
  // Row 11: Miguel Solís (28-Mar, Scheduled)
  { id: 11, passenger_name: 'Miguel Solís',                  character_name: 'Hamm',            notified_min: 218, time_elapsed_min: 227, access_program: '-', flight_number: 'AM0640', flight_status: 'Scheduled',        departure_time: '12:35', departure_date: '28-Mar-2026', party_size: 3, comments: '-' },
  // Row 12: Miguel Solís (27-Mar, Departed)
  { id: 12, passenger_name: 'Miguel Solís',                  character_name: 'Hamm',            notified_min: 218, time_elapsed_min: 227, access_program: '-', flight_number: 'AM0640', flight_status: 'Departed',         departure_time: '12:50', departure_date: '27-Mar-2026', party_size: 3, comments: '-' },
  // Row 13: Luisa Ordonez (28-Mar, Scheduled)
  { id: 13, passenger_name: 'Luisa Ordonez',                 character_name: 'Mr. Potato Head', notified_min: 200, time_elapsed_min: 203, access_program: '-', flight_number: 'AM0678', flight_status: 'Scheduled',        departure_time: '13:25', departure_date: '28-Mar-2026', party_size: 3, comments: '-' },
  // Row 14: Luisa Ordonez (27-Mar, Departed)
  { id: 14, passenger_name: 'Luisa Ordonez',                 character_name: 'Mr. Potato Head', notified_min: 200, time_elapsed_min: 203, access_program: '-', flight_number: 'AM0678', flight_status: 'Departed',         departure_time: '13:25', departure_date: '27-Mar-2026', party_size: 3, comments: '-' },
  // Row 15: David Ortiz Zavala (28-Mar, Scheduled)
  { id: 15, passenger_name: 'David Ortiz Zavala',            character_name: 'Bo Peep',         notified_min: 200, time_elapsed_min: 202, access_program: '-', flight_number: 'AM0494', flight_status: 'Scheduled',        departure_time: '14:45', departure_date: '28-Mar-2026', party_size: 2, comments: '-' },
  // Row 16: David Ortiz Zavala (27-Mar, Departing in 27m)
  { id: 16, passenger_name: 'David Ortiz Zavala',            character_name: 'Bo Peep',         notified_min: 200, time_elapsed_min: 202, access_program: '-', flight_number: 'AM0494', flight_status: 'Departing in 27m', departure_time: '14:45', departure_date: '27-Mar-2026', party_size: 2, comments: '-' },
  // Row 17: Carlos Verduzco (28-Mar, Scheduled)
  { id: 17, passenger_name: 'Carlos Verduzco',               character_name: 'Forky',           notified_min: 154, time_elapsed_min: 165, access_program: '-', flight_number: 'AM1634', flight_status: 'Scheduled',        departure_time: '14:35', departure_date: '28-Mar-2026', party_size: 2, comments: '-' },
  // Row 18: Carlos Verduzco (27-Mar, Departed)
  { id: 18, passenger_name: 'Carlos Verduzco',               character_name: 'Forky',           notified_min: 154, time_elapsed_min: 165, access_program: '-', flight_number: 'AM1634', flight_status: 'Departed',         departure_time: '13:45', departure_date: '27-Mar-2026', party_size: 2, comments: '-' },
  // Row 19: Esmeralda Allen (28-Mar, Scheduled)
  { id: 19, passenger_name: 'Esmeralda Allen',               character_name: 'Lotso',           notified_min: 81,  time_elapsed_min: 118, access_program: '-', flight_number: 'DL0599', flight_status: 'Scheduled',        departure_time: '15:30', departure_date: '28-Mar-2026', party_size: 3, comments: '-' },
  // Row 20: Esmeralda Allen (27-Mar, Scheduled)
  { id: 20, passenger_name: 'Esmeralda Allen',               character_name: 'Lotso',           notified_min: 81,  time_elapsed_min: 118, access_program: '-', flight_number: 'DL0599', flight_status: 'Scheduled',        departure_time: '15:30', departure_date: '27-Mar-2026', party_size: 3, comments: '-' },
  // Row 21: Eduardo Picazo (28-Mar, Scheduled)
  { id: 21, passenger_name: 'Eduardo Picazo',                character_name: 'Bullseye',        notified_min: 74,  time_elapsed_min: 85,  access_program: '-', flight_number: 'AM0304', flight_status: 'Scheduled',        departure_time: '16:15', departure_date: '28-Mar-2026', party_size: 5, comments: '-' },
  // Row 22: Eduardo Picazo (27-Mar, Scheduled)
  { id: 22, passenger_name: 'Eduardo Picazo',                character_name: 'Bullseye',        notified_min: 74,  time_elapsed_min: 85,  access_program: '-', flight_number: 'AM0304', flight_status: 'Scheduled',        departure_time: '16:15', departure_date: '27-Mar-2026', party_size: 5, comments: '-' },
  // Row 23: Juan D (28-Mar, Scheduled)
  { id: 23, passenger_name: 'Juan D',                        character_name: 'Duke Caboom',     notified_min: 68,  time_elapsed_min: 79,  access_program: '-', flight_number: 'AM1498', flight_status: 'Scheduled',        departure_time: '13:55', departure_date: '28-Mar-2026', party_size: 2, comments: '-' },
  // Row 24: Juan D (27-Mar, Scheduled)
  { id: 24, passenger_name: 'Juan D',                        character_name: 'Duke Caboom',     notified_min: 68,  time_elapsed_min: 79,  access_program: '-', flight_number: 'AM1498', flight_status: 'Scheduled',        departure_time: '15:45', departure_date: '27-Mar-2026', party_size: 2, comments: '-' },
  // Row 25: Victor Hugo Moreno (Not Found)
  { id: 25, passenger_name: 'Victor Hugo Moreno',            character_name: 'Alien',           notified_min: 64,  time_elapsed_min: 74,  access_program: '-', flight_number: 'AM0243', flight_status: 'Not Found',        departure_time: '-',     departure_date: '-',           party_size: 3, comments: '-' },
];

// ============================================================
// MEX22 SIMULATION SCENARIO — Unique passengers for PriModel scoring
// ============================================================
// Deduplicated: one entry per unique passenger.
// TTD calculated from scheduled flights at ~14:18 on 27-Mar-2026.
// Departed flights → TTD=0 (v.2 has no flight_status dimension;
// v.3 would exclude these with score=0)

export const SCENARIO_MEX22_TOYSTORY: Scenario = {
  id: 'mex22-toystory',
  name: 'MEX22 Real Data (Toy Story)',
  description: 'Dados reais do lounge MEX22, 27-Mar-2026 ~14:18. 13 passageiros únicos na waitlist, 7 com voos já partidos. Esperas de até 248 min. O caos que o PriModel resolve.',
  lounge_state: {
    available_seats: 4,
    max_capacity: 80,
    current_headcount: 72,
    occupancy_level: 'high',
  },
  entries: [
    // Woody (Ann Malenka) — party 3, AM0640 Departed, wait 248 min
    { waitlist_id: 1,  party_size: 3, time_to_departure_min: 0,   wait_time_min: 248 },
    // Buzz Lightyear (Heather Greenman) — party 2, AM0640 Departed, wait 247 min
    { waitlist_id: 2,  party_size: 2, time_to_departure_min: 0,   wait_time_min: 247 },
    // Jessie (Ricardo Lucio Gil) — party 1, AM1534 Departed, wait 245 min
    { waitlist_id: 3,  party_size: 1, time_to_departure_min: 0,   wait_time_min: 245 },
    // Rex (Luis Fernando González) — party 3, AM0037 17:15 Scheduled, wait 244 min
    { waitlist_id: 4,  party_size: 3, time_to_departure_min: 177, wait_time_min: 244 },
    // Slinky Dog (Miguel Ángel Solís) — party 3, AM0640 Departed, wait 241 min
    { waitlist_id: 5,  party_size: 3, time_to_departure_min: 0,   wait_time_min: 241 },
    // Hamm (Miguel Solís) — party 3, AM0640 Departed, wait 227 min
    { waitlist_id: 6,  party_size: 3, time_to_departure_min: 0,   wait_time_min: 227 },
    // Mr. Potato Head (Luisa Ordonez) — party 3, AM0678 Departed, wait 203 min
    { waitlist_id: 7,  party_size: 3, time_to_departure_min: 0,   wait_time_min: 203 },
    // Bo Peep (David Ortiz Zavala) — party 2, AM0494 Departing in 27m, wait 202 min
    { waitlist_id: 8,  party_size: 2, time_to_departure_min: 27,  wait_time_min: 202 },
    // Forky (Carlos Verduzco) — party 2, AM1634 Departed, wait 165 min
    { waitlist_id: 9,  party_size: 2, time_to_departure_min: 0,   wait_time_min: 165 },
    // Lotso (Esmeralda Allen) — party 3, DL0599 15:30 Scheduled, wait 118 min
    { waitlist_id: 10, party_size: 3, time_to_departure_min: 72,  wait_time_min: 118 },
    // Bullseye (Eduardo Picazo) — party 5, AM0304 16:15 Scheduled, wait 85 min
    { waitlist_id: 11, party_size: 5, time_to_departure_min: 117, wait_time_min: 85 },
    // Duke Caboom (Juan D) — party 2, AM1498 15:45 Scheduled, wait 79 min
    { waitlist_id: 12, party_size: 2, time_to_departure_min: 87,  wait_time_min: 79 },
    // Alien (Victor Hugo Moreno) — party 3, AM0243 Not Found, wait 74 min
    { waitlist_id: 13, party_size: 3, time_to_departure_min: 60,  wait_time_min: 74 },
  ],
  recommended_mode: 'efficiency_focus',
};

// Character name mapping
export const TOYSTORY_NAMES: Record<number, string> = {
  1: 'Woody',
  2: 'Buzz Lightyear',
  3: 'Jessie',
  4: 'Rex',
  5: 'Slinky Dog',
  6: 'Hamm',
  7: 'Mr. Potato Head',
  8: 'Bo Peep',
  9: 'Forky',
  10: 'Lotso',
  11: 'Bullseye',
  12: 'Duke Caboom',
  13: 'Alien',
};

// Flight info for display
export const MEX22_FLIGHTS: Record<number, { flight: string; destination: string; dep_time: string; status: string }> = {
  1:  { flight: 'AM0640', destination: 'LAX', dep_time: '12:50', status: 'Departed' },
  2:  { flight: 'AM0640', destination: 'LAX', dep_time: '12:50', status: 'Departed' },
  3:  { flight: 'AM1534', destination: 'CUN', dep_time: '13:05', status: 'Departed' },
  4:  { flight: 'AM0037', destination: 'MAD', dep_time: '17:15', status: 'Scheduled' },
  5:  { flight: 'AM0640', destination: 'LAX', dep_time: '12:50', status: 'Departed' },
  6:  { flight: 'AM0640', destination: 'LAX', dep_time: '12:50', status: 'Departed' },
  7:  { flight: 'AM0678', destination: 'SCL', dep_time: '13:25', status: 'Departed' },
  8:  { flight: 'AM0494', destination: 'GDL', dep_time: '14:45', status: 'Departing in 27m' },
  9:  { flight: 'AM1634', destination: 'MTY', dep_time: '13:45', status: 'Departed' },
  10: { flight: 'DL0599', destination: 'ATL', dep_time: '15:30', status: 'Scheduled' },
  11: { flight: 'AM0304', destination: 'JFK', dep_time: '16:15', status: 'Scheduled' },
  12: { flight: 'AM1498', destination: 'MIA', dep_time: '15:45', status: 'Scheduled' },
  13: { flight: 'AM0243', destination: '???', dep_time: '—',     status: 'Not Found' },
};

// ============================================================
// SCENARIO: MEX22 Peak Hour — Dragon Ball Edition
// ============================================================
// Hypothetical peak hour at MEX22, all flights active.
// Party sizes and patterns inspired by MEX22 real traffic.

export const SCENARIO_MEX22_DRAGONBALL: Scenario = {
  id: 'mex22-dragonball',
  name: 'MEX22 Peak Hour (Dragon Ball)',
  description: 'Cenário hipotético de hora pico no MEX22. Todos os voos ativos. 8 grupos competindo por 3 assentos. Goku tem MAX WAIT override (62 min).',
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
  name: 'Test Case 1: Capacity Efficiency',
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
  name: 'Test Case 2: Fairness Multiplier',
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
  name: 'Test Case 5: Peak GRU',
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

// PriModel v.2 - Preset Scenarios (Fake Database)
// Sources:
//   - Simulation v.2 spreadsheet (validation baseline)
//   - MEX22 LMS real waitlist data (screenshots 27-Mar-2026 ~16:18)
//
// Character sets: Toy Story (MEX22), Dragon Ball (peak hour), One Piece (high occupancy)

import type { Scenario, WaitlistEntry, LoungeState } from '../engine/types';

// ============================================================
// SCENARIO 0: Spreadsheet Default (Simulation v.2 tab)
// ============================================================
// 15 groups, medium occupancy, balanced mode
// Expanded validation scenario for comprehensive testing

export const SCENARIO_SPREADSHEET: Scenario = {
  id: 'spreadsheet-v2',
  name: 'Demo Lounge (Validation)',
  description: '15 grupos, ocupação média, modo Balanced. Usado para validar o engine contra os resultados conhecidos.',
  lounge_state: {
    available_seats: 10,
    max_capacity: 50,
    current_headcount: 30,
    occupancy_level: 'medium',
  },
  entries: [
    { waitlist_id: 1,  party_size: 1, time_to_departure_min: 50,  wait_time_min: 15 },
    { waitlist_id: 2,  party_size: 2, time_to_departure_min: 120, wait_time_min: 10 },
    { waitlist_id: 3,  party_size: 3, time_to_departure_min: 180, wait_time_min: 5 },
    { waitlist_id: 4,  party_size: 4, time_to_departure_min: 89,  wait_time_min: 35 },
    { waitlist_id: 5,  party_size: 2, time_to_departure_min: 25,  wait_time_min: 40 },
    { waitlist_id: 6,  party_size: 5, time_to_departure_min: 160, wait_time_min: 20 },
    { waitlist_id: 7,  party_size: 1, time_to_departure_min: 70,  wait_time_min: 28 },
    { waitlist_id: 8,  party_size: 3, time_to_departure_min: 45,  wait_time_min: 42 },
    { waitlist_id: 9,  party_size: 2, time_to_departure_min: 95,  wait_time_min: 8 },
    { waitlist_id: 10, party_size: 1, time_to_departure_min: 30,  wait_time_min: 55 },
    { waitlist_id: 11, party_size: 4, time_to_departure_min: 110, wait_time_min: 18 },
    { waitlist_id: 12, party_size: 2, time_to_departure_min: 65,  wait_time_min: 32 },
    { waitlist_id: 13, party_size: 1, time_to_departure_min: 200, wait_time_min: 3 },
    { waitlist_id: 14, party_size: 3, time_to_departure_min: 40,  wait_time_min: 22 },
    { waitlist_id: 15, party_size: 2, time_to_departure_min: 85,  wait_time_min: 12 },
  ],
  recommended_mode: 'balanced',
};

export const SPREADSHEET_NOTIFIED: Record<number, number | null> = {
  1: 10,
  2: null,
  3: null,
  4: 15,
  5: 5,
  6: null,
  7: 10,
  8: null,
  9: null,
  10: 5,
  11: null,
  12: 15,
  13: null,
  14: null,
  15: 10,
};

export const SPREADSHEET_FLIGHTS: Record<number, { flight: string; destination: string; dep_time: string; status: string; departure_date: string }> = {
  1:  { flight: 'DM0001', destination: 'JFK', dep_time: '17:08', status: 'Scheduled', departure_date: '27-Mar-2026' },
  2:  { flight: 'DM0002', destination: 'LAX', dep_time: '18:18', status: 'Scheduled', departure_date: '27-Mar-2026' },
  3:  { flight: 'DM0003', destination: 'LHR', dep_time: '19:18', status: 'Scheduled', departure_date: '27-Mar-2026' },
  4:  { flight: 'DM0004', destination: 'CDG', dep_time: '17:47', status: 'Delayed',   departure_date: '27-Mar-2026' },
  5:  { flight: 'DM0005', destination: 'NRT', dep_time: '16:43', status: 'Scheduled', departure_date: '27-Mar-2026' },
  6:  { flight: 'DM0006', destination: 'SIN', dep_time: '18:58', status: 'Scheduled', departure_date: '27-Mar-2026' },
  7:  { flight: 'DM0007', destination: 'ICN', dep_time: '17:28', status: 'Scheduled', departure_date: '27-Mar-2026' },
  8:  { flight: 'DM0008', destination: 'DXB', dep_time: '17:03', status: 'Scheduled', departure_date: '27-Mar-2026' },
  9:  { flight: 'DM0009', destination: 'HKG', dep_time: '17:53', status: 'Scheduled', departure_date: '27-Mar-2026' },
  10: { flight: 'DM0010', destination: 'MIA', dep_time: '16:48', status: 'Scheduled', departure_date: '27-Mar-2026' },
  11: { flight: 'DM0011', destination: 'SFO', dep_time: '18:08', status: 'Scheduled', departure_date: '27-Mar-2026' },
  12: { flight: 'DM0012', destination: 'ORD', dep_time: '17:23', status: 'Scheduled', departure_date: '27-Mar-2026' },
  13: { flight: 'DM0013', destination: 'BKK', dep_time: '19:38', status: 'Scheduled', departure_date: '27-Mar-2026' },
  14: { flight: 'DM0014', destination: 'FCO', dep_time: '16:58', status: 'Delayed',   departure_date: '27-Mar-2026' },
  15: { flight: 'DM0015', destination: 'GRU', dep_time: '17:43', status: 'Scheduled', departure_date: '27-Mar-2026' },
};

// ============================================================
// MEX22 REAL DATA — WAITLIST FROM LMS SCREENSHOT
// ============================================================
// Source: LMS Waitlist screenshot, MEX22 lounge, 27-Mar-2026 ~16:18
// 10 unique passengers, deduplicated, names anonymized with Toy Story characters.
// Expanded to 16 with additional Toy Story characters.
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
// (added) → Lotso
// (added) → Aliens
// (added) → Barbie
// (added) → Ken
// (added) → Duke Caboom
// (added) → Gabby Gabby

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
// MEX22 SIMULATION SCENARIO — Toy Story Edition (16 passengers)
// ============================================================
// 16 unique passengers. Wait times: 1-46 min (well differentiated).
// Mix of party sizes (1-5), Scheduled, Not Found, and Delayed flights.

export const SCENARIO_MEX22_TOYSTORY: Scenario = {
  id: 'mex22-toystory',
  name: "Andy's Lounge (Toy Story)",
  description: '16 passageiros na waitlist, esperas de 1 a 46 min. Mix de party sizes e voos. Scores bem diferenciados.',
  lounge_state: {
    available_seats: 5,
    max_capacity: 80,
    current_headcount: 62,
    occupancy_level: 'high',
  },
  entries: [
    // Woody — party 2, AM0366 Scheduled dep 16:55, wait 46m, TTD≈37m
    { waitlist_id: 1,  party_size: 2, time_to_departure_min: 37,  wait_time_min: 46 },
    // Buzz Lightyear — party 4, AM0798 Scheduled dep 17:55, wait 13m, TTD≈97m
    { waitlist_id: 2,  party_size: 4, time_to_departure_min: 97,  wait_time_min: 13 },
    // Jessie — party 3, AM2442 Scheduled dep 19:45, wait 12m, TTD≈207m
    { waitlist_id: 3,  party_size: 3, time_to_departure_min: 207, wait_time_min: 12 },
    // Rex — party 2, AM0497 Not Found, wait 11m, TTD≈60m (estimated)
    { waitlist_id: 4,  party_size: 2, time_to_departure_min: 60,  wait_time_min: 11 },
    // Slinky Dog — party 5, AM0037 Scheduled dep 17:20, wait 10m, TTD≈62m
    { waitlist_id: 5,  party_size: 5, time_to_departure_min: 62,  wait_time_min: 10 },
    // Hamm — party 2, AM0404 Scheduled dep 16:30, wait 9m, TTD≈12m
    { waitlist_id: 6,  party_size: 2, time_to_departure_min: 12,  wait_time_min: 9 },
    // Bo Peep — party 2, AM0037 Scheduled dep 17:20, wait 6m, TTD≈62m
    { waitlist_id: 7,  party_size: 2, time_to_departure_min: 62,  wait_time_min: 6 },
    // Mr. Potato Head — party 2, AM352 Not Found, wait 6m, TTD≈60m (estimated)
    { waitlist_id: 8,  party_size: 2, time_to_departure_min: 60,  wait_time_min: 6 },
    // Forky — party 2, AM0014 Scheduled dep 18:40, wait 2m, TTD≈142m
    { waitlist_id: 9,  party_size: 2, time_to_departure_min: 142, wait_time_min: 2 },
    // Bullseye — party 2, AM2132 Scheduled dep 17:05, wait 1m, TTD≈47m
    { waitlist_id: 10, party_size: 2, time_to_departure_min: 47,  wait_time_min: 1 },
    // Lotso — party 3, AM0522 Delayed dep 18:10, wait 38m, TTD≈112m
    { waitlist_id: 11, party_size: 3, time_to_departure_min: 112, wait_time_min: 38 },
    // Aliens — party 1, AM0798 Scheduled dep 17:55, wait 25m, TTD≈97m
    { waitlist_id: 12, party_size: 1, time_to_departure_min: 97,  wait_time_min: 25 },
    // Barbie — party 2, AM0633 Scheduled dep 18:00, wait 18m, TTD≈102m
    { waitlist_id: 13, party_size: 2, time_to_departure_min: 102, wait_time_min: 18 },
    // Ken — party 2, AM0633 Scheduled dep 18:00, wait 17m, TTD≈102m
    { waitlist_id: 14, party_size: 2, time_to_departure_min: 102, wait_time_min: 17 },
    // Duke Caboom — party 1, AM0411 Not Found, wait 30m, TTD≈55m (estimated)
    { waitlist_id: 15, party_size: 1, time_to_departure_min: 55,  wait_time_min: 30 },
    // Gabby Gabby — party 4, AM2442 Scheduled dep 19:45, wait 7m, TTD≈207m
    { waitlist_id: 16, party_size: 4, time_to_departure_min: 207, wait_time_min: 7 },
  ],
  recommended_mode: 'balanced',
};

// Character name mapping — Toy Story
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
  11: 'Lotso',
  12: 'Aliens',
  13: 'Barbie',
  14: 'Ken',
  15: 'Duke Caboom',
  16: 'Gabby Gabby',
};

// Notification lookup — Toy Story (notified_min: number of minutes ago, or null = not notified)
export const TOYSTORY_NOTIFIED: Record<number, number | null> = {
  1: 15,    // notified 15 mins ago
  2: null,  // not notified
  3: 5,     // notified 5 mins ago
  4: null,
  5: 10,    // notified 10 mins ago
  6: null,
  7: null,
  8: null,
  9: null,
  10: null,
  11: 15,   // notified 15 mins ago
  12: null,
  13: 10,   // notified 10 mins ago
  14: null,
  15: 5,    // notified 5 mins ago
  16: null,
};

// Flight info for display — Toy Story / MEX22
export const MEX22_FLIGHTS: Record<number, { flight: string; destination: string; dep_time: string; status: string; departure_date: string }> = {
  1:  { flight: 'AM0366', destination: 'GDL', dep_time: '16:55', status: 'Scheduled',  departure_date: '27-Mar-2026' },
  2:  { flight: 'AM0798', destination: 'CUN', dep_time: '17:55', status: 'Scheduled',  departure_date: '27-Mar-2026' },
  3:  { flight: 'AM2442', destination: 'MTY', dep_time: '19:45', status: 'Scheduled',  departure_date: '27-Mar-2026' },
  4:  { flight: 'AM0497', destination: '???', dep_time: '—',     status: 'Not Found',  departure_date: '27-Mar-2026' },
  5:  { flight: 'AM0037', destination: 'MAD', dep_time: '17:20', status: 'Scheduled',  departure_date: '27-Mar-2026' },
  6:  { flight: 'AM0404', destination: 'LAX', dep_time: '16:30', status: 'Scheduled',  departure_date: '27-Mar-2026' },
  7:  { flight: 'AM0037', destination: 'MAD', dep_time: '17:20', status: 'Scheduled',  departure_date: '27-Mar-2026' },
  8:  { flight: 'AM0352', destination: '???', dep_time: '—',     status: 'Not Found',  departure_date: '27-Mar-2026' },
  9:  { flight: 'AM0014', destination: 'JFK', dep_time: '18:40', status: 'Scheduled',  departure_date: '27-Mar-2026' },
  10: { flight: 'AM2132', destination: 'MIA', dep_time: '17:05', status: 'Scheduled',  departure_date: '27-Mar-2026' },
  11: { flight: 'AM0522', destination: 'TIJ', dep_time: '18:10', status: 'Delayed',    departure_date: '27-Mar-2026' },
  12: { flight: 'AM0798', destination: 'CUN', dep_time: '17:55', status: 'Scheduled',  departure_date: '27-Mar-2026' },
  13: { flight: 'AM0633', destination: 'SFO', dep_time: '18:00', status: 'Scheduled',  departure_date: '27-Mar-2026' },
  14: { flight: 'AM0633', destination: 'SFO', dep_time: '18:00', status: 'Scheduled',  departure_date: '27-Mar-2026' },
  15: { flight: 'AM0411', destination: '???', dep_time: '—',     status: 'Not Found',  departure_date: '27-Mar-2026' },
  16: { flight: 'AM2442', destination: 'MTY', dep_time: '19:45', status: 'Scheduled',  departure_date: '27-Mar-2026' },
};

// ============================================================
// SCENARIO: MEX22 Peak Hour — Dragon Ball Edition (16 passengers)
// ============================================================
// Hypothetical peak hour at MEX22, all flights active.
// Party sizes and patterns inspired by MEX22 real traffic.

export const SCENARIO_MEX22_DRAGONBALL: Scenario = {
  id: 'mex22-dragonball',
  name: 'Capsule Corp Lounge (Dragon Ball)',
  description: 'Hora pico, todos os voos ativos. 16 guerreiros competindo por 3 assentos. Goku tem MAX WAIT override (62 min).',
  lounge_state: {
    available_seats: 3,
    max_capacity: 80,
    current_headcount: 68,
    occupancy_level: 'high',
  },
  entries: [
    { waitlist_id: 1,  party_size: 1, time_to_departure_min: 15,  wait_time_min: 62 },  // Goku — MAX WAIT
    { waitlist_id: 2,  party_size: 2, time_to_departure_min: 30,  wait_time_min: 55 },  // Vegeta
    { waitlist_id: 3,  party_size: 3, time_to_departure_min: 90,  wait_time_min: 45 },  // Gohan
    { waitlist_id: 4,  party_size: 1, time_to_departure_min: 25,  wait_time_min: 40 },  // Piccolo
    { waitlist_id: 5,  party_size: 4, time_to_departure_min: 45,  wait_time_min: 35 },  // Krillin
    { waitlist_id: 6,  party_size: 2, time_to_departure_min: 120, wait_time_min: 20 },  // Trunks
    { waitlist_id: 7,  party_size: 5, time_to_departure_min: 180, wait_time_min: 10 },  // Bulma
    { waitlist_id: 8,  party_size: 1, time_to_departure_min: 40,  wait_time_min: 5 },   // Frieza
    { waitlist_id: 9,  party_size: 2, time_to_departure_min: 55,  wait_time_min: 48 },  // Android 18
    { waitlist_id: 10, party_size: 1, time_to_departure_min: 200, wait_time_min: 3 },   // Beerus
    { waitlist_id: 11, party_size: 1, time_to_departure_min: 200, wait_time_min: 2 },   // Whis
    { waitlist_id: 12, party_size: 2, time_to_departure_min: 35,  wait_time_min: 28 },  // Hit
    { waitlist_id: 13, party_size: 1, time_to_departure_min: 50,  wait_time_min: 52 },  // Jiren
    { waitlist_id: 14, party_size: 3, time_to_departure_min: 75,  wait_time_min: 15 },  // Broly
    { waitlist_id: 15, party_size: 1, time_to_departure_min: 60,  wait_time_min: 33 },  // Cell
    { waitlist_id: 16, party_size: 2, time_to_departure_min: 100, wait_time_min: 22 },  // Master Roshi
  ],
  recommended_mode: 'balanced',
};

// Character name mapping — Dragon Ball
export const DRAGONBALL_NAMES: Record<number, string> = {
  1: 'Goku',
  2: 'Vegeta',
  3: 'Gohan',
  4: 'Piccolo',
  5: 'Krillin',
  6: 'Trunks',
  7: 'Bulma',
  8: 'Frieza',
  9: 'Android 18',
  10: 'Beerus',
  11: 'Whis',
  12: 'Hit',
  13: 'Jiren',
  14: 'Broly',
  15: 'Cell',
  16: 'Master Roshi',
};

// Notification lookup — Dragon Ball
export const DRAGONBALL_NOTIFIED: Record<number, number | null> = {
  1: 5,     // notified 5 mins ago (MAX WAIT imminent)
  2: 15,    // notified 15 mins ago
  3: null,
  4: 10,    // notified 10 mins ago
  5: null,
  6: null,
  7: null,
  8: null,
  9: 15,    // notified 15 mins ago
  10: null,
  11: null,
  12: 5,    // notified 5 mins ago
  13: 10,   // notified 10 mins ago
  14: null,
  15: null,
  16: null,
};

// Flight info for display — Dragon Ball
export const DRAGONBALL_FLIGHTS: Record<number, { flight: string; destination: string; dep_time: string; status: string; departure_date: string }> = {
  1:  { flight: 'DB0001', destination: 'NRT', dep_time: '16:33', status: 'Scheduled',  departure_date: '27-Mar-2026' },
  2:  { flight: 'DB0002', destination: 'KIX', dep_time: '16:48', status: 'Scheduled',  departure_date: '27-Mar-2026' },
  3:  { flight: 'DB0003', destination: 'HND', dep_time: '17:48', status: 'Scheduled',  departure_date: '27-Mar-2026' },
  4:  { flight: 'DB0004', destination: 'FUK', dep_time: '16:43', status: 'Delayed',    departure_date: '27-Mar-2026' },
  5:  { flight: 'DB0005', destination: 'CTS', dep_time: '17:03', status: 'Scheduled',  departure_date: '27-Mar-2026' },
  6:  { flight: 'DB0006', destination: 'ICN', dep_time: '18:18', status: 'Scheduled',  departure_date: '27-Mar-2026' },
  7:  { flight: 'DB0007', destination: 'PEK', dep_time: '19:18', status: 'Scheduled',  departure_date: '27-Mar-2026' },
  8:  { flight: 'DB0008', destination: '???', dep_time: '—',     status: 'Not Found',  departure_date: '27-Mar-2026' },
  9:  { flight: 'DB0009', destination: 'NRT', dep_time: '17:13', status: 'Scheduled',  departure_date: '27-Mar-2026' },
  10: { flight: 'DB0010', destination: 'BKK', dep_time: '19:38', status: 'Scheduled',  departure_date: '27-Mar-2026' },
  11: { flight: 'DB0010', destination: 'BKK', dep_time: '19:38', status: 'Scheduled',  departure_date: '27-Mar-2026' },
  12: { flight: 'DB0012', destination: 'HKG', dep_time: '16:53', status: 'Delayed',    departure_date: '27-Mar-2026' },
  13: { flight: 'DB0013', destination: 'SIN', dep_time: '17:08', status: 'Scheduled',  departure_date: '27-Mar-2026' },
  14: { flight: 'DB0014', destination: 'KIX', dep_time: '17:33', status: 'Scheduled',  departure_date: '27-Mar-2026' },
  15: { flight: 'DB0015', destination: '???', dep_time: '—',     status: 'Not Found',  departure_date: '27-Mar-2026' },
  16: { flight: 'DB0016', destination: 'TPE', dep_time: '17:58', status: 'Scheduled',  departure_date: '27-Mar-2026' },
};

// ============================================================
// SCENARIO: Going Merry Lounge — One Piece Edition (16 passengers)
// ============================================================
// High occupancy scenario with the Straw Hat crew and allies.
// Set in a crowded lounge with limited seats.

export const SCENARIO_ONEPIECE: Scenario = {
  id: 'onepiece',
  name: 'Going Merry Lounge (One Piece)',
  description: '16 piratas na waitlist, ocupação altíssima. Luffy tem MAX WAIT override (65 min). Mix de crews e alianças.',
  lounge_state: {
    available_seats: 4,
    max_capacity: 100,
    current_headcount: 88,
    occupancy_level: 'high',
  },
  entries: [
    // Straw Hats
    { waitlist_id: 1,  party_size: 3, time_to_departure_min: 20,  wait_time_min: 65 },  // Luffy — MAX WAIT
    { waitlist_id: 2,  party_size: 1, time_to_departure_min: 40,  wait_time_min: 50 },  // Zoro
    { waitlist_id: 3,  party_size: 2, time_to_departure_min: 85,  wait_time_min: 42 },  // Nami
    { waitlist_id: 4,  party_size: 1, time_to_departure_min: 55,  wait_time_min: 38 },  // Sanji
    { waitlist_id: 5,  party_size: 2, time_to_departure_min: 130, wait_time_min: 30 },  // Robin
    { waitlist_id: 6,  party_size: 1, time_to_departure_min: 95,  wait_time_min: 25 },  // Chopper
    { waitlist_id: 7,  party_size: 1, time_to_departure_min: 70,  wait_time_min: 20 },  // Franky
    { waitlist_id: 8,  party_size: 1, time_to_departure_min: 110, wait_time_min: 15 },  // Brook
    { waitlist_id: 9,  party_size: 1, time_to_departure_min: 45,  wait_time_min: 35 },  // Jinbe
    { waitlist_id: 10, party_size: 3, time_to_departure_min: 60,  wait_time_min: 12 },  // Usopp
    // Allies & rivals
    { waitlist_id: 11, party_size: 2, time_to_departure_min: 35,  wait_time_min: 48 },  // Law
    { waitlist_id: 12, party_size: 2, time_to_departure_min: 30,  wait_time_min: 44 },  // Kid
    { waitlist_id: 13, party_size: 1, time_to_departure_min: 150, wait_time_min: 8 },   // Shanks
    { waitlist_id: 14, party_size: 2, time_to_departure_min: 25,  wait_time_min: 55 },  // Ace
    { waitlist_id: 15, party_size: 1, time_to_departure_min: 75,  wait_time_min: 18 },  // Sabo
    { waitlist_id: 16, party_size: 4, time_to_departure_min: 180, wait_time_min: 6 },   // Boa Hancock
  ],
  recommended_mode: 'balanced',
};

// Character name mapping — One Piece
export const ONEPIECE_NAMES: Record<number, string> = {
  1: 'Luffy',
  2: 'Zoro',
  3: 'Nami',
  4: 'Sanji',
  5: 'Robin',
  6: 'Chopper',
  7: 'Franky',
  8: 'Brook',
  9: 'Jinbe',
  10: 'Usopp',
  11: 'Law',
  12: 'Kid',
  13: 'Shanks',
  14: 'Ace',
  15: 'Sabo',
  16: 'Boa Hancock',
};

// Notification lookup — One Piece
export const ONEPIECE_NOTIFIED: Record<number, number | null> = {
  1: 10,    // notified 10 mins ago (MAX WAIT imminent)
  2: 15,    // notified 15 mins ago
  3: null,
  4: 5,     // notified 5 mins ago
  5: null,
  6: null,
  7: null,
  8: null,
  9: 10,    // notified 10 mins ago
  10: null,
  11: 15,   // notified 15 mins ago
  12: 5,    // notified 5 mins ago
  13: null,
  14: 10,   // notified 10 mins ago
  15: null,
  16: null,
};

// Flight info for display — One Piece
export const ONEPIECE_FLIGHTS: Record<number, { flight: string; destination: string; dep_time: string; status: string; departure_date: string }> = {
  1:  { flight: 'OP0100', destination: 'LAX', dep_time: '16:38', status: 'Scheduled',  departure_date: '27-Mar-2026' },
  2:  { flight: 'OP0200', destination: 'NRT', dep_time: '16:58', status: 'Scheduled',  departure_date: '27-Mar-2026' },
  3:  { flight: 'OP0300', destination: 'CDG', dep_time: '17:43', status: 'Scheduled',  departure_date: '27-Mar-2026' },
  4:  { flight: 'OP0400', destination: 'CDG', dep_time: '17:13', status: 'Delayed',    departure_date: '27-Mar-2026' },
  5:  { flight: 'OP0500', destination: 'FCO', dep_time: '18:28', status: 'Scheduled',  departure_date: '27-Mar-2026' },
  6:  { flight: 'OP0600', destination: 'HND', dep_time: '17:53', status: 'Scheduled',  departure_date: '27-Mar-2026' },
  7:  { flight: 'OP0700', destination: 'SYD', dep_time: '17:28', status: 'Scheduled',  departure_date: '27-Mar-2026' },
  8:  { flight: 'OP0800', destination: 'LHR', dep_time: '18:08', status: 'Scheduled',  departure_date: '27-Mar-2026' },
  9:  { flight: 'OP0900', destination: 'SIN', dep_time: '17:03', status: 'Scheduled',  departure_date: '27-Mar-2026' },
  10: { flight: 'OP1000', destination: 'JFK', dep_time: '17:18', status: 'Delayed',    departure_date: '27-Mar-2026' },
  11: { flight: 'OP1100', destination: 'ICN', dep_time: '16:53', status: 'Scheduled',  departure_date: '27-Mar-2026' },
  12: { flight: 'OP1200', destination: '???', dep_time: '—',     status: 'Not Found',  departure_date: '27-Mar-2026' },
  13: { flight: 'OP1300', destination: 'DXB', dep_time: '18:48', status: 'Scheduled',  departure_date: '27-Mar-2026' },
  14: { flight: 'OP1400', destination: 'MNL', dep_time: '16:43', status: 'Scheduled',  departure_date: '27-Mar-2026' },
  15: { flight: 'OP1500', destination: 'GRU', dep_time: '17:33', status: 'Scheduled',  departure_date: '27-Mar-2026' },
  16: { flight: 'OP1600', destination: 'BKK', dep_time: '19:18', status: 'Delayed',    departure_date: '27-Mar-2026' },
};

// ============================================================
// ALL SCENARIOS
// ============================================================

export const SCENARIOS: Scenario[] = [
  SCENARIO_MEX22_TOYSTORY,
  SCENARIO_MEX22_DRAGONBALL,
  SCENARIO_ONEPIECE,
  SCENARIO_SPREADSHEET,
];

export function getScenarioById(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}

export function getDefaultScenario(): Scenario {
  return SCENARIO_MEX22_TOYSTORY;
}

// Reference time for each scenario (the "now" used to calculate TTD and wait times)
export const SCENARIO_REFERENCE_TIME: Record<string, { time: string; date: string }> = {
  'spreadsheet-v2':    { time: '16:18', date: '27-Mar-2026' },
  'mex22-toystory':    { time: '16:18', date: '27-Mar-2026' },
  'mex22-dragonball':  { time: '16:18', date: '27-Mar-2026' },
  'onepiece':          { time: '16:18', date: '27-Mar-2026' },
};

export function getCharacterName(scenarioId: string, waitlistId: number): string {
  if (scenarioId === 'mex22-toystory') return TOYSTORY_NAMES[waitlistId] ?? `Group ${waitlistId}`;
  if (scenarioId === 'mex22-dragonball') return DRAGONBALL_NAMES[waitlistId] ?? `Group ${waitlistId}`;
  if (scenarioId === 'onepiece') return ONEPIECE_NAMES[waitlistId] ?? `Group ${waitlistId}`;
  return `Group ${waitlistId}`;
}

// PriModel Simulator - Authentication Config
// Simple hardcoded credentials for demo/simulation access.
// In production, this would use proper auth (Supabase Auth, JWT, etc.)

export const SIMULATOR_AUTH = {
  username: 'waitlist',
  password: 'primodel2026',
} as const;

export function validateCredentials(username: string, password: string): boolean {
  return username === SIMULATOR_AUTH.username && password === SIMULATOR_AUTH.password;
}

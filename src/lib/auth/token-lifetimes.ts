/** Masa berlaku access token (ms) — 24 jam */
export const ACCESS_TOKEN_MS = 24 * 60 * 60 * 1000;

/** Masa berlaku refresh token (ms) — 7 hari */
export const REFRESH_TOKEN_MS = 7 * 24 * 60 * 60 * 1000;

/** Cookie sesi (detik) — sejalan dengan jendela refresh (7 hari) */
export const REFRESH_TOKEN_MAX_AGE_SEC = 7 * 24 * 60 * 60;

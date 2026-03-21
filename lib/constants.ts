/**
 * App-level scheduling and planning defaults (shared with scheduler).
 */

/** Default window when client omits or invalid value is corrected. */
export const DEFAULT_PLANNING_WINDOW_DAYS = 7;

/** Absolute ceiling for hours per day in validation. */
export const MAX_HOURS_PER_DAY_CAP = 12;

/** Minimum planning window in days. */
export const MIN_PLANNING_WINDOW_DAYS = 1;

/** Maximum planning window in days. */
export const MAX_PLANNING_WINDOW_DAYS = 30;

/** Workday window used when placing blocks (local time). */
export const DAY_START_HOUR = 8;
export const DAY_END_HOUR = 22;

/** Largest single focus block when splitting work (hours). */
export const MAX_BLOCK_HOURS = 2;

/** Short break between adjacent scheduled blocks (hours). */
export const BREAK_HOURS = 10 / 60;

/** Minimum chunk size when splitting (hours). */
export const MIN_CHUNK_HOURS = 0.5;

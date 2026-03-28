/**
 * Desired accuracy presets (meters / platform-tuned).
 *
 * @category Config
 */
export const DesiredAccuracy = {
  /**
   * Navigation-level accuracy (e.g., 0-10m).
   */
  Navigation: -2,
  /**
   * High accuracy (e.g., 0-10m).
   */
  High: -1,
  /**
   * Medium accuracy (e.g., 10m).
   */
  Medium: 10,
  /**
   * Low accuracy (e.g., 100m).
   */
  Low: 100,
  /**
   * Very low accuracy (e.g., 1000m).
   */
  VeryLow: 1000,
  /**
   * Lowest accuracy (e.g., 3000m).
   */
  Lowest: 3000
} as const;

/** @internal @hidden */
export type DesiredAccuracy = typeof DesiredAccuracy[keyof typeof DesiredAccuracy];

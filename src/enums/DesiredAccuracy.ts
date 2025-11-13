/** 
 * Desired accuracy presets (meters / platform-tuned). 
 * 
 * @category Config
 */
export const DesiredAccuracy = {
  Navigation: -2,
  High: -1,
  Medium: 10,
  Low: 100,
  VeryLow: 1000,
  Lowest: 3000
} as const;

/** @internal @hidden */
export type DesiredAccuracy = typeof DesiredAccuracy[keyof typeof DesiredAccuracy];

/** 
 * <!-- doc-id: DesiredAccuracy -->
 * Desired accuracy presets (meters / platform-tuned). 
 * 
 * @category Config
 */
export const DesiredAccuracy = {
  /**
   * <!-- doc-id: DesiredAccuracy.Navigation -->
   * Navigation-level accuracy (e.g., 0-10m). 
   */
  Navigation: -2,
  /**
   * <!-- doc-id: DesiredAccuracy.High -->
   * High accuracy (e.g., 0-10m). 
   */
  High: -1,
  /**
   * <!-- doc-id: DesiredAccuracy.Medium -->
   * Medium accuracy (e.g., 10m). 
   */
  Medium: 10,
  /**
   * <!-- doc-id: DesiredAccuracy.Low -->
   * Low accuracy (e.g., 100m). 
   */
  Low: 100,
  /**
   * <!-- doc-id: DesiredAccuracy.VeryLow -->
   * Very low accuracy (e.g., 1000m). 
   */
  VeryLow: 1000,
  /**
   * <!-- doc-id: DesiredAccuracy.Lowest -->
   * Lowest accuracy (e.g., 3000m). 
   */
  Lowest: 3000
} as const;

/** @internal @hidden */
export type DesiredAccuracy = typeof DesiredAccuracy[keyof typeof DesiredAccuracy];

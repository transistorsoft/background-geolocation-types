/**
 * Selects a preset tuning profile for the Kalman filter.
 *
 * **Reserved:** in the current SDK the three profiles apply the same tuning on
 * both iOS and Android, so changing this value has no effect. The value is
 * accepted and stored.
 *
 * If no profile is provided, `defaultProfile` is applied.
 *
 * @category Config
 */
export const KalmanProfile = {
  /**
   * The SDK's Kalman tuning.
   */
  Default: 0,
  /**
   * Reserved. Currently applies the same tuning as `Default`.
   */
  Aggressive: 1,  
  /**
   * Reserved. Currently applies the same tuning as `Default`.
   */
  Conservative: 2
} as const;

/** @internal @hidden */
export type KalmanProfile = (typeof KalmanProfile)[keyof typeof KalmanProfile];
/**
 * Specifies the preset tuning profile for the Kalman filter used in location
 * denoising.
 *
 * Each profile adjusts the Kalman filter’s process and measurement noise
 * parameters, trading off between responsiveness and smoothness:
 *
 * | Profile              | Behavior                                                            |
 * |----------------------|---------------------------------------------------------------------|
 * | `defaultProfile`     | **Balanced** — General-purpose; suitable for most movement types.   |
 * | `aggressive`         | **Aggressive** — Fast response; minimal smoothing.                   |
 * | `conservative`       | **Conservative** — Maximum smoothing; slowest response to changes.  |
 *
 * - If no profile is provided, `defaultProfile` is applied.
 * - Use `aggressive` for fast-changing activities requiring rapid updates.
 * - Use `conservative` when stability and track smoothness are more important
 *   than immediate responsiveness.
 *
 * This maps directly to native Kalman tuning implementations on both Android and iOS.
 *
 * @category Config
 */
export const KalmanProfile = {
  /**
   * **Balanced** — General-purpose; suitable for most movement types.
   */
  Default: 0,
  /**
   * **Aggressive** — Fast response; minimal smoothing.
   */
  Aggressive: 1,  
  /**
   * **Conservative** — Maximum smoothing; slowest response to changes.
   */
  Conservative: 2
} as const;

/** @internal @hidden */
export type KalmanProfile = (typeof KalmanProfile)[keyof typeof KalmanProfile];
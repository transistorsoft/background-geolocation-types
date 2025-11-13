import { LocationFilterPolicy } from '../../enums/LocationFilterPolicy';
import { KalmanProfile } from '../../enums/KalmanProfile';

/**
 * Defines how raw GPS samples are filtered, denoised, and smoothed before being
 * recorded or used for odometer calculations.
 *
 * `LocationFilter` is supplied via {@link GeoConfig.filter} and provides
 * fine-grained control over how the SDK handles noisy or inconsistent
 * location data from the underlying platform.
 *
 * **Overview**
 *
 * The native platform continuously produces raw `CLLocation` (iOS) or
 * `Location` (Android) samples. The `LocationFilter` applies:
 *
 * - Kalman filtering  
 * - rolling-window averaging  
 * - speed, distance, and accuracy constraints  
 *
 * These produce smoother paths, reduce jitter, and improve odometer stability.
 *
 * @example
 * ```ts
 * BackgroundGeolocation.ready({
 *   geolocation: {
 *     filter: {
 *       policy: LocationFilterPolicy.Adjust,
 *       useKalman: true,
 *       kalmanProfile: KalmanProfile.Default,
 *       trackingAccuracyThreshold: 100,
 *       odometerAccuracyThreshold: 20
 *     }
 *   }
 * });
 * ```
 *
 * **Filtering Flow**
 *
 * ![](https://dl.dropbox.com/scl/fi/71rkzdo2tr3qm651ulou8/location-filter-flowchart.svg?rlkey=16zxs3lnqvlrw137974jbsoj7&dl=1)
 *
 * **Parameters**
 *
 * | Field | Description |
 * |-------|-------------|
 * | **{@link policy}** | Selects which filtering policy to apply. See {@link LocationFilterPolicy}. |
 * | **{@link useKalman}** | Enables Kalman filtering of speed and position (default: `true`). |
 * | **{@link kalmanDebug}** | Enables verbose Kalman diagnostic logs. |
 * | **{@link kalmanProfile}** | Selects a Kalman tuning profile (see {@link KalmanProfile}). |
 * | **{@link rollingWindow}** | Number of samples for rolling burst averaging. Larger values increase smoothness but reduce responsiveness. |
 * | **{@link burstWindow}** | Duration of each averaging burst (seconds). Default: `10`. |
 * | **{@link maxBurstDistance}** | Maximum distance (meters) for samples to be included in the same burst window. Default: `300`. |
 * | **{@link trackingAccuracyThreshold}** | Minimum GPS horizontal accuracy (meters) required to accept a location. Default: `100`. |
 * | **{@link maxImpliedSpeed}** | Maximum implied speed (m/s) before rejecting a sample as unrealistic. Default: `60` (~216 km/h). |
 * | **{@link filterDebug}** | Enables verbose logging of filter decisions (`ACCEPTED`, `REJECTED`, etc). |
 * | **{@link odometerUseKalmanFilter}** | Applies Kalman smoothing to odometer calculations. |
 * | **{@link odometerAccuracyThreshold}** | Maximum accuracy (meters) allowed for a sample to affect the odometer. Default: `100`. |
 *
 * **Notes**
 *
 * - Distances are in **meters**.  
 * - Time fields are in **milliseconds** unless otherwise specified.  
 * - Filtering affects **recorded** locations only; it does *not* influence real-time motion detection.
 *
 * **Disable all filtering**
 *
 * @example
 * ```ts
 * BackgroundGeolocation.ready({
 *   geolocation: {
 *     filter: {
 *       policy: LocationFilterPolicy.PassThrough,
 *       useKalman: false
 *     }
 *   }
 * });
 * ```
 * @category Config
 */
export interface LocationFilter {
  /**
   * Defines the filtering policy applied to incoming raw GPS samples before they
   * are accepted, averaged, or rejected by the {@link LocationFilter}.
   *
   * The filtering policy determines how aggressively the plugin removes noisy,
   * inaccurate, or redundant location updates. It represents the *first stage*
   * in the SDK’s data-quality pipeline — before Kalman smoothing, burst averaging,
   * or other denoising steps are applied.
   *
   * Choosing the correct policy depends on your app’s tolerance for jitter versus
   * responsiveness:
   *
   * - Fitness or vehicle-tracking apps often prefer stronger filtering.
   * - Survey or scientific apps may prefer capturing unmodified raw samples.
   *
   * **Profiles**
   *
   * | Policy | Description | Use Case |
   * |--------|-------------|----------|
   * | {@link LocationFilterPolicy.PassThrough} | **No filtering.** Every received sample is recorded, even if noisy or identical to the previous one. | Debugging, diagnostics, scenarios requiring raw data. |
   * | {@link LocationFilterPolicy.Adjust} | **Balanced filtering.** Smooths and rejects only clearly invalid samples. *(Default)* | Most use cases — walking, cycling, automotive tracking. |
   * | {@link LocationFilterPolicy.Conservative} | **Strict filtering.** Strongly smooths data and rejects high-variance samples, prioritizing stability over responsiveness. | Analytics, long-term background logging, noise-sensitive applications. |
   *
   * **Notes**
   *
   * - This policy affects only the SDK’s *internal* filtering pipeline.
   *   It does **not** modify the raw values returned to {@link BackgroundGeolocation.onLocation}.
   * - For more granular tuning, see {@link LocationFilter.trackingAccuracyThreshold},
   *   {@link LocationFilter.maxImpliedSpeed}, and other {@link LocationFilter} fields.
   *
   * **Examples**
   *
   * Balanced default filtering:
   *
   * ```ts
   * BackgroundGeolocation.ready({
   *   geolocation: {
   *     filter: {
   *       policy: LocationFilterPolicy.Adjust
   *     }
   *   }
   * });
   * ```
   *
   * No filtering — capture all raw locations:
   *
   * ```ts
   * BackgroundGeolocation.ready({
   *   geolocation: {
   *     filter: {
   *       policy: LocationFilterPolicy.PassThrough
   *     }
   *   }
   * });
   * ```
   *
   * Maximum smoothing for analytics:
   *
   * ```ts
   * BackgroundGeolocation.ready({
   *   geolocation: {
   *     filter: {
   *       policy: LocationFilterPolicy.Conservative
   *     }
   *   }
   * });
   * ```
   *
   * **See also**
   * - {@link GeoConfig.filter}
   * - {@link LocationFilter}
   * - {@link KalmanProfile}
   */
  policy?: LocationFilterPolicy;

  /**
   * Enables the Kalman filter to smooth incoming location speed and position.
   *
   * When `true`, the SDK applies a Kalman filter to reduce noise and stabilize
   * velocity and distance calculations. Defaults to `true`.
   */
  useKalman?: boolean;

  /**
   * Enables verbose Kalman debug output in logs.
   *
   * When `true`, the SDK logs additional diagnostic data about the Kalman
   * filter’s internal state (for example, variance and innovation) for
   * each incoming sample.
   */
  kalmanDebug?: boolean;

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
   */
  kalmanProfile?: KalmanProfile;

  /**
   * Number of samples in the rolling window used for burst averaging.
   *
   * Higher values produce smoother averaged locations but introduce greater
   * latency in responsiveness to movement.  
   * 
   * **Default:** `5`.
   */
  rollingWindow?: number;

  /**
   * Duration (in seconds) of each burst window used for averaging samples.
   *
   * The plugin groups all locations received within this time window into a
   * single averaged output sample.
   *
   * **Default:** `10` seconds.
   */
  burstWindow?: number;

  /**
   * Maximum distance (in meters) between samples considered part of the same burst.
   *
   * Prevents the filter from merging location samples that are too far apart into
   * a single averaged point.  
   * 
   * **Default:** `300` meters.
   */
  maxBurstDistance?: number;

  /**
   * Minimum acceptable horizontal accuracy (in meters) for a sample to qualify
   * for tracking.
   *
   * Locations with an accuracy value **greater (worse)** than this threshold
   * are discarded and will not be used in path or odometer calculations.  
   *
   * **Default:** `100` meters.
   */
  trackingAccuracyThreshold?: number;

  /**
 * Maximum implied speed (in meters/second) permitted before a location
 * sample is rejected.
 *
 * If a raw sample implies a speed **greater than this threshold**, it is
 * considered an unrealistic outlier and will be discarded by the filter.
 *
 * **Default:** `60` m/s (≈ 216 km/h).
 */
  maxImpliedSpeed?: number;

  /**
   * Enables verbose debug logging for the filtering engine.
   *
   * When `true`, the SDK logs detailed decisions for each incoming sample,
   * including whether it was **ACCEPTED**, **REJECTED**, or **IGNORED** by the
   * filtering pipeline.
   */
  filterDebug?: boolean;

  /**
   * Applies a Kalman filter **only to odometer calculations**, independent of
   * {@link LocationFilter.useKalman}.
   *
   * When `true`, the odometer’s internal distance-accumulation logic applies a
   * Kalman filter to smooth incoming samples, reducing jitter and noise **without**
   * modifying the recorded track points.  
   *
   * This is useful when you want smoother odometer readings while preserving
   * the raw location stream for mapping, analysis, or debugging.
   *
   * If both {@link LocationFilter.useKalman} and
   * {@link LocationFilter.odometerUseKalmanFilter} are `true`, the SDK maintains
   * **independent Kalman filter instances** for tracking and odometer calculations.
   *
   * Default: `true`.
   */
  odometerUseKalmanFilter?: boolean;

  /**
   * Maximum horizontal accuracy (in meters) allowed for a sample to affect the odometer.
   *
   * Any location whose `accuracy` exceeds this threshold is **ignored** for
   * odometer updates.  
   *
   * Default: `20`.
   */
  odometerAccuracyThreshold?: number;
}
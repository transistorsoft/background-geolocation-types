import { LocationFilterPolicy } from '../../enums/LocationFilterPolicy';
import { KalmanProfile } from '../../enums/KalmanProfile';

/**
 * Filters, denoises, and smooths raw GPS samples before they are recorded or
 * used for odometer calculations.
 *
 * `LocationFilter` is supplied via {@link GeoConfig.filter} and provides
 * fine-grained control over how the SDK handles noisy or inconsistent location
 * data from the underlying platform.
 *
 * ## Contents
 * - [Overview](#overview)
 * - [Examples](#examples)
 *
 * ---
 *
 * ## Overview
 *
 * The SDK applies several processing stages to each raw GPS sample before
 * recording it: Kalman filtering, rolling-window burst averaging, and
 * speed/distance/accuracy constraints. These produce smoother paths, reduce
 * jitter, and improve odometer stability.
 *
 * ![](https://dl.dropbox.com/scl/fi/71rkzdo2tr3qm651ulou8/location-filter-flowchart.svg?rlkey=16zxs3lnqvlrw137974jbsoj7&dl=1)
 *
 * | Field | Description |
 * |-------|-------------|
 * | {@link policy} | Selects which filtering policy to apply. See {@link LocationFilterPolicy}. |
 * | {@link useKalman} | Enables Kalman filtering of speed and position (default: `true`). |
 * | {@link kalmanDebug} | Enables verbose Kalman diagnostic logs (default: `false`). |
 * | {@link kalmanProfile} | Selects a Kalman tuning profile (see {@link KalmanProfile}). |
 * | {@link rollingWindow} | Number of samples for rolling burst averaging. Larger values increase smoothness but reduce responsiveness. Default: `5`. |
 * | {@link burstWindow} | Duration of each averaging burst (seconds). Default: `10`. |
 * | {@link maxBurstDistance} | Maximum distance (meters) for samples included in the same burst window. Default: `300`. |
 * | {@link trackingAccuracyThreshold} | Maximum GPS horizontal accuracy (meters) required to accept a location. Default: `100`. |
 * | {@link maxImpliedSpeed} | Maximum implied speed (m/s) before rejecting a sample as unrealistic. Default: `60` (≈ 216 km/h). |
 * | {@link filterDebug} | Enables verbose logging of filter decisions (default: `false`). |
 * | {@link odometerUseKalmanFilter} | Applies Kalman smoothing to odometer calculations (default: `true`). |
 * | {@link odometerAccuracyThreshold} | Maximum accuracy (meters) allowed for a sample to affect the odometer. Default: `20`. |
 * | {@link odometerPolicy} | Filtering policy for odometer samples — use `Conservative` to reject GPS teleports entirely. Default: `Adjust`. |
 *
 * - Distances are in **meters**.
 * - Time fields are in **seconds** unless noted otherwise.
 * - Filtering affects **recorded** locations only — it does not influence real-time motion detection.
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
 * ---
 *
 * ## Examples
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
 *
 * @category Config
 */
export interface LocationFilter {
  /**
   * Selects the filtering policy applied to incoming raw GPS samples before they
   * are accepted, averaged, or rejected. Defaults to
   * `LocationFilterPolicy.Conservative`.
   *
   * The filtering policy determines how aggressively the SDK removes noisy,
   * inaccurate, or redundant location updates. It is the first stage in the
   * data-quality pipeline — before Kalman smoothing, burst averaging, or other
   * denoising steps are applied.
   *
   * | Policy | Description | Use case |
   * |--------|-------------|----------|
   * | {@link LocationFilterPolicy.PassThrough} | **No filtering.** Every received sample is recorded, even if noisy or identical to the previous one. | Debugging, diagnostics, scenarios requiring raw data. |
   * | {@link LocationFilterPolicy.Adjust} | **Balanced filtering.** Smooths and caps only clearly invalid samples. | Most use cases — walking, cycling, automotive tracking. |
   * | {@link LocationFilterPolicy.Conservative} | **Strict filtering.** Strongly smooths data and rejects high-variance samples, prioritizing stability over responsiveness. *(Default)* | Analytics, long-term background logging, noise-sensitive applications. |
   *
   * Choosing the correct policy depends on your app's tolerance for jitter versus
   * responsiveness:
   * - Fitness or vehicle-tracking apps often prefer `Adjust` for lower latency.
   * - Survey or analytics apps may prefer `Conservative` for maximum stability,
   *   or `PassThrough` to capture unmodified raw samples.
   *
   * ## Note
   * This policy affects only the SDK's internal filtering pipeline. It does
   * **not** modify the raw values returned to {@link BackgroundGeolocation.onLocation}.
   * For more granular tuning, see {@link LocationFilter.trackingAccuracyThreshold},
   * {@link LocationFilter.maxImpliedSpeed}, and other {@link LocationFilter} fields.
   *
   * **See also**
   * - {@link GeoConfig.filter}
   * - {@link LocationFilter}
   * - {@link KalmanProfile}
   *
   * @example Balanced default filtering
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
   * @example No filtering — capture all raw locations:
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
   * @example Maximum smoothing for analytics:
   * ```ts
   * BackgroundGeolocation.ready({
   *   geolocation: {
   *     filter: {
   *       policy: LocationFilterPolicy.Conservative
   *     }
   *   }
   * });
   * ```
   */
  policy?: LocationFilterPolicy;

  /**
   * Enables the Kalman filter to smooth incoming location speed and position.
   * Defaults to `true`.
   *
   * When enabled, the SDK applies a Kalman filter to reduce noise and stabilize
   * velocity and distance calculations.
   */
  useKalman?: boolean;

  /**
   * Enables verbose Kalman debug output in logs. Defaults to `false`.
   *
   * When enabled, the SDK logs additional diagnostic data about the Kalman
   * filter's internal state (for example, variance and innovation) for each
   * incoming sample.
   */
  kalmanDebug?: boolean;

  /**
   * Selects the preset tuning profile for the Kalman filter. Defaults to
   * `KalmanProfile.Default`.
   *
   * Each profile adjusts the Kalman filter's process and measurement noise
   * parameters, trading off between responsiveness and smoothness:
   *
   * | Profile | Behaviour |
   * |---------|-----------|
   * | `defaultProfile` | **Balanced** — General-purpose; suitable for most movement types. |
   * | `aggressive` | **Aggressive** — Fast response; minimal smoothing. |
   * | `conservative` | **Conservative** — Maximum smoothing; slowest response to changes. |
   *
   * Use `aggressive` for fast-changing activities requiring rapid updates. Use
   * `conservative` when stability and track smoothness are more important than
   * immediate responsiveness.
   */
  kalmanProfile?: KalmanProfile;

  /**
   * Number of samples in the rolling window used for burst averaging. Defaults
   * to `5`. Valid range: 3–20.
   *
   * Higher values produce smoother averaged locations but introduce greater
   * latency in responsiveness to movement.
   */
  rollingWindow?: number;

  /**
   * Duration in seconds of each burst window used for averaging samples.
   * Defaults to `10` seconds. Valid range: 0.2–120.
   *
   * The SDK groups all locations received within this time window into a single
   * averaged output sample.
   */
  burstWindow?: number;

  /**
   * Maximum distance in meters between samples considered part of the same burst.
   * Defaults to `300` meters. Valid range: 5–2000.
   *
   * Prevents the filter from merging location samples that are too far apart
   * into a single averaged point. Works alongside `maxImpliedSpeed` — whichever
   * flags a sample first applies.
   */
  maxBurstDistance?: number;

  /**
   * Maximum acceptable horizontal accuracy in meters for a sample to qualify
   * for tracking. Defaults to `100` meters. Valid range: 0–500.
   *
   * Locations with an accuracy value greater (worse) than this threshold are
   * discarded and not used in path or odometer calculations.
   */
  trackingAccuracyThreshold?: number;

  /**
   * Maximum implied speed in meters/second permitted before a location sample
   * is rejected. Defaults to `60` m/s (≈ 216 km/h). Valid range: 1–200.
   *
   * If a raw sample implies a speed greater than this threshold — calculated as
   * distance divided by elapsed time between samples — it is treated as an
   * unrealistic outlier and discarded by the filter.
   */
  maxImpliedSpeed?: number;

  /**
   * Enables verbose debug logging for the filtering engine. Defaults to `false`.
   *
   * When enabled, the SDK logs detailed decisions for each incoming sample,
   * including whether it was **ACCEPTED**, **REJECTED**, or **IGNORED** by the
   * filtering pipeline.
   */
  filterDebug?: boolean;

  /**
   * Applies a Kalman filter to odometer calculations, independent of
   * {@link LocationFilter.useKalman}. Defaults to `true`.
   *
   * When enabled, the odometer's internal distance-accumulation logic applies a
   * Kalman filter to smooth incoming samples, reducing jitter and noise without
   * modifying the recorded track points.
   *
   * This is useful when smoother odometer readings are needed while preserving
   * the raw location stream for mapping, analysis, or debugging.
   *
   * If both {@link LocationFilter.useKalman} and
   * {@link LocationFilter.odometerUseKalmanFilter} are `true`, the SDK maintains
   * independent Kalman filter instances for tracking and odometer calculations.
   */
  odometerUseKalmanFilter?: boolean;

  /**
   * Maximum horizontal accuracy in meters allowed for a sample to affect the
   * odometer. Defaults to `20` meters. Valid range: 0–500.
   *
   * Any location whose accuracy exceeds this threshold is ignored for odometer
   * updates.
   */
  odometerAccuracyThreshold?: number;

  /**
   * Selects the filtering policy applied to odometer-relevant location samples.
   * Defaults to `LocationFilterPolicy.Adjust`.
   *
   * This property controls how the odometer handles anomalous GPS samples
   * (teleports, unrealistic speed jumps) independently of the tracking
   * {@link LocationFilter.policy}.
   *
   * | Policy | Odometer behavior |
   * |--------|-------------------|
   * | {@link LocationFilterPolicy.PassThrough} | No filtering — every sample contributes to the odometer. |
   * | {@link LocationFilterPolicy.Adjust} | Anomalous samples are capped (kinematic/accuracy limits) but still accumulated. *(Default)* |
   * | {@link LocationFilterPolicy.Conservative} | Anomalous samples are **rejected entirely** — zero phantom distance from GPS teleports. |
   *
   * ### ⚠️ Warning
   *
   * On devices with poor GPS behavior (certain chipsets, indoor/urban-canyon
   * conditions), the default `Adjust` policy can accumulate significant phantom
   * distance from repeatedly capped anomalies. If distance integrity is more
   * important than capturing every meter of movement, use `Conservative`.
   *
   * @example Distance-integrity configuration for fleet/field-sales tracking:
   * ```ts
   * BackgroundGeolocation.ready({
   *   geolocation: {
   *     filter: {
   *       odometerPolicy: LocationFilterPolicy.Conservative,
   *       odometerAccuracyThreshold: 25,
   *       maxImpliedSpeed: 28
   *     }
   *   }
   * });
   * ```
   */
  odometerPolicy?: LocationFilterPolicy;
}

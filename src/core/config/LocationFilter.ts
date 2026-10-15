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
 * - [Policy scope](#policy-scope)
 * - [Examples](#examples)
 *
 * ---
 *
 * ## Overview
 *
 * The SDK applies several processing stages to each raw GPS sample before
 * recording it: an accuracy gate, rolling-window burst detection, and speed
 * and distance constraints; the odometer runs its own position filter on the
 * samples that pass. Coordinates are never modified.
 *
 * ![](https://dl.dropbox.com/scl/fi/71rkzdo2tr3qm651ulou8/location-filter-flowchart.svg?rlkey=16zxs3lnqvlrw137974jbsoj7&dl=1)
 *
 * | Field | Description |
 * |-------|-------------|
 * | {@link policy} | Selects which filtering policy to apply. See {@link LocationFilterPolicy}. |
 * | {@link useKalman} | Has no effect on delivered locations (default: `true`). |
 * | {@link kalmanDebug} | Logs the odometer filter's values for each location (default: `false`). |
 * | {@link kalmanProfile} | Selects how strongly the odometer smooths the path at slow speeds (see {@link KalmanProfile}). |
 * | {@link rollingWindow} | Number of samples for rolling burst averaging. Larger values increase smoothness but reduce responsiveness. Default: `5`. |
 * | {@link burstWindow} | Duration of each averaging burst (seconds). Default: `10`. |
 * | {@link maxBurstDistance} | Maximum distance (meters) for samples included in the same burst window. Default: `300`. |
 * | {@link trackingAccuracyThreshold} | Maximum GPS horizontal accuracy (meters) required to accept a location. Default: `100`. |
 * | {@link maxImpliedSpeed} | Maximum implied speed (m/s) before rejecting a sample as unrealistic. Default: `60` (≈ 216 km/h). |
 * | {@link filterDebug} | Enables verbose logging of filter decisions (default: `false`). |
 * | {@link odometerUseKalmanFilter} | Switches the odometer's position filter (default: `true`). |
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
 * ## Policy scope
 *
 * {@link policy} controls only the **decision phase** — how the filter responds
 * to a sample *after* its motion metrics are computed. Several fields apply
 * regardless of the chosen policy:
 *
 * | Field | Governed by `policy`? | Behaviour |
 * |-------|:---------------------:|-----------|
 * | {@link trackingAccuracyThreshold} | No | Accuracy gate. A fix whose accuracy is worse than this is **rejected before** the policy runs — under *every* policy, including `PassThrough`. Set to `0` to disable the gate. |
 * | {@link useKalman}, {@link kalmanProfile} | — | Neither affects the tracking `policy`: `useKalman` has no effect on delivered locations, and `kalmanProfile` governs the odometer's filter. |
 * | {@link maxBurstDistance}, {@link burstWindow} | Yes | Define a GPS "spike" (a large jump in a short window). `Conservative` rejects it, `Adjust` caps it, `PassThrough` lets it through. |
 * | {@link maxImpliedSpeed} | Partly | Flags an implausible-speed spike (rejected only under `Conservative`), and also applies a final per-step speed clamp under *every* policy. |
 * | {@link rollingWindow} | Yes | Feeds the kinematic / outlier cap used by `Adjust` and `Conservative`; `PassThrough` ignores it. |
 * | {@link odometerPolicy}, {@link odometerAccuracyThreshold}, {@link odometerUseKalmanFilter} | — | Govern the separate **odometer** filter, not the tracking `policy`. |
 *
 * Each policy differs only in how it treats anomalous or over-distance steps:
 *
 * - **`PassThrough`** — accept the sample as-is; no capping, no anomaly rejection.
 * - **`Adjust`** — cap the step (to {@link GeoConfig.distanceFilter} or the
 *   kinematic limit); never rejects.
 * - **`Conservative`** — reject implausible-speed or outlier steps; otherwise cap.
 *
 * ### ⚠️ Warning
 *
 * `PassThrough` does **not** disable {@link trackingAccuracyThreshold}. To record
 * every sample untouched, set `policy: PassThrough` **and**
 * `trackingAccuracyThreshold: 0` — otherwise low-accuracy fixes are still rejected
 * (and delivered to {@link BackgroundGeolocation.onLocationFilter}).
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
   * data-quality pipeline — before burst averaging or other
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
   * @example Balanced filtering
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
   * Has no effect on delivered locations. Defaults to `true`.
   *
   * The SDK records and delivers every accepted location with its original
   * coordinates. This flag switches a smoothing stage on the tracking path whose
   * output changes neither the locations the SDK records nor the filter's
   * decisions; it is kept so existing configurations stay valid. The odometer's
   * own filter is switched by `odometerUseKalmanFilter`.
   */
  useKalman?: boolean;

  /**
   * Logs the odometer filter's values for each location. Defaults to `false`.
   *
   * When enabled, each location the odometer sees adds one line to the SDK log at
   * the `Debug` level: the filter's status, the distance added, the profile and
   * gain in force, the speed that set the gain, the prediction and update terms,
   * the distance to the anchor and the hold radius, and the filtered position's
   * own accuracy. Keep it off in production: it is one line per location.
   */
  kalmanDebug?: boolean;

  /**
   * Selects how strongly the odometer smooths the path while the device moves
   * slowly. Defaults to `KalmanProfile.Default`.
   *
   * The odometer integrates a filtered position rather than the raw fixes. The
   * profile sets how closely that position follows each fix: `Aggressive` follows
   * the fixes most, `Conservative` smooths most and cuts the most corners,
   * `Default` sits between.
   *
   * - At riding and driving speed the three profiles agree. They differ at walking
   *   pace, between about 1 and 3 m/s, mostly with `distanceFilter: 0`, where every
   *   fix reaches the odometer. Below about 1 m/s the SDK's stationary detection
   *   decides and the three read the same.
   * - `Conservative` can read 20 to 50 % short on short back-and-forth paths such
   *   as store aisles and corridors.
   * - How much a profile smooths depends on the accuracy each device reports, so
   *   the same profile smooths two devices differently.
   * - When parked, the profiles do not differ in the expected order:
   *   `Conservative` can add the most distance at a stop.
   * - When the device reports no speed, the three read the same, and
   *   back-and-forth movement within a few tens of meters (about 45 m at a
   *   reported accuracy of 10 m) is not counted.
   * - Under the default `distanceFilter` the difference between profiles is a
   *   fraction of a percent.
   *
   * The profile applies only to the odometer. It changes neither which locations
   * are recorded nor their coordinates.
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
   *
   * `0` means no accuracy limit: no location is discarded for its accuracy.
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
   * Switches the odometer's position filter. Defaults to `true`.
   *
   * `true`: the odometer integrates filtered positions. Every fix the tracking
   * filter accepts goes through a position filter whose gain follows the fix's own
   * speed, selected by `kalmanProfile`, and the odometer adds the distance between
   * the positions it last added to. `false`: the odometer integrates the fixes
   * themselves, with the same accuracy gate, gaps and stops.
   *
   * Neither setting changes the recorded locations, and neither reproduces the
   * odometer of earlier versions. {@link LocationFilter.useKalman} is independent
   * of this flag and has no effect on delivered locations.
   */
  odometerUseKalmanFilter?: boolean;

  /**
   * Maximum horizontal accuracy in meters allowed for a sample to affect the
   * odometer. Defaults to `20` meters. Valid range: 0–500.
   *
   * Any location whose accuracy exceeds this threshold is ignored for odometer
   * updates.
   *
   * `0` means no accuracy limit: no location is ignored for its accuracy.
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

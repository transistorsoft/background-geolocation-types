/**
 * <!-- doc-id: LocationFilterPolicy -->
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
 * @example No filtering — capture all raw locations
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
 * @example Maximum smoothing for analytics
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
 * 
 * @category Config
 */
export const LocationFilterPolicy = {
  /** 
   * <!-- doc-id: LocationFilterPolicy.PassThrough -->
   * No filtering — accept all samples. Useful for debugging.
   */ 
  PassThrough: 0,

  /**
   * <!-- doc-id: LocationFilterPolicy.Adjust -->
   * Balanced (default) — applies moderate filtering to reject noisy samples.
   *
   * Dynamically adjusts acceptance thresholds for incoming samples, but **never**
   * alters the raw latitude/longitude coordinates.
   *
   * When using {@link LocationFilterPolicy.Adjust} (the default), the SDK computes
   * motion metrics such as:
   *
   * - distance deltas  
   * - implied speed  
   * - accuracy variance  
   * - heading stability  
   *
   * It then applies adaptive gating rules to decide whether each sample should be:
   *
   * - accepted  
   * - ignored  
   * - rejected as noise  
   *
   * **Coordinates are never modified.** This policy adjusts *which* samples are
   * included, not *how* they are positioned.
   *
   * If {@link LocationFilter.useKalman} is enabled, additional smoothing may occur,
   * but the physical coordinates of each accepted sample remain untouched.
   */
  Adjust: 1,

  /** 
   * <!-- doc-id: LocationFilterPolicy.Conservative -->
   * Aggressive — filters heavily, preferring stability over responsiveness. 
   * */ 
  Conservative: 2
} as const;

/** @internal @hidden */
export type LocationFilterPolicy =
  (typeof LocationFilterPolicy)[keyof typeof LocationFilterPolicy];